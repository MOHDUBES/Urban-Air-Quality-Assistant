// client/src/App.jsx
import { useState, createContext } from 'react'
import {
  ClipboardList,
  Sparkles,
  MessageSquare,
  BookOpen,
  MapPin,
  Users,
  Car,
  Wallet,
  Edit3,
} from 'lucide-react'
import en from './i18n/en.js'
import hi from './i18n/hi.js'
import { useTheme } from './hooks/useTheme.js'
import { useGeminiPlan } from './hooks/useGeminiPlan.js'
import Header from './components/Layout/Header.jsx'
import Footer from './components/Layout/Footer.jsx'
import SkipLink from './components/Layout/SkipLink.jsx'
import Hero from './components/Hero.jsx'
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

const TAB_DEFS = [
  { id: 'plan', label: 'Daily Smog Action Plan', icon: ClipboardList },
  { id: 'whatif', label: '"What-If" Simulator', icon: Sparkles },
  { id: 'chat', label: 'AI Smog Chat', icon: MessageSquare },
  { id: 'guide', label: 'Evidence Guide', icon: BookOpen },
]

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

  const handleTabKeyDown = (e, currentIdx) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      const nextIdx = (currentIdx + 1) % TAB_DEFS.length
      setActiveTab(TAB_DEFS[nextIdx].id)
      document.getElementById(`tab-${TAB_DEFS[nextIdx].id}`)?.focus()
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      const prevIdx = (currentIdx - 1 + TAB_DEFS.length) % TAB_DEFS.length
      setActiveTab(TAB_DEFS[prevIdx].id)
      document.getElementById(`tab-${TAB_DEFS[prevIdx].id}`)?.focus()
    }
  }

  return (
    <LangContext.Provider value={{ t, lang, toggleLang }}>
      <div className="min-h-screen bg-slate-50 dark:bg-navy-900 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
        <SkipLink />
        <Header theme={theme} lang={lang} onToggleLang={toggleLang} />

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 space-y-8">
          {/* Hero Banner when onboarding */}
          {!profile && <Hero />}

          {/* Profile Onboarding Form */}
          {!profile ? (
            <div className="max-w-2xl mx-auto">
              <ProfileForm onSubmit={handleProfileSubmit} loading={planLoading} />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Profile summary bar & edit trigger */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-navy-850 border border-slate-200/80 dark:border-white/10 shadow-xs transition-colors">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">Active Profile:</span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-teal-500/10 text-teal-800 dark:text-teal-300 font-semibold border border-teal-500/20">
                    <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" aria-hidden="true" />
                    <span>{profile.city}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-300 font-medium">
                    <Users className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                    <span>{profile.householdType.replace('_', ' ')}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-300 font-medium">
                    <Car className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                    <span>Commute: {profile.commuteMode.replace('_', ' ')}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-300 font-medium">
                    <Wallet className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                    <span>Budget: {profile.budget}</span>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setProfile(null)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-navy-800 dark:hover:bg-navy-750 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Edit Profile</span>
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
              <div
                className="flex border-b border-slate-200/80 dark:border-white/10 gap-2 overflow-x-auto pb-1 scrollbar-none"
                role="tablist"
                aria-label="Navigation Tabs"
              >
                {TAB_DEFS.map((tabItem, idx) => {
                  const Icon = tabItem.icon
                  const isSelected = activeTab === tabItem.id

                  return (
                    <button
                      key={tabItem.id}
                      id={`tab-${tabItem.id}`}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      aria-controls={`panel-${tabItem.id}`}
                      tabIndex={isSelected ? 0 : -1}
                      onClick={() => setActiveTab(tabItem.id)}
                      onKeyDown={(e) => handleTabKeyDown(e, idx)}
                      className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors duration-150 inline-flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-t-lg ${
                        isSelected
                          ? 'border-teal-500 text-teal-600 dark:text-teal-400 bg-teal-500/5 dark:bg-teal-950/20'
                          : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>{tabItem.label}</span>
                    </button>
                  )
                })}
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
              <div
                id="panel-plan"
                role="tabpanel"
                aria-labelledby="tab-plan"
                tabIndex="0"
                className={`focus:outline-none ${activeTab === 'plan' ? 'block' : 'hidden'}`}
              >
                {planLoading ? (
                  <LoadingSkeleton variant="plan" />
                ) : (
                  <ActionPlan plan={plan} isFallback={isFallback} source={source} />
                )}
              </div>

              {/* Tab 2: What-If Simulator */}
              <div
                id="panel-whatif"
                role="tabpanel"
                aria-labelledby="tab-whatif"
                tabIndex="0"
                className={`focus:outline-none ${activeTab === 'whatif' ? 'block' : 'hidden'}`}
              >
                <WhatIfSimulator
                  onRunWhatIf={(choices) => generateWhatIf(profile, aqiData, choices)}
                  result={whatIfResult}
                  loading={whatIfLoading}
                  currentAqi={aqiData?.aqi || 200}
                />
              </div>

              {/* Tab 3: Chat */}
              <div
                id="panel-chat"
                role="tabpanel"
                aria-labelledby="tab-chat"
                tabIndex="0"
                className={`focus:outline-none ${activeTab === 'chat' ? 'block' : 'hidden'}`}
              >
                <ChatBox
                  onSendMessage={(msg) => sendChat(msg, profile, aqiData)}
                  messages={chatHistory}
                  loading={chatLoading}
                  currentAqi={aqiData?.aqi || 200}
                  profile={profile}
                />
              </div>

              {/* Tab 4: Guide */}
              <div
                id="panel-guide"
                role="tabpanel"
                aria-labelledby="tab-guide"
                tabIndex="0"
                className={`focus:outline-none ${activeTab === 'guide' ? 'block' : 'hidden'}`}
              >
                <MaskGuide />
              </div>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </LangContext.Provider>
  )
}
