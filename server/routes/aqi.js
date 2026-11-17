import { Router } from 'express'
import { geocodeCity, getAqiData } from '../services/aqiService.js'
import { AqiOverrideSchema, validate } from '../middleware/validation.js'

const router = Router()

// ---------------------------------------------------------------------------
// GET /api/aqi?city=Delhi  or  ?lat=28.6&lon=77.2
// ---------------------------------------------------------------------------

router.get('/', async (req, res, next) => {
  try {
    const { city, lat, lon } = req.query

    if (city) {
      // Geocode first
      const geo = await geocodeCity(String(city).trim())
      const aqiData = await getAqiData(geo.lat, geo.lon)
      return res.json({
        success: true,
        data: {
          ...aqiData,
          city: geo.name,
          country: geo.country,
          lat: geo.lat,
          lon: geo.lon,
        },
      })
    }

    if (lat !== undefined && lon !== undefined) {
      const latNum = parseFloat(lat)
      const lonNum = parseFloat(lon)
      if (isNaN(latNum) || isNaN(lonNum)) {
        return res.status(400).json({ error: 'lat and lon must be valid numbers', code: 'VALIDATION_ERROR' })
      }
      if (latNum < -90 || latNum > 90 || lonNum < -180 || lonNum > 180) {
        return res.status(400).json({ error: 'lat/lon out of range', code: 'VALIDATION_ERROR' })
      }
      const aqiData = await getAqiData(latNum, lonNum)
      return res.json({ success: true, data: { ...aqiData, lat: latNum, lon: lonNum } })
    }

    return res.status(400).json({
      error: 'Provide either ?city=<name> or ?lat=<num>&lon=<num>',
      code: 'VALIDATION_ERROR',
    })
  } catch (err) {
    next(err)
  }
})

// ---------------------------------------------------------------------------
// POST /api/aqi/manual  — manual AQI override
// ---------------------------------------------------------------------------

router.post('/manual', validate(AqiOverrideSchema), (req, res) => {
  const { aqi, pm25, pm10 } = req.validated
  return res.json({
    success: true,
    data: {
      aqi,
      pm25: pm25 ?? null,
      pm10: pm10 ?? null,
      hourlyData: [],
      timestamp: new Date().toISOString(),
      manual: true,
    },
  })
})

export default router
