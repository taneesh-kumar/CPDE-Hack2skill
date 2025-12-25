import { Alert, Box, Chip, Paper, Stack, Typography } from '@mui/material'
import { useGridSummary } from '../state/useGridSummary.js'

export default function AlertsHub() {
  const summary = useGridSummary()

  return (
    <Stack spacing={2.5}>
      <Typography variant="h4" sx={{ fontWeight: 900 }}>
        Alerts & Education Hub
      </Typography>

      <Alert severity={summary.redZones > 0 ? 'error' : summary.yellowZones > 0 ? 'warning' : 'success'}>
        {summary.redZones > 0
          ? `Red Zones detected: ${summary.redZones}. Act today in the specific zones.`
          : summary.yellowZones > 0
            ? `Yellow Zones detected: ${summary.yellowZones}. Plan a quick check this week.`
            : 'All zones look stable today. Keep monitoring.'}
      </Alert>

      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <Typography variant="h6" sx={{ fontWeight: 900 }}>
          Doctor’s Prescription (simple actions)
        </Typography>

        <Stack spacing={2} sx={{ mt: 2 }}>
          <Prescription
            level="Yellow"
            color="warning"
            what="What to do if Yellow?"
            steps={[
              'Check irrigation nozzles / drip lines for partial blockage.',
              'Walk the zone edges — look for puddling or dry patches.',
              'If you use fertilizer, confirm it was applied evenly.',
            ]}
          />

          <Prescription
            level="Red"
            color="error"
            what="What to do if Red?"
            steps={[
              'Spot-test soil pH and EC in that zone (not the whole field).',
              'If soil is acidic, consider lime only for that zone (as advised locally).',
              'Check for waterlogging or shade differences — fix the cause first.',
            ]}
          />
        </Stack>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography sx={{ fontWeight: 900 }}>How CPDE decides</Typography>
        <Typography sx={{ color: 'text.secondary', fontWeight: 600, mt: 0.5 }}>
          CPDE watches variance — how different small parts of your field are becoming. Big differences early can
          become visible stress later.
        </Typography>
      </Paper>
    </Stack>
  )
}

function Prescription({ level, color, what, steps }) {
  return (
    <Box>
      <Stack direction="row" spacing={1} alignItems="center">
        <Chip label={level} color={color} sx={{ fontWeight: 900 }} />
        <Typography sx={{ fontWeight: 900 }}>{what}</Typography>
      </Stack>
      <Stack spacing={0.75} sx={{ mt: 1 }}>
        {steps.map((s) => (
          <Typography key={s} sx={{ fontWeight: 650, color: 'text.secondary' }}>
            • {s}
          </Typography>
        ))}
      </Stack>
    </Box>
  )
}
