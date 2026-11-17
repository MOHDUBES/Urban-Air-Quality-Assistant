// client/src/components/ActionPlan/AiPanel.jsx
import React, { useState } from 'react'
import Badge from '../UI/Badge.jsx'

export default function AiPanel({ plan, source, isFallback }) {
  const [isOpen, setIsOpen] = useState(false)

  const promptText = plan?.promptUsed || 'Strict structured JSON system prompt sent with profile and local AQI telemetry.'
  const responseJson = JSON.stringify(plan, null, 2)

  return (
    <div className="mt-8 rounded-2xl border border-purple-200 dark:border-purple-900 bg-purple-50/40 dark:bg-purple-950/20 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {isFallback ? (
            <Badge variant="fallback">Rule-Based Deterministic Engine</Badge>
          ) : (
            <Badge variant="genai">Gemini 4 Hydrogen (Interactions API)</Badge>
          )}
          <span className="text-xs font-bold text-purple-900 dark:text-purple-300">
            {isFallback ? 'Zero-Failure Fallback System' : 'Verified Structured Output'}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className="text-xs font-bold text-purple-700 dark:text-purple-300 hover:underline focus:outline-none focus:ring-2 focus:ring-purple-400 rounded px-2 py-1"
          aria-expanded={isOpen}
        >
          {isOpen ? 'Hide AI Telemetry ▲' : 'Inspect AI Prompt & Raw JSON ▼'}
        </button>
      </div>

      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
        {isFallback
          ? 'The backend automatically fell back to our deterministic rule-based grounding engine to ensure zero downtime when the Gemini API key is missing or rate limited.'
          : 'All user inputs are treated strictly as unexecutable data. Gemini generates structured JSON validated server-side by Zod schemas.'}
      </p>

      {isOpen && (
        <div className="mt-4 space-y-4 pt-4 border-t border-purple-200 dark:border-purple-900/60">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-purple-800 dark:text-purple-300 mb-1">
              System & Grounding Prompt:
            </div>
            <pre className="text-[11px] font-mono p-3 rounded-xl bg-gray-900 text-gray-100 overflow-x-auto max-h-48 whitespace-pre-wrap">
              {promptText}
            </pre>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-purple-800 dark:text-purple-300 mb-1">
              Model Structured JSON Payload:
            </div>
            <pre className="text-[11px] font-mono p-3 rounded-xl bg-gray-900 text-green-300 overflow-x-auto max-h-56">
              {responseJson}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}
