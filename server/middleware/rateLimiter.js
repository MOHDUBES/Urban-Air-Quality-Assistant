import rateLimit from 'express-rate-limit'

const isDevOrTest = () =>
  process.env.NODE_ENV === 'test' ||
  process.env.NODE_ENV === 'development' ||
  !process.env.NODE_ENV

/**
 * General limiter: 100 requests per 15 minutes
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests, please try again later.',
    code: 'RATE_LIMIT_EXCEEDED',
  },
  skip: (req) => req.path === '/api/health' || isDevOrTest(),
})

/**
 * Strict limiter: for Action Plan generation
 */
export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'AI request limit reached. Please wait before generating more plans.',
    code: 'RATE_LIMIT_EXCEEDED',
  },
  skip: () => isDevOrTest(),
})

/**
 * Chat limiter: 100 messages per 15 minutes
 */
export const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Chat limit reached. Please wait a few moments before sending more questions.',
    code: 'RATE_LIMIT_EXCEEDED',
  },
  skip: () => isDevOrTest(),
})

export const createRateLimiter = () => generalLimiter
