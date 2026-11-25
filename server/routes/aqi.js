import { Router } from 'express'
import { geocodeCity, getAqiData } from '../services/aqiService.js'
import { AqiOverrideSchema, AqiQuerySchema, validate } from '../middleware/validation.js'

const router = Router()

// ---------------------------------------------------------------------------
// GET /api/aqi?city=Delhi  or  ?lat=28.6&lon=77.2
// ---------------------------------------------------------------------------

router.get('/', async (req, res, next) => {
  try {
    const parseResult = AqiQuerySchema.safeParse(req.query)
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Invalid query parameters', code: 'VALIDATION_ERROR' })
    }

    const { city, lat, lon } = parseResult.data

    if (city) {
      // Geocode first
      const geo = await geocodeCity(city)
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
      const aqiData = await getAqiData(lat, lon)
      return res.json({ success: true, data: { ...aqiData, lat, lon } })
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
