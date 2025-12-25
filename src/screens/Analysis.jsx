import { Box, Paper, Stack, Typography } from '@mui/material'
import GridMap from '../widgets/GridMap.jsx'

export default function Analysis() {
  return (
    <Stack spacing={2}>
      <Typography variant="h4" sx={{ fontWeight: 900 }}>
        Satellite Grid Analysis
      </Typography>
      <Typography sx={{ color: 'text.secondary', fontWeight: 600 }}>
        Green = stable, Yellow = warning, Red = critical. Tap a zone to see the suggested action.
      </Typography>

      <Paper sx={{ p: 1.5 }}>
        <Box sx={{ height: { xs: '70vh', md: '72vh' } }}>
          <GridMap gridSize={8} />
        </Box>
      </Paper>
    </Stack>
  )
}
