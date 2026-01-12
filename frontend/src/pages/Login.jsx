import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Box, Container, TextField, Button, Typography, Card, CardContent, Alert, Checkbox, FormControlLabel } from '@mui/material'
import LoginIcon from '@mui/icons-material/Login'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)
const MotionCard = motion(Card)

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
      background: 'linear-gradient(135deg, #0c4d7b 0%, #17a2b8 50%, #0c4d7b 100%)',
      backgroundSize: '200% 200%',
      animation: 'gradient 15s ease infinite',
      '@keyframes gradient': {
        '0%': { backgroundPosition: '0% 50%' },
        '50%': { backgroundPosition: '100% 50%' },
        '100%': { backgroundPosition: '0% 50%' }
      },
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 2,
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: '-50%',
        right: '-10%',
        width: '60%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 20s ease-in-out infinite',
      },
      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: '-50%',
        left: '-10%',
        width: '50%',
        height: '180%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 25s ease-in-out infinite reverse',
      },
      '@keyframes float': {
        '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
        '50%': { transform: 'translateY(-20px) rotate(5deg)' }
      }
    }}>
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <MotionCard 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          sx={{ 
            borderRadius: 5,
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }}
        >
          <CardContent sx={{ p: 5 }}>
            <MotionBox 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              sx={{ textAlign: 'center', mb: 4 }}
            >
              <Box 
                sx={{ 
                  fontSize: '4rem', 
                  mb: 2,
                  animation: 'pulse 2s ease-in-out infinite',
                  '@keyframes pulse': {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.05)' }
                  }
                }}
              >
                🔐
              </Box>
              <Typography variant="h4" sx={{ color: '#0c4d7b', fontWeight: 800, mb: 1 }}>
                Iniciar Sesión
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Bienvenido de nuevo
              </Typography>
            </MotionBox>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3,
                    borderLeft: '4px solid #dc3545',
                    borderRadius: 2
                  }}
                >
                  {error}
                </Alert>
              </motion.div>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <MotionBox
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <TextField
                  fullWidth
                  label="Correo Electrónico"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  sx={{ 
                    mb: 2.5,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: '#f0f7ff',
                      transition: 'all 0.3s',
                      '&:hover': {
                        backgroundColor: '#fff',
                      },
                      '&.Mui-focused': {
                        backgroundColor: '#fff',
                      }
                    }
                  }}
                />
              </MotionBox>

              <MotionBox
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <TextField
                  fullWidth
                  label="Contraseña"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  sx={{ 
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: '#f0f7ff',
                      transition: 'all 0.3s',
                      '&:hover': {
                        backgroundColor: '#fff',
                      },
                      '&.Mui-focused': {
                        backgroundColor: '#fff',
                      }
                    }
                  }}
                />
              </MotionBox>

              <MotionBox
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  mb: 3
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.remember}
                      onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
                      sx={{ 
                        color: '#0c4d7b',
                        '&.Mui-checked': {
                          color: '#17a2b8'
                        }
                      }}
                    />
                  }
                  label="Recordarme"
                />
                <Link 
                  to="#" 
                  style={{ 
                    color: '#17a2b8', 
                    textDecoration: 'none', 
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#0c4d7b'}
                  onMouseLeave={(e) => e.target.style.color = '#17a2b8'}
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </MotionBox>

              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  startIcon={loading ? null : <LoginIcon />}
                  sx={{ 
                    mb: 3, 
                    py: 1.5,
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #0c4d7b, #17a2b8)',
                    boxShadow: '0 4px 15px rgba(12, 77, 123, 0.3)',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 8px 25px rgba(23, 162, 184, 0.4)',
                    },
                    '&:active': {
                      transform: 'translateY(-1px)',
                    },
                    '&:disabled': {
                      background: '#e0e0e0',
                      color: '#999',
                      transform: 'none',
                      boxShadow: 'none'
                    }
                  }}
                >
                  {loading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          border: '3px solid rgba(255,255,255,0.3)',
                          borderTop: '3px solid white',
                          borderRadius: '50%',
                          animation: 'spin 0.8s linear infinite',
                          '@keyframes spin': {
                            '0%': { transform: 'rotate(0deg)' },
                            '100%': { transform: 'rotate(360deg)' }
                          }
                        }}
                      />
                      Iniciando sesión...
                    </Box>
                  ) : 'Iniciar Sesión'}
                </Button>
              </MotionBox>

              <Box 
                sx={{ 
                  textAlign: 'center',
                  position: 'relative',
                  mb: 3,
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    width: '100%',
                    height: 1,
                    backgroundColor: '#e0e0e0'
                  }
                }}
              >
                <Typography 
                  variant="body2" 
                  sx={{ 
                    backgroundColor: 'white',
                    px: 2,
                    position: 'relative',
                    color: '#999',
                    display: 'inline-block'
                  }}
                >
                  o
                </Typography>
              </Box>

              <MotionBox
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                sx={{ textAlign: 'center', mb: 2 }}
              >
                <Typography variant="body2">
                  ¿No tienes cuenta?{' '}
                  <Link 
                    to="/register" 
                    style={{ 
                      color: '#17a2b8', 
                      textDecoration: 'none', 
                      fontWeight: 700,
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = '#0c4d7b'
                      e.target.style.textDecoration = 'underline'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = '#17a2b8'
                      e.target.style.textDecoration = 'none'
                    }}
                  >
                    Crear cuenta gratis
                  </Link>
                </Typography>
              </MotionBox>

              <MotionBox
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                sx={{ textAlign: 'center' }}
              >
                <Button
                  component={Link}
                  to="/"
                  startIcon={<ArrowBackIcon />}
                  sx={{ 
                    color: '#0c4d7b',
                    fontWeight: 600,
                    transition: 'all 0.3s',
                    '&:hover': {
                      color: '#17a2b8',
                      transform: 'translateX(-3px)'
                    }
                  }}
                >
                  Volver al inicio
                </Button>
              </MotionBox>
            </Box>
          </CardContent>
        </MotionCard>
      </Container>
    </Box>
  )
}

export default Login