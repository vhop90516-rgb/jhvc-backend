package middleware

import (
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/jhvc/backend/internal/modules/auth"
)

func AuthMiddleware(service *auth.Service) gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.GetHeader("Authorization")
		token = strings.TrimPrefix(token, "Bearer ")
		userID, err := service.ValidateToken(token)
		if err != nil {
			c.JSON(401, gin.H{"error": "No autorizado"})
			c.Abort()
			return
		}
		c.Set("userID", userID)
		c.Next()
	}
}
