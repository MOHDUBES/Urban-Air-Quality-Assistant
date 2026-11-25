// client/src/components/UI/ErrorBoundary.jsx
// Production-grade React Error Boundary with accessible fallback UI and retry handler.

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    if (process.env.NODE_ENV !== 'test') {
      console.error('[ErrorBoundary caught error]', error, errorInfo)
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
    if (typeof this.props.onReset === 'function') {
      this.props.onReset()
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div
          role="alert"
          aria-live="assertive"
          className="min-h-[280px] p-8 my-6 mx-auto max-w-2xl rounded-2xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/70 dark:bg-rose-950/20 text-rose-900 dark:text-rose-200 flex flex-col items-center justify-center text-center gap-4 shadow-sm"
        >
          <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shadow-inner">
            <AlertTriangle className="w-7 h-7" aria-hidden="true" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              An unexpected display error occurred
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md">
              The application encountered a client-side rendering exception. Your environmental session data is safe.
            </p>
          </div>

          <button
            type="button"
            onClick={this.handleRetry}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            <span>Reload Component</span>
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node,
  onReset: PropTypes.func,
}
