// client/src/components/Guide/MaskGuide.jsx
import React, { useState } from 'react'
import { BookOpen, ShieldCheck, Box, Leaf, AlertCircle } from 'lucide-react'

export default function MaskGuide() {
  const [activeTab, setActiveTab] = useState('masks')

  return (
    <div className="bg-white dark:bg-navy-850 rounded-2xl p-6 md:p-8 border border-slate-200/80 dark:border-white/10 shadow-sm transition-colors">
      <div className="mb-6">
        <div className="flex items-center gap-2.5 mb-1.5">
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
            <BookOpen className="w-4 h-4" aria-hidden="true" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Evidence-Based Smog Defense Guide
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          Peer-reviewed filtration science, DIY purifier blueprints, and ventilation timing.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200/80 dark:border-white/10 mb-6 gap-2 overflow-x-auto" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'masks'}
          onClick={() => setActiveTab('masks')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition focus:outline-none inline-flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'masks'
              ? 'border-teal-500 text-teal-600 dark:text-teal-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <ShieldCheck className="w-4 h-4" aria-hidden="true" />
          <span>N95 vs Cloth Masks</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'corsi'}
          onClick={() => setActiveTab('corsi')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition focus:outline-none inline-flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'corsi'
              ? 'border-teal-500 text-teal-600 dark:text-teal-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <Box className="w-4 h-4" aria-hidden="true" />
          <span>DIY Corsi-Rosenthal Box</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'plants'}
          onClick={() => setActiveTab('plants')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition focus:outline-none inline-flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'plants'
              ? 'border-teal-500 text-teal-600 dark:text-teal-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <Leaf className="w-4 h-4" aria-hidden="true" />
          <span>NASA Plants & Ventilation</span>
        </button>
      </div>

      {/* Tab 1: Masks */}
      {activeTab === 'masks' && (
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border border-slate-200/80 dark:border-white/10 rounded-xl overflow-hidden">
              <thead className="bg-slate-50 dark:bg-navy-900 text-slate-900 dark:text-white uppercase text-[11px] font-bold">
                <tr>
                  <th className="p-3.5">Mask Type</th>
                  <th className="p-3.5">PM2.5 Filtration</th>
                  <th className="p-3.5">Fit & Seal</th>
                  <th className="p-3.5">Recommendation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80 dark:divide-white/10 text-slate-700 dark:text-slate-300">
                <tr className="bg-emerald-500/5 dark:bg-emerald-950/20">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">N95 / FFP2 Respirator</td>
                  <td className="p-3.5 font-semibold text-emerald-600 dark:text-emerald-400">&gt;95% particulate capture</td>
                  <td className="p-3.5">Tight seal across nose bridge & chin</td>
                  <td className="p-3.5 font-bold text-emerald-700 dark:text-emerald-300">Essential for AQI &gt; 200</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">Surgical 3-Ply Mask</td>
                  <td className="p-3.5">~60–75% (material only)</td>
                  <td className="p-3.5 text-rose-600 dark:text-rose-400">Loose sides; heavy leakage</td>
                  <td className="p-3.5">Better than nothing; not safe for severe smog</td>
                </tr>
                <tr className="bg-rose-500/5 dark:bg-rose-950/20">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">Single-Layer Cloth / Handkerchief</td>
                  <td className="p-3.5 text-rose-600 dark:text-rose-400">&lt;20% PM2.5 filtration</td>
                  <td className="p-3.5 text-rose-600 dark:text-rose-400">No seal; fine particles pass easily</td>
                  <td className="p-3.5 text-rose-600 dark:text-rose-400 font-bold">Ineffective against toxic winter smog</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
            Source: Approximate, based on public literature (WHO, CPCB, EPA, UC Davis) (est.)
          </p>
        </div>
      )}

      {/* Tab 2: Corsi-Rosenthal Box */}
      {activeTab === 'corsi' && (
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="p-5 rounded-2xl bg-teal-500/5 dark:bg-navy-900 border border-teal-500/20 space-y-3">
            <h4 className="text-sm font-bold text-teal-800 dark:text-teal-300">
              The Corsi-Rosenthal DIY Air Purifier Blueprint
            </h4>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Invented by environmental engineer Dr. Richard Corsi and Jim Rosenthal, this DIY purifier delivers CADR (Clean Air Delivery Rate) comparable to ₹15,000+ commercial HEPA purifiers for approximately ₹2,500.
            </p>
            <ol className="list-decimal pl-5 space-y-1.5 text-slate-700 dark:text-slate-300">
              <li>Acquire a standard 20-inch box fan and 4 MERV-13 furnace filters (20"x20").</li>
              <li>Form a 4-sided cube with the filters, ensuring airflow arrows point INWARD toward the center.</li>
              <li>Place a cardboard square at the bottom to seal the base.</li>
              <li>Mount the box fan on top, blowing air UPWARD out of the cube.</li>
              <li>Seal all edges and filter joins airtight with duct tape.</li>
            </ol>
          </div>
        </div>
      )}

      {/* Tab 3: Plants & Ventilation */}
      {activeTab === 'plants' && (
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="p-5 rounded-2xl bg-emerald-500/5 dark:bg-navy-900 border border-emerald-500/20 space-y-3">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Indoor Plants vs. Particulate Smog: Scientific Reality
                </h4>
                <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  While NASA studies showed plants remove trace VOCs in sealed chambers, plants do <strong>not</strong> filter fine particulate matter (PM2.5). Never rely on house plants alone during high smog alerts. Always combine with mechanical filtration (HEPA or MERV-13) and sealed windows.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
