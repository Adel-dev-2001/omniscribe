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
  DEFAULT_GEMINI_MODELS
} from './services/geminiService';
import { ClipboardPaste, AlertTriangle, X } from 'lucide-react';

const STORAGE_KEY_SETTINGS = 'omniscribe_settings_v5';

export const App: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    // Clear obsolete storage keys
    localStorage.removeItem('omniscribe_settings_v3');
    localStorage.removeItem('omniscribe_settings_v4');
    
    const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.apiKey || parsed.apiKey.trim().length === 0) {
          parsed.selectedModel = '';
        } else if (parsed.selectedModel && parsed.selectedModel.includes('1.5')) {
          parsed.selectedModel = '';
        }
        return parsed;
      } catch (e) {
        // fallback
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
      extractEmojis: true,
      detectLanguage: true
    };
  });

  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [availableModels, setAvailableModels] = useState<GeminiModelInfo[]>(DEFAULT_GEMINI_MODELS);
  const [isDetectingModel, setIsDetectingModel] = useState(false);
  const [discoveredModelName, setDiscoveredModelName] = useState(settings.selectedModel || '');

  const [isProcessingBatch, setIsProcessingBatch] = useState(false);
  const [selectedImageForResult, setSelectedImageForResult] = useState<ProcessedImage | null>(null);
  const [isModelModalOpen, setIsModelModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [pasteToast, setPasteToast] = useState(false);
  const [quotaAlert, setQuotaAlert] = useState(false);

  const abortControllerRef = useRef<boolean>(false);
  const t = translations[settings.language];

  // Persist settings & sync theme/dir
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
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
          if (file) newFiles.push(file);
        }
      }

      if (newFiles.length > 0) {
        const newImages: ProcessedImage[] = await Promise.all(
          newFiles.map(async (file) => {
            const reader = new FileReader();
            const base64 = await new Promise<string>((res) => {
              reader.readAsDataURL(file);
              reader.onload = () => res(reader.result as string);
            });
            return {
              id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              file,
              name: `clipboard_capture_${new Date().toISOString().slice(11, 19).replace(/:/g, '')}.png`,
              size: file.size,
              previewUrl: base64,
              base64,
              mimeType: file.type || 'image/png',
              status: 'idle',
              progress: 0,
              extractedText: '',
              timestamp: Date.now()
            };
          })
        );
        handleAddImages(newImages);
        setPasteToast(true);
        setTimeout(() => setPasteToast(false), 2500);
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [images]);

  const performAutoDiscovery = async (apiKey: string) => {
    if (!apiKey || apiKey.trim().length === 0) return;
    setIsDetectingModel(true);
    try {
      const res = await discoverLatestGeminiModels(apiKey);
      setAvailableModels(res.models);

      // Preserve previously verified/working model if still valid in Google's live catalog
      setSettings((prev) => {
        const isCurrentModelValid = Boolean(
          prev.selectedModel &&
          !prev.selectedModel.includes('1.5') &&
          res.models.some((m) => m.name === prev.selectedModel)
        );
        const modelToUse = isCurrentModelValid ? prev.selectedModel : res.recommendedModel;
        setDiscoveredModelName(modelToUse);
        return {
          ...prev,
          selectedModel: modelToUse
        };
      });
    } catch (err) {
      console.warn('Live model discovery failed:', err);
    } finally {
      setIsDetectingModel(false);
    }
  };

  const updateSettings = (newPartial: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...newPartial };
      if (newPartial.apiKey !== undefined && newPartial.apiKey.trim().length === 0) {
        next.selectedModel = '';
        setDiscoveredModelName('');
      } else if (newPartial.apiKey !== undefined && newPartial.apiKey !== prev.apiKey && newPartial.apiKey.trim().length > 10) {
        performAutoDiscovery(newPartial.apiKey);
      }
      return next;
    });
  };

  // Add images to queue (up to 20 total limit)
  const handleAddImages = (newImages: ProcessedImage[]) => {
    setImages((prev) => {
      const combined = [...prev, ...newImages];
      return combined.slice(0, 20);
    });
  };

  // Remove single image
  const handleRemoveImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  // Clear entire queue
  const handleClearAll = () => {
    if (isProcessingBatch) {
      abortControllerRef.current = true;
    }
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

  // Process a single image strictly through the live Google Gemini API (no simulated output)
  const processSingleImage = async (imgId: string): Promise<boolean> => {
    const currentImg = images.find((i) => i.id === imgId);
    if (!currentImg) return false;

    // No API key: never fabricate results. Ask the user to connect a real key.
    if (!settings.apiKey || settings.apiKey.trim().length === 0) {
      setImages((prev) =>
        prev.map((i) =>
          i.id === imgId ? { ...i, status: 'error', errorMsg: t.missingKeyWarning } : i
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
      let modelToUse = settings.selectedModel || discoveredModelName;
      if (!modelToUse) {
        try {
          const res = await discoverLatestGeminiModels(settings.apiKey);
          modelToUse = res.recommendedModel;
          setAvailableModels(res.models);
          setDiscoveredModelName(res.recommendedModel);
          setSettings((prev) => ({ ...prev, selectedModel: res.recommendedModel }));
        } catch {
          modelToUse = 'gemini-3.8-flash';
        }
      }

      // Pre-scale oversized images smoothly to maximize transmission speed & reduce latency
      const optimized = await optimizeImageForOcr(currentImg.base64);

      const result = await extractTextAndEmojisFromImage(
        settings.apiKey,
        modelToUse,
        optimized.base64,
        optimized.mimeType,
        {
          preserveFormatting: settings.preserveFormatting,
          extractEmojis: settings.extractEmojis,
          temperature: settings.temperature
        },
        availableModels.map((m) => m.name)
      );

      const elapsed = Math.round(performance.now() - startTime);
      const stats = analyzeExtractedText(result.text, elapsed);

      // Keep the displayed model truthful: bind whichever model actually answered
      if (result.modelUsed && result.modelUsed !== settings.selectedModel) {
        setDiscoveredModelName(result.modelUsed);
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
              errorMsg: isQuota ? t.quotaExceededWarning : (err.message || 'Extraction failed'),
              stats: analyzeExtractedText('', elapsed)
            }
            : i
        )
      );
      return false;
    }
  };

  // Process all idle/queued images sequentially
  const handleExtractAll = async () => {
    const idleImages = images.filter((img) => img.status === 'idle' || img.status === 'error');
    if (idleImages.length === 0) return;

    setIsProcessingBatch(true);
    abortControllerRef.current = false;

    for (const img of idleImages) {
      if (abortControllerRef.current) {
        break;
      }
      await processSingleImage(img.id);
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    setIsProcessingBatch(false);
  };

  const handleStopBatch = () => {
    abortControllerRef.current = true;
    setIsProcessingBatch(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFC] dark:bg-[#070A11] text-slate-900 dark:text-slate-100 transition-colors">

      {/* Sticky Floating SaaS Navbar */}
      <Header
        settings={settings}
        onUpdateSettings={updateSettings}
        onOpenModelModal={() => setIsModelModalOpen(true)}
        isDetectingModel={isDetectingModel}
        discoveredModelName={discoveredModelName}
      />

      {/* Floating Quota Alert Toast - Modern Non-Intrusive Bottom Placement */}
      {quotaAlert && (
        <div className="fixed bottom-6 right-6 rtl:right-auto rtl:left-6 z-50 max-w-sm sm:max-w-md w-[calc(100%-2rem)] sm:w-auto animate-fade-in">
          <div className="p-4 rounded-2xl bg-slate-900/95 dark:bg-slate-950/95 border border-amber-500/40 shadow-2xl backdrop-blur-xl flex items-start gap-3.5 text-slate-100 shadow-[0_10px_40px_-10px_rgba(245,158,11,0.3)]">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0 mt-0.5">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0 pr-1">
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
              aria-label="Dismiss alert"
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
          discoveredModelName={discoveredModelName}
        />

        {/* Studio Workspace */}
        <section id="studio" className="py-8 bg-white dark:bg-[#0B0F19] border-y border-slate-200/80 dark:border-slate-800/80">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

            <div className="text-center sm:text-left">
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
              onExtractSingle={processSingleImage}
              onViewResult={(img) => setSelectedImageForResult(img)}
            />

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
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-sky-600 text-white shadow-2xl text-xs sm:text-sm font-bold flex items-center gap-2.5 animate-bounce">
          <ClipboardPaste className="w-5 h-5" />
          <span>Image pasted from clipboard directly!</span>
        </div>
      )}

      {/* Modals */}
      <ResultModal
        image={selectedImageForResult}
        language={settings.language}
        onClose={() => setSelectedImageForResult(null)}
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
          setDiscoveredModelName(recommended);
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
