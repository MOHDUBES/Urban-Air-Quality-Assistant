// client/__tests__/AqiCard.test.jsx
import React from 'react'
import { describe, test, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import AqiCard from '../src/components/Dashboard/AqiCard.jsx'

describe('AqiCard Component', () => {
  const mockData = {
    aqi: 450,
    pm25: 280,
    pm10: 420,
    timestamp: '2026-11-17T12:00:00Z',
  }

  test('renders large AQI number and severe category text label', () => {
    render(<AqiCard aqiData={mockData} onManualOverride={vi.fn()} onResetManual={vi.fn()} />)
    
    expect(screen.getByText('450')).toBeInTheDocument()
    // Category label must be visible as text (not just color)
    expect(screen.getByText(/Severe AQI/i)).toBeInTheDocument()
    expect(screen.getByText(/Severe Pollution/i)).toBeInTheDocument()
  })

  test('displays PM2.5 and PM10 values', () => {
    render(<AqiCard aqiData={mockData} onManualOverride={vi.fn()} onResetManual={vi.fn()} />)

    expect(screen.getByText(/280 µg\/m³/i)).toBeInTheDocument()
    expect(screen.getByText(/420 µg\/m³/i)).toBeInTheDocument()
  })

  test('has accessible role region and aria-live attribute', () => {
    const { container } = render(
      <AqiCard aqiData={mockData} onManualOverride={vi.fn()} onResetManual={vi.fn()} />
    )
    const region = container.querySelector('[role="region"]')
    expect(region).toBeInTheDocument()
    expect(region).toHaveAttribute('aria-live', 'polite')
  })

  test('opens manual override form on button click and submits', () => {
    const handleOverride = vi.fn()
    render(<AqiCard aqiData={mockData} onManualOverride={handleOverride} onResetManual={vi.fn()} />)

    const toggleBtn = screen.getByText(/Override AQI Manually/i)
    fireEvent.click(toggleBtn)

    expect(screen.getByText(/Manual AQI Fallback Entry/i)).toBeInTheDocument()
    const applyBtn = screen.getByText(/Apply Manual Values/i)
    fireEvent.click(applyBtn)

    expect(handleOverride).toHaveBeenCalled()
  })
})
