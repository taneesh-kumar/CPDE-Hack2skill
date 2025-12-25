# CPDE — Crop Failure Pre‑Cause Detection Engine

CPDE helps farmers detect early risk signals (moisture stress, uneven plant health, micro‑variability) **weeks before visible symptoms**.

This repository contains a hackathon-friendly frontend built with React + Vite, plus a backend scaffold for Google Earth Engine (GEE) ground‑truth extraction.

## What’s inside

- Farmer registration + field boundary drawing (polygon)
- NxN grid overlay (zones A1…H8) colored by risk level
- Firebase Realtime Database (RTDB) as the live data source
- Per-zone NDVI/moisture values + field averages (demo data seeding included)
- “Plain English” explanations for critical zones using the Gemini API
- Risk trend chart (variance / score history)

## Tech stack

- Frontend: React (Vite), React Router, MUI
- Maps (this repo): Leaflet + OpenStreetMap tiles via react-leaflet + leaflet-draw
- Data: Firebase Realtime Database
- AI explanations: Gemini via @google/genai
- ML/scoring: TensorFlow.js (frontend)
- Charts: Chart.js + react-chartjs-2

## Maps: Leaflet here, Google Maps in the real project

This GitHub repo uses **Leaflet + OpenStreetMap** to keep setup simple and avoid paid keys.

In the real/production project, the map provider is the **official Google Maps JavaScript API**.
In this repo, Google Maps is intentionally disabled (see `src/config/googleMaps.js`) and the app uses Leaflet.

## Google Earth Engine (GEE) ground truth

The folder `backend/gee/` is a scaffold for a server-side pipeline that:

1. Receives a saved field polygon
2. Fetches “ground truth” features from Earth Engine (e.g., slope, rainfall aggregates)
3. Writes derived features back to Firebase for the risk engine

Important: Earth Engine auth/credentials must be kept server-side (Cloud Run / Cloud Functions), not in the browser.

## Getting started

### Prerequisites

- Node.js 18+ recommended

### Install

```bash
npm install
```

### Run (dev)

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Environment variables

CPDE is a Vite project, so client env vars must be prefixed with `VITE_`.

Create a `.env.local` file in the project root:

```bash
# Firebase (Realtime Database)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_DATABASE_URL=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=

# Gemini (demo key in browser)
VITE_GEMINI_API_KEY=

# Optional: custom tile server (defaults to OpenStreetMap)
# VITE_OSM_TILE_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
```

### Firebase setup notes (RTDB)

- Create a Firebase project
- Enable **Realtime Database**
- Add a **Web App** and copy its config values into the `VITE_FIREBASE_*` variables

The app writes/reads farm data under:

- `cpde/v1/farms/{farmId}/profile`
- `cpde/v1/farms/{farmId}/field/polygon`
- `cpde/v1/farms/{farmId}/grid/cells`
- `cpde/v1/farms/{farmId}/variance/last30`

If Firebase env vars are missing, the UI may still load, but registration and live data features will be limited.

### Gemini API notes

- Set `VITE_GEMINI_API_KEY` to enable “Plain English explanation” generation for critical (red) zones.
- This repo calls Gemini directly from the browser for demo speed.
- For production, proxy Gemini calls through a backend to protect keys and enforce rate limits.

## Running the Earth Engine scaffold (optional)

The current backend script is intentionally a placeholder and prints a sample output:

```bash
python backend/gee/gee_fetch_ground_truth.py
```

## Project structure

```
cpde/
  backend/
    gee/
      gee_fetch_ground_truth.py
      README.md
  docs/
    TECH_SPEC.md
    UI_UX_GUIDE.md
  src/
    config/
      firebase.js
      gemini.js
      googleMaps.js
    screens/
    state/
    widgets/
```

## Scripts

- `npm run dev` — start Vite dev server
- `npm run build` — production build
- `npm run preview` — preview production build
- `npm run lint` — run ESLint

## Docs

- Technical spec: `docs/TECH_SPEC.md`
- UI/UX guide: `docs/UI_UX_GUIDE.md`# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
