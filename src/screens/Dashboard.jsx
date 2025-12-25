import { Alert, Box, Button, Grid, Paper, Stack, Typography } from '@mui/material'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import DidYouKnowCard from '../widgets/DidYouKnowCard.jsx'
import RiskTrendChart from '../widgets/RiskTrendChart.jsx'
import { useGridSummary } from '../state/useGridSummary.js'

export default function Dashboard() {
  const navigate = useNavigate()
  const summary = useGridSummary()

  const greeting = useMemo(() => {
    const name = summary.farmerName || 'Farmer'
    const level = summary.riskLevel || 'Low'
    return `Good Morning, ${name}. Your field risk is ${level} today.`
  }, [summary.farmerName, summary.riskLevel])

  return (
    <Stack spacing={2.5}>
      <Typography variant="h4" sx={{ fontWeight: 900 }}>
        Command Center
      </Typography>

      {summary.redZones > 0 && (
        <Alert
          severity="error"
          sx={{
            fontWeight: 800,
            '& .MuiAlert-message': { width: '100%' },
            animation: 'cpdePulse 1s infinite',
            '@keyframes cpdePulse': {
              '0%': { filter: 'brightness(1)' },
              '50%': { filter: 'brightness(1.15)' },
              '100%': { filter: 'brightness(1)' },
            },
          }}
        >
          Critical zones detected: {summary.redZones}. Tap “Open Satellite Grid” to see where.
        </Alert>
      )}

      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <Typography sx={{ fontWeight: 900, fontSize: 18 }}>{greeting}</Typography>
        <Typography sx={{ color: 'text.secondary', fontWeight: 600, mt: 0.5 }}>
          Variance Score tracks how uneven your field is becoming.
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 2 }}>
          <Button variant="contained" color="primary" onClick={() => navigate('/analysis')}>
            Open Satellite Grid
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => navigate('/alerts')}>
            Alerts & Education
          </Button>
        </Stack>
      </Paper>

      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <RiskTrendChart points={summary.last30VarianceScores} />
        </Grid>
        <Grid item xs={12} md={5}>
          <DidYouKnowCard />
        </Grid>
      </Grid>

      <Paper sx={{ p: 2 }}>
        <Typography sx={{ fontWeight: 900 }}>Today’s quick checklist</Typography>
        <Typography sx={{ color: 'text.secondary', fontWeight: 600, mt: 0.5 }}>
          Walk to the most different-looking corner first. Small differences grow fast.
        </Typography>
      </Paper>
    </Stack>
  )
}
