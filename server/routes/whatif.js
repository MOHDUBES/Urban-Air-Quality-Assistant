// server/routes/whatif.js
// /api/whatif endpoint — dynamic scenario evaluation with rule-based fallback.

import { Router } from 'express'
import { validate, WhatIfSchema } from '../middleware/validation.js'
import { generateWhatIf } from '../services/geminiService.js'
import { getRuleBasedWhatIf } from '../services/fallbackEngine.js'

const router = Router()

router.post('/', validate(WhatIfSchema), async (req, res, next) => {
  try {
    const { profile, aqi, choices, language } = req.validated
    let result
    try {
      result = await generateWhatIf(profile, { aqi }, choices, language)
    } catch (err) {
      console.error('[whatif] Gemini API error, using rule-based fallback:', err.message, err.cause || '')
      result = getRuleBasedWhatIf(profile, { aqi }, choices)
    }

    return res.json({ result, ...result })
  } catch (err) {
    next(err)
  }
})

export default router
