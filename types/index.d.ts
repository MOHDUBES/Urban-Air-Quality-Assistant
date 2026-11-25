// types/index.d.ts
// Global TypeScript interfaces for the Urban Air Quality Assistant project.

export type HouseholdType = 'family_kids' | 'elderly' | 'asthma' | 'working_professional' | 'student'
export type CommuteMode = 'car' | 'bike' | 'metro_bus' | 'walk' | 'wfh'
export type HomeType = 'apartment' | 'independent'
export type BudgetLevel = 'low' | 'medium' | 'high'
export type Language = 'en' | 'hi'

export interface UserProfile {
  city: string
  lat: number
  lon: number
  householdType: HouseholdType
  commuteMode: CommuteMode
  hasAirPurifier: boolean
  homeType: HomeType
  budget: BudgetLevel
  language?: Language
}

export interface HourlyDataPoint {
  time: string
  aqi: number
  pm25: number
  pm10: number
}

export interface AqiData {
  aqi: number
  pm25: number | null
  pm10: number | null
  category?: string
  color?: string
  timestamp?: string
  city?: string
  country?: string
  lat?: number
  lon?: number
  manual?: boolean
  hourlyData?: HourlyDataPoint[]
}

export interface RoutineItem {
  timeWindow: string
  activity: string
  advice: string
}

export interface DailyRoutine {
  morning: RoutineItem
  afternoon: RoutineItem
  evening: RoutineItem
  bestOutdoorTime: string
}

export interface IndoorHack {
  rank: number
  title: string
  description: string
  budgetLevel: 'low' | 'medium' | 'high'
  impact: string
}

export interface SustainableAlt {
  category: string
  current: string
  alternative: string
  impact: string
  co2Saved: string
}

export interface ActionPlan {
  riskLevel: 'low' | 'moderate' | 'high' | 'very_high' | 'emergency'
  summary: string
  dailyRoutine: DailyRoutine
  indoorHacks: IndoorHack[]
  sustainableAlts: SustainableAlt[]
  specialAdvice: string
  impactExplainer: string
}

export interface WhatIfChoices {
  switchToMetro?: boolean
  useN95?: boolean
  runPurifier?: boolean
  avoidMorningWalk?: boolean
  cookWithGas?: boolean
  workFromHome?: boolean
}

export interface WhatIfResult {
  scenario: string
  estimatedReduction: string
  estimatedExposureAqi: number
  co2SavedKg: string
  explanation: string
  assumptions: string
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  disclaimer?: string
  timestamp?: number
  isError?: boolean
}
