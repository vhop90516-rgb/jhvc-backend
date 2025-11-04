package middleware

import (
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jhvc/backend/internal/modules/auth"
)

func LicenseMiddleware(service *auth.Service, requiredModule string) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := c.GetInt("userID")

		license, err := service.GetUserLicense(userID)
		if err != nil {
			c.JSON(403, gin.H{"error": "No tienes una licencia activa"})
			c.Abort()
			return
		}

		// Verificar si la licencia está activa
		if !license.IsActive {
			c.JSON(403, gin.H{"error": "Tu licencia está inactiva"})
			c.Abort()
			return
		}

		// Verificar si la licencia expiró
		if license.ExpiresAt != nil && time.Now().After(*license.ExpiresAt) {
			c.JSON(403, gin.H{"error": "Tu licencia ha expirado"})
			c.Abort()
			return
		}

		// Verificar si tiene acceso al módulo
		hasModule := false
		for _, module := range license.Modules {
			if module == requiredModule {
				hasModule = true
				break
			}
		}

		if !hasModule {
			c.JSON(403, gin.H{"error": "No tienes acceso a este módulo"})
			c.Abort()
			return
		}

		c.Next()
	}
}
