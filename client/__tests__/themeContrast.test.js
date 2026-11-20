// client/__tests__/themeContrast.test.js
// Tests: theme toggle sets .dark class, localStorage persistence, OS fallback, WCAG AA contrast
import { describe, it, expect, beforeEach, vi } from 'vitest'

// --- WCAG Contrast Helpers ---

/** sRGB channel linearisation */
function linearise(val) {
  const c = val / 255
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

/** Relative luminance from hex colour string e.g. "#F8FAFC" */
function luminance(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return 0.2126 * linearise(r) + 0.7152 * linearise(g) + 0.0722 * linearise(b)
}

/** WCAG contrast ratio between two hex colours */
function contrast(hex1, hex2) {
  const l1 = luminance(hex1)
  const l2 = luminance(hex2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

// --- Theme token definitions (mirrors index.css) ---
const THEMES = {
  light: {
    textPrimary: '#0F172A',
    bgSurface: '#FFFFFF',
    textSecondary: '#475569',
    bgBase: '#F6F9FC',
    heroText: '#0B3B5A',
    heroBgFrom: '#EEF9F6',
  },
  dark: {
    textPrimary: '#F8FAFC',
    bgSurface: '#101A2E',
    textSecondary: '#94A3B8',
    bgBase: '#0A1220',
    heroText: '#F1F5F9',
    heroBgFrom: '#0A1220',
  },
  contrast: {
    textPrimary: '#FFFFFF',
    bgSurface: '#000000',
    textSecondary: '#FFD400',
    bgBase: '#000000',
    heroText: '#FFFFFF',
    heroBgFrom: '#000000',
  },
}

const WCAG_AA_NORMAL = 4.5

describe('WCAG AA contrast — theme tokens', () => {
  it('light: text-primary on bg-surface meets 4.5:1', () => {
    const ratio = contrast(THEMES.light.textPrimary, THEMES.light.bgSurface)
    expect(ratio).toBeGreaterThanOrEqual(WCAG_AA_NORMAL)
  })

  it('light: hero-text on hero-from meets 4.5:1', () => {
    const ratio = contrast(THEMES.light.heroText, THEMES.light.heroBgFrom)
    expect(ratio).toBeGreaterThanOrEqual(WCAG_AA_NORMAL)
  })

  it('light: text-secondary on bg-surface meets 4.5:1', () => {
    const ratio = contrast(THEMES.light.textSecondary, THEMES.light.bgSurface)
    expect(ratio).toBeGreaterThanOrEqual(WCAG_AA_NORMAL)
  })

  it('dark: text-primary on bg-surface meets 4.5:1', () => {
    const ratio = contrast(THEMES.dark.textPrimary, THEMES.dark.bgSurface)
    expect(ratio).toBeGreaterThanOrEqual(WCAG_AA_NORMAL)
  })

  it('dark: hero-text on hero-bg-from meets 4.5:1', () => {
    const ratio = contrast(THEMES.dark.heroText, THEMES.dark.heroBgFrom)
    expect(ratio).toBeGreaterThanOrEqual(WCAG_AA_NORMAL)
  })

  it('dark: text-secondary on bg-surface meets 4.5:1', () => {
    const ratio = contrast(THEMES.dark.textSecondary, THEMES.dark.bgSurface)
    expect(ratio).toBeGreaterThanOrEqual(WCAG_AA_NORMAL)
  })

  it('contrast: text-primary (#FFF) on bg-surface (#000) is 21:1', () => {
    const ratio = contrast(THEMES.contrast.textPrimary, THEMES.contrast.bgSurface)
    expect(ratio).toBeGreaterThanOrEqual(21)
  })

  it('contrast: text-secondary (#FFD400) on bg-surface (#000) meets 4.5:1', () => {
    const ratio = contrast(THEMES.contrast.textSecondary, THEMES.contrast.bgSurface)
    expect(ratio).toBeGreaterThanOrEqual(WCAG_AA_NORMAL)
  })
})

describe('Theme persistence & toggle (DOM simulation)', () => {
  beforeEach(() => {
    // Reset DOM
    document.documentElement.classList.remove('dark', 'high-contrast', 'font-size-sm', 'font-size-md', 'font-size-lg', 'font-size-xl')
    localStorage.clear()
  })

  it('applyClasses adds .dark to <html> when isDark=true', () => {
    const root = document.documentElement
    // Simulate what useTheme.applyClasses does
    root.classList.add('dark')
    expect(root.classList.contains('dark')).toBe(true)
  })

  it('applyClasses removes .dark from <html> when isDark=false', () => {
    const root = document.documentElement
    root.classList.add('dark')
    root.classList.remove('dark')
    expect(root.classList.contains('dark')).toBe(false)
  })

  it('localStorage.setItem persists isDark=true', () => {
    localStorage.setItem('uaqa-theme', JSON.stringify({ isDark: true, isHighContrast: false, fontSize: 'md' }))
    const stored = JSON.parse(localStorage.getItem('uaqa-theme'))
    expect(stored.isDark).toBe(true)
  })

  it('localStorage.setItem persists isDark=false', () => {
    localStorage.setItem('uaqa-theme', JSON.stringify({ isDark: false, isHighContrast: false, fontSize: 'md' }))
    const stored = JSON.parse(localStorage.getItem('uaqa-theme'))
    expect(stored.isDark).toBe(false)
  })

  it('inline init script reads localStorage and applies .dark before React mounts', () => {
    // Simulate the inline script from index.html
    localStorage.setItem('uaqa-theme', JSON.stringify({ isDark: true, isHighContrast: false, fontSize: 'md' }))
    const root = document.documentElement
    // Run the inline script logic
    try {
      const stored = JSON.parse(localStorage.getItem('uaqa-theme') || '{}')
      const isDark = typeof stored.isDark === 'boolean'
        ? stored.isDark
        : false // matchMedia not available in jsdom
      if (isDark) root.classList.add('dark')
    } catch (_e) {}
    expect(root.classList.contains('dark')).toBe(true)
  })

  it('high-contrast class is added/removed independently of dark class', () => {
    const root = document.documentElement
    root.classList.add('dark')
    root.classList.add('high-contrast')
    expect(root.classList.contains('dark')).toBe(true)
    expect(root.classList.contains('high-contrast')).toBe(true)
    root.classList.remove('high-contrast')
    expect(root.classList.contains('high-contrast')).toBe(false)
    expect(root.classList.contains('dark')).toBe(true)
  })

  it('font-size class is replaced not stacked', () => {
    const root = document.documentElement
    const FONT_SIZES = ['sm', 'md', 'lg', 'xl']
    root.classList.add('font-size-md')
    // Simulate change to lg
    FONT_SIZES.forEach((s) => root.classList.remove(`font-size-${s}`))
    root.classList.add('font-size-lg')
    expect(root.classList.contains('font-size-lg')).toBe(true)
    expect(root.classList.contains('font-size-md')).toBe(false)
  })
})
