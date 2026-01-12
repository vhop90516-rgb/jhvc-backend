import { useState } from 'react'
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Container, Typography, Grid, Card, CardContent, Button, TextField, Divider, IconButton, useMediaQuery, useTheme } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import MenuIcon from '@mui/icons-material/Menu'
import HomeIcon from '@mui/icons-material/Home'
import DescriptionIcon from '@mui/icons-material/Description'
import CalculateIcon from '@mui/icons-material/Calculate'
import ApiIcon from '@mui/icons-material/Api'
import PersonIcon from '@mui/icons-material/Person'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import SettingsIcon from '@mui/icons-material/Settings'
import LogoutIcon from '@mui/icons-material/Logout'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import VisibilityIcon from '@mui/icons-material/Visibility'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import ComputerIcon from '@mui/icons-material/Computer'
import ShieldIcon from '@mui/icons-material/Shield'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)
const MotionCard = motion(Card)

const drawerWidth = 260

const Dashboard = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [mobileOpen, setMobileOpen] = useState(false)
  const [tokenVisible, setTokenVisible] = useState(false)
  const token = localStorage.getItem('token')

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleShowToken = () => {
    setTokenVisible(true)
  }

  const handleCopyToken = () => {
    if (token) {
      navigator.clipboard.writeText(token)
      alert('✅ Token copiado al portapapeles')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const stats = [
    {
      icon: <DescriptionIcon sx={{ fontSize: '1.5rem' }} />,
      value: '0',
      label: 'Documentos Procesados',
      gradient: 'linear-gradient(135deg, #0c4d7b, #17a2b8)',
      color: '#0c4d7b'
    },
    {
      icon: <CheckCircleIcon sx={{ fontSize: '1.5rem' }} />,
      value: '10',
      label: 'Disponibles',
      gradient: 'linear-gradient(135deg, #28a745, #20c997)',
      color: '#28a745'
    },
    {
      icon: <EmojiEventsIcon sx={{ fontSize: '1.5rem' }} />,
      value: 'Gratis',
      label: 'Plan Actual',
      gradient: 'linear-gradient(135deg, #fd7e14, #ffc107)',
      color: '#fd7e14'
    },
    {
      icon: <AccessTimeIcon sx={{ fontSize: '1.5rem' }} />,
      value: '0h',
      label: 'Tiempo Ahorrado',
      gradient: 'linear-gradient(135deg, #6f42c1, #e83e8c)',
      color: '#6f42c1'
    }
  ]

  const services = [
    {
      icon: <SmartToyIcon />,
      title: 'AutoTranscribe',
      description: 'Transcribe estados de cuenta bancarios con IA en segundos. Ahorra hasta 95% de tu tiempo.',
      path: '#'
    },
    {
      icon: <CalculateIcon />,
      title: 'Calculadora de Facturas',
      description: 'Calcula totales, IVA y retenciones de facturas de forma rápida y precisa.',
      path: '/calculadora'
    },
    {
      icon: <ApiIcon />,
      title: 'API Integration',
      description: 'Integra nuestros servicios en tu sistema con nuestra API REST robusta y documentada.',
      path: '#'
    }
  ]

  const menuItems = [
    { section: 'Principal', items: [
      { text: 'Dashboard', icon: <HomeIcon />, path: '/dashboard', active: true }
    ]},
    { section: 'Servicios', items: [
      { text: 'AutoTranscribe', icon: <DescriptionIcon />, path: '#' },
      { text: 'Calculadora Facturas', icon: <CalculateIcon />, path: '/calculadora' },
      { text: 'Integraciones API', icon: <ApiIcon />, path: '#' }
    ]},
    { section: 'Cuenta', items: [
      { text: 'Mi Perfil', icon: <PersonIcon />, path: '#' },
      { text: 'Suscripción', icon: <CreditCardIcon />, path: '#' },
      { text: 'Configuración', icon: <SettingsIcon />, path: '#' },
      { text: 'Cerrar Sesión', icon: <LogoutIcon />, path: '#', action: handleLogout }
    ]}
  ]

  const drawer = (
    <Box sx={{ overflow: 'auto' }}>
      <List sx={{ pt: 2 }}>
        {menuItems.map((section, sectionIdx) => (
          <Box key={sectionIdx}>
            <Typography
              variant="caption"
              sx={{
                px: 3,
                py: 1,
                display: 'block',
                color: 'rgba(255, 255, 255, 0.6)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontWeight: 600,
                fontSize: '0.75rem'
              }}
            >
              {section.section}
            </Typography>
            {section.items.map((item, idx) => (
              <ListItem
                button
                key={idx}
                onClick={() => {
                  if (item.action) {
                    item.action()
                  } else {
                    navigate(item.path)
                  }
                  if (isMobile) setMobileOpen(false)
                }}
                sx={{
                  px: 3,
                  py: 1.5,
                  color: 'rgba(255, 255, 255, 0.85)',
                  borderLeft: item.active ? '4px solid white' : '4px solid transparent',
                  backgroundColor: item.active ? '#17a2b8' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'white'
                  },
                  transition: 'all 0.3s'
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 35 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </Box>
        ))}

        {user?.is_admin && (
          <Box sx={{ px: 3, mt: 2 }}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<ShieldIcon />}
              onClick={() => {
                navigate('/admin')
                if (isMobile) setMobileOpen(false)
              }}
              sx={{
                background: 'linear-gradient(135deg, #dc3545, #c82333)',
                fontWeight: 600,
                py: 1.5,
                '&:hover': {
                  background: 'linear-gradient(135deg, #c82333, #dc3545)'
                }
              }}
            >
              Panel Admin
            </Button>
          </Box>
        )}
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex' }}>
      {/* SIDEBAR */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#0c4d7b',
            color: 'white',
            borderRight: 'none',
            top: { xs: 60, md: 70 }
          }
        }}
      >
        {drawer}
      </Drawer>

      {/* MAIN CONTENT */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: 0 }
        }}
      >
        {/* Mobile Menu Button */}
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mb: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Container maxWidth="lg" sx={{ mt: { xs: 0, md: 2 } }}>
          {/* STATS GRID */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <MotionCard
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  sx={{
                    transition: 'all 0.3s',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 5px 20px rgba(0, 0, 0, 0.15)'
                    }
                  }}
                >
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: 3,
                        background: stat.gradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        flexShrink: 0
                      }}
                    >
                      {stat.icon}
                    </Box>
                    <Box>
                      <Typography variant="h4" sx={{ color: stat.color, fontWeight: 700 }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {stat.label}
                      </Typography>
                    </Box>
                  </CardContent>
                </MotionCard>
              </Grid>
            ))}
          </Grid>

          {/* TOKEN SECTION */}
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            sx={{ mb: 4, borderRadius: 3, boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  color: '#0c4d7b',
                  fontWeight: 700,
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <ComputerIcon /> Token para Aplicación Local
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Usa este token en tu aplicación de escritorio (Visor CFDI):
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                <TextField
                  fullWidth
                  value={tokenVisible ? token : 'Haz clic en "Mostrar"'}
                  InputProps={{
                    readOnly: true,
                    sx: {
                      fontFamily: 'monospace',
                      fontSize: '0.9rem'
                    }
                  }}
                  sx={{ flex: 1, minWidth: '200px' }}
                />
                <Button
                  variant="contained"
                  startIcon={<VisibilityIcon />}
                  onClick={handleShowToken}
                  sx={{
                    background: '#0c4d7b',
                    '&:hover': {
                      background: '#17a2b8'
                    }
                  }}
                >
                  Mostrar
                </Button>
                <Button
                  variant="contained"
                  startIcon={<ContentCopyIcon />}
                  onClick={handleCopyToken}
                  sx={{
                    background: '#0c4d7b',
                    '&:hover': {
                      background: '#17a2b8'
                    }
                  }}
                >
                  Copiar
                </Button>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                ℹ️ Solo necesitas copiarlo una vez en tu aplicación de escritorio
              </Typography>
            </CardContent>
          </MotionCard>

          {/* SERVICES */}
          <Typography variant="h5" sx={{ color: '#0c4d7b', fontWeight: 700, mb: 3 }}>
            Servicios Disponibles
          </Typography>

          <Grid container spacing={3}>
            {services.map((service, index) => (
              <Grid item xs={12} md={4} key={index}>
                <MotionCard
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                  sx={{
                    height: '100%',
                    transition: 'all 0.3s',
                    cursor: 'pointer',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: '0 5px 20px rgba(0, 0, 0, 0.15)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: '#0c4d7b',
                        fontWeight: 700,
                        mb: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      {service.icon}
                      {service.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                      {service.description}
                    </Typography>
                    <Button
                      variant="contained"
                      fullWidth
                      endIcon={<ArrowForwardIcon />}
                      onClick={() => navigate(service.path)}
                      sx={{
                        background: '#0c4d7b',
                        fontWeight: 600,
                        py: 1.2,
                        '&:hover': {
                          background: '#17a2b8',
                          transform: 'translateY(-2px)'
                        },
                        transition: 'all 0.3s'
                      }}
                    >
                      {service.title === 'Calculadora de Facturas' ? 'Calcular' : service.title === 'AutoTranscribe' ? 'Comenzar' : 'Documentación'}
                    </Button>
                  </CardContent>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  )
}

export default Dashboard