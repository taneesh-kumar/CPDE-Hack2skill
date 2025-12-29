import {
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded'
import ReportRoundedIcon from '@mui/icons-material/ReportRounded'
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded'
import TrendingFlatRoundedIcon from '@mui/icons-material/TrendingFlatRounded'
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DidYouKnowCard from '../widgets/DidYouKnowCard.jsx'
import RiskTrendChart from '../widgets/RiskTrendChart.jsx'
import { useGridSummary } from '../state/useGridSummary.js'

export default function Dashboard() {
  const navigate = useNavigate()
  const summary = useGridSummary()
  const theme = useTheme()
  const [now, setNow] = useState(() => new Date())
  const [checks, setChecks] = useState(() => ({
    uneven: false,
    nozzles: false,
    pressure: false,
    color: false,
  }))

  useEffect(() => {
    const intervalId = setInterval(() => setNow(new Date()), 60 * 1000)
    return () => clearInterval(intervalId)
  }, [])

  const greetingName = summary.farmerName || 'Farmer'
  const riskLabel = (summary.riskLevel || 'Low').toUpperCase()
  const riskScore = Math.round(Number(summary.riskScore) || 0)

  const greeting = useMemo(() => {
    const hour = now.getHours()
    if (hour >= 5 && hour < 12) return 'Good morning'
    if (hour >= 12 && hour < 17) return 'Good afternoon'
    if (hour >= 17 && hour < 21) return 'Good evening'
    return 'Good night'
  }, [now])

  const riskChipColor = useMemo(() => {
    if (riskLabel === 'HIGH') return 'error'
    if (riskLabel === 'MEDIUM' || riskLabel === 'MODERATE') return 'warning'
    return 'success'
  }, [riskLabel])

  const trendIcon = useMemo(() => {
    const t = summary.trendDirection || 'Stable'
    if (t === 'Rising') return <TrendingUpRoundedIcon fontSize="small" />
    if (t === 'Improving') return <TrendingDownRoundedIcon fontSize="small" />
    return <TrendingFlatRoundedIcon fontSize="small" />
  }, [summary.trendDirection])

  const trendLabel = summary.trendDirection || 'Stable'

  return (
    <Stack spacing={{ xs: 2, md: 2.5 }}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 950, letterSpacing: -0.2 }}>
          Command Center
        </Typography>
        <Typography id="help" sx={{ mt: 0.25, color: 'text.secondary', fontWeight: 700 }}>
          Data-first monitoring for early crop-failure risk signals.
        </Typography>
      </Box>

      {summary.redZones > 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 0,
            borderRadius: '14px',
            bgcolor: 'error.light',
            border: '1px solid',
            borderColor: 'rgba(209, 67, 67, 0.28)',
            overflow: 'hidden',
            boxSizing: 'border-box',
          }}
        >
          <Box sx={{ p: { xs: 2.5, md: 3 }, boxSizing: 'border-box' }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'flex-start', sm: 'center' }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ flex: 1, minWidth: 0 }}>
                <WarningAmberRoundedIcon sx={{ color: 'error.main' }} />
                <Typography sx={{ fontWeight: 900 }}>
                  Critical zones detected — tap “Open Satellite Grid” to inspect
                </Typography>
              </Stack>
              <Typography sx={{ fontSize: 12.5, fontWeight: 800, color: 'text.secondary' }}>
                Critical Zones: {summary.redZones}
              </Typography>
            </Stack>
          </Box>
        </Paper>
      )}

      <Paper
        elevation={0}
        sx={{
          p: 0,
          borderRadius: '14px',
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden',
          boxSizing: 'border-box',
          boxShadow: '0 6px 18px rgba(16,31,22,0.06)',
        }}
      >
        <Box sx={{ p: { xs: 2.5, md: 3 }, boxSizing: 'border-box', width: '100%', overflow: 'hidden' }}>
          <Stack spacing={3}>
            <Stack spacing={1}>
              <Typography sx={{ fontWeight: 950, fontSize: { xs: 18, md: 20 }, lineHeight: 1.15 }}>
                {greeting}, {greetingName}
              </Typography>
              <Typography sx={{ color: 'text.secondary', fontWeight: 700 }}>
                Higher score means more uneven field conditions
              </Typography>
            </Stack>

            <Divider />

            <Stack spacing={1}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.5}
                alignItems={{ xs: 'flex-start', sm: 'center' }}
              >
                <Typography sx={{ fontWeight: 950, fontSize: 16 }}>Today’s Field Risk</Typography>
                <Chip
                  label={riskLabel}
                  color={riskChipColor}
                  size="small"
                  sx={{
                    fontWeight: 950,
                    letterSpacing: 0.6,
                    px: 0.5,
                    borderRadius: '12px',
                    flex: '0 0 auto',
                  }}
                />
                <Typography sx={{ ml: { sm: 'auto' }, fontWeight: 950, color: 'text.primary' }}>
                  {riskScore}%
                </Typography>
              </Stack>

              <LinearProgress
                variant="determinate"
                value={Math.max(0, Math.min(100, riskScore))}
                sx={{
                  height: 10,
                  borderRadius: '12px',
                  bgcolor: 'rgba(0,0,0,0.05)',
                  overflow: 'hidden',
                  boxSizing: 'border-box',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: '12px',
                    backgroundColor:
                      riskChipColor === 'error'
                        ? theme.palette.error.main
                        : riskChipColor === 'warning'
                          ? theme.palette.warning.main
                          : theme.palette.success.main,
                  },
                }}
              />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ width: '100%' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/analysis')}
                startIcon={<GridViewRoundedIcon />}
                sx={{
                  fontWeight: 900,
                  flex: { sm: '1 1 0' },
                  minWidth: 0,
                  maxWidth: '100%',
                  width: { xs: '100%', sm: 'auto' },
                  whiteSpace: 'normal',
                  textAlign: 'center',
                  lineHeight: 1.2,
                }}
              >
                Open Satellite Grid
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => navigate('/alerts')}
                startIcon={<ReportRoundedIcon />}
                sx={{
                  fontWeight: 900,
                  flex: { sm: '1 1 0' },
                  minWidth: 0,
                  maxWidth: '100%',
                  width: { xs: '100%', sm: 'auto' },
                  whiteSpace: 'normal',
                  textAlign: 'center',
                  lineHeight: 1.2,
                }}
              >
                Alerts & Education
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Paper>

      <Box>
        <Typography sx={{ fontWeight: 950, mb: 1 }}>KPI Summary</Typography>
        <Box sx={{ overflowX: 'auto', pb: 0.5 }}>
          <Stack direction="row" spacing={1.5} sx={{ minWidth: 'max-content' }}>
            <KpiCard icon={<GridViewRoundedIcon fontSize="small" />} label="Total Zones" value={summary.totalZones || 0} />
            <KpiCard
              icon={<WarningAmberRoundedIcon fontSize="small" />}
              label="Critical Zones"
              value={summary.redZones || 0}
              tone="error"
            />
            <KpiCard label="Warning Zones" value={summary.yellowZones || 0} tone="warning" />
            <KpiCard icon={trendIcon} label="Trend Direction" value={trendLabel} />
          </Stack>
        </Box>
      </Box>

      <Box>
        <Typography sx={{ fontWeight: 950, mb: 1 }}>Analysis</Typography>
        <Grid container spacing={2.25} alignItems="stretch">
          <Grid item xs={12} md={7}>
            <RiskTrendChart points={summary.last30VarianceScores} />
          </Grid>
          <Grid item xs={12} md={5}>
            <DidYouKnowCard />
          </Grid>
        </Grid>
      </Box>


      <Paper
        elevation={0}
        sx={{
          p: 0,
          borderRadius: '14px',
          border: '1px solid',
          borderColor: 'rgba(31, 122, 77, 0.18)',
          bgcolor: 'secondary.light',
          overflow: 'hidden',
          boxSizing: 'border-box',
          boxShadow: '0 10px 26px rgba(16,31,22,0.10)',
        }}
      >
        <Box sx={{ p: { xs: 2.5, md: 3 }, boxSizing: 'border-box', width: '100%', overflow: 'hidden' }}>
          <Stack spacing={3}>
            <Stack spacing={1}>
              <Typography sx={{ fontWeight: 950, fontSize: 16 }}>Today’s Quick Actions</Typography>
              <Typography sx={{ color: 'text.secondary', fontWeight: 750 }}>
                Simple steps that reduce risk immediately
              </Typography>
            </Stack>

            <Divider sx={{ borderColor: 'rgba(31, 122, 77, 0.14)' }} />

            <Stack spacing={1.5}>
              <QuickActionRow
                checked={checks.uneven}
                onChange={(next) => setChecks((s) => ({ ...s, uneven: next }))}
                label="Inspect most uneven zones first"
              />
              <QuickActionRow
                checked={checks.nozzles}
                onChange={(next) => setChecks((s) => ({ ...s, nozzles: next }))}
                label="Check clogged nozzles or drip emitters"
              />
              <QuickActionRow
                checked={checks.pressure}
                onChange={(next) => setChecks((s) => ({ ...s, pressure: next }))}
                label="Verify water distribution consistency"
              />
              <QuickActionRow
                checked={checks.color}
                onChange={(next) => setChecks((s) => ({ ...s, color: next }))}
                label="Observe field edges for stress"
              />
            </Stack>
          </Stack>
        </Box>
      </Paper>
    </Stack>
  )
}

function KpiCard({ icon, label, value, tone }) {
  const toneSx =
    tone === 'error'
      ? { bgcolor: 'rgba(209, 67, 67, 0.06)', borderColor: 'rgba(209, 67, 67, 0.18)' }
      : tone === 'warning'
        ? { bgcolor: 'rgba(249, 168, 37, 0.08)', borderColor: 'rgba(249, 168, 37, 0.22)' }
        : { bgcolor: 'background.paper', borderColor: 'divider' }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 0,
        borderRadius: '12px',
        border: '1px solid',
        minWidth: 170,
        overflow: 'hidden',
        boxSizing: 'border-box',
        boxShadow: '0 6px 16px rgba(16,31,22,0.05)',
        ...toneSx,
      }}
    >
      <Box sx={{ p: 2.5, boxSizing: 'border-box', width: '100%', overflow: 'hidden' }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
          {icon ? (
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: '12px',
                display: 'grid',
                placeItems: 'center',
                bgcolor: 'rgba(31, 122, 77, 0.10)',
                color: 'primary.main',
                flex: '0 0 auto',
              }}
            >
              {icon}
            </Box>
          ) : (
            <Box sx={{ width: 34, height: 34 }} />
          )}

          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: 12.5, fontWeight: 850, color: 'text.secondary', overflowWrap: 'anywhere' }}>{label}</Typography>
            <Typography sx={{ fontSize: 18, fontWeight: 950, lineHeight: 1.2 }}>{value}</Typography>
          </Box>
        </Stack>
      </Box>
    </Paper>
  )
}

function QuickActionRow({ checked, onChange, label }) {
  return (
    <Box
      component="label"
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.25,
        width: '100%',
        maxWidth: '100%',
        m: 0,
        cursor: 'pointer',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      <Checkbox
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        sx={{ p: 0.5, mt: 0.25, flex: '0 0 auto' }}
      />
      <Typography
        sx={{
          fontWeight: 850,
          lineHeight: 1.25,
          minWidth: 0,
          maxWidth: '100%',
          overflowWrap: 'anywhere',
          wordBreak: 'break-word',
          pt: 0.75,
        }}
      >
        {label}
      </Typography>
    </Box>
  )
}
