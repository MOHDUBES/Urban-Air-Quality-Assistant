// client/src/components/Dashboard/TrendChart.jsx
import React, { useState, useEffect } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import AqiTable from './AqiTable.jsx'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export default function TrendChart({ hourlyData }) {
  const [showTable, setShowTable] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mq.matches)
    const handler = (e) => setPrefersReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  if (!hourlyData || hourlyData.length === 0) {
    return null
  }

  const items = hourlyData.slice(0, 24)
  const labels = items.map((d, i) => {
    if (!d.time) return `${i}:00`
    const date = new Date(d.time)
    return date.toLocaleTimeString([], { hour: 'numeric', hour12: true })
  })

  const aqiValues = items.map((d) => d.aqi)
  const pm25Values = items.map((d) => d.pm25)

  const data = {
    labels,
    datasets: [
      {
        label: 'AQI Index',
        data: aqiValues,
        borderColor: '#7c3aed',
        backgroundColor: 'rgba(124, 58, 237, 0.15)',
        fill: true,
        tension: 0.35,
        pointRadius: 2,
        pointHoverRadius: 5,
        yAxisID: 'y',
      },
      {
        label: 'PM2.5 (µg/m³)',
        data: pm25Values,
        borderColor: '#ef4444',
        backgroundColor: 'transparent',
        borderDash: [4, 4],
        tension: 0.3,
        pointRadius: 1,
        yAxisID: 'y1',
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: prefersReducedMotion ? false : { duration: 600 },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 12,
          font: { size: 11 },
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { maxTicksLimit: 8, font: { size: 10 } },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: { display: true, text: 'AQI', font: { size: 10 } },
        ticks: { font: { size: 10 } },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: { drawOnChartArea: false },
        title: { display: true, text: 'PM2.5 (µg/m³)', font: { size: 10 } },
        ticks: { font: { size: 10 } },
      },
    },
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-md">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            24-Hour Smog Trend
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Open-Meteo hourly particulate dispersion and AQI curve
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowTable((v) => !v)}
          className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-expanded={showTable}
        >
          {showTable ? 'Show Chart' : 'Accessible Table'}
        </button>
      </div>

      {showTable ? (
        <AqiTable hourlyData={items} />
      ) : (
        <div className="h-64 w-full">
          <Line data={data} options={options} aria-label="24-hour Air Quality trend line chart" />
        </div>
      )}
    </div>
  )
}
