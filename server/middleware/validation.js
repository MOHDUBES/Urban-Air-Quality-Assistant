import { z } from 'zod'

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

export const ProfileSchema = z.object({
  city: z.string().min(1).max(100).trim(),
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
  householdType: z.enum(['family_kids', 'elderly', 'asthma', 'working_professional', 'student']),
  commuteMode: z.enum(['car', 'bike', 'metro_bus', 'walk', 'wfh']),
  hasAirPurifier: z.boolean(),
  homeType: z.enum(['apartment', 'independent']),
  budget: z.enum(['low', 'medium', 'high']),
  language: z.enum(['en', 'hi']).default('en'),
})

export const AqiOverrideSchema = z.object({
  aqi: z.number().min(0).max(1000),
  pm25: z.number().min(0).max(1000).optional(),
  pm10: z.number().min(0).max(1000).optional(),
})

export const AqiQuerySchema = z.object({
  city: z.string().min(1).max(100).trim().optional(),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lon: z.coerce.number().min(-180).max(180).optional(),
})

export const ChatSchema = z.object({
  message: z.string().min(1).max(500).trim(),
  profile: ProfileSchema,
  aqi: z.number().min(0).max(1000),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().max(10000),
      }),
    )
    .max(10)
    .default([]),
  language: z.enum(['en', 'hi']).default('en'),
})

export const WhatIfSchema = z.object({
  profile: ProfileSchema,
  aqi: z.number().min(0).max(1000),
  choices: z.object({
    switchToMetro: z.boolean().default(false),
    useN95: z.boolean().default(false),
    runPurifier: z.boolean().default(false),
    avoidMorningWalk: z.boolean().default(false),
    cookWithGas: z.boolean().default(true),
    workFromHome: z.boolean().default(false),
  }),
  language: z.enum(['en', 'hi']).default('en'),
})

export const ChatRequestSchema = ChatSchema
export const WhatIfRequestSchema = WhatIfSchema

// ---------------------------------------------------------------------------
// Middleware factory
// ---------------------------------------------------------------------------

/**
 * Returns Express middleware that validates req.body against `schema`.
 * On success sets req.validated = parsed data and calls next().
 * On failure passes ZodError to next(err).
 *
 * @param {import('zod').ZodSchema} schema
 */
export function validate(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      return next(result.error)
    }
    req.validated = result.data
    return next()
  }
}
