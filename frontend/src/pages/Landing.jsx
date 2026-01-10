import { Box, Container, Typography, Button, Grid, Card, CardContent } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import InfoIcon from '@mui/icons-material/Info'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import LaptopMacIcon from '@mui/icons-material/LaptopMac'
import SettingsIcon from '@mui/icons-material/Settings'
import PsychologyIcon from '@mui/icons-material/Psychology'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import SecurityIcon from '@mui/icons-material/Security'
import CloudIcon from '@mui/icons-material/Cloud'
import GavelIcon from '@mui/icons-material/Gavel'
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import EmailIcon from '@mui/icons-material/Email'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import FacebookIcon from '@mui/icons-material/Facebook'

const Landing = () => {
  const navigate = useNavigate()

  return (
    <Box>
      {/* NAVBAR */}
      <Box sx={{ 
        background: '#0c4d7b', 
        position: 'sticky', 
        top: 0, 
        zIndex: 1000,
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            py: 2
          }}>
            <Typography variant="h5" sx={{ 
              color: 'white', 
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              📊 JHVC Tech Solutions
            </Typography>
            
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3, alignItems: 'center' }}>
              <Typography 
                component="a" 
                href="#about" 
                sx={{ color: 'white', textDecoration: 'none', fontWeight: 500, '&:hover': { color: '#17a2b8' } }}
              >
                Nosotros
              </Typography>
              <Typography 
                component="a" 
                href="#services" 
                sx={{ color: 'white', textDecoration: 'none', fontWeight: 500, '&:hover': { color: '#17a2b8' } }}
              >
                Servicios
              </Typography>
              <Typography 
                component="a" 
                href="#features" 
                sx={{ color: 'white', textDecoration: 'none', fontWeight: 500, '&:hover': { color: '#17a2b8' } }}
              >
                Características
              </Typography>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/login')}
                sx={{ 
                  color: 'white', 
                  borderColor: 'white',
                  '&:hover': { 
                    borderColor: 'white',
                    background: 'white',
                    color: '#0c4d7b'
                  }
                }}
              >
                Iniciar Sesión
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* HERO SECTION */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #0c4d7b 0%, #17a2b8 100%)',
        color: 'white',
        py: 8,
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Container maxWidth="md">
          <Typography variant="h2" sx={{ fontWeight: 700, mb: 3, fontSize: { xs: '2rem', md: '3rem' } }}>
            Soluciones Contables Inteligentes
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.95 }}>
            Tecnología diseñada para contadores. Automatiza procesos, ahorra tiempo y enfócate en lo que realmente importa: asesorar a tus clientes.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              size="large"
              onClick={() => navigate('/register')}
              startIcon={<RocketLaunchIcon />}
              sx={{ 
                background: '#17a2b8',
                fontSize: '1.2rem',
                px: 4,
                py: 1.5,
                '&:hover': { 
                  background: '#138496',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(23, 162, 184, 0.4)'
                }
              }}
            >
              Comenzar Ahora
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              component="a"
              href="#about"
              startIcon={<InfoIcon />}
              sx={{ 
                color: 'white',
                borderColor: 'white',
                fontSize: '1.2rem',
                px: 4,
                py: 1.5,
                '&:hover': { 
                  borderColor: 'white',
                  background: 'white',
                  color: '#0c4d7b'
                }
              }}
            >
              Conocer Más
            </Button>
          </Box>
        </Container>
      </Box>

      {/* ABOUT SECTION */}
      <Box id="about" sx={{ py: 8, background: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" sx={{ color: '#0c4d7b', fontWeight: 700, mb: 3 }}>
                Nuestra Historia
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
                Los contadores pasan horas en tareas repetitivas que pueden automatizarse con tecnología.
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
                Por eso fundamos <strong>JHVC Tech Solutions</strong>: para desarrollar herramientas que faciliten el trabajo diario de los contadores mexicanos.
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                Nuestra misión es simple: <strong>que los contadores dejen de perder tiempo en procesos manuales y se enfoquen en asesorar a sus clientes.</strong>
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: 'center' }}>
              <Box sx={{ fontSize: '15rem', color: '#0c4d7b', opacity: 0.1 }}>
                👔
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* SERVICES SECTION */}
      <Box id="services" sx={{ py: 8, background: 'white' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ textAlign: 'center', color: '#0c4d7b', fontWeight: 700, mb: 6 }}>
            Nuestros Servicios
          </Typography>
          <Grid container spacing={3}>
            {[
              {
                icon: <SmartToyIcon sx={{ fontSize: 40 }} />,
                title: 'Automatización con IA',
                description: 'Herramientas impulsadas por inteligencia artificial para automatizar procesos contables repetitivos.',
                features: ['Transcripción automática de documentos', 'Procesamiento inteligente de datos', 'Análisis predictivo', 'Conciliaciones automáticas']
              },
              {
                icon: <LaptopMacIcon sx={{ fontSize: 40 }} />,
                title: 'Software Contable',
                description: 'Sistemas contables modernos, 100% en la nube, diseñados para contadores mexicanos.',
                features: ['Cumplimiento fiscal automático', 'Integración con SAT', 'Multi-empresa', 'Reportes en tiempo real']
              },
              {
                icon: <SettingsIcon sx={{ fontSize: 40 }} />,
                title: 'Integraciones API',
                description: 'Conecta tus sistemas existentes con nuestras soluciones a través de APIs robustas.',
                features: ['API REST documentada', 'Webhooks en tiempo real', 'SDKs para múltiples lenguajes', 'Soporte técnico dedicado']
              }
            ].map((service, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ 
                  height: '100%',
                  background: '#f0f7ff',
                  borderLeft: '4px solid #0c4d7b',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateX(10px)',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                  }
                }}>
                  <CardContent>
                    <Box sx={{ color: '#0c4d7b', mb: 2 }}>
                      {service.icon}
                    </Box>
                    <Typography variant="h5" sx={{ color: '#0c4d7b', fontWeight: 600, mb: 2 }}>
                      {service.title}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {service.description}
                    </Typography>
                    <Box component="ul" sx={{ listStyle: 'none', p: 0 }}>
                      {service.features.map((feature, idx) => (
                        <Box component="li" key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, py: 0.5 }}>
                          <CheckCircleIcon sx={{ color: '#17a2b8', fontSize: 18, mt: 0.25 }} />
                          <Typography variant="body2">{feature}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* FEATURES SECTION */}
      <Box id="features" sx={{ py: 8, background: '#f8f9fa' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ textAlign: 'center', color: '#0c4d7b', fontWeight: 700, mb: 6 }}>
            ¿Por qué elegir JHVC?
          </Typography>
          <Grid container spacing={3}>
            {[
              { icon: <PsychologyIcon />, title: 'Hecho por Contadores', desc: 'Desarrollado por un equipo que entiende tus necesidades reales.' },
              { icon: <AccessTimeIcon />, title: 'Ahorra Tiempo', desc: 'Automatiza tareas repetitivas y recupera horas de trabajo cada semana.' },
              { icon: <SecurityIcon />, title: 'Seguridad Total', desc: 'Encriptación de datos, backups automáticos y cumplimiento con estándares.' },
              { icon: <CloudIcon />, title: '100% en la Nube', desc: 'Accede desde cualquier lugar, cualquier dispositivo. Sin instalaciones.' },
              { icon: <GavelIcon />, title: 'Cumplimiento Fiscal', desc: 'Actualizado siempre con las últimas disposiciones del SAT.' },
              { icon: <HeadsetMicIcon />, title: 'Soporte Experto', desc: 'Atención personalizada de contador a contador. Entendemos tu lenguaje.' }
            ].map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ 
                  textAlign: 'center',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
                  }
                }}>
                  <CardContent>
                    <Box sx={{ fontSize: '3rem', color: '#0c4d7b', mb: 2 }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" sx={{ color: '#0c4d7b', fontWeight: 600, mb: 1 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA SECTION */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #0c4d7b 0%, #17a2b8 100%)',
        color: 'white',
        py: 6,
        textAlign: 'center'
      }}>
        <Container maxWidth="md">
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
            ¿Listo para transformar tu práctica contable?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.95 }}>
            Únete a los contadores que ya están ahorrando tiempo con nuestras soluciones
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => navigate('/register')}
            sx={{ 
              background: '#17a2b8',
              fontSize: '1.2rem',
              px: 4,
              py: 1.5,
              '&:hover': { background: '#138496' }
            }}
          >
            Crear Cuenta Gratis
          </Button>
        </Container>
      </Box>

      {/* FOOTER */}
      <Box sx={{ background: '#0c4d7b', color: 'white', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={3}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                JHVC Tech Solutions
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Soluciones tecnológicas diseñadas para contadores mexicanos.
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h6" sx={{ mb: 2 }}>Servicios</Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0 }}>
                {['Automatización con IA', 'Software Contable', 'Integraciones API', 'Documentación'].map((item, idx) => (
                  <Box component="li" key={idx} sx={{ mb: 1 }}>
                    <Typography 
                      component="a" 
                      href="#services" 
                      sx={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', '&:hover': { color: 'white' } }}
                    >
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h6" sx={{ mb: 2 }}>Empresa</Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0 }}>
                {['Nosotros', 'Blog', 'Casos de Éxito', 'Contacto'].map((item, idx) => (
                  <Box component="li" key={idx} sx={{ mb: 1 }}>
                    <Typography 
                      component="a" 
                      href="#about" 
                      sx={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', '&:hover': { color: 'white' } }}
                    >
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h6" sx={{ mb: 2 }}>Contacto</Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0 }}>
                <Box component="li" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmailIcon fontSize="small" />
                  <Typography variant="body2">bahiacontable02@gmail.com</Typography>
                </Box>
                <Box component="li" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WhatsAppIcon fontSize="small" />
                  <Typography variant="body2">+52 322 328 7655</Typography>
                </Box>
                <Box component="li" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FacebookIcon fontSize="small" />
                  <Typography variant="body2">Virtual Accounting</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', mt: 4, pt: 3, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              © 2025 JHVC Tech Solutions. Todos los derechos reservados.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

export default Landing