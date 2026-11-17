// client/src/components/UI/ErrorBanner.jsx
import React from 'react'

export default function ErrorBanner({ title = 'Error', message, onRetry }) {
  if (!message) return null

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-200 flex items-start gap-3 shadow-sm"
    >
      <span className="text-xl" aria-hidden="true">⚠️</span>
      <div className="flex-1 text-sm">
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-0.5">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          type="button"
          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          Retry
        </button>
      )}
    </div>
  )
}
