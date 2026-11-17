import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'uaqa-theme';
const FONT_SIZES = ['sm', 'md', 'lg', 'xl'];

function getInitialDark() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (typeof parsed.isDark === 'boolean') return parsed.isDark;
    }
  } catch (_) {}
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function getInitialHighContrast() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (typeof parsed.isHighContrast === 'boolean') return parsed.isHighContrast;
    }
  } catch (_) {}
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

function applyClasses(isDark, isHighContrast, fontSize) {
  const root = document.documentElement;
  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  if (isHighContrast) {
    root.classList.add('high-contrast');
  } else {
    root.classList.remove('high-contrast');
  }
  FONT_SIZES.forEach((s) => root.classList.remove(`font-size-${s}`));
  root.classList.add(`font-size-${fontSize}`);
}

export function useTheme() {
  const [isDark, setIsDark] = useState(getInitialDark);
  const [isHighContrast, setIsHighContrast] = useState(getInitialHighContrast);
  const [fontSize, setFontSizeState] = useState(getInitialFontSize);

  useEffect(() => {
    applyClasses(isDark, isHighContrast, fontSize);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ isDark, isHighContrast, fontSize }));
    } catch (_) {}
  }, [isDark, isHighContrast, fontSize]);

  const toggleDark = useCallback(() => setIsDark((v) => !v), []);
  const toggleHighContrast = useCallback(() => setIsHighContrast((v) => !v), []);
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
    toggleDark,
    isHighContrast,
    toggleHighContrast,
    fontSize,
    setFontSize,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
  };
}
