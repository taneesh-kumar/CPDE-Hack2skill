# CPDE — UI/UX Design Guide (Zero‑Cognitive Load)

## Design principles
- **Zero-cognitive load:** single-purpose screens, plain language, no hidden menus.
- **Outdoor readability:** high contrast, larger typography, large touch targets.
- **Action-first:** every alert includes a next step (“do this now”).

## Visual style (“Green Agricultural Sector”)
- Primary: deep crop green (MUI primary)
- Secondary: earthy brown (MUI secondary)
- Background: clean white
- Status colors: green/yellow/red with strong text contrast

## Required screens & UX behavior

### Screen A — Landing (Pre‑Login)
- Hero image + headline
  - Headline: “Detect the Invisible. Save the Harvest.”
  - Subtext: “Don’t wait for yellow leaves. See nutrient lock‑in and moisture stress 3 weeks early.”
- CTAs (large): “Farmer Login” and “New Registration”
- Trust signals: “Powered by Google Earth Engine”, “Secure Data”

### Screen B — Registration & Onboarding
- Inputs: Name, Farm Name, Crop Type
- “Magic step”: draw field boundary on map
- On save:
  - Persist polygon
  - Trigger backend job (GEE)

### Screen C — Dashboard (“Command Center”)
- Greeting: “Good Morning, [Farmer Name]. Your field risk is [Low/Medium/High] today.”
- Alert prominence:
  - If Red zones > 0 → show pulsing warning banner
- “Did You Know?” educational card (daily)
- “Risk Trend” chart for last 30 days

### Screen D — Satellite Grid Analysis
- Full map with NxN grid overlay
- Colors:
  - Green = stable
  - Yellow = warning
  - Red = critical
- Tap a cell → bottom sheet with:
  - “Zone B4 Risk: High”
  - Signal
  - Suggested Action
  - Plain English explanation (Gemini) for red zones

### Screen E — Alerts & Education Hub
- “Doctor’s Prescription” style
- Clear action list for Yellow vs Red

## Copy tone guidelines
- Use short sentences.
- Replace jargon with everyday words.
- Always include a calm next step.

## HCI checklist (5 concrete accessibility features)
1. **Large touch targets:** buttons default to >= 48px height.
2. **High-contrast typography:** dark text on white; bold section titles.
3. **Color + text redundancy:** risk shown as both color and label (Low/Medium/High).
4. **Minimal navigation:** primary tasks reachable in 1 tap from dashboard.
5. **Plain-English explanations:** alerts use simple wording + “Suggested Action”.

## Maps implementation
This build uses **Leaflet + OpenStreetMap** (no API key).
- Field drawing: leaflet-draw
- Grid overlay: NxN rectangles colored by Firebase stream
