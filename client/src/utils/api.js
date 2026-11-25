// client/src/utils/api.js
// Resolves the backend API base URL automatically across local, LAN, and Vercel environments.

export const API_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' &&
  window.location.hostname.includes('vercel.app') &&
  !window.location.hostname.includes('server')
    ? 'https://urban-air-quality-assistant-server-eosin.vercel.app'
    : '')
