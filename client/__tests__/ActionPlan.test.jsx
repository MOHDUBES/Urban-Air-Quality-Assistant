// client/__tests__/ActionPlan.test.jsx
import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import ActionPlan from '../src/components/ActionPlan/ActionPlan.jsx'

describe('ActionPlan Component', () => {
  const mockPlan = {
    riskLevel: 'emergency',
    summary: 'Extreme smog crisis. Avoid outdoor exposure.',
    dailyRoutine: {
      morning: { timeWindow: '6:00 AM - 9:00 AM', activity: 'Morning Commute', advice: 'Wear snug N95' },
      afternoon: { timeWindow: '12:00 PM - 3:00 PM', activity: 'Ventilation', advice: 'Crack windows briefly' },
      evening: { timeWindow: '6:00 PM - 9:00 PM', activity: 'Indoor Play', advice: 'Keep purifiers running' },
      bestOutdoorTime: '1:30 PM - 2:30 PM',
    },
    indoorHacks: [
      { rank: 1, title: 'DIY Air Purifier', description: 'Box fan with MERV-13 filter', budgetLevel: 'low', impact: '85% PM2.5 drop (est.)' },
    ],
    sustainableAlts: [
      { category: 'Commute', current: 'Solo Car', alternative: 'Metro Transit', impact: 'Reduces road exposure', co2Saved: '2.5 kg CO2/day (est.)' },
    ],
    specialAdvice: 'Keep asthma rescue inhaler nearby at all times.',
    impactExplainer: 'Thermal temperature inversion has trapped PM2.5 near the ground.',
  }

  test('renders risk badge and summary text', () => {
    render(<ActionPlan plan={mockPlan} isFallback={false} source="gemini" />)
    expect(screen.getByText('Emergency Level Risk')).toBeInTheDocument()
    expect(screen.getByText('Extreme smog crisis. Avoid outdoor exposure.')).toBeInTheDocument()
  })

  test('renders special medical / household vulnerability advice when provided', () => {
    render(<ActionPlan plan={mockPlan} isFallback={false} source="gemini" />)
    expect(screen.getByText(/Keep asthma rescue inhaler nearby/i)).toBeInTheDocument()
  })

  test('renders daily routine time windows and best outdoor time', () => {
    render(<ActionPlan plan={mockPlan} isFallback={false} source="gemini" />)
    expect(screen.getByText(/6:00 AM - 9:00 AM/i)).toBeInTheDocument()
    expect(screen.getByText(/1:30 PM - 2:30 PM/i)).toBeInTheDocument()
  })

  test('returns null when plan is undefined or null', () => {
    const { container } = render(<ActionPlan plan={null} />)
    expect(container.firstChild).toBeNull()
  })
})
