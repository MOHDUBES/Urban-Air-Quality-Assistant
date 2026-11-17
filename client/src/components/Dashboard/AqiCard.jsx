// client/src/components/Dashboard/AqiCard.jsx
import React, { useState } from 'react'
import { getAqiCategory, getAqiAriaLabel } from '../../utils/aqiUtils.js'
import Badge from '../UI/Badge.jsx'

export default function AqiCard({ aqiData, onManualOverride, onResetManual }) {
  const [showManual, setShowManual] = useState(false)
  const [manualAqi, setManualAqi] = useState(aqiData?.aqi || 280)
  const [manualPm25, setManualPm25] = useState(aqiData?.pm25 || 140)
  const [manualPm10, setManualPm10] = useState(aqiData?.pm10 || 220)

  const aqi = aqiData?.aqi ?? 0
  const pm25 = aqiData?.pm25 ?? 'N/A'
  const pm10 = aqiData?.pm10 ?? 'N/A'
  const cat = getAqiCategory(aqi)
  const isManual = Boolean(aqiData?.manual)

  const handleManualSubmit = (e) => {
    e.preventDefault()
    onManualOverride({
      aqi: Number(manualAqi),
      pm25: Number(manualPm25),
      pm10: Number(manualPm10),
      timestamp: new Date().toISOString(),
      manual: true,
      category: getAqiCategory(Number(manualAqi)).id,
    })
    setShowManual(false)
  }

  return (
    <div
      className={`rounded-2xl border-2 p-6 transition shadow-md bg-white dark:bg-gray-800 ${cat.bgClass} ${cat.textClass} border-current`}
      role="region"
      aria-live="polite"
      aria-label={getAqiAriaLabel(aqi, cat)}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden="true">{cat.emoji}</span>
          <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/70 dark:bg-black/30 border border-current">
            {cat.label} AQI
          </span>
          {isManual ? (
            <Badge variant="fallback">Manual Entry</Badge>
          ) : (
            <Badge variant="live">Live Data</Badge>
          )}
        </div>

        <button
          onClick={() => setShowManual((v) => !v)}
          type="button"
          className="text-xs font-semibold underline hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 rounded px-1.5 py-0.5"
        >
          {showManual ? 'Hide Override' : 'Override AQI Manually'}
        </button>
      </div>

      {showManual ? (
        <form onSubmit={handleManualSubmit} className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white mb-4 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Manual AQI Fallback Entry
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor="manual-aqi-input" className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">AQI (0-1000)</label>
              <input
                id="manual-aqi-input"
                type="number"
                min="0"
                max="1000"
                required
                value={manualAqi}
                onChange={(e) => setManualAqi(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded border border-gray-300 dark:border-gray-600 bg-transparent"
              />
            </div>
            <div>
              <label htmlFor="manual-pm25-input" className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">PM2.5 (µg/m³)</label>
              <input
                id="manual-pm25-input"
                type="number"
                min="0"
                max="1000"
                value={manualPm25}
                onChange={(e) => setManualPm25(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded border border-gray-300 dark:border-gray-600 bg-transparent"
              />
            </div>
            <div>
              <label htmlFor="manual-pm10-input" className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">PM10 (µg/m³)</label>
              <input
                id="manual-pm10-input"
                type="number"
                min="0"
                max="1000"
                value={manualPm10}
                onChange={(e) => setManualPm10(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded border border-gray-300 dark:border-gray-600 bg-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold"
            >
              Apply Manual Values
            </button>
            {isManual && (
              <button
                type="button"
                onClick={() => {
                  onResetManual()
                  setShowManual(false)
                }}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-xs font-medium rounded"
              >
                Reset to Live API
              </button>
            )}
          </div>
        </form>
      ) : null}

      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
        <div>
          <div className="flex items-baseline gap-3">
            <span className="text-5xl sm:text-6xl font-black tracking-tight">{aqi}</span>
            <div className="text-sm sm:text-base font-bold uppercase tracking-wide">
              {cat.label} Pollution
            </div>
          </div>
          <p className="text-xs sm:text-sm mt-1 max-w-md opacity-90">
            {cat.description}
          </p>
        </div>

        {/* PM readings */}
        <div className="flex sm:flex-col gap-3 sm:gap-1.5 text-xs bg-white/60 dark:bg-black/30 p-3 rounded-xl border border-current self-start">
          <div>
            <span className="font-semibold opacity-75">PM2.5: </span>
            <span className="font-bold">{pm25} µg/m³</span>
          </div>
          <div>
            <span className="font-semibold opacity-75">PM10: </span>
            <span className="font-bold">{pm10} µg/m³</span>
          </div>
          <div className="text-[10px] opacity-70">
            WHO 24h limit: 15 µg/m³
          </div>
        </div>
      </div>
    </div>
  )
}
