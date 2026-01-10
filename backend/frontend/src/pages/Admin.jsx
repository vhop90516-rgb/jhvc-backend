import { useState, useEffect } from 'react'
import { Box, Container, Typography, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material'
import api from '../services/api'

const Admin = () => {
  const [tab, setTab] = useState(0)
  const [users, setUsers] = useState([])
  const [codes, setCodes] = useState([])
  const [licenses, setLicenses] = useState([])
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogType, setDialogType] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [usersRes, codesRes, licensesRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/codes'),
        api.get('/admin/product-licenses')
      ])
      setUsers(usersRes.data.data || [])
      setCodes(codesRes.data.data || [])
      setLicenses(licensesRes.data.data || [])
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleCreateLicense = () => {
    setDialogType('license')
    setOpenDialog(true)
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ background: 'linear-gradient(135deg, #0c4d7b, #17a2b8)', color: 'white', p: 3, borderRadius: 2, mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Panel de Administración
        </Typography>
        <Typography variant="body1">
          Gestión de Licencias y Usuarios
        </Typography>
      </Box>

      <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="Usuarios" />
        <Tab label="Códigos" />
        <Tab label="Licencias" />
      </Tabs>

      {/* USUARIOS */}
      {tab === 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.full_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip 
                      label={user.is_active ? 'Activo' : 'Inactivo'} 
                      color={user.is_active ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* CÓDIGOS */}
      {tab === 1 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Código</TableCell>
                <TableCell>Usos</TableCell>
                <TableCell>Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {codes.map((code) => (
                <TableRow key={code.id}>
                  <TableCell><code>{code.code}</code></TableCell>
                  <TableCell>{code.current_uses} / {code.max_uses}</TableCell>
                  <TableCell>
                    <Chip 
                      label={code.is_active ? 'Activo' : 'Inactivo'} 
                      color={code.is_active ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* LICENCIAS */}
      {tab === 2 && (
        <Box>
          <Button variant="contained" onClick={handleCreateLicense} sx={{ mb: 2 }}>
            Crear Licencia
          </Button>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Módulos</TableCell>
                  <TableCell>Código</TableCell>
                  <TableCell>Dispositivos</TableCell>
                  <TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {licenses.map((lic) => (
                  <TableRow key={lic.id}>
                    <TableCell><strong>{lic.client_name}</strong></TableCell>
                    <TableCell>{lic.modules?.join(', ') || 'Sin módulos'}</TableCell>
                    <TableCell><code>{lic.license_code}</code></TableCell>
                    <TableCell>{lic.current_devices} / {lic.max_devices}</TableCell>
                    <TableCell>
                      <Chip 
                        label={lic.is_active ? 'Activa' : 'Inactiva'} 
                        color={lic.is_active ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Container>
  )
}

export default Admin