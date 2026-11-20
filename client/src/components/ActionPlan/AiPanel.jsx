// client/src/components/ActionPlan/AiPanel.jsx
import React, { useState } from 'react'
import { Sparkles, ChevronDown, ChevronUp, Copy, Check, Terminal, ShieldCheck } from 'lucide-react'
import Badge from '../UI/Badge.jsx'

export default function AiPanel({ plan, _source, isFallback }) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const promptText =
    plan?.promptUsed ||
    'Strict structured JSON system prompt sent with profile and local AQI telemetry.'
  const responseJson = JSON.stringify(plan, null, 2)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(responseJson)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.warn('Clipboard copy failed:', err)
    }
  }

  return (
    <div className="mt-8 rounded-2xl border border-teal-500/20 bg-teal-500/5 dark:bg-navy-850 p-5 md:p-6 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {isFallback ? (
            <Badge variant="fallback">Rule-Based Plan</Badge>
          ) : (
            <Badge variant="genai">Gemini AI</Badge>
          )}
          <span className="text-xs font-bold text-teal-800 dark:text-teal-300 inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-500" aria-hidden="true" />
            {isFallback ? 'Zero-Failure Fallback System' : 'Verified Structured Output'}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 dark:text-teal-300 hover:text-teal-800 dark:hover:text-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-lg px-2.5 py-1 transition-colors"
          aria-expanded={isOpen}
        >
          <span>{isOpen ? 'Hide AI Telemetry' : 'Inspect AI Prompt & Raw JSON'}</span>
          {isOpen ? (
            <ChevronUp className="w-4 h-4" aria-hidden="true" />
          ) : (
            <ChevronDown className="w-4 h-4" aria-hidden="true" />
          )}
        </button>
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed">
        {isFallback
          ? 'The backend automatically fell back to our deterministic rule-based grounding engine to ensure zero downtime when the Gemini API key is missing or rate limited.'
          : 'All user inputs are treated strictly as unexecutable data. Gemini generates structured JSON validated server-side by Zod schemas.'}
      </p>

      {isOpen && (
        <div className="mt-5 space-y-4 pt-4 border-t border-slate-200/80 dark:border-white/10">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300 mb-1.5">
              <Terminal className="w-3.5 h-3.5" aria-hidden="true" />
              <span>System & Grounding Prompt</span>
            </div>
            <pre className="text-[11px] font-mono p-3.5 rounded-xl bg-slate-900 text-slate-200 overflow-x-auto max-h-48 whitespace-pre-wrap leading-relaxed border border-white/5">
              {promptText}
            </pre>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
                <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Model Structured JSON Payload</span>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700 dark:text-teal-300 hover:text-teal-800 dark:hover:text-white px-2 py-0.5 rounded border border-teal-500/20 hover:bg-teal-500/10 transition-colors"
                aria-label="Copy raw JSON payload"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" aria-hidden="true" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" aria-hidden="true" />
                    <span>Copy JSON</span>
                  </>
                )}
              </button>
            </div>
            <pre className="text-[11px] font-mono p-3.5 rounded-xl bg-slate-900 text-emerald-300 overflow-x-auto max-h-56 leading-relaxed border border-white/5">
              {responseJson}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}
