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
      p: { xs: 1, sm: 2 },
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
            borderRadius: { xs: 3, sm: 5 },
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
            <MotionBox 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              sx={{ textAlign: 'center', mb: { xs: 3, sm: 4 } }}
            >
              <Box 
                sx={{ 
                  fontSize: { xs: '3rem', sm: '4rem' },
                  mb: { xs: 1, sm: 2 },
                  animation: 'pulse 2s ease-in-out infinite',
                  '@keyframes pulse': {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.05)' }
                  }
                }}
              >
                🔐
              </Box>
              <Typography 
                variant="h4" 
                sx={{ 
                  color: '#0c4d7b', 
                  fontWeight: 800, 
                  mb: 1,
                  fontSize: { xs: '1.75rem', sm: '2.125rem' }
                }}
              >
                Iniciar Sesión
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
              >
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
                    mb: { xs: 2, sm: 3 },
                    borderLeft: '4px solid #dc3545',
                    borderRadius: 2,
                    fontSize: { xs: '0.85rem', sm: '0.9rem' }
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
                    mb: { xs: 2, sm: 2.5 },
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
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: { xs: '0.9rem', sm: '1rem' }
                    },
                    '& .MuiInputBase-input': {
                      fontSize: { xs: '0.9rem', sm: '1rem' }
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
                    mb: { xs: 1.5, sm: 2 },
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
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: { xs: '0.9rem', sm: '1rem' }
                    },
                    '& .MuiInputBase-input': {
                      fontSize: { xs: '0.9rem', sm: '1rem' }
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
                  mb: { xs: 2, sm: 3 },
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: { xs: 1, sm: 0 }
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
                  label={
                    <Typography sx={{ fontSize: { xs: '0.85rem', sm: '0.9rem' } }}>
                      Recordarme
                    </Typography>
                  }
                />
                <Link 
                  to="#" 
                  style={{ 
                    color: '#17a2b8', 
                    textDecoration: 'none', 
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#0c4d7b'}
                  onMouseLeave={(e) => e.target.style.color = '#17a2b8'}
                >
              
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
                  startIcon={loading ? null : <LoginIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />}
                  sx={{ 
                    mb: { xs: 2, sm: 3 },
                    py: { xs: 1.2, sm: 1.5 },
                    fontSize: { xs: '0.95rem', sm: '1.05rem' },
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
                          width: { xs: 16, sm: 20 },
                          height: { xs: 16, sm: 20 },
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
                      <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                        Iniciando sesión...
                      </Typography>
                    </Box>
                  ) : 'Iniciar Sesión'}
                </Button>
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
                  startIcon={<ArrowBackIcon sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />}
                  sx={{ 
                    color: '#0c4d7b',
                    fontWeight: 600,
                    fontSize: { xs: '0.85rem', sm: '0.95rem' },
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