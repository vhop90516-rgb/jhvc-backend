import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import PrivateRoute from './components/PrivateRoute'
import Layout from './components/Layout'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Admin from './pages/Admin'
import Calculadora from './pages/Calculadora'

const theme = createTheme({
  palette: {
    primary: {
      main: '#0c4d7b',
    },
    secondary: {
      main: '#17a2b8',
    },
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Layout><Dashboard /></Layout>
              </PrivateRoute>
            } />
            
            <Route path="/calculadora" element={
              <PrivateRoute>
                <Layout><Calculadora /></Layout>
              </PrivateRoute>
            } />
            
            <Route path="/admin" element={
              <PrivateRoute adminOnly>
                <Layout><Admin /></Layout>
              </PrivateRoute>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App