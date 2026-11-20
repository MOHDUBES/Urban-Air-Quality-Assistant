import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'uaqa-theme';
const FONT_SIZES = ['sm', 'md', 'lg', 'xl'];

function getInitialDark() {
  if (typeof document !== 'undefined') {
    if (document.documentElement.classList.contains('dark')) return true;
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (typeof parsed.isDark === 'boolean') return parsed.isDark;
    }
  } catch (_) {}
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return false;
}

function getInitialFontSize() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (FONT_SIZES.includes(parsed.fontSize)) return parsed.fontSize;
    }
  } catch (_) {}
  return 'md';
}

function applyClasses(isDark, fontSize) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (isDark) {
    root.classList.add('dark');
    root.setAttribute('data-theme', 'dark');
  } else {
    root.classList.remove('dark');
    root.setAttribute('data-theme', 'light');
  }
  root.classList.remove('high-contrast');
  FONT_SIZES.forEach((s) => root.classList.remove(`font-size-${s}`));
  if (fontSize) root.classList.add(`font-size-${fontSize}`);
}

export function useTheme() {
  const [isDark, setIsDark] = useState(getInitialDark);
  const [fontSize, setFontSizeState] = useState(getInitialFontSize);

  useEffect(() => {
    applyClasses(isDark, fontSize);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ isDark, isHighContrast: false, fontSize }));
    } catch (_) {}
  }, [isDark, fontSize]);

  const setDarkMode = useCallback((enableDark) => {
    const target = Boolean(enableDark);
    setIsDark(target);
    applyClasses(target, fontSize);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ isDark: target, isHighContrast: false, fontSize }));
    } catch (_) {}
  }, [fontSize]);

  const toggleDark = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      applyClasses(next, fontSize);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ isDark: next, isHighContrast: false, fontSize }));
      } catch (_) {}
      return next;
    });
  }, [fontSize]);

  const toggleHighContrast = useCallback(() => {}, []);
  const setFontSize = useCallback((size) => {
    if (FONT_SIZES.includes(size)) setFontSizeState(size);
  }, []);

  const increaseFontSize = useCallback(() => {
    setFontSizeState((prev) => {
      const idx = FONT_SIZES.indexOf(prev);
      return idx < FONT_SIZES.length - 1 ? FONT_SIZES[idx + 1] : prev;
    });
  }, []);

  const decreaseFontSize = useCallback(() => {
    setFontSizeState((prev) => {
      const idx = FONT_SIZES.indexOf(prev);
      return idx > 0 ? FONT_SIZES[idx - 1] : prev;
    });
  }, []);

  const resetFontSize = useCallback(() => setFontSizeState('md'), []);

  return {
    isDark,
    setDarkMode,
    toggleDark,
    isHighContrast: false,
    toggleHighContrast,
    fontSize,
    setFontSize,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
  };
}


