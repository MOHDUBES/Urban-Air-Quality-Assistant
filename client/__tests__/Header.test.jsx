// client/__tests__/Header.test.jsx
import React from 'react'
import { describe, test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Header from '../src/components/Layout/Header.jsx'
import { LangContext } from '../src/App.jsx'
import en from '../src/i18n/en.js'

describe('Header Component', () => {
  const defaultTheme = {
    isDark: false,
    toggleDark: vi.fn(),
    isHighContrast: false,
    toggleHighContrast: vi.fn(),
    fontSize: 'normal',
    increaseFontSize: vi.fn(),
    decreaseFontSize: vi.fn(),
    resetFontSize: vi.fn(),
  }

  const renderHeader = (themeOverrides = {}) => {
    const theme = { ...defaultTheme, ...themeOverrides }
    return render(
      <LangContext.Provider value={{ t: en, lang: 'en', toggleLang: vi.fn() }}>
        <Header theme={theme} lang="en" onToggleLang={vi.fn()} />
      </LangContext.Provider>
    )
  }

  test('renders logo mark wrapped in a home link with accessible name', () => {
    renderHeader()

    // Verify the home link exists with accessible name
    const homeLink = screen.getByRole('link', { name: /Urban Air Quality Assistant home/i })
    expect(homeLink).toBeInTheDocument()
    expect(homeLink).toHaveAttribute('href', '/')

    // Verify the logo image is present inside with proper source
    const logoImg = screen.getByAltText(/Urban Air Quality Assistant home/i)
    expect(logoImg).toBeInTheDocument()
    expect(logoImg).toHaveAttribute('src', '/logo-mark.svg')
  })

  test('renders app title and tagline', () => {
    renderHeader()

    expect(screen.getByText(en.nav.title)).toBeInTheDocument()
    expect(screen.getByText(en.nav.tagline)).toBeInTheDocument()
  })

  test('applies high-contrast border styles when high contrast mode is active', () => {
    renderHeader({ isHighContrast: true })

    const logoImg = screen.getByAltText(/Urban Air Quality Assistant home/i)
    expect(logoImg.className).toContain('border-2')
  })
})
