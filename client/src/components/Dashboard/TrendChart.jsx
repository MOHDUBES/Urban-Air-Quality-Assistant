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
import { Table, LineChart as ChartIcon, Info } from 'lucide-react'
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

  // Custom Chart.js data with clean curves and area fills
  const data = {
    labels,
    datasets: [
      {
        label: 'AQI Index',
        data: aqiValues,
        borderColor: '#14B8A6', // Brand Teal
        backgroundColor: 'rgba(20, 184, 166, 0.16)',
        fill: true,
        tension: 0.38,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: '#14B8A6',
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 1.5,
        yAxisID: 'y',
      },
      {
        label: 'PM2.5 (µg/m³)',
        data: pm25Values,
        borderColor: '#F58220', // CPCB Poor / Orange
        backgroundColor: 'transparent',
        borderDash: [5, 4],
        tension: 0.35,
        pointRadius: 2,
        pointHoverRadius: 5,
        pointBackgroundColor: '#F58220',
        yAxisID: 'y1',
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: prefersReducedMotion ? false : { duration: 500 },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          boxWidth: 14,
          boxHeight: 14,
          usePointStyle: true,
          pointStyle: 'circle',
          font: { size: 12, weight: '600' },
          color: '#64748B', // WCAG AA contrast muted
          padding: 16,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(10, 18, 32, 0.94)',
        titleColor: '#FFFFFF',
        titleFont: { size: 13, weight: 'bold' },
        bodyFont: { size: 12 },
        bodySpacing: 5,
        padding: 12,
        cornerRadius: 10,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          maxTicksLimit: 8,
          font: { size: 12, weight: '500' },
          color: '#64748B',
        },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'AQI Index',
          font: { size: 12, weight: 'bold' },
          color: '#14B8A6',
        },
        ticks: {
          font: { size: 12 },
          color: '#64748B',
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: { drawOnChartArea: false },
        title: {
          display: true,
          text: 'PM2.5 (µg/m³)',
          font: { size: 12, weight: 'bold' },
          color: '#F58220',
        },
        ticks: {
          font: { size: 12 },
          color: '#64748B',
        },
      },
    },
  }

  return (
    <div
      className="rounded-3xl p-5 sm:p-6 shadow-sm border transition-colors duration-200 space-y-4"
      style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base sm:text-lg font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
            24-Hour Smog Trend
          </h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Open-Meteo hourly particulate dispersion and AQI curve
          </p>
        </div>

        {/* Accessible Table vs Chart Toggle Button */}
        <button
          type="button"
          onClick={() => setShowTable((v) => !v)}
          className="text-xs font-semibold px-3 py-1.5 rounded-xl border focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal transition-all flex items-center gap-1.5"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            borderColor: 'var(--border-subtle)',
            color: 'var(--text-secondary)'
          }}
          aria-expanded={showTable}
        >
          {showTable ? (
            <>
              <ChartIcon className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" aria-hidden="true" />
              <span>Show Chart</span>
            </>
          ) : (
            <>
              <Table className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" aria-hidden="true" />
              <span>Accessible Table</span>
            </>
          )}
        </button>
      </div>

      {/* AQI Danger Zones Legend Banner */}
      <div
        className="px-3 py-1.5 rounded-xl border flex flex-wrap items-center gap-3 text-[11px] font-medium"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          borderColor: 'var(--border-subtle)',
          color: 'var(--text-muted)'
        }}
      >
        <span className="font-bold flex items-center gap-1" style={{ color: 'var(--text-primary)' }}>
          <Info className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" aria-hidden="true" />
          <span>CPCB Alert Bands:</span>
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#F58220]" />
          <span>Poor (201-300)</span>
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#E03C31]" />
          <span>Very Poor (301-400)</span>
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#9B1C31]" />
          <span>Severe (401+)</span>
        </span>
      </div>

      {showTable ? (
        <AqiTable hourlyData={items} />
      ) : (
        <div className="h-64 sm:h-72 w-full">
          <Line data={data} options={options} aria-label="24-hour Air Quality trend line chart" />
        </div>
      )}
    </div>
  )
}
