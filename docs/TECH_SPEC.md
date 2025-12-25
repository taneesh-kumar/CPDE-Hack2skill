# CPDE — Technical Specification (Hackathon Edition)

## Product definition
**Crop Failure Pre‑Cause Detection Engine (CPDE)** detects *pre-conditions* that cause crop failure (soil micro‑variability, nutrient lock‑in, micro‑climate divergence) **weeks before visible symptoms**.

### Primary user
- Non-technical farmer
- Outdoor usage → high contrast, big touch targets, minimal steps

## End-to-end architecture (Google-native)

### Frontend (this repo)
- **React (Vite)** UI
- **Material UI (MUI)** for “Green Agricultural Sector” theme
- **Leaflet + OpenStreetMap tiles** (100% free, no card)
  - Field boundary drawing (leaflet-draw)
  - NxN grid overlay using Leaflet rectangles (grid cells)
- **Firebase Realtime Database** for live grid + sensor stream
- **TensorFlow.js** in-browser to compute a “Variance Score”
- **Gemini API** for plain-English explanations (hackathon-friendly; proxy for production)

### Backend (scaffolded)
- **Google Earth Engine (Python API)** fetches terrain/rainfall ground truth per polygon
  - Intended target: Cloud Run / Cloud Functions (server-side auth)

## Data model (Firebase RTDB)
Suggested RTDB paths (demo in code uses `/cpde/demo/...`):

- `/cpde/{farmId}/profile`
  - `farmerName`, `farmName`, `cropType`
- `/cpde/{farmId}/field/polygon`
  - `[ { lat, lng }, ... ]`
- `/cpde/{farmId}/grid`
  - `size`: number
  - `cells`:
    - `A1`: `{ level: 'green'|'yellow'|'red', signal: string, suggestedAction: string }`
- `/cpde/{farmId}/sensors/latest`
  - Per-zone simulated sensors (moisture, pH, EC, temp, etc.)
- `/cpde/{farmId}/variance/last30`
  - `[0..100]` time series for chart
- `/cpde/{farmId}/groundTruth`
  - `terrain` (slope stats)
  - `rainfall` aggregates

## Core algorithms

### Variance Score (frontend)
`src/ml/varianceRisk.js`
- Computes coefficient of variation (std/mean) for a window of sensor values.
- Adds a small penalty if variance is increasing vs previous window.
- Maps to 0..100 and labels Low/Medium/High.

### Grid classification
- Map `Variance Score` per zone to:
  - `green` < 40
  - `yellow` 40–69
  - `red` ≥ 70

## Security notes
- Firebase client config is okay in frontend, but enforce RTDB rules.
- Gemini API key: **demo only** in browser. For production, route via a backend.
- GEE credentials: **server-side only**.

## Project structure (recommended)

```
cpde/
  public/
    hero-field.svg
  src/
    components/
      AppShell.jsx
    config/
      firebase.js
      gemini.js
    content/
      educationCards.js
    ml/
      varianceRisk.js
    routes/
      routes.jsx
    screens/
      Landing.jsx
      Register.jsx
      Dashboard.jsx
      Analysis.jsx
      AlertsHub.jsx
    state/
      useGridSummary.js
    theme/
      cpdeTheme.js
    widgets/
      FieldBoundaryMap.jsx
      GridMap.jsx
      DidYouKnowCard.jsx
      RiskTrendChart.jsx
  backend/
    gee/
      gee_fetch_ground_truth.py
      README.md
  docs/
    TECH_SPEC.md
    UI_UX_GUIDE.md
  .env.example
```

## Local run
1. Copy `.env.example` → `.env` and fill keys.
2. Start dev server: `npm run dev`

## Next implementation steps (high-value)
1. Save registration polygon to RTDB and load it in `GridMap`.
2. Stream zone sensors from RTDB and compute variance per zone.
3. Persist computed `cells` + `variance/last30` back to RTDB.
4. Replace demo farm path with authenticated farmId.
