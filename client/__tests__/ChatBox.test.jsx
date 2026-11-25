// client/__tests__/ChatBox.test.jsx
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, test, expect, vi } from 'vitest'
import ChatBox from '../src/components/Chat/ChatBox.jsx'

describe('ChatBox Component', () => {
  const mockProfile = { city: 'Noida', householdType: 'family_kids' }
  const mockMessages = [
    { role: 'user', content: 'What air purifier CADR rating do I need for my bedroom?' },
    { role: 'assistant', content: 'For a 200 sq ft room, look for at least 150 CFM CADR rating.', disclaimer: '⚠️ Not medical advice' },
  ]

  test('renders header with title, city context, and empty state', () => {
    render(
      <ChatBox
        onSendMessage={vi.fn()}
        messages={[]}
        loading={false}
        currentAqi={320}
        profile={mockProfile}
      />
    )

    expect(screen.getByText('Smog Advisor Assistant')).toBeInTheDocument()
    expect(screen.getByText(/Noida/i)).toBeInTheDocument()
    expect(screen.getByText(/How can I help you navigate today's air quality\?/i)).toBeInTheDocument()
  })

  test('renders message history and medical disclaimer correctly', () => {
    render(
      <ChatBox
        onSendMessage={vi.fn()}
        messages={mockMessages}
        loading={false}
        currentAqi={320}
        profile={mockProfile}
      />
    )

    expect(screen.getByText('What air purifier CADR rating do I need for my bedroom?')).toBeInTheDocument()
    expect(screen.getByText(/For a 200 sq ft room, look for at least 150 CFM/i)).toBeInTheDocument()
  })

  test('clicking a suggested question triggers onSendMessage', () => {
    const handleSend = vi.fn()
    render(
      <ChatBox
        onSendMessage={handleSend}
        messages={[]}
        loading={false}
        currentAqi={320}
        profile={mockProfile}
      />
    )

    const suggestedBtn = screen.getByText('Do cloth masks protect against PM2.5?')
    fireEvent.click(suggestedBtn)
    expect(handleSend).toHaveBeenCalledWith('Do cloth masks protect against PM2.5?')
  })

  test('submitting custom text through form sends message and clears input', () => {
    const handleSend = vi.fn()
    render(
      <ChatBox
        onSendMessage={handleSend}
        messages={[]}
        loading={false}
        currentAqi={320}
        profile={mockProfile}
      />
    )

    const input = screen.getByPlaceholderText(/Ask about air purifiers/i)
    fireEvent.change(input, { target: { value: 'How to seal apartment windows?' } })
    const submitBtn = screen.getByLabelText(/Send message/i)
    fireEvent.click(submitBtn)

    expect(handleSend).toHaveBeenCalledWith('How to seal apartment windows?')
    expect(input.value).toBe('')
  })

  test('renders reset button when messages exist and calls onClearChat', () => {
    const handleClear = vi.fn()
    render(
      <ChatBox
        onSendMessage={vi.fn()}
        messages={mockMessages}
        loading={false}
        onClearChat={handleClear}
        currentAqi={320}
        profile={mockProfile}
      />
    )

    const resetBtn = screen.getByTitle('Reset conversation')
    fireEvent.click(resetBtn)
    expect(handleClear).toHaveBeenCalled()
  })
})
