// client/src/components/Onboarding/SampleProfiles.jsx
import React from 'react'

export const SAMPLE_PROFILES = [
  {
    id: 'asthmatic',
    title: '🏥 Asthmatic Senior (Delhi)',
    desc: 'Respiratory patient, high smog risk',
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
    desc: 'School routine, car commute',
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
    desc: 'Low budget, indoor worker',
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

export default function SampleProfiles({ onSelect }) {
  return (
    <div className="mb-6 p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900">
      <div className="flex items-center gap-2 mb-2.5">
        <span className="text-base" aria-hidden="true">⚡</span>
        <span className="text-xs font-semibold uppercase tracking-wider text-blue-800 dark:text-blue-300">
          Instant Demo Presets
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {SAMPLE_PROFILES.map((sample) => (
          <button
            key={sample.id}
            type="button"
            onClick={() => onSelect(sample.data)}
            className="p-3 text-left rounded-lg bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 border border-gray-200 dark:border-gray-700 transition shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <div className="text-xs font-bold text-gray-900 dark:text-white">{sample.title}</div>
            <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{sample.desc}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
