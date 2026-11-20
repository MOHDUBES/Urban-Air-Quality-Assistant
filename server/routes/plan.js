import { Router } from 'express'
import { z } from 'zod'
import { ProfileSchema, AqiOverrideSchema, validate } from '../middleware/validation.js'
import { getAqiData } from '../services/aqiService.js'
import { generateActionPlan } from '../services/geminiService.js'
import { generateFallbackPlan } from '../services/fallbackEngine.js'
import { planCache, PLAN_TTL, hashObject } from '../services/cacheService.js'

const router = Router()

const PlanBodySchema = z.object({
  profile: ProfileSchema,
  aqiOverride: AqiOverrideSchema.optional(),
})

// ---------------------------------------------------------------------------
// POST /api/plan
// ---------------------------------------------------------------------------

router.post('/', validate(PlanBodySchema), async (req, res, next) => {
  try {
    const { profile, aqiOverride } = req.validated

    // 1. Determine AQI data source
    let aqiData
    if (aqiOverride) {
      aqiData = {
        aqi: aqiOverride.aqi,
        pm25: aqiOverride.pm25 ?? null,
        pm10: aqiOverride.pm10 ?? null,
        hourlyData: [],
        timestamp: new Date().toISOString(),
        manual: true,
      }
    } else {
      aqiData = await getAqiData(profile.lat, profile.lon)
    }

    // 2. Build cache key — bucket AQI to nearest 5 to avoid too-granular misses
    const aqiBucket = Math.round(aqiData.aqi / 5) * 5
    const cacheKey = hashObject({ profile, aqiBucket })
    const cached = planCache.get(cacheKey)
    if (cached) {
      return res.json({ ...cached, cached: true })
    }

    // 3. Try Gemini
    let plan
    let fallback = false
    let source = 'gemini'

    try {
      plan = await generateActionPlan(profile, aqiData, profile.language)
    } catch (geminiErr) {
      console.error('[plan] Gemini API error, using rule-based fallback:', geminiErr.message, geminiErr.cause || '')
      plan = generateFallbackPlan(profile, aqiData)
      fallback = true
      source = 'fallback'
    }

    // 4. Cache successful result
    const responseBody = { plan, fallback, source, aqiData, cached: false }
    planCache.set(cacheKey, responseBody, PLAN_TTL)

    return res.json(responseBody)
  } catch (err) {
    next(err)
  }
})

export default router
