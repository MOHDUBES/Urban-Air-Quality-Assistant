// client/src/components/ActionPlan/IndoorHacks.jsx
import React from 'react'

export default function IndoorHacks({ hacks }) {
  if (!hacks || hacks.length === 0) return null

  const getBudgetBadge = (level) => {
    switch (level?.toLowerCase()) {
      case 'low':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300">Budget: Free / Low Cost</span>
      case 'medium':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-yellow-100 text-yellow-800 dark:bg-yellow-900/60 dark:text-yellow-300">Budget: Medium (&lt; ₹2,000)</span>
      case 'high':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300">Budget: Premium HEPA</span>
      default:
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">Budget: Moderate</span>
    }
  }

  return (
    <div>
      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
        <span>🏠</span> Ranked Indoor Air Quality Hacks
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {hacks.map((hack, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                  #{hack.rank || idx + 1} Recommendation
                </span>
                {getBudgetBadge(hack.budgetLevel || hack.estimatedCost)}
              </div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                {hack.title}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {hack.description}
              </p>
            </div>

            {hack.impact && (
              <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700 text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                <span aria-hidden="true">🎯</span>
                <span>Impact: {hack.impact}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
