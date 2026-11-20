import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

// ---------------------------------------------------------------------------
// 1. SVG Definitions
// ---------------------------------------------------------------------------

export const logoMarkSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="Urban Air Quality Assistant logo">
  <title>Urban Air Quality Assistant logo</title>
  <defs>
    <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10B981" />
      <stop offset="100%" stop-color="#0F766E" />
    </linearGradient>
  </defs>
  <style>
    .badge-bg { fill: #0B3B5A; stroke: #10B981; stroke-width: 1.5; }
    .smog-cloud { fill: #94A3B8; opacity: 0.35; }
    .leaf-body { fill: url(#leafGrad); }
    .leaf-vein { stroke: #FFFFFF; stroke-width: 1.5; stroke-linecap: round; opacity: 0.85; }
    .air-wave { stroke: #FFFFFF; stroke-width: 3.2; stroke-linecap: round; fill: none; }
    .air-wave-accent { stroke: #10B981; stroke-width: 3.2; stroke-linecap: round; fill: none; }
    @media (prefers-color-scheme: dark) {
      .badge-bg { fill: #08293F; stroke: #34D399; stroke-width: 2; }
    }
    @media (forced-colors: active) {
      .badge-bg { stroke: CanvasText; stroke-width: 2; }
      .air-wave { stroke: CanvasText; }
    }
  </style>

  <!-- Rounded badge background for high-contrast visibility on light & dark -->
  <rect class="badge-bg" x="2" y="2" width="60" height="60" rx="14" />

  <!-- Faint grey smog cloud fading out behind the leaf -->
  <path class="smog-cloud" d="M 16 26 C 14 22 18 17 23 18 C 26 14 32 14 35 17 C 39 16 43 19 42 24 C 45 26 45 30 41 32 C 38 33 17 33 16 26 Z" />

  <!-- Leaf upper half transitioning to clean air -->
  <path class="leaf-body" d="M 32 11 C 21 19 17 27 22 35 C 27 32 37 32 42 35 C 47 27 43 19 32 11 Z" />
  <line class="leaf-vein" x1="32" y1="14" x2="32" y2="33" />

  <!-- 3 Flowing horizontal air wave lines (clean air dissolving from leaf) -->
  <path class="air-wave" d="M 18 37 C 24 34 30 39 36 36 C 41 33 46 36 50 35" />
  <path class="air-wave-accent" d="M 14 44 C 21 40 28 46 35 43 C 41 40 47 44 53 43" />
  <path class="air-wave" d="M 19 51 C 25 48 31 53 37 50 C 42 47 46 50 49 50" />
</svg>`;

export const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="Urban Air Quality Assistant icon">
  <title>Urban Air Quality Assistant icon</title>
  <defs>
    <linearGradient id="favLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10B981" />
      <stop offset="100%" stop-color="#0F766E" />
    </linearGradient>
  </defs>
  <style>
    .badge-bg { fill: #0B3B5A; stroke: #10B981; stroke-width: 2.5; }
    .smog-cloud { fill: #94A3B8; opacity: 0.35; }
    .leaf-body { fill: url(#favLeafGrad); }
    .air-wave { stroke: #FFFFFF; stroke-width: 4.2; stroke-linecap: round; fill: none; }
    .air-wave-accent { stroke: #10B981; stroke-width: 4.2; stroke-linecap: round; fill: none; }
    @media (prefers-color-scheme: dark) {
      .badge-bg { fill: #08293F; stroke: #34D399; stroke-width: 3; }
    }
  </style>

  <!-- Simplified high-clarity badge for 16x16 / 32x32 viewports -->
  <rect class="badge-bg" x="2" y="2" width="60" height="60" rx="14" />
  <path class="smog-cloud" d="M 16 26 C 14 22 18 17 23 18 C 26 14 32 14 35 17 C 39 16 43 19 42 24 C 45 26 45 30 41 32 C 38 33 17 33 16 26 Z" />
  <path class="leaf-body" d="M 32 10 C 20 18 16 27 22 35 C 27 32 37 32 42 35 C 48 27 44 18 32 10 Z" />
  <path class="air-wave" d="M 18 37 C 24 34 30 39 36 36 C 41 33 46 36 50 35" />
  <path class="air-wave-accent" d="M 14 44 C 21 40 28 46 35 43 C 41 40 47 44 53 43" />
  <path class="air-wave" d="M 19 51 C 25 48 31 53 37 50 C 42 47 46 50 49 50" />
</svg>`;

export const logoFullSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 64" width="320" height="64" role="img" aria-label="Urban Air Quality Assistant logo full">
  <title>Urban Air Quality Assistant</title>
  <defs>
    <linearGradient id="fullLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10B981" />
      <stop offset="100%" stop-color="#0F766E" />
    </linearGradient>
  </defs>
  <style>
    .badge-bg { fill: #0B3B5A; stroke: #10B981; stroke-width: 1.5; }
    .smog-cloud { fill: #94A3B8; opacity: 0.35; }
    .leaf-body { fill: url(#fullLeafGrad); }
    .leaf-vein { stroke: #FFFFFF; stroke-width: 1.5; stroke-linecap: round; opacity: 0.85; }
    .air-wave { stroke: #FFFFFF; stroke-width: 3.2; stroke-linecap: round; fill: none; }
    .air-wave-accent { stroke: #10B981; stroke-width: 3.2; stroke-linecap: round; fill: none; }
    .brand-title { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 16.5px; font-weight: 700; fill: #0B3B5A; }
    .brand-tagline { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; font-weight: 600; fill: #0F766E; letter-spacing: 0.4px; }
    @media (prefers-color-scheme: dark) {
      .badge-bg { fill: #08293F; stroke: #34D399; }
      .brand-title { fill: #F8FAFC; }
      .brand-tagline { fill: #34D399; }
    }
  </style>

  <!-- Left: Icon Mark -->
  <g transform="translate(0, 0)">
    <rect class="badge-bg" x="2" y="2" width="60" height="60" rx="14" />
    <path class="smog-cloud" d="M 16 26 C 14 22 18 17 23 18 C 26 14 32 14 35 17 C 39 16 43 19 42 24 C 45 26 45 30 41 32 C 38 33 17 33 16 26 Z" />
    <path class="leaf-body" d="M 32 11 C 21 19 17 27 22 35 C 27 32 37 32 42 35 C 47 27 43 19 32 11 Z" />
    <line class="leaf-vein" x1="32" y1="14" x2="32" y2="33" />
    <path class="air-wave" d="M 18 37 C 24 34 30 39 36 36 C 41 33 46 36 50 35" />
    <path class="air-wave-accent" d="M 14 44 C 21 40 28 46 35 43 C 41 40 47 44 53 43" />
    <path class="air-wave" d="M 19 51 C 25 48 31 53 37 50 C 42 47 46 50 49 50" />
  </g>

  <!-- Right: Wordmark + Tagline -->
  <text class="brand-title" x="76" y="31">Urban Air Quality Assistant</text>
  <text class="brand-tagline" x="76" y="48">Breathe smarter</text>
</svg>`;

// ---------------------------------------------------------------------------
// 2. Open Graph SVG (1200 x 630)
// ---------------------------------------------------------------------------

export const ogImageSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="ogBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#08283E" />
      <stop offset="100%" stop-color="#0B3B5A" />
    </linearGradient>
    <linearGradient id="ogLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10B981" />
      <stop offset="100%" stop-color="#0F766E" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.35" />
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#ogBg)" />

  <!-- Ambient decorative glow circles -->
  <circle cx="1100" cy="100" r="320" fill="#0F766E" opacity="0.25" />
  <circle cx="150" cy="550" r="280" fill="#10B981" opacity="0.12" />

  <!-- Center Card Container -->
  <g transform="translate(140, 115)">
    <!-- Big Logo Mark (200x200) with subtle shadow -->
    <g transform="translate(0, 50)" filter="url(#shadow)">
      <rect x="0" y="0" width="200" height="200" rx="44" fill="#0B3B5A" stroke="#10B981" stroke-width="4" />
      <path d="M 50 82 C 44 69 56 54 72 57 C 82 44 100 44 110 54 C 122 51 135 60 132 75 C 141 82 141 94 128 100 C 119 104 53 104 50 82 Z" fill="#94A3B8" opacity="0.35" />
      <!-- Leaf -->
      <path d="M 100 35 C 65 60 53 85 69 110 C 85 100 115 100 131 110 C 147 85 135 60 100 35 Z" fill="url(#ogLeafGrad)" />
      <line x1="100" y1="44" x2="100" y2="103" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round" opacity="0.9" />
      <!-- Air Waves -->
      <path d="M 56 116 C 75 106 94 122 113 113 C 129 104 144 113 156 110" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round" fill="none" />
      <path d="M 44 138 C 66 125 88 144 110 135 C 129 125 147 138 166 135" stroke="#10B981" stroke-width="10" stroke-linecap="round" fill="none" />
      <path d="M 60 160 C 79 150 97 166 116 156 C 132 147 144 156 153 156" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round" fill="none" />
    </g>

    <!-- Content on right -->
    <g transform="translate(260, 55)">
      <!-- Badge pill -->
      <rect x="0" y="0" width="290" height="38" rx="19" fill="#0F766E" opacity="0.9" />
      <text x="145" y="24" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="700" fill="#E2E8F0" letter-spacing="1">CLEAN AIR PLATFORM</text>

      <!-- App Name -->
      <text x="0" y="90" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="44" font-weight="800" fill="#FFFFFF">Urban Air Quality</text>
      <text x="0" y="142" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="44" font-weight="800" fill="#34D399">Assistant</text>

      <!-- Tagline & Short Description -->
      <text x="0" y="196" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="600" fill="#94A3B8">Breathe smarter</text>
      <text x="0" y="235" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="400" fill="#CBD5E1">GenAI smog defense for families &amp; communities</text>

      <!-- Subtitle pills -->
      <g transform="translate(0, 270)">
        <rect x="0" y="0" width="135" height="34" rx="17" fill="#1E293B" stroke="#334155" stroke-width="1" />
        <text x="67" y="22" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="600" fill="#94A3B8">Live AQI</text>

        <rect x="145" y="0" width="145" height="34" rx="17" fill="#1E293B" stroke="#334155" stroke-width="1" />
        <text x="217" y="22" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="600" fill="#94A3B8">Google Gemini</text>

        <rect x="300" y="0" width="170" height="34" rx="17" fill="#1E293B" stroke="#334155" stroke-width="1" />
        <text x="385" y="22" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="600" fill="#94A3B8">Indoor Smog Hacks</text>
      </g>
    </g>
  </g>
</svg>`;
