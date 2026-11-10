import React from 'react';

export const SaaSFooter: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#070A11] py-6 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700 dark:text-slate-300">OmniScribe</span>
          <span>•</span>
          <span>© 2026 All rights reserved.</span>
        </div>
        <div className="flex items-center gap-2 font-medium">
          <span className="text-slate-700 dark:text-slate-200 font-semibold">By Adel Mohamed</span>
        </div>
      </div>
    </footer>
  );
};
