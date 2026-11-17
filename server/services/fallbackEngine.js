// server/services/fallbackEngine.js
// Deterministic rule-based fallback and grounding engine for Urban Air Quality Assistant.

export const AQI_CATEGORIES = [
  {
    id: 'good',
    min: 0,
    max: 50,
    minAqi: 0,
    maxAqi: 50,
    label: 'Good',
    color: 'green',
    textColor: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-400',
    icon: '😊',
    risk: 'low',
    riskLabel: 'Low Risk',
  },
  {
    id: 'satisfactory',
    min: 51,
    max: 100,
    minAqi: 51,
    maxAqi: 100,
    label: 'Satisfactory',
    color: 'lime',
    textColor: 'text-lime-700',
    bgColor: 'bg-lime-50',
    borderColor: 'border-lime-400',
    icon: '🙂',
    risk: 'low-moderate',
    riskLabel: 'Low-Moderate Risk',
  },
  {
    id: 'moderate',
    min: 101,
    max: 200,
    minAqi: 101,
    maxAqi: 200,
    label: 'Moderate',
    color: 'yellow',
    textColor: 'text-yellow-700',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-400',
    icon: '😐',
    risk: 'moderate',
    riskLabel: 'Moderate Risk',
  },
  {
    id: 'poor',
    min: 201,
    max: 300,
    minAqi: 201,
    maxAqi: 300,
    label: 'Poor',
    color: 'orange',
    textColor: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-400',
    icon: '😷',
    risk: 'high',
    riskLabel: 'High Risk',
  },
  {
    id: 'very_poor',
    min: 301,
    max: 400,
    minAqi: 301,
    maxAqi: 400,
    label: 'Very Poor',
    color: 'red',
    textColor: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-400',
    icon: '🚨',
    risk: 'very_high',
    riskLabel: 'Very High Risk',
  },
  {
    id: 'severe',
    min: 401,
    max: Infinity,
    minAqi: 401,
    maxAqi: Infinity,
    label: 'Severe',
    color: 'purple',
    textColor: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-400',
    icon: '☠️',
    risk: 'emergency',
    riskLabel: 'Emergency',
  },
]

export function getAqiCategory(aqi) {
  const num = typeof aqi === 'number' ? aqi : 0
  for (const cat of AQI_CATEGORIES) {
    if (num >= cat.min && (num <= cat.max || cat.max === Infinity)) {
      return cat
    }
  }
  return AQI_CATEGORIES[AQI_CATEGORIES.length - 1]
}

export function getRiskScore(profile, aqi) {
  const safeAqi = Math.max(0, typeof aqi === 'number' ? aqi : 0)
  
  // 1. AQI score: 0 to 50 points
  const aqiScore = Math.min(safeAqi / 5, 50)

  // 2. Household vulnerability: 0 to 30 points
  const householdWeights = {
    asthma: 30,
    elderly: 25,
    family_kids: 20,
    working_professional: 10,
    student: 10,
  }
  const householdScore = householdWeights[profile?.householdType] ?? 15

  // 3. Commute exposure: 0 to 20 points
  const commuteWeights = {
    car: 20,
    walk: 20,
    bike: 15,
    metro_bus: 10,
    wfh: 0,
  }
  const commuteScore = commuteWeights[profile?.commuteMode] ?? 10

  // 4. Air purifier mitigation: subtract 10 points
  const purifierMitigation = profile?.hasAirPurifier ? 10 : 0

  const total = aqiScore + householdScore + commuteScore - purifierMitigation
  return Math.min(100, Math.max(0, Math.round(total)))
}

export function getBaselineRecommendations(aqiCatOrAqi, budget = 'medium') {
  const cat = typeof aqiCatOrAqi === 'object' && aqiCatOrAqi !== null 
    ? aqiCatOrAqi 
    : getAqiCategory(aqiCatOrAqi)

  const recs = []

  if (cat.id === 'good') {
    recs.push('Outdoor activities and natural ventilation are safe and encouraged today.')
    recs.push('Open windows during midday to refresh indoor air.')
  } else if (cat.id === 'satisfactory') {
    recs.push('Generally safe outdoors, but sensitive groups should watch for mild throat irritation.')
    recs.push('Air out living areas during late morning (11am-2pm).')
  } else if (cat.id === 'moderate') {
    recs.push('Wear an N95 or equivalent mask during heavy traffic hours.')
    recs.push('Close windows during early morning (6am-9am) when inversion traps particulate matter.')
    if (budget !== 'low') recs.push('Run air purifiers on low/medium setting in bedrooms.')
  } else if (cat.id === 'poor') {
    recs.push('Strictly wear an N95 mask when stepping outdoors.')
    recs.push('Avoid strenuous outdoor exercise; switch to indoor yoga or workouts.')
    recs.push('Keep windows shut; use damp-mopping rather than dry sweeping to trap dust.')
  } else if (cat.id === 'very_poor') {
    recs.push('Avoid non-essential outdoor travel; vulnerable individuals should stay indoors.')
    recs.push('Seal window gaps with weatherstripping or rolled towels.')
    recs.push('Run air purifiers continuously on auto or high.')
  } else {
    // Severe / Emergency
    recs.push('EMERGENCY: Do not step outside without an N95/N99 respirator mask.')
    recs.push('Create a clean room at home with an active HEPA purifier or DIY Corsi-Rosenthal box.')
    recs.push('Strictly keep children and elderly family members indoors with windows tightly sealed.')
  }

  return recs
}

export function generateFallbackPlan(profile, aqiData) {
  const aqi = aqiData?.aqi ?? 150
  const pm25 = aqiData?.pm25 ?? Math.round(aqi * 0.6)
  const _cat = getAqiCategory(aqi)
  const riskScore = getRiskScore(profile, aqi)

  let riskLevel = 'moderate'
  if (aqi >= 401 || riskScore >= 80) riskLevel = 'emergency'
  else if (aqi >= 301 || riskScore >= 65) riskLevel = 'very_high'
  else if (aqi >= 201 || riskScore >= 50) riskLevel = 'high'
  else if (aqi <= 50) riskLevel = 'low'

  const summaries = {
    emergency: `Hazardous smog emergency (AQI ${aqi}). Toxic PM2.5 levels (${pm25} µg/m³) pose acute respiratory threats. Stay indoors and seal all entry points.`,
    very_high: `Severe air pollution (AQI ${aqi}). High particulate density requires strict N95 usage and continuous indoor filtration.`,
    high: `Poor air quality (AQI ${aqi}). Sensitive groups and commuters face elevated exposure; shift outdoor routines to midday.`,
    moderate: `Moderate pollution (AQI ${aqi}). Vulnerable individuals should avoid prolonged exertion during peak morning traffic.`,
    low: `Clean air conditions (AQI ${aqi}). Safe for outdoor routines, jogging, and natural ventilation.`,
  }

  const specialAdviceByHousehold = {
    asthma: 'Keep rescue inhalers accessible at all times. Use saline nasal rinses twice daily after outdoor exposure. Avoid early morning cold air which triggers bronchospasms.',
    elderly: 'Monitor blood pressure and pulse oximeter readings. Avoid morning walks before 10 AM. Stay hydrated with warm fluids.',
    family_kids: 'Keep children indoors during early morning and late evening. Replace outdoor playground time with indoor creative games.',
    working_professional: 'Switch to metro or carpool. Wear an N95 during transit. Ensure office HVAC filters are maintained.',
    student: 'Study indoors near air-purified or low-ventilation zones. Wear a well-fitted mask during transit to campus.',
  }

  return {
    riskLevel,
    riskScore,
    summary: summaries[riskLevel] || summaries.moderate,
    dailyRoutine: {
      morning: {
        timeWindow: '06:00 - 09:00',
        activity: aqi > 200 ? 'Indoor stretching or yoga' : 'Outdoor walk with mask',
        advice: 'Morning temperature inversions trap surface particulate matter. Keep windows sealed.',
      },
      afternoon: {
        timeWindow: '11:00 - 15:00',
        activity: 'Essential outdoor chores, errands, or transit',
        advice: 'Solar radiation creates vertical air mixing, making midday the lowest PM2.5 window.',
      },
      evening: {
        timeWindow: '18:00 - 21:00',
        activity: 'Indoor leisure; run air filtration',
        advice: 'Commuter exhaust and cooking biomass peak in the evening. Avoid outdoor exposure.',
      },
      bestOutdoorTime: '12:00 PM – 2:30 PM (est. 30–45% lower PM2.5 concentration than 7 AM)',
    },
    indoorHacks: [
      {
        title: 'Corsi-Rosenthal Box (DIY HEPA Purifier)',
        description: 'Tape 4 MERV-13 filters around a 20-inch box fan with a cardboard shroud. Delivers CADR of ~200 CFM at 1/5th the cost of commercial units.',
        budgetLevel: 'low',
        impact: '~60–75% indoor PM2.5 reduction in a 250 sq ft room (est.)',
        rank: 1,
      },
      {
        title: 'Wet Mopping with Microfiber Cloths',
        description: 'Never dry-sweep. Damp mop twice daily to bind settled particulate matter without resuspending toxic silica and soot into breathing zones.',
        budgetLevel: 'low',
        impact: '~15–20% reduction in resuspended indoor dust (est.)',
        rank: 2,
      },
      {
        title: 'Strategic Cross-Ventilation Timing',
        description: 'Crack windows open only between 12:00 PM and 2:00 PM for 15 minutes to purge CO2, then seal completely with weatherstrip tape.',
        budgetLevel: 'low',
        impact: 'Maintains CO2 < 800 ppm while keeping indoor PM2.5 within 25% of outdoor levels (est.)',
        rank: 3,
      },
      {
        title: 'True HEPA Air Purifier (H13 Grade)',
        description: 'Position in the bedroom 3 feet away from walls. Run on medium speed 24/7 rather than auto-cycling.',
        budgetLevel: profile?.budget === 'high' ? 'high' : 'medium',
        impact: '~85–95% reduction in indoor PM2.5 exposure overnight (est.)',
        rank: 4,
      },
    ],
    sustainableAlts: [
      {
        category: 'Commute',
        current: profile?.commuteMode === 'car' ? 'Solo personal car drive (15 km)' : 'Motorbike commute',
        alternative: 'Electric Metro / Bus feeder service',
        impact: 'Avoids ~75% personal PM exposure during gridlocked traffic (est.)',
        co2Saved: '~2.1 kg CO2 saved per 15 km trip (est.)',
      },
      {
        category: 'Cooking & Heating',
        current: 'High-heat frying with unvented range / biomass space heater',
        alternative: 'LPG or Induction cooking with sealed kitchen door + oil-filled electric radiator',
        impact: 'Prevents acute indoor PM2.5 spikes exceeding 500 µg/m³ during food prep (est.)',
        co2Saved: '~0.8 kg daily emissions reduction (est.)',
      },
      {
        category: 'Waste Management',
        current: 'Dry leaves or local garden waste burning in neighborhood',
        alternative: 'Aerobic composting pit or municipal green-waste collection',
        impact: 'Prevents release of ~120g of carcinogenic black carbon and dioxins per pile (est.)',
        co2Saved: '~15 kg CO2eq per yard waste cycle (est.)',
      },
    ],
    specialAdvice: {
      household: specialAdviceByHousehold[profile?.householdType] || 'Stay hydrated and monitor AQI updates every 3 hours.',
    },
    impactExplainer: [
      {
        recommendation: 'Switching 10 km daily commute from solo petrol car to Delhi Metro',
        impact: 'Saves ~1.7 kg CO2 and prevents ~0.1 mg (~100 µg) of direct personal PM2.5 inhalation (est.)',
        assumptions: 'Assumes average car fuel economy 14 km/L petrol, metro grid emission factor 0.72 kg CO2/kWh, average commuter breathing rate 15 L/min in traffic.',
      },
      {
        recommendation: 'Wearing a properly fitted N95 respirator mask during 45 min commute',
        impact: 'Filters ~95% of airborne particulate matter, reducing daily inhaled PM2.5 by ~100 µg (0.1 mg) (est.)',
        assumptions: 'Assumes ambient PM2.5 of 200 µg/m³, minute ventilation of 12 L/min, and tight facial seal with <5% edge leakage.',
      },
      {
        recommendation: 'Operating a HEPA/DIY air purifier in bedroom for 8 hours overnight',
        impact: 'Reduces sleeping PM2.5 exposure from 180 µg/m³ to <15 µg/m³, saving ~50 µg cumulative lung deposition per night (est.)',
        assumptions: 'Assumes 150 sq ft sealed room, clean air delivery rate (CADR) of 150 CFM, and natural infiltration rate 0.5 ACH.',
      },
    ],
    promptUsed: 'Rule-based deterministic engine: approximate, based on public literature (WHO, CPCB, EPA, UC Davis).',
  }
}

// Retain alias for existing callers
export const getRuleBasedPlan = generateFallbackPlan

export function getRuleBasedWhatIf(profile, aqiData, choices) {
  const baseAqi = aqiData?.aqi ?? 200
  let pmReductionPct = 0
  let co2SavedKg = 0
  const actionsTaken = []

  if (choices?.switchToMetro) {
    pmReductionPct += 20
    co2SavedKg += 1.8
    actionsTaken.push('Metro transit avoids roadside particulate plumes and cuts tailpipe emissions.')
  }
  if (choices?.useN95) {
    pmReductionPct += 45
    actionsTaken.push('N95 respirator filters >=95% of fine particulate matter during transit.')
  }
  if (choices?.runPurifier) {
    pmReductionPct += 30
    actionsTaken.push('HEPA filtration brings indoor bedroom PM2.5 below WHO thresholds.')
  }
  if (choices?.avoidMorningWalk) {
    pmReductionPct += 15
    actionsTaken.push('Avoiding 6-8 AM inversion peak prevents heavy exertion during daily AQI maximum.')
  }
  if (choices?.workFromHome) {
    pmReductionPct += 25
    co2SavedKg += 2.4
    actionsTaken.push('Teleworking completely eliminates road transit exposure.')
  }

  // Cap reduction at 85%
  const effectiveReduction = Math.min(85, pmReductionPct)
  const estimatedExposureAqi = Math.max(15, Math.round(baseAqi * (1 - effectiveReduction / 100)))

  return {
    scenario: 'Selected intervention bundle',
    estimatedReduction: `${effectiveReduction}% (est.)`,
    estimatedExposureAqi,
    co2SavedKg: `${co2SavedKg.toFixed(1)} kg CO2/day (est.)`,
    explanation: actionsTaken.length > 0 
      ? actionsTaken.join(' ') 
      : 'No protective interventions selected. Baseline outdoor exposure remains unmitigated.',
    assumptions: 'Estimates approximate, based on public literature (WHO, CPCB, EPA, UC Davis).',
  }
}
