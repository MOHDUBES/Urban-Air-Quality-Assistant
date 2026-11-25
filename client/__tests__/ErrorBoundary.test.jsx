// client/__tests__/ErrorBoundary.test.jsx
import React, { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import ErrorBoundary from '../src/components/UI/ErrorBoundary.jsx'

function ThrowingComponent({ shouldThrow }) {
  if (shouldThrow) {
    throw new Error('Test rendering crash')
  }
  return <div>Normal Content Loaded</div>
}

function TestContainer() {
  const [hasError, setHasError] = useState(true)
  return (
    <ErrorBoundary onReset={() => setHasError(false)}>
      <ThrowingComponent shouldThrow={hasError} />
    </ErrorBoundary>
  )
}

describe('ErrorBoundary Component', () => {
  let consoleSpy

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleSpy.mockRestore()
  })

  it('renders children safely when no error is thrown', () => {
    render(
      <ErrorBoundary>
        <div>All Systems Normal</div>
      </ErrorBoundary>
    )
    expect(screen.getByText(/All Systems Normal/i)).toBeInTheDocument()
  })

  it('catches child crash and displays accessible error fallback', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText(/An unexpected display error occurred/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Reload Component/i })).toBeInTheDocument()
  })

  it('allows recovery via retry button when onReset callback is provided', async () => {
    const user = userEvent.setup()
    render(<TestContainer />)

    expect(screen.getByText(/An unexpected display error occurred/i)).toBeInTheDocument()

    const retryBtn = screen.getByRole('button', { name: /Reload Component/i })
    await user.click(retryBtn)

    expect(screen.getByText(/Normal Content Loaded/i)).toBeInTheDocument()
  })
})
