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
    <header
      className="sticky top-0 z-40 backdrop-blur-md border-b shadow-xs transition-colors duration-200"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--bg-surface) 92%, transparent)',
        borderColor: 'var(--border-subtle)',
      }}
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
                  ? 'border-2 border-[var(--text-primary)]'
                  : 'border border-teal-600/30 hover:border-brand-teal'
              }`}
            />
          </a>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-black leading-tight tracking-tight truncate" style={{ color: 'var(--text-primary)' }}>
              <a
                href="/"
                className="hover:text-teal-600 dark:hover:text-teal-400 focus:outline-none focus-visible:underline transition-colors"
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
            className="p-0.5 rounded-xl flex items-center"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
          >
            <button
              type="button"
              onClick={onToggleLang}
              aria-label={`${t.common.language}: ${lang === 'en' ? 'English' : 'हिंदी'}. Switch language.`}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal transition-colors"
              style={{ color: 'var(--text-secondary)' }}
            >
              <Languages className="w-3.5 h-3.5 text-brand-teal" aria-hidden="true" strokeWidth={1.75} />
              <span>{lang === 'en' ? 'EN' : 'हिन्दी'}</span>
            </button>
          </div>

          {/* Theme Selector (Light, Dark, High-Contrast) */}
          <div
            className="p-0.5 rounded-xl flex items-center gap-0.5"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
          >
            <button
              type="button"
              onClick={isDark ? toggleDark : undefined}
              aria-label="Switch to light mode"
              aria-pressed={!isDark && !isHighContrast}
              className="p-1.5 rounded-lg text-xs transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
              style={
                !isDark && !isHighContrast
                  ? { background: 'var(--bg-surface)', color: '#F59E0B', fontWeight: 700, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }
                  : { color: 'var(--text-muted)' }
              }
            >
              <Sun className="w-4 h-4" aria-hidden="true" strokeWidth={1.75} />
            </button>
            <button
              type="button"
              onClick={!isDark ? toggleDark : undefined}
              aria-label="Switch to dark mode"
              aria-pressed={isDark && !isHighContrast}
              className="p-1.5 rounded-lg text-xs transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
              style={
                isDark && !isHighContrast
                  ? { background: '#1A2A47', color: '#2DD4BF', fontWeight: 700, boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }
                  : { color: 'var(--text-muted)' }
              }
            >
              <Moon className="w-4 h-4" aria-hidden="true" strokeWidth={1.75} />
            </button>
            <button
              type="button"
              onClick={toggleHighContrast}
              aria-label={t.common.toggleContrast}
              aria-pressed={isHighContrast}
              className="p-1.5 rounded-lg text-xs transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
              style={
                isHighContrast
                  ? { background: 'var(--accent)', color: 'var(--accent-fg)', fontWeight: 900, outline: '1px solid var(--text-primary)' }
                  : { color: 'var(--text-muted)' }
              }
            >
              <Eye className="w-4 h-4" aria-hidden="true" strokeWidth={1.75} />
            </button>
          </div>

          {/* Text Size Segmented Control */}
          <div
            className="p-0.5 rounded-xl flex items-center"
            role="group"
            aria-label={t.common.fontSize}
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
          >
            <button
              type="button"
              onClick={decreaseFontSize}
              aria-label={t.common.decrease}
              className="px-2 py-1 rounded-lg text-xs font-bold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
              style={
                fontSize === 'sm'
                  ? { background: 'var(--bg-surface)', color: '#14B8A6', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }
                  : { color: 'var(--text-muted)' }
              }
            >
              A−
            </button>
            <button
              type="button"
              onClick={resetFontSize}
              aria-label={t.common.reset}
              className="px-2 py-1 rounded-lg text-xs font-bold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
              style={
                fontSize === 'md'
                  ? { background: 'var(--bg-surface)', color: '#14B8A6', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }
                  : { color: 'var(--text-muted)' }
              }
            >
              A
            </button>
            <button
              type="button"
              onClick={increaseFontSize}
              aria-label={t.common.increase}
              className="px-2 py-1 rounded-lg text-xs font-bold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
              style={
                fontSize === 'lg' || fontSize === 'xl'
                  ? { background: 'var(--bg-surface)', color: '#14B8A6', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }
                  : { color: 'var(--text-muted)' }
              }
            >
              A+
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
