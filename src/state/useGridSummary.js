import { useEffect, useMemo, useState } from 'react'
import { onValue, ref } from 'firebase/database'
import { db } from '../config/firebase.js'
import { getCurrentFarmId } from './farmSession.js'

// Minimal state hook for demo.
// Expected DB shape (example):
// /cpde/demo/grid
//   size: 8
//   cells:
//     A1: { level: 'green'|'yellow'|'red', signal: '...', suggestedAction: '...' }
// /cpde/demo/variance/last30: [number...]
export function useGridSummary() {
  const [grid, setGrid] = useState(null)
  const [variance, setVariance] = useState(null)
  const [profileName, setProfileName] = useState(null)

  const farmId = useMemo(() => getCurrentFarmId(), [])

  useEffect(() => {
    if (!db || !farmId) return undefined

    const offGrid = onValue(ref(db, `cpde/v1/farms/${farmId}/grid`), (snap) => setGrid(snap.val()))
    const offVar = onValue(ref(db, `cpde/v1/farms/${farmId}/variance/last30`), (snap) => setVariance(snap.val()))
    const offName = onValue(ref(db, `cpde/v1/farms/${farmId}/profile/farmerName`), (snap) => setProfileName(snap.val()))

    return () => {
      offGrid()
      offVar()
      offName()
    }
  }, [farmId])

  return useMemo(() => {
    const cells = grid?.cells || {}
    const levels = Object.values(cells).map((c) => c?.level)
    const redZones = levels.filter((l) => l === 'red').length
    const yellowZones = levels.filter((l) => l === 'yellow').length

    const riskLevel = redZones > 0 ? 'High' : yellowZones > 0 ? 'Medium' : 'Low'

    return {
      farmerName: profileName || 'Farmer',
      riskLevel,
      redZones,
      yellowZones,
      last30VarianceScores: Array.isArray(variance) ? variance : makeDemoVariance(),
    }
  }, [grid, variance, profileName])
}

function makeDemoVariance() {
  // calm synthetic data so UI looks alive before wiring TF.js stream
  const out = []
  for (let i = 0; i < 30; i += 1) {
    out.push(Math.round(35 + 10 * Math.sin(i / 4) + (i > 20 ? 8 : 0)))
  }
  return out
}
