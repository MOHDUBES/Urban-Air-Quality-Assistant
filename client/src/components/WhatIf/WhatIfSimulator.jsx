// client/src/components/WhatIf/WhatIfSimulator.jsx
import React, { useState } from 'react'
import {
  Train,
  ShieldCheck,
  Wind,
  Footprints,
  Flame,
  Home,
  Zap,
  Leaf,
  Sparkles,
  Info,
  Check,
} from 'lucide-react'
import { getAqiCategory } from '../../utils/aqiUtils.js'

export default function WhatIfSimulator({ onRunWhatIf, result, loading, currentAqi = 250 }) {
  const [choices, setChoices] = useState({
    switchToMetro: true,
    useN95: true,
    runPurifier: true,
    avoidMorningWalk: false,
    cookWithGas: true,
    workFromHome: false,
  })

  const toggleChoice = (key) => {
    setChoices((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSimulate = (e) => {
    e.preventDefault()
    onRunWhatIf(choices)
  }

  const toggles = [
    {
      key: 'switchToMetro',
      icon: Train,
      label: 'Switch Solo Car to Delhi Metro',
      desc: 'Saves direct transit emissions & roadside exposure',
    },
    {
      key: 'useN95',
      icon: ShieldCheck,
      label: 'Wear Well-Fitted N95 Mask',
      desc: 'Filters ≥95% of inhaled fine particulate matter',
    },
    {
      key: 'runPurifier',
      icon: Wind,
      label: 'Run HEPA / DIY Purifier in Bedroom',
      desc: 'Brings indoor sleeping air down to safe WHO limits',
    },
    {
      key: 'avoidMorningWalk',
      icon: Footprints,
      label: 'Skip 6-8 AM Morning Walk',
      desc: 'Avoids winter thermal inversion toxic ground smog',
    },
    {
      key: 'cookWithGas',
      icon: Flame,
      label: 'Use Clean Cooking (LPG/Induction)',
      desc: 'Prevents acute indoor PM2.5 spikes from wood/chulha',
    },
    {
      key: 'workFromHome',
      icon: Home,
      label: 'Work From Home (Skip Commute)',
      desc: '100% elimination of vehicular transit pollution',
    },
  ]

  const ambientCategory = getAqiCategory(currentAqi)
  const effectiveAqi = result?.estimatedExposureAqi || Math.round(currentAqi * 0.45)
  const effectiveCategory = getAqiCategory(effectiveAqi)

  // Max AQI for bar scaling (capped at 500)
  const maxBar = Math.max(currentAqi, 400)
  const ambientPct = Math.min(100, Math.round((currentAqi / maxBar) * 100))
  const effectivePct = Math.min(100, Math.round((effectiveAqi / maxBar) * 100))

  return (
    <div
      className="bg-white dark:bg-navy-850 rounded-2xl p-6 md:p-8 border border-slate-200/80 dark:border-white/10 shadow-sm transition-colors"
      style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
    >
      <div className="mb-6">
        <div className="flex items-center gap-2.5 mb-1.5">
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" aria-hidden="true" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            "What-If" Pollution & Exposure Simulator
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          Toggle protective interventions to dynamically simulate your personal PM2.5 reduction and emissions saved.
        </p>
      </div>

      <form onSubmit={handleSimulate}>
        {/* Switch cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mb-6">
          {toggles.map((item) => {
            const isChecked = choices[item.key]
            const IconComponent = item.icon

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => toggleChoice(item.key)}
                className={`p-4 rounded-2xl border text-left transition-all duration-150 flex flex-col justify-between gap-3 focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                  isChecked
                    ? 'border-teal-500/80 bg-teal-500/10 dark:bg-teal-950/40 text-slate-900 dark:text-white shadow-xs'
                    : 'border-slate-200/80 dark:border-white/10 bg-slate-50/60 dark:bg-navy-900/60 text-slate-700 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20'
                }`}
                aria-pressed={isChecked}
              >
                <div className="flex items-start justify-between w-full gap-2">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isChecked
                        ? 'bg-teal-500 text-white shadow-xs'
                        : 'bg-slate-200/80 dark:bg-navy-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" aria-hidden="true" />
                  </div>

                  {/* Accessible switch indicator pill */}
                  <div
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 flex items-center shrink-0 ${
                      isChecked ? 'bg-teal-600 justify-end' : 'bg-slate-300 dark:bg-navy-800 justify-start'
                    }`}
                    aria-hidden="true"
                  >
                    <div className="w-5 h-5 rounded-full bg-white shadow-xs flex items-center justify-center text-[10px] text-teal-700">
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-xs sm:text-sm font-bold leading-snug">
                    {item.label}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                    {item.desc}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 active:from-teal-800 active:to-emerald-800 text-white font-bold text-sm tracking-wide shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Simulating Dynamic Impact…</span>
            </>
          ) : (
            <>
              <span>Calculate Intervention Impact</span>
              <Zap className="w-4 h-4" aria-hidden="true" />
            </>
          )}
        </button>
      </form>

      {/* Dynamic Results Display */}
      {result && (
        <div
          role="region"
          aria-live="polite"
          className="mt-6 p-6 rounded-2xl bg-teal-500/5 dark:bg-navy-900 border border-teal-500/20 shadow-xs space-y-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300 inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-500" aria-hidden="true" />
              Simulated Exposure Reduction
            </span>
            {result.co2SavedKg && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                <Leaf className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />
                <span>{result.co2SavedKg}</span>
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-baseline gap-4">
            <div className="text-4xl sm:text-5xl font-black text-teal-600 dark:text-teal-400 tracking-tight">
              {result.estimatedReduction}
            </div>
            {result.estimatedExposureAqi && (
              <div className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                Exposure drops from ambient <span className="font-bold text-slate-900 dark:text-white">{currentAqi}</span> to ~<span className="font-bold text-emerald-600 dark:text-emerald-400">{result.estimatedExposureAqi}</span> effective AQI
              </div>
            )}
          </div>

          {/* Live Before / After AQI Comparison Bar */}
          <div className="space-y-3 p-4 rounded-xl bg-white dark:bg-navy-850 border border-slate-200/80 dark:border-white/10">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Ambient Air vs. Effective Filtered Inhalation
            </div>

            {/* Ambient AQI Bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-slate-600 dark:text-slate-400">Ambient Air (Unprotected)</span>
                <span className="font-bold" style={{ color: ambientCategory.color }}>
                  AQI {currentAqi} • {ambientCategory.label}
                </span>
              </div>
              <div className="w-full h-3 bg-slate-100 dark:bg-navy-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 motion-reduce:transition-none"
                  style={{
                    width: `${ambientPct}%`,
                    backgroundColor: ambientCategory.color,
                  }}
                />
              </div>
            </div>

            {/* Effective Exposure Bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-emerald-700 dark:text-emerald-300 font-bold">
                  Effective Inhalation (With Interventions)
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  AQI ~{effectiveAqi} • {effectiveCategory.label}
                </span>
              </div>
              <div className="w-full h-3 bg-slate-100 dark:bg-navy-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 motion-reduce:transition-none"
                  style={{
                    width: `${effectivePct}%`,
                    backgroundColor: effectiveCategory.color,
                  }}
                />
              </div>
            </div>
          </div>

          {/* AI Explanation */}
          <div className="p-4 rounded-xl bg-white dark:bg-navy-850 border border-slate-200/80 dark:border-white/10">
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
              {result.explanation}
            </p>
          </div>

          {result.assumptions && (
            <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 italic flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                <strong>Model Assumptions: </strong> {result.assumptions}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
