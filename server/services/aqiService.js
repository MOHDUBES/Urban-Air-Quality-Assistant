// server/services/aqiService.js
// Fetches real-time air quality data from Open-Meteo Air Quality API.
// No API key required. Also handles geocoding via Open-Meteo Geocoding API.

import { getCache, setCache } from './cacheService.js';

const AQI_API = 'https://air-quality-api.open-meteo.com/v1/air-quality';
const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';

/**
 * Map European AQI to Indian AQI approximation using CPCB PM2.5 breakpoints.
 * @param {number} _europeanAqi
 * @param {number} pm25
 * @returns {number}
 */
function toIndianAqi(_europeanAqi, pm25) {
  const breakpoints = [
    { low: 0, high: 30, iLow: 0, iHigh: 50 },
    { low: 30, high: 60, iLow: 51, iHigh: 100 },
    { low: 60, high: 90, iLow: 101, iHigh: 200 },
    { low: 90, high: 120, iLow: 201, iHigh: 300 },
    { low: 120, high: 250, iLow: 301, iHigh: 400 },
    { low: 250, high: 500, iLow: 401, iHigh: 500 },
  ];

  for (const bp of breakpoints) {
    if (pm25 >= bp.low && pm25 <= bp.high) {
      return Math.round(
        ((bp.iHigh - bp.iLow) / (bp.high - bp.low)) * (pm25 - bp.low) + bp.iLow
      );
    }
  }
  return Math.min(500, Math.round(pm25 * 2));
}

/**
 * Map AQI value to category id.
 * @param {number} aqi
 * @returns {string}
 */
function getCategory(aqi) {
  if (aqi <= 50) return 'good';
  if (aqi <= 100) return 'satisfactory';
  if (aqi <= 200) return 'moderate';
  if (aqi <= 300) return 'poor';
  if (aqi <= 400) return 'very_poor';
  return 'severe';
}

/**
 * Fetch AQI data for the given coordinates. Results cached 15 min.
 * @param {number} lat
 * @param {number} lon
 * @returns {Promise<import('../../shared/types.js').AqiData>}
 */
export async function getAqiData(lat, lon) {
  const cacheKey = `aqi:${lat.toFixed(2)}:${lon.toFixed(2)}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const url = new URL(AQI_API);
  url.searchParams.set('latitude', lat);
  url.searchParams.set('longitude', lon);
  url.searchParams.set('hourly', 'european_aqi,pm2_5,pm10');
  url.searchParams.set('timezone', 'auto');
  url.searchParams.set('forecast_days', '1');

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Open-Meteo AQI API error: ${res.status}`);
  const json = await res.json();

  const { hourly } = json;
  const times = hourly.time;
  const aqiArr = hourly.european_aqi;
  const pm25Arr = hourly.pm2_5;
  const pm10Arr = hourly.pm10;

  let currentIdx = aqiArr.length - 1;
  for (let i = aqiArr.length - 1; i >= 0; i--) {
    if (aqiArr[i] !== null) { currentIdx = i; break; }
  }

  const rawPm25 = pm25Arr[currentIdx] ?? 0;
  const rawPm10 = pm10Arr[currentIdx] ?? 0;
  const aqi = toIndianAqi(aqiArr[currentIdx] ?? 0, rawPm25);

  const hourlyData = times.slice(0, 24).map((time, i) => ({
    time,
    aqi: toIndianAqi(aqiArr[i] ?? 0, pm25Arr[i] ?? 0),
    pm25: pm25Arr[i] ?? 0,
    pm10: pm10Arr[i] ?? 0,
  }));

  const result = {
    aqi,
    pm25: rawPm25,
    pm10: rawPm10,
    category: getCategory(aqi),
    timestamp: new Date().toISOString(),
    hourlyData,
  };

  setCache(cacheKey, result, 15 * 60 * 1000);
  return result;
}

/**
 * Geocode a city name to lat/lon.
 * @param {string} city
 * @returns {Promise<{lat: number, lon: number, name: string}>}
 */
export async function geocodeCity(city) {
  const cacheKey = `geo:${city.toLowerCase()}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const url = new URL(GEOCODING_API);
  url.searchParams.set('name', city);
  url.searchParams.set('count', '1');
  url.searchParams.set('language', 'en');
  url.searchParams.set('format', 'json');

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Geocoding API error: ${res.status}`);
  const json = await res.json();

  if (!json.results?.length) throw new Error(`City not found: ${city}`);
  const { latitude, longitude, name } = json.results[0];
  const result = { lat: latitude, lon: longitude, name };

  setCache(cacheKey, result, 24 * 60 * 60 * 1000);
  return result;
}
