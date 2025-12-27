import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material'
import { Link as RouterLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'

import cpdeLogo from '../assets/image-removebg-preview (4).png'

export default function AppShell() {
  const location = useLocation()
  const navigate = useNavigate()
  const isLanding = location.pathname === '/'
  const [language, setLanguage] = useState('en')

  const homeRoute = isLanding ? '/' : '/dashboard'

  const handleLogout = () => {
    try {
      localStorage.removeItem('cpde:farmId')
    } catch {
      // ignore
    }
    navigate('/')
  }

  const appBarSx = useMemo(
    () =>
      isLanding
        ? {
            bgcolor: '#4A3B32',
            color: 'common.white',
          }
        : {
            borderBottom: 1,
            borderColor: 'divider',
          },
    [isLanding]
  )

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position={isLanding ? 'fixed' : 'sticky'}
        color={isLanding ? 'transparent' : 'inherit'}
        elevation={isLanding ? 0 : 0}
        sx={appBarSx}
      >
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
          <Box
            component={RouterLink}
            to={homeRoute}
            aria-label="Go to home"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit',
              lineHeight: 0,
            }}
          >
            <Box
              component="img"
              src={cpdeLogo}
              alt="CPDE"
              sx={{
                height: { xs: 40, sm: 48 },
                width: 'auto',
                display: 'block',
              }}
            />
          </Box>

          {!isLanding && (
            <Typography sx={{ ml: 1, color: 'text.secondary', fontWeight: 600 }}>
              Crop Failure Pre‑Cause Detection Engine
            </Typography>
          )}

          {!isLanding && (
            <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
              <Button
                onClick={handleLogout}
                variant="outlined"
                size="small"
                sx={{ textTransform: 'none', fontWeight: 800 }}
              >
                Logout
              </Button>
            </Box>
          )}

          {isLanding && (
            <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1.25 }}>
              <Box sx={{ display: 'flex', gap: 0.75 }}>
                <Button
                  size="small"
                  onClick={() => setLanguage('en')}
                  variant={language === 'en' ? 'contained' : 'outlined'}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 700,
                    bgcolor: language === 'en' ? 'rgba(255,255,255,0.18)' : 'transparent',
                    color: 'common.white',
                    borderColor: 'rgba(255,255,255,0.45)',
                    '&:hover': { borderColor: 'rgba(255,255,255,0.7)', bgcolor: 'rgba(255,255,255,0.22)' },
                  }}
                >
                  English
                </Button>
                <Button
                  size="small"
                  onClick={() => setLanguage('hi')}
                  variant={language === 'hi' ? 'contained' : 'outlined'}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 700,
                    bgcolor: language === 'hi' ? 'rgba(255,255,255,0.18)' : 'transparent',
                    color: 'common.white',
                    borderColor: 'rgba(255,255,255,0.45)',
                    '&:hover': { borderColor: 'rgba(255,255,255,0.7)', bgcolor: 'rgba(255,255,255,0.22)' },
                  }}
                >
                  Hindi
                </Button>
              </Box>

              <Button
                component={RouterLink}
                to="/dashboard"
                sx={{
                  textTransform: 'none',
                  fontWeight: 800,
                  color: 'common.white',
                  borderColor: 'rgba(255,255,255,0.45)',
                }}
                variant="outlined"
                size="small"
              >
                Login
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {isLanding ? (
        <Box sx={{ pt: { xs: 7, sm: 8 } }}>
          <Outlet />
        </Box>
      ) : (
        <Container maxWidth="lg" sx={{ py: { xs: 2, md: 3 } }}>
          <Outlet />
        </Container>
      )}
    </Box>
  )
}
