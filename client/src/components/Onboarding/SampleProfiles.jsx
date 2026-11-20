// client/src/components/Onboarding/SampleProfiles.jsx
import React from 'react'
import { HeartPulse, Users, GraduationCap, Zap } from 'lucide-react'

export const SAMPLE_PROFILES = [
  {
    id: 'asthmatic',
    title: '🏥 Asthmatic Senior (Delhi)',
    shortTitle: 'Asthmatic Senior',
    cityLabel: 'Delhi',
    desc: 'Respiratory patient, high smog risk',
    icon: HeartPulse,
    data: {
      city: 'New Delhi',
      lat: 28.6139,
      lon: 77.2090,
      householdType: 'asthma',
      commuteMode: 'metro_bus',
      hasAirPurifier: true,
      homeType: 'apartment',
      budget: 'medium',
    },
  },
  {
    id: 'family',
    title: '👨‍👩‍👧‍👦 Family with Kids (Noida)',
    shortTitle: 'Family with Kids',
    cityLabel: 'Noida',
    desc: 'School routine, car commute',
    icon: Users,
    data: {
      city: 'Noida',
      lat: 28.5355,
      lon: 77.3910,
      householdType: 'family_kids',
      commuteMode: 'car',
      hasAirPurifier: false,
      homeType: 'independent',
      budget: 'medium',
    },
  },
  {
    id: 'student',
    title: '🎓 WFH Student (Gurgaon)',
    shortTitle: 'WFH Student',
    cityLabel: 'Gurgaon',
    desc: 'Low budget, teleworking',
    icon: GraduationCap,
    data: {
      city: 'Gurugram',
      lat: 28.4595,
      lon: 77.0266,
      householdType: 'student',
      commuteMode: 'wfh',
      hasAirPurifier: false,
      homeType: 'apartment',
      budget: 'low',
    },
  },
]

export default function SampleProfiles({ onSelect, selectedId }) {
  return (
    <div className="mb-6 p-4 rounded-card bg-slate-50/80 dark:bg-navy-800/60 border border-slate-200/80 dark:border-white/10">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-5 h-5 rounded-full bg-teal-500/10 dark:bg-teal-400/20 text-teal-600 dark:text-teal-400 flex items-center justify-center">
          <Zap className="w-3.5 h-3.5" aria-hidden="true" strokeWidth={2} />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Instant Demo Presets
        </span>
        <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline">
          (Click to auto-populate)
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {SAMPLE_PROFILES.map((sample) => {
          const Icon = sample.icon
          const isSelected = selectedId === sample.id
          return (
            <button
              key={sample.id}
              type="button"
              onClick={() => onSelect(sample.data, sample.id)}
              className={`text-left p-3 rounded-xl border transition-all text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal group ${
                isSelected
                  ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-500 text-teal-950 dark:text-teal-100 shadow-xs'
                  : 'bg-white dark:bg-navy-850 hover:bg-slate-50 dark:hover:bg-navy-750 border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 group-hover:text-teal-500'}`} aria-hidden="true" strokeWidth={1.75} />
                <span className="font-bold truncate">{sample.title}</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight line-clamp-1">
                {sample.desc}
              </p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
