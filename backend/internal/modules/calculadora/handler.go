// internal/calculadora/handler.go
package calculadora

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// Handler maneja las peticiones HTTP para la calculadora fiscal
type Handler struct {
	service *Service
}

// NewHandler crea una nueva instancia del handler
func NewHandler(service *Service) *Handler {
	return &Handler{
		service: service,
	}
}

// RegisterRoutes registra las rutas del módulo (opcional, no necesario con tu main actual)
func (h *Handler) RegisterRoutes(router *gin.RouterGroup) {
	calc := router.Group("/calculadora")
	{
		calc.GET("/configuraciones", h.GetConfiguraciones)
		calc.GET("/calcular", h.Calcular)
		calc.POST("/calcular", h.CalcularPost)
	}
}

// GetConfiguraciones obtiene todas las configuraciones fiscales disponibles
// @Summary Lista de configuraciones fiscales
// @Description Obtiene todas las configuraciones de impuestos predefinidas
// @Tags calculadora
// @Produce json
// @Success 200 {array} ConfigFiscal
// @Router /calculadora/configuraciones [get]
func (h *Handler) GetConfiguraciones(c *gin.Context) {
	configs := h.service.GetConfiguraciones()
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    configs,
	})
}

// Calcular realiza un cálculo fiscal usando query parameters
// @Summary Calcula impuestos y retenciones
// @Description Calcula directo (subtotal->total) o inverso (total->subtotal)
// @Tags calculadora
// @Produce json
// @Param tipo query string true "Tipo de cálculo" Enums(directo, inverso)
// @Param monto query number true "Monto a calcular"
// @Param config query int true "Índice de configuración"
// @Param retencion_especial query number false "Retención especial (opcional)"
// @Success 200 {object} CalculoFiscal
// @Failure 400 {object} map[string]interface{}
// @Router /calculadora/calcular [get]
func (h *Handler) Calcular(c *gin.Context) {
	tipo := c.Query("tipo")
	montoStr := c.Query("monto")
	configStr := c.Query("config")
	retencionEspecialStr := c.Query("retencion_especial")

	monto, err := strconv.ParseFloat(montoStr, 64)
	if err != nil || monto <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Monto inválido",
		})
		return
	}

	configIndex, err := strconv.Atoi(configStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Configuración inválida",
		})
		return
	}

	configs := h.service.GetConfiguraciones()
	if configIndex < 0 || configIndex >= len(configs) {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Índice de configuración fuera de rango",
		})
		return
	}

	retencionEspecial, _ := strconv.ParseFloat(retencionEspecialStr, 64)

	config := configs[configIndex]
	var resultado CalculoFiscal

	if tipo == "directo" {
		resultado = h.service.CalcularDirecto(monto, config, retencionEspecial)
	} else if tipo == "inverso" {
		resultado = h.service.CalcularInverso(monto, config, retencionEspecial)
	} else {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Tipo inválido",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    resultado,
	})
}

// CalcularPost realiza un cálculo fiscal usando POST (body JSON o form)
// @Summary Calcula impuestos (POST)
// @Description Alternativa con POST para cálculos más complejos
// @Tags calculadora
// @Accept json,x-www-form-urlencoded
// @Produce json
// @Param request body CalculoRequest true "Datos del cálculo"
// @Success 200 {object} CalculoFiscal
// @Failure 400 {object} map[string]interface{}
// @Router /calculadora/calcular [post]
func (h *Handler) CalcularPost(c *gin.Context) {
	var req CalculoRequest

	// Bind JSON o form data
	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Datos inválidos: " + err.Error(),
		})
		return
	}

	// Validar configuración
	config, err := h.service.GetConfiguracion(req.ConfigIndex)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Configuración no encontrada",
		})
		return
	}

	// Realizar cálculo
	var resultado CalculoFiscal
	if req.Tipo == "directo" {
		resultado = h.service.CalcularDirecto(req.Monto, *config, req.RetencionEspecial)
	} else {
		resultado = h.service.CalcularInverso(req.Monto, *config, req.RetencionEspecial)
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    resultado,
	})
}
