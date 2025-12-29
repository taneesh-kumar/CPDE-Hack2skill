import { Box, Paper, Stack, Typography } from '@mui/material'
import { useMemo } from 'react'
import PsychologyAltOutlinedIcon from '@mui/icons-material/PsychologyAltOutlined'
import { educationCards } from '../content/educationCards.js'

export default function DidYouKnowCard() {
  const card = useMemo(() => {
    const day = new Date().getDate()
    return educationCards[day % educationCards.length]
  }, [])

  return (
    <Paper
      id="insight"
      sx={{
        p: 0,
        height: '100%',
        borderRadius: '14px',
        overflow: 'hidden',
        boxSizing: 'border-box',
        bgcolor: 'secondary.light',
        border: '1px solid',
        borderColor: 'rgba(31, 122, 77, 0.18)',
      }}
      elevation={0}
    >
      <Box sx={{ p: { xs: 2.5, md: 3 }, height: '100%', boxSizing: 'border-box', width: '100%', overflow: 'hidden' }}>
        <Stack spacing={3}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: '12px',
                display: 'grid',
                placeItems: 'center',
                bgcolor: 'rgba(31, 122, 77, 0.12)',
                color: 'primary.main',
                flex: '0 0 auto',
              }}
            >
              <PsychologyAltOutlinedIcon fontSize="small" />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontWeight: 950, color: 'primary.main', lineHeight: 1.1 }}>AI Insight</Typography>
              <Typography sx={{ fontSize: 12.5, fontWeight: 750, color: 'text.secondary' }}>
                Calm, actionable agronomy guidance
              </Typography>
            </Box>
          </Stack>

          <Stack spacing={1}>
            <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.15 }}>
              {card.title}
            </Typography>
            <Typography sx={{ color: 'text.secondary', fontWeight: 650, overflowWrap: 'anywhere', wordBreak: 'break-word' }}>
              {card.body}
            </Typography>
          </Stack>

          <Typography sx={{ fontWeight: 800 }}>
            Today’s tiny action: <span style={{ fontWeight: 900 }}>{card.action}</span>
          </Typography>
        </Stack>
      </Box>
    </Paper>
  )
}
