// client/src/components/WhatIf/WhatIfSimulator.jsx
import React, { useState } from 'react'

export default function WhatIfSimulator({ onRunWhatIf, result, loading, currentAqi }) {
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
    { key: 'switchToMetro', label: '🚇 Switch Solo Car to Delhi Metro', desc: 'Saves direct transit emissions & roadside exposure' },
    { key: 'useN95', label: '😷 Wear Well-Fitted N95 Mask', desc: 'Filters >=95% of inhaled fine particulate matter' },
    { key: 'runPurifier', label: '💨 Run HEPA / DIY Purifier in Bedroom', desc: 'Brings indoor sleeping air down to safe WHO limits' },
    { key: 'avoidMorningWalk', label: '🚶 Skip 6-8 AM Morning Walk', desc: 'Avoids winter thermal inversion toxic ground smog' },
    { key: 'cookWithGas', label: '🍳 Use Clean Cooking (LPG/Induction)', desc: 'Prevents acute indoor PM2.5 spikes from wood/chulha' },
    { key: 'workFromHome', label: '🏠 Work From Home (Skip Commute)', desc: '100% elimination of vehicular transit pollution' },
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-700 shadow-md">
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl" aria-hidden="true">🔮</span>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            "What-If" Pollution & Exposure Simulator
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          Toggle protective interventions to dynamically simulate your personal PM2.5 reduction and emissions saved.
        </p>
      </div>

      <form onSubmit={handleSimulate}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {toggles.map((item) => {
            const isChecked = choices[item.key]
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => toggleChoice(item.key)}
                className={`p-3.5 rounded-xl border text-left transition flex items-start justify-between gap-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isChecked
                    ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100 shadow-xs'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300'
                }`}
                aria-pressed={isChecked}
              >
                <div>
                  <div className="text-xs font-bold">{item.label}</div>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{item.desc}</div>
                </div>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  isChecked ? 'bg-blue-600 text-white' : 'border border-gray-400 text-transparent'
                }`}>
                  ✓
                </span>
              </button>
            )
          })}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-6 rounded-xl bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-bold text-sm tracking-wide shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Simulating Dynamic Impact…</span>
            </>
          ) : (
            <>
              <span>Calculate Intervention Impact</span>
              <span aria-hidden="true">⚡</span>
            </>
          )}
        </button>
      </form>

      {/* Dynamic Results Display */}
      {result && (
        <div
          role="region"
          aria-live="polite"
          className="mt-6 p-5 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/40 dark:to-indigo-950/30 border border-purple-200 dark:border-purple-800"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-800 dark:text-purple-300">
              Simulated Exposure Reduction
            </span>
            {result.co2SavedKg && (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                🌱 {result.co2SavedKg}
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-4 mb-2">
            <div className="text-4xl font-black text-purple-700 dark:text-purple-300">
              {result.estimatedReduction}
            </div>
            {result.estimatedExposureAqi && (
              <div className="text-xs text-gray-600 dark:text-gray-300">
                Exposure drops from ambient <span className="font-bold">{currentAqi}</span> to ~<span className="font-bold text-emerald-600 dark:text-emerald-400">{result.estimatedExposureAqi}</span> effective AQI
              </div>
            )}
          </div>

          <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
            {result.explanation}
          </p>

          {result.assumptions && (
            <div className="mt-3 pt-2 border-t border-purple-200 dark:border-purple-900 text-[11px] text-gray-500 dark:text-gray-400 italic">
              <strong>Model Assumptions: </strong> {result.assumptions}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
