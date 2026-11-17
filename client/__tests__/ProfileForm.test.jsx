// client/__tests__/ProfileForm.test.jsx
import React from 'react'
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ProfileForm from '../src/components/Onboarding/ProfileForm.jsx'
import { LangContext } from '../src/App.jsx'
import en from '../src/i18n/en.js'

describe('ProfileForm Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  const renderWithContext = (props = {}) => {
    return render(
      <LangContext.Provider value={{ t: en, lang: 'en', toggleLang: vi.fn() }}>
        <ProfileForm onSubmit={vi.fn()} {...props} />
      </LangContext.Provider>
    )
  }

  test('renders all form inputs and accessible labels', () => {
    renderWithContext()

    expect(screen.getByLabelText(/City Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Household Type/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Primary Commute/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Dwelling Type/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Intervention Budget/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/I already have an active Air Purifier/i)).toBeInTheDocument()
  })

  test('selecting a sample preset populates the form', () => {
    renderWithContext()

    const presetButton = screen.getByText(/Asthmatic Senior \(Delhi\)/i)
    fireEvent.click(presetButton)

    const cityInput = screen.getByLabelText(/City Name/i)
    expect(cityInput.value).toBe('New Delhi')
  })

  test('shows validation error when city is empty', async () => {
    renderWithContext()

    const cityInput = screen.getByLabelText(/City Name/i)
    fireEvent.change(cityInput, { target: { value: '' } })

    const submitBtn = screen.getByRole('button', { name: /Generate Personalized Smog Action Plan/i })
    fireEvent.click(submitBtn)

    expect(await screen.findByText(/Please enter a valid city name/i)).toBeInTheDocument()
  })
})
