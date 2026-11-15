import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { SaaSHero } from './components/SaaSHero';
import { SaaSFeatures } from './components/SaaSFeatures';
import { SaaSFaq } from './components/SaaSFaq';
import { SaaSFooter } from './components/SaaSFooter';
import { BatchDropzone } from './components/BatchDropzone';
import { BatchControls } from './components/BatchControls';
import { ImagePreviewList } from './components/ImagePreviewList';
import { ResultModal } from './components/ResultModal';
import { ModelSelectorModal } from './components/ModelSelectorModal';
import { ExportModal } from './components/ExportModal';
import { ProcessedImage, AppSettings, GeminiModelInfo } from './types';
import { translations } from './i18n/translations';
import { optimizeImageForOcr } from './utils/imageProcessor';
import {
  discoverLatestGeminiModels,
  extractTextAndEmojisFromImage,
  analyzeExtractedText,
  isLegacyOrInvalidModel,
  DEFAULT_GEMINI_MODELS
} from './services/geminiService';
import { ClipboardPaste, AlertTriangle, X } from 'lucide-react';

const STORAGE_KEY_SETTINGS = 'omniscribe_settings_v6';

function safeStorageGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeStorageSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Ignore storage quota or private-mode restrictions
  }
}

function safeStorageRemove(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore private-mode storage restrictions
  }
}

export const App: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const savedV6 = safeStorageGet(STORAGE_KEY_SETTINGS);
    const savedV5 = safeStorageGet('omniscribe_settings_v5');
    safeStorageRemove('omniscribe_settings_v3');
    safeStorageRemove('omniscribe_settings_v4');

    const raw = savedV6 || savedV5;
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object') {
          throw new Error('Invalid persisted settings');
        }
        const validLang = parsed.language === 'en' || parsed.language === 'ru' || parsed.language === 'ar'
          ? parsed.language
          : 'en';
        const apiKey = typeof parsed.apiKey === 'string' ? parsed.apiKey : '';
        const selectedModel =
          apiKey.trim().length > 0 &&
          typeof parsed.selectedModel === 'string' &&
          !isLegacyOrInvalidModel(parsed.selectedModel)
            ? parsed.selectedModel
            : '';

        return {
          apiKey,
          selectedModel,
          autoDetectModel: typeof parsed.autoDetectModel === 'boolean' ? parsed.autoDetectModel : true,
          temperature: typeof parsed.temperature === 'number' ? parsed.temperature : 0.1,
          language: validLang,
          darkMode: typeof parsed.darkMode === 'boolean' ? parsed.darkMode : true,
          preserveFormatting:
            typeof parsed.preserveFormatting === 'boolean' ? parsed.preserveFormatting : true,
          extractEmojis: typeof parsed.extractEmojis === 'boolean' ? parsed.extractEmojis : true
        };
      } catch {
        // fallback to defaults
      }
    }
    return {
      apiKey: '',
      selectedModel: '',
      autoDetectModel: true,
      temperature: 0.1,
      language: 'en',
      darkMode: true,
      preserveFormatting: true,
      extractEmojis: true
    };
  });

  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [availableModels, setAvailableModels] = useState<GeminiModelInfo[]>([]);
  const [isDetectingModel, setIsDetectingModel] = useState(false);

  // Live refs to avoid stale React closures during sequential batch extraction
  const activeModelRef = useRef<string>(settings.selectedModel || '');
  const liveModelsRef = useRef<string[]>([]);
  const imagesRef = useRef<ProcessedImage[]>([]);
  const settingsRef = useRef<AppSettings>(settings);
  const discoveryRequestRef = useRef<number>(0);

  const [isProcessingBatch, setIsProcessingBatch] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [isModelModalOpen, setIsModelModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [pasteToast, setPasteToast] = useState(false);
  const [quotaAlert, setQuotaAlert] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const pasteToastTimerRef = useRef<number | null>(null);
  const t = translations[settings.language];
  const selectedImageForResult = images.find((img) => img.id === selectedImageId) ?? null;

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    settingsRef.current = settings;
    activeModelRef.current = settings.selectedModel || '';
  }, [settings]);

  // Release any remaining blob URLs and timers on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      if (pasteToastTimerRef.current !== null) {
        window.clearTimeout(pasteToastTimerRef.current);
      }
      imagesRef.current.forEach((img) => {
        if (img.previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(img.previewUrl);
        }
      });
    };
  }, []);

  // Persist settings & sync theme/dir
  useEffect(() => {
    safeStorageSet(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    document.documentElement.dir = settings.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = settings.language;
  }, [settings]);

  // Initial Auto-Discovery of Gemini Models on mount
  useEffect(() => {
    if (settings.apiKey && settings.apiKey.trim().length > 10) {
      performAutoDiscovery(settings.apiKey);
    }
  }, []);

  // Global Clipboard Image Paste Handler (Ctrl+V)
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      const newFiles: File[] = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file && file.size > 0) newFiles.push(file);
        }
      }

      const availableSlots = Math.max(0, 20 - imagesRef.current.length);
      if (newFiles.length > 0 && availableSlots > 0) {
        const acceptedFiles = newFiles.slice(0, availableSlots);
        const timeTag = new Date().toISOString().slice(11, 19).replace(/:/g, '');
        const settled = await Promise.allSettled(
          acceptedFiles.map(async (file, idx): Promise<ProcessedImage> => {
            const base64 = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = () => reject(reader.error || new Error('Clipboard image read failed'));
              reader.readAsDataURL(file);
            });
            const extMatch = file.type.match(/^image\/([a-zA-Z0-9]+)/);
            const ext = extMatch ? extMatch[1].replace('jpeg', 'jpg') : 'png';
            const suffix = acceptedFiles.length > 1 ? `_${idx + 1}` : '';
            return {
              id: `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
              file,
              name: `clipboard_capture_${timeTag}${suffix}.${ext}`,
              size: file.size,
              previewUrl: URL.createObjectURL(file),
              base64,
              mimeType: file.type || 'image/png',
              status: 'idle',
              extractedText: '',
              timestamp: Date.now()
            };
          })
        );

        const newImages = settled
          .filter((item): item is PromiseFulfilledResult<ProcessedImage> => item.status === 'fulfilled')
          .map((item) => item.value);

        if (newImages.length > 0) {
          handleAddImages(newImages);
          setPasteToast(true);
          if (pasteToastTimerRef.current !== null) {
            window.clearTimeout(pasteToastTimerRef.current);
          }
          pasteToastTimerRef.current = window.setTimeout(() => {
            setPasteToast(false);
            pasteToastTimerRef.current = null;
          }, 2500);
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const performAutoDiscovery = async (apiKey: string) => {
    if (!apiKey || apiKey.trim().length === 0) return;
    const requestId = ++discoveryRequestRef.current;
    setIsDetectingModel(true);
    try {
      const res = await discoverLatestGeminiModels(apiKey);
      if (requestId !== discoveryRequestRef.current) return;

      setAvailableModels(res.models);
      liveModelsRef.current = res.models.map((m) => m.name);

      // Upgrade automatically to Google's newest model whenever Auto-Detect is enabled;
      // preserve manual override only when explicitly selected and still live in catalog.
      setSettings((prev) => {
        const isCurrentModelValid = Boolean(
          prev.selectedModel &&
            !isLegacyOrInvalidModel(prev.selectedModel) &&
            res.models.some((m) => m.name === prev.selectedModel)
        );
        const shouldPreserveManual = !prev.autoDetectModel && isCurrentModelValid;
        const modelToUse = shouldPreserveManual ? prev.selectedModel : res.recommendedModel;
        activeModelRef.current = modelToUse;
        return {
          ...prev,
          selectedModel: modelToUse
        };
      });
    } catch (err) {
      if (requestId === discoveryRequestRef.current) {
        console.warn('Live model discovery failed:', err);
      }
    } finally {
      if (requestId === discoveryRequestRef.current) {
        setIsDetectingModel(false);
      }
    }
  };

  const updateSettings = (newPartial: Partial<AppSettings>) => {
    const prev = settingsRef.current;
    const isClearingKey = newPartial.apiKey !== undefined && newPartial.apiKey.trim().length === 0;
    const isNewApiKey =
      !isClearingKey &&
      newPartial.apiKey !== undefined &&
      newPartial.apiKey.trim() !== prev.apiKey.trim() &&
      newPartial.apiKey.trim().length > 10;

    setSettings((current) => {
      const next = { ...current, ...newPartial };
      if (isClearingKey) {
        next.selectedModel = '';
      }
      settingsRef.current = next;
      activeModelRef.current = next.selectedModel || '';
      return next;
    });

    if (isClearingKey) {
      discoveryRequestRef.current++;
      liveModelsRef.current = [];
      setAvailableModels([]);
      setIsDetectingModel(false);
    } else if (isNewApiKey && !newPartial.selectedModel) {
      performAutoDiscovery(newPartial.apiKey!);
    }
  };

  // Add images to queue (up to 20 total limit)
  const handleAddImages = (newImages: ProcessedImage[]) => {
    setImages((prev) => {
      const combined = [...prev, ...newImages];
      if (combined.length > 20) {
        combined.slice(20).forEach((overflowImg) => {
          if (overflowImg.previewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(overflowImg.previewUrl);
          }
        });
      }
      return combined.slice(0, 20);
    });
  };

  // Remove single image and release object URL memory
  const handleRemoveImage = (id: string) => {
    setImages((prev) => {
      const target = prev.find((img) => img.id === id);
      if (target && target.previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((img) => img.id !== id);
    });
  };

  // Clear entire queue and release object URL memory
  const handleClearAll = () => {
    abortControllerRef.current?.abort();
    imagesRef.current.forEach((img) => {
      if (img.previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(img.previewUrl);
      }
    });
    setImages([]);
  };

  // In-place text update
  const handleUpdateImageText = (id: string, newText: string) => {
    setImages((prev) =>
      prev.map((img) => {
        if (img.id === id) {
          const stats = analyzeExtractedText(newText, img.stats?.processingTimeMs || 0);
          return {
            ...img,
            extractedText: newText,
            stats
          };
        }
        return img;
      })
    );
  };

  // Process a single image strictly through the live Google Gemini API
  const processSingleImage = async (imgId: string, signal?: AbortSignal): Promise<boolean> => {
    const currentImg = imagesRef.current.find((i) => i.id === imgId) || images.find((i) => i.id === imgId);
    if (!currentImg || signal?.aborted) return false;

    const currentSettings = settingsRef.current;
    const activeT = translations[currentSettings.language];

    if (!currentSettings.apiKey || currentSettings.apiKey.trim().length === 0) {
      setImages((prev) =>
        prev.map((i) =>
          i.id === imgId ? { ...i, status: 'error', errorMsg: activeT.missingKeyWarning } : i
        )
      );
      setIsModelModalOpen(true);
      return false;
    }

    setImages((prev) =>
      prev.map((i) => (i.id === imgId ? { ...i, status: 'processing', errorMsg: undefined } : i))
    );

    const startTime = performance.now();

    try {
      // Resolve the model live from Google if none is bound yet
      let modelToUse = activeModelRef.current || currentSettings.selectedModel;
      if (!modelToUse || isLegacyOrInvalidModel(modelToUse) || liveModelsRef.current.length === 0) {
        try {
          const res = await discoverLatestGeminiModels(currentSettings.apiKey);
          setAvailableModels(res.models);
          liveModelsRef.current = res.models.map((m) => m.name);
          const isModelInCatalog = res.models.some((m) => m.name === modelToUse);
          if (!modelToUse || currentSettings.autoDetectModel || isLegacyOrInvalidModel(modelToUse) || !isModelInCatalog) {
            modelToUse = res.recommendedModel;
            activeModelRef.current = modelToUse;
            setSettings((prev) => ({ ...prev, selectedModel: modelToUse }));
          }
        } catch {
          if (!modelToUse || isLegacyOrInvalidModel(modelToUse)) {
            modelToUse = DEFAULT_GEMINI_MODELS[0].name;
          }
        }
      }

      if (signal?.aborted) {
        throw new DOMException('Batch processing cancelled by user.', 'AbortError');
      }

      // Pre-scale oversized images smoothly to maximize transmission speed & reduce latency
      const optimized = await optimizeImageForOcr(currentImg.base64);

      const result = await extractTextAndEmojisFromImage(
        currentSettings.apiKey,
        modelToUse,
        optimized.base64,
        optimized.mimeType,
        {
          preserveFormatting: currentSettings.preserveFormatting,
          extractEmojis: currentSettings.extractEmojis,
          temperature: currentSettings.temperature
        },
        liveModelsRef.current,
        signal
      );

      const elapsed = Math.round(performance.now() - startTime);
      const stats = analyzeExtractedText(result.text, elapsed);

      // Keep the displayed model truthful: immediately bind whichever live model answered
      if (result.modelUsed && result.modelUsed !== activeModelRef.current) {
        activeModelRef.current = result.modelUsed;
        setSettings((prev) => ({ ...prev, selectedModel: result.modelUsed }));
      }

      setImages((prev) =>
        prev.map((i) =>
          i.id === imgId
            ? {
                ...i,
                status: 'completed',
                extractedText: result.text,
                stats
              }
            : i
        )
      );

      return true;
    } catch (err: any) {
      if (err?.name === 'AbortError' && signal?.aborted) {
        setImages((prev) =>
          prev.map((i) =>
            i.id === imgId ? { ...i, status: 'idle', errorMsg: undefined } : i
          )
        );
        return false;
      }

      const elapsed = Math.round(performance.now() - startTime);
      const isQuota =
        err.message?.includes('QUOTA_EXCEEDED') ||
        err.message?.includes('RESOURCE_EXHAUSTED') ||
        err.message?.includes('429');

      if (isQuota) {
        setQuotaAlert(true);
      }

      setImages((prev) =>
        prev.map((i) =>
          i.id === imgId
            ? {
                ...i,
                status: 'error',
                errorMsg: isQuota ? activeT.quotaExceededWarning : err.message || 'Extraction failed',
                stats: analyzeExtractedText('', elapsed)
              }
            : i
        )
      );
      return false;
    }
  };

  // Process all idle or previously failed images sequentially
  const handleExtractAll = async () => {
    if (isProcessingBatch) return;

    const targetImages = imagesRef.current.filter(
      (img) => img.status === 'idle' || img.status === 'error'
    );
    if (targetImages.length === 0) return;

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const targetIds = new Set(targetImages.map((img) => img.id));
    setImages((prev) =>
      prev.map((img) =>
        targetIds.has(img.id) ? { ...img, status: 'queued', errorMsg: undefined } : img
      )
    );

    setIsProcessingBatch(true);

    try {
      for (const img of targetImages) {
        if (controller.signal.aborted) {
          break;
        }
        await processSingleImage(img.id, controller.signal);
        if (controller.signal.aborted) {
          break;
        }
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    } finally {
      abortControllerRef.current = null;
      setImages((prev) =>
        prev.map((img) => (img.status === 'queued' ? { ...img, status: 'idle' } : img))
      );
      setIsProcessingBatch(false);
    }
  };

  const handleStopBatch = () => {
    abortControllerRef.current?.abort();
    setImages((prev) =>
      prev.map((img) => (img.status === 'queued' ? { ...img, status: 'idle' } : img))
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFC] dark:bg-[#070A11] text-slate-900 dark:text-slate-100 transition-colors">

      {/* Sticky Floating SaaS Navbar */}
      <Header
        settings={settings}
        onUpdateSettings={updateSettings}
        onOpenModelModal={() => setIsModelModalOpen(true)}
        isDetectingModel={isDetectingModel}
      />

      {/* Floating Quota Alert Toast - Non-Intrusive Bottom Placement */}
      {quotaAlert && (
        <div className="fixed bottom-6 right-6 rtl:right-auto rtl:left-6 z-50 max-w-sm sm:max-w-md w-[calc(100%-2rem)] sm:w-auto animate-fade-in">
          <div className="p-4 rounded-2xl bg-slate-900/95 dark:bg-slate-950/95 border border-amber-500/40 backdrop-blur-xl flex items-start gap-3.5 text-slate-100 shadow-[0_10px_40px_-10px_rgba(245,158,11,0.3)]">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0 mt-0.5">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0 pe-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
                {t.quotaExceededTitle}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t.quotaExceededWarning}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setQuotaAlert(false);
                    setIsModelModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-sm"
                >
                  {t.changeKeyBtn}
                </button>
                <button
                  type="button"
                  onClick={() => setQuotaAlert(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors"
                >
                  {t.closeBtn}
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setQuotaAlert(false)}
              className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition-colors flex-shrink-0"
              aria-label={t.closeBtn}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Container: 3 Clean Compact Sections */}
      <main className="flex-1 w-full">

        {/* SECTION 1: Hero & Studio Workspace */}
        <SaaSHero
          language={settings.language}
          onLaunchWorkspace={() => {
            document.getElementById('studio')?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Studio Workspace */}
        <section id="studio" className="scroll-mt-20 py-4 sm:py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-white/90 dark:bg-[#0B101B]/80 border border-slate-200/80 dark:border-slate-800/70 backdrop-blur-xl p-5 sm:p-8 shadow-sm dark:shadow-[0_24px_60px_-20px_rgba(14,165,233,0.12)] space-y-6">

              <div className="text-center sm:text-start">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {t.studioTitle}
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  {t.studioSubtitle}
                </p>
              </div>

              {/* Upload Zone (Max 20 Images, Drag & drop, Clipboard Ctrl+V) */}
              <BatchDropzone
                language={settings.language}
                images={images}
                onAddImages={handleAddImages}
                maxLimit={20}
              />

              {/* Batch Operations Bar */}
              {images.length > 0 && (
                <BatchControls
                  language={settings.language}
                  images={images}
                  isProcessingBatch={isProcessingBatch}
                  onExtractAll={handleExtractAll}
                  onStopBatch={handleStopBatch}
                  onClearAll={handleClearAll}
                  onOpenExportModal={() => setIsExportModalOpen(true)}
                />
              )}

              {/* Images Grid */}
              <ImagePreviewList
                language={settings.language}
                images={images}
                onRemoveImage={handleRemoveImage}
                onExtractSingle={(id) => processSingleImage(id)}
                onViewResult={(img) => setSelectedImageId(img.id)}
              />

            </div>
          </div>
        </section>

        {/* SECTION 2: Platform Architecture & Capabilities (4-Card Grid) */}
        <SaaSFeatures language={settings.language} />

        {/* SECTION 3: Frequently Asked Questions (Compact Accordion) */}
        <SaaSFaq language={settings.language} />

      </main>

      {/* Minimal Footer: By Adel Mohamed */}
      <SaaSFooter />

      {/* Toast Notification for Clipboard Paste */}
      {pasteToast && (
        <div className="fixed bottom-6 right-6 rtl:right-auto rtl:left-6 z-50 p-4 rounded-2xl bg-sky-600 text-white shadow-2xl text-xs sm:text-sm font-bold flex items-center gap-2.5 animate-bounce">
          <ClipboardPaste className="w-5 h-5" />
          <span>{t.pasteSuccess}</span>
        </div>
      )}

      {/* Modals */}
      <ResultModal
        image={selectedImageForResult}
        language={settings.language}
        onClose={() => setSelectedImageId(null)}
        onUpdateText={handleUpdateImageText}
      />

      <ModelSelectorModal
        settings={settings}
        language={settings.language}
        availableModels={availableModels}
        isOpen={isModelModalOpen}
        onClose={() => setIsModelModalOpen(false)}
        onUpdateSettings={updateSettings}
        onRefreshModels={(models, recommended) => {
          setAvailableModels(models);
          liveModelsRef.current = models.map((m) => m.name);
          activeModelRef.current = recommended;
        }}
      />

      <ExportModal
        images={images}
        language={settings.language}
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

    </div>
  );
};
