// client/src/components/Layout/Footer.jsx
import React from 'react'
import { Leaf, ExternalLink } from 'lucide-react'

export default function Footer() {
  return (
    <footer
      className="mt-auto border-t py-6 transition-colors duration-200"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 space-y-3">
        {/* Top row: Brand on left, clean links on right */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0">
              <Leaf className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" aria-hidden="true" />
            </div>
            <span className="font-bold text-sm tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Urban Air Quality Assistant
            </span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              • © {new Date().getFullYear()}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs font-medium">
            <a
              href="https://github.com/MOHDUBES/Urban-Air-Quality-Assistant"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              style={{ color: 'var(--text-secondary)' }}
            >
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3 text-slate-400" aria-hidden="true" />
            </a>
            <a
              href="https://github.com/MOHDUBES/Urban-Air-Quality-Assistant/blob/main/README.md"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              style={{ color: 'var(--text-secondary)' }}
            >
              <span>Documentation</span>
              <ExternalLink className="w-3 h-3 text-slate-400" aria-hidden="true" />
            </a>
            <a
              href="https://open-meteo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              style={{ color: 'var(--text-secondary)' }}
            >
              <span>Open-Meteo API</span>
              <ExternalLink className="w-3 h-3 text-slate-400" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Bottom row: Small, understated medical disclaimer */}
        <div
          className="pt-2 border-t text-[11px] flex flex-col sm:flex-row items-center justify-between gap-2"
          style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
        >
          <p>
            Educational guidance only; not medical advice. Grounded in WHO &amp; CPCB air quality standards.
          </p>
          <span>Privacy-First • Zero Trackers</span>
        </div>
      </div>
    </footer>
  )
}
