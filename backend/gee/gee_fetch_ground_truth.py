"""CPDE — Google Earth Engine (GEE) ground-truth fetch (placeholder).

Inputs:
- field polygon coordinates (GeoJSON-like)

Outputs (write back to Firebase):
- slope stats
- rainfall stats

This file is intentionally a scaffold for hackathon iteration.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, List


@dataclass
class FieldPolygon:
    coordinates: List[List[float]]  # [[lng, lat], ...]


def fetch_ground_truth_for_polygon(field: FieldPolygon) -> Dict[str, Any]:
    """Fetch slope + rainfall aggregates for the polygon.

    TODO:
    - Initialize ee (Earth Engine)
    - Convert polygon to ee.Geometry.Polygon
    - Compute slope from SRTM/DEM
    - Compute rainfall aggregates (e.g., CHIRPS)
    - Return summary stats
    """

    # Example return shape expected by frontend/state layer.
    return {
        "terrain": {"slope_mean": None, "slope_p95": None},
        "rainfall": {"mm_30d": None, "mm_90d": None, "mm_365d": None},
    }


def main() -> None:
    # TODO: parse input from HTTP or queue
    example = FieldPolygon(
        coordinates=[
            [78.9624, 20.5939],
            [78.9637, 20.5939],
            [78.9637, 20.5931],
            [78.9624, 20.5931],
            [78.9624, 20.5939],
        ]
    )
    out = fetch_ground_truth_for_polygon(example)
    print(out)


if __name__ == "__main__":
    main()
