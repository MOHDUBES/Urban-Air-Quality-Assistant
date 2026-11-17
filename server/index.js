// server/index.js
// Express entry point for the Urban Air Quality Assistant API server.

try {
  process.loadEnvFile()
} catch {
  // Gracefully continue if .env does not exist
}

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { errorHandler } from './middleware/errorHandler.js'
import { generalLimiter, strictLimiter } from './middleware/rateLimiter.js'
import aqiRouter from './routes/aqi.js'
import planRouter from './routes/plan.js'
import chatRouter from './routes/chat.js'
import whatifRouter from './routes/whatif.js'

const app = express()
const PORT = process.env.PORT || 3001
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'http://localhost:5173'

// ── Security middleware ─────────────────────────────────────────────────────
app.use(helmet())

// Strictly restricted CORS
app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser calls (like curl, health probes, server-to-server)
    if (!origin) return callback(null, true)

    // Allowed origins: exact match with ALLOWED_ORIGIN, local dev hosts, or Vercel preview domains
    const isAllowed =
      origin === ALLOWED_ORIGIN ||
      /^http:\/\/localhost:(3000|3001|5173|4173)$/.test(origin) ||
      /^https:\/\/.*\.vercel\.app$/.test(origin)

    if (isAllowed) {
      return callback(null, true)
    }

    if (process.env.NODE_ENV === 'production') {
      return callback(new Error(`Origin ${origin} not allowed by CORS`))
    }

    // In non-production testing, be permissive with a warning
    return callback(null, true)
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
}))

app.use(express.json({ limit: '20kb' }))

// ── Rate limiter ────────────────────────────────────────────────────────────
app.use(['/api/', '/'], generalLimiter)
app.use(['/api/plan', '/plan'], strictLimiter)
app.use(['/api/chat', '/chat'], strictLimiter)

// ── Routes ──────────────────────────────────────────────────────────────────
app.use(['/api/aqi', '/aqi'], aqiRouter)
app.use(['/api/plan', '/plan'], planRouter)
app.use(['/api/chat', '/chat'], chatRouter)
app.use(['/api/whatif', '/whatif'], whatifRouter)

// ── Health check ────────────────────────────────────────────────────────────
app.get(['/api/health', '/health'], (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ── Error handler (must be last) ─────────────────────────────────────────
app.use(errorHandler)

// ── Start (only if not running under test or serverless environment) ───────
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[server] listening on http://localhost:${PORT}`)
  })
}

export default app
