// client/src/components/Layout/Footer.jsx
import React from 'react'
import { Activity, Sparkles, ShieldCheck, ExternalLink } from 'lucide-react'

function GithubIcon({ className = 'w-4 h-4' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer
      className="mt-auto border-t transition-colors duration-200"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border-subtle)',
        color: 'var(--text-secondary)'
      }}
    >
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Brand identity & Links */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0">
              <img
                src="/logo-mark.svg"
                alt=""
                className="w-5 h-5 object-contain"
                aria-hidden="true"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  Urban Air Quality Assistant
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20">
                  Open Source
                </span>
              </div>
              <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                AI-powered resilience for Delhi-NCR winter smog &amp; global urban air pollution
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
            <a
              href="https://github.com/MOHDUBES/Urban-Air-Quality-Assistant"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>GitHub Repo</span>
              <ExternalLink className="w-3 h-3 text-slate-400" aria-hidden="true" />
            </a>
            <a
              href="https://github.com/MOHDUBES/Urban-Air-Quality-Assistant/blob/main/README.md"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            >
              <span>Architecture &amp; Documentation</span>
              <ExternalLink className="w-3 h-3 text-slate-400" aria-hidden="true" />
            </a>
            <a
              href="https://open-meteo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            >
              <span>Open-Meteo API</span>
              <ExternalLink className="w-3 h-3 text-slate-400" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Attributions & Disclaimers - Clean, lightweight text columns (NO bulky box cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[11px] leading-relaxed pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="space-y-1">
            <div className="font-semibold flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-primary)' }}>
              <Activity className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" aria-hidden="true" />
              <span>Environmental Telemetry</span>
            </div>
            <p style={{ color: 'var(--text-muted)' }}>
              Live hourly AQI, PM2.5, and PM10 metrics powered by the free Open-Meteo Air Quality &amp; Geocoding APIs with zero API key dependencies.
            </p>
          </div>

          <div className="space-y-1">
            <div className="font-semibold flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-primary)' }}>
              <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" aria-hidden="true" />
              <span>Generative AI Intelligence</span>
            </div>
            <p style={{ color: 'var(--text-muted)' }}>
              Personalized routines &amp; intervention modeling generated by Google Gemini (gemini-2.0-flash) with deterministic rule-based zero-downtime fallback.
            </p>
          </div>

          <div className="space-y-1">
            <div className="font-semibold flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-primary)' }}>
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" aria-hidden="true" />
              <span>Medical &amp; Exposure Disclaimer</span>
            </div>
            <p style={{ color: 'var(--text-muted)' }}>
              This tool provides environmental risk reduction guidance and educational estimates. It is not medical advice. Consult a healthcare provider for respiratory ailments.
            </p>
          </div>
        </div>

        <div className="text-center text-[11px] pt-1" style={{ color: 'var(--text-muted)' }}>
          © {new Date().getFullYear()} Urban Air Quality Assistant • Built for Clean Air Resilience
        </div>
      </div>
    </footer>
  )
}
