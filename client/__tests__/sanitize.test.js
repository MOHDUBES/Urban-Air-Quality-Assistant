// client/__tests__/sanitize.test.js
import { describe, test, expect } from 'vitest'
import { sanitizeText, truncate } from '../src/utils/sanitize.js'

describe('sanitize utility', () => {
  describe('sanitizeText', () => {
    test('strips HTML script tags and malicious payloads', () => {
      const malicious = '<script>alert("xss")</script>Clean text'
      expect(sanitizeText(malicious)).toBe('Clean text')
    })

    test('strips standard HTML formatting tags', () => {
      const html = '<div class="alert"><b>Warning:</b> Hazardous AQI</div>'
      expect(sanitizeText(html)).toBe('Warning: Hazardous AQI')
    })

    test('handles empty and non-string inputs safely', () => {
      expect(sanitizeText('')).toBe('')
      expect(sanitizeText(null)).toBe('')
      expect(sanitizeText(undefined)).toBe('')
    })
  })

  describe('truncate', () => {
    test('truncates strings exceeding max length with ellipsis', () => {
      const longText = 'The air quality in New Delhi is extremely hazardous today.'
      expect(truncate(longText, 20)).toBe('The air quality in N…')
    })

    test('leaves strings shorter than max intact', () => {
      const shortText = 'Clean air'
      expect(truncate(shortText, 20)).toBe('Clean air')
    })
  })
})
