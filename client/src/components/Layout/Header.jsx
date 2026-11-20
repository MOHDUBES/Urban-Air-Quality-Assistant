// client/src/components/Layout/Header.jsx
import React, { useContext } from 'react';
import { Sun, Moon, Eye, Languages } from 'lucide-react';
import { LangContext } from '../../App';

export default function Header({ theme, lang, onToggleLang }) {
  const { t } = useContext(LangContext);
  const {
    isDark,
    toggleDark,
    isHighContrast,
    toggleHighContrast,
    fontSize,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
  } = theme;

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/90 dark:bg-navy-900/90 border-b border-slate-200/80 dark:border-white/10 shadow-xs transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand: Logo + Title + Tagline */}
        <div className="flex items-center gap-3 min-w-0">
          <a
            href="/"
            aria-label="Urban Air Quality Assistant home"
            className="flex-shrink-0 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal transition-transform active:scale-95"
          >
            <img
              src="/logo-mark.svg"
              alt="Urban Air Quality Assistant home"
              width="40"
              height="40"
              className={`w-10 h-10 rounded-2xl object-contain shadow-xs transition-all ${
                isHighContrast
                  ? 'border-2 border-black dark:border-white ring-2 ring-black dark:ring-white'
                  : 'border border-teal-600/30 dark:border-emerald-400/40 hover:border-brand-teal'
              }`}
            />
          </a>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-tight tracking-tight truncate">
              <a
                href="/"
                className="hover:text-teal-700 dark:hover:text-emerald-400 focus:outline-none focus-visible:underline transition-colors"
              >
                {t.nav.title}
              </a>
            </h1>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 hidden sm:block tracking-normal">
              {t.nav.tagline}
            </p>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div
          className="flex items-center gap-2 flex-wrap"
          role="toolbar"
          aria-label="Accessibility and preference controls"
        >
          {/* Language Toggle */}
          <div className="bg-slate-100 dark:bg-navy-800/80 p-0.5 rounded-xl border border-slate-200/60 dark:border-white/10 flex items-center">
            <button
              type="button"
              onClick={onToggleLang}
              aria-label={`${t.common.language}: ${lang === 'en' ? 'English' : 'हिंदी'}. Switch language.`}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal transition-colors"
            >
              <Languages className="w-3.5 h-3.5 text-brand-teal" aria-hidden="true" strokeWidth={1.75} />
              <span>{lang === 'en' ? 'EN' : 'हिन्दी'}</span>
            </button>
          </div>

          {/* Theme Selector (Light, Dark, High-Contrast) */}
          <div className="bg-slate-100 dark:bg-navy-800/80 p-0.5 rounded-xl border border-slate-200/60 dark:border-white/10 flex items-center gap-0.5">
            <button
              type="button"
              onClick={isDark ? toggleDark : undefined}
              aria-label="Switch to light mode"
              aria-pressed={!isDark && !isHighContrast}
              className={`p-1.5 rounded-lg text-xs transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal ${
                !isDark && !isHighContrast
                  ? 'bg-white dark:bg-navy-700 text-amber-500 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Sun className="w-4 h-4" aria-hidden="true" strokeWidth={1.75} />
            </button>
            <button
              type="button"
              onClick={!isDark ? toggleDark : undefined}
              aria-label="Switch to dark mode"
              aria-pressed={isDark && !isHighContrast}
              className={`p-1.5 rounded-lg text-xs transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal ${
                isDark && !isHighContrast
                  ? 'bg-navy-700 text-teal-400 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Moon className="w-4 h-4" aria-hidden="true" strokeWidth={1.75} />
            </button>
            <button
              type="button"
              onClick={toggleHighContrast}
              aria-label={t.common.toggleContrast}
              aria-pressed={isHighContrast}
              className={`p-1.5 rounded-lg text-xs transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal ${
                isHighContrast
                  ? 'bg-black text-white dark:bg-white dark:text-black font-black ring-1 ring-black dark:ring-white'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Eye className="w-4 h-4" aria-hidden="true" strokeWidth={1.75} />
            </button>
          </div>

          {/* Text Size Segmented Control */}
          <div
            className="bg-slate-100 dark:bg-navy-800/80 p-0.5 rounded-xl border border-slate-200/60 dark:border-white/10 flex items-center"
            role="group"
            aria-label={t.common.fontSize}
          >
            <button
              type="button"
              onClick={decreaseFontSize}
              aria-label={t.common.decrease}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal ${
                fontSize === 'sm'
                  ? 'bg-white dark:bg-navy-700 text-brand-teal shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              A−
            </button>
            <button
              type="button"
              onClick={resetFontSize}
              aria-label={t.common.reset}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal ${
                fontSize === 'md'
                  ? 'bg-white dark:bg-navy-700 text-brand-teal shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              A
            </button>
            <button
              type="button"
              onClick={increaseFontSize}
              aria-label={t.common.increase}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal ${
                fontSize === 'lg' || fontSize === 'xl'
                  ? 'bg-white dark:bg-navy-700 text-brand-teal shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              A+
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
