import { Box, Button, Paper, Stack, Typography } from '@mui/material'
import { useEffect, useMemo, useRef, useState } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet-draw'

const DEFAULT_CENTER = [20.5937, 78.9629] // India
const MIN_POINTS = 3
const MAX_POINTS = 6

export default function FieldBoundaryMap({ onPolygonChanged }) {
  const fgRef = useRef(null)
  const [status, setStatus] = useState('Tap the polygon tool, then draw your field.')

  const tileUrl = useMemo(() => {
    return import.meta.env.VITE_OSM_TILE_URL || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  }, [])

  function clearPolygon() {
    fgRef.current?.clearLayers()
    onPolygonChanged?.(null)
    setStatus('Cleared. Draw again.')
  }

  function emitPolygon(layer) {
    try {
      const latLngs = layer.getLatLngs?.()
      const ring = Array.isArray(latLngs?.[0]) ? latLngs[0] : latLngs
      const raw = ring || []

      if (raw.length > MAX_POINTS) {
        const clamped = raw.slice(0, MAX_POINTS)
        // Enforce max points even if user tries to edit-add more vertices.
        if (Array.isArray(latLngs?.[0])) {
          layer.setLatLngs([clamped])
        } else {
          layer.setLatLngs(clamped)
        }
        layer.redraw?.()
        setStatus(`Maximum ${MAX_POINTS} points allowed. Extra points were removed.`)
      }

      const latLngsAfter = layer.getLatLngs?.()
      const ringAfter = Array.isArray(latLngsAfter?.[0]) ? latLngsAfter[0] : latLngsAfter
      const pts = (ringAfter || []).map((p) => ({ lat: p.lat, lng: p.lng }))

      onPolygonChanged?.(pts.length >= MIN_POINTS ? pts : null)

      if (pts.length < MIN_POINTS) {
        setStatus(`Add at least ${MIN_POINTS} points to form a valid field boundary.`)
      } else if (pts.length >= MIN_POINTS && pts.length <= MAX_POINTS) {
        setStatus(`Field captured (${pts.length} points).`)
      }
    } catch {
      setStatus('Could not read polygon. Try again.')
    }
  }

  return (
    <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 3 }}>
      <Stack spacing={1}>
        <Box
          sx={{
            height: { xs: 320, md: 380 },
            width: '100%',
            borderRadius: 2.5,
            overflow: 'hidden',
            bgcolor: 'grey.100',
          }}
        >
          <MapContainer
            center={DEFAULT_CENTER}
            zoom={5}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom
          >
            <TileLayer
              url={tileUrl}
              attribution='&copy; OpenStreetMap contributors'
            />

            <LeafletDrawController
              fgRef={fgRef}
              onCreated={(layer) => {
                emitPolygon(layer)
              }}
              onEdited={(layer) => {
                emitPolygon(layer)
              }}
              onStatus={(s) => setStatus(s)}
            />
          </MapContainer>
        </Box>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ sm: 'center' }}>
          <Typography sx={{ fontWeight: 700, color: 'text.secondary', flex: 1 }}>{status}</Typography>
          <Button variant="outlined" color="secondary" onClick={clearPolygon}>
            Clear
          </Button>
        </Stack>
      </Stack>
    </Paper>
  )
}

function LeafletDrawController({ fgRef, onCreated, onEdited, onStatus }) {
  const map = useMap()

  useEffect(() => {
    // Feature group to hold the polygon
    const fg = new L.FeatureGroup()
    fgRef.current = fg
    map.addLayer(fg)

    // Track the active polygon layer so we can allow adding points after creation.
    let activePolygonLayer = null

    const drawControl = new L.Control.Draw({
      position: 'topright',
      draw: {
        polyline: false,
        rectangle: false,
        circle: false,
        circlemarker: false,
        marker: false,
        polygon: {
          allowIntersection: false,
          showArea: true,
          maxPoints: MAX_POINTS,
          shapeOptions: {
            color: '#1B5E20',
            weight: 2,
            fillOpacity: 0.18,
          },
        },
      },
      edit: {
        featureGroup: fg,
        edit: {
          selectedPathOptions: {
            color: '#1B5E20',
            weight: 3,
            fillOpacity: 0.22,
          },
        },
        remove: false,
      },
    })

    map.addControl(drawControl)
    onStatus?.('Tap the polygon tool, then draw your field.')

    const onDrawCreated = (e) => {
      // Keep only one polygon at a time
      fg.clearLayers()
      fg.addLayer(e.layer)
      activePolygonLayer = e.layer
      onCreated?.(e.layer)
      onStatus?.(`Field captured. Use ${MIN_POINTS}–${MAX_POINTS} points.`)
    }

    const onDrawEdited = (e) => {
      e.layers.eachLayer((layer) => {
        activePolygonLayer = layer
        onEdited?.(layer)
      })
      onStatus?.('Field updated.')
    }

    const isPolygonDrawModeActive = () => {
      try {
        const handler = drawControl?._toolbars?.draw?._modes?.polygon?.handler
        return typeof handler?.enabled === 'function' ? handler.enabled() : false
      } catch {
        return false
      }
    }

    const getRingLatLngs = (layer) => {
      const latLngs = layer?.getLatLngs?.()
      return Array.isArray(latLngs?.[0]) ? latLngs[0] : latLngs
    }

    const onMapClick = (e) => {
      // If user is actively drawing, let leaflet-draw handle clicks.
      if (isPolygonDrawModeActive()) return
      if (!activePolygonLayer) return

      // If layer was cleared externally, stop tracking it.
      if (typeof fg?.hasLayer === 'function' && !fg.hasLayer(activePolygonLayer)) {
        activePolygonLayer = null
        return
      }

      const ring = getRingLatLngs(activePolygonLayer) || []

      if (ring.length >= MAX_POINTS) {
        onStatus?.(`Maximum ${MAX_POINTS} points reached.`)
        return
      }

      const nextRing = [...ring, e.latlng]
      activePolygonLayer.setLatLngs([nextRing])
      activePolygonLayer.redraw?.()
      onEdited?.(activePolygonLayer)
      onStatus?.(`Point added (${nextRing.length}/${MAX_POINTS}).`)
    }

    map.on(L.Draw.Event.CREATED, onDrawCreated)
    map.on(L.Draw.Event.EDITED, onDrawEdited)
    map.on('click', onMapClick)

    return () => {
      map.off(L.Draw.Event.CREATED, onDrawCreated)
      map.off(L.Draw.Event.EDITED, onDrawEdited)
      map.off('click', onMapClick)
      map.removeControl(drawControl)
      map.removeLayer(fg)
      fgRef.current = null
      activePolygonLayer = null
    }
  }, [fgRef, map, onCreated, onEdited, onStatus])

  return null
}
