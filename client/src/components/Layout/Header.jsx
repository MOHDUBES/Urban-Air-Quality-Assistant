import React, { useContext } from 'react';
import { LangContext } from '../../App';

// Sun icon for light mode
function SunIcon() {
  return (
    <svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

// Moon icon for dark mode
function MoonIcon() {
  return (
    <svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

// Contrast icon
function ContrastIcon() {
  return (
    <svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2v20" />
      <path d="M12 2a10 10 0 0 1 0 20z" fill="currentColor" />
    </svg>
  );
}

export default function Header({ theme, lang, onToggleLang }) {
  const { t } = useContext(LangContext);
  const { isDark, toggleDark, isHighContrast, toggleHighContrast, fontSize: _fontSize, increaseFontSize, decreaseFontSize, resetFontSize } = theme;

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
        {/* Logo, Title & tagline */}
        <div className="flex-1 min-w-0 flex items-center gap-3">
          <a
            href="/"
            aria-label="Urban Air Quality Assistant home"
            className="flex-shrink-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-transform active:scale-95"
          >
            <img
              src="/logo-mark.svg"
              alt="Urban Air Quality Assistant home"
              width="38"
              height="38"
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-contain shadow-xs transition-colors ${
                isHighContrast
                  ? 'border-2 border-black dark:border-white ring-1 ring-black dark:ring-white'
                  : 'border border-teal-600/30 dark:border-emerald-400/40'
              }`}
            />
          </a>
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-tight truncate">
              <a
                href="/"
                className="hover:text-teal-700 dark:hover:text-emerald-400 focus:outline-none focus:underline transition-colors"
              >
                {t.nav.title}
              </a>
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">{t.nav.tagline}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1 flex-wrap" role="toolbar" aria-label="Accessibility controls">
          {/* Language toggle */}
          <button
            onClick={onToggleLang}
            aria-label={`${t.common.language}: ${lang === 'en' ? 'English' : 'हिंदी'}. Switch language.`}
            className="px-3 py-1.5 rounded text-sm font-medium border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            {lang === 'en' ? t.common.hi : t.common.en}
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={toggleDark}
            aria-label={t.common.toggleDark}
            aria-pressed={isDark}
            className="p-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>

          {/* High contrast toggle */}
          <button
            onClick={toggleHighContrast}
            aria-label={t.common.toggleContrast}
            aria-pressed={isHighContrast}
            className={`p-1.5 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
              isHighContrast
                ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <ContrastIcon />
          </button>

          {/* Font size controls */}
          <div className="flex items-center gap-0.5" role="group" aria-label={t.common.fontSize}>
            <button
              onClick={decreaseFontSize}
              aria-label={t.common.decrease}
              className="px-2 py-1 rounded-l border border-r-0 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-bold transition-colors"
            >
              A−
            </button>
            <button
              onClick={resetFontSize}
              aria-label={t.common.reset}
              className="px-2 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-bold transition-colors"
            >
              A
            </button>
            <button
              onClick={increaseFontSize}
              aria-label={t.common.increase}
              className="px-2 py-1 rounded-r border border-l-0 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold transition-colors"
            >
              A+
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
