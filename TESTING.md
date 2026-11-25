# Testing Documentation: Urban Air Quality Assistant

This document outlines the test strategy, test suites, edge case scenarios, and execution instructions for the **Urban Air Quality Assistant** platform.

---

## 1. Test Architecture Overview

The test harness is split across two specialized frameworks:
1. **Jest + Supertest (Server)**: ES Module integration and unit testing for deterministic fallback logic, Zod schema validation, in-memory cache with TTL, and Express HTTP API routes.
2. **Vitest + React Testing Library (Client)**: DOM component testing, accessibility role verification, live AQI formatting, and user onboarding flow validation.

```
Total Test Suites / Files: 12 (4 Server Suites, 8 Client Suites)
Total Tests Passing: 111 (66 Server Tests, 45 Client Tests)
Code Coverage Focus: High-risk decision paths, schema gates, fallback engine, accessibility attributes, WCAG AA/AAA theme contrast, branding integration
```

---

## 2. Test Suites Summary

| Level | Suite / File | Test Count | Key Invariants Tested |
|---|---|---|---|
| **Unit** | `server/__tests__/fallbackEngine.test.js` | 26 | CPCB 6 AQI categories, boundary conditions (0, 50, 51, 100, 400, 401, 500, 999), risk scoring weights, air purifier mitigation score, emergency risk thresholds, baseline recommendations. |
| **Unit** | `server/__tests__/validation.test.js` | 23 | Zod schemas: length limits, geographic boundary checks (-90..90, -180..180), household type enum allowlists, chat history depth bounds (max 10), what-if toggles. |
| **Unit** | `server/__tests__/cacheService.test.js` | 8 | Cache TTL expiration, key eviction, memory store clearing, stable object hashing across key ordering variations. |
| **API** | `server/__tests__/routes.test.js` | 9 | `GET /api/health`, `GET /api/aqi` validation & bounds, `POST /api/aqi/manual`, `POST /api/plan` fallback continuity, `POST /api/whatif` dynamic response, `POST /api/chat` medical disclaimer enforcement. |
| **Unit** | `client/__tests__/aqiUtils.test.js` | 10 | Category detection, bilingual labels (English/Hindi), leading zero formatting (`045`), screen-reader aria strings. |
| **Component** | `client/__tests__/AqiCard.test.jsx` | 4 | Text-and-color visual indicators (no color-alone indicators), PM2.5/PM10 readings, `aria-live="polite"` region, manual override modal toggle. |
| **Component** | `client/__tests__/ProfileForm.test.jsx` | 3 | Semantic `<label>` associations, instant demo preset hydration, client-side city validation error rendering. |
| **Component** | `client/__tests__/WhatIfSimulator.test.jsx` | 3 | Interactive intervention toggles, dynamic reduction percentages with (est.) labels, CO2 emission savings calculation. |
| **Component** | `client/__tests__/IndoorHacks.test.jsx` | 2 | Ranked DIY / commercial air cleaning hacks, budget tier badge display, graceful null handling on empty sets. |
| **Component** | `client/__tests__/Header.test.jsx` | 3 | Logo mark rendering, home link accessible name, image source verification, high-contrast border styles. |
| **Unit** | `client/__tests__/sanitize.test.js` | 5 | DOMPurify XSS payload and script tag removal, HTML stripping, non-string null/undefined safety, string truncation. |
| **Unit** | `client/__tests__/themeContrast.test.js` | 15 | WCAG 2.1 AA/AAA color contrast ratios across Light and Dark themes: surface text, primary/secondary/muted text, borders, card backgrounds. |

---

## 3. Detailed Test Matrix (Valid, Invalid & Edge Inputs)

### A. Fallback & Grounding Engine (`server/services/fallbackEngine.js`)

| Scenario | Input | Expected Output | Edge Case Verified |
|---|---|---|---|
| Good AQI boundary | `aqi: 50` | Category `good`, color `green`, risk `low` | Upper boundary of CPCB Good |
| Satisfactory boundary | `aqi: 51` | Category `satisfactory`, color `lime` | Boundary transition |
| Severe Smog emergency | `aqi: 450` | Category `severe`, color `purple`, `riskLevel: emergency` | Off-the-chart winter smog |
| Extreme outlier AQI | `aqi: 999` | Category `severe` (does not crash or return undefined) | Extreme sensor spikes |
| Vulnerability scoring | `householdType: asthma` vs `working_professional` | `asthmaScore > proScore` | Medical vulnerability weighting |
| Mitigation mitigation | `hasAirPurifier: true` vs `false` | Score reduced by 10 points | Mitigating hardware impact |
| Transit risk factor | `commuteMode: wfh` vs `car` | `wfhScore < carScore` | Commute exposure reduction |

### B. Input Validation Gates (`server/middleware/validation.js`)

| Scenario | Input | Expected Output | Security Defense |
|---|---|---|---|
| Valid Profile | Complete JSON payload matching all schemas | HTTP 200 / Passes validation | Normal operation |
| City name injection / length | `city: "A".repeat(101)` | ZodError (400 Bad Request) | Buffer/prompt safety |
| Coordinate tampering | `lat: 95.5, lon: 200` | ZodError (400 Bad Request) | Geographic sanity |
| Unknown Enum Injection | `householdType: "superhuman"` | ZodError (400 Bad Request) | Strict enum allowlist |
| Chat flooding / memory abuse | `history: [11 messages]` | ZodError (400 Bad Request) | Max 10 messages token protection |
| Message bomb | `message: "X".repeat(501)` | ZodError (400 Bad Request) | Input length bounding |

### C. Express API Integration (`server/__tests__/routes.test.js`)

| Route | Scenario | Expected Status | Response Assertion |
|---|---|---|---|
| `GET /api/health` | Uptime probe | 200 OK | `{ status: "ok" }` |
| `GET /api/aqi` | Missing query params | 400 Bad Request | `{ code: "VALIDATION_ERROR" }` |
| `POST /api/aqi/manual` | Manual override values | 200 OK | `{ success: true, data: { manual: true, aqi: 240 } }` |
| `POST /api/plan` | Missing Gemini Key or API Outage | 200 OK | `{ fallback: true, source: "fallback", plan: { ... } }` |
| `POST /api/whatif` | Multi-choice simulation | 200 OK | Dynamic `estimatedReduction` & `co2SavedKg` |
| `POST /api/chat` | Follow-up query | 200 OK | Response includes `⚠️ This is not medical advice` |

### D. Accessible UI Components (`client/__tests__`)

| Component | Behavior Verified | Accessibility Standard |
|---|---|---|
| `AqiCard` | Displays textual category `"Severe AQI"` alongside color | WCAG 1.4.1 (Use of Color) |
| `AqiCard` | Emits live screen-reader announcements via `aria-live="polite"` | WCAG 4.1.3 (Status Messages) |
| `ProfileForm` | All `<input>` and `<select>` controls have matching `<label htmlFor="...">` | WCAG 1.3.1 (Info and Relationships) |
| `ProfileForm` | Displays validation message and `aria-invalid="true"` on empty city | WCAG 3.3.1 (Error Identification) |
| `TrendChart` | Accessible table alternative provided for screen reader users | WCAG 1.1.1 (Non-text Content) |

---

## 4. How to Execute Tests

### Run Full Test Suite (Root)
```bash
npm test
```

### Run Server Tests Only (Jest)
```bash
npm test --workspace=server
```

### Run Client Tests Only (Vitest)
```bash
npm test --workspace=client
```

### Run Linter
```bash
npm run lint
```

### Run Production Build
```bash
npm run build
```

---

## 5. Continuous Integration (CI)

A GitHub Actions workflow is located at `.github/workflows/ci.yml`. It runs on every push and pull request to `main`, validating:
1. `npm install`
2. `npm run lint`
3. `npm test`
4. `npm run build`
