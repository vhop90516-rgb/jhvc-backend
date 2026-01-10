package middleware

import (
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/jhvc/backend/internal/modules/auth"
)

func AdminMiddleware(service *auth.Service) gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.GetHeader("Authorization")
		token = strings.TrimPrefix(token, "Bearer ")
		isAdmin, err := service.IsAdmin(token)
		if err != nil || !isAdmin {
			c.JSON(403, gin.H{"error": "Acceso denegado - Solo administradores"})
			c.Abort()
			return
		}
		c.Next()
	}
}
