// client/src/components/Dashboard/AqiTable.jsx
import React from 'react'
import { getAqiCategory } from '../../utils/aqiUtils.js'

export default function AqiTable({ hourlyData }) {
  if (!hourlyData || hourlyData.length === 0) {
    return <p className="text-xs text-gray-500 py-2">No historical trend data available.</p>
  }

  return (
    <div className="overflow-x-auto max-h-60 rounded-xl border border-gray-200 dark:border-gray-700">
      <table className="w-full text-left text-xs text-gray-700 dark:text-gray-300">
        <caption className="sr-only">
          24-Hour Air Quality Index and PM2.5 hourly observations table for screen readers
        </caption>
        <thead className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white uppercase font-semibold text-[11px] sticky top-0">
          <tr>
            <th scope="col" className="px-3 py-2">Hour</th>
            <th scope="col" className="px-3 py-2">AQI</th>
            <th scope="col" className="px-3 py-2">PM2.5 (µg/m³)</th>
            <th scope="col" className="px-3 py-2">Category</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900">
          {hourlyData.slice(0, 24).map((row, idx) => {
            const timeLabel = row.time ? new Date(row.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : `Hour ${idx}`
            const cat = getAqiCategory(row.aqi)
            return (
              <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-3 py-1.5 font-medium">{timeLabel}</td>
                <td className="px-3 py-1.5 font-bold">{row.aqi}</td>
                <td className="px-3 py-1.5">{row.pm25}</td>
                <td className="px-3 py-1.5">
                  <span className="inline-flex items-center gap-1 font-semibold">
                    <span aria-hidden="true">{cat.emoji}</span>
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
