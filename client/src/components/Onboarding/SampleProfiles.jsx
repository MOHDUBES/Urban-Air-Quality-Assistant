// client/src/components/Onboarding/SampleProfiles.jsx
import React from 'react'
import { HeartPulse, Users, GraduationCap, Zap, CheckCircle2, MapPin } from 'lucide-react'

export const SAMPLE_PROFILES = [
  {
    id: 'asthmatic',
    title: 'Asthmatic Senior (Delhi)',
    shortTitle: 'Asthmatic Senior',
    cityLabel: 'Delhi',
    tag: 'High Risk',
    tagColor: 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20',
    iconColor: 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20',
    desc: 'Respiratory patient, metro commute, peak winter smog exposure',
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
    title: 'Family with Kids (Noida)',
    shortTitle: 'Family with Kids',
    cityLabel: 'Noida',
    tag: 'School Routine',
    tagColor: 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20',
    iconColor: 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20',
    desc: 'Daily school commute, personal car, non-purified independent home',
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
    title: 'WFH Student (Gurgaon)',
    shortTitle: 'WFH Student',
    cityLabel: 'Gurgaon',
    tag: 'Low Budget',
    tagColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    desc: 'Apartment teleworking, low budget, focuses on DIY clean air hacks',
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
    <div
      className="mb-6 p-4 sm:p-5 rounded-2xl border transition-colors"
      style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}
    >
      <div className="flex items-center justify-between mb-3.5 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-teal-500/10 dark:bg-teal-400/15 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-500/20">
            <Zap className="w-3.5 h-3.5" aria-hidden="true" strokeWidth={2.2} />
          </div>
          <div>
            <span
              className="text-xs font-bold uppercase tracking-wider block"
              style={{ color: 'var(--text-primary)' }}
            >
              Instant Demo Presets
            </span>
          </div>
        </div>
        <span className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>
          Click to auto-populate
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {SAMPLE_PROFILES.map((sample) => {
          const Icon = sample.icon
          const isSelected = selectedId === sample.id
          return (
            <button
              key={sample.id}
              type="button"
              onClick={() => onSelect(sample.data, sample.id)}
              className={`relative text-left p-3.5 sm:p-4 rounded-xl border transition-all duration-200 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal flex flex-col justify-between ${
                isSelected
                  ? 'bg-teal-500/10 dark:bg-teal-500/15 border-teal-500 shadow-sm shadow-teal-500/15 ring-1 ring-teal-500'
                  : 'hover:border-teal-500/40 hover:-translate-y-0.5 hover:shadow-sm'
              }`}
              style={
                isSelected
                  ? {}
                  : {
                      backgroundColor: 'var(--bg-surface)',
                      borderColor: 'var(--border-subtle)',
                    }
              }
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shrink-0 ${sample.iconColor}`}>
                    <Icon className="w-4 h-4" aria-hidden="true" strokeWidth={2} />
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${sample.tagColor}`}>
                    {sample.tag}
                  </span>
                </div>
                <h4
                  className="font-bold text-xs sm:text-sm leading-snug mb-1"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {sample.title}
                </h4>
                <p
                  className="text-[11px] leading-relaxed line-clamp-2"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {sample.desc}
                </p>
              </div>

              {isSelected ? (
                <div className="mt-2.5 pt-2 border-t border-teal-500/20 flex items-center gap-1.5 text-[11px] font-semibold text-teal-600 dark:text-teal-400">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>Selected</span>
                </div>
              ) : (
                <div className="mt-2.5 pt-2 border-t border-slate-200/40 dark:border-white/5 flex items-center gap-1 text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" aria-hidden="true" />
                  <span>{sample.cityLabel}</span>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
