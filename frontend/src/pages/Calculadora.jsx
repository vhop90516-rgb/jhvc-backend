import { useState, useEffect } from 'react'
import { Box, Container, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel, Card, CardContent, Grid, Paper } from '@mui/material'
import api from '../services/api'

const Calculadora = () => {
  const [configuraciones, setConfiguraciones] = useState([])
  const [metodo, setMetodo] = useState('quitar-iva')
  const [resultado, setResultado] = useState(null)
  
  const [precioConIVA, setPrecioConIVA] = useState('')
  const [tasaIVA, setTasaIVA] = useState('0.16')
  
  const [subtotalDirecto, setSubtotalDirecto] = useState('')
  const [configDirecto, setConfigDirecto] = useState(0)
  
  const [totalInverso, setTotalInverso] = useState('')
  const [configInverso, setConfigInverso] = useState(0)

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
      total: precio,
      tipo: 'Quitar IVA'
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
          retencion_especial: 0
        }
      })
      setResultado({ ...response.data.data, tipo: 'Directo' })
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
          retencion_especial: 0
        }
      })
      setResultado({ ...response.data.data, tipo: 'Inverso' })
    } catch (error) {
      alert('Error calculando')
    }
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ background: 'linear-gradient(135deg, #0c4d7b, #17a2b8)', color: 'white', p: 3, borderRadius: 2, mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Calculadora Fiscal
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Button 
                fullWidth 
                variant={metodo === 'quitar-iva' ? 'contained' : 'outlined'}
                onClick={() => setMetodo('quitar-iva')}
                sx={{ mb: 1 }}
              >
                Quitar IVA
              </Button>
              <Button 
                fullWidth 
                variant={metodo === 'directo' ? 'contained' : 'outlined'}
                onClick={() => setMetodo('directo')}
                sx={{ mb: 1 }}
              >
                Cálculo Directo
              </Button>
              <Button 
                fullWidth 
                variant={metodo === 'inverso' ? 'contained' : 'outlined'}
                onClick={() => setMetodo('inverso')}
              >
                Cálculo Inverso
              </Button>
            </CardContent>
          </Card>

          <Card sx={{ mt: 2 }}>
            <CardContent>
              {metodo === 'quitar-iva' && (
                <Box>
                  <TextField
                    fullWidth
                    label="Precio CON IVA"
                    type="number"
                    value={precioConIVA}
                    onChange={(e) => setPrecioConIVA(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Tasa de IVA</InputLabel>
                    <Select value={tasaIVA} onChange={(e) => setTasaIVA(e.target.value)}>
                      <MenuItem value="0.16">16% (General)</MenuItem>
                      <MenuItem value="0.08">8% (Frontera)</MenuItem>
                      <MenuItem value="0">0% (Exento)</MenuItem>
                    </Select>
                  </FormControl>
                  <Button fullWidth variant="contained" onClick={quitarIVA}>
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
                    sx={{ mb: 2 }}
                  />
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Configuración</InputLabel>
                    <Select value={configDirecto} onChange={(e) => setConfigDirecto(e.target.value)}>
                      {configuraciones.map((config, idx) => (
                        <MenuItem key={idx} value={idx}>{config.descripcion}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button fullWidth variant="contained" onClick={calcularDirecto}>
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
                    sx={{ mb: 2 }}
                  />
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Configuración</InputLabel>
                    <Select value={configInverso} onChange={(e) => setConfigInverso(e.target.value)}>
                      {configuraciones.map((config, idx) => (
                        <MenuItem key={idx} value={idx}>{config.descripcion}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button fullWidth variant="contained" onClick={calcularInverso}>
                    Calcular
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          {resultado ? (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ color: '#0c4d7b', mb: 3 }}>
                Resultado - {resultado.tipo}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} md={4}>
                  <Box sx={{ p: 2, background: '#f5f5f5', borderRadius: 2 }}>
                    <Typography variant="caption" color="text.secondary">SUBTOTAL</Typography>
                    <Typography variant="h6" sx={{ fontFamily: 'monospace' }}>
                      ${resultado.subtotal?.toFixed(2)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={4}>
                  <Box sx={{ p: 2, background: '#f5f5f5', borderRadius: 2 }}>
                    <Typography variant="caption" color="text.secondary">IVA</Typography>
                    <Typography variant="h6" sx={{ fontFamily: 'monospace' }}>
                      ${resultado.iva?.toFixed(2)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={4}>
                  <Box sx={{ p: 2, background: '#0c4d7b', borderRadius: 2, color: 'white' }}>
                    <Typography variant="caption">TOTAL</Typography>
                    <Typography variant="h6" sx={{ fontFamily: 'monospace' }}>
                      ${resultado.total?.toFixed(2)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          ) : (
            <Paper sx={{ p: 3, textAlign: 'center', color: '#999' }}>
              <Typography>📋 Sin resultados</Typography>
              <Typography variant="body2">Selecciona un método y calcula</Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  )
}

export default Calculadora