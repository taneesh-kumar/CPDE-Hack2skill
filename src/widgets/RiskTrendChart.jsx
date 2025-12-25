import { Paper, Stack, Typography } from '@mui/material'
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

export default function RiskTrendChart({ points }) {
  const data = {
    labels: (points || []).map((_, i) => `${i - (points.length - 1)}d`),
    datasets: [
      {
        label: 'Variance Score',
        data: points || [],
        borderColor: '#1B5E20',
        backgroundColor: 'rgba(27, 94, 32, 0.15)',
        tension: 0.25,
        pointRadius: 2,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: { color: '#2B3A2E', font: { weight: '600' } },
      },
      x: {
        ticks: { color: '#2B3A2E', font: { weight: '600' } },
      },
    },
  }

  return (
    <Paper sx={{ p: 2.5, height: '100%' }}>
      <Stack spacing={1.25} sx={{ height: '100%' }}>
        <Typography sx={{ fontWeight: 900 }}>Risk Trend (Last 30 Days)</Typography>
        <Typography sx={{ color: 'text.secondary', fontWeight: 650 }}>
          Higher score = more uneven field conditions.
        </Typography>
        <div style={{ position: 'relative', height: 280 }}>
          <Line data={data} options={options} />
        </div>
      </Stack>
    </Paper>
  )
}
