import React, { useState, useEffect, useRef } from 'react';
import { ProcessedImage, SupportedLanguage } from '../types';
import { translations } from '../i18n/translations';
import { analyzeExtractedText } from '../services/geminiService';
import { exportSingleImageAsPdf, exportSingleImageAsTxt } from '../services/exportService';
import confetti from 'canvas-confetti';
import {
  X,
  Copy,
  Check,
  Download,
  Smile,
  FileCode,
  Sparkles,
  AlignLeft,
  Eye,
  Edit3,
  Save,
  Loader2
} from 'lucide-react';

interface ResultModalProps {
  image: ProcessedImage | null;
  language: SupportedLanguage;
  onClose: () => void;
  onUpdateText?: (id: string, newText: string) => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  image,
  language,
  onClose,
  onUpdateText
}) => {
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<'raw' | 'preview' | 'edit'>('raw');
  const [isCopied, setIsCopied] = useState(false);
  const [editedText, setEditedText] = useState('');
  const [selectedEmojiInfo, setSelectedEmojiInfo] = useState<{ char: string; codePoint: string } | null>(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const copyTimerRef = useRef<number | null>(null);
  const emojiTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (image?.id) {
      setActiveTab('raw');
      setSelectedEmojiInfo(null);
      setPdfError(null);
    }
  }, [image?.id]);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current !== null) window.clearTimeout(copyTimerRef.current);
      if (emojiTimerRef.current !== null) window.clearTimeout(emojiTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (image) {
      setEditedText(image.extractedText || '');
    }
  }, [image?.id, image?.extractedText]);

  // Lock background scroll and listen for Escape key
  useEffect(() => {
    if (!image) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [image, onClose]);

  if (!image) return null;

  const currentDisplayText = activeTab === 'edit' ? editedText : (image.extractedText || '');

  // Extract individual unique emojis for chips
  const emojiRegex = /(\p{Extended_Pictographic}|\p{Emoji_Presentation}|\p{Regional_Indicator}{2})/gu;
  const extractedEmojis = Array.from(new Set(currentDisplayText.match(emojiRegex) || []));

  const formatEmojiCodePoints = (emoji: string): string =>
    Array.from(emoji)
      .map((cp) => `U+${(cp.codePointAt(0) ?? 0).toString(16).toUpperCase()}`)
      .join(' ');

  const handleCopy = async () => {
    try {
      await navigator.clipboard?.writeText(currentDisplayText);
      setIsCopied(true);

      try {
        confetti({
          particleCount: 35,
          spread: 55,
          origin: { y: 0.7 }
        });
      } catch {
        // Confetti effect is decorative
      }

      if (copyTimerRef.current !== null) window.clearTimeout(copyTimerRef.current);
      copyTimerRef.current = window.setTimeout(() => {
        setIsCopied(false);
        copyTimerRef.current = null;
      }, 2000);
    } catch {
      // Clipboard write unavailable in restricted contexts
    }
  };

  const handleDownloadSingleTxt = () => {
    exportSingleImageAsTxt(image, currentDisplayText);
  };

  const handleDownloadSinglePdf = async () => {
    if (isExportingPdf) return;
    setIsExportingPdf(true);
    setPdfError(null);
    try {
      await exportSingleImageAsPdf(image, currentDisplayText);
    } catch (err) {
      console.error('Failed to export single image as PDF:', err);
      setPdfError(t.exportFailWarning);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleSaveEdit = () => {
    if (onUpdateText) {
      onUpdateText(image.id, editedText);
    }
    setActiveTab('raw');
  };

  const handleEmojiClick = async (emoji: string) => {
    const codePoint = formatEmojiCodePoints(emoji);
    setSelectedEmojiInfo({ char: emoji, codePoint });
    try {
      await navigator.clipboard?.writeText(emoji);
    } catch {
      // Clipboard write unavailable in restricted contexts
    }
    if (emojiTimerRef.current !== null) window.clearTimeout(emojiTimerRef.current);
    emojiTimerRef.current = window.setTimeout(() => {
      setSelectedEmojiInfo(null);
      emojiTimerRef.current = null;
    }, 2500);
  };

  const liveStats = analyzeExtractedText(currentDisplayText, image.stats?.processingTimeMs || 0);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-fade-in overscroll-contain"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={image.name}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[92vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden overscroll-contain"
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 truncate max-w-xs sm:max-w-md">
                {image.name}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {liveStats.wordCount} {t.wordsLabel} • {liveStats.charCount} {t.charsLabel} • {liveStats.emojiCount} {t.emojisLabel}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Copy Button */}
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900 border border-sky-200 dark:border-sky-800 transition-colors"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600">{t.copiedBtn}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{t.copyTextBtn}</span>
                </>
              )}
            </button>

            {/* Direct Download .TXT Button */}
            <button
              type="button"
              onClick={handleDownloadSingleTxt}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all shadow-sm"
              title={t.downloadTxtTitle}
              aria-label={t.downloadTxtTitle}
            >
              <Download className="w-3.5 h-3.5 text-sky-500" />
              <span>TXT</span>
            </button>

            {/* Direct Download .PDF Button */}
            <button
              type="button"
              onClick={handleDownloadSinglePdf}
              disabled={isExportingPdf}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all shadow-sm disabled:opacity-50"
              title={t.downloadPdfTitle}
              aria-label={t.downloadPdfTitle}
            >
              {isExportingPdf ? (
                <Loader2 className="w-3.5 h-3.5 text-indigo-500 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5 text-indigo-500" />
              )}
              <span>{isExportingPdf ? 'PDF...' : 'PDF'}</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label={t.closeBtn}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Emojis Stream Chips with Inspector */}
          {extractedEmojis.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
              <div className="flex items-center justify-between text-xs font-bold text-amber-800 dark:text-amber-300 mb-2">
                <div className="flex items-center gap-1.5">
                  <Smile className="w-4 h-4" />
                  <span>
                    {t.emojisStreamTitle} ({extractedEmojis.length} {t.uniqueLabel})
                  </span>
                </div>
                {selectedEmojiInfo && (
                  <span className="text-[11px] font-mono bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md border border-amber-300 text-amber-900 dark:text-amber-200 animate-fade-in flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-500" />
                    {t.emojiCopiedShort} {selectedEmojiInfo.char} ({selectedEmojiInfo.codePoint})
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2 text-xl select-none">
                {extractedEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => handleEmojiClick(emoji)}
                    className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-amber-100 dark:border-amber-900/60 shadow-sm hover:scale-125 transition-transform cursor-pointer"
                    title={`${t.emojiTooltipPrefix}: ${formatEmojiCodePoints(emoji)}`}
                    aria-label={`${emoji} (${formatEmojiCodePoints(emoji)})`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Split view: Image and Text */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            
            {/* Source Image Frame */}
            <div className="flex flex-col space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {t.sourceDocumentLabel}
              </span>
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 flex items-center justify-center max-h-[380px]">
                <img
                  src={image.previewUrl}
                  alt={image.name}
                  className="max-h-[380px] w-auto object-contain"
                />
              </div>
            </div>

            {/* Extracted Text Area with Tabs (Raw / Formatted / In-Place Editor) */}
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <div role="tablist" className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl text-xs">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === 'raw'}
                    onClick={() => setActiveTab('raw')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition-all ${
                      activeTab === 'raw'
                        ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    <AlignLeft className="w-3 h-3" />
                    <span>{t.rawTextTab}</span>
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === 'preview'}
                    onClick={() => setActiveTab('preview')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition-all ${
                      activeTab === 'preview'
                        ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    <Eye className="w-3 h-3" />
                    <span>{t.formattedTab}</span>
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === 'edit'}
                    onClick={() => setActiveTab('edit')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition-all ${
                      activeTab === 'edit'
                        ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>{t.editTextTab}</span>
                  </button>
                </div>

                <span className="text-xs text-slate-400 font-mono">
                  {((image.stats?.processingTimeMs || 0) / 1000).toFixed(2)}s {t.latencyUnit}
                </span>
              </div>

              <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 p-4 max-h-[380px] overflow-y-auto">
                {activeTab === 'edit' ? (
                  <div className="space-y-3">
                    <textarea
                      dir="auto"
                      value={editedText}
                      onChange={(e) => setEditedText(e.target.value)}
                      rows={10}
                      className="w-full p-2.5 font-mono text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 resize-none"
                      placeholder={t.editPlaceholder}
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditedText(image.extractedText || '');
                          setActiveTab('raw');
                        }}
                        className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                      >
                        {t.cancelBtn}
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveEdit}
                        className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-xl transition-all shadow-sm"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{t.saveChangesBtn}</span>
                      </button>
                    </div>
                  </div>
                ) : activeTab === 'raw' ? (
                  <pre dir="auto" className="font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-100 whitespace-pre-wrap break-words leading-relaxed select-text font-normal">
                    {image.extractedText || t.noTextFound}
                  </pre>
                ) : (
                  <div dir="auto" className="max-w-none text-xs sm:text-sm text-slate-800 dark:text-slate-100 whitespace-pre-wrap break-words leading-relaxed">
                    {image.extractedText || t.noTextFound}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs text-slate-500">
          {pdfError ? (
            <span role="alert" className="text-rose-600 dark:text-rose-400 font-semibold">
              {pdfError}
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-sky-500" />
              {t.processedByFooter}
            </span>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            {t.closeBtn}
          </button>
        </div>

      </div>
    </div>
  );
};
