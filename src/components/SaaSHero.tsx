import React from 'react';
import { SupportedLanguage } from '../types';
import { translations } from '../i18n/translations';
import {
  ArrowRight,
  Layers,
  Smile,
  Zap,
  ShieldCheck
} from 'lucide-react';

interface SaaSHeroProps {
  language: SupportedLanguage;
  onLaunchWorkspace: () => void;
  discoveredModelName?: string;
}

export const SaaSHero: React.FC<SaaSHeroProps> = ({
  language,
  onLaunchWorkspace,
}) => {
  const t = translations[language];

  return (
    <section className="relative overflow-hidden pt-10 pb-12 lg:pt-14 lg:pb-16">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[250px] bg-gradient-to-tr from-sky-500/10 via-indigo-500/10 to-purple-500/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white max-w-3xl mx-auto leading-tight">
          <span>{t.heroTitle1} </span>
          <span className="bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
            {t.heroTitleGradient}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {t.heroSubtitle}
        </p>

        {/* Action Button - Single Clean Primary CTA */}
        <div className="mt-6 flex items-center justify-center">
          <button
            type="button"
            onClick={onLaunchWorkspace}
            className="flex items-center justify-center gap-2 px-7 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 hover:from-sky-500 hover:to-purple-500 shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>{t.heroCtaUpload}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Quantitative Metrics Grid with High-End Glassmorphism & Hover Animations */}
        <div className="mt-10 pt-8 border-t border-slate-200/80 dark:border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          
          {/* Card 1: Batch Capacity */}
          <div className="group relative p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-sky-500/50 hover:shadow-xl hover:shadow-sky-500/10 overflow-hidden cursor-default">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div className="relative">
              <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-xs">
                <Layers className="w-4 h-4" />
              </div>
              <div className="text-lg font-black text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                {t.heroMetricImages}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {t.heroMetricImagesSub}
              </div>
            </div>
          </div>

          {/* Card 2: 100% Emoji Fidelity */}
          <div className="group relative p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/10 overflow-hidden cursor-default">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div className="relative">
              <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-xs">
                <Smile className="w-4 h-4" />
              </div>
              <div className="text-lg font-black text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                {t.heroMetricEmoji}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {t.heroMetricEmojiSub}
              </div>
            </div>
          </div>

          {/* Card 3: Sub-Second Latency */}
          <div className="group relative p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/10 overflow-hidden cursor-default">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div className="relative">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-xs">
                <Zap className="w-4 h-4" />
              </div>
              <div className="text-lg font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {t.heroMetricLatency}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {t.heroMetricLatencySub}
              </div>
            </div>
          </div>

          {/* Card 4: Smart Discovery */}
          <div className="group relative p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 overflow-hidden cursor-default">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div className="relative">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-xs">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-lg font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {t.heroMetricLongevity}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {t.heroMetricLongevitySub}
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
