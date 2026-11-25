// client/src/components/Layout/Footer.jsx
import React from 'react'
import { Activity, ShieldCheck, ExternalLink, Leaf, Code2 } from 'lucide-react'

export default function Footer() {
  return (
    <footer
      className="mt-auto border-t transition-colors duration-200"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Main Grid: Brand Story + Telemetry Info + Resources */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand Info (col-span-5) */}
          <div className="md:col-span-5 space-y-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0">
                <Leaf className="w-4 h-4 text-teal-600 dark:text-teal-400" aria-hidden="true" />
              </div>
              <span className="font-extrabold text-base tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Urban Air Quality Assistant
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20">
                Open Source
              </span>
            </div>
            <p className="text-xs leading-relaxed max-w-sm" style={{ color: 'var(--text-muted)' }}>
              Evidence-based winter smog defense platform providing personalized low-emission daily routines, quantified risk reduction, and indoor protection hacks.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
              <span>Grounded in WHO 2021 &amp; CPCB Environmental Standards</span>
            </div>
          </div>

          {/* Telemetry & Architecture (col-span-4) */}
          <div className="md:col-span-4 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
              <Activity className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" aria-hidden="true" />
              <span>Telemetry &amp; Intelligence</span>
            </h4>
            <ul className="space-y-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
              <li className="flex items-start gap-1.5 leading-relaxed">
                <span className="text-teal-500 font-bold">•</span>
                <span><strong style={{ color: 'var(--text-secondary)' }}>Open-Meteo Air Quality:</strong> Hourly live PM2.5, PM10 &amp; AQI metrics.</span>
              </li>
              <li className="flex items-start gap-1.5 leading-relaxed">
                <span className="text-teal-500 font-bold">•</span>
                <span><strong style={{ color: 'var(--text-secondary)' }}>Google Gemini 2.0 Flash:</strong> Tailored clinical vulnerability routines.</span>
              </li>
              <li className="flex items-start gap-1.5 leading-relaxed">
                <span className="text-teal-500 font-bold">•</span>
                <span><strong style={{ color: 'var(--text-secondary)' }}>Zero-Downtime Fallback:</strong> Deterministic rule engine offline backup.</span>
              </li>
            </ul>
          </div>

          {/* Resources & Open Source (col-span-3) */}
          <div className="md:col-span-3 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
              <Code2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" aria-hidden="true" />
              <span>Resources &amp; Code</span>
            </h4>
            <div className="flex flex-col space-y-2 text-xs font-medium">
              <a
                href="https://github.com/MOHDUBES/Urban-Air-Quality-Assistant"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                style={{ color: 'var(--text-secondary)' }}
              >
                <span>GitHub Repository</span>
                <ExternalLink className="w-3 h-3 text-slate-400" aria-hidden="true" />
              </a>
              <a
                href="https://github.com/MOHDUBES/Urban-Air-Quality-Assistant/blob/main/README.md"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                style={{ color: 'var(--text-secondary)' }}
              >
                <span>Architecture &amp; Docs</span>
                <ExternalLink className="w-3 h-3 text-slate-400" aria-hidden="true" />
              </a>
              <a
                href="https://open-meteo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                style={{ color: 'var(--text-secondary)' }}
              >
                <span>Open-Meteo API</span>
                <ExternalLink className="w-3 h-3 text-slate-400" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        {/* Medical & Exposure Disclaimer Strip */}
        <div
          className="p-3.5 rounded-2xl border flex items-start gap-2.5 text-[11px] leading-relaxed transition-colors"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            borderColor: 'var(--border-subtle)',
            color: 'var(--text-muted)'
          }}
        >
          <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" aria-hidden="true" />
          <p>
            <strong className="font-semibold" style={{ color: 'var(--text-secondary)' }}>Health &amp; Medical Disclaimer:</strong> This platform provides non-diagnostic risk mitigation insights and educational models. It does not replace professional medical advice, clinical diagnosis, or emergency care. Individuals with asthma, COPD, or severe respiratory ailments should consult their healthcare provider.
          </p>
        </div>

        {/* Bottom Copyright & Compliance Bar */}
        <div
          className="pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]"
          style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
        >
          <span>© {new Date().getFullYear()} Urban Air Quality Assistant • Built for Clean Air Resilience</span>
          <div className="flex items-center gap-3">
            <span>WCAG 2.1 AA Compliant</span>
            <span>•</span>
            <span>Privacy-First (Zero Trackers)</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
