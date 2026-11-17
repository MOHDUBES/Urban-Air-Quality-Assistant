// server/index.js
// Express entry point for the Urban Air Quality Assistant API server.

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
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin || origin === ALLOWED_ORIGIN || origin.includes('localhost') || origin.endsWith('.vercel.app')) {
      return callback(null, true)
    }
    return callback(null, true) // permissive for hackathon live review, guarded by helmet & rate limiters
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}))
app.use(express.json({ limit: '20kb' }))

// ── Rate limiter ────────────────────────────────────────────────────────────
app.use('/api/', generalLimiter)
app.use('/api/plan', strictLimiter)
app.use('/api/chat', strictLimiter)

// ── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/aqi', aqiRouter)
app.use('/api/plan', planRouter)
app.use('/api/chat', chatRouter)
app.use('/api/whatif', whatifRouter)

// ── Health check ────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ── Error handler (must be last) ─────────────────────────────────────────
app.use(errorHandler)

// ── Start (only if not running under test) ────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[server] listening on http://localhost:${PORT}`)
  })
}

export default app
