import { Box, Paper, Stack, Typography, useTheme } from '@mui/material'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend)

export default function RiskTrendChart({ points, height }) {
  const theme = useTheme()

  const safeMax = 40
  const moderateMax = 70

  const data = {
    labels: (points || []).map((_, i) => `Day ${i + 1}`),
    datasets: [
      {
        label: 'Variance Score',
        data: points || [],
        borderColor: theme.palette.primary.main,
        backgroundColor: 'rgba(31, 122, 77, 0.14)',
        tension: 0.25,
        pointRadius: 2,
      },
    ],
  }

  const thresholdBands = {
    id: 'cpdeThresholdBands',
    beforeDraw(chart) {
      const { ctx, chartArea, scales } = chart
      if (!chartArea) return

      const { left, right, top, bottom } = chartArea
      const y = scales.y
      if (!y) return

      const y0 = y.getPixelForValue(0)
      const ySafeMax = y.getPixelForValue(safeMax)
      const yModerateMax = y.getPixelForValue(moderateMax)
      const yMax = y.getPixelForValue(100)

      ctx.save()
      // Green (safe)
      ctx.fillStyle = 'rgba(31, 122, 77, 0.08)'
      ctx.fillRect(left, ySafeMax, right - left, y0 - ySafeMax)

      // Yellow (moderate)
      ctx.fillStyle = 'rgba(249, 168, 37, 0.08)'
      ctx.fillRect(left, yModerateMax, right - left, ySafeMax - yModerateMax)

      // Red (critical)
      ctx.fillStyle = 'rgba(209, 67, 67, 0.08)'
      ctx.fillRect(left, yMax, right - left, yModerateMax - yMax)

      // Subtle outline
      ctx.strokeStyle = 'rgba(0,0,0,0.06)'
      ctx.strokeRect(left, top, right - left, bottom - top)
      ctx.restore()
    },
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label(context) {
            const v = typeof context.parsed?.y === 'number' ? context.parsed.y : Number(context.raw) || 0
            return `${context.label} – Variance: ${Math.round(v)} (Uneven moisture detected)`
          },
        },
      },
    },
    scales: {
      y: {
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: { color: theme.palette.text.secondary, font: { weight: '700' } },
        title: {
          display: true,
          text: 'Variance Score',
          color: theme.palette.text.secondary,
          font: { weight: '800' },
        },
      },
      x: {
        ticks: { color: theme.palette.text.secondary, font: { weight: '700' } },
      },
    },
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 0,
        height: '100%',
        borderRadius: '14px',
        overflow: 'hidden',
        boxSizing: 'border-box',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box sx={{ p: { xs: 2.5, md: 3 }, height: '100%', boxSizing: 'border-box', width: '100%', overflow: 'hidden' }}>
        <Stack spacing={3} sx={{ height: '100%' }}>
          <Stack spacing={1}>
            <Typography sx={{ fontWeight: 900 }}>Risk Trend (Last 30 Days)</Typography>
            <Typography sx={{ color: 'text.secondary', fontWeight: 650 }}>
              Higher score = more uneven field conditions.
            </Typography>
          </Stack>

          <Box
            sx={{
              position: 'relative',
              height: height || { xs: 260, sm: 300, md: 360 },
              overflow: 'hidden',
            }}
          >
            <Line data={data} options={options} plugins={[thresholdBands]} />
          </Box>
        </Stack>
      </Box>
    </Paper>
  )
}
