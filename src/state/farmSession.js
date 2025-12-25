import { db } from '../config/firebase.js'
import { push, ref, serverTimestamp, set } from 'firebase/database'

const LS_FARM_ID = 'cpde:farmId'

export function getCurrentFarmId() {
  try {
    return localStorage.getItem(LS_FARM_ID)
  } catch {
    return null
  }
}

export function setCurrentFarmId(farmId) {
  try {
    localStorage.setItem(LS_FARM_ID, farmId)
  } catch {
    // ignore
  }
}

export async function registerFarm({ farmerName, farmName, cropType, polygon }) {
  if (!db) throw new Error('Firebase is not configured.')
  if (!farmerName?.trim() || !farmName?.trim() || !cropType) throw new Error('Missing registration fields.')
  if (!Array.isArray(polygon) || polygon.length < 3) throw new Error('Field polygon is required.')

  const farmsRef = ref(db, 'cpde/v1/farms')
  const newFarmRef = push(farmsRef)
  const farmId = newFarmRef.key

  const payload = {
    profile: {
      farmerName: farmerName.trim(),
      farmName: farmName.trim(),
      cropType,
      createdAt: serverTimestamp(),
    },
    field: {
      polygon,
      updatedAt: serverTimestamp(),
    },
    grid: {
      size: 8,
      cells: {},
      updatedAt: serverTimestamp(),
    },
    variance: {
      last30: [],
      updatedAt: serverTimestamp(),
    },
  }

  await set(ref(db, `cpde/v1/farms/${farmId}`), payload)
  setCurrentFarmId(farmId)
  return farmId
}
