// client/src/components/ActionPlan/ActionPlan.jsx
import React from 'react'
import { AlertOctagon, Sparkles, ShieldAlert, CheckCircle2 } from 'lucide-react'
import Badge from '../UI/Badge.jsx'
import RoutineSection from './RoutineSection.jsx'
import IndoorHacks from './IndoorHacks.jsx'
import SustainableAlts from './SustainableAlts.jsx'
import ImpactExplainer from './ImpactExplainer.jsx'
import AiPanel from './AiPanel.jsx'

export default function ActionPlan({ plan, isFallback, source }) {
  if (!plan) return null

  const riskLevel = plan.riskLevel || 'moderate'
  const summary = plan.summary || 'Air quality requires targeted precautions today.'
  const specialAdvice = plan.specialAdvice

  const getRiskBadge = (level) => {
    switch (level?.toLowerCase()) {
      case 'emergency':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-purple-700 text-white animate-pulse">
            <AlertOctagon className="w-3.5 h-3.5" aria-hidden="true" />
            Emergency Level Risk
          </span>
        )
      case 'very_high':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-600 text-white shadow-xs">
            <ShieldAlert className="w-3.5 h-3.5" aria-hidden="true" />
            Very High Health Risk
          </span>
        )
      case 'high':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-600 text-white shadow-xs">
            <ShieldAlert className="w-3.5 h-3.5" aria-hidden="true" />
            High Smog Alert
          </span>
        )
      case 'moderate':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500 text-slate-900 shadow-xs">
            <ShieldAlert className="w-3.5 h-3.5" aria-hidden="true" />
            Moderate Precaution
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-600 text-white shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
            Low Risk
          </span>
        )
    }
  }

  return (
    <section
      id="main-content"
      tabIndex="-1"
      aria-label="Personalized Air Quality Action Plan"
      className="bg-white dark:bg-navy-850 rounded-2xl shadow-sm border border-slate-200/80 dark:border-white/10 p-6 md:p-8 space-y-8 focus:outline-none transition-colors"
    >
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-200/80 dark:border-white/10">
        <div>
          <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
            {getRiskBadge(riskLevel)}
            {isFallback ? (
              <Badge variant="fallback">Rule-Based Plan</Badge>
            ) : (
              <Badge variant="genai">
                <Sparkles className="w-3 h-3 inline mr-1" aria-hidden="true" />
                Gemini AI
              </Badge>
            )}
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Personalized Daily Action Plan
          </h2>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-1.5 max-w-3xl leading-relaxed">
            {summary}
          </p>
        </div>
      </div>

      {/* Special Vulnerability Advice Banner */}
      {specialAdvice && (
        <div className="p-4 md:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 text-xs shadow-xs">
          <div className="font-bold uppercase tracking-wider flex items-center gap-2 mb-1.5 text-xs text-amber-800 dark:text-amber-300">
            <AlertOctagon className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
            <span>Vulnerable Group Guidance</span>
          </div>
          <p className="leading-relaxed pl-6 text-slate-700 dark:text-amber-100/90">
            {typeof specialAdvice === 'string'
              ? specialAdvice
              : specialAdvice.asthma ||
                specialAdvice.elderly ||
                specialAdvice.kids ||
                specialAdvice.household ||
                Object.values(specialAdvice).join(' ')}
          </p>
        </div>
      )}

      {/* 1. Low-Emission Daily Routine */}
      <RoutineSection routine={plan.dailyRoutine} />

      {/* 2. Indoor Air Quality Hacks */}
      <IndoorHacks hacks={plan.indoorHacks} />

      {/* 3. Sustainable Lifestyle Alternatives */}
      <SustainableAlts alternatives={plan.sustainableAlts} />

      {/* 4. Impact Explainer with Assumptions */}
      <ImpactExplainer impactData={plan.impactExplainer} />

      {/* 5. Collapsible "How AI worked" Panel */}
      <AiPanel plan={plan} source={source} isFallback={isFallback} />
    </section>
  )
}
