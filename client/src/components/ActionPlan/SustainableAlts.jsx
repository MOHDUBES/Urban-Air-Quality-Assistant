// client/src/components/ActionPlan/SustainableAlts.jsx
import React from 'react'
import { RefreshCw, ArrowRight, Leaf, ShieldAlert } from 'lucide-react'

export default function SustainableAlts({ alternatives }) {
  if (!alternatives || alternatives.length === 0) return null

  return (
    <div>
      <div className="flex items-center gap-2 mb-3.5">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
          <RefreshCw className="w-4 h-4" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Sustainable Lifestyle Alternatives
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            High-impact behavioral substitutions that lower both individual exposure and citywide emissions
          </p>
        </div>
      </div>

      <div className="space-y-3.5">
        {alternatives.map((alt, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-navy-850 shadow-xs hover:border-emerald-500/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-2.5 flex-1">
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                {alt.category || 'Lifestyle Shift'}
              </span>

              {/* Current -> Better comparison */}
              <div className="flex flex-wrap items-center gap-2.5 text-xs">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-navy-800 text-slate-500 dark:text-slate-400 font-medium">
                  <ShieldAlert className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                  <span className="line-through">{alt.current}</span>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />

                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 font-bold border border-emerald-200 dark:border-emerald-800/80">
                  <Leaf className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                  <span>{alt.alternative}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {alt.impact}
              </p>
            </div>

            {alt.co2Saved && (
              <div className="shrink-0 self-start md:self-center px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-left md:text-right">
                <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 dark:text-emerald-400 flex items-center md:justify-end gap-1">
                  <Leaf className="w-3 h-3" aria-hidden="true" />
                  Emissions Cut
                </div>
                <div className="text-xs font-black text-emerald-700 dark:text-emerald-300 mt-0.5">
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
