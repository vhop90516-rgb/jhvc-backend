package main

import (
	"database/sql"
	"log"

	"github.com/gin-gonic/gin"
	"github.com/jhvc/backend/internal/config"
	"github.com/jhvc/backend/internal/database"
	"github.com/jhvc/backend/internal/middleware"
	"github.com/jhvc/backend/internal/modules/auth"
	"github.com/jhvc/backend/internal/modules/calculadora"
)

func main() {
	cfg := config.Load()
	db, err := database.Connect(cfg.GetDSN())
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Crear tablas automáticamente
	if err := createTables(db); err != nil {
		log.Fatal("Error creando tablas:", err)
	}

	// Auth module
	authRepo := auth.NewRepository(db)
	authService := auth.NewService(authRepo, cfg.JWTSecret)
	authHandler := auth.NewHandler(authService)

	// Calculadora module
	calcService := calculadora.NewService()
	calcHandler := calculadora.NewHandler(calcService)

	// Router
	r := gin.Default()
	r.Use(corsMiddleware())

	// Templates
	r.LoadHTMLGlob("../../templates/*")

	// HTML Routes
	r.GET("/", func(c *gin.Context) {
		c.HTML(200, "landing.html", nil)
	})
	r.GET("/register", func(c *gin.Context) {
		c.HTML(200, "register.html", nil)
	})
	r.GET("/login", func(c *gin.Context) {
		c.HTML(200, "login.html", nil)
	})
	r.GET("/dashboard", func(c *gin.Context) {
		c.HTML(200, "dashboard.html", nil)
	})
	r.GET("/calculadora", func(c *gin.Context) {
		c.HTML(200, "calculadora.html", nil)
	})

	// API Routes
	api := r.Group("/api")
	{
		api.POST("/register", authHandler.Register)
		api.POST("/login", authHandler.Login)

		protected := api.Group("")
		protected.Use(middleware.AuthMiddleware(authService))
		{
			protected.GET("/profile", authHandler.GetProfile)
			// Calculadora routes
			protected.GET("/calculadora/configuraciones", calcHandler.GetConfiguraciones)
			protected.GET("/calculadora/calcular", calcHandler.Calcular)
		}
	}

	log.Println("🚀 Server: http://localhost:" + cfg.Port)
	r.Run(":" + cfg.Port)
}

func corsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type,Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	}
}

func createTables(db *sql.DB) error {
	schema := `
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        company_name VARCHAR(255),
        phone VARCHAR(20),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        token TEXT NOT NULL,
        ip_address VARCHAR(45),
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `
	_, err := db.Exec(schema)
	if err != nil {
		return err
	}
	log.Println("✅ Tablas verificadas/creadas correctamente")
	return nil
}
