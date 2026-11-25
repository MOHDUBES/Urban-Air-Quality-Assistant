// client/src/components/Onboarding/ProfileForm.jsx
import React, { useState, useEffect, useContext } from 'react'
import {
  AlertCircle,
  ArrowRight,
  Loader2,
  MapPin,
  Users,
  Car,
  Home,
  Wallet,
  Wind,
  Sparkles,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react'
import { LangContext } from '../../App'
import SampleProfiles from './SampleProfiles.jsx'
import { API_URL } from '../../utils/api.js'

export default function ProfileForm({ onSubmit, initialValues, loading }) {
  const { lang } = useContext(LangContext)

  const [formData, setFormData] = useState({
    city: initialValues?.city || 'New Delhi',
    lat: initialValues?.lat || 28.6139,
    lon: initialValues?.lon || 77.2090,
    householdType: initialValues?.householdType || 'asthma',
    commuteMode: initialValues?.commuteMode || 'metro_bus',
    hasAirPurifier: initialValues?.hasAirPurifier ?? true,
    homeType: initialValues?.homeType || 'apartment',
    budget: initialValues?.budget || 'medium',
  })

  const [selectedPresetId, setSelectedPresetId] = useState(null)
  const [errors, setErrors] = useState({})
  const [validatingCity, setValidatingCity] = useState(false)

  useEffect(() => {
    if (initialValues) {
      setFormData((prev) => ({ ...prev, ...initialValues }))
    }
  }, [initialValues])

  const handleSampleSelect = (sampleData, id) => {
    setFormData((prev) => ({ ...prev, ...sampleData }))
    setSelectedPresetId(id)
    setErrors({})
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}

    if (!formData.city || !formData.city.trim()) {
      newErrors.city = 'Please enter a valid city name'
      setErrors(newErrors)
      return
    }

    // Validate city through geocoding API
    setValidatingCity(true)
    try {
      const res = await fetch(`${API_URL}/api/aqi?city=${encodeURIComponent(formData.city.trim())}`)
      const json = await res.json()
      if (!res.ok || !json.data) {
        newErrors.city = json.error || `City "${formData.city}" not found. Please try another name.`
        setErrors(newErrors)
        setValidatingCity(false)
        return
      }

      const verified = {
        ...formData,
        city: json.data.city || formData.city.trim(),
        lat: json.data.lat,
        lon: json.data.lon,
        language: lang,
      }
      setErrors({})
      onSubmit(verified, json.data)
    } catch {
      newErrors.city = 'Unable to verify city. Check connection or enter manual AQI.'
      setErrors(newErrors)
    } finally {
      setValidatingCity(false)
    }
  }

  return (
    <div
      className="rounded-3xl border p-6 sm:p-8 md:p-10 shadow-xl transition-all duration-200"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border-subtle)',
        boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.08), 0 0 0 1px var(--border-subtle)',
      }}
    >
      {/* Header section */}
      <div className="mb-7">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2.5 bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20">
          <SlidersHorizontal className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" aria-hidden="true" strokeWidth={2} />
          <span>Profile Configuration</span>
        </div>
        <h2
          className="text-xl sm:text-2xl font-black tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          {lang === 'hi' ? 'अपनी प्रोफ़ाइल और स्थान सेट करें' : 'Personalize Your Smog Defense Plan'}
        </h2>
        <p
          className="text-xs sm:text-sm font-medium mt-1 leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          {lang === 'hi'
            ? 'अपनी जीवनशैली और संवेदनशील सदस्यों के आधार पर व्यक्तिगत मार्गदर्शन प्राप्त करें।'
            : 'Tailored recommendations grounded in WHO air quality thresholds and local CPCB pollution trends.'}
        </p>
      </div>

      {/* 3 Instant Demo presets */}
      <SampleProfiles onSelect={handleSampleSelect} selectedId={selectedPresetId} />

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* Top Field: City Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="city-input"
              className="text-sm font-bold flex items-center gap-1.5"
              style={{ color: 'var(--text-primary)' }}
            >
              <span>City Name</span>
              <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              Delhi-NCR &amp; Global Cities
            </span>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <div className="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <MapPin className="w-4 h-4" aria-hidden="true" strokeWidth={2} />
              </div>
            </div>
            <input
              id="city-input"
              name="city"
              type="text"
              required
              aria-required="true"
              aria-invalid={Boolean(errors.city)}
              aria-describedby={errors.city ? 'city-error' : 'city-helper'}
              value={formData.city}
              onChange={handleChange}
              placeholder="e.g. New Delhi, Noida, Gurugram, Mumbai"
              className={`w-full h-12 pl-12 pr-28 rounded-xl border text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal ${
                errors.city
                  ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20 text-red-900 dark:text-red-100 focus:ring-red-500'
                  : 'hover:border-teal-500/40'
              }`}
              style={
                !errors.city
                  ? {
                      backgroundColor: 'var(--bg-elevated)',
                      borderColor: 'var(--border-subtle)',
                      color: 'var(--text-primary)',
                    }
                  : {}
              }
            />
            {validatingCity && (
              <span className="absolute right-3.5 inset-y-0 flex items-center gap-1.5 text-xs text-teal-600 dark:text-teal-400 font-semibold animate-pulse">
                <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                <span>Locating…</span>
              </span>
            )}
          </div>
          {errors.city ? (
            <p id="city-error" role="alert" className="mt-1.5 text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{errors.city}</span>
            </p>
          ) : (
            <p id="city-helper" className="mt-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
              Live coordinates and hourly AQI will be fetched via Open-Meteo.
            </p>
          )}
        </div>

        {/* 2-column grid for selects on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Household Type */}
          <div>
            <label
              htmlFor="household-select"
              className="text-sm font-bold flex items-center gap-1.5 mb-1.5"
              style={{ color: 'var(--text-primary)' }}
            >
              <Users className="w-4 h-4 text-teal-600 dark:text-teal-400" aria-hidden="true" />
              <span>Household Type</span>
            </label>
            <div className="relative">
              <select
                id="household-select"
                name="householdType"
                value={formData.householdType}
                onChange={handleChange}
                className="w-full h-12 pl-3.5 pr-10 rounded-xl border text-sm font-medium appearance-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal transition-all hover:border-teal-500/40"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-primary)',
                }}
              >
                <option value="asthma">Asthma / Respiratory Risk</option>
                <option value="family_kids">Family with Young Kids</option>
                <option value="elderly">Elderly / Senior Citizens</option>
                <option value="working_professional">Working Professional</option>
                <option value="student">Student / Young Adult</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 dark:text-slate-500">
                <ChevronDown className="w-4 h-4" aria-hidden="true" />
              </div>
            </div>
            <p className="mt-1.5 text-[11px]" style={{ color: 'var(--text-muted)' }}>
              Calibrates clinical vulnerability weightings.
            </p>
          </div>

          {/* Primary Commute */}
          <div>
            <label
              htmlFor="commute-select"
              className="text-sm font-bold flex items-center gap-1.5 mb-1.5"
              style={{ color: 'var(--text-primary)' }}
            >
              <Car className="w-4 h-4 text-teal-600 dark:text-teal-400" aria-hidden="true" />
              <span>Primary Commute</span>
            </label>
            <div className="relative">
              <select
                id="commute-select"
                name="commuteMode"
                value={formData.commuteMode}
                onChange={handleChange}
                className="w-full h-12 pl-3.5 pr-10 rounded-xl border text-sm font-medium appearance-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal transition-all hover:border-teal-500/40"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-primary)',
                }}
              >
                <option value="metro_bus">Metro / Bus (Public Transit)</option>
                <option value="car">Personal Car</option>
                <option value="bike">Two-Wheeler / Motorbike</option>
                <option value="walk">Walk / Bicycle</option>
                <option value="wfh">Work From Home (No commute)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 dark:text-slate-500">
                <ChevronDown className="w-4 h-4" aria-hidden="true" />
              </div>
            </div>
            <p className="mt-1.5 text-[11px]" style={{ color: 'var(--text-muted)' }}>
              Estimates roadside inhalation exposure.
            </p>
          </div>

          {/* Dwelling Type */}
          <div>
            <label
              htmlFor="home-select"
              className="text-sm font-bold flex items-center gap-1.5 mb-1.5"
              style={{ color: 'var(--text-primary)' }}
            >
              <Home className="w-4 h-4 text-teal-600 dark:text-teal-400" aria-hidden="true" />
              <span>Dwelling Type</span>
            </label>
            <div className="relative">
              <select
                id="home-select"
                name="homeType"
                value={formData.homeType}
                onChange={handleChange}
                className="w-full h-12 pl-3.5 pr-10 rounded-xl border text-sm font-medium appearance-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal transition-all hover:border-teal-500/40"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-primary)',
                }}
              >
                <option value="apartment">Apartment / Multi-story Flat</option>
                <option value="independent">Independent House / Ground Floor</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 dark:text-slate-500">
                <ChevronDown className="w-4 h-4" aria-hidden="true" />
              </div>
            </div>
            <p className="mt-1.5 text-[11px]" style={{ color: 'var(--text-muted)' }}>
              Guides natural air infiltration and ventilation hacks.
            </p>
          </div>

          {/* Intervention Budget */}
          <div>
            <label
              htmlFor="budget-select"
              className="text-sm font-bold flex items-center gap-1.5 mb-1.5"
              style={{ color: 'var(--text-primary)' }}
            >
              <Wallet className="w-4 h-4 text-teal-600 dark:text-teal-400" aria-hidden="true" />
              <span>Intervention Budget</span>
            </label>
            <div className="relative">
              <select
                id="budget-select"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full h-12 pl-3.5 pr-10 rounded-xl border text-sm font-medium appearance-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal transition-all hover:border-teal-500/40"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-primary)',
                }}
              >
                <option value="low">Low / DIY (&lt; ₹500)</option>
                <option value="medium">Medium / Standard (₹500 - ₹2K)</option>
                <option value="high">High / Smart HEPA (₹2K+)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 dark:text-slate-500">
                <ChevronDown className="w-4 h-4" aria-hidden="true" />
              </div>
            </div>
            <p className="mt-1.5 text-[11px]" style={{ color: 'var(--text-muted)' }}>
              Ranks DIY Corsi-Rosenthal boxes vs. HEPA hardware.
            </p>
          </div>
        </div>

        {/* Air Purifier Interactive Toggle Card */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => setFormData((prev) => ({ ...prev, hasAirPurifier: !prev.hasAirPurifier }))}
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              e.preventDefault()
              setFormData((prev) => ({ ...prev, hasAirPurifier: !prev.hasAirPurifier }))
            }
          }}
          className="p-4 sm:p-4.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 group hover:border-teal-500/40 hover:shadow-xs"
          style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors shrink-0 ${
                formData.hasAirPurifier
                  ? 'bg-teal-500/15 border-teal-500/30 text-teal-600 dark:text-teal-400'
                  : 'bg-slate-200/50 dark:bg-white/5 border-slate-300/40 dark:border-white/10 text-slate-400 dark:text-slate-500'
              }`}
            >
              <Wind className="w-5 h-5" aria-hidden="true" strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <label
                htmlFor="purifier-checkbox"
                className="text-sm font-bold block cursor-pointer select-none truncate"
                style={{ color: 'var(--text-primary)' }}
                onClick={(e) => e.stopPropagation()}
              >
                I already have an active Air Purifier at home
              </label>
              <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                Calibrates CADR calculations and indoor protection advice
              </p>
            </div>
          </div>

          {/* Interactive Toggle Switch */}
          <div className="relative shrink-0 flex items-center" onClick={(e) => e.stopPropagation()}>
            <input
              id="purifier-checkbox"
              name="hasAirPurifier"
              type="checkbox"
              checked={formData.hasAirPurifier}
              onChange={handleChange}
              className="sr-only"
            />
            <div
              onClick={() => setFormData((prev) => ({ ...prev, hasAirPurifier: !prev.hasAirPurifier }))}
              className={`w-11 h-6 rounded-full transition-colors duration-200 ease-in-out p-0.5 cursor-pointer ${
                formData.hasAirPurifier ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                  formData.hasAirPurifier ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Primary CTA Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading || validatingCity}
            className="w-full h-13 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold text-sm sm:text-base tracking-wide shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal group"
          >
            {loading || validatingCity ? (
              <span className="flex items-center gap-2.5" role="status" aria-live="polite">
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                <span>{validatingCity ? 'Locating City…' : 'Generating your plan...'}</span>
              </span>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-teal-200" aria-hidden="true" />
                <span>Generate Personalized Smog Action Plan</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
