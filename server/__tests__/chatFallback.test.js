// server/__tests__/chatFallback.test.js
// Unit tests for the intelligent fallback engine in the Chat route.

import { getChatFallbackReply } from '../routes/chat.js'

describe('Chat Fallback Reply Engine', () => {
  const sampleProfile = {
    city: 'New Delhi',
    lat: 28.6139,
    lon: 77.2090,
    householdType: 'family_kids',
    commuteMode: 'car',
    hasAirPurifier: false,
    homeType: 'apartment',
    budget: 'medium',
    language: 'en',
  }

  describe('English Responses', () => {
    test('returns DIY Corsi-Rosenthal purifier instructions when queried about purifiers or DIY', () => {
      const questions = [
        'How do I build an effective DIY air purifier?',
        'Can I make a filter box at home?',
        'What CADR rating do I need for my room?',
      ]

      for (const q of questions) {
        const reply = getChatFallbackReply(q, sampleProfile, 320, 'en')
        expect(reply).toMatch(/Corsi-Rosenthal Box/i)
        expect(reply).toMatch(/MERV-13|HEPA/i)
        expect(reply).toMatch(/box fan/i)
      }
    })

    test('returns accurate respirator guidance when queried about cloth masks or N95', () => {
      const questions = [
        'Do cloth masks protect against PM2.5?',
        'Is a surgical mask enough for smog?',
        'Should I wear an N95 or KN95 outdoors?',
      ]

      for (const q of questions) {
        const reply = getChatFallbackReply(q, sampleProfile, 350, 'en')
        expect(reply).toMatch(/cloth and surgical masks/i)
        expect(reply).toMatch(/10–30%/i)
        expect(reply).toMatch(/N95|KN95|FFP2/i)
      }
    })

    test('returns ventilation and thermal inversion guidance when queried about windows', () => {
      const questions = [
        'When should I open my apartment windows?',
        'Is it safe to ventilate the house for fresh air?',
        'What time of day has the lowest smog for opening windows?',
      ]

      for (const q of questions) {
        const reply = getChatFallbackReply(q, sampleProfile, 280, 'en')
        expect(reply).toMatch(/inversion/i)
        expect(reply).toMatch(/12:00 PM and 3:30 PM/i)
        expect(reply).toMatch(/sealed/i)
      }
    })

    test('returns outdoor safety warnings for vulnerable households when queried about going outside', () => {
      const questions = [
        'Is it safe for my family to go outside today?',
        'Can children play outdoor sports in this smog?',
        'Should I go for my morning run or walk?',
      ]

      for (const q of questions) {
        const reply = getChatFallbackReply(q, sampleProfile, 360, 'en')
        expect(reply).toMatch(/respiratory risk/i)
        expect(reply).toMatch(/Avoid outdoor/i)
        expect(reply).toMatch(/N95/i)
      }
    })

    test('returns generic protective guidance for unrecognized questions', () => {
      const reply = getChatFallbackReply('Hello, who are you?', sampleProfile, 310, 'en')
      expect(reply).toMatch(/Based on current AQI \(310\)/i)
      expect(reply).toMatch(/N95 mask outdoors/i)
    })
  })

  describe('Hindi (हिन्दी) Responses', () => {
    test('returns localized Hindi response for DIY purifier questions', () => {
      const reply = getChatFallbackReply('DIY purifier kaise banayein?', sampleProfile, 320, 'hi')
      expect(reply).toMatch(/Corsi-Rosenthal Box/i)
      expect(reply).toMatch(/MERV-13/i)
      expect(reply).toMatch(/प्यूरीफायर/i)
    })

    test('returns localized Hindi response for cloth mask questions', () => {
      const reply = getChatFallbackReply('Kya cloth mask surakshit hai?', sampleProfile, 340, 'hi')
      expect(reply).toMatch(/कपड़े के मास्क/i)
      expect(reply).toMatch(/N95/i)
    })

    test('returns localized Hindi response for window opening questions', () => {
      const reply = getChatFallbackReply('Khidki kab kholein?', sampleProfile, 310, 'hi')
      expect(reply).toMatch(/इनवर्जन/i)
      expect(reply).toMatch(/खिड़कियों/i)
    })

    test('returns localized Hindi response for outdoor safety questions', () => {
      const reply = getChatFallbackReply('Kya bache bahar khel sakte hain?', sampleProfile, 330, 'hi')
      expect(reply).toMatch(/असुरक्षित/i)
      expect(reply).toMatch(/N95/i)
    })
  })

  describe('Resilience & Edge Cases', () => {
    test('handles null or undefined message gracefully without throwing', () => {
      expect(() => getChatFallbackReply(null, sampleProfile, 200, 'en')).not.toThrow()
      expect(() => getChatFallbackReply(undefined, sampleProfile, 200, 'en')).not.toThrow()
      expect(() => getChatFallbackReply('', null, 200, 'en')).not.toThrow()
    })

    test('formats household label properly replacing underscores', () => {
      const prof = { householdType: 'working_professional' }
      const reply = getChatFallbackReply('Is it safe outside?', prof, 250, 'en')
      expect(reply).toMatch(/working professional/i)
    })
  })
})
