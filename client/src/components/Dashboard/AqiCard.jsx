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
        return <ShieldCheck className="w-4 h-4 text-[#00A651]" aria-hidden="true" strokeWidth={2.2} />
      case 'satisfactory':
        return <CheckCircle2 className="w-4 h-4 text-[#8DC63F]" aria-hidden="true" strokeWidth={2.2} />
      case 'moderate':
        return <AlertCircle className="w-4 h-4 text-[#F4C20D]" aria-hidden="true" strokeWidth={2.2} />
      case 'poor':
        return <AlertTriangle className="w-4 h-4 text-[#F58220]" aria-hidden="true" strokeWidth={2.2} />
      case 'very_poor':
        return <AlertOctagon className="w-4 h-4 text-[#E03C31]" aria-hidden="true" strokeWidth={2.2} />
      case 'severe':
      default:
        return <ShieldAlert className="w-4 h-4 text-[#9B1C31]" aria-hidden="true" strokeWidth={2.2} />
    }
  }

  // Calculate marker position on 0–500 scale, clamped for display
  const clampedAqi = Math.max(0, Math.min(500, aqi))
  const markerPercent = Math.max(2, Math.min(98, (clampedAqi / 500) * 100))

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
      className="rounded-3xl p-5 sm:p-6 shadow-sm border transition-colors duration-200 space-y-5"
      role="region"
      aria-live="polite"
      aria-label={getAqiAriaLabel(aqi, cat)}
      style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
    >
      {/* Top Header Bar: Status Chips + Override Button */}
      <div className="flex items-center justify-between gap-2.5 pb-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Category Chip */}
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border shadow-xs"
            style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
          >
            {getCategoryIcon(cat.id)}
            <span>{cat.label} AQI</span>
          </div>

          {/* Live / Manual Status Pill */}
          {isManual ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
              Manual Entry
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
              <span>Live</span>
            </span>
          )}
        </div>

        {/* Manual Override Action Button */}
        <button
          onClick={() => setShowManual((v) => !v)}
          type="button"
          className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 flex items-center gap-1 px-2.5 py-1 rounded-lg border border-teal-500/20 hover:bg-teal-50 dark:hover:bg-teal-950/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal transition-all shrink-0"
        >
          <SlidersHorizontal className="w-3 h-3" aria-hidden="true" />
          <span>{showManual ? 'Hide Override' : 'Override AQI Manually'}</span>
        </button>
      </div>

      {/* Manual Override Form Drawer/Panel */}
      {showManual && (
        <form
          onSubmit={handleManualSubmit}
          className="p-4 rounded-2xl border space-y-3 shadow-xs"
          style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label htmlFor="manual-aqi-input" className="block text-[11px] font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>
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
                className="w-full h-9 px-3 text-xs rounded-xl border bg-transparent focus:outline-none focus:ring-2 focus:ring-brand-teal"
                style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
              />
            </div>
            <div>
              <label htmlFor="manual-pm25-input" className="block text-[11px] font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>
                PM2.5 (µg/m³)
              </label>
              <input
                id="manual-pm25-input"
                type="number"
                min="0"
                max="1000"
                value={manualPm25}
                onChange={(e) => setManualPm25(e.target.value)}
                className="w-full h-9 px-3 text-xs rounded-xl border bg-transparent focus:outline-none focus:ring-2 focus:ring-brand-teal"
                style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
              />
            </div>
            <div>
              <label htmlFor="manual-pm10-input" className="block text-[11px] font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>
                PM10 (µg/m³)
              </label>
              <input
                id="manual-pm10-input"
                type="number"
                min="0"
                max="1000"
                value={manualPm10}
                onChange={(e) => setManualPm10(e.target.value)}
                className="w-full h-9 px-3 text-xs rounded-xl border bg-transparent focus:outline-none focus:ring-2 focus:ring-brand-teal"
                style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-xl text-xs font-bold shadow-xs transition"
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
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition"
                style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}
              >
                Reset to Live API
              </button>
            )}
          </div>
        </form>
      )}

      {/* Primary AQI Metric Area */}
      <div>
        <div className="flex items-center gap-1 text-[11px] mb-2" style={{ color: 'var(--text-muted)' }}>
          <Clock className="w-3 h-3 shrink-0" aria-hidden="true" />
          <span>Updated {updatedTime}</span>
        </div>

        <div className="flex items-baseline gap-3.5">
          {/* Big 64px number */}
          <span
            className="text-6xl sm:text-7xl font-black tracking-tight leading-none"
            style={{ color: 'var(--text-primary)' }}
          >
            {aqi}
          </span>
          <div className="min-w-0">
            <div
              className="text-base sm:text-lg font-black uppercase tracking-wide leading-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              {cat.label} Pollution
            </div>
            <p className="text-xs mt-1 leading-relaxed line-clamp-2" style={{ color: 'var(--text-muted)' }}>
              {cat.description}
            </p>
          </div>
        </div>
      </div>

      {/* PM2.5 / PM10 Full-Width Telemetry Card (Never overflows or truncates) */}
      <div
        className="p-3 sm:p-3.5 rounded-2xl border space-y-2.5 transition-colors"
        style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}
      >
        <div className="grid grid-cols-2 gap-3 divide-x" style={{ borderColor: 'var(--border-subtle)' }}>
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              PM2.5 Level
            </span>
            <span className="text-sm sm:text-base font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              {pm25} µg/m³
            </span>
          </div>
          <div className="pl-3">
            <span className="block text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              PM10 Level
            </span>
            <span className="text-sm sm:text-base font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              {pm10} µg/m³
            </span>
          </div>
        </div>

        {whoMultiple && (
          <div className="pt-2 border-t flex items-center justify-between text-xs font-bold text-red-600 dark:text-red-400 gap-2" style={{ borderColor: 'var(--border-subtle)' }}>
            <span className="flex items-center gap-1 text-[11px]">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>vs WHO limit:</span>
            </span>
            <span className="text-[11px] font-extrabold bg-red-500/10 px-2 py-0.5 rounded-md border border-red-500/20">
              {whoMultiple}x WHO 24h limit
            </span>
          </div>
        )}
      </div>

      {/* Horizontal 6-Segment CPCB Scale Bar with Marker */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between text-[10px] font-bold" style={{ color: 'var(--text-muted)' }}>
          <span>0 (Good)</span>
          <span>100</span>
          <span>200</span>
          <span>300</span>
          <span>400</span>
          <span>500+ (Severe)</span>
        </div>

        {/* The 6-segment scale bar */}
        <div
          className="relative h-2.5 w-full rounded-full overflow-hidden flex"
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
            className="absolute top-0 -translate-x-1/2 flex flex-col items-center transition-all duration-300 pointer-events-none"
            style={{ left: `${markerPercent}%` }}
            aria-hidden="true"
          >
            <span
              className="text-[10px] font-black tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              ▲ {aqi}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
