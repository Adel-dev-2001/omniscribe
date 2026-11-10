import React, { useState, useRef, useEffect } from 'react';
import { Logo } from './Logo';
import { SupportedLanguage, AppSettings } from '../types';
import { translations } from '../i18n/translations';
import {
  KeyRound,
  Moon,
  Sun,
  CheckCircle2,
  Globe,
  ChevronDown,
  Check
} from 'lucide-react';

interface HeaderProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onOpenModelModal: () => void;
  isDetectingModel?: boolean;
  discoveredModelName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  onUpdateSettings,
  onOpenModelModal,
}) => {
  const t = translations[settings.language];
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageSelect = (lang: SupportedLanguage) => {
    onUpdateSettings({ language: lang });
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    setIsLangDropdownOpen(false);
  };

  const toggleDarkMode = () => {
    const nextMode = !settings.darkMode;
    onUpdateSettings({ darkMode: nextMode });
    if (nextMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const hasApiKey = Boolean(
    settings.apiKey &&
    settings.apiKey.trim().length > 0 &&
    settings.selectedModel &&
    settings.selectedModel.trim().length > 0
  );

  const languageOptions: { code: SupportedLanguage; label: string }[] = [
    { code: 'en', label: 'EN' },
    { code: 'ru', label: 'RU' },
    { code: 'ar', label: 'AR' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-[#070A11]/90 backdrop-blur-md transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Name - OmniScribe */}
          <div className="flex items-center gap-2.5">
            <a href="#" className="flex items-center gap-2.5 group">
              <Logo size={32} />
              <span className="text-lg font-black tracking-tight bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
                OmniScribe
              </span>
            </a>
          </div>

          {/* Clean Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <a href="#studio" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
              {t.navWorkspace}
            </a>
            <a href="#features" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
              {t.navFeatures}
            </a>
            <a href="#faq" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
              {t.navFaq}
            </a>
          </nav>

          {/* Right Action Controls - Single Row */}
          <div className="flex items-center gap-2">
            
            {/* API Key & Model Status Pill (Opens Settings & Model Discovery) */}
            <button
              onClick={onOpenModelModal}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all shadow-sm ${
                hasApiKey
                  ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                  : 'border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100'
              }`}
              title="Click to configure Google Gemini API Key and discover models"
            >
              {hasApiKey ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                  <span className="hidden sm:inline font-mono font-bold">
                    {settings.selectedModel}
                  </span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                </>
              ) : (
                <>
                  <KeyRound className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                  <span className="hidden sm:inline">
                    {t.setApiKeyBtn}
                  </span>
                </>
              )}
            </button>

            {/* Professional Language Dropdown Menu (Letters Only: EN / RU / AR) */}
            <div className="relative" ref={langDropdownRef}>
              <button
                type="button"
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-all shadow-sm"
                title="Select Interface Language"
              >
                <Globe className="w-3.5 h-3.5 text-sky-500" />
                <span className="font-mono">{settings.language.toUpperCase()}</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Floating Dropdown */}
              {isLangDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-24 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-50 backdrop-blur-md animate-fade-in">
                  {languageOptions.map((opt) => {
                    const isSelected = settings.language === opt.code;
                    return (
                      <button
                        key={opt.code}
                        type="button"
                        onClick={() => handleLanguageSelect(opt.code)}
                        className={`w-full px-3 py-1.5 text-xs font-mono font-bold flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-sky-500" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all"
              aria-label="Toggle Theme"
            >
              {settings.darkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
