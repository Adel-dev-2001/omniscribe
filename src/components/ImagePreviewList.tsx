import React, { useState } from 'react';
import { ProcessedImage, SupportedLanguage } from '../types';
import { translations } from '../i18n/translations';
import {
  Trash2,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  AlertTriangle,
  Loader2,
  Smile,
  Type,
  Maximize2
} from 'lucide-react';

interface ImagePreviewListProps {
  language: SupportedLanguage;
  images: ProcessedImage[];
  onRemoveImage: (id: string) => void;
  onExtractSingle: (id: string) => void;
  onViewResult: (image: ProcessedImage) => void;
}

export const ImagePreviewList: React.FC<ImagePreviewListProps> = ({
  language,
  images,
  onRemoveImage,
  onExtractSingle,
  onViewResult
}) => {
  const t = translations[language];
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyText = (id: string, text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (images.length === 0) return null;

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {images.map((img, index) => {
          const isCompleted = img.status === 'completed';
          const isProcessing = img.status === 'processing' || img.status === 'queued';
          const isError = img.status === 'error';
          const isIdle = img.status === 'idle';

          return (
            <div
              key={img.id}
              className={`group relative flex flex-col rounded-2xl border transition-all duration-200 overflow-hidden bg-white dark:bg-slate-900 shadow-sm hover:shadow-md ${isCompleted
                  ? 'border-emerald-300 dark:border-emerald-900/60 ring-1 ring-emerald-500/10'
                  : isProcessing
                    ? 'border-sky-400 dark:border-sky-600 ring-2 ring-sky-500/20'
                    : isError
                      ? 'border-rose-300 dark:border-rose-900/60'
                      : 'border-slate-200 dark:border-slate-800'
                }`}
            >
              {/* Image Thumbnail & Overlay */}
              <div className="relative aspect-video w-full bg-slate-100 dark:bg-slate-950 overflow-hidden">
                <img
                  src={img.previewUrl}
                  alt={img.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Index badge */}
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-md text-[10px] font-mono font-bold text-white border border-white/10">
                  #{index + 1}
                </div>

                {/* Status Badge */}
                <div className="absolute top-2 right-2">
                  {isProcessing && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-600/90 backdrop-blur-md text-[10px] font-semibold text-white animate-pulse">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      {t.statusProcessing}
                    </span>
                  )}
                  {isCompleted && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-600/90 backdrop-blur-md text-[10px] font-semibold text-white">
                      <Check className="w-3 h-3" />
                      {t.statusCompleted}
                    </span>
                  )}
                  {isError && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-600/90 backdrop-blur-md text-[10px] font-semibold text-white">
                      <AlertTriangle className="w-3 h-3" />
                      {t.statusError}
                    </span>
                  )}
                  {isIdle && (
                    <span className="px-2 py-0.5 rounded-md bg-slate-800/80 backdrop-blur-md text-[10px] font-medium text-slate-300">
                      {t.statusIdle}
                    </span>
                  )}
                </div>

                {/* Quick inspect overlay button */}
                {isCompleted && (
                  <button
                    onClick={() => onViewResult(img)}
                    className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-1.5 text-xs font-semibold backdrop-blur-[2px]"
                  >
                    <Maximize2 className="w-4 h-4" />
                    <span>{t.viewResultBtn}</span>
                  </button>
                )}

                {/* High-Tech Optical Scanner Effect (Active during extraction) */}
                {isProcessing && (
                  <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
                    {/* Cyber Grid & Ambient Gradient Pulse */}
                    <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/15 via-transparent to-cyan-500/15 animate-scanner-glow" />
                    
                    {/* Moving Laser Beam */}
                    <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_14px_3px_rgba(6,182,212,0.95)] animate-scanner-sweep">
                      {/* Laser trailing light flare */}
                      <div className="w-full h-10 -translate-y-full bg-gradient-to-t from-cyan-400/25 to-transparent" />
                    </div>

                    {/* Central Target Scanner Badge */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-cyan-400/50 text-[10px] font-mono font-bold text-cyan-300 shadow-lg shadow-cyan-950/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                        <span>OCR SCANNING...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-3.5 flex flex-col flex-1 justify-between gap-2.5">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4
                      className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate flex-1"
                      title={img.name}
                    >
                      {img.name}
                    </h4>
                    <button
                      type="button"
                      onClick={() => onRemoveImage(img.id)}
                      className="text-slate-400 hover:text-rose-500 transition-colors p-0.5"
                      title={t.removeImageBtn}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                    {(img.size / 1024).toFixed(1)} KB • {img.mimeType.replace('image/', '').toUpperCase()}
                  </p>
                </div>

                {/* Extracted Preview Snippet / Metrics */}
                {isCompleted && (
                  <div className="bg-slate-50 dark:bg-slate-950/70 rounded-xl p-2.5 border border-slate-100 dark:border-slate-800 text-[11px]">
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 pb-1.5 mb-1.5 border-b border-slate-200/60 dark:border-slate-800 font-medium">
                      <span className="flex items-center gap-1 text-sky-600 dark:text-sky-400">
                        <Type className="w-3 h-3" />
                        {img.stats?.wordCount || 0} {t.wordsLabel}
                      </span>
                      <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                        <Smile className="w-3 h-3" />
                        {img.stats?.emojiCount || 0} {t.emojisLabel}
                      </span>
                    </div>
                    <p className="font-mono text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {img.extractedText || t.noTextFound}
                    </p>
                  </div>
                )}

                {/* Error Banner */}
                {isError && (
                  <div className="bg-rose-50 dark:bg-rose-950/40 rounded-xl p-2.5 border border-rose-200 dark:border-rose-900/60 text-[11px] text-rose-700 dark:text-rose-300">
                    <p className="line-clamp-2">{img.errorMsg || 'Recognition failed'}</p>
                  </div>
                )}

                {/* Bottom Actions */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                  {isCompleted ? (
                    <>
                      <button
                        type="button"
                        onClick={(e) => handleCopyText(img.id, img.extractedText, e)}
                        className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 bg-slate-100 dark:bg-slate-800/80 hover:bg-sky-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        {copiedId === img.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span className="text-emerald-600 dark:text-emerald-400">{t.copiedBtn}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>{t.copyTextBtn}</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => onViewResult(img)}
                        className="flex items-center gap-1 text-[11px] font-semibold text-sky-600 dark:text-sky-400 hover:underline"
                      >
                        <span>{t.viewResultBtn}</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onExtractSingle(img.id)}
                      disabled={isProcessing}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:text-white bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-600 dark:hover:bg-sky-600 rounded-lg border border-sky-200 dark:border-sky-900/60 transition-all disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3 h-3 ${isProcessing ? 'animate-spin' : ''}`} />
                      <span>{t.extractSingleBtn}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
