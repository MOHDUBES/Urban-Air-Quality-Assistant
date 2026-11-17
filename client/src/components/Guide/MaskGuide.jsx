// client/src/components/Guide/MaskGuide.jsx
import React, { useState } from 'react'

export default function MaskGuide() {
  const [activeTab, setActiveTab] = useState('masks')

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-700 shadow-md">
      <div className="mb-5">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span>📚</span> Evidence-Based Smog Defense Guide
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
          Peer-reviewed filtration science, DIY purifier blueprints, and ventilation timing.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6 gap-2" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'masks'}
          onClick={() => setActiveTab('masks')}
          className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition focus:outline-none ${
            activeTab === 'masks'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
          }`}
        >
          🎭 N95 vs Cloth Masks
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'corsi'}
          onClick={() => setActiveTab('corsi')}
          className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition focus:outline-none ${
            activeTab === 'corsi'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
          }`}
        >
          📦 DIY Corsi-Rosenthal Box
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'plants'}
          onClick={() => setActiveTab('plants')}
          className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition focus:outline-none ${
            activeTab === 'plants'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
          }`}
        >
          🌿 NASA Plants & Ventilation
        </button>
      </div>

      {/* Tab 1: Masks */}
      {activeTab === 'masks' && (
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
              <thead className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white uppercase text-[11px] font-bold">
                <tr>
                  <th className="p-3">Mask Type</th>
                  <th className="p-3">PM2.5 Filtration</th>
                  <th className="p-3">Fit & Seal</th>
                  <th className="p-3">Recommendation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-gray-700 dark:text-gray-300">
                <tr className="bg-emerald-50/50 dark:bg-emerald-950/20">
                  <td className="p-3 font-bold text-gray-900 dark:text-white">N95 / FFP2 Respirator</td>
                  <td className="p-3 font-semibold text-emerald-600 dark:text-emerald-400">&gt;95% particulate capture</td>
                  <td className="p-3">Tight seal across nose bridge & chin</td>
                  <td className="p-3 font-bold text-emerald-700 dark:text-emerald-300">Essential for AQI &gt; 200</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-gray-900 dark:text-white">Surgical 3-Ply Mask</td>
                  <td className="p-3">~60–75% (material only)</td>
                  <td className="p-3 text-red-600 dark:text-red-400">Loose sides; heavy leakage</td>
                  <td className="p-3">Better than nothing; not safe for severe smog</td>
                </tr>
                <tr className="bg-red-50/40 dark:bg-red-950/20">
                  <td className="p-3 font-bold text-gray-900 dark:text-white">Single-Layer Cloth / Handkerchief</td>
                  <td className="p-3 text-red-600 dark:text-red-400">&lt;20% PM2.5 filtration</td>
                  <td className="p-3 text-red-600 dark:text-red-400">No seal; fine particles pass easily</td>
                  <td className="p-3 text-red-600 dark:text-red-400 font-bold">Ineffective against toxic winter smog</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 italic">
            Source: Approximate, based on public literature (WHO, CPCB, EPA, UC Davis) (est.)
          </p>
        </div>
      )}

      {/* Tab 2: Corsi-Rosenthal Box */}
      {activeTab === 'corsi' && (
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-200">
            <h4 className="font-bold text-sm mb-1">What is a Corsi-Rosenthal Box?</h4>
            <p className="leading-relaxed">
              An open-source, low-cost air cleaner invented by environmental engineer Dr. Richard Corsi and Jim Rosenthal. It delivers high Clean Air Delivery Rates (CADR &gt; 200 CFM) at less than one-fourth the price of commercial HEPA purifiers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700">
              <h5 className="font-bold text-xs uppercase tracking-wider text-gray-500 mb-2">Required Materials:</h5>
              <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                <li>1 × 20-inch Box Fan (₹1,000–₹1,500)</li>
                <li>4 × MERV-13 (or F7) Furnace HVAC Filters (~₹400 each)</li>
                <li>1 × Duct tape roll</li>
                <li>Cardboard sheet for base & shroud</li>
              </ul>
            </div>
            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700">
              <h5 className="font-bold text-xs uppercase tracking-wider text-gray-500 mb-2">Build Instructions:</h5>
              <ol className="list-decimal list-inside space-y-1 text-gray-700 dark:text-gray-300">
                <li>Tape the 4 filters into a cube with arrows pointing inward.</li>
                <li>Tape the cardboard square to seal the bottom.</li>
                <li>Place fan facing upward on top; seal edges with duct tape.</li>
                <li>Cut a 14-inch circular cardboard shroud over the fan face.</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Plants & Ventilation */}
      {activeTab === 'plants' && (
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="text-xl mb-1" aria-hidden="true">🌱</div>
              <h5 className="font-bold text-gray-900 dark:text-white">Snake Plant (Sansevieria)</h5>
              <p className="text-xs text-gray-500 mt-1">Converts CO2 to oxygen overnight. Ideal for bedrooms.</p>
            </div>
            <div className="p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="text-xl mb-1" aria-hidden="true">🌿</div>
              <h5 className="font-bold text-gray-900 dark:text-white">Areca Palm</h5>
              <p className="text-xs text-gray-500 mt-1">Natural humidifier; absorbs toluene and xylene emissions.</p>
            </div>
            <div className="p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="text-xl mb-1" aria-hidden="true">🪴</div>
              <h5 className="font-bold text-gray-900 dark:text-white">Money Plant (Pothos)</h5>
              <p className="text-xs text-gray-500 mt-1">High surface area absorbs VOCs and fine indoor dust.</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
            <h5 className="font-bold text-xs uppercase tracking-wider text-blue-800 dark:text-blue-300 mb-1">
              Smart Ventilation Window:
            </h5>
            <p className="text-gray-700 dark:text-gray-300">
              Never open windows between 6 AM – 9 AM or 7 PM – 10 PM in North Indian winter due to temperature inversions. The optimal ventilation window is <strong>12:00 PM – 2:00 PM for 15 minutes</strong> with cross-breeze, followed by sealing and HEPA air scrubbing.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
