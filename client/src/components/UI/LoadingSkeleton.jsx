// client/src/components/UI/LoadingSkeleton.jsx
import React from 'react'

export default function LoadingSkeleton({ variant = 'card', count = 1 }) {
  const items = Array.from({ length: count }, (_, i) => i)

  if (variant === 'aqi') {
    return (
      <div
        className="p-6 md:p-8 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-navy-850 shadow-sm animate-pulse space-y-6"
        role="status"
        aria-label="Loading air quality telemetry"
      >
        <div className="flex items-center justify-between">
          <div className="h-6 w-32 bg-slate-200 dark:bg-navy-800 rounded-md"></div>
          <div className="h-5 w-20 bg-slate-200 dark:bg-navy-800 rounded-full"></div>
        </div>

        {/* Big number shimmer */}
        <div className="flex items-baseline gap-4">
          <div className="h-16 w-28 bg-slate-200 dark:bg-navy-800 rounded-2xl"></div>
          <div className="space-y-2">
            <div className="h-5 w-24 bg-slate-200 dark:bg-navy-800 rounded-md"></div>
            <div className="h-3 w-16 bg-slate-200 dark:bg-navy-800 rounded-md"></div>
          </div>
        </div>

        {/* Scale bar shimmer */}
        <div className="h-2.5 w-full bg-slate-200 dark:bg-navy-800 rounded-full"></div>

        {/* Pollutants grid shimmer */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="h-16 bg-slate-100 dark:bg-navy-800 rounded-xl"></div>
          <div className="h-16 bg-slate-100 dark:bg-navy-800 rounded-xl"></div>
        </div>
      </div>
    )
  }

  if (variant === 'chart') {
    return (
      <div
        className="w-full h-80 p-6 md:p-8 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-navy-850 shadow-sm animate-pulse flex flex-col justify-between"
        role="status"
        aria-label="Loading 24-hour pollution forecast"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-1.5">
            <div className="h-5 w-44 bg-slate-200 dark:bg-navy-800 rounded-md"></div>
            <div className="h-3 w-32 bg-slate-200 dark:bg-navy-800 rounded-md"></div>
          </div>
          <div className="h-8 w-28 bg-slate-200 dark:bg-navy-800 rounded-lg"></div>
        </div>

        {/* Shimmer wave simulation */}
        <div className="flex items-end gap-2 h-44 pt-6">
          {[40, 65, 80, 95, 70, 50, 45, 60, 85, 90, 75, 55].map((h, idx) => (
            <div
              key={idx}
              className="flex-1 bg-slate-200/80 dark:bg-navy-800 rounded-t-md"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>

        <div className="flex justify-between pt-2">
          <div className="h-3 w-16 bg-slate-200 dark:bg-navy-800 rounded"></div>
          <div className="h-3 w-16 bg-slate-200 dark:bg-navy-800 rounded"></div>
          <div className="h-3 w-16 bg-slate-200 dark:bg-navy-800 rounded"></div>
        </div>
      </div>
    )
  }

  if (variant === 'plan') {
    return (
      <div
        className="p-6 md:p-8 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-navy-850 shadow-sm space-y-7 animate-pulse"
        role="status"
        aria-label="Generating personalized plan"
      >
        <div className="space-y-3 pb-6 border-b border-slate-200/80 dark:border-white/10">
          <div className="flex items-center gap-2">
            <div className="h-6 w-32 bg-slate-200 dark:bg-navy-800 rounded-full"></div>
            <div className="h-6 w-24 bg-slate-200 dark:bg-navy-800 rounded-full"></div>
          </div>
          <div className="h-8 w-64 bg-slate-200 dark:bg-navy-800 rounded-xl"></div>
          <div className="h-4 w-full max-w-xl bg-slate-200 dark:bg-navy-800 rounded-md"></div>
        </div>

        {/* Routine Shimmer */}
        <div className="space-y-3">
          <div className="h-5 w-48 bg-slate-200 dark:bg-navy-800 rounded-md"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-36 bg-slate-100 dark:bg-navy-800 rounded-2xl"></div>
            <div className="h-36 bg-slate-100 dark:bg-navy-800 rounded-2xl"></div>
            <div className="h-36 bg-slate-100 dark:bg-navy-800 rounded-2xl"></div>
          </div>
        </div>

        {/* Hacks Shimmer */}
        <div className="space-y-3">
          <div className="h-5 w-48 bg-slate-200 dark:bg-navy-800 rounded-md"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-32 bg-slate-100 dark:bg-navy-800 rounded-2xl"></div>
            <div className="h-32 bg-slate-100 dark:bg-navy-800 rounded-2xl"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3.5" role="status" aria-label="Loading content">
      {items.map((key) => (
        <div
          key={key}
          className="h-24 bg-slate-100 dark:bg-navy-850 rounded-2xl animate-pulse border border-slate-200/60 dark:border-white/10"
        />
      ))}
    </div>
  )
}
