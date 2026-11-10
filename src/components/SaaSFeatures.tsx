import React from 'react';
import { SupportedLanguage } from '../types';
import { translations } from '../i18n/translations';
import {
  Cpu,
  Smile,
  Zap,
  ShieldCheck,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

interface SaaSFeaturesProps {
  language: SupportedLanguage;
}

export const SaaSFeatures: React.FC<SaaSFeaturesProps> = ({ language }) => {
  const t = translations[language];

  const features = [
    {
      icon: Cpu,
      gradient: 'from-sky-500 to-indigo-600',
      glowColor: 'group-hover:shadow-sky-500/20',
      tag: t.f1Tag,
      tagColor: 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 border-sky-200 dark:border-sky-800',
      dotColor: 'bg-sky-500',
      title: t.f1Title,
      desc: t.f1Desc
    },
    {
      icon: Smile,
      gradient: 'from-amber-500 to-rose-600',
      glowColor: 'group-hover:shadow-amber-500/20',
      tag: t.f2Tag,
      tagColor: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800',
      dotColor: 'bg-amber-500',
      title: t.f2Title,
      desc: t.f2Desc
    },
    {
      icon: Zap,
      gradient: 'from-indigo-500 to-purple-600',
      glowColor: 'group-hover:shadow-indigo-500/20',
      tag: t.f3Tag,
      tagColor: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800',
      dotColor: 'bg-indigo-500',
      title: t.f3Title,
      desc: t.f3Desc
    },
    {
      icon: ShieldCheck,
      gradient: 'from-emerald-500 to-teal-600',
      glowColor: 'group-hover:shadow-emerald-500/20',
      tag: t.f5Tag,
      tagColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800',
      dotColor: 'bg-emerald-500',
      title: t.f5Title,
      desc: t.f5Desc
    }
  ];

  return (
    <section id="features" className="relative py-14 lg:py-20 border-t border-slate-200/80 dark:border-slate-800/80 overflow-hidden">
      {/* Background Decorative Ambient Radial Gradients */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-sky-500/5 dark:bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800/60 mb-3 shadow-sm hover:scale-105 transition-transform duration-200 cursor-default">
            <Sparkles className="w-3.5 h-3.5 text-sky-500 animate-pulse" />
            {t.navFeatures}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            {t.featuresTitle}
          </h2>
          <p className="mt-2.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            {t.featuresSubtitle}
          </p>
        </div>

        {/* 4 Cards with Modern Glassmorphism & Hover Animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className={`group relative p-6 rounded-3xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/90 hover:border-sky-500/40 dark:hover:border-sky-500/40 transition-all duration-300 hover:-translate-y-1.5 shadow-sm hover:shadow-xl ${f.glowColor} overflow-hidden`}
              >
                {/* Subtle Inner Glow on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent dark:from-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="relative flex items-center justify-between mb-4">
                  {/* Icon Container with Gradient and Elevation */}
                  <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${f.gradient} flex items-center justify-center text-white shadow-md shadow-slate-900/10 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Clean Pill Tag with Pulse Dot */}
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${f.tagColor} shadow-xs`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${f.dotColor} animate-pulse`} />
                    {f.tag}
                  </span>
                </div>

                {/* Card Title with Hover Color Transition */}
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors flex items-center justify-between">
                  <span>{f.title}</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-sky-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all opacity-0 group-hover:opacity-100" />
                </h3>

                {/* Card Description */}
                <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
