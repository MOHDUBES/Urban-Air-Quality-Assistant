// client/src/components/Layout/Header.jsx
import React, { useContext } from 'react';
import { Sun, Moon, Languages } from 'lucide-react';
import { LangContext } from '../../App';

export default function Header({ theme, lang, onToggleLang }) {
  const { t } = useContext(LangContext);
  const {
    isDark,
    toggleDark,
    setDarkMode,
    isHighContrast = false,
  } = theme;

  const handleLightClick = () => {
    if (setDarkMode) {
      setDarkMode(false);
    } else if (isDark && toggleDark) {
      toggleDark();
    }
  };

  const handleDarkClick = () => {
    if (setDarkMode) {
      setDarkMode(true);
    } else if (!isDark && toggleDark) {
      toggleDark();
    }
  };

  return (
    <header
      className="sticky top-0 z-40 backdrop-blur-md border-b shadow-xs transition-colors duration-200"
      style={{ backgroundColor: 'var(--bg-base)', borderColor: 'var(--border-subtle)' }}
    >
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
                  ? 'border-2 border-black dark:border-white'
                  : 'border border-teal-600/30 dark:border-emerald-400/40 hover:border-brand-teal'
              }`}
            />
          </a>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-black leading-tight tracking-tight truncate">
              <a
                href="/"
                className="hover:text-teal-600 dark:hover:text-teal-400 focus:outline-none focus-visible:underline transition-colors"
                style={{ color: 'var(--text-primary)' }}
              >
                {t.nav.title}
              </a>
            </h1>
            <p className="text-xs font-medium hidden sm:block tracking-normal" style={{ color: 'var(--text-muted)' }}>
              {t.nav.tagline}
            </p>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div
          className="flex items-center gap-2 flex-wrap min-w-0"
          role="toolbar"
          aria-label="Accessibility and preference controls"
        >
          {/* Language Toggle */}
          <div
            className="p-0.5 rounded-xl border flex items-center"
            style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}
          >
            <button
              type="button"
              onClick={onToggleLang}
              aria-label={`${t.common.language}: ${lang === 'en' ? 'English' : 'हिंदी'}. Switch language.`}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:text-brand-teal focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal transition-colors"
              style={{ color: 'var(--text-primary)' }}
            >
              <Languages className="w-3.5 h-3.5 text-brand-teal" aria-hidden="true" strokeWidth={1.75} />
              <span>{lang === 'en' ? 'EN' : 'हिन्दी'}</span>
            </button>
          </div>

          {/* Theme Selector (Only Sun and Moon - Chand aur Suraj) */}
          <div
            className="p-0.5 rounded-xl border flex items-center gap-0.5"
            style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}
          >
            <button
              type="button"
              onClick={handleLightClick}
              aria-label="Switch to light mode"
              aria-pressed={!isDark}
              className={`p-1.5 rounded-lg text-xs transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal ${
                !isDark
                  ? 'text-amber-500 shadow-xs font-bold'
                  : 'text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
              style={!isDark ? { backgroundColor: 'var(--bg-surface)' } : {}}
            >
              <Sun className="w-4 h-4" aria-hidden="true" strokeWidth={1.75} />
            </button>
            <button
              type="button"
              onClick={handleDarkClick}
              aria-label="Switch to dark mode"
              aria-pressed={isDark}
              className={`p-1.5 rounded-lg text-xs transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal ${
                isDark
                  ? 'text-teal-400 shadow-xs font-bold'
                  : 'text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
              style={isDark ? { backgroundColor: 'var(--bg-surface)' } : {}}
            >
              <Moon className="w-4 h-4" aria-hidden="true" strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

