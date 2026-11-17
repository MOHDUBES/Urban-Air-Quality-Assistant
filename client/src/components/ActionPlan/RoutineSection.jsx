// client/src/components/ActionPlan/RoutineSection.jsx
import React from 'react'

export default function RoutineSection({ routine }) {
  if (!routine) return null

  const morning = routine.morning || {}
  const afternoon = routine.afternoon || {}
  const evening = routine.evening || {}
  const bestOutdoorTime = routine.bestOutdoorTime

  const cards = [
    {
      period: 'Morning (06:00 - 10:00)',
      icon: '🌅',
      data: morning,
      bgColor: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900',
    },
    {
      period: 'Midday / Afternoon (11:00 - 15:00)',
      icon: '☀️',
      data: afternoon,
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900',
      badge: 'Safest Outdoor Window',
    },
    {
      period: 'Evening / Night (17:00 - 22:00)',
      icon: '🌙',
      data: evening,
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-900',
    },
  ]

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span>🕒</span> Low-Emission Daily Routine
        </h3>
        {bestOutdoorTime && (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            Optimal Outdoor Time: {bestOutdoorTime}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-xl border ${card.bgColor} shadow-xs flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                  <span aria-hidden="true">{card.icon}</span>
                  <span>{card.period}</span>
                </span>
                {card.badge && (
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-600 text-white">
                    {card.badge}
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {card.data.activity || card.data.action || 'Stay indoors if possible.'}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {card.data.advice || card.data.reason || ''}
              </p>
            </div>
            {card.data.timeWindow && (
              <div className="text-[11px] font-mono font-medium text-gray-500 dark:text-gray-400 mt-3 pt-2 border-t border-black/10 dark:border-white/10">
                Window: {card.data.timeWindow}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
