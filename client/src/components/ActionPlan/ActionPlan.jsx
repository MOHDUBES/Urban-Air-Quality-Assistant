// client/src/components/ActionPlan/ActionPlan.jsx
import React from 'react'
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
        return <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-purple-700 text-white animate-pulse">Emergency Level Risk</span>
      case 'very_high':
        return <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-600 text-white">Very High Health Risk</span>
      case 'high':
        return <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-600 text-white">High Smog Alert</span>
      case 'moderate':
        return <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-yellow-500 text-black">Moderate Precaution</span>
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-green-600 text-white">Low Risk</span>
    }
  }

  return (
    <section
      id="main-content"
      tabIndex="-1"
      aria-label="Personalized Air Quality Action Plan"
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6 md:p-8 space-y-7 focus:outline-none"
    >
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-gray-200 dark:border-gray-700">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {getRiskBadge(riskLevel)}
            {isFallback ? (
              <Badge variant="fallback">Rule-Based Plan</Badge>
            ) : (
              <Badge variant="genai">AI Synthesized Plan</Badge>
            )}
          </div>
          <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            Personalized Daily Action Plan
          </h2>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1 max-w-3xl leading-relaxed">
            {summary}
          </p>
        </div>
      </div>

      {/* Special Vulnerability Advice Banner (if applicable) */}
      {specialAdvice && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs">
          <div className="font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1 text-[11px]">
            <span>⚠️</span> Vulnerable Group Guidance
          </div>
          <p className="leading-relaxed">
            {typeof specialAdvice === 'string'
              ? specialAdvice
              : specialAdvice.asthma || specialAdvice.elderly || specialAdvice.kids || specialAdvice.household || Object.values(specialAdvice).join(' ')}
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
