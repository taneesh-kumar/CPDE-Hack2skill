import { Paper, Stack, Typography } from '@mui/material'
import { useMemo } from 'react'
import { educationCards } from '../content/educationCards.js'

export default function DidYouKnowCard() {
  const card = useMemo(() => {
    const day = new Date().getDate()
    return educationCards[day % educationCards.length]
  }, [])

  return (
    <Paper sx={{ p: 2.5, height: '100%' }}>
      <Stack spacing={1}>
        <Typography sx={{ fontWeight: 900, color: 'primary.main' }}>Did You Know?</Typography>
        <Typography variant="h6" sx={{ fontWeight: 900 }}>
          {card.title}
        </Typography>
        <Typography sx={{ color: 'text.secondary', fontWeight: 650 }}>{card.body}</Typography>
        <Typography sx={{ mt: 0.5, fontWeight: 800 }}>
          Today’s tiny action: <span style={{ fontWeight: 900 }}>{card.action}</span>
        </Typography>
      </Stack>
    </Paper>
  )
}
