import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Box, Container, TextField, Button, Typography, Card, CardContent, Alert, Checkbox, FormControlLabel } from '@mui/material'
import LoginIcon from '@mui/icons-material/Login'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '', remember: false })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(formData.email, formData.password, formData.remember)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Correo o contraseña incorrectos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0c4d7b, #17a2b8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 2
    }}>
      <Container maxWidth="sm">
        <Card sx={{ borderRadius: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Box sx={{ fontSize: '2.5rem', mb: 1 }}>📊</Box>
              <Typography variant="h4" sx={{ color: '#0c4d7b', fontWeight: 700, mb: 1 }}>
                Iniciar Sesión
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Bienvenido de nuevo
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Correo Electrónico"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Contraseña"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                sx={{ mb: 2 }}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.remember}
                    onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
                  />
                }
                label="Recordarme"
                sx={{ mb: 2 }}
              />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={<LoginIcon />}
                sx={{ mb: 2, py: 1.5 }}
              >
                {loading ? 'Iniciando...' : 'Iniciar Sesión'}
              </Button>

              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography variant="body2">
                  ¿No tienes cuenta?{' '}
                  <Link to="/register" style={{ color: '#17a2b8', textDecoration: 'none', fontWeight: 600 }}>
                    Crear cuenta gratis
                  </Link>
                </Typography>
              </Box>

              <Box sx={{ textAlign: 'center' }}>
                <Button
                  component={Link}
                  to="/"
                  startIcon={<ArrowBackIcon />}
                  sx={{ color: '#0c4d7b' }}
                >
                  Volver al inicio
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

export default Login