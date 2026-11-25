// client/src/components/Layout/Footer.jsx
import React from 'react'
import { ExternalLink, Activity, Sparkles, ShieldCheck } from 'lucide-react'

function GithubIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer
      className="mt-16 border-t border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-navy-900/70 backdrop-blur-md py-10 text-xs text-slate-500 dark:text-slate-400 transition-colors"
      style={{ backgroundColor: 'var(--bg-base)', borderColor: 'var(--border-subtle)' }}
    >
      <div className="max-w-6xl mx-auto px-4 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-200/60 dark:border-white/5">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <img
              src="/logo-mark.svg"
              alt=""
              aria-hidden="true"
              width="36"
              height="36"
              className="w-9 h-9 rounded-xl shadow-xs border border-teal-500/30 object-contain"
            />
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Urban Air Quality Assistant
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20">
                  Open Source
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                AI-powered resilience for Delhi-NCR winter smog & global urban air pollution
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
              <span>Architecture & Documentation</span>
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

        {/* Attributions & Disclaimers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px] leading-relaxed">
          <div
            className="p-4 rounded-2xl border space-y-1.5 transition-colors"
            style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}
          >
            <div className="font-bold flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
              <Activity className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" aria-hidden="true" />
              <span>Environmental Telemetry</span>
            </div>
            <p style={{ color: 'var(--text-muted)' }}>
              Live hourly AQI, PM2.5, and PM10 metrics powered by the free Open-Meteo Air Quality &amp; Geocoding APIs with zero API key dependencies.
            </p>
          </div>

          <div
            className="p-4 rounded-2xl border space-y-1.5 transition-colors"
            style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}
          >
            <div className="font-bold flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
              <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" aria-hidden="true" />
              <span>Generative AI Intelligence</span>
            </div>
            <p style={{ color: 'var(--text-muted)' }}>
              Personalized routines &amp; intervention modeling generated by Google Gemini (gemini-2.0-flash) with deterministic rule-based zero-downtime fallback.
            </p>
          </div>

          <div
            className="p-4 rounded-2xl border space-y-1.5 transition-colors"
            style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}
          >
            <div className="font-bold flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" aria-hidden="true" />
              <span>Medical &amp; Exposure Disclaimer</span>
            </div>
            <p style={{ color: 'var(--text-muted)' }}>
              This tool provides environmental risk reduction guidance and educational estimates. It is not medical advice. Consult a healthcare provider for respiratory ailments.
            </p>
          </div>
        </div>

        <div className="text-center text-[11px] text-slate-400 dark:text-slate-500 pt-2">
          © {new Date().getFullYear()} Urban Air Quality Assistant • Built for Clean Air Resilience
        </div>
      </div>
    </footer>
  )
}
