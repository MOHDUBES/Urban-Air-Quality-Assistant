// shared/types.js
// JSDoc type definitions for the Urban Air Quality Assistant project.
// These types are shared between client and server.

'use strict';

/**
 * @typedef {Object} UserProfile
 * @property {string} city - City name (e.g. "Delhi")
 * @property {number} lat - Latitude
 * @property {number} lon - Longitude
 * @property {string} householdType - One of HOUSEHOLD_TYPES values
 * @property {string} commuteMode - One of COMMUTE_MODES values
 * @property {boolean} hasAirPurifier - Whether user owns an air purifier
 * @property {string} homeType - One of HOME_TYPES values
 * @property {string} budget - One of BUDGET_LEVELS values
 */

/**
 * @typedef {Object} HourlyDataPoint
 * @property {string} time - ISO timestamp
 * @property {number} aqi - AQI value
 * @property {number} pm25 - PM2.5 µg/m³
 * @property {number} pm10 - PM10 µg/m³
 */

/**
 * @typedef {Object} AqiData
 * @property {number} aqi - Current AQI index (0–500+)
 * @property {number} pm25 - PM2.5 concentration µg/m³
 * @property {number} pm10 - PM10 concentration µg/m³
 * @property {string} category - AQI category id
 * @property {string} timestamp - ISO 8601 timestamp
 * @property {HourlyDataPoint[]} hourlyData - 24-hour trend data
 */

/**
 * @typedef {Object} RoutineItem
 * @property {string} time - Time of day (e.g. "Morning", "Evening")
 * @property {string} action - What to do
 * @property {string} reason - Why it helps
 */

/**
 * @typedef {Object} IndoorHack
 * @property {string} title - Short title
 * @property {string} description - Full description
 * @property {string} estimatedCost - Cost estimate in INR
 * @property {string} effectiveness - low | medium | high
 */

/**
 * @typedef {Object} SustainableAlt
 * @property {string} current - Current behavior
 * @property {string} alternative - Suggested alternative
 * @property {string} impact - Environmental impact description
 * @property {number} aqi_reduction_pct - Estimated AQI reduction percentage
 */

/**
 * @typedef {Object} ActionPlan
 * @property {string} riskLevel - Risk level id
 * @property {string} summary - Overall summary paragraph
 * @property {RoutineItem[]} dailyRoutine - Personalized daily routine items
 * @property {IndoorHack[]} indoorHacks - Indoor air quality improvement tips
 * @property {SustainableAlt[]} sustainableAlts - Sustainable behavior alternatives
 * @property {string} specialAdvice - Special advice for user's household type
 * @property {string} impactExplainer - Science explainer about current AQI impact
 */

/**
 * @typedef {Object} WhatIfResult
 * @property {string} scenario - Description of the hypothetical scenario
 * @property {number} estimatedReduction - Estimated AQI reduction (0–100 percent)
 * @property {string} explanation - Full explanation of the estimate
 * @property {string[]} assumptions - List of assumptions made
 */

/**
 * @typedef {'user'|'assistant'} MessageRole
 */

/**
 * @typedef {Object} ChatMessage
 * @property {MessageRole} role - Who sent the message
 * @property {string} content - Message content (may contain markdown)
 * @property {string} timestamp - ISO 8601 timestamp
 */

module.exports = {};
