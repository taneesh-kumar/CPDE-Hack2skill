import { Box, Container, Divider, Stack, Typography, Link } from '@mui/material'
import { Link as RouterLink, useLocation } from 'react-router-dom'

export default function AppFooter() {
  const location = useLocation()

  const links = [
    { label: 'Dashboard', to: '/dashboard' },
    { label: 'Satellite Grid', to: '/analysis' },
    { label: 'Alerts', to: '/alerts' },
    // Keep these within existing routes to avoid 404s.
    { label: 'Insights', to: '/dashboard#insight' },
    { label: 'Help', to: '/dashboard#help' },
  ]

  // Highlight active route (hash ignored for simplicity)
  const activePath = location.pathname

  return (
    <Box component="footer" sx={{ mt: 'auto', bgcolor: 'background.paper' }}>
      <Divider />
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 2.5 } }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: 1.5, md: 2 }}
          alignItems={{ xs: 'flex-start', md: 'center' }}
          justifyContent="space-between"
        >
          <Box>
            <Typography sx={{ fontSize: 13, fontWeight: 800, color: 'text.primary' }}>
              © 2025 CPDE – Crop Failure Pre‑Cause Detection Engine
            </Typography>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary' }}>
              Academic / Research Prototype
            </Typography>
          </Box>

          <Stack
            direction="row"
            spacing={1.75}
            useFlexGap
            flexWrap="wrap"
            sx={{ alignItems: 'center' }}
          >
            {links.map((l) => (
              <Link
                key={l.label}
                component={RouterLink}
                to={l.to}
                underline="none"
                sx={{
                  fontSize: 12.5,
                  fontWeight: 800,
                  color: activePath === l.to.split('#')[0] ? 'primary.main' : 'text.secondary',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                {l.label}
              </Link>
            ))}
          </Stack>

          <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            <Typography sx={{ fontSize: 12.5, fontWeight: 800, color: 'text.primary' }}>
              System Status: <Box component="span" sx={{ color: 'success.main' }}>●</Box> Online
            </Typography>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary' }}>
              Version: v1.0
            </Typography>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary' }}>
              Data: OpenStreetMap + Sensor Simulation
            </Typography>
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}
