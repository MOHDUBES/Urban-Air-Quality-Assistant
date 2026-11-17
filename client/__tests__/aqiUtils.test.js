// client/__tests__/aqiUtils.test.js
import { describe, test, expect } from 'vitest'
import {
  getAqiCategory,
  getAqiLabel,
  formatAqi,
  getAqiAriaLabel,
} from '../src/utils/aqiUtils.js'

describe('aqiUtils', () => {
  describe('getAqiCategory', () => {
    test('AQI 25 returns Good category', () => {
      const cat = getAqiCategory(25)
      expect(cat.id).toBe('good')
      expect(cat.label).toBe('Good')
    })

    test('AQI 75 returns Satisfactory category', () => {
      const cat = getAqiCategory(75)
      expect(cat.id).toBe('satisfactory')
    })

    test('AQI 150 returns Moderate category', () => {
      const cat = getAqiCategory(150)
      expect(cat.id).toBe('moderate')
    })

    test('AQI 250 returns Poor category', () => {
      const cat = getAqiCategory(250)
      expect(cat.id).toBe('poor')
    })

    test('AQI 350 returns Very Poor category', () => {
      const cat = getAqiCategory(350)
      expect(cat.id).toBe('very_poor')
    })

    test('AQI 450 returns Severe category', () => {
      const cat = getAqiCategory(450)
      expect(cat.id).toBe('severe')
    })

    test('edge cases: 0, 50, 51, 500, 999', () => {
      expect(getAqiCategory(0).id).toBe('good')
      expect(getAqiCategory(50).id).toBe('good')
      expect(getAqiCategory(51).id).toBe('satisfactory')
      expect(getAqiCategory(500).id).toBe('severe')
      expect(getAqiCategory(999).id).toBe('severe')
    })
  })

  describe('getAqiLabel', () => {
    test('returns English and Hindi labels', () => {
      expect(getAqiLabel(450, 'en')).toBe('Severe')
      expect(getAqiLabel(450, 'hi')).toBe('गंभीर')
    })
  })

  describe('formatAqi', () => {
    test('formats numbers as 3-digit padded strings', () => {
      expect(formatAqi(45)).toBe('045')
      expect(formatAqi(320)).toBe('320')
      expect(formatAqi(null)).toBe('---')
    })
  })

  describe('getAqiAriaLabel', () => {
    test('returns descriptive accessibility text for screen readers', () => {
      const cat = getAqiCategory(280)
      const aria = getAqiAriaLabel(280, cat, 'en')
      expect(aria).toContain('Air Quality Index: 280')
      expect(aria).toContain('Category: Poor')
    })
  })
})
