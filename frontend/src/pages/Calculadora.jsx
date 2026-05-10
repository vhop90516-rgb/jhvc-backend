import { useState, useEffect } from 'react'
import { Box, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel, Card, Grid, Paper, IconButton } from '@mui/material'
import { ArrowBack, Calculate, Add, Remove, Refresh, Delete } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'

const Calculadora = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [configuraciones, setConfiguraciones] = useState([])
  const [metodo, setMetodo] = useState('quitar-iva')
  const [resultado, setResultado] = useState(null)
  const [calculos, setCalculos] = useState([])
  const [contadorID, setContadorID] = useState(1)
  
  const [precioConIVA, setPrecioConIVA] = useState('')
  const [tasaIVA, setTasaIVA] = useState('0.16')
  
  const [subtotalDirecto, setSubtotalDirecto] = useState('')
  const [configDirecto, setConfigDirecto] = useState(0)
  const [retencionDirecto, setRetencionDirecto] = useState(0)
  
  const [totalInverso, setTotalInverso] = useState('')
  const [configInverso, setConfigInverso] = useState(0)
  const [retencionInverso, setRetencionInverso] = useState(0)

  useEffect(() => {
    loadConfiguraciones()
  }, [])

  const loadConfiguraciones = async () => {
    try {
      const response = await api.get('/calculadora/configuraciones')
      setConfiguraciones(response.data.data || [])
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const getUserInitials = () => {
    if (!user?.full_name) return 'JH'
    return user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const copiarAlPortapapeles = (valor) => {
    const numeroLimpio = valor.toString().replace(/[$,\s]/g, '')
    navigator.clipboard.writeText(numeroLimpio).then(() => {
      alert('✓ Copiado: ' + numeroLimpio)
    })
  }

  const quitarIVA = () => {
    const precio = parseFloat(precioConIVA)
    const tasa = parseFloat(tasaIVA)
    
    if (isNaN(precio) || precio <= 0) {
      alert('Ingresa un precio válido')
      return
    }
    
    const factor = 1 + tasa
    const precioSinIVA = precio / factor
    const ivaCalculado = precio - precioSinIVA
    
    setResultado({
      subtotal: precioSinIVA,
      iva: ivaCalculado,
      ish: 0,
      retencion_isr: 0,
      retencion_iva: 0,
      total: precio,
      factor: factor,
      tipo_calculo: 'quitar_iva',
      configuracion: `Quitar IVA ${(tasa * 100).toFixed(0)}%`
    })
  }

  const calcularDirecto = async () => {
    const subtotal = parseFloat(subtotalDirecto)
    
    if (isNaN(subtotal) || subtotal <= 0) {
      alert('Ingresa un subtotal válido')
      return
    }
    
    try {
      const response = await api.get('/calculadora/calcular', {
        params: {
          tipo: 'directo',
          monto: subtotal,
          config: configDirecto,
          retencion_especial: retencionDirecto
        }
      })
      setResultado({ ...response.data.data, tipo_calculo: 'directo' })
    } catch (error) {
      alert('Error calculando')
    }
  }

  const calcularInverso = async () => {
    const total = parseFloat(totalInverso)
    
    if (isNaN(total) || total <= 0) {
      alert('Ingresa un total válido')
      return
    }
    
    try {
      const response = await api.get('/calculadora/calcular', {
        params: {
          tipo: 'inverso',
          monto: total,
          config: configInverso,
          retencion_especial: retencionInverso
        }
      })
      setResultado({ ...response.data.data, tipo_calculo: 'inverso' })
    } catch (error) {
      alert('Error calculando')
    }
  }

  const agregarATabla = () => {
    if (!resultado) {
      alert('Primero calcula un resultado')
      return
    }
    setCalculos([...calculos, { id: contadorID, ...resultado }])
    setContadorID(contadorID + 1)
  }

  const limpiarTabla = () => {
    if (window.confirm('¿Limpiar todos los cálculos de la tabla?')) {
      setCalculos([])
      setContadorID(1)
    }
  }

  const calcularTotales = () => {
    return calculos.reduce((acc, calc) => ({
      subtotal: acc.subtotal + calc.subtotal,
      iva: acc.iva + calc.iva,
      ish: acc.ish + (calc.ish || 0),
      retISR: acc.retISR + calc.retencion_isr,
      retIVA: acc.retIVA + calc.retencion_iva,
      total: acc.total + calc.total
    }), { subtotal: 0, iva: 0, ish: 0, retISR: 0, retIVA: 0, total: 0 })
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#e8edf2' }}>
      {/* HEADER */}
      <Box sx={{
        background: 'linear-gradient(135deg, #0c4d7b 0%, #17a2b8 100%)',
        color: 'white',
        p: { xs: 1.5, sm: 2 },
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', sm: 'center' },
        gap: { xs: 1, sm: 0 },
        boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        minHeight: { xs: 'auto', sm: '70px' },
        zIndex: 1000
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 }, flexWrap: 'wrap', width: { xs: '100%', sm: 'auto' } }}>
          <Typography variant="h4" sx={{ 
            fontWeight: 700, 
            fontStyle: 'italic', 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            fontSize: { xs: '1.25rem', sm: '2rem' }
          }}>
            <Calculate sx={{ fontSize: { xs: '1.5rem', sm: '2.2rem' } }} />
            JHVC
            <Box component="span" sx={{
              background: 'rgba(255,255,255,0.3)',
              px: { xs: 1, sm: 2 },
              py: 0.5,
              borderRadius: 1.5,
              fontSize: { xs: '0.8rem', sm: '1.1rem' },
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              ml: { xs: 0.5, sm: 1 }
            }}>
              {user?.full_name || 'Usuario'}
            </Box>
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 }, width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'space-between', sm: 'flex-end' } }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/dashboard')}
            size="small"
            sx={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              px: { xs: 1.5, sm: 2 },
              '&:hover': { background: 'rgba(255,255,255,0.3)' }
            }}
          >
            Dashboard
          </Button>
          <Box sx={{
            width: { xs: 35, sm: 45 },
            height: { xs: 35, sm: 45 },
            borderRadius: '50%',
            background: 'white',
            color: '#0c4d7b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: { xs: '0.9rem', sm: '1.1rem' },
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}>
            {getUserInitials()}
          </Box>
        </Box>
      </Box>

      {/* CONTAINER PRINCIPAL */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        flex: 1, 
        gap: { xs: 1.5, sm: 2.5 },
        p: { xs: 1.5, sm: 2.5 },
        mt: { xs: '120px', sm: '70px' },
        overflow: 'auto'
      }}>
        {/* SIDEBAR IZQUIERDO */}
        <Card sx={{
          width: { xs: '100%', md: 380 },
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 2px 4px rgba(0,0,0,0.12)',
          border: '1px solid #d0d0d0',
          borderRadius: 3,
          overflow: 'hidden'
        }}>
          <Box sx={{ background: '#f5f5f5', p: { xs: 1.5, sm: 2 }, borderBottom: '1px solid #d0d0d0' }}>
            <Typography variant="h6" sx={{ color: '#0c4d7b', fontWeight: 600, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
              🎯 Módulo de Cálculos
            </Typography>
          </Box>

          {/* MENÚ DE OPCIONES */}
          <Box sx={{ p: { xs: 1, sm: 1.5 }, display: 'flex', flexDirection: 'column', gap: 1, borderBottom: '1px solid #d0d0d0' }}>
            <Button
              fullWidth
              variant={metodo === 'quitar-iva' ? 'contained' : 'outlined'}
              onClick={() => setMetodo('quitar-iva')}
              startIcon={<Remove />}
              size="small"
              sx={{ justifyContent: 'flex-start', textTransform: 'none', fontWeight: 500, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
            >
              Quitar IVA
            </Button>
            <Button
              fullWidth
              variant={metodo === 'directo' ? 'contained' : 'outlined'}
              onClick={() => setMetodo('directo')}
              startIcon={<Add />}
              size="small"
              sx={{ justifyContent: 'flex-start', textTransform: 'none', fontWeight: 500, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
            >
              Cálculo Directo
            </Button>
            <Button
              fullWidth
              variant={metodo === 'inverso' ? 'contained' : 'outlined'}
              onClick={() => setMetodo('inverso')}
              startIcon={<Refresh />}
              size="small"
              sx={{ justifyContent: 'flex-start', textTransform: 'none', fontWeight: 500, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
            >
              Cálculo Inverso
            </Button>
          </Box>

          {/* FORMULARIOS */}
          <Box sx={{ flex: 1, overflowY: 'auto', p: { xs: 1.5, sm: 2 } }}>
            {metodo === 'quitar-iva' && (
              <Box>
                <TextField
                  fullWidth
                  label="Precio CON IVA"
                  type="number"
                  value={precioConIVA}
                  onChange={(e) => setPrecioConIVA(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && quitarIVA()}
                  sx={{ mb: 2 }}
                  inputProps={{ step: 0.01 }}
                  size="small"
                  InputProps={{ sx: { fontSize: { xs: '0.85rem', sm: '1rem' } } }}
                  InputLabelProps={{ sx: { fontSize: { xs: '0.85rem', sm: '1rem' } } }}
                />
                <FormControl fullWidth sx={{ mb: 2 }} size="small">
                  <InputLabel sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}>Tasa de IVA</InputLabel>
                  <Select value={tasaIVA} onChange={(e) => setTasaIVA(e.target.value)} sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                    <MenuItem value="0.16">16% (General)</MenuItem>
                    <MenuItem value="0.08">8% (Frontera)</MenuItem>
                    <MenuItem value="0">0% (Exento)</MenuItem>
                  </Select>
                </FormControl>
                <Button fullWidth variant="contained" onClick={quitarIVA} size="small" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                  Calcular
                </Button>
              </Box>
            )}

            {metodo === 'directo' && (
              <Box>
                <TextField
                  fullWidth
                  label="Subtotal"
                  type="number"
                  value={subtotalDirecto}
                  onChange={(e) => setSubtotalDirecto(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && calcularDirecto()}
                  sx={{ mb: 2 }}
                  inputProps={{ step: 0.01 }}
                  size="small"
                  InputProps={{ sx: { fontSize: { xs: '0.85rem', sm: '1rem' } } }}
                  InputLabelProps={{ sx: { fontSize: { xs: '0.85rem', sm: '1rem' } } }}
                />
                <FormControl fullWidth sx={{ mb: 2 }} size="small">
                  <InputLabel sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}>Configuración</InputLabel>
                  <Select value={configDirecto} onChange={(e) => setConfigDirecto(e.target.value)} sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                    {configuraciones.map((config, idx) => (
                      <MenuItem key={idx} value={idx}>{config.descripcion}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="Retención IVA Especial (opcional)"
                  type="number"
                  value={retencionDirecto}
                  onChange={(e) => setRetencionDirecto(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && calcularDirecto()}
                  sx={{ mb: 2 }}
                  inputProps={{ step: 0.01 }}
                  placeholder="0.04 para 4%"
                  size="small"
                  InputProps={{ sx: { fontSize: { xs: '0.85rem', sm: '1rem' } } }}
                  InputLabelProps={{ sx: { fontSize: { xs: '0.85rem', sm: '1rem' } } }}
                />
                <Button fullWidth variant="contained" onClick={calcularDirecto} size="small" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                  Calcular
                </Button>
              </Box>
            )}

            {metodo === 'inverso' && (
              <Box>
                <TextField
                  fullWidth
                  label="Total Final"
                  type="number"
                  value={totalInverso}
                  onChange={(e) => setTotalInverso(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && calcularInverso()}
                  sx={{ mb: 2 }}
                  inputProps={{ step: 0.01 }}
                  size="small"
                  InputProps={{ sx: { fontSize: { xs: '0.85rem', sm: '1rem' } } }}
                  InputLabelProps={{ sx: { fontSize: { xs: '0.85rem', sm: '1rem' } } }}
                />
                <FormControl fullWidth sx={{ mb: 2 }} size="small">
                  <InputLabel sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}>Configuración</InputLabel>
                  <Select value={configInverso} onChange={(e) => setConfigInverso(e.target.value)} sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                    {configuraciones.map((config, idx) => (
                      <MenuItem key={idx} value={idx}>{config.descripcion}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="Retención IVA Especial (opcional)"
                  type="number"
                  value={retencionInverso}
                  onChange={(e) => setRetencionInverso(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && calcularInverso()}
                  sx={{ mb: 2 }}
                  inputProps={{ step: 0.01 }}
                  placeholder="0.04 para 4%"
                  size="small"
                  InputProps={{ sx: { fontSize: { xs: '0.85rem', sm: '1rem' } } }}
                  InputLabelProps={{ sx: { fontSize: { xs: '0.85rem', sm: '1rem' } } }}
                />
                <Button fullWidth variant="contained" onClick={calcularInverso} size="small" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                  Calcular
                </Button>
              </Box>
            )}
          </Box>
        </Card>

        {/* PANEL DERECHO - RESULTADOS */}
        <Card sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.12)', 
          border: '1px solid #d0d0d0', 
          borderRadius: 3, 
          overflow: 'hidden'
        }}>
          <Box sx={{ 
            background: '#f5f5f5', 
            p: { xs: 1.5, sm: 2 }, 
            borderBottom: '1px solid #d0d0d0', 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between', 
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: { xs: 1, sm: 0 }
          }}>
            <Typography variant="h6" sx={{ color: '#0c4d7b', fontWeight: 600, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
              📊 Resultados
            </Typography>
            <Button
              variant="contained"
              size="small"
              startIcon={<Add />}
              onClick={agregarATabla}
              sx={{ textTransform: 'none', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              Agregar a Tabla
            </Button>
          </Box>

          <Box sx={{ flex: 1, overflowY: 'auto', p: { xs: 1.5, sm: 2 } }}>
            {!resultado ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9e9e9e' }}>
                <Typography variant="h3" sx={{ fontSize: { xs: '2rem', sm: '3rem' } }}>📋</Typography>
                <Typography variant="h6" sx={{ mt: 2, color: '#757575', fontSize: { xs: '1rem', sm: '1.25rem' } }}>Sin resultados</Typography>
                <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>Selecciona un método y calcula</Typography>
              </Box>
            ) : (
              <Paper sx={{ p: { xs: 1.5, sm: 2.5 }, background: '#f0f9ff', border: '2px solid #0078d4', borderRadius: 3 }}>
                <Typography variant="h6" sx={{ 
                  color: '#0c4d7b', 
                  fontWeight: 600, 
                  borderBottom: '2px solid #0c4d7b', 
                  pb: 1, 
                  mb: 2,
                  fontSize: { xs: '0.95rem', sm: '1.25rem' }
                }}>
                  Resultado del Cálculo {resultado.tipo_calculo === 'directo' ? 'Directo' : resultado.tipo_calculo === 'inverso' ? 'Inverso' : 'Quitar IVA'}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 2, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{resultado.configuracion}</Typography>
                
                <Grid container spacing={{ xs: 1, sm: 1.5 }}>
                  <Grid item xs={6} md={4}>
                    <Paper sx={{ p: { xs: 1, sm: 1.5 }, cursor: 'pointer', '&:hover': { boxShadow: 2 } }} onClick={() => copiarAlPortapapeles(resultado.subtotal.toFixed(2))}>
                      <Typography variant="caption" sx={{ color: '#616161', fontWeight: 600, textTransform: 'uppercase', fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                        {resultado.tipo_calculo === 'quitar_iva' ? 'Precio SIN IVA' : 'Subtotal'}
                      </Typography>
                      <Typography variant="h6" sx={{ fontFamily: 'monospace', fontWeight: 700, fontSize: { xs: '0.9rem', sm: '1.25rem' } }}>
                        ${resultado.subtotal.toFixed(2)}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <Paper sx={{ p: { xs: 1, sm: 1.5 }, cursor: 'pointer', '&:hover': { boxShadow: 2 } }} onClick={() => copiarAlPortapapeles(resultado.iva.toFixed(2))}>
                      <Typography variant="caption" sx={{ color: '#616161', fontWeight: 600, textTransform: 'uppercase', fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>IVA</Typography>
                      <Typography variant="h6" sx={{ fontFamily: 'monospace', fontWeight: 700, fontSize: { xs: '0.9rem', sm: '1.25rem' } }}>
                        ${resultado.iva.toFixed(2)}
                      </Typography>
                    </Paper>
                  </Grid>
                  {resultado.ish > 0 && (
                    <Grid item xs={6} md={4}>
                      <Paper sx={{ p: { xs: 1, sm: 1.5 }, cursor: 'pointer', '&:hover': { boxShadow: 2 } }} onClick={() => copiarAlPortapapeles(resultado.ish.toFixed(2))}>
                        <Typography variant="caption" sx={{ color: '#616161', fontWeight: 600, textTransform: 'uppercase', fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>ISH (5%)</Typography>
                        <Typography variant="h6" sx={{ fontFamily: 'monospace', fontWeight: 700, fontSize: { xs: '0.9rem', sm: '1.25rem' } }}>
                          ${resultado.ish.toFixed(2)}
                        </Typography>
                      </Paper>
                    </Grid>
                  )}
                  {resultado.tipo_calculo !== 'quitar_iva' && (
                    <>
                      <Grid item xs={6} md={4}>
                        <Paper sx={{ p: { xs: 1, sm: 1.5 }, cursor: 'pointer', '&:hover': { boxShadow: 2 } }} onClick={() => copiarAlPortapapeles(resultado.retencion_isr.toFixed(2))}>
                          <Typography variant="caption" sx={{ color: '#616161', fontWeight: 600, textTransform: 'uppercase', fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>Ret. ISR</Typography>
                          <Typography variant="h6" sx={{ fontFamily: 'monospace', fontWeight: 700, fontSize: { xs: '0.9rem', sm: '1.25rem' } }}>
                            -${resultado.retencion_isr.toFixed(2)}
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={6} md={4}>
                        <Paper sx={{ p: { xs: 1, sm: 1.5 }, cursor: 'pointer', '&:hover': { boxShadow: 2 } }} onClick={() => copiarAlPortapapeles(resultado.retencion_iva.toFixed(2))}>
                          <Typography variant="caption" sx={{ color: '#616161', fontWeight: 600, textTransform: 'uppercase', fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>Ret. IVA</Typography>
                          <Typography variant="h6" sx={{ fontFamily: 'monospace', fontWeight: 700, fontSize: { xs: '0.9rem', sm: '1.25rem' } }}>
                            -${resultado.retencion_iva.toFixed(2)}
                          </Typography>
                        </Paper>
                      </Grid>
                    </>
                  )}
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: { xs: 1, sm: 1.5 }, background: '#0c4d7b', color: 'white', cursor: 'pointer', '&:hover': { boxShadow: 4 } }} onClick={() => copiarAlPortapapeles(resultado.total.toFixed(2))}>
                      <Typography variant="caption" sx={{ fontWeight: 600, textTransform: 'uppercase', opacity: 0.9, fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                        {resultado.tipo_calculo === 'quitar_iva' ? 'Precio CON IVA' : 'TOTAL'}
                      </Typography>
                      <Typography variant="h5" sx={{ fontFamily: 'monospace', fontWeight: 700, fontSize: { xs: '1.1rem', sm: '1.5rem' } }}>
                        ${resultado.total.toFixed(2)}
                      </Typography>
                    </Paper>
                  </Grid>
                  {resultado.factor > 0 && (
                    <Grid item xs={6} md={4}>
                      <Paper sx={{ p: { xs: 1, sm: 1.5 }, cursor: 'pointer', '&:hover': { boxShadow: 2 } }} onClick={() => copiarAlPortapapeles(resultado.factor.toFixed(6))}>
                        <Typography variant="caption" sx={{ color: '#616161', fontWeight: 600, textTransform: 'uppercase', fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>Factor</Typography>
                        <Typography variant="h6" sx={{ fontFamily: 'monospace', fontWeight: 700, fontSize: { xs: '0.9rem', sm: '1.25rem' } }}>
                          {resultado.factor.toFixed(6)}
                        </Typography>
                      </Paper>
                    </Grid>
                  )}
                </Grid>
              </Paper>
            )}

            {/* TABLA DE CÁLCULOS MÚLTIPLES */}
            {calculos.length > 0 && (
              <Box sx={{ mt: { xs: 2, sm: 2.5 }, pt: { xs: 2, sm: 2.5 }, borderTop: '2px solid #d0d0d0' }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, mb: 1.5, gap: { xs: 1, sm: 0 } }}>
                  <Typography variant="h6" sx={{ color: '#0c4d7b', fontWeight: 600, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                    📊 Registro de Cálculos Múltiples
                  </Typography>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<Delete />}
                    onClick={limpiarTabla}
                    sx={{ textTransform: 'none', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                  >
                    Limpiar
                  </Button>
                </Box>
                <Box sx={{ overflowX: 'auto' }}>
                  <Box component="table" sx={{ 
                    width: '100%', 
                    minWidth: { xs: 600, sm: 800 },
                    borderCollapse: 'collapse', 
                    background: 'white', 
                    border: '1px solid #d0d0d0', 
                    borderRadius: 3, 
                    overflow: 'hidden',
                    fontSize: { xs: '0.7rem', sm: '0.75rem' }
                  }}>
                    <Box component="thead" sx={{ background: '#f5f5f5', borderBottom: '2px solid #d0d0d0' }}>
                      <tr>
                        {['#', 'Tipo', 'Config', 'Subtotal', 'IVA', 'ISH', 'Ret. ISR', 'Ret. IVA', 'Total'].map((header) => (
                          <Box component="th" key={header} sx={{ 
                            padding: { xs: '6px 4px', sm: '10px 8px' },
                            textAlign: 'left', 
                            fontWeight: 600, 
                            color: '#424242', 
                            fontSize: { xs: '0.65rem', sm: '0.75rem' },
                            textTransform: 'uppercase',
                            borderRight: '1px solid #d0d0d0'
                          }}>
                            {header}
                          </Box>
                        ))}
                      </tr>
                    </Box>
                    <tbody>
                      {calculos.map((calc) => (
                        <tr key={calc.id} style={{ borderBottom: '1px solid #d0d0d0' }}>
                          <td style={{ padding: '6px 4px', fontFamily: 'monospace', fontSize: 'inherit', borderRight: '1px solid #d0d0d0' }}>{calc.id}</td>
                          <td style={{ padding: '6px 4px', fontSize: 'inherit', borderRight: '1px solid #d0d0d0' }}>{calc.tipo_calculo}</td>
                          <td style={{ padding: '6px 4px', fontSize: 'inherit', borderRight: '1px solid #d0d0d0' }}><small>{calc.configuracion}</small></td>
                          <td style={{ padding: '6px 4px', fontFamily: 'monospace', fontSize: 'inherit', borderRight: '1px solid #d0d0d0' }}>${calc.subtotal.toFixed(2)}</td>
                          <td style={{ padding: '6px 4px', fontFamily: 'monospace', fontSize: 'inherit', borderRight: '1px solid #d0d0d0' }}>${calc.iva.toFixed(2)}</td>
                          <td style={{ padding: '6px 4px', fontFamily: 'monospace', fontSize: 'inherit', borderRight: '1px solid #d0d0d0' }}>${(calc.ish || 0).toFixed(2)}</td>
                          <td style={{ padding: '6px 4px', fontFamily: 'monospace', fontSize: 'inherit', borderRight: '1px solid #d0d0d0' }}>-${calc.retencion_isr.toFixed(2)}</td>
                          <td style={{ padding: '6px 4px', fontFamily: 'monospace', fontSize: 'inherit', borderRight: '1px solid #d0d0d0' }}>-${calc.retencion_iva.toFixed(2)}</td>
                          <td style={{ padding: '6px 4px', fontFamily: 'monospace', fontSize: 'inherit', fontWeight: 600 }}><strong>${calc.total.toFixed(2)}</strong></td>
                        </tr>
                      ))}
                    </tbody>
                    <Box component="tfoot" sx={{ background: '#e3f2fd', fontWeight: 700, borderTop: '2px solid #0c4d7b' }}>
                      <tr>
                        <td colSpan={3} style={{ padding: '8px 6px', color: '#0c4d7b', fontSize: 'inherit', borderRight: '1px solid #d0d0d0' }}><strong>TOTALES:</strong></td>
                        <td style={{ padding: '8px 6px', color: '#0c4d7b', fontSize: 'inherit', borderRight: '1px solid #d0d0d0' }}><strong>${calcularTotales().subtotal.toFixed(2)}</strong></td>
                        <td style={{ padding: '8px 6px', color: '#0c4d7b', fontSize: 'inherit', borderRight: '1px solid #d0d0d0' }}><strong>${calcularTotales().iva.toFixed(2)}</strong></td>
                        <td style={{ padding: '8px 6px', color: '#0c4d7b', fontSize: 'inherit', borderRight: '1px solid #d0d0d0' }}><strong>${calcularTotales().ish.toFixed(2)}</strong></td>
                        <td style={{ padding: '8px 6px', color: '#0c4d7b', fontSize: 'inherit', borderRight: '1px solid #d0d0d0' }}><strong>-${calcularTotales().retISR.toFixed(2)}</strong></td>
                        <td style={{ padding: '8px 6px', color: '#0c4d7b', fontSize: 'inherit', borderRight: '1px solid #d0d0d0' }}><strong>-${calcularTotales().retIVA.toFixed(2)}</strong></td>
                        <td style={{ padding: '8px 6px', color: '#0c4d7b', fontSize: 'inherit' }}><strong>${calcularTotales().total.toFixed(2)}</strong></td>
                      </tr>
                    </Box>
                  </Box>
                </Box>
              </Box>
            )}

            {/* CONFIGURACIONES DISPONIBLES */}
            <Box sx={{ mt: { xs: 2, sm: 2.5 }, pt: { xs: 2, sm: 2.5 }, borderTop: '2px solid #d0d0d0' }}>
              <Typography variant="h6" sx={{ color: '#0c4d7b', mb: 1.5, fontSize: { xs: '0.85rem', sm: '0.95rem' }, fontWeight: 600 }}>
                ⚙️ Configuraciones Fiscales Disponibles
              </Typography>
              <Grid container spacing={{ xs: 1, sm: 1.25 }} sx={{ maxHeight: { xs: 200, sm: 300 }, overflowY: 'auto' }}>
                {configuraciones.map((config, idx) => (
                  <Grid item xs={12} sm={6} md={4} key={idx}>
                    <Paper sx={{ 
                      p: { xs: 1, sm: 1.5 },
                      borderLeft: '3px solid #0c4d7b', 
                      '&:hover': { boxShadow: 2, borderLeftColor: '#0078d4' },
                      transition: 'all 0.2s'
                    }}>
                      <Typography variant="body2" sx={{ color: '#0c4d7b', fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.85rem' }, mb: 0.5 }}>
                        {config.descripcion}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#616161', fontSize: { xs: '0.65rem', sm: '0.75rem' }, lineHeight: 1.5 }}>
                        IVA: {(config.iva_rate * 100).toFixed(2)}% | ISR: {(config.isr_rate * 100).toFixed(2)}% | ISH: {(config.ish_rate * 100).toFixed(2)}% | Ret. IVA: {config.iva_retencion ? '2/3 del IVA' : 'No'}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        </Card>
      </Box>
    </Box>
  )
}

export default Calculadora