// client/__tests__/App.test.jsx
import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import App from '../src/App.jsx'

describe('App Root Integration', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders application brand, hero, and initial onboarding profile form', () => {
    render(<App />)
    expect(screen.getAllByText(/Urban Air Quality Assistant/i)[0]).toBeInTheDocument()
    expect(screen.getByText(/Breathe Smarter During Winter Smog/i)).toBeInTheDocument()
    expect(screen.getByText(/Personalize Your Smog Defense Plan/i)).toBeInTheDocument()
  })

  it('renders accessible navigation elements and skip link', () => {
    render(<App />)
    const skipLink = screen.getByRole('link', { name: /Skip to main content/i })
    expect(skipLink).toBeInTheDocument()
    expect(skipLink).toHaveAttribute('href', '#main-content')
  })
})
