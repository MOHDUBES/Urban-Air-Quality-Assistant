// client/__tests__/Hero.test.jsx
import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Hero from '../src/components/Hero.jsx'

describe('Hero Component', () => {
  it('renders primary headline and branding text', () => {
    render(<Hero />)
    expect(screen.getByText(/Breathe Smarter During Winter Smog/i)).toBeInTheDocument()
    expect(screen.getByText(/Delhi-NCR Winter Smog & Clean Air Platform/i)).toBeInTheDocument()
  })

  it('renders key value proposition pill badges', () => {
    render(<Hero />)
    expect(screen.getByText(/WHO \+ CPCB grounded/i)).toBeInTheDocument()
    expect(screen.getByText(/Live Open-Meteo data/i)).toBeInTheDocument()
    expect(screen.getByText(/Powered by Gemini/i)).toBeInTheDocument()
  })
})
