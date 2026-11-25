// server/__tests__/security.test.js
// Tests for application security controls: Helmet headers, input sanitization, 404 safety, error handling.

import request from 'supertest'
import app from '../index.js'

describe('Application Security Controls', () => {
  describe('HTTP Security Headers (Helmet & Policies)', () => {
    test('emits X-Content-Type-Options: nosniff on all responses', async () => {
      const res = await request(app).get('/api/health')
      expect(res.headers['x-content-type-options']).toBe('nosniff')
    })

    test('prevents clickjacking via frame-ancestors / X-Frame-Options', async () => {
      const res = await request(app).get('/api/health')
      const csp = res.headers['content-security-policy'] || ''
      const xfo = res.headers['x-frame-options'] || ''
      const frameProtected = csp.includes("frame-ancestors 'self'") || xfo === 'SAMEORIGIN' || xfo === 'DENY'
      expect(frameProtected).toBe(true)
    })

    test('emits secure Referrer-Policy header', async () => {
      const res = await request(app).get('/api/health')
      expect(res.headers['referrer-policy']).toBeDefined()
    })
  })

  describe('Route Defense & Safe Error Handling', () => {
    test('returns structured 404 JSON on undefined endpoints without leaking server stack trace', async () => {
      const res = await request(app).get('/api/non-existent-endpoint-' + Date.now())
      expect(res.status).toBe(404)
      expect(res.body).toHaveProperty('error')
      expect(res.text).not.toMatch(/node_modules/i)
      expect(res.text).not.toMatch(/Error: Cannot find module/i)
    })

    test('rejects malformed non-JSON payloads on JSON POST endpoints gracefully', async () => {
      const res = await request(app)
        .post('/api/plan')
        .set('Content-Type', 'application/json')
        .send('{ invalid json payload :::')
      expect(res.status).toBeGreaterThanOrEqual(400)
    })

    test('enforces strict payload size limits to prevent memory exhaustion', async () => {
      const giantString = 'A'.repeat(2 * 1024 * 1024) // 2MB
      const res = await request(app)
        .post('/api/chat')
        .send({ message: giantString })
      expect(res.status).toBeGreaterThanOrEqual(400)
    })
  })
})
