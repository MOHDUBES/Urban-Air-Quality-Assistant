// server/routes/chat.js
// /api/chat endpoint — conversational interface with strict validation & safety disclaimer.

import { Router } from 'express'
import { validate, ChatSchema } from '../middleware/validation.js'
import { generateChatResponse } from '../services/geminiService.js'

const router = Router()

router.post('/', validate(ChatSchema), async (req, res, next) => {
  try {
    const { message, profile, aqi, history, language } = req.validated
    const disclaimer = '⚠️ This is not medical advice. Please consult a qualified doctor for health conditions.'

    let reply
    try {
      reply = await generateChatResponse(message, profile, { aqi, pm25: null, pm10: null }, history, language)
    } catch (err) {
      console.error('[chat] Gemini API error, using rule-based fallback reply:', err.message, err.cause || '')
      reply = `Based on current AQI (${aqi}) for a ${profile.householdType.replace('_', ' ')} household, sensitive individuals should strictly wear an N95 mask outdoors, keep windows sealed during peak hours, and operate indoor air filtration.`
    }

    return res.json({ response: reply, reply, disclaimer })
  } catch (err) {
    next(err)
  }
})

export default router
