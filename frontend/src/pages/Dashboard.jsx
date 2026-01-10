import { Box, Container, Typography, Grid, Card, CardContent, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import DescriptionIcon from '@mui/icons-material/Description'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import CalculateIcon from '@mui/icons-material/Calculate'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

const Dashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <Box>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* STATS */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              transition: 'all 0.3s',
              '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 }
            }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ 
                  width: 60, 
                  height: 60, 
                  borderRadius: 3, 
                  background: 'linear-gradient(135deg, #0c4d7b, #17a2b8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.5rem'
                }}>
                  <DescriptionIcon />
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ color: '#0c4d7b', fontWeight: 700 }}>
                    0
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Documentos Procesados
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              transition: 'all 0.3s',
              '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 }
            }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ 
                  width: 60, 
                  height: 60, 
                  borderRadius: 3, 
                  background: 'linear-gradient(135deg, #28a745, #20c997)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.5rem'
                }}>
                  <CheckCircleIcon />
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ color: '#28a745', fontWeight: 700 }}>
                    10
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Disponibles
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              transition: 'all 0.3s',
              '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 }
            }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ 
                  width: 60, 
                  height: 60, 
                  borderRadius: 3, 
                  background: 'linear-gradient(135deg, #fd7e14, #ffc107)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.5rem'
                }}>
                  <EmojiEventsIcon />
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ color: '#fd7e14', fontWeight: 700 }}>
                    Gratis
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Plan Actual
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              transition: 'all 0.3s',
              '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 }
            }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ 
                  width: 60, 
                  height: 60, 
                  borderRadius: 3, 
                  background: 'linear-gradient(135deg, #6f42c1, #e83e8c)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.5rem'
                }}>
                  <AccessTimeIcon />
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ color: '#6f42c1', fontWeight: 700 }}>
                    0h
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tiempo Ahorrado
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* SERVICIOS */}
          <Grid item xs={12}>
            <Typography variant="h5" sx={{ color: '#0c4d7b', fontWeight: 700, mb: 3 }}>
              Servicios Disponibles
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ 
              height: '100%',
              transition: 'all 0.3s',
              '&:hover': { transform: 'translateY(-10px)', boxShadow: 6 }
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: '#0c4d7b', fontWeight: 600, mb: 2 }}>
                  <CalculateIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Calculadora de Facturas
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Calcula totales, IVA y retenciones de facturas de forma rápida y precisa.
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/calculadora')}
                >
                  Calcular
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default Dashboard