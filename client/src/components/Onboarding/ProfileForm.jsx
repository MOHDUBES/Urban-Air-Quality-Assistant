// client/src/components/Onboarding/ProfileForm.jsx
import React, { useState, useEffect, useContext } from 'react'
import { LangContext } from '../../App'
import SampleProfiles from './SampleProfiles.jsx'

export default function ProfileForm({ onSubmit, initialValues, loading }) {
  const { t, lang } = useContext(LangContext)

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

  const [errors, setErrors] = useState({})
  const [validatingCity, setValidatingCity] = useState(false)

  useEffect(() => {
    if (initialValues) {
      setFormData((prev) => ({ ...prev, ...initialValues }))
    }
  }, [initialValues])

  const handleSampleSelect = (sampleData) => {
    setFormData((prev) => ({ ...prev, ...sampleData }))
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
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          {lang === 'hi' ? 'अपनी प्रोफ़ाइल और स्थान सेट करें' : 'Personalize Your Smog Defense Plan'}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {lang === 'hi'
            ? 'अपनी जीवनशैली और संवेदनशील सदस्यों के आधार पर व्यक्तिगत मार्गदर्शन प्राप्त करें।'
            : 'Tailored recommendations grounded in WHO air quality thresholds and local CPCB pollution trends.'}
        </p>
      </div>

      {/* 3 Instant Demo presets */}
      <SampleProfiles onSelect={handleSampleSelect} />

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* City Input */}
        <div>
          <label htmlFor="city-input" className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
            City Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="city-input"
              name="city"
              type="text"
              required
              aria-required="true"
              aria-invalid={Boolean(errors.city)}
              aria-describedby={errors.city ? 'city-error' : undefined}
              value={formData.city}
              onChange={handleChange}
              placeholder="e.g. New Delhi, Noida, Gurugram, Mumbai"
              className={`w-full px-4 py-2.5 rounded-xl border ${
                errors.city
                  ? 'border-red-500 bg-red-50 dark:bg-red-950/20'
                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900'
              } text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
            />
            {validatingCity && (
              <span className="absolute right-3 top-2.5 text-xs text-gray-400 animate-pulse">
                Checking…
              </span>
            )}
          </div>
          {errors.city && (
            <p id="city-error" role="alert" className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">
              {errors.city}
            </p>
          )}
        </div>

        {/* 2-column grid for selects */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Household Type */}
          <div>
            <label htmlFor="household-select" className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
              Household Type
            </label>
            <select
              id="household-select"
              name="householdType"
              value={formData.householdType}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="asthma">🫁 Asthma / Respiratory Patient</option>
              <option value="family_kids">👨‍👩‍👧‍👦 Family with Young Kids</option>
              <option value="elderly">👵 Elderly / Senior Citizens</option>
              <option value="working_professional">💼 Working Professional</option>
              <option value="student">🎓 Student / Young Adult</option>
            </select>
          </div>

          {/* Commute Mode */}
          <div>
            <label htmlFor="commute-select" className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
              Primary Commute
            </label>
            <select
              id="commute-select"
              name="commuteMode"
              value={formData.commuteMode}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="metro_bus">🚇 Metro / Bus (Public Transit)</option>
              <option value="car">🚗 Personal Car</option>
              <option value="bike">🛵 Two-Wheeler / Motorbike</option>
              <option value="walk">🚶 Walk / Bicycle</option>
              <option value="wfh">🏠 Work From Home (No commute)</option>
            </select>
          </div>

          {/* Home Type */}
          <div>
            <label htmlFor="home-select" className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
              Dwelling Type
            </label>
            <select
              id="home-select"
              name="homeType"
              value={formData.homeType}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="apartment">🏢 Apartment / Multi-story Flat</option>
              <option value="independent">🏡 Independent House / Ground Floor</option>
            </select>
          </div>

          {/* Budget */}
          <div>
            <label htmlFor="budget-select" className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
              Intervention Budget
            </label>
            <select
              id="budget-select"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">🌱 Low / DIY Hacks (&lt; ₹500)</option>
              <option value="medium">⚖️ Medium / Standard Purifier (₹500 - ₹2,000)</option>
              <option value="high">🛡️ High / Premium Smart HEPA (₹2,000+)</option>
            </select>
          </div>
        </div>

        {/* Air Purifier Toggle */}
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700">
          <input
            id="purifier-checkbox"
            name="hasAirPurifier"
            type="checkbox"
            checked={formData.hasAirPurifier}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 rounded border-gray-300 dark:border-gray-600 focus:ring-blue-500"
          />
          <label htmlFor="purifier-checkbox" className="text-sm font-medium text-gray-800 dark:text-gray-200 cursor-pointer">
            I already have an active Air Purifier at home
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || validatingCity}
          className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm tracking-wide shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          {loading || validatingCity ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>{validatingCity ? 'Locating City…' : 'Generating Plan…'}</span>
            </>
          ) : (
            <>
              <span>Generate Personalized Smog Action Plan</span>
              <span aria-hidden="true">→</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}
