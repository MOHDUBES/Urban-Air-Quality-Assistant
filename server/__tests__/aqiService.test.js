// server/__tests__/aqiService.test.js
// Unit tests for real-time AQI computation, CPCB breakpoint interpolation, and geocoding.

import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals'
import { getAqiData, geocodeCity } from '../services/aqiService.js'
import { clearCache } from '../services/cacheService.js'

describe('AQI Service & Telemetry Engine', () => {
  const originalFetch = global.fetch

  beforeEach(() => {
    clearCache()
  })

  afterEach(() => {
    global.fetch = originalFetch
  })

  describe('geocodeCity', () => {
    it('geocodes valid city name and caches result', async () => {
      const mockGeoResponse = {
        results: [
          {
            name: 'New Delhi',
            latitude: 28.6139,
            longitude: 77.209,
          },
        ],
      }

      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockGeoResponse),
        })
      )

      const result1 = await geocodeCity('New Delhi')
      expect(result1).toEqual({
        name: 'New Delhi',
        lat: 28.6139,
        lon: 77.209,
      })

      // Second call should return from in-memory cache without calling fetch
      const result2 = await geocodeCity('New Delhi')
      expect(result2).toEqual(result1)
      expect(global.fetch).toHaveBeenCalledTimes(1)
    })

    it('throws error when city is not found', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ results: [] }),
        })
      )

      await expect(geocodeCity('NonExistentCityXYZ123')).rejects.toThrow(/City not found/)
    })

    it('throws error on network/API failure', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 503,
        })
      )

      await expect(geocodeCity('Delhi')).rejects.toThrow(/Geocoding API error: 503/)
    })
  })

  describe('getAqiData', () => {
    it('fetches hourly data and converts European AQI to Indian CPCB AQI correctly', async () => {
      const mockHourly = {
        hourly: {
          time: Array.from({ length: 24 }, (_, i) => `2026-11-25T${String(i).padStart(2, '0')}:00`),
          european_aqi: Array.from({ length: 24 }, () => 80),
          pm2_5: Array.from({ length: 24 }, () => 140),
          pm10: Array.from({ length: 24 }, () => 180),
        },
      }

      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockHourly),
        })
      )

      const data = await getAqiData(28.61, 77.21)

      expect(data).toHaveProperty('aqi')
      expect(data).toHaveProperty('pm25', 140)
      expect(data).toHaveProperty('pm10', 180)
      expect(data).toHaveProperty('category')
      expect(data.category).toBe('very_poor')
      expect(Array.isArray(data.hourlyData)).toBe(true)
      expect(data.hourlyData.length).toBe(24)

      // Verify second call hits cache
      const cached = await getAqiData(28.61, 77.21)
      expect(cached.aqi).toBe(data.aqi)
      expect(global.fetch).toHaveBeenCalledTimes(1)
    })

    it('handles API failure gracefully with clear error message', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
        })
      )

      await expect(getAqiData(28.61, 77.21)).rejects.toThrow(/Open-Meteo AQI API error: 500/)
    })

    it('correctly maps various PM2.5 levels to appropriate Indian AQI categories', async () => {
      const testCases = [
        { pm25: 15, expectedCategory: 'good' },
        { pm25: 45, expectedCategory: 'satisfactory' },
        { pm25: 75, expectedCategory: 'moderate' },
        { pm25: 105, expectedCategory: 'poor' },
        { pm25: 150, expectedCategory: 'very_poor' },
        { pm25: 350, expectedCategory: 'severe' },
      ]

      for (const tc of testCases) {
        clearCache()
        const mockHourly = {
          hourly: {
            time: ['2026-11-25T12:00'],
            european_aqi: [50],
            pm2_5: [tc.pm25],
            pm10: [tc.pm25 * 1.5],
          },
        }

        global.fetch = jest.fn(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockHourly),
          })
        )

        const res = await getAqiData(28.0 + tc.pm25 / 1000, 77.0)
        expect(res.category).toBe(tc.expectedCategory)
      }
    })
  })
})
