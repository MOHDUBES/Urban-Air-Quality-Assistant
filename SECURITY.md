# Security Policy & Threat Model

The **Urban Air Quality Assistant** platform implements a defense-in-depth security model to safeguard users, protect sensitive environmental telemetry, enforce zero-trust input validation, and ensure uninterrupted availability during public health smog emergencies.

---

## 1. Security Architecture & Threat Mitigation

| Security Control | Implementation | Threat / Attack Mitigated |
|---|---|---|
| **Zero-Trust Input Validation** | Strict `zod` schemas (`server/middleware/validation.js`) with geographic range gates, string truncation, and enum allowlists | Remote Code Injection, Buffer Overflow, Parameter Tampering |
| **Strict Content Security Policy (CSP)** | `helmet()` with tailored script, style, font, connect, and image directives | Cross-Site Scripting (XSS), Data Exfiltration |
| **Cross-Site Scripting (XSS) Prevention** | Client & server HTML tag stripping with `DOMPurify` sanitizer | Stored & Reflected XSS attacks |
| **Tiered Rate Limiting** | `express-rate-limit` with IP-based windowing (General: 200 req/15m, Plan: 60 req/15m, Chat: 30 req/15m) | Denial of Service (DoS), API Quota Exhaustion, Credential Abuse |
| **Clickjacking & UI Redressing Defense** | `frameAncestors: ["'self'"]` and `X-Frame-Options: SAMEORIGIN` | Iframe embedding and Clickjacking |
| **MIME Sniffing Prevention** | `X-Content-Type-Options: nosniff` | Drive-by download and MIME-confusion attacks |
| **Browser Sandbox Restrictions** | `Permissions-Policy: camera=(), microphone=(), geolocation=(self)` | Unauthorized hardware feature exploitation |
| **CORS Access Control** | Strictly restricted origin allowlist (local dev, private LAN subnets, official Vercel preview domains) | Cross-Origin Data Theft, CSRF Exploitation |
| **Payload Size Bounding** | `express.json({ limit: '20kb' })` | Memory exhaustion and large payload flooding |
| **Fail-Safe Deterministic Isolation** | Isolated in-memory fallback engine providing verified clinical air guidance during API outages | Outage-driven service disruption during critical pollution spikes |

---

## 2. Data Privacy & GDPR/HIPAA Alignment

- **Zero PII Collection**: The application does NOT collect, store, or transmit user names, email addresses, phone numbers, or persistent device fingerprints.
- **Client-Side Session State**: User profiles (household vulnerability, commute mode, dwelling type) remain strictly in memory or local browser session state.
- **Telemetry Anonymization**: Geocoding queries only transmit city/district strings or rounded latitude/longitude coordinates to public meteorological APIs (`open-meteo.com`).

---

## 3. Vulnerability Reporting & Disclosure

If you discover a security vulnerability within this project:
1. Please open an issue with the label `security` or contact the maintainers directly via GitHub.
2. Provide detailed steps to reproduce the issue along with a minimal proof of concept (PoC).
3. Maintainers commit to reviewing and patching high-severity issues within 24 to 48 hours.

---

## 4. Compliance & Verification

- **OWASP Top 10 (2021)**: Tested against Injection (A03), Security Misconfiguration (A05), Vulnerable and Outdated Components (A06), and Identification and Authentication Failures (A07).
- **Automated Security Suites**: Verified by automated test suites in `server/__tests__/security.test.js` covering CSP headers, rate-limiting, and error masking.
