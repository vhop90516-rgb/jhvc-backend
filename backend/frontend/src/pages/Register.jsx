import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Box, Container, TextField, Button, Typography, Card, CardContent, Alert, Checkbox, FormControlLabel, Accordion, AccordionSummary, AccordionDetails } from '@mui/material'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

const Register = () => {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    invitationCode: '',
    password: '',
    confirmPassword: '',
    phone: '',
    company: '',
    terms: false
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return
    }

    if (!formData.terms) {
      setError('Debes aceptar los términos y condiciones')
      return
    }

    setLoading(true)

    try {
      await register({
        full_name: formData.fullName,
        email: formData.email,
        invitation_code: formData.invitationCode,
        password: formData.password,
        phone: formData.phone,
        company_name: formData.company
      })
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear la cuenta')
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
                Crear Cuenta
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Únete a JHVC Tech Solutions
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
                label="Nombre Completo"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
                sx={{ mb: 2 }}
              />

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
                label="Código de Invitación"
                value={formData.invitationCode}
                onChange={(e) => setFormData({ ...formData, invitationCode: e.target.value })}
                required
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Contraseña (8 caracteres mínimo)"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Confirmar Contraseña"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                sx={{ mb: 2 }}
              />

              <Accordion sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>➕ Información adicional (opcional)</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TextField
                    fullWidth
                    label="Teléfono"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Empresa / Despacho"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </AccordionDetails>
              </Accordion>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.terms}
                    onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
                    required
                  />
                }
                label={
                  <Typography variant="body2">
                    Acepto los términos y condiciones
                  </Typography>
                }
                sx={{ mb: 2 }}
              />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={<PersonAddIcon />}
                sx={{ mb: 2, py: 1.5 }}
              >
                {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
              </Button>

              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography variant="body2">
                  ¿Ya tienes cuenta?{' '}
                  <Link to="/login" style={{ color: '#17a2b8', textDecoration: 'none', fontWeight: 600 }}>
                    Iniciar Sesión
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

export default Register