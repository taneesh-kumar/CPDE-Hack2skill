import { createTheme } from '@mui/material/styles'

// “Green Agricultural Sector” — deep greens, earthy browns, clean whites.
// High-contrast defaults for outdoor readability.
export const cpdeTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1B5E20' }, // deep crop green
    secondary: { main: '#6D4C41' }, // earthy brown
    background: { default: '#FAFAFA', paper: '#FFFFFF' },
    success: { main: '#2E7D32' },
    warning: { main: '#F9A825' },
    error: { main: '#C62828' },
    text: { primary: '#102015', secondary: '#2B3A2E' },
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
    button: { fontWeight: 700, textTransform: 'none' },
  },
  components: {
    MuiButton: {
      defaultProps: { size: 'large', disableElevation: true },
      styleOverrides: {
        root: { minHeight: 48, borderRadius: 14 }, // large touch target
      },
    },
    MuiTextField: {
      defaultProps: { fullWidth: true },
    },
  },
})
