package auth

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": err.Error()})
		return
	}

	resp, err := h.service.Register(req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Usuario creado",
		"data":    resp,
	})
}

func (h *Handler) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": err.Error()})
		return
	}

	resp, err := h.service.Login(req)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Login exitoso",
		"data":    resp,
	})
}

func (h *Handler) GetProfile(c *gin.Context) {
	userID := c.GetInt("userID")
	user, err := h.service.GetProfile(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    user,
	})
}

func (h *Handler) GetAllUsers(c *gin.Context) {
	users, err := h.service.GetAllUsers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    users,
	})
}

func (h *Handler) UpdateUserStatus(c *gin.Context) {
	userID, _ := strconv.Atoi(c.Param("id"))

	var req struct {
		IsActive bool `json:"is_active"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": err.Error()})
		return
	}

	if err := h.service.UpdateUserStatus(userID, req.IsActive); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Usuario actualizado",
	})
}

func (h *Handler) CreateInvitationCode(c *gin.Context) {
	adminID := c.GetInt("userID")

	var req struct {
		MaxUses   int `json:"max_uses" binding:"required"`
		DaysValid int `json:"days_valid"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": err.Error()})
		return
	}

	code, err := h.service.CreateInvitationCode(adminID, req.MaxUses, req.DaysValid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"data":    gin.H{"code": code},
	})
}

func (h *Handler) GetAllInvitationCodes(c *gin.Context) {
	codes, err := h.service.GetAllInvitationCodes()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    codes,
	})
}

func (h *Handler) UpdateCodeStatus(c *gin.Context) {
	codeID, _ := strconv.Atoi(c.Param("id"))

	var req struct {
		IsActive bool `json:"is_active"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": err.Error()})
		return
	}

	if err := h.service.UpdateCodeStatus(codeID, req.IsActive); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Código actualizado",
	})
}

func (h *Handler) CreateProductLicense(c *gin.Context) {
	var req CreateProductLicenseRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": err.Error()})
		return
	}

	licenseCode, err := h.service.CreateProductLicense(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Licencia creada",
		"data":    gin.H{"license_code": licenseCode},
	})
}

func (h *Handler) GetAllProductLicenses(c *gin.Context) {
	licenses, err := h.service.GetAllProductLicenses()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    licenses,
	})
}

func (h *Handler) UpdateProductLicenseStatus(c *gin.Context) {
	licenseID, _ := strconv.Atoi(c.Param("id"))

	var req struct {
		IsActive bool `json:"is_active"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": err.Error()})
		return
	}

	if err := h.service.UpdateProductLicenseStatus(licenseID, req.IsActive); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Licencia actualizada",
	})
}

func (h *Handler) DeleteProductLicense(c *gin.Context) {
	licenseID, _ := strconv.Atoi(c.Param("id"))

	if err := h.service.DeleteProductLicense(licenseID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Licencia eliminada",
	})
}

func (h *Handler) UpdateProductLicense(c *gin.Context) {
	licenseID, _ := strconv.Atoi(c.Param("id"))

	var req UpdateProductLicenseRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": err.Error()})
		return
	}

	if err := h.service.UpdateProductLicense(licenseID, req); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Licencia actualizada",
	})
}

func (h *Handler) VerifyProductLicense(c *gin.Context) {
	var req VerifyLicenseRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": err.Error()})
		return
	}

	resp, err := h.service.VerifyProductLicense(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    resp,
	})
}

// ============================================
// DEVICE MANAGEMENT
// ============================================

func (h *Handler) GetLicenseDevices(c *gin.Context) {
	licenseID, _ := strconv.Atoi(c.Param("id"))

	devices, err := h.service.GetLicenseDevices(licenseID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    devices,
	})
}

func (h *Handler) RemoveLicenseDevice(c *gin.Context) {
	deviceID, _ := strconv.Atoi(c.Param("deviceId"))

	if err := h.service.RemoveLicenseDevice(deviceID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Dispositivo eliminado",
	})
}

// ============================================
// MODULE MANAGEMENT
// ============================================

func (h *Handler) GetLicenseModules(c *gin.Context) {
	licenseID, _ := strconv.Atoi(c.Param("id"))

	modules, err := h.service.GetLicenseModules(licenseID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    modules,
	})
}

func (h *Handler) AddLicenseModule(c *gin.Context) {
	licenseID, _ := strconv.Atoi(c.Param("id"))

	var req AddModuleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": err.Error()})
		return
	}

	if err := h.service.AddLicenseModule(licenseID, req.ModuleName); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Módulo agregado",
	})
}

func (h *Handler) RemoveLicenseModule(c *gin.Context) {
	moduleID, _ := strconv.Atoi(c.Param("moduleId"))

	if err := h.service.RemoveLicenseModule(moduleID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Módulo eliminado",
	})
}

// ============================================
// PRODUCTS
// ============================================

func (h *Handler) GetProducts(c *gin.Context) {
	products, err := h.service.GetProducts()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    products,
	})
}
