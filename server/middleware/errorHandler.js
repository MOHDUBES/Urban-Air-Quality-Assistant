import { ZodError } from 'zod'

/**
 * Custom error class for Gemini API failures
 */
export class GeminiError extends Error {
  constructor(message, cause) {
    super(message)
    this.name = 'GeminiError'
    this.cause = cause
  }
}

/**
 * Custom error class for rate limit errors
 */
export class RateLimitError extends Error {
  constructor(message) {
    super(message)
    this.name = 'RateLimitError'
  }
}

/**
 * Centralized error handler middleware
 * @param {Error} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} _next
 */
export function errorHandler(err, req, res, _next) {
  const isProd = process.env.NODE_ENV === 'production'

  // --- Zod Validation Errors (400) ---
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    })
  }

  // --- Not Found Errors (404) ---
  if (err.message && err.message.toLowerCase().includes('city not found')) {
    return res.status(404).json({
      error: err.message,
      code: 'CITY_NOT_FOUND',
    })
  }

  // --- Rate Limit (429) ---
  // express-rate-limit sets err.statusCode = 429 or passes its own error
  if (err.name === 'RateLimitError' || err.statusCode === 429 || err.status === 429) {
    return res.status(429).json({
      error: 'Too many requests. Please wait before trying again.',
      code: 'RATE_LIMIT_EXCEEDED',
    })
  }

  // --- Gemini / Upstream AI Errors (502) ---
  if (err instanceof GeminiError || err.name === 'GeminiError') {
    return res.status(502).json({
      error: 'AI service temporarily unavailable. Using fallback recommendations.',
      code: 'GEMINI_UNAVAILABLE',
      details: isProd ? undefined : err.message,
    })
  }

  // --- Generic Server Error (500) ---
  console.error('[ErrorHandler]', {
    name: err.name,
    message: err.message,
    path: req.path,
    method: req.method,
    ...(isProd ? {} : { stack: err.stack }),
  })

  return res.status(err.status || err.statusCode || 500).json({
    error: 'An unexpected error occurred.',
    code: 'INTERNAL_ERROR',
    // Never expose stack traces in production
    details: isProd ? undefined : err.message,
  })
}
