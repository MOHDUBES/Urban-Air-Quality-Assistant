// client/src/components/ActionPlan/ImpactExplainer.jsx
import React, { useState } from 'react'

export default function ImpactExplainer({ impactData }) {
  const [showAssumptions, setShowAssumptions] = useState(false)

  if (!impactData) return null

  // Support both array of structured objects and string
  const items = Array.isArray(impactData)
    ? impactData
    : [
        {
          recommendation: 'Integrated Clean Air Practices',
          impact: String(impactData),
          assumptions: 'Calculated using CPCB Delhi-NCR ambient monitors and WHO 24h air quality guidelines.',
        },
      ]

  return (
    <div className="rounded-2xl border border-blue-200 dark:border-blue-900 bg-blue-50/40 dark:bg-blue-950/20 p-5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span>📊</span> Direct Personal Impact & Emissions Cut
        </h3>
        <button
          type="button"
          onClick={() => setShowAssumptions((v) => !v)}
          className="text-xs font-semibold text-blue-700 dark:text-blue-300 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded px-1.5 py-0.5"
          aria-expanded={showAssumptions}
        >
          {showAssumptions ? 'Hide Model Assumptions ▲' : 'View Impact Assumptions ▼'}
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs"
          >
            <div className="font-bold text-gray-900 dark:text-white mb-1">
              {item.recommendation}
            </div>
            <div className="text-emerald-700 dark:text-emerald-400 font-semibold mb-1 flex items-start gap-1">
              <span aria-hidden="true">💡</span>
              <span>{item.impact}</span>
            </div>

            {showAssumptions && item.assumptions && (
              <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700 text-[11px] text-gray-500 dark:text-gray-400 italic">
                <strong>Assumptions: </strong> {item.assumptions}
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="mt-3 text-[11px] text-gray-500 dark:text-gray-400 italic">
        * Note: All numerical reductions are scientific estimates marked with (est.), approximate, based on public literature (WHO, CPCB, EPA, UC Davis).
      </p>
    </div>
  )
}
