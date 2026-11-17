// client/__tests__/IndoorHacks.test.jsx
import React from 'react'
import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import IndoorHacks from '../src/components/ActionPlan/IndoorHacks.jsx'

describe('IndoorHacks Component', () => {
  const mockHacks = [
    {
      title: 'Corsi-Rosenthal Box (DIY HEPA Purifier)',
      description: 'Tape 4 MERV-13 filters around a 20-inch box fan.',
      budgetLevel: 'low',
      impact: '~60–75% indoor PM2.5 reduction in a 250 sq ft room (est.)',
      rank: 1,
    },
    {
      title: 'True HEPA Air Purifier (H13 Grade)',
      description: 'Position in the bedroom 3 feet away from walls.',
      budgetLevel: 'high',
      impact: '~85–95% reduction in indoor PM2.5 exposure overnight (est.)',
      rank: 2,
    },
  ]

  test('renders ranked hacks and budget indicators', () => {
    render(<IndoorHacks hacks={mockHacks} />)

    expect(screen.getByText(/Ranked Indoor Air Quality Hacks/i)).toBeInTheDocument()
    expect(screen.getByText('Corsi-Rosenthal Box (DIY HEPA Purifier)')).toBeInTheDocument()
    expect(screen.getByText(/Budget: Free \/ Low Cost/i)).toBeInTheDocument()
    expect(screen.getByText(/Budget: Premium HEPA/i)).toBeInTheDocument()
  })

  test('returns null when hacks array is empty or undefined', () => {
    const { container } = render(<IndoorHacks hacks={[]} />)
    expect(container.firstChild).toBeNull()
  })
})
