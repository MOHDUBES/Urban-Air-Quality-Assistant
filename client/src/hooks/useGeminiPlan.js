// client/src/hooks/useGeminiPlan.js
// Hook for fetching action plans, what-if analyses, and chat from the backend.

import { useState, useCallback } from 'react'

export function useGeminiPlan() {
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isFallback, setIsFallback] = useState(false)
  const [source, setSource] = useState(null) // 'gemini' | 'fallback'

  const [whatIfResult, setWhatIfResult] = useState(null)
  const [whatIfLoading, setWhatIfLoading] = useState(false)
  const [whatIfError, setWhatIfError] = useState(null)

  const [chatHistory, setChatHistory] = useState([])
  const [chatLoading, setChatLoading] = useState(false)
  const [chatError, setChatError] = useState(null)

  const generatePlan = useCallback(async (profile, aqiData) => {
    setLoading(true)
    setError(null)
    setPlan(null)
    setIsFallback(false)
    setSource(null)

    try {
      const payload = {
        profile,
        aqiOverride: aqiData?.manual ? {
          aqi: Number(aqiData.aqi),
          pm25: aqiData.pm25 != null ? Number(aqiData.pm25) : undefined,
          pm10: aqiData.pm10 != null ? Number(aqiData.pm10) : undefined,
        } : undefined,
      }

      const res = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`)

      setPlan(json.plan || json)
      setIsFallback(Boolean(json.fallback || json.isFallback))
      setSource(json.source || (json.fallback ? 'fallback' : 'gemini'))
    } catch (err) {
      setError(err.message || 'Failed to generate action plan')
    } finally {
      setLoading(false)
    }
  }, [])

  const generateWhatIf = useCallback(async (profile, aqiData, choices) => {
    setWhatIfLoading(true)
    setWhatIfError(null)
    setWhatIfResult(null)

    try {
      const payload = {
        profile,
        aqi: Number(aqiData?.aqi ?? 200),
        choices: choices || {},
        language: profile.language || 'en',
      }

      const res = await fetch('/api/whatif', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`)

      setWhatIfResult(json.result || json)
    } catch (err) {
      setWhatIfError(err.message || 'Failed to run what-if simulation')
    } finally {
      setWhatIfLoading(false)
    }
  }, [])

  const sendChat = useCallback(async (message, profile, aqiData) => {
    setChatLoading(true)
    setChatError(null)

    const userMessage = { role: 'user', content: message, timestamp: Date.now() }
    const updatedHistory = [...chatHistory, userMessage].slice(-10)
    setChatHistory(updatedHistory)

    try {
      const payload = {
        message,
        profile,
        aqi: Number(aqiData?.aqi ?? 200),
        history: updatedHistory.slice(0, -1).map((h) => ({
          role: h.role,
          content: String(h.content || '').slice(0, 4000),
        })),
        language: profile?.language || 'en',
      }

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`)

      const assistantMessage = {
        role: 'assistant',
        content: json.response || json.reply || '',
        disclaimer: json.disclaimer,
        timestamp: Date.now(),
      }
      setChatHistory((prev) => [...prev, assistantMessage].slice(-10))
    } catch (err) {
      const errorMessage = err.message || 'Failed to send chat message'
      setChatError(errorMessage)
      const assistantError = {
        role: 'assistant',
        content: `⚠️ ${errorMessage}. Please try asking again.`,
        isError: true,
        timestamp: Date.now(),
      }
      setChatHistory((prev) => [...prev, assistantError].slice(-10))
    } finally {
      setChatLoading(false)
    }
  }, [chatHistory])

  const clearChat = useCallback(() => {
    setChatHistory([])
    setChatError(null)
  }, [])

  return {
    plan,
    loading,
    error,
    isFallback,
    source,
    generatePlan,
    whatIfResult,
    whatIfLoading,
    whatIfError,
    generateWhatIf,
    chatHistory,
    chatLoading,
    chatError,
    sendChat,
    clearChat,
  }
}
