// server/routes/chat.js
// /api/chat endpoint — conversational interface with strict validation & safety disclaimer.

import { Router } from 'express'
import { validate, ChatSchema } from '../middleware/validation.js'
import { generateChatResponse } from '../services/geminiService.js'

const router = Router()

export function getChatFallbackReply(message, profile, aqi, language = 'en') {
  const lower = (message || '').toLowerCase()
  const isHindi = language === 'hi'
  const household = profile?.householdType ? profile.householdType.replace('_', ' ') : 'general'

  if (lower.includes('diy') || lower.includes('purifier') || lower.includes('filter') || lower.includes('cadr') || lower.includes('pankha')) {
    if (isHindi) {
      return `कम बजट में प्रभावी एयर प्यूरीफायर (Corsi-Rosenthal Box) बनाने के लिए एक 20-इंच बॉक्स फैन और 1 या 4 MERV-13 (या HEPA) एयर फिल्टर लें। फिल्टर के एयर-फ्लो एरो पंखे की ओर रखें और डक्ट टेप से किनारों को सील करें। यह 90% से अधिक PM2.5 कणों को ₹1500-₹2000 में साफ करता है।`
    }
    return `To build a highly effective DIY air purifier (Corsi-Rosenthal Box), attach a MERV-13 or HEPA furnace filter to the intake side of a standard 20-inch box fan using duct tape to form an airtight seal. For rooms under 250 sq ft, this achieves a clean air delivery rate (CADR) equivalent to commercial units costing ₹8,000+ at a fraction of the cost.`
  }

  if (lower.includes('mask') || lower.includes('cloth') || lower.includes('kapde') || lower.includes('n95') || lower.includes('kn95') || lower.includes('surgical')) {
    if (isHindi) {
      return `कपड़े के मास्क (Cloth masks) केवल 10-30% PM2.5 को रोकते हैं और अत्यधिक प्रदूषण (AQI ${aqi}) में सुरक्षित नहीं हैं। PM2.5 और स्मॉग से फेफड़ों को बचाने के लिए कम से कम 95% फिल्ट्रेशन वाले N95, KN95 या FFP2 रेस्पिरेटर मास्क का उपयोग करें और सुनिश्चित करें कि नाक और चेहरे पर कोई गैप न हो।`
    }
    return `No, standard cloth and surgical masks do not provide reliable protection against fine PM2.5 particles (blocking only 10–30% of micro-particulates). With current AQI at ${aqi}, you should strictly use a certified N95, KN95, or FFP2 respirator with an airtight nasal seal to filter out 95%+ of microscopic toxic pollutants.`
  }

  if (lower.includes('window') || lower.includes('khidki') || lower.includes('khol') || lower.includes('ventilat') || lower.includes('open') || lower.includes('fresh air')) {
    if (isHindi) {
      return `सुबह (6-10 AM) और शाम को विंटर इनवर्जन की वजह से प्रदूषण जमीन के पास सबसे घना होता है। खिड़कियों को दोपहर 12 बजे से 3 बजे के बीच 15-20 मिनट के लिए ही खोलें जब धूप से वेंटिलेशन बेहतर हो, और उसके बाद तुरंत एयर प्यूरीफायर चलाएं।`
    }
    return `Keep all windows and exterior vents firmly sealed during early morning (6–10 AM) and evening hours when thermal temperature inversion traps toxic smog near the ground. If ventilation is necessary to reduce indoor CO2, open windows briefly for 15–20 minutes only between 12:00 PM and 3:30 PM when solar warming lifts surface pollutants, then immediately resume indoor air filtration.`
  }

  if (lower.includes('outside') || lower.includes('outdoor') || lower.includes('bahar') || lower.includes('khel') || lower.includes('play') || lower.includes('walk') || lower.includes('run') || lower.includes('safe') || lower.includes('surakshit')) {
    if (isHindi) {
      return `वर्तमान AQI (${aqi}) पर बाहर जाना खासकर ${household} और बच्चों/बुजुर्गों के लिए असुरक्षित है। सुबह की सैर या बच्चों के आउटडोर खेल तुरंत रोकें। यदि बाहर निकलना आवश्यक हो, तो हमेशा N95 मास्क पहनें और व्यस्त सड़कों से दूर रहें।`
    }
    return `With the current AQI reaching ${aqi}, outdoor activities pose significant respiratory risk for a ${household} household. Avoid outdoor workouts, jogging, and children's playground activities. If outdoor transit is unavoidable, wear a snug N95 respirator and minimize roadside exposure during peak rush hours.`
  }

  if (isHindi) {
    return `वर्तमान AQI (${aqi}) के आधार पर ${household} परिवार के लिए: संवेदनशील व्यक्तियों को बाहर N95 मास्क पहनना चाहिए, पीक घंटों में खिड़कियां बंद रखनी चाहिए और घर के अंदर एयर प्यूरीफिकेशन चालू रखना चाहिए।`
  }
  return `Based on current AQI (${aqi}) for a ${household} household, sensitive individuals should strictly wear an N95 mask outdoors, keep windows sealed during peak hours, and operate indoor air filtration.`
}

router.post('/', validate(ChatSchema), async (req, res, next) => {
  try {
    const { message, profile, aqi, history, language } = req.validated
    const disclaimer = '⚠️ This is not medical advice. Please consult a qualified doctor for health conditions.'

    let reply
    try {
      reply = await generateChatResponse(message, profile, { aqi, pm25: null, pm10: null }, history, language)
    } catch (err) {
      console.error('[chat] Gemini API error, using rule-based fallback reply:', err.message, err.cause || '')
      reply = getChatFallbackReply(message, profile, aqi, language)
    }

    return res.json({ response: reply, reply, disclaimer })
  } catch (err) {
    next(err)
  }
})

export default router
