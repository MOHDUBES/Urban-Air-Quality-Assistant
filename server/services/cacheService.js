// server/services/cacheService.js
// In-memory cache with TTL support and hashing utilities.

export class CacheService {
  constructor() {
    /** @type {Map<string, { value: any, expiresAt: number }>} */
    this.store = new Map()
  }

  get(key) {
    const entry = this.store.get(key)
    if (!entry) return null
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key)
      return null
    }
    return entry.value
  }

  set(key, value, ttlMs) {
    this.store.set(key, { value, expiresAt: Date.now() + ttlMs })
  }

  delete(key) {
    return this.store.delete(key)
  }

  clear() {
    this.store.clear()
  }

  size() {
    return this.store.size
  }
}

export const planCache = new CacheService()
export const aqiCache = new CacheService()

export const AQI_TTL = 10 * 60 * 1000 // 10 minutes
export const PLAN_TTL = 30 * 60 * 1000 // 30 minutes

export function hashObject(obj) {
  try {
    return JSON.stringify(obj, Object.keys(obj || {}).sort())
  } catch {
    return JSON.stringify(obj)
  }
}

// Flat helper functions for backward compatibility
const globalStore = new CacheService()
export function getCache(key) { return globalStore.get(key) }
export function setCache(key, value, ttlMs) { globalStore.set(key, value, ttlMs) }
export function deleteCache(key) { return globalStore.delete(key) }
export function clearCache() { globalStore.clear() }
export function getCacheSize() { return globalStore.size() }
