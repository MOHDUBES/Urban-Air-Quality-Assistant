// client/src/components/UI/LoadingSkeleton.jsx
import React from 'react'

export default function LoadingSkeleton({ variant = 'card', count = 1 }) {
  const items = Array.from({ length: count }, (_, i) => i)

  if (variant === 'chart') {
    return (
      <div
        className="w-full h-64 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse flex items-center justify-center p-6 border border-gray-300 dark:border-gray-700"
        role="status"
        aria-label="Loading chart data"
      >
        <div className="flex flex-col items-center gap-2 text-gray-400">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium">Fetching 24-hour pollution forecast…</span>
        </div>
      </div>
    )
  }

  if (variant === 'plan') {
    return (
      <div className="space-y-4" role="status" aria-label="Generating personalized plan">
        <div className="h-28 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-36 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"></div>
          <div className="h-36 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"></div>
          <div className="h-36 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"></div>
        </div>
        <div className="h-44 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"></div>
      </div>
    )
  }

  return (
    <div className="space-y-3" role="status" aria-label="Loading content">
      {items.map((key) => (
        <div
          key={key}
          className="h-24 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse border border-gray-300/50 dark:border-gray-700/50"
        ></div>
      ))}
    </div>
  )
}
