// client/src/components/Hero.jsx
import React from 'react'
import { Activity, Sparkles, ShieldCheck } from 'lucide-react'

export default function Hero() {
  return (
    <div
      className="relative overflow-hidden rounded-3xl p-6 sm:p-10 mb-8 shadow-xs transition-colors duration-200"
      style={{
        background: 'linear-gradient(to bottom, var(--hero-from), var(--hero-to))',
        border: '1px solid var(--border-subtle)',
      }}
    >
      {/* Subtle ambient smog-haze overlay */}
      <div
        className="pointer-events-none absolute -top-24 -left-24 w-80 h-80 rounded-full bg-teal-400/10 dark:bg-teal-500/5 blur-3xl animate-smog-drift"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-emerald-400/10 dark:bg-emerald-500/5 blur-3xl animate-smog-drift"
        aria-hidden="true"
      />

      <div className="relative max-w-3xl mx-auto text-center space-y-4">
        {/* Decorative Badge with Logo Icon */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-500/10 dark:bg-teal-400/10 text-teal-800 dark:text-teal-300 border border-teal-500/20 dark:border-teal-400/20 shadow-xs">
          <img
            src="/logo-mark.svg"
            alt=""
            aria-hidden="true"
            width="18"
            height="18"
            className="w-4 h-4 rounded-md object-contain"
          />
          <span>Delhi-NCR Winter Smog &amp; Clean Air Platform</span>
        </div>

        {/* 48px Headline */}
        <h2
          className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.15]"
          style={{ color: 'var(--hero-text)' }}
        >
          Breathe Smarter During Winter Smog
        </h2>

        {/* Supporting Line */}
        <p
          className="text-base sm:text-lg font-medium max-w-2xl mx-auto leading-relaxed"
          style={{ color: 'var(--hero-muted)' }}
        >
          Tailored low-emission daily routines, evidence-based indoor hacks, and quantified personal impact insights for families navigating severe winter air pollution.
        </p>

        {/* 3 Small Trust Chips */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-xs font-semibold">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-xs"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--hero-muted)',
            }}
          >
            <Activity className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" aria-hidden="true" strokeWidth={2} />
            <span>Live Open-Meteo data</span>
          </span>

          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-xs"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--hero-muted)',
            }}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" strokeWidth={2} />
            <span>Powered by Gemini</span>
          </span>

          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-xs"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--hero-muted)',
            }}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" aria-hidden="true" strokeWidth={2} />
            <span>WHO + CPCB grounded</span>
          </span>
        </div>
      </div>
    </div>
  )
}
