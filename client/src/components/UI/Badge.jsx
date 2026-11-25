// client/src/components/UI/Badge.jsx
import React from 'react'
import PropTypes from 'prop-types'

/**
 * Renders an accessible visual badge for telemetry and model sources.
 * @param {{ variant?: 'genai' | 'fallback' | 'live' | 'default', children?: React.ReactNode }} props
 */
export default function Badge({ variant = 'genai', children }) {
  if (variant === 'genai') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm">
        <span aria-hidden="true">✨</span>
        <span>{children || 'GenAI Powered'}</span>
      </span>
    )
  }

  if (variant === 'fallback') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200 border border-amber-300 dark:border-amber-700">
        <span aria-hidden="true">🛡️</span>
        <span>{children || 'Rule-Based Fallback'}</span>
      </span>
    )
  }

  if (variant === 'live') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300 border border-green-300 dark:border-green-800">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" aria-hidden="true"></span>
        <span>{children || 'Live Open-Meteo'}</span>
      </span>
    )
  }

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
      {children}
    </span>
  )
}

Badge.propTypes = {
  variant: PropTypes.string,
  children: PropTypes.node,
}

