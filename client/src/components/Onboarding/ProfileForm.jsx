// client/src/components/Onboarding/ProfileForm.jsx
import React, { useState, useEffect, useContext } from 'react'
import { AlertCircle, ArrowRight, Loader2, MapPin } from 'lucide-react'
import { LangContext } from '../../App'
import SampleProfiles from './SampleProfiles.jsx'

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
      const res = await fetch(`/api/aqi?city=${encodeURIComponent(formData.city.trim())}`)
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
      className="bg-white dark:bg-navy-850 rounded-card shadow-card border border-slate-200/80 dark:border-white/10 p-6 md:p-8 transition-colors duration-200"
      style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
    >
      <div className="mb-6">
        <h2
          className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          {lang === 'hi' ? 'अपनी प्रोफ़ाइल और स्थान सेट करें' : 'Personalize Your Smog Defense Plan'}
        </h2>
        <p
          className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-1"
          style={{ color: 'var(--text-secondary)' }}
        >
          {lang === 'hi'
            ? 'अपनी जीवनशैली और संवेदनशील सदस्यों के आधार पर व्यक्तिगत मार्गदर्शन प्राप्त करें।'
            : 'Tailored recommendations grounded in WHO air quality thresholds and local CPCB pollution trends.'}
        </p>
      </div>

      {/* 3 Instant Demo presets */}
      <SampleProfiles onSelect={handleSampleSelect} selectedId={selectedPresetId} />

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Top Field: City Input */}
        <div>
          <label
            htmlFor="city-input"
            className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5"
            style={{ color: 'var(--text-primary)' }}
          >
            City Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <MapPin className="w-5 h-5 text-teal-600 dark:text-teal-400" aria-hidden="true" strokeWidth={1.75} />
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
              className={`w-full h-12 pl-11 pr-24 rounded-btn border text-sm font-medium transition-all ${
                errors.city
                  ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20 text-red-900 dark:text-red-100 focus:ring-red-500'
                  : 'border-slate-300 dark:border-white/10 bg-slate-50/50 dark:bg-navy-900 text-slate-900 dark:text-white focus:border-brand-teal focus:bg-white dark:focus:bg-navy-900'
              } focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal`}
              style={!errors.city ? { backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' } : {}}
            />
            {validatingCity && (
              <span className="absolute right-3.5 inset-y-0 flex items-center gap-1.5 text-xs text-teal-600 dark:text-teal-400 font-semibold animate-pulse">
                <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                <span>Checking…</span>
              </span>
            )}
          </div>
          {errors.city ? (
            <p id="city-error" role="alert" className="mt-1.5 text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
              <span>{errors.city}</span>
            </p>
          ) : (
            <p id="city-helper" className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Live coordinates and hourly AQI will be fetched via Open-Meteo.
            </p>
          )}
        </div>

        {/* 2-column grid for selects on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5">
          {/* Household Type */}
          <div>
            <label
              htmlFor="household-select"
              className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5"
              style={{ color: 'var(--text-primary)' }}
            >
              Household Type
            </label>
            <select
              id="household-select"
              name="householdType"
              value={formData.householdType}
              onChange={handleChange}
              className="w-full h-12 px-3.5 rounded-btn border border-slate-300 dark:border-white/10 bg-slate-50/50 dark:bg-navy-900 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:border-brand-teal focus:bg-white dark:focus:bg-navy-900 focus-visible:ring-2 focus-visible:ring-brand-teal transition-all"
              style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
            >
              <option value="asthma">🫁 Asthma / Respiratory Patient</option>
              <option value="family_kids">👨‍👩‍👧‍👦 Family with Young Kids</option>
              <option value="elderly">👵 Elderly / Senior Citizens</option>
              <option value="working_professional">💼 Working Professional</option>
              <option value="student">🎓 Student / Young Adult</option>
            </select>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400" style={{ color: 'var(--text-muted)' }}>
              Calibrates clinical vulnerability weightings.
            </p>
          </div>

          {/* Commute Mode */}
          <div>
            <label
              htmlFor="commute-select"
              className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5"
              style={{ color: 'var(--text-primary)' }}
            >
              Primary Commute
            </label>
            <select
              id="commute-select"
              name="commuteMode"
              value={formData.commuteMode}
              onChange={handleChange}
              className="w-full h-12 px-3.5 rounded-btn border border-slate-300 dark:border-white/10 bg-slate-50/50 dark:bg-navy-900 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:border-brand-teal focus:bg-white dark:focus:bg-navy-900 focus-visible:ring-2 focus-visible:ring-brand-teal transition-all"
              style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
            >
              <option value="metro_bus">🚇 Metro / Bus (Public Transit)</option>
              <option value="car">🚗 Personal Car</option>
              <option value="bike">🛵 Two-Wheeler / Motorbike</option>
              <option value="walk">🚶 Walk / Bicycle</option>
              <option value="wfh">🏠 Work From Home (No commute)</option>
            </select>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400" style={{ color: 'var(--text-muted)' }}>
              Estimates roadside inhalation exposure.
            </p>
          </div>

          {/* Dwelling Type */}
          <div>
            <label
              htmlFor="home-select"
              className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5"
              style={{ color: 'var(--text-primary)' }}
            >
              Dwelling Type
            </label>
            <select
              id="home-select"
              name="homeType"
              value={formData.homeType}
              onChange={handleChange}
              className="w-full h-12 px-3.5 rounded-btn border border-slate-300 dark:border-white/10 bg-slate-50/50 dark:bg-navy-900 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:border-brand-teal focus:bg-white dark:focus:bg-navy-900 focus-visible:ring-2 focus-visible:ring-brand-teal transition-all"
              style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
            >
              <option value="apartment">🏢 Apartment / Multi-story Flat</option>
              <option value="independent">🏡 Independent House / Ground Floor</option>
            </select>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400" style={{ color: 'var(--text-muted)' }}>
              Guides natural air infiltration and ventilation hacks.
            </p>
          </div>

          {/* Intervention Budget */}
          <div>
            <label
              htmlFor="budget-select"
              className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5"
              style={{ color: 'var(--text-primary)' }}
            >
              Intervention Budget
            </label>
            <select
              id="budget-select"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className="w-full h-12 px-3.5 rounded-btn border border-slate-300 dark:border-white/10 bg-slate-50/50 dark:bg-navy-900 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:border-brand-teal focus:bg-white dark:focus:bg-navy-900 focus-visible:ring-2 focus-visible:ring-brand-teal transition-all"
              style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
            >
              <option value="low">🌱 Low / DIY Hacks (&lt; ₹500)</option>
              <option value="medium">⚖️ Medium / Standard Purifier (₹500 - ₹2,000)</option>
              <option value="high">🛡️ High / Premium Smart HEPA (₹2,000+)</option>
            </select>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400" style={{ color: 'var(--text-muted)' }}>
              Ranks DIY Corsi-Rosenthal boxes vs. HEPA hardware.
            </p>
          </div>
        </div>

        {/* Air Purifier Toggle Card */}
        <div
          className="flex items-center gap-3 p-4 rounded-xl bg-slate-50/80 dark:bg-navy-800/60 border border-slate-200/80 dark:border-white/10 transition-colors"
          style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}
        >
          <input
            id="purifier-checkbox"
            name="hasAirPurifier"
            type="checkbox"
            checked={formData.hasAirPurifier}
            onChange={handleChange}
            className="w-4 h-4 rounded text-teal-600 focus:ring-brand-teal border-slate-300 dark:border-slate-600 dark:bg-navy-900"
          />
          <label
            htmlFor="purifier-checkbox"
            className="text-sm font-semibold text-slate-800 dark:text-slate-200 cursor-pointer select-none"
            style={{ color: 'var(--text-primary)' }}
          >
            I already have an active Air Purifier at home
          </label>
        </div>

        {/* Primary CTA */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading || validatingCity}
            className="w-full h-12 px-6 rounded-btn bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-bold text-sm sm:text-base tracking-wide shadow-md shadow-teal-500/20 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
          >
            {loading || validatingCity ? (
              <span className="flex items-center gap-2" role="status" aria-live="polite">
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                <span>{validatingCity ? 'Locating City…' : 'Generating your plan...'}</span>
              </span>
            ) : (
              <>
                <span>Generate Personalized Smog Action Plan</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
