import React, { useState, useEffect, useRef } from 'react';
import { ExportConfig, ProcessedImage, SupportedLanguage } from '../types';
import { translations } from '../i18n/translations';
import { exportExtractedData } from '../services/exportService';
import {
  X,
  Download,
  FileText,
  FileCode,
  FileSpreadsheet,
  CheckCircle2,
  Layers,
  Loader2
} from 'lucide-react';

interface ExportModalProps {
  images: ProcessedImage[];
  language: SupportedLanguage;
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  images,
  language,
  isOpen,
  onClose
}) => {
  const t = translations[language];
  const [config, setConfig] = useState<ExportConfig>({
    format: 'txt',
    includeMetadata: true,
    includeStats: true,
    documentTitle: 'OmniScribe Consolidated Extraction Report',
    authorName: 'Adel Mohamed'
  });
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const closeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  // Lock background scroll and listen for Escape key
  useEffect(() => {
    if (!isOpen) {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
      return;
    }
    setExportError(null);
    setDownloadSuccess(false);

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
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const completedImages = images.filter((img) => img.status === 'completed');

  const handleDownload = async () => {
    if (isExporting) return;
    setIsExporting(true);
    setExportError(null);
    try {
      await exportExtractedData(images, config);
      setDownloadSuccess(true);
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
      closeTimerRef.current = window.setTimeout(() => {
        closeTimerRef.current = null;
        setDownloadSuccess(false);
        onClose();
      }, 1600);
    } catch (err) {
      console.error('Failed to export consolidated data:', err);
      setExportError(t.exportFailWarning);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-fade-in overscroll-contain"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t.exportModalTitle}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden overscroll-contain"
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                {t.exportModalTitle}
              </h3>
              <p className="text-xs text-slate-400">
                {completedImages.length} {t.readyForMergeDesc}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t.closeBtn}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          
          {/* Format Selection Cards */}
          <div className="space-y-2">
            <span
              id="export-format-label"
              className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block"
            >
              {t.formatLabel}
            </span>
            <div role="group" aria-labelledby="export-format-label" className="grid grid-cols-2 gap-2.5">
              
              {/* Plain Text (.txt) */}
              <button
                type="button"
                aria-pressed={config.format === 'txt'}
                onClick={() => setConfig({ ...config, format: 'txt' })}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all text-start ${
                  config.format === 'txt'
                    ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/40 ring-2 ring-sky-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-950/40'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="w-4 h-4 text-sky-500" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    Text File (.txt)
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {t.formatTxt}
                </p>
              </button>

              {/* PDF Document (.pdf) */}
              <button
                type="button"
                aria-pressed={config.format === 'pdf'}
                onClick={() => setConfig({ ...config, format: 'pdf' })}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all text-start ${
                  config.format === 'pdf'
                    ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/40 ring-2 ring-sky-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-950/40'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Download className="w-4 h-4 text-indigo-500" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    PDF Document (.pdf)
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {t.formatPdf}
                </p>
              </button>

              {/* Markdown Document (.md) */}
              <button
                type="button"
                aria-pressed={config.format === 'md'}
                onClick={() => setConfig({ ...config, format: 'md' })}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all text-start ${
                  config.format === 'md'
                    ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/40 ring-2 ring-sky-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-950/40'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <FileCode className="w-4 h-4 text-purple-500" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    Markdown (.md)
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {t.formatMd}
                </p>
              </button>

              {/* Research JSON Dataset (.json) */}
              <button
                type="button"
                aria-pressed={config.format === 'json'}
                onClick={() => setConfig({ ...config, format: 'json' })}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all text-start ${
                  config.format === 'json'
                    ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/40 ring-2 ring-sky-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-950/40'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    JSON Dataset (.json)
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {t.formatJson}
                </p>
              </button>

            </div>
          </div>

          {/* Document Title Input */}
          <div className="space-y-1.5">
            <label
              htmlFor="export-doc-title"
              className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block"
            >
              {t.documentTitleLabel}
            </label>
            <input
              id="export-doc-title"
              type="text"
              value={config.documentTitle}
              onChange={(e) => setConfig({ ...config, documentTitle: e.target.value })}
              className="w-full px-3.5 py-2 text-xs font-medium rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Options Checkboxes */}
          <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={config.includeMetadata}
                onChange={(e) => setConfig({ ...config, includeMetadata: e.target.checked })}
                className="w-4 h-4 text-sky-600 rounded border-slate-300 dark:border-slate-700 focus:ring-sky-500"
              />
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                {t.includeMetadataLabel}
              </span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={config.includeStats}
                onChange={(e) => setConfig({ ...config, includeStats: e.target.checked })}
                className="w-4 h-4 text-sky-600 rounded border-slate-300 dark:border-slate-700 focus:ring-sky-500"
              />
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                {t.includeStatsLabel}
              </span>
            </label>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            {exportError ? (
              <span role="alert" className="text-rose-600 dark:text-rose-400 font-semibold animate-fade-in">
                {exportError}
              </span>
            ) : downloadSuccess ? (
              <span className="flex items-center gap-1 text-emerald-600 font-semibold animate-fade-in">
                <CheckCircle2 className="w-4 h-4" />
                {t.exportSuccess}
              </span>
            ) : (
              <span>{t.readyToConsolidateDesc.replace('{count}', String(completedImages.length))}</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              {t.closeBtn}
            </button>
            <button
              type="button"
              onClick={handleDownload}
              disabled={isExporting || completedImages.length === 0}
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all shadow-md shadow-sky-600/20"
            >
              {isExporting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>{isExporting ? t.generatingLabel : t.downloadBtn}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
