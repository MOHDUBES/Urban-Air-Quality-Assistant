// client/__tests__/MaskGuide.test.jsx
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import MaskGuide from '../src/components/Guide/MaskGuide.jsx'

describe('MaskGuide Component', () => {
  test('renders guide title and description', () => {
    render(<MaskGuide />)
    expect(screen.getByText('Evidence-Based Smog Defense Guide')).toBeInTheDocument()
    expect(screen.getByText(/Peer-reviewed filtration science/i)).toBeInTheDocument()
  })

  test('renders 3 navigation tabs with proper accessible roles', () => {
    render(<MaskGuide />)
    const tabs = screen.getAllByRole('tab')
    expect(tabs.length).toBe(3)
    expect(screen.getByText('N95 vs Cloth Masks')).toBeInTheDocument()
    expect(screen.getByText('DIY Corsi-Rosenthal Box')).toBeInTheDocument()
    expect(screen.getByText('NASA Plants & Ventilation')).toBeInTheDocument()
  })

  test('switching to Corsi-Rosenthal tab displays DIY box fan guide and specs', () => {
    render(<MaskGuide />)
    const corsiTab = screen.getByRole('tab', { name: /DIY Corsi-Rosenthal Box/i })
    fireEvent.click(corsiTab)

    expect(screen.getByText(/The Corsi-Rosenthal DIY Air Purifier Blueprint/i)).toBeInTheDocument()
    expect(screen.getByText(/MERV-13 furnace filters/i)).toBeInTheDocument()
  })

  test('switching to Plants Reality tab displays scientifically grounded plant limitations', () => {
    render(<MaskGuide />)
    const plantsTab = screen.getByRole('tab', { name: /NASA Plants & Ventilation/i })
    fireEvent.click(plantsTab)

    expect(screen.getByText(/Indoor Plants vs. Particulate Smog: Scientific Reality/i)).toBeInTheDocument()
    expect(screen.getByText(/Never rely on house plants alone during high smog alerts/i)).toBeInTheDocument()
  })
})
