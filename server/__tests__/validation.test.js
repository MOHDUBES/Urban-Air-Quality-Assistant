// server/__tests__/validation.test.js
// Tests for Zod schemas in server/middleware/validation.js

import { ProfileSchema, ChatSchema, WhatIfSchema } from '../middleware/validation.js'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const validProfile = {
  city: 'Delhi',
  lat: 28.6,
  lon: 77.2,
  householdType: 'asthma',
  commuteMode: 'metro_bus',
  hasAirPurifier: true,
  homeType: 'apartment',
  budget: 'medium',
  language: 'en',
}

// ---------------------------------------------------------------------------
// ProfileSchema
// ---------------------------------------------------------------------------

describe('ProfileSchema', () => {
  test('valid input passes', () => {
    const result = ProfileSchema.safeParse(validProfile)
    expect(result.success).toBe(true)
  })

  test('city too long (>100 chars) fails', () => {
    const result = ProfileSchema.safeParse({
      ...validProfile,
      city: 'A'.repeat(101),
    })
    expect(result.success).toBe(false)
    expect(result.error.issues.some((i) => i.path.includes('city'))).toBe(true)
  })

  test('invalid householdType fails', () => {
    const result = ProfileSchema.safeParse({
      ...validProfile,
      householdType: 'alien',
    })
    expect(result.success).toBe(false)
    expect(result.error.issues.some((i) => i.path.includes('householdType'))).toBe(true)
  })

  test('lat out of range (> 90) fails', () => {
    const result = ProfileSchema.safeParse({
      ...validProfile,
      lat: 95,
    })
    expect(result.success).toBe(false)
    expect(result.error.issues.some((i) => i.path.includes('lat'))).toBe(true)
  })

  test('lat out of range (< -90) fails', () => {
    const result = ProfileSchema.safeParse({
      ...validProfile,
      lat: -91,
    })
    expect(result.success).toBe(false)
  })

  test('lon out of range (> 180) fails', () => {
    const result = ProfileSchema.safeParse({
      ...validProfile,
      lon: 181,
    })
    expect(result.success).toBe(false)
  })

  test('missing required field (city) fails', () => {
    const { city: _city, ...rest } = validProfile
    const result = ProfileSchema.safeParse(rest)
    expect(result.success).toBe(false)
  })

  test('empty city fails', () => {
    const result = ProfileSchema.safeParse({ ...validProfile, city: '' })
    expect(result.success).toBe(false)
  })

  test('invalid commuteMode fails', () => {
    const result = ProfileSchema.safeParse({ ...validProfile, commuteMode: 'rocket' })
    expect(result.success).toBe(false)
  })

  test('hasAirPurifier must be boolean', () => {
    const result = ProfileSchema.safeParse({ ...validProfile, hasAirPurifier: 'yes' })
    expect(result.success).toBe(false)
  })

  test('language defaults to en when omitted', () => {
    const { language: _language, ...rest } = validProfile
    const result = ProfileSchema.safeParse(rest)
    expect(result.success).toBe(true)
    expect(result.data.language).toBe('en')
  })
})

// ---------------------------------------------------------------------------
// ChatSchema
// ---------------------------------------------------------------------------

describe('ChatSchema', () => {
  const validChat = {
    message: 'What mask should I wear?',
    profile: validProfile,
    aqi: 220,
    history: [],
    language: 'en',
  }

  test('valid input passes', () => {
    const result = ChatSchema.safeParse(validChat)
    expect(result.success).toBe(true)
  })

  test('message too long (>500 chars) fails', () => {
    const result = ChatSchema.safeParse({
      ...validChat,
      message: 'A'.repeat(501),
    })
    expect(result.success).toBe(false)
    expect(result.error.issues.some((i) => i.path.includes('message'))).toBe(true)
  })

  test('empty message fails', () => {
    const result = ChatSchema.safeParse({ ...validChat, message: '' })
    expect(result.success).toBe(false)
  })

  test('history too long (>10 entries) fails', () => {
    const result = ChatSchema.safeParse({
      ...validChat,
      history: Array.from({ length: 11 }, (_, i) => ({
        role: 'user',
        content: `msg ${i}`,
      })),
    })
    expect(result.success).toBe(false)
    expect(result.error.issues.some((i) => i.path.includes('history'))).toBe(true)
  })

  test('history with exactly 10 entries passes', () => {
    const result = ChatSchema.safeParse({
      ...validChat,
      history: Array.from({ length: 10 }, (_, i) => ({
        role: i % 2 === 0 ? 'user' : 'assistant',
        content: `msg ${i}`,
      })),
    })
    expect(result.success).toBe(true)
  })

  test('history defaults to [] when omitted', () => {
    const { history: _history, ...rest } = validChat
    const result = ChatSchema.safeParse(rest)
    expect(result.success).toBe(true)
    expect(result.data.history).toEqual([])
  })

  test('invalid history role fails', () => {
    const result = ChatSchema.safeParse({
      ...validChat,
      history: [{ role: 'bot', content: 'hi' }],
    })
    expect(result.success).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// WhatIfSchema
// ---------------------------------------------------------------------------

describe('WhatIfSchema', () => {
  const validWhatIf = {
    profile: validProfile,
    aqi: 300,
    choices: {
      switchToMetro: true,
      useN95: false,
      runPurifier: true,
      avoidMorningWalk: false,
      cookWithGas: true,
      workFromHome: false,
    },
    language: 'en',
  }

  test('valid input passes', () => {
    const result = WhatIfSchema.safeParse(validWhatIf)
    expect(result.success).toBe(true)
  })

  test('choices default to safe values when omitted', () => {
    const result = WhatIfSchema.safeParse({
      profile: validProfile,
      aqi: 200,
      choices: {},
    })
    expect(result.success).toBe(true)
    // defaults should be booleans
    expect(typeof result.data.choices.switchToMetro).toBe('boolean')
    expect(typeof result.data.choices.useN95).toBe('boolean')
  })

  test('invalid choice type (string instead of boolean) fails', () => {
    const result = WhatIfSchema.safeParse({
      ...validWhatIf,
      choices: { ...validWhatIf.choices, switchToMetro: 'yes' },
    })
    expect(result.success).toBe(false)
  })

  test('aqi out of range fails', () => {
    const result = WhatIfSchema.safeParse({ ...validWhatIf, aqi: 1001 })
    expect(result.success).toBe(false)
  })

  test('missing profile fails', () => {
    const { profile: _profile, ...rest } = validWhatIf
    const result = WhatIfSchema.safeParse(rest)
    expect(result.success).toBe(false)
  })
})
