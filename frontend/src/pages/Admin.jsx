import { useState, useEffect } from 'react'
import { Box, Container, Typography, Tabs, Tab, Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, FormControl, InputLabel, IconButton } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { motion } from 'framer-motion'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import DownloadIcon from '@mui/icons-material/Download'
import InfoIcon from '@mui/icons-material/Info'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import api from '../services/api'

const MotionBox = motion(Box)

const Admin = () => {
  const [tab, setTab] = useState(0)
  const [users, setUsers] = useState([])
  const [codes, setCodes] = useState([])
  const [licenses, setLicenses] = useState([])
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogType, setDialogType] = useState('')
  const [selectedLicense, setSelectedLicense] = useState(null)
  const [detailsDialog, setDetailsDialog] = useState(false)
  const [detailsData, setDetailsData] = useState({ devices: [], modules: [] })

  // Form states
  const [codeForm, setCodeForm] = useState({ max_uses: 1, days_valid: 0 })
  const [licenseForm, setLicenseForm] = useState({
    client_name: '',
    client_email: '',
    max_devices: 1,
    days_valid: 365,
    notes: '',
    modules: []
  })
  const [editLicenseForm, setEditLicenseForm] = useState({
    id: null,
    client_name: '',
    client_email: '',
    max_devices: 1,
    days_valid: 365,
    notes: '',
    is_active: true
  })

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

  // USUARIOS COLUMNS
  const usersColumns = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'full_name', headerName: 'Nombre', width: 200 },
    { field: 'email', headerName: 'Email', width: 250 },
    {
      field: 'is_active',
      headerName: 'Estado',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Activo' : 'Inactivo'}
          color={params.value ? 'success' : 'error'}
          size="small"
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 150,
      renderCell: (params) => (
        !params.row.is_admin && (
          <Button
            size="small"
            variant="contained"
            color={params.row.is_active ? 'error' : 'success'}
            onClick={() => toggleUserStatus(params.row.id, !params.row.is_active)}
          >
            {params.row.is_active ? 'Desactivar' : 'Activar'}
          </Button>
        )
      )
    }
  ]

  // CÓDIGOS COLUMNS
  const codesColumns = [
    { field: 'code', headerName: 'Código', width: 200, renderCell: (params) => <code>{params.value}</code> },
    {
      field: 'uses',
      headerName: 'Usos',
      width: 150,
      valueGetter: (params) => `${params.row.current_uses} / ${params.row.max_uses}`
    },
    {
      field: 'is_active',
      headerName: 'Estado',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Activo' : 'Inactivo'}
          color={params.value ? 'success' : 'error'}
          size="small"
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 150,
      renderCell: (params) => (
        <Button
          size="small"
          variant="contained"
          color={params.row.is_active ? 'error' : 'success'}
          onClick={() => toggleCodeStatus(params.row.id, !params.row.is_active)}
        >
          {params.row.is_active ? 'Desactivar' : 'Activar'}
        </Button>
      )
    }
  ]

  // LICENCIAS COLUMNS
  const licensesColumns = [
    { field: 'client_name', headerName: 'Cliente', width: 180, renderCell: (params) => <strong>{params.value}</strong> },
    {
      field: 'modules',
      headerName: 'Módulos',
      width: 200,
      valueGetter: (params) => params.value?.join(', ') || 'Sin módulos'
    },
    {
      field: 'license_code',
      headerName: 'Código',
      width: 180,
      renderCell: (params) => (
        <Box
          sx={{
            fontFamily: 'monospace',
            fontWeight: 'bold',
            cursor: 'pointer',
            background: '#f5f5f5',
            padding: '4px 8px',
            borderRadius: '4px'
          }}
          onClick={() => {
            navigator.clipboard.writeText(params.value)
            alert('✅ Código copiado')
          }}
        >
          {params.value}
        </Box>
      )
    },
    {
      field: 'devices',
      headerName: 'Dispositivos',
      width: 120,
      valueGetter: (params) => `${params.row.current_devices} / ${params.row.max_devices}`
    },
    {
      field: 'expires_at',
      headerName: 'Expira',
      width: 120,
      valueGetter: (params) => params.value ? new Date(params.value).toLocaleDateString() : 'Sin límite'
    },
    {
      field: 'is_active',
      headerName: 'Estado',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Activa' : 'Inactiva'}
          color={params.value ? 'success' : 'error'}
          size="small"
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 300,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton
            size="small"
            color="primary"
            onClick={() => viewDetails(params.row.id)}
            title="Ver detalles"
          >
            <InfoIcon />
          </IconButton>
          <IconButton
            size="small"
            color="warning"
            onClick={() => handleEditLicense(params.row)}
            title="Editar"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            color={params.row.is_active ? 'warning' : 'success'}
            onClick={() => toggleLicenseStatus(params.row.id, !params.row.is_active)}
            title={params.row.is_active ? 'Pausar' : 'Activar'}
          >
            {params.row.is_active ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>
          <IconButton
            size="small"
            color="success"
            onClick={() => downloadLicenseJSON(params.row.license_code, params.row.modules?.[0] || 'CALCULADORA')}
            title="Descargar license.json"
          >
            <DownloadIcon />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => deleteLicense(params.row.id)}
            title="Eliminar"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      )
    }
  ]

  // HANDLERS
  const toggleUserStatus = async (userId, isActive) => {
    try {
      await api.put(`/admin/users/${userId}/status`, { is_active: isActive })
      loadData()
    } catch (error) {
      alert('Error actualizando usuario')
    }
  }

  const toggleCodeStatus = async (codeId, isActive) => {
    try {
      await api.put(`/admin/codes/${codeId}/status`, { is_active: isActive })
      loadData()
    } catch (error) {
      alert('Error actualizando código')
    }
  }

  const toggleLicenseStatus = async (licenseId, isActive) => {
    try {
      await api.put(`/admin/product-licenses/${licenseId}/status`, { is_active: isActive })
      loadData()
    } catch (error) {
      alert('Error actualizando licencia')
    }
  }

  const handleCreateCode = async () => {
    try {
      const response = await api.post('/admin/codes', codeForm)
      alert('Código creado: ' + response.data.data.code)
      navigator.clipboard.writeText(response.data.data.code)
      setOpenDialog(false)
      setCodeForm({ max_uses: 1, days_valid: 0 })
      loadData()
    } catch (error) {
      alert('Error creando código')
    }
  }

  const handleCreateLicense = async () => {
    if (licenseForm.modules.length === 0) {
      alert('Debes seleccionar al menos un módulo')
      return
    }

    try {
      const response = await api.post('/admin/product-licenses', licenseForm)
      alert(`Licencia creada!\n\nCódigo: ${response.data.data.license_code}\nMódulos: ${licenseForm.modules.join(', ')}`)
      navigator.clipboard.writeText(response.data.data.license_code)
      setOpenDialog(false)
      setLicenseForm({ client_name: '', client_email: '', max_devices: 1, days_valid: 365, notes: '', modules: [] })
      loadData()
    } catch (error) {
      alert('Error creando licencia')
    }
  }

  const handleEditLicense = (license) => {
    const daysLeft = license.expires_at
      ? Math.ceil((new Date(license.expires_at) - new Date()) / (1000 * 60 * 60 * 24))
      : 0

    setEditLicenseForm({
      id: license.id,
      client_name: license.client_name,
      client_email: license.client_email || '',
      max_devices: license.max_devices,
      days_valid: Math.max(0, daysLeft),
      notes: license.notes || '',
      is_active: license.is_active
    })
    setDialogType('editLicense')
    setOpenDialog(true)
  }

  const handleUpdateLicense = async () => {
    try {
      await api.put(`/admin/product-licenses/${editLicenseForm.id}`, editLicenseForm)
      alert('Licencia actualizada')
      setOpenDialog(false)
      loadData()
    } catch (error) {
      alert('Error actualizando licencia')
    }
  }

  const deleteLicense = async (licenseId) => {
    if (!confirm('⚠️ ¿ELIMINAR esta licencia PERMANENTEMENTE?\n\nEsto eliminará:\n- La licencia\n- Todos los dispositivos\n- Todos los módulos\n\n¿Continuar?')) return
    if (!confirm('🔴 CONFIRMACIÓN FINAL\n\n¿Estás COMPLETAMENTE SEGURO?')) return

    try {
      await api.delete(`/admin/product-licenses/${licenseId}`)
      alert('✅ Licencia eliminada')
      loadData()
    } catch (error) {
      alert('❌ Error eliminando licencia')
    }
  }

  const viewDetails = async (licenseId) => {
    try {
      const [devicesResp, modulesResp] = await Promise.all([
        api.get(`/admin/licenses/${licenseId}/devices`),
        api.get(`/admin/licenses/${licenseId}/modules`)
      ])

      setDetailsData({
        devices: devicesResp.data.data || [],
        modules: modulesResp.data.data || [],
        licenseId
      })
      setDetailsDialog(true)
    } catch (error) {
      alert('Error cargando detalles')
    }
  }

  const downloadLicenseJSON = (licenseCode, moduleName) => {
    const jsonContent = {
      license_code: licenseCode,
      product_name: moduleName,
      activation_url: "https://jhvc-backend-production.up.railway.app/api/verify-license"
    }

    const blob = new Blob([JSON.stringify(jsonContent, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `license.json`
    a.click()
    URL.revokeObjectURL(url)
    alert(`✅ Archivo license.json descargado`)
  }

  const removeDevice = async (deviceId) => {
    if (!confirm('¿Eliminar este dispositivo?')) return
    try {
      await api.delete(`/admin/licenses/${detailsData.licenseId}/devices/${deviceId}`)
      setDetailsDialog(false)
      loadData()
      alert('Dispositivo eliminado')
    } catch (error) {
      alert('Error eliminando dispositivo')
    }
  }

  const removeModule = async (moduleId) => {
    if (!confirm('¿Quitar este módulo?')) return
    try {
      await api.delete(`/admin/licenses/${detailsData.licenseId}/modules/${moduleId}`)
      setDetailsDialog(false)
      loadData()
      alert('Módulo eliminado')
    } catch (error) {
      alert('Error eliminando módulo')
    }
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* HEADER */}
      <MotionBox
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        sx={{
          background: 'linear-gradient(135deg, #0c4d7b, #17a2b8)',
          color: 'white',
          p: 3,
          borderRadius: 2,
          mb: 3
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          🛡️ Panel de Administración
        </Typography>
        <Typography variant="body1">
          Gestión de Licencias y Usuarios - JHVC Tech Solutions
        </Typography>
      </MotionBox>

      {/* TABS */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tab} onChange={(e, v) => setTab(v)}>
          <Tab label="Usuarios" />
          <Tab label="Códigos de Invitación" />
          <Tab label="Licencias de Productos" />
        </Tabs>
      </Box>

      {/* USUARIOS TAB */}
      {tab === 0 && (
        <Box sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={users}
            columns={usersColumns}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            disableSelectionOnClick
            sx={{
              '& .MuiDataGrid-cell:hover': {
                color: '#0c4d7b'
              }
            }}
          />
        </Box>
      )}

      {/* CÓDIGOS TAB */}
      {tab === 1 && (
        <Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setDialogType('code')
              setOpenDialog(true)
            }}
            sx={{
              mb: 2,
              background: 'linear-gradient(135deg, #0c4d7b, #17a2b8)',
              '&:hover': {
                background: 'linear-gradient(135deg, #17a2b8, #0c4d7b)'
              }
            }}
          >
            Generar Código
          </Button>
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={codes}
              columns={codesColumns}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              disableSelectionOnClick
            />
          </Box>
        </Box>
      )}

      {/* LICENCIAS TAB */}
      {tab === 2 && (
        <Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setDialogType('license')
              setOpenDialog(true)
            }}
            sx={{
              mb: 2,
              background: 'linear-gradient(135deg, #0c4d7b, #17a2b8)',
              '&:hover': {
                background: 'linear-gradient(135deg, #17a2b8, #0c4d7b)'
              }
            }}
          >
            Crear Licencia
          </Button>
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={licenses}
              columns={licensesColumns}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              disableSelectionOnClick
            />
          </Box>
        </Box>
      )}

      {/* DIALOG CREAR CÓDIGO */}
      <Dialog open={openDialog && dialogType === 'code'} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Generar Código de Invitación</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Máximo de Usos"
            type="number"
            value={codeForm.max_uses}
            onChange={(e) => setCodeForm({ ...codeForm, max_uses: parseInt(e.target.value) })}
            sx={{ mt: 2, mb: 2 }}
          />
          <TextField
            fullWidth
            label="Días de Validez (0 = sin límite)"
            type="number"
            value={codeForm.days_valid}
            onChange={(e) => setCodeForm({ ...codeForm, days_valid: parseInt(e.target.value) })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleCreateCode} variant="contained">Crear</Button>
        </DialogActions>
      </Dialog>

      {/* DIALOG CREAR LICENCIA */}
      <Dialog open={openDialog && dialogType === 'license'} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Crear Licencia de Producto</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Cliente *"
            value={licenseForm.client_name}
            onChange={(e) => setLicenseForm({ ...licenseForm, client_name: e.target.value })}
            sx={{ mt: 2, mb: 2 }}
            required
          />
          <TextField
            fullWidth
            label="Email del Cliente"
            type="email"
            value={licenseForm.client_email}
            onChange={(e) => setLicenseForm({ ...licenseForm, client_email: e.target.value })}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Módulos *</InputLabel>
            <Select
              multiple
              value={licenseForm.modules}
              onChange={(e) => setLicenseForm({ ...licenseForm, modules: e.target.value })}
            >
              <MenuItem value="CALCULADORA">Calculadora Fiscal</MenuItem>
              <MenuItem value="VISOR">Visor CFDI</MenuItem>
              <MenuItem value="CONTABILIDAD">Contabilidad</MenuItem>
              <MenuItem value="NOMINA">Nómina</MenuItem>
              <MenuItem value="FACTURACION">Facturación</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Máximo de Dispositivos"
            type="number"
            value={licenseForm.max_devices}
            onChange={(e) => setLicenseForm({ ...licenseForm, max_devices: parseInt(e.target.value) })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Días de Validez (0 = sin límite)"
            type="number"
            value={licenseForm.days_valid}
            onChange={(e) => setLicenseForm({ ...licenseForm, days_valid: parseInt(e.target.value) })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Notas"
            multiline
            rows={3}
            value={licenseForm.notes}
            onChange={(e) => setLicenseForm({ ...licenseForm, notes: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleCreateLicense} variant="contained">Crear</Button>
        </DialogActions>
      </Dialog>

      {/* DIALOG EDITAR LICENCIA */}
      <Dialog open={openDialog && dialogType === 'editLicense'} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Licencia</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Cliente *"
            value={editLicenseForm.client_name}
            onChange={(e) => setEditLicenseForm({ ...editLicenseForm, client_name: e.target.value })}
            sx={{ mt: 2, mb: 2 }}
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={editLicenseForm.client_email}
            onChange={(e) => setEditLicenseForm({ ...editLicenseForm, client_email: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Máximo de Dispositivos"
            type="number"
            value={editLicenseForm.max_devices}
            onChange={(e) => setEditLicenseForm({ ...editLicenseForm, max_devices: parseInt(e.target.value) })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Días de Validez"
            type="number"
            value={editLicenseForm.days_valid}
            onChange={(e) => setEditLicenseForm({ ...editLicenseForm, days_valid: parseInt(e.target.value) })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Notas"
            multiline
            rows={3}
            value={editLicenseForm.notes}
            onChange={(e) => setEditLicenseForm({ ...editLicenseForm, notes: e.target.value })}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth>
            <InputLabel>Estado</InputLabel>
            <Select
              value={editLicenseForm.is_active}
              onChange={(e) => setEditLicenseForm({ ...editLicenseForm, is_active: e.target.value })}
            >
              <MenuItem value={true}>Activa</MenuItem>
              <MenuItem value={false}>Inactiva</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleUpdateLicense} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>

      {/* DIALOG DETALLES */}
      <Dialog open={detailsDialog} onClose={() => setDetailsDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Detalles de Licencia</DialogTitle>
        <DialogContent>
          <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>Dispositivos Registrados:</Typography>
          {detailsData.devices.length > 0 ? (
            detailsData.devices.map((device) => (
              <Box key={device.id} sx={{ mb: 2, p: 2, background: '#f5f5f5', borderRadius: 2 }}>
                <Typography variant="body1"><strong>{device.device_name || 'Sin nombre'}</strong></Typography>
                <Typography variant="caption">ID: {device.machine_id.substring(0, 30)}...</Typography><br/>
                <Typography variant="caption">Último check: {new Date(device.last_check).toLocaleString()}</Typography><br/>
                <Button size="small" color="error" onClick={() => removeDevice(device.id)} sx={{ mt: 1 }}>Eliminar</Button>
              </Box>
            ))
          ) : (
            <Typography>No hay dispositivos registrados</Typography>
          )}

          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Módulos Asignados:</Typography>
          {detailsData.modules.length > 0 ? (
            detailsData.modules.map((module) => (
              <Box key={module.id} sx={{ mb: 1, p: 1.5, background: '#f5f5f5', borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography><strong>{module.module_name}</strong></Typography>
                <Button size="small" color="error" onClick={() => removeModule(module.id)}>Quitar</Button>
              </Box>
            ))
          ) : (
            <Typography>No hay módulos asignados</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialog(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default Admin