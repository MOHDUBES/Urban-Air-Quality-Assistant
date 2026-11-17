// client/src/components/ActionPlan/SustainableAlts.jsx
import React from 'react'

export default function SustainableAlts({ alternatives }) {
  if (!alternatives || alternatives.length === 0) return null

  return (
    <div>
      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
        <span>🔄</span> Sustainable Lifestyle Alternatives
      </h3>

      <div className="space-y-3">
        {alternatives.map((alt, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                {alt.category || 'Lifestyle Shift'}
              </span>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="line-through text-gray-400 dark:text-gray-500 font-medium">
                  {alt.current}
                </span>
                <span className="text-gray-400" aria-hidden="true">→</span>
                <span className="font-bold text-gray-900 dark:text-white bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                  {alt.alternative}
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {alt.impact}
              </p>
            </div>

            {alt.co2Saved && (
              <div className="shrink-0 self-start sm:self-center px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-right">
                <div className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-400">
                  Emissions Cut
                </div>
                <div className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  {alt.co2Saved}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
