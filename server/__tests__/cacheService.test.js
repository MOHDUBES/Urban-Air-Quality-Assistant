// server/__tests__/cacheService.test.js
import { CacheService, hashObject, planCache, aqiCache } from '../services/cacheService.js'

describe('CacheService', () => {
  let cache

  beforeEach(() => {
    cache = new CacheService()
  })

  test('sets and gets value within TTL', () => {
    cache.set('foo', 'bar', 1000)
    expect(cache.get('foo')).toBe('bar')
  })

  test('returns null for missing key', () => {
    expect(cache.get('nonexistent')).toBeNull()
  })

  test('expires key after TTL passes', () => {
    cache.set('expiring', { a: 1 }, -1) // Expired immediately
    expect(cache.get('expiring')).toBeNull()
  })

  test('delete removes key from cache', () => {
    cache.set('delKey', 123, 5000)
    expect(cache.get('delKey')).toBe(123)
    cache.delete('delKey')
    expect(cache.get('delKey')).toBeNull()
  })

  test('clear empties the entire cache', () => {
    cache.set('k1', 1, 5000)
    cache.set('k2', 2, 5000)
    expect(cache.size()).toBe(2)
    cache.clear()
    expect(cache.size()).toBe(0)
    expect(cache.get('k1')).toBeNull()
  })

  test('singleton instances exist', () => {
    expect(planCache).toBeInstanceOf(CacheService)
    expect(aqiCache).toBeInstanceOf(CacheService)
  })
})

describe('hashObject', () => {
  test('returns stable string for identical objects regardless of key order', () => {
    const o1 = { b: 2, a: 1 }
    const o2 = { a: 1, b: 2 }
    expect(hashObject(o1)).toBe(hashObject(o2))
  })

  test('returns different string for different objects', () => {
    const o1 = { a: 1 }
    const o2 = { a: 2 }
    expect(hashObject(o1)).not.toBe(hashObject(o2))
  })
})
