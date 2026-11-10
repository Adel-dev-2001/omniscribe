import React, { useState, useEffect } from 'react';
import { AppSettings, GeminiModelInfo, SupportedLanguage } from '../types';
import { translations } from '../i18n/translations';
import { discoverLatestGeminiModels } from '../services/geminiService';
import {
  X,
  Cpu,
  RefreshCw,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  KeyRound,
  Trash2
} from 'lucide-react';

interface ModelSelectorModalProps {
  settings: AppSettings;
  language: SupportedLanguage;
  availableModels: GeminiModelInfo[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onRefreshModels: (models: GeminiModelInfo[], recommended: string) => void;
}

export const ModelSelectorModal: React.FC<ModelSelectorModalProps> = ({
  settings,
  language,
  isOpen,
  onClose,
  onUpdateSettings,
  onRefreshModels
}) => {
  const t = translations[language];
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [tempSettings, setTempSettings] = useState<AppSettings>({ ...settings });
  const [verifiedModel, setVerifiedModel] = useState<string | null>(
    settings.apiKey && settings.apiKey.trim().length > 0 && settings.selectedModel
      ? settings.selectedModel
      : null
  );

  // Sync tempSettings when modal opens or settings change
  useEffect(() => {
    if (isOpen) {
      setTempSettings({ ...settings });
      setScanStatus(null);
      if (settings.apiKey && settings.apiKey.trim().length > 0 && settings.selectedModel) {
        setVerifiedModel(settings.selectedModel);
      } else {
        setVerifiedModel(null);
      }
    }
  }, [isOpen, settings]);

  // Lock background scroll and listen for Escape key
  useEffect(() => {
    if (!isOpen) return;

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

  // Auto-discover live models from Google as soon as a key is entered or pasted
  useEffect(() => {
    const trimmed = tempSettings.apiKey?.trim() || '';
    if (trimmed.length >= 35 && trimmed.startsWith('AIza') && !verifiedModel && !isScanning) {
      const timer = setTimeout(() => {
        handleScanModels(trimmed);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [tempSettings.apiKey, verifiedModel, isScanning]);

  const handleScanModels = async (keyToUse?: string) => {
    const key = (keyToUse !== undefined ? keyToUse : tempSettings.apiKey).trim();
    if (!key) {
      setVerifiedModel(null);
      setScanStatus({ type: 'error', message: t.missingKeyWarning });
      return;
    }

    setIsScanning(true);
    setScanStatus(null);

    try {
      // Direct live query to Google Gemini models catalog
      const result = await discoverLatestGeminiModels(key);
      onRefreshModels(result.models, result.recommendedModel);
      setVerifiedModel(result.recommendedModel);
      setTempSettings((prev) => ({
        ...prev,
        apiKey: key,
        selectedModel: result.recommendedModel,
        autoDetectModel: true
      }));
      setScanStatus({
        type: 'success',
        message: `${t.connectionSuccess} (${result.recommendedModel})`
      });
    } catch (err: any) {
      setVerifiedModel(null);
      setScanStatus({
        type: 'error',
        message: err.message || t.connectionFail
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleApiKeyChange = (val: string) => {
    setTempSettings((prev) => ({ ...prev, apiKey: val }));
    if (!val || val.trim().length === 0) {
      setVerifiedModel(null);
      setScanStatus(null);
    }
  };

  const handleClearKey = () => {
    setTempSettings((prev) => ({ ...prev, apiKey: '' }));
    setVerifiedModel(null);
    setScanStatus(null);
  };

  const handleSave = () => {
    onUpdateSettings({
      ...tempSettings,
      selectedModel: verifiedModel || '',
      preserveFormatting: true,
      extractEmojis: true,
      temperature: 0.1
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-fade-in overscroll-contain"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden overscroll-contain"
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                {t.settingsTitle}
              </h3>
              <p className="text-xs text-slate-400">
                {t.dynamicDiscoveryTitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Explanation Box on Dynamic Model Discovery */}
          <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-900/50 text-xs text-indigo-900 dark:text-indigo-200 leading-relaxed">
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-1">
                  {t.dynamicDiscoveryTitle}
                </span>
                {t.dynamicDiscoveryDesc}
              </div>
            </div>
          </div>

          {/* API Key Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
              {t.apiKeyLabel}
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="password"
                  value={tempSettings.apiKey}
                  onChange={(e) => handleApiKeyChange(e.target.value)}
                  placeholder={t.apiKeyPlaceholder}
                  className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 shadow-xs"
                />
              </div>
              <button
                type="button"
                onClick={handleClearKey}
                disabled={!tempSettings.apiKey || tempSettings.apiKey.trim().length === 0}
                className="flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:border-rose-900/60 dark:hover:text-rose-300 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0 shadow-xs"
                title="Clear API Key"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                <span>{t.clearKeyBtn}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400">{t.apiKeyHelp}</p>
          </div>

          {/* Scan Catalog Trigger */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => handleScanModels()}
              disabled={isScanning || !tempSettings.apiKey?.trim()}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? t.detectingModel : t.testConnectionBtn}</span>
            </button>

            {/* Auto Detect Toggle */}
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={tempSettings.autoDetectModel}
                onChange={(e) =>
                  setTempSettings({ ...tempSettings, autoDetectModel: e.target.checked })
                }
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 dark:border-slate-700 focus:ring-indigo-500"
              />
              <span>{t.autoDetectBtn}</span>
            </label>
          </div>

          {/* Scan Status Toast */}
          {scanStatus && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-center gap-2 animate-fade-in ${
                scanStatus.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                  : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
              }`}
            >
              {scanStatus.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
              )}
              <span>{scanStatus.message}</span>
            </div>
          )}

          {/* ACTIVE MODEL SECTION */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
              {t.currentModel}
            </span>

            {/* Case 1: Scanning in Progress */}
            {isScanning && (
              <div className="p-4 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/30 flex items-center gap-3 animate-pulse">
                <RefreshCw className="w-5 h-5 text-indigo-500 animate-spin flex-shrink-0" />
                <div>
                  <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200 block">
                    {t.modalStatusScanning}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {t.modalScanningSub}
                  </span>
                </div>
              </div>
            )}

            {/* Case 2: Verified Live Google Model */}
            {!isScanning && verifiedModel && (
              <div className="p-4 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-gradient-to-br from-emerald-50/50 to-teal-50/30 dark:from-emerald-950/30 dark:to-slate-900/40 flex items-center justify-between shadow-sm animate-fade-in">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-600/20 flex-shrink-0">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-slate-900 dark:text-white font-mono">
                        {verifiedModel}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        {t.modalLiveVerifiedBadge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {t.modalLiveVerifiedDesc}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Case 3: No Key or Not Connected Yet - Clean Honest State */}
            {!isScanning && !verifiedModel && (
              <div className="p-5 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 text-center flex flex-col items-center justify-center py-6">
                <div className="w-10 h-10 rounded-xl bg-slate-200/70 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-2.5">
                  <KeyRound className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t.modalNoModelTitle}
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                  {t.modalNoModelDesc}
                </p>
              </div>
            )}

          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            {t.closeBtn}
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-md shadow-indigo-600/20"
          >
            {t.saveSettingsBtn}
          </button>
        </div>

      </div>
    </div>
  );
};
