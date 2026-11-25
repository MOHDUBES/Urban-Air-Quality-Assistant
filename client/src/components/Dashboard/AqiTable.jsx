// client/src/components/Dashboard/AqiTable.jsx
import React from 'react'
import { ShieldCheck, CheckCircle2, AlertCircle, AlertTriangle, AlertOctagon, ShieldAlert } from 'lucide-react'
import { getAqiCategory } from '../../utils/aqiUtils.js'

function getCategoryIcon(id) {
  switch (id) {
    case 'good':
      return <ShieldCheck className="w-3.5 h-3.5 text-[#00A651]" aria-hidden="true" />
    case 'satisfactory':
      return <CheckCircle2 className="w-3.5 h-3.5 text-[#8DC63F]" aria-hidden="true" />
    case 'moderate':
      return <AlertCircle className="w-3.5 h-3.5 text-[#F4C20D]" aria-hidden="true" />
    case 'poor':
      return <AlertTriangle className="w-3.5 h-3.5 text-[#F58220]" aria-hidden="true" />
    case 'very_poor':
      return <AlertOctagon className="w-3.5 h-3.5 text-[#E03C31]" aria-hidden="true" />
    case 'severe':
    default:
      return <ShieldAlert className="w-3.5 h-3.5 text-[#9B1C31]" aria-hidden="true" />
  }
}

export default function AqiTable({ hourlyData }) {
  if (!hourlyData || hourlyData.length === 0) {
    return (
      <p className="text-xs py-2" style={{ color: 'var(--text-muted)' }}>
        No historical trend data available.
      </p>
    )
  }

  return (
    <div
      className="overflow-x-auto max-h-60 rounded-xl border"
      style={{ borderColor: 'var(--border-subtle)' }}
    >
      <table className="w-full text-left text-xs" style={{ color: 'var(--text-secondary)' }}>
        <caption className="sr-only">
          24-Hour Air Quality Index and PM2.5 hourly observations table for screen readers
        </caption>
        <thead
          className="uppercase font-semibold text-[11px] sticky top-0 border-b"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            borderColor: 'var(--border-subtle)',
            color: 'var(--text-primary)'
          }}
        >
          <tr>
            <th scope="col" className="px-3 py-2">Hour</th>
            <th scope="col" className="px-3 py-2">AQI</th>
            <th scope="col" className="px-3 py-2">PM2.5 (µg/m³)</th>
            <th scope="col" className="px-3 py-2">Category</th>
          </tr>
        </thead>
        <tbody
          className="divide-y"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-subtle)'
          }}
        >
          {hourlyData.slice(0, 24).map((row, idx) => {
            const timeLabel = row.time ? new Date(row.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : `Hour ${idx}`
            const cat = getAqiCategory(row.aqi)
            return (
              <tr key={idx} className="hover:bg-teal-500/5 transition-colors">
                <td className="px-3 py-1.5 font-medium">{timeLabel}</td>
                <td className="px-3 py-1.5 font-bold" style={{ color: 'var(--text-primary)' }}>{row.aqi}</td>
                <td className="px-3 py-1.5">{row.pm25}</td>
                <td className="px-3 py-1.5">
                  <span className="inline-flex items-center gap-1.5 font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {getCategoryIcon(cat.id)}
                    <span>{cat.label}</span>
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
