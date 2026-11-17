import { useState, useEffect, useRef, useCallback } from 'react';

const DEBOUNCE_MS = 300;
const REFRESH_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

function buildUrl(params) {
  const base = '/api/aqi';
  const query = new URLSearchParams(params).toString();
  return `${base}?${query}`;
}

export function useAqi(city, lat, lon) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [manualOverride, setManualOverride] = useState({
    active: false,
    aqi: '',
    pm25: '',
    pm10: '',
  });

  const abortRef = useRef(null);
  const timerRef = useRef(null);
  const debounceRef = useRef(null);

  const fetchAqi = useCallback(
    async (params, signal) => {
      setLoading(true);
      setError(null);
      try {
        const url = buildUrl(params);
        const res = await fetch(url, { signal });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || `HTTP ${res.status}`);
        }
        const json = await res.json();
        setData(json);
        setError(null);
      } catch (err) {
        if (err.name === 'AbortError') return;
        setError(err.message || 'Failed to fetch AQI');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const refetch = useCallback(() => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    if (lat != null && lon != null) {
      fetchAqi({ lat, lon }, controller.signal);
    } else if (city && city.trim()) {
      fetchAqi({ city: city.trim() }, controller.signal);
    }
  }, [city, lat, lon, fetchAqi]);

  // Debounced effect when city changes
  useEffect(() => {
    if (!city && lat == null) return;

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      if (lat != null && lon != null) {
        fetchAqi({ lat, lon }, controller.signal);
      } else if (city && city.trim()) {
        fetchAqi({ city: city.trim() }, controller.signal);
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(debounceRef.current);
  }, [city, lat, lon, fetchAqi]);

  // Auto-refresh every 10 minutes
  useEffect(() => {
    if (!city && lat == null) return;
    timerRef.current = setInterval(refetch, REFRESH_INTERVAL_MS);
    return () => clearInterval(timerRef.current);
  }, [city, lat, lon, refetch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort();
      clearTimeout(debounceRef.current);
      clearInterval(timerRef.current);
    };
  }, []);

  return {
    data,
    loading,
    error,
    refetch,
    manualOverride,
    setManualOverride,
  };
}
