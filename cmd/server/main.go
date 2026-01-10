package main

import (
	"database/sql"
	"log"
	"os"
	"path/filepath"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/jhvc/backend/internal/config"
	"github.com/jhvc/backend/internal/database"
	"github.com/jhvc/backend/internal/middleware"
	"github.com/jhvc/backend/internal/modules/auth"
	"github.com/jhvc/backend/internal/modules/calculadora"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	cfg := config.Load()

	db, err := database.Connect(cfg.GetDSN())
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	if err := createTables(db); err != nil {
		log.Fatal("Error creando tablas:", err)
	}

	authRepo := auth.NewRepository(db)
	authService := auth.NewService(authRepo, cfg.JWTSecret)
	authHandler := auth.NewHandler(authService)

	calcService := calculadora.NewService()
	calcHandler := calculadora.NewHandler(calcService)

	r := gin.Default()
	r.Use(corsMiddleware())

	// Detectar el directorio base del proyecto
	baseDir := getProjectRoot()
	frontendDist := filepath.Join(baseDir, "frontend", "dist")

	log.Printf("📁 Sirviendo frontend desde: %s", frontendDist)

	// Servir archivos estáticos del frontend
	r.Static("/assets", filepath.Join(frontendDist, "assets"))
	r.StaticFile("/vite.svg", filepath.Join(frontendDist, "vite.svg"))

	// Endpoint temporal para resetear contraseña admin
	r.GET("/reset-admin-password", func(c *gin.Context) {
		hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
		_, err := db.Exec(`UPDATE users SET password_hash = $1 WHERE email = 'admin@jhvc.com'`, string(hashedPassword))
		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}
		c.JSON(200, gin.H{"message": "Contraseña reseteada a admin123"})
	})

	api := r.Group("/api")
	{
		api.POST("/register", authHandler.Register)
		api.POST("/login", authHandler.Login)
		api.POST("/verify-license", authHandler.VerifyProductLicense)

		protected := api.Group("")
		protected.Use(middleware.AuthMiddleware(authService))
		{
			protected.GET("/profile", authHandler.GetProfile)

			calc := protected.Group("/calculadora")
			{
				calc.GET("/configuraciones", calcHandler.GetConfiguraciones)
				calc.GET("/calcular", calcHandler.Calcular)
			}
		}

		admin := api.Group("/admin")
		admin.Use(middleware.AuthMiddleware(authService))
		admin.Use(middleware.AdminMiddleware(authService))
		{
			admin.GET("/users", authHandler.GetAllUsers)
			admin.PUT("/users/:id/status", authHandler.UpdateUserStatus)

			admin.POST("/codes", authHandler.CreateInvitationCode)
			admin.GET("/codes", authHandler.GetAllInvitationCodes)
			admin.PUT("/codes/:id/status", authHandler.UpdateCodeStatus)

			admin.POST("/product-licenses", authHandler.CreateProductLicense)
			admin.GET("/product-licenses", authHandler.GetAllProductLicenses)
			admin.PUT("/product-licenses/:id", authHandler.UpdateProductLicense)
			admin.PUT("/product-licenses/:id/status", authHandler.UpdateProductLicenseStatus)
			admin.DELETE("/product-licenses/:id", authHandler.DeleteProductLicense)

			admin.GET("/licenses/:id/devices", authHandler.GetLicenseDevices)
			admin.DELETE("/licenses/:id/devices/:deviceId", authHandler.RemoveLicenseDevice)

			admin.GET("/licenses/:id/modules", authHandler.GetLicenseModules)
			admin.POST("/licenses/:id/modules", authHandler.AddLicenseModule)
			admin.DELETE("/licenses/:id/modules/:moduleId", authHandler.RemoveLicenseModule)

			admin.GET("/products", authHandler.GetProducts)
		}
	}

	// SPA fallback - servir index.html para todas las rutas no API
	r.NoRoute(func(c *gin.Context) {
		if strings.HasPrefix(c.Request.URL.Path, "/api") {
			c.JSON(404, gin.H{"error": "endpoint no encontrado"})
			return
		}
		c.File(filepath.Join(frontendDist, "index.html"))
	})

	log.Println("🚀 Server: http://localhost:" + cfg.Port)
	r.Run(":" + cfg.Port)
}

// getProjectRoot detecta la raíz del proyecto
func getProjectRoot() string {
	// En Railway, el directorio de trabajo es la raíz del proyecto
	if wd, err := os.Getwd(); err == nil {
		// Verificar si existe frontend/dist desde el directorio actual
		if _, err := os.Stat(filepath.Join(wd, "frontend", "dist")); err == nil {
			return wd
		}

		// Si no, intentar desde dos niveles arriba (cuando se ejecuta desde cmd/server)
		parentDir := filepath.Join(wd, "..", "..")
		if _, err := os.Stat(filepath.Join(parentDir, "frontend", "dist")); err == nil {
			return parentDir
		}
	}

	// Por defecto, asumir que estamos en la raíz
	return "."
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
        is_admin BOOLEAN DEFAULT false,
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
    
    CREATE TABLE IF NOT EXISTS invitation_codes (
        id SERIAL PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        max_uses INTEGER DEFAULT 1,
        current_uses INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS code_usage (
        id SERIAL PRIMARY KEY,
        invitation_code_id INTEGER REFERENCES invitation_codes(id),
        user_id INTEGER REFERENCES users(id),
        used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS product_licenses (
        id SERIAL PRIMARY KEY,
        license_code VARCHAR(50) UNIQUE NOT NULL,
        client_name VARCHAR(255) NOT NULL,
        client_email VARCHAR(255),
        is_active BOOLEAN DEFAULT true,
        max_devices INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP,
        notes TEXT
    );

    CREATE TABLE IF NOT EXISTS license_devices (
        id SERIAL PRIMARY KEY,
        license_id INTEGER REFERENCES product_licenses(id) ON DELETE CASCADE,
        machine_id VARCHAR(255) NOT NULL,
        device_name VARCHAR(255),
        first_activation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_check TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(license_id, machine_id)
    );

    CREATE TABLE IF NOT EXISTS license_modules (
        id SERIAL PRIMARY KEY,
        license_id INTEGER REFERENCES product_licenses(id) ON DELETE CASCADE,
        module_name VARCHAR(100) NOT NULL,
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(license_id, module_name)
    );

    CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        product_name VARCHAR(100) UNIQUE NOT NULL,
        display_name VARCHAR(255) NOT NULL,
        description TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `

	_, err := db.Exec(schema)
	if err != nil {
		return err
	}

	var columnExists bool
	err = db.QueryRow(`
        SELECT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name='users' AND column_name='is_admin'
        )
    `).Scan(&columnExists)

	if err == nil && !columnExists {
		_, err = db.Exec(`ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT false`)
		if err != nil {
			log.Println("⚠️  Error agregando columna is_admin:", err)
		} else {
			log.Println("✅ Columna is_admin agregada")
		}
	}

	db.Exec(`ALTER TABLE product_licenses DROP COLUMN IF EXISTS machine_id`)
	db.Exec(`ALTER TABLE product_licenses DROP COLUMN IF EXISTS current_devices`)
	db.Exec(`ALTER TABLE product_licenses DROP COLUMN IF EXISTS product_name`)
	db.Exec(`ALTER TABLE product_licenses DROP COLUMN IF EXISTS last_check`)

	// Crear o actualizar usuario admin con contraseña fija
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
	var adminExists bool
	db.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE email = 'admin@jhvc.com')").Scan(&adminExists)

	if !adminExists {
		// Crear nuevo usuario admin
		db.Exec(`
            INSERT INTO users (email, password_hash, full_name, is_admin, is_active)
            VALUES ('admin@jhvc.com', $1, 'Administrador', true, true)
        `, string(hashedPassword))
		log.Println("✅ Usuario admin creado: admin@jhvc.com / admin123")
	} else {
		// Actualizar usuario admin existente (contraseña + permisos)
		db.Exec(`
			UPDATE users 
			SET password_hash = $1, is_admin = true, is_active = true
			WHERE email = 'admin@jhvc.com'
		`, string(hashedPassword))
		log.Println("✅ Usuario admin actualizado: admin@jhvc.com / admin123")
	}

	defaultProducts := []struct {
		name        string
		displayName string
		description string
	}{
		{"CALCULADORA", "Calculadora Fiscal", "Sistema de cálculo de impuestos RESICO"},
		{"VISOR", "Visor CFDI", "Visualizador de facturas electrónicas"},
		{"CONTABILIDAD", "Módulo Contabilidad", "Sistema contable completo"},
		{"NOMINA", "Gestión de Nómina", "Administración de nómina y pagos"},
		{"FACTURACION", "Facturación Electrónica", "Emisión de CFDIs"},
	}

	for _, product := range defaultProducts {
		db.Exec(`
            INSERT INTO products (product_name, display_name, description)
            VALUES ($1, $2, $3)
            ON CONFLICT (product_name) DO NOTHING
        `, product.name, product.displayName, product.description)
	}

	log.Println("✅ Tablas verificadas/creadas correctamente")
	return nil
}
