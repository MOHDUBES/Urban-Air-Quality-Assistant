// client/src/App.jsx
import { useState, createContext } from 'react'
import en from './i18n/en.js'
import hi from './i18n/hi.js'
import { useTheme } from './hooks/useTheme.js'
import { useGeminiPlan } from './hooks/useGeminiPlan.js'
import Header from './components/Layout/Header.jsx'
import SkipLink from './components/Layout/SkipLink.jsx'
import ProfileForm from './components/Onboarding/ProfileForm.jsx'
import AqiCard from './components/Dashboard/AqiCard.jsx'
import TrendChart from './components/Dashboard/TrendChart.jsx'
import ActionPlan from './components/ActionPlan/ActionPlan.jsx'
import WhatIfSimulator from './components/WhatIf/WhatIfSimulator.jsx'
import ChatBox from './components/Chat/ChatBox.jsx'
import MaskGuide from './components/Guide/MaskGuide.jsx'
import LoadingSkeleton from './components/UI/LoadingSkeleton.jsx'
import ErrorBanner from './components/UI/ErrorBanner.jsx'

export const LangContext = createContext({
  t: en,
  lang: 'en',
  toggleLang: () => {},
})

export default function App() {
  const [lang, setLang] = useState('en')
  const theme = useTheme()

  const t = lang === 'hi' ? hi : en

  const toggleLang = () => {
    setLang((prev) => (prev === 'en' ? 'hi' : 'en'))
  }

  // Active user profile & telemetry state
  const [profile, setProfile] = useState(null)
  const [aqiData, setAqiData] = useState(null)
  const [activeTab, setActiveTab] = useState('plan') // 'plan' | 'whatif' | 'chat' | 'guide'

  const {
    plan,
    loading: planLoading,
    error: planError,
    isFallback,
    source,
    generatePlan,
    whatIfResult,
    whatIfLoading,
    generateWhatIf,
    chatHistory,
    chatLoading,
    sendChat,
  } = useGeminiPlan()

  // Handle Profile Form Submission
  const handleProfileSubmit = (verifiedProfile, telemetry) => {
    setProfile(verifiedProfile)
    setAqiData(telemetry)
    generatePlan(verifiedProfile, telemetry)
  }

  // Handle Manual AQI Override
  const handleManualOverride = (manualData) => {
    setAqiData(manualData)
    if (profile) {
      generatePlan(profile, manualData)
    }
  }

  // Reset to Live Data
  const handleResetManual = async () => {
    if (!profile) return
    try {
      const res = await fetch(`/api/aqi?lat=${profile.lat}&lon=${profile.lon}`)
      const json = await res.json()
      if (json.data) {
        setAqiData(json.data)
        generatePlan(profile, json.data)
      }
    } catch (e) {
      console.warn('Failed to reset to live AQI:', e)
    }
  }

  return (
    <LangContext.Provider value={{ t, lang, toggleLang }}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col font-sans transition-colors duration-200">
        <SkipLink />
        <Header theme={theme} lang={lang} onToggleLang={toggleLang} />

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 space-y-8">
          {/* Hero Banner if no profile yet */}
          {!profile && (
            <div className="text-center py-6 max-w-2xl mx-auto space-y-3">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200">
                Delhi-NCR Winter Smog & Urban Clean Air Platform
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                Breathe Smarter During Winter Pollution
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                Hyper-tailored low-emission daily routines, evidence-based indoor hacks, and personal emissions impact analysis powered by Google Gemini and live Open-Meteo telemetry.
              </p>
            </div>
          )}

          {/* Profile Onboarding Form */}
          {!profile ? (
            <div className="max-w-2xl mx-auto">
              <ProfileForm onSubmit={handleProfileSubmit} loading={planLoading} />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Profile summary bar & edit trigger */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xs">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-bold text-gray-900 dark:text-white">Active Profile:</span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 font-semibold">
                    📍 {profile.city}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    {profile.householdType.replace('_', ' ')}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    Commute: {profile.commuteMode.replace('_', ' ')}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    Budget: {profile.budget}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setProfile(null)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  ✎ Edit Profile
                </button>
              </div>

              {/* Live AQI Dashboard & Trend */}
              {aqiData && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                  <div className="lg:col-span-1">
                    <AqiCard
                      aqiData={aqiData}
                      onManualOverride={handleManualOverride}
                      onResetManual={handleResetManual}
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <TrendChart hourlyData={aqiData.hourlyData} />
                  </div>
                </div>
              )}

              {/* Navigation Tabs between Sections */}
              <div className="flex border-b border-gray-200 dark:border-gray-700 gap-2 overflow-x-auto pb-1" role="tablist">
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'plan'}
                  onClick={() => setActiveTab('plan')}
                  className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition focus:outline-none ${
                    activeTab === 'plan'
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                  }`}
                >
                  📋 Daily Smog Action Plan
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'whatif'}
                  onClick={() => setActiveTab('whatif')}
                  className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition focus:outline-none ${
                    activeTab === 'whatif'
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                  }`}
                >
                  🔮 "What-If" Simulator
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'chat'}
                  onClick={() => setActiveTab('chat')}
                  className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition focus:outline-none ${
                    activeTab === 'chat'
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                  }`}
                >
                  💬 AI Smog Chat
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'guide'}
                  onClick={() => setActiveTab('guide')}
                  className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition focus:outline-none ${
                    activeTab === 'guide'
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                  }`}
                >
                  📚 Evidence Guide
                </button>
              </div>

              {/* Error Banner */}
              {planError && (
                <ErrorBanner
                  title="Plan Generation Issue"
                  message={planError}
                  onRetry={() => generatePlan(profile, aqiData)}
                />
              )}

              {/* Tab 1: Action Plan */}
              {activeTab === 'plan' && (
                <>
                  {planLoading ? (
                    <LoadingSkeleton variant="plan" />
                  ) : (
                    <ActionPlan plan={plan} isFallback={isFallback} source={source} />
                  )}
                </>
              )}

              {/* Tab 2: What-If Simulator */}
              {activeTab === 'whatif' && (
                <WhatIfSimulator
                  onRunWhatIf={(choices) => generateWhatIf(profile, aqiData, choices)}
                  result={whatIfResult}
                  loading={whatIfLoading}
                  currentAqi={aqiData?.aqi || 200}
                />
              )}

              {/* Tab 3: Chat */}
              {activeTab === 'chat' && (
                <ChatBox
                  onSendMessage={(msg) => sendChat(msg, profile, aqiData)}
                  messages={chatHistory}
                  loading={chatLoading}
                  currentAqi={aqiData?.aqi || 200}
                  profile={profile}
                />
              )}

              {/* Tab 4: Guide */}
              {activeTab === 'guide' && <MaskGuide />}
            </div>
          )}
        </main>

        <footer className="mt-12 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-6 text-center text-xs text-gray-500 dark:text-gray-400">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <strong>Urban Air Quality Assistant</strong> • Open-Source Smog Resilience Platform
            </div>
            <div>
              Telemetry: Open-Meteo Air Quality • AI: Google Gemini (Interactions API)
            </div>
          </div>
        </footer>
      </div>
    </LangContext.Provider>
  )
}
