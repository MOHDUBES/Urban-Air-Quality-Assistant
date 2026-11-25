// client/src/components/UI/ErrorBanner.jsx
import React from 'react'
import PropTypes from 'prop-types'
import { AlertTriangle, RotateCcw } from 'lucide-react'

/**
 * Accessible alert banner for displaying error messages with optional retry.
 * @param {{ title?: string, message: string, onRetry?: () => void }} props
 */
export default function ErrorBanner({ title = 'Something went wrong', message, onRetry }) {
  if (!message) return null

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-900 dark:text-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs transition-colors"
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
          <AlertTriangle className="w-5 h-5" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-rose-900 dark:text-rose-200">
            {title}
          </h3>
          <p className="text-xs text-rose-700 dark:text-rose-300/90 mt-0.5 leading-relaxed">
            {message}
          </p>
        </div>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          type="button"
          className="self-end sm:self-center inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white rounded-xl text-xs font-bold tracking-wide shadow-xs focus:outline-none focus:ring-2 focus:ring-rose-500 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Retry</span>
        </button>
      )}
    </div>
  )
}

ErrorBanner.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  onRetry: PropTypes.func,
}

