// client/src/components/Dashboard/AqiCard.jsx
import React, { useState } from 'react'
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  AlertOctagon,
  ShieldAlert,
  SlidersHorizontal,
  X,
  Clock,
  Info
} from 'lucide-react'
import { getAqiCategory, getAqiAriaLabel } from '../../utils/aqiUtils.js'

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

  // Calculate WHO limit multiple (WHO 24-hour PM2.5 guideline = 15 µg/m³)
  const pm25Num = typeof pm25 === 'number' ? pm25 : parseFloat(pm25)
  const whoMultiple = !isNaN(pm25Num) && pm25Num > 0 ? (pm25Num / 15).toFixed(1) : null

  // Format updated time
  const updatedTime = aqiData?.timestamp
    ? new Date(aqiData.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'Just now'

  // Category Icon Mapping
  const getCategoryIcon = (id) => {
    switch (id) {
      case 'good':
        return <ShieldCheck className="w-5 h-5 text-emerald-500" aria-hidden="true" strokeWidth={2} />
      case 'satisfactory':
        return <CheckCircle2 className="w-5 h-5 text-lime-500" aria-hidden="true" strokeWidth={2} />
      case 'moderate':
        return <AlertCircle className="w-5 h-5 text-amber-500" aria-hidden="true" strokeWidth={2} />
      case 'poor':
        return <AlertTriangle className="w-5 h-5 text-orange-500" aria-hidden="true" strokeWidth={2} />
      case 'very_poor':
        return <AlertOctagon className="w-5 h-5 text-red-500" aria-hidden="true" strokeWidth={2} />
      case 'severe':
      default:
        return <ShieldAlert className="w-5 h-5 text-purple-400" aria-hidden="true" strokeWidth={2} />
    }
  }

  // Calculate marker position on 0–500 scale
  const clampedAqi = Math.max(0, Math.min(500, aqi))
  const markerPercent = (clampedAqi / 500) * 100

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
      className="bg-white dark:bg-navy-850 rounded-card p-6 md:p-7 shadow-card border border-slate-200/80 dark:border-white/10 relative overflow-hidden transition-colors duration-200"
      role="region"
      aria-live="polite"
      aria-label={getAqiAriaLabel(aqi, cat)}
      style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
    >
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Category Chip */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 dark:bg-navy-800 text-slate-900 dark:text-white border border-slate-200/80 dark:border-white/10 shadow-xs">
            {getCategoryIcon(cat.id)}
            <span>{cat.label} AQI</span>
          </div>

          {/* Live / Manual Status Pill */}
          {isManual ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
              <span>Manual Entry</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
              <span>Live</span>
            </span>
          )}

          {/* Updated Time */}
          <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <Clock className="w-3 h-3 text-slate-400" aria-hidden="true" />
            <span>Updated {updatedTime}</span>
          </span>
        </div>

        {/* Manual Override Action Button */}
        <button
          onClick={() => setShowManual((v) => !v)}
          type="button"
          className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-teal-500/20 hover:bg-teal-50 dark:hover:bg-teal-950/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal transition-all"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{showManual ? 'Hide Override' : 'Override AQI Manually'}</span>
        </button>
      </div>

      {/* Manual Override Form Drawer/Panel */}
      {showManual && (
        <form
          onSubmit={handleManualSubmit}
          className="p-5 rounded-2xl bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white mb-6 space-y-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 flex items-center gap-1.5">
              <Info className="w-4 h-4" aria-hidden="true" />
              <span>Manual AQI Fallback Entry</span>
            </div>
            <button
              type="button"
              onClick={() => setShowManual(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
              aria-label="Close manual override"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="manual-aqi-input" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                AQI (0-1000)
              </label>
              <input
                id="manual-aqi-input"
                type="number"
                min="0"
                max="1000"
                required
                value={manualAqi}
                onChange={(e) => setManualAqi(e.target.value)}
                className="w-full h-10 px-3 text-xs rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-navy-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-teal"
              />
            </div>
            <div>
              <label htmlFor="manual-pm25-input" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                PM2.5 (µg/m³)
              </label>
              <input
                id="manual-pm25-input"
                type="number"
                min="0"
                max="1000"
                value={manualPm25}
                onChange={(e) => setManualPm25(e.target.value)}
                className="w-full h-10 px-3 text-xs rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-navy-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-teal"
              />
            </div>
            <div>
              <label htmlFor="manual-pm10-input" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                PM10 (µg/m³)
              </label>
              <input
                id="manual-pm10-input"
                type="number"
                min="0"
                max="1000"
                value={manualPm10}
                onChange={(e) => setManualPm10(e.target.value)}
                className="w-full h-10 px-3 text-xs rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-navy-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-teal"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-xl text-xs font-bold shadow-xs transition"
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
                className="px-4 py-2 bg-slate-200 dark:bg-navy-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-navy-600 text-xs font-bold rounded-xl transition"
              >
                Reset to Live API
              </button>
            )}
          </div>
        </form>
      )}

      {/* Main Metrics Area: 64px Number + Category + PM Mini Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
        <div>
          <div className="flex items-baseline gap-3">
            {/* Big 64px number */}
            <span className="text-6xl sm:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
              {aqi}
            </span>
            <div>
              <div className="text-base sm:text-lg font-black uppercase tracking-wide text-slate-900 dark:text-white">
                {cat.label} Pollution
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5 max-w-md">
                {cat.description}
              </p>
            </div>
          </div>
        </div>

        {/* PM2.5 / PM10 Mini Stats with WHO Comparison */}
        <div className="flex sm:flex-row lg:flex-col gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-navy-800 border border-slate-200/80 dark:border-white/10 self-start sm:self-auto min-w-[220px]">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">PM2.5:</span>
            <span className="text-sm font-black text-slate-900 dark:text-white">{pm25} µg/m³</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">PM10:</span>
            <span className="text-sm font-black text-slate-900 dark:text-white">{pm10} µg/m³</span>
          </div>
          {whoMultiple && (
            <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs font-bold text-red-600 dark:text-red-400">
              <span>vs WHO limit:</span>
              <span>{whoMultiple}x WHO 24h limit</span>
            </div>
          )}
        </div>
      </div>

      {/* Horizontal 6-Segment CPCB Scale Bar with Indicator Marker */}
      <div className="space-y-1.5 pt-2">
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
          <span>0 (Good)</span>
          <span>100</span>
          <span>200</span>
          <span>300</span>
          <span>400</span>
          <span>500+ (Severe)</span>
        </div>

        {/* The 6-segment scale bar */}
        <div
          className="relative h-3 w-full rounded-full overflow-hidden flex bg-slate-200 dark:bg-navy-900"
          role="meter"
          aria-label="CPCB AQI Scale"
          aria-valuenow={aqi}
          aria-valuemin={0}
          aria-valuemax={500}
        >
          {/* 1: Good (0-50) */}
          <div className="flex-1 bg-[#00A651]" title="Good (0-50)" />
          {/* 2: Satisfactory (51-100) */}
          <div className="flex-1 bg-[#8DC63F]" title="Satisfactory (51-100)" />
          {/* 3: Moderate (101-200) */}
          <div className="flex-[2] bg-[#F4C20D]" title="Moderate (101-200)" />
          {/* 4: Poor (201-300) */}
          <div className="flex-[2] bg-[#F58220]" title="Poor (201-300)" />
          {/* 5: Very Poor (301-400) */}
          <div className="flex-[2] bg-[#E03C31]" title="Very Poor (301-400)" />
          {/* 6: Severe (401-500+) */}
          <div className="flex-[2] bg-[#9B1C31]" title="Severe (401-500+)" />
        </div>

        {/* Relative marker indicator positioned along the bar */}
        <div className="relative w-full h-4">
          <div
            className="absolute top-0 -translate-x-1/2 flex flex-col items-center transition-all duration-500"
            style={{ left: `${markerPercent}%` }}
            aria-hidden="true"
          >
            <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px] border-b-slate-900 dark:border-b-white" />
            <span className="text-[10px] font-black tracking-tight text-slate-900 dark:text-white">▲ {aqi}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
