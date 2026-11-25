// server/__tests__/errorHandler.test.js
// Unit tests for centralized error handler ensuring structured JSON responses and no stack trace leaks.

import { jest, describe, it, expect } from '@jest/globals'
import { errorHandler, GeminiError, RateLimitError } from '../middleware/errorHandler.js'
import { ZodError } from 'zod'

describe('Centralized Error Handler Middleware', () => {
  it('formats Zod validation errors as 400 Bad Request with field-level details', () => {
    const zodError = new ZodError([
      {
        path: ['city'],
        message: 'City name is required',
        code: 'invalid_type',
        expected: 'string',
        received: 'undefined',
      },
    ])

    const req = { path: '/api/aqi', method: 'GET' }
    const res = {
      statusCode: 200,
      status: jest.fn(function (code) {
        this.statusCode = code
        return this
      }),
      json: jest.fn(),
    }
    const next = jest.fn()

    errorHandler(zodError, req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: expect.any(Array),
      })
    )
  })

  it('formats City Not Found errors as 404', () => {
    const cityError = new Error('City not found: Atlantis')

    const req = { path: '/api/aqi', method: 'GET' }
    const res = {
      statusCode: 200,
      status: jest.fn(function (code) {
        this.statusCode = code
        return this
      }),
      json: jest.fn(),
    }
    const next = jest.fn()

    errorHandler(cityError, req, res, next)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 'CITY_NOT_FOUND',
      })
    )
  })

  it('formats RateLimitError as 429 Too Many Requests', () => {
    const rateError = new RateLimitError('Rate limit exceeded')

    const req = { path: '/api/chat', method: 'POST' }
    const res = {
      statusCode: 200,
      status: jest.fn(function (code) {
        this.statusCode = code
        return this
      }),
      json: jest.fn(),
    }
    const next = jest.fn()

    errorHandler(rateError, req, res, next)

    expect(res.status).toHaveBeenCalledWith(429)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 'RATE_LIMIT_EXCEEDED',
      })
    )
  })

  it('formats GeminiError as 502 with fallback message', () => {
    const geminiError = new GeminiError('API quota exceeded', 'QUOTA')

    const req = { path: '/api/plan', method: 'POST' }
    const res = {
      statusCode: 200,
      status: jest.fn(function (code) {
        this.statusCode = code
        return this
      }),
      json: jest.fn(),
    }
    const next = jest.fn()

    errorHandler(geminiError, req, res, next)

    expect(res.status).toHaveBeenCalledWith(502)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 'GEMINI_UNAVAILABLE',
      })
    )
  })

  it('formats unexpected runtime errors as safe 500 without leaking internal stack traces', () => {
    const error = new Error('Database connection failed unexpectedly')

    const req = { path: '/api/plan', method: 'POST' }
    const res = {
      statusCode: 200,
      status: jest.fn(function (code) {
        this.statusCode = code
        return this
      }),
      json: jest.fn(),
    }
    const next = jest.fn()

    errorHandler(error, req, res, next)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 'INTERNAL_ERROR',
      })
    )
    const jsonOutput = res.json.mock.calls[0][0]
    expect(jsonOutput.stack).toBeUndefined()
  })
})
