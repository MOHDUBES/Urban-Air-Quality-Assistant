// client/src/components/ActionPlan/RoutineSection.jsx
import React from 'react'
import { Sunrise, Sun, Moon, Clock, ShieldCheck } from 'lucide-react'

export default function RoutineSection({ routine }) {
  if (!routine) return null

  const morning = routine.morning || {}
  const afternoon = routine.afternoon || {}
  const evening = routine.evening || {}
  const bestOutdoorTime = routine.bestOutdoorTime

  const cards = [
    {
      period: 'Morning Routine',
      timeSlot: morning.timeWindow || '06:00 – 10:00',
      icon: Sunrise,
      iconColor: 'text-amber-500 dark:text-amber-400',
      data: morning,
      bgColor: 'bg-amber-50/50 dark:bg-navy-800/80 border-amber-200/60 dark:border-amber-500/20',
      isSafest: false,
    },
    {
      period: 'Midday / Afternoon',
      timeSlot: afternoon.timeWindow || '11:00 – 15:00',
      icon: Sun,
      iconColor: 'text-emerald-500 dark:text-emerald-400',
      data: afternoon,
      bgColor: 'bg-emerald-50/60 dark:bg-navy-800/90 border-emerald-300/80 dark:border-emerald-500/30 ring-1 ring-emerald-500/30',
      isSafest: true,
      badge: 'Safest window',
    },
    {
      period: 'Evening / Night',
      timeSlot: evening.timeWindow || '17:00 – 22:00',
      icon: Moon,
      iconColor: 'text-indigo-400 dark:text-indigo-300',
      data: evening,
      bgColor: 'bg-indigo-50/50 dark:bg-navy-800/80 border-indigo-200/60 dark:border-indigo-500/20',
      isSafest: false,
    },
  ]

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
          <Clock className="w-5 h-5 text-teal-600 dark:text-teal-400" aria-hidden="true" strokeWidth={2} />
          <span>Low-Emission Daily Routine</span>
        </h3>
        {bestOutdoorTime && (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Optimal Outdoor Window: {bestOutdoorTime}</span>
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon
          return (
            <div
              key={idx}
              className={`p-5 rounded-2xl border ${card.bgColor} shadow-card relative flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5`}
            >
              {card.badge && (
                <div className="absolute -top-2.5 right-4">
                  <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-xs">
                    <ShieldCheck className="w-3 h-3" aria-hidden="true" />
                    <span>{card.badge}</span>
                  </span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-white/80 dark:bg-navy-900/80 border border-slate-200/60 dark:border-white/10 shadow-xs">
                      <Icon className={`w-4 h-4 ${card.iconColor}`} aria-hidden="true" strokeWidth={2} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {card.period}
                      </h4>
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        {card.timeSlot}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  {card.data.activity && (
                    <div className="p-2.5 rounded-xl bg-white/70 dark:bg-navy-900/60 border border-slate-200/60 dark:border-white/5">
                      <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Recommended Activity:</span>
                      <p className="text-slate-800 dark:text-slate-200 leading-relaxed">{card.data.activity}</p>
                    </div>
                  )}

                  {card.data.advice && (
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px] pt-1">
                      {card.data.advice}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
