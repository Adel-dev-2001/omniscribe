import React from 'react';
import { ProcessedImage, SupportedLanguage } from '../types';
import { translations } from '../i18n/translations';
import {
  Play,
  Download,
  Trash2,
  StopCircle,
  Type,
  Smile,
  Sparkles,
  Layers
} from 'lucide-react';

interface BatchControlsProps {
  language: SupportedLanguage;
  images: ProcessedImage[];
  isProcessingBatch: boolean;
  onExtractAll: () => void;
  onStopBatch: () => void;
  onClearAll: () => void;
  onOpenExportModal: () => void;
}

export const BatchControls: React.FC<BatchControlsProps> = ({
  language,
  images,
  isProcessingBatch,
  onExtractAll,
  onStopBatch,
  onClearAll,
  onOpenExportModal
}) => {
  const t = translations[language];

  if (images.length === 0) return null;

  const completedCount = images.filter((img) => img.status === 'completed').length;
  const idleCount = images.filter((img) => img.status === 'idle').length;

  const totalChars = images.reduce((acc, img) => acc + (img.stats?.charCount || 0), 0);
  const totalWords = images.reduce((acc, img) => acc + (img.stats?.wordCount || 0), 0);
  const totalEmojis = images.reduce((acc, img) => acc + (img.stats?.emojiCount || 0), 0);

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm space-y-4 transition-all">
      
      {/* Top Row: Clean 4-Column Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total Images */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            {t.totalImages}
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xl font-black text-slate-900 dark:text-slate-100 font-mono">
              {images.length}
            </span>
            <span className="text-xs text-slate-400">
              ({completedCount} done)
            </span>
          </div>
        </div>

        {/* Words */}
        <div className="p-3 rounded-xl bg-sky-50/60 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/50">
          <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400 block uppercase tracking-wider flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-sky-500" />
            {t.wordsLabel}
          </span>
          <span className="text-xl font-black text-sky-700 dark:text-sky-300 mt-1 block font-mono">
            {totalWords.toLocaleString()}
          </span>
        </div>

        {/* Characters */}
        <div className="p-3 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50">
          <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 block uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
            {t.charsLabel}
          </span>
          <span className="text-xl font-black text-purple-700 dark:text-purple-300 mt-1 block font-mono">
            {totalChars.toLocaleString()}
          </span>
        </div>

        {/* Emojis */}
        <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50">
          <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 block uppercase tracking-wider flex items-center gap-1.5">
            <Smile className="w-3.5 h-3.5 text-amber-500" />
            {t.emojisLabel}
          </span>
          <span className="text-xl font-black text-amber-700 dark:text-amber-300 mt-1 block font-mono">
            {totalEmojis.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Bottom Row: Balanced, Single-Line Action Controls */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        
        {/* Status Text / Queue Progress */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="inline-block w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
          <span>
            {idleCount > 0
              ? `${idleCount} ${idleCount === 1 ? 'image' : 'images'} ready for extraction`
              : 'All queue images processed'}
          </span>
        </div>

        {/* Action Buttons in a Strict Unified Row */}
        <div className="flex items-center justify-end gap-2.5 flex-wrap sm:flex-nowrap">
          {/* Clear Queue Button */}
          <button
            type="button"
            onClick={onClearAll}
            disabled={isProcessingBatch}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900/60 transition-colors disabled:opacity-50 flex-shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t.clearAllBtn}</span>
          </button>

          {/* Consolidated Export Button */}
          <button
            type="button"
            onClick={onOpenExportModal}
            disabled={completedCount === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-800 dark:text-slate-100 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl border border-slate-300 dark:border-slate-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm flex-shrink-0"
          >
            <Download className="w-4 h-4 text-sky-500" />
            <span>{t.exportMergedBtn}</span>
            {completedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[10px] bg-sky-500 text-white rounded-full font-mono">
                {completedCount}
              </span>
            )}
          </button>

          {/* Primary Action Button: Extract All or Stop */}
          {isProcessingBatch ? (
            <button
              type="button"
              onClick={onStopBatch}
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-all shadow-md shadow-rose-600/20 flex-shrink-0"
            >
              <StopCircle className="w-4 h-4 animate-spin" />
              <span>{t.stopBtn}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onExtractAll}
              disabled={idleCount === 0}
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 hover:from-sky-500 hover:to-purple-500 rounded-xl transition-all shadow-md shadow-indigo-600/25 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{t.extractAllBtn}</span>
              {idleCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] bg-white/20 text-white rounded-full font-mono">
                  {idleCount}
                </span>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
