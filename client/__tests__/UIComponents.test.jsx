// client/__tests__/UIComponents.test.jsx
import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Badge from '../src/components/UI/Badge.jsx'
import ErrorBanner from '../src/components/UI/ErrorBanner.jsx'
import LoadingSkeleton from '../src/components/UI/LoadingSkeleton.jsx'
import Footer from '../src/components/Layout/Footer.jsx'
import SkipLink from '../src/components/Layout/SkipLink.jsx'

describe('UI & Layout Core Components', () => {
  it('renders Badge with default and custom variants', () => {
    const { rerender } = render(<Badge>Default Badge</Badge>)
    expect(screen.getByText('Default Badge')).toBeInTheDocument()

    rerender(<Badge variant="success">Safe Air</Badge>)
    expect(screen.getByText('Safe Air')).toBeInTheDocument()

    rerender(<Badge variant="danger">Severe AQI</Badge>)
    expect(screen.getByText('Severe AQI')).toBeInTheDocument()
  })

  it('renders ErrorBanner with error message and retry button when onRetry provided', () => {
    render(<ErrorBanner message="Network connection failed" onRetry={() => {}} />)
    expect(screen.getByText(/Network connection failed/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Retry|Try again/i })).toBeInTheDocument()
  })

  it('renders LoadingSkeleton placeholders for accessible loading states', () => {
    const { container } = render(<LoadingSkeleton />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders Footer with medical disclaimer and copyright', () => {
    render(<Footer />)
    expect(screen.getByText(/Educational guidance only/i)).toBeInTheDocument()
    expect(screen.getByText(/Urban Air Quality Assistant/i)).toBeInTheDocument()
  })

  it('renders SkipLink pointing to #main-content for accessibility', () => {
    render(<SkipLink />)
    const link = screen.getByRole('link', { name: /Skip to main content/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '#main-content')
  })
})
