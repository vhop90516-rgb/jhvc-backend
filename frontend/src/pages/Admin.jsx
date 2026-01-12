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
import api from '../services/api'

const MotionBox = motion(Box)

const Admin = () => {
  const [tab, setTab] = useState(0)
  const [users, setUsers] = useState([])
  const [codes, setCodes] = useState([])
  const [licenses, setLicenses] = useState([])
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogType, setDialogType] = useState('')
  const [detailsDialog, setDetailsDialog] = useState(false)
  const [detailsData, setDetailsData] = useState({ devices: [], modules: [], licenseId: null })

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
    { field: 'id', headerName: 'ID', width: 80, hide: true },
    { field: 'full_name', headerName: 'Nombre', flex: 1, minWidth: 150 },
    { field: 'email', headerName: 'Email', flex: 1, minWidth: 200 },
    {
      field: 'is_active',
      headerName: 'Estado',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Activo' : 'Inactivo'}
          color={params.value ? 'success' : 'error'}
          size="small"
          sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 130,
      renderCell: (params) => (
        !params.row.is_admin && (
          <Button
            size="small"
            variant="contained"
            color={params.row.is_active ? 'error' : 'success'}
            onClick={() => toggleUserStatus(params.row.id, !params.row.is_active)}
            sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' }, px: { xs: 1, sm: 2 } }}
          >
            {params.row.is_active ? 'Desactivar' : 'Activar'}
          </Button>
        )
      )
    }
  ]

  // CÓDIGOS COLUMNS
  const codesColumns = [
    { 
      field: 'code', 
      headerName: 'Código', 
      flex: 1,
      minWidth: 180,
      renderCell: (params) => (
        <Box sx={{ fontFamily: 'monospace', fontWeight: 'bold', fontStyle: 'italic', fontSize: { xs: '0.75rem', sm: '0.9rem' } }}>
          {params.value}
        </Box>
      )
    },
    {
      field: 'uses',
      headerName: 'Usos',
      width: 100,
      renderCell: (params) => (
        <span style={{ fontStyle: 'italic', fontSize: 'inherit' }}>
          {params.row.current_uses} / {params.row.max_uses}
        </span>
      )
    },
    {
      field: 'is_active',
      headerName: 'Estado',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Activo' : 'Inactivo'}
          color={params.value ? 'success' : 'error'}
          size="small"
          sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 130,
      renderCell: (params) => (
        <Button
          size="small"
          variant="contained"
          color={params.row.is_active ? 'error' : 'success'}
          onClick={() => toggleCodeStatus(params.row.id, !params.row.is_active)}
          sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' }, px: { xs: 1, sm: 2 } }}
        >
          {params.row.is_active ? 'Desactivar' : 'Activar'}
        </Button>
      )
    }
  ]

  // LICENCIAS COLUMNS
  const licensesColumns = [
    { 
      field: 'client_name', 
      headerName: 'Cliente', 
      flex: 1,
      minWidth: 130,
      renderCell: (params) => (
        <strong style={{ fontStyle: 'italic', fontSize: 'inherit' }}>{params.value}</strong>
      )
    },
    {
      field: 'modules',
      headerName: 'Módulos',
      flex: 1,
      minWidth: 150,
      hide: window.innerWidth < 900,
      renderCell: (params) => (
        <span style={{ fontStyle: 'italic', fontSize: 'inherit' }}>
          {params.value?.join(', ') || 'Sin módulos'}
        </span>
      )
    },
    {
      field: 'license_code',
      headerName: 'Código',
      flex: 1,
      minWidth: 140,
      renderCell: (params) => (
        <Box
          sx={{
            fontFamily: 'monospace',
            fontWeight: 'bold',
            cursor: 'pointer',
            background: '#f5f5f5',
            padding: '4px 8px',
            borderRadius: '4px',
            fontStyle: 'italic',
            fontSize: { xs: '0.7rem', sm: '0.85rem' }
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
      width: 100,
      hide: window.innerWidth < 600,
      renderCell: (params) => (
        <span style={{ fontStyle: 'italic', fontSize: 'inherit' }}>
          {params.row.current_devices} / {params.row.max_devices}
        </span>
      )
    },
    {
      field: 'expires_at',
      headerName: 'Expira',
      width: 100,
      hide: window.innerWidth < 900,
      renderCell: (params) => (
        <span style={{ fontStyle: 'italic', fontSize: 'inherit' }}>
          {params.value ? new Date(params.value).toLocaleDateString() : 'Sin límite'}
        </span>
      )
    },
    {
      field: 'is_active',
      headerName: 'Estado',
      width: 90,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Activa' : 'Inactiva'}
          color={params.value ? 'success' : 'error'}
          size="small"
          sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: window.innerWidth < 600 ? 80 : 300,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          <IconButton
            size="small"
            color="primary"
            onClick={() => viewDetails(params.row.id)}
            title="Ver detalles"
          >
            <InfoIcon sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />
          </IconButton>
          <IconButton
            size="small"
            color="warning"
            onClick={() => handleEditLicense(params.row)}
            title="Editar"
            sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
          >
            <EditIcon sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />
          </IconButton>
          <IconButton
            size="small"
            color={params.row.is_active ? 'warning' : 'success'}
            onClick={() => toggleLicenseStatus(params.row.id, !params.row.is_active)}
            title={params.row.is_active ? 'Pausar' : 'Activar'}
            sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
          >
            {params.row.is_active ? <PauseIcon sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} /> : <PlayArrowIcon sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />}
          </IconButton>
          <IconButton
            size="small"
            color="success"
            onClick={() => downloadLicenseJSON(params.row.license_code, params.row.modules?.[0] || 'CALCULADORA')}
            title="Descargar license.json"
          >
            <DownloadIcon sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => deleteLicense(params.row.id)}
            title="Eliminar"
            sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
          >
            <DeleteIcon sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />
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

  const addModule = async (moduleName) => {
    try {
      await api.post(`/admin/licenses/${detailsData.licenseId}/modules`, { module_name: moduleName })
      setDetailsDialog(false)
      loadData()
      alert('Módulo agregado')
    } catch (error) {
      alert('Error agregando módulo')
    }
  }

  // ESTILOS PARA DATAGRID
  const dataGridStyles = {
    '& .MuiDataGrid-columnHeaders': {
      backgroundColor: '#0c4d7b',
      color: 'white',
      fontSize: { xs: '0.75rem', sm: '1rem' },
      fontWeight: 700
    },
    '& .MuiDataGrid-columnHeaderTitle': {
      fontWeight: 700,
      color: 'white'
    },
    '& .MuiDataGrid-cell': {
      color: '#666',
      fontStyle: 'italic',
      fontSize: { xs: '0.75rem', sm: '0.875rem' }
    },
    '& .MuiDataGrid-row:hover': {
      backgroundColor: '#f5f7fa'
    },
    '& .MuiDataGrid-iconSeparator': {
      color: 'white'
    },
    '& .MuiDataGrid-sortIcon': {
      color: 'white'
    },
    '& .MuiDataGrid-menuIconButton': {
      color: 'white'
    }
  }

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', p: { xs: 1, sm: 2, md: 3 } }}>
      {/* HEADER */}
      <MotionBox
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        sx={{
          background: 'linear-gradient(135deg, #0c4d7b, #17a2b8)',
          color: 'white',
          p: { xs: 2, sm: 3 },
          borderRadius: 2,
          mb: { xs: 2, sm: 3 }
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
          🛡️ Panel de Administración
        </Typography>
        <Typography variant="body1" sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}>
          Gestión de Licencias y Usuarios - JHVC Tech Solutions
        </Typography>
      </MotionBox>

      {/* TABS */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: { xs: 2, sm: 3 } }}>
        <Tabs 
          value={tab} 
          onChange={(e, v) => setTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              minWidth: { xs: 'auto', sm: 160 },
              px: { xs: 1, sm: 2 }
            }
          }}
        >
          <Tab label="Usuarios" />
          <Tab label="Códigos de Invitación" />
          <Tab label="Licencias de Productos" />
        </Tabs>
      </Box>

      {/* USUARIOS TAB */}
      {tab === 0 && (
        <Box sx={{ height: { xs: 400, sm: 600 }, width: '100%' }}>
          <DataGrid
            rows={users}
            columns={usersColumns}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            disableSelectionOnClick
            sx={dataGridStyles}
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
              fontSize: { xs: '0.8rem', sm: '0.9rem' },
              px: { xs: 2, sm: 3 },
              '&:hover': {
                background: 'linear-gradient(135deg, #17a2b8, #0c4d7b)'
              }
            }}
          >
            Generar Código
          </Button>
          <Box sx={{ height: { xs: 400, sm: 600 }, width: '100%' }}>
            <DataGrid
              rows={codes}
              columns={codesColumns}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              disableSelectionOnClick
              sx={dataGridStyles}
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
              fontSize: { xs: '0.8rem', sm: '0.9rem' },
              px: { xs: 2, sm: 3 },
              '&:hover': {
                background: 'linear-gradient(135deg, #17a2b8, #0c4d7b)'
              }
            }}
          >
            Crear Licencia
          </Button>
          <Box sx={{ height: { xs: 400, sm: 600 }, width: '100%' }}>
            <DataGrid
              rows={licenses}
              columns={licensesColumns}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              disableSelectionOnClick
              sx={dataGridStyles}
            />
          </Box>
        </Box>
      )}

      {/* DIALOG CREAR CÓDIGO */}
      <Dialog 
        open={openDialog && dialogType === 'code'} 
        onClose={() => setOpenDialog(false)} 
        maxWidth="sm" 
        fullWidth
        fullScreen={window.innerWidth < 600}
      >
        <DialogTitle sx={{ fontSize: { xs: '1.1rem', sm: '1.5rem' } }}>Generar Código de Invitación</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Máximo de Usos"
            type="number"
            value={codeForm.max_uses}
            onChange={(e) => setCodeForm({ ...codeForm, max_uses: parseInt(e.target.value) })}
            sx={{ mt: 2, mb: 2 }}
            InputProps={{ sx: { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
          />
          <TextField
            fullWidth
            label="Días de Validez (0 = sin límite)"
            type="number"
            value={codeForm.days_valid}
            onChange={(e) => setCodeForm({ ...codeForm, days_valid: parseInt(e.target.value) })}
            InputProps={{ sx: { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>Cancelar</Button>
          <Button onClick={handleCreateCode} variant="contained" sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>Crear</Button>
        </DialogActions>
      </Dialog>

      {/* DIALOG CREAR LICENCIA */}
      <Dialog 
        open={openDialog && dialogType === 'license'} 
        onClose={() => setOpenDialog(false)} 
        maxWidth="sm" 
        fullWidth
        fullScreen={window.innerWidth < 600}
      >
        <DialogTitle sx={{ fontSize: { xs: '1.1rem', sm: '1.5rem' } }}>Crear Licencia de Producto</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Cliente *"
            value={licenseForm.client_name}
            onChange={(e) => setLicenseForm({ ...licenseForm, client_name: e.target.value })}
            sx={{ mt: 2, mb: 2 }}
            InputProps={{ sx: { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
            required
          />
          <TextField
            fullWidth
            label="Email del Cliente"
            type="email"
            value={licenseForm.client_email}
            onChange={(e) => setLicenseForm({ ...licenseForm, client_email: e.target.value })}
            sx={{ mb: 2 }}
            InputProps={{ sx: { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>Módulos *</InputLabel>
            <Select
              multiple
              value={licenseForm.modules}
              onChange={(e) => setLicenseForm({ ...licenseForm, modules: e.target.value })}
              sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
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
            InputProps={{ sx: { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
          />
          <TextField
            fullWidth
            label="Días de Validez (0 = sin límite)"
            type="number"
            value={licenseForm.days_valid}
            onChange={(e) => setLicenseForm({ ...licenseForm, days_valid: parseInt(e.target.value) })}
            sx={{ mb: 2 }}
            InputProps={{ sx: { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
          />
          <TextField
            fullWidth
            label="Notas"
            multiline
            rows={3}
            value={licenseForm.notes}
            onChange={(e) => setLicenseForm({ ...licenseForm, notes: e.target.value })}
            InputProps={{ sx: { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>Cancelar</Button>
          <Button onClick={handleCreateLicense} variant="contained" sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>Crear</Button>
        </DialogActions>
      </Dialog>

      {/* DIALOG EDITAR LICENCIA */}
      <Dialog 
        open={openDialog && dialogType === 'editLicense'} 
        onClose={() => setOpenDialog(false)} 
        maxWidth="sm" 
        fullWidth
        fullScreen={window.innerWidth < 600}
      >
        <DialogTitle sx={{ fontSize: { xs: '1.1rem', sm: '1.5rem' } }}>Editar Licencia</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Cliente *"
            value={editLicenseForm.client_name}
            onChange={(e) => setEditLicenseForm({ ...editLicenseForm, client_name: e.target.value })}
            sx={{ mt: 2, mb: 2 }}
            InputProps={{ sx: { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={editLicenseForm.client_email}
            onChange={(e) => setEditLicenseForm({ ...editLicenseForm, client_email: e.target.value })}
            sx={{ mb: 2 }}
            InputProps={{ sx: { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
          />
          <TextField
            fullWidth
            label="Máximo de Dispositivos"
            type="number"
            value={editLicenseForm.max_devices}
            onChange={(e) => setEditLicenseForm({ ...editLicenseForm, max_devices: parseInt(e.target.value) })}
            sx={{ mb: 2 }}
            InputProps={{ sx: { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
          />
          <TextField
            fullWidth
            label="Días de Validez"
            type="number"
            value={editLicenseForm.days_valid}
            onChange={(e) => setEditLicenseForm({ ...editLicenseForm, days_valid: parseInt(e.target.value) })}
            sx={{ mb: 2 }}
            InputProps={{ sx: { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
          />
          <TextField
            fullWidth
            label="Notas"
            multiline
            rows={3}
            value={editLicenseForm.notes}
            onChange={(e) => setEditLicenseForm({ ...editLicenseForm, notes: e.target.value })}
            sx={{ mb: 2 }}
            InputProps={{ sx: { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
          />
          <FormControl fullWidth>
            <InputLabel sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>Estado</InputLabel>
            <Select
              value={editLicenseForm.is_active}
              onChange={(e) => setEditLicenseForm({ ...editLicenseForm, is_active: e.target.value })}
              sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
            >
              <MenuItem value={true}>Activa</MenuItem>
              <MenuItem value={false}>Inactiva</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>Cancelar</Button>
          <Button onClick={handleUpdateLicense} variant="contained" sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>Guardar</Button>
        </DialogActions>
      </Dialog>

      {/* DIALOG DETALLES */}
      <Dialog 
        open={detailsDialog} 
        onClose={() => setDetailsDialog(false)} 
        maxWidth="md" 
        fullWidth
        fullScreen={window.innerWidth < 600}
      >
        <DialogTitle sx={{ fontSize: { xs: '1.1rem', sm: '1.5rem' } }}>Detalles de Licencia</DialogTitle>
        <DialogContent>
          <Typography variant="h6" sx={{ mt: 2, mb: 2, fontSize: { xs: '1rem', sm: '1.25rem' } }}>Dispositivos Registrados:</Typography>
          {detailsData.devices && detailsData.devices.length > 0 ? (
            detailsData.devices.map((device) => (
              <Box key={device.id} sx={{ mb: 2, p: 2, background: '#f5f5f5', borderRadius: 2 }}>
                <Typography variant="body1" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}><strong>{device.device_name || 'Sin nombre'}</strong></Typography>
                <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>ID: {device.machine_id?.substring(0, 30)}...</Typography><br/>
                <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>Último check: {new Date(device.last_check).toLocaleString()}</Typography><br/>
                <Button size="small" color="error" onClick={() => removeDevice(device.id)} sx={{ mt: 1, fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>Eliminar</Button>
              </Box>
            ))
          ) : (
            <Typography sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}>No hay dispositivos registrados</Typography>
          )}

          <Typography variant="h6" sx={{ mt: 3, mb: 2, fontSize: { xs: '1rem', sm: '1.25rem' } }}>Módulos Asignados:</Typography>
          {detailsData.modules && detailsData.modules.length > 0 ? (
            detailsData.modules.map((module) => (
              <Box key={module.id} sx={{ mb: 1, p: 1.5, background: '#f5f5f5', borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}><strong>{module.module_name}</strong></Typography>
                <Button size="small" color="error" onClick={() => removeModule(module.id)} sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>Quitar</Button>
              </Box>
            ))
          ) : (
            <Typography sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}>No hay módulos asignados</Typography>
          )}

          <Typography variant="h6" sx={{ mt: 3, mb: 2, fontSize: { xs: '1rem', sm: '1.25rem' } }}>Agregar Módulo:</Typography>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: 'stretch' }}>
            <FormControl fullWidth>
              <Select id="addModuleSelect" defaultValue="CALCULADORA" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                <MenuItem value="CALCULADORA">Calculadora</MenuItem>
                <MenuItem value="VISOR">Visor</MenuItem>
                <MenuItem value="CONTABILIDAD">Contabilidad</MenuItem>
                <MenuItem value="NOMINA">Nómina</MenuItem>
                <MenuItem value="FACTURACION">Facturación</MenuItem>
              </Select>
            </FormControl>
            <Button 
              variant="contained" 
              onClick={() => {
                const moduleName = document.getElementById('addModuleSelect').value
                addModule(moduleName)
              }}
              sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' }, minWidth: { xs: '100%', sm: 'auto' } }}
            >
              Agregar
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialog(false)} sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Admin