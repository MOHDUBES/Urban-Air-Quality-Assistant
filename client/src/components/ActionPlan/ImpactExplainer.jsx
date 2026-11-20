// client/src/components/ActionPlan/ImpactExplainer.jsx
import React, { useState } from 'react'
import { BarChart2, ChevronDown, ChevronUp, Lightbulb, Info } from 'lucide-react'

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
          assumptions:
            'Calculated using CPCB Delhi-NCR ambient monitors and WHO 24h air quality guidelines.',
        },
      ]

  return (
    <div className="rounded-2xl border border-teal-500/20 bg-teal-500/5 dark:bg-navy-850 p-5 md:p-6 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
            <BarChart2 className="w-4 h-4" aria-hidden="true" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Direct Personal Impact & Emissions Cut
          </h3>
        </div>

        <button
          type="button"
          onClick={() => setShowAssumptions((v) => !v)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 dark:text-teal-300 hover:text-teal-800 dark:hover:text-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-lg px-2.5 py-1 transition-colors"
          aria-expanded={showAssumptions}
        >
          <span>{showAssumptions ? 'Hide Model Assumptions' : 'View Impact Assumptions'}</span>
          {showAssumptions ? (
            <ChevronUp className="w-4 h-4" aria-hidden="true" />
          ) : (
            <ChevronDown className="w-4 h-4" aria-hidden="true" />
          )}
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-white/10 text-xs shadow-xs"
          >
            <div className="font-bold text-slate-900 dark:text-white mb-1.5 text-sm">
              {item.recommendation}
            </div>
            <div className="text-emerald-700 dark:text-emerald-400 font-semibold mb-1 flex items-start gap-1.5">
              <Lightbulb className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" aria-hidden="true" />
              <span>{item.impact}</span>
            </div>

            {showAssumptions && item.assumptions && (
              <div className="mt-2.5 pt-2.5 border-t border-slate-100 dark:border-white/5 text-[11px] text-slate-500 dark:text-slate-400 italic flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  <strong>Assumptions: </strong> {item.assumptions}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="mt-3.5 text-[11px] text-slate-500 dark:text-slate-400 italic">
        * Note: All numerical reductions are scientific estimates marked with (est.), approximate, based on public literature (WHO, CPCB, EPA, UC Davis).
      </p>
    </div>
  )
}
