// client/src/components/ActionPlan/IndoorHacks.jsx
import React from 'react'
import { ShieldCheck, TrendingDown, Sparkles } from 'lucide-react'

function parseReductionPercent(impactStr) {
  if (!impactStr) return 50
  const match = impactStr.match(/(\d+)(?:–|-)?(\d+)?%/)
  if (match) {
    if (match[2]) {
      return Math.min(100, Math.round((parseInt(match[1], 10) + parseInt(match[2], 10)) / 2))
    }
    return Math.min(100, parseInt(match[1], 10))
  }
  return 60
}

export default function IndoorHacks({ hacks }) {
  if (!hacks || hacks.length === 0) return null

  const getBudgetBadge = (level) => {
    switch (level?.toLowerCase()) {
      case 'low':
        return (
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
            Budget: Free / Low Cost
          </span>
        )
      case 'medium':
        return (
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
            Budget: Medium (&lt; ₹2,000)
          </span>
        )
      case 'high':
        return (
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
            Budget: Premium HEPA
          </span>
        )
      default:
        return (
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-500/10 text-slate-700 dark:text-slate-300 border border-slate-500/20">
            Budget: Moderate
          </span>
        )
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-3.5">
        <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-4 h-4" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Ranked Indoor Air Quality Hacks
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Scientifically ranked interventions for indoor clean-air sanctuaries
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hacks.map((hack, idx) => {
          const rank = hack.rank || idx + 1
          const pct = parseReductionPercent(hack.impact)

          return (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-navy-850 shadow-xs hover:border-teal-500/40 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-0.5 rounded-md border border-teal-200/60 dark:border-teal-800/60">
                    <Sparkles className="w-3 h-3" aria-hidden="true" />
                    #{rank} Recommendation
                  </span>
                  {getBudgetBadge(hack.budgetLevel || hack.estimatedCost)}
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                  {hack.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                  {hack.description}
                </p>
              </div>

              {hack.impact && (
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-1 font-semibold text-teal-700 dark:text-teal-300">
                      <TrendingDown className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />
                      <span>Impact: {hack.impact}</span>
                    </span>
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      ~{pct}% cut
                    </span>
                  </div>

                  {/* Impact Progress Bar */}
                  <div
                    className="w-full h-1.5 bg-slate-100 dark:bg-navy-800 rounded-full overflow-hidden"
                    role="progressbar"
                    aria-valuenow={pct}
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-label={`Estimated reduction: ${pct}%`}
                  >
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
