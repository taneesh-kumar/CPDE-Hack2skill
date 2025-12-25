import { Box, Button, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FieldBoundaryMap from '../widgets/FieldBoundaryMap.jsx'
import { registerFarm } from '../state/farmSession.js'
import { seedFarmData } from '../state/seedFarmData.js'

const CROPS = ['Rice', 'Corn', 'Wheat', 'Soybean', 'Cotton', 'Vegetables']

export default function Register() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [farmName, setFarmName] = useState('')
  const [cropType, setCropType] = useState('Rice')
  const [polygon, setPolygon] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const canSubmit = useMemo(() => {
    return name.trim() && farmName.trim() && cropType && polygon?.length >= 3
  }, [name, farmName, cropType, polygon])

  async function onSubmit() {
    setError('')
    setSubmitting(true)
    try {
      const farmId = await registerFarm({
        farmerName: name,
        farmName,
        cropType,
        polygon,
      })

      // Hackathon-friendly: seed the new farm with synthetic grid + variance
      // so the dashboard/analysis is immediately useful.
      await seedFarmData(farmId, { gridSize: 8 })

      navigate('/dashboard')
    } catch (e) {
      setError(e?.message || 'Registration failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Stack spacing={2.5}>
      <Typography variant="h4" sx={{ fontWeight: 900 }}>
        Farmer Registration
      </Typography>
      <Typography sx={{ color: 'text.secondary', fontWeight: 600 }}>
        Tell us your crop, then draw your field boundary. CPDE will analyze your exact land.
      </Typography>

      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <Stack spacing={2}>
          <TextField label="Your Name" value={name} onChange={(e) => setName(e.target.value)} />
          <TextField label="Farm Name" value={farmName} onChange={(e) => setFarmName(e.target.value)} />
          <TextField
            select
            label="Crop Type"
            value={cropType}
            onChange={(e) => setCropType(e.target.value)}
          >
            {CROPS.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </TextField>

          <Box sx={{ mt: 1 }}>
            <Typography sx={{ fontWeight: 900, mb: 1 }}>Magic Step: Draw your field</Typography>
            <Typography sx={{ color: 'text.secondary', fontWeight: 600, mb: 1.5 }}>
              Tap points around your field boundary. When finished, press “Save Field”.
            </Typography>
            <FieldBoundaryMap onPolygonChanged={setPolygon} />
          </Box>

          <Button variant="contained" color="primary" disabled={!canSubmit} onClick={onSubmit}>
            {submitting ? 'Saving…' : 'Save & Start Analysis'}
          </Button>

          {error && (
            <Paper
              sx={{ p: 1.25, border: 1, borderColor: 'divider', bgcolor: 'background.paper' }}
              variant="outlined"
            >
              <Typography sx={{ fontWeight: 800, color: 'error.main' }}>{error}</Typography>
            </Paper>
          )}
        </Stack>
      </Paper>
    </Stack>
  )
}
