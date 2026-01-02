import { Box, Stack, Typography } from '@mui/material'
import RiskTrendChart from '../widgets/RiskTrendChart.jsx'
import { useGridSummary } from '../state/useGridSummary.js'

export default function RiskAnalysisTrends() {
  const summary = useGridSummary()

  return (
    <Stack spacing={{ xs: 2, md: 2.5 }}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 950, letterSpacing: -0.2 }}>
          Risk Analysis Trends
        </Typography>
        <Typography sx={{ mt: 0.25, color: 'text.secondary', fontWeight: 700 }}>
          Variance-based risk trend over the last 30 days.
        </Typography>
      </Box>

      <RiskTrendChart
        points={summary.last30VarianceScores}
        height={{ xs: 300, sm: 380, md: 480 }}
      />
    </Stack>
  )
}
