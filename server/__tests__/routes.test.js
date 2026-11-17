// server/__tests__/routes.test.js
// Integration tests for Express routes using supertest.

import request from 'supertest'
import app from '../index.js'

describe('Server API Endpoints', () => {
  describe('GET /api/health', () => {
    test('returns 200 with status ok', async () => {
      const res = await request(app).get('/api/health')
      expect(res.status).toBe(200)
      expect(res.body.status).toBe('ok')
      expect(res.body.timestamp).toBeDefined()
    })
  })

  describe('GET /api/aqi', () => {
    test('returns 400 when missing city and lat/lon query params', async () => {
      const res = await request(app).get('/api/aqi')
      expect(res.status).toBe(400)
      expect(res.body.code).toBe('VALIDATION_ERROR')
    })

    test('returns 400 when lat/lon are out of range', async () => {
      const res = await request(app).get('/api/aqi?lat=999&lon=999')
      expect(res.status).toBe(400)
      expect(res.body.code).toBe('VALIDATION_ERROR')
    })
  })

  describe('POST /api/aqi/manual', () => {
    test('returns manual AQI payload when given valid data', async () => {
      const res = await request(app)
        .post('/api/aqi/manual')
        .send({ aqi: 240, pm25: 120, pm10: 180 })

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data.aqi).toBe(240)
      expect(res.body.data.pm25).toBe(120)
      expect(res.body.data.manual).toBe(true)
    })

    test('rejects negative AQI with 400', async () => {
      const res = await request(app)
        .post('/api/aqi/manual')
        .send({ aqi: -10 })

      expect(res.status).toBe(400)
      expect(res.body.code).toBe('VALIDATION_ERROR')
    })
  })

  describe('POST /api/plan', () => {
    test('rejects empty body with 400', async () => {
      const res = await request(app).post('/api/plan').send({})
      expect(res.status).toBe(400)
      expect(res.body.code).toBe('VALIDATION_ERROR')
    })

    test('returns 200 and falls back to deterministic engine if Gemini fails or lacks key', async () => {
      const validPayload = {
        profile: {
          city: 'New Delhi',
          lat: 28.6139,
          lon: 77.2090,
          householdType: 'asthma',
          commuteMode: 'metro_bus',
          hasAirPurifier: true,
          homeType: 'apartment',
          budget: 'medium',
          language: 'en',
        },
        aqiOverride: {
          aqi: 320,
          pm25: 160,
          pm10: 220,
        },
      }

      const res = await request(app).post('/api/plan').send(validPayload)
      expect(res.status).toBe(200)
      expect(res.body.plan).toBeDefined()
      expect(res.body.plan.summary).toBeDefined()
      expect(res.body.plan.dailyRoutine).toBeDefined()
      expect(res.body.plan.indoorHacks).toBeDefined()
      expect(res.body.source).toBeDefined()
    })
  })

  describe('POST /api/whatif', () => {
    test('evaluates what-if scenario with 200 response', async () => {
      const payload = {
        profile: {
          city: 'Noida',
          lat: 28.5355,
          lon: 77.3910,
          householdType: 'family_kids',
          commuteMode: 'car',
          hasAirPurifier: false,
          homeType: 'independent',
          budget: 'medium',
        },
        aqi: 280,
        choices: {
          switchToMetro: true,
          useN95: true,
          runPurifier: true,
          avoidMorningWalk: true,
          cookWithGas: true,
          workFromHome: false,
        },
      }

      const res = await request(app).post('/api/whatif').send(payload)
      expect(res.status).toBe(200)
      expect(res.body.result).toBeDefined()
      expect(res.body.result.estimatedReduction).toBeDefined()
    })
  })

  describe('POST /api/chat', () => {
    test('returns answer and medical safety disclaimer', async () => {
      const payload = {
        message: 'Is it safe for my 5-year-old child to play outdoors this morning?',
        profile: {
          city: 'Gurugram',
          lat: 28.4595,
          lon: 77.0266,
          householdType: 'family_kids',
          commuteMode: 'car',
          hasAirPurifier: false,
          homeType: 'apartment',
          budget: 'low',
        },
        aqi: 310,
        history: [],
      }

      const res = await request(app).post('/api/chat').send(payload)
      expect(res.status).toBe(200)
      expect(res.body.reply || res.body.response).toBeDefined()
      expect(res.body.disclaimer).toMatch(/not medical advice/i)
    })
  })
})
