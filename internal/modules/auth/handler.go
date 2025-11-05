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

func (h *Handler) GetUserLicense(c *gin.Context) {
	userID := c.GetInt("userID")
	license, err := h.service.GetUserLicense(userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "error": "Sin licencia activa"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    license,
	})
}

// ADMIN HANDLERS
func (h *Handler) GetAllUsers(c *gin.Context) {
	users, err := h.service.GetAllUsers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}

	// Obtener licencias de cada usuario
	type UserWithLicense struct {
		User
		License *License `json:"license"`
	}

	var usersWithLicenses []UserWithLicense
	for _, user := range users {
		license, _ := h.service.GetUserLicense(user.ID)
		usersWithLicenses = append(usersWithLicenses, UserWithLicense{
			User:    user,
			License: license,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    usersWithLicenses,
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

func (h *Handler) UpdateLicense(c *gin.Context) {
	userID, _ := strconv.Atoi(c.Param("userId"))

	var req struct {
		Modules   []string `json:"modules"`
		DaysValid int      `json:"days_valid"`
		IsActive  bool     `json:"is_active"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": err.Error()})
		return
	}

	if err := h.service.UpdateLicense(userID, req.Modules, req.DaysValid, req.IsActive); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Licencia actualizada",
	})
}

func (h *Handler) GetAllLicenses(c *gin.Context) {
	licenses, err := h.service.GetAllLicenses()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    licenses,
	})

}

// ✅ NUEVO ENDPOINT: Obtener módulos disponibles
func (h *Handler) GetAvailableModules(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    GetModulesMap(),
	})
}
