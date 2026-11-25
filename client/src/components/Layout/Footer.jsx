// client/src/components/Layout/Footer.jsx
import React from 'react'
import { Leaf } from 'lucide-react'

export default function Footer() {
  return (
    <footer
      className="mt-auto border-t py-6 transition-colors duration-200"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
        {/* Brand identity & Copyright */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0">
            <Leaf className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" aria-hidden="true" />
          </div>
          <span className="font-bold text-sm tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Urban Air Quality Assistant
          </span>
          <span>• © {new Date().getFullYear()}</span>
        </div>

        {/* Small Medical Disclaimer */}
        <p className="text-[11px] text-center sm:text-right">
          Educational guidance only; not medical advice. Grounded in WHO &amp; CPCB air standards.
        </p>
      </div>
    </footer>
  )
}
