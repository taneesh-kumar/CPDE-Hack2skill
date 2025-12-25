# CPDE — Google Earth Engine backend (Python)

This folder is the **hackathon-ready placeholder** for the Google Earth Engine (GEE) pipeline.

## Goal
When a farmer draws and saves a field polygon, CPDE should:

1. Persist the polygon (Firebase).
2. Trigger a backend job.
3. Use **GEE Python API** to fetch:
   - Terrain/slope
   - Historical rainfall aggregates
4. Store derived “ground truth” features back to Firebase for the risk engine.

## Suggested deployment
- **Firebase Cloud Functions** (HTTP trigger) calling a containerized Python service, or
- **Cloud Run** Python service triggered by Firebase/HTTP.

## Files
- `gee_fetch_ground_truth.py`: Example structure and TODOs.

## Notes
- GEE requires authentication + project setup. Keep credentials server-side.
