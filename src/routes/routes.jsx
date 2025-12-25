import { createBrowserRouter } from 'react-router-dom'
import AppShell from '../components/AppShell.jsx'
import Landing from '../screens/Landing.jsx'
import Register from '../screens/Register.jsx'
import Dashboard from '../screens/Dashboard.jsx'
import Analysis from '../screens/Analysis.jsx'
import AlertsHub from '../screens/AlertsHub.jsx'

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <Landing /> },
      { path: '/register', element: <Register /> },
      { path: '/dashboard', element: <Dashboard /> },
      { path: '/analysis', element: <Analysis /> },
      { path: '/alerts', element: <AlertsHub /> },
    ],
  },
])
