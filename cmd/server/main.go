package main

import (
	"database/sql"
	"log"
	"os"
	"path/filepath"

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

	templatesPath := getTemplatesPath()
	log.Println("📁 Cargando templates desde:", templatesPath)
	r.LoadHTMLGlob(templatesPath)

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
	r.GET("/admin", func(c *gin.Context) {
		c.HTML(200, "admin.html", nil)
	})

	api := r.Group("/api")
	{
		api.POST("/register", authHandler.Register)
		api.POST("/login", authHandler.Login)

		// ENDPOINT PÚBLICO PARA VERIFICAR LICENCIAS DE PRODUCTOS
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

			// PRODUCT LICENSES CRUD
			admin.POST("/product-licenses", authHandler.CreateProductLicense)
			admin.GET("/product-licenses", authHandler.GetAllProductLicenses)
			admin.PUT("/product-licenses/:id", authHandler.UpdateProductLicense)
			admin.PUT("/product-licenses/:id/status", authHandler.UpdateProductLicenseStatus)
			admin.DELETE("/product-licenses/:id", authHandler.DeleteProductLicense)
		}
	}

	log.Println("🚀 Server: http://localhost:" + cfg.Port)
	r.Run(":" + cfg.Port)
}

func getTemplatesPath() string {
	paths := []string{
		"templates/*.html",
		"../../templates/*.html",
		"backend/templates/*.html",
	}

	for _, path := range paths {
		matches, _ := filepath.Glob(path)
		if len(matches) > 0 {
			return path
		}
	}

	execPath, _ := os.Executable()
	execDir := filepath.Dir(execPath)

	for i := 0; i < 3; i++ {
		testPath := filepath.Join(execDir, "templates", "*.html")
		matches, _ := filepath.Glob(testPath)
		if len(matches) > 0 {
			return testPath
		}
		execDir = filepath.Dir(execDir)
	}

	workDir, _ := os.Getwd()
	return filepath.Join(workDir, "templates", "*.html")
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
        product_name VARCHAR(100) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        max_devices INTEGER DEFAULT 1,
        current_devices INTEGER DEFAULT 0,
        machine_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP,
        last_check TIMESTAMP,
        notes TEXT
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

	var adminExists bool
	db.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE email = 'admin@jhvc.com')").Scan(&adminExists)
	if !adminExists {
		hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
		db.Exec(`
            INSERT INTO users (email, password_hash, full_name, is_admin, is_active)
            VALUES ('admin@jhvc.com', $1, 'Administrador', true, true)
        `, string(hashedPassword))
		log.Println("✅ Usuario admin creado: admin@jhvc.com / admin123")
	} else {
		db.Exec("UPDATE users SET is_admin = true WHERE email = 'admin@jhvc.com'")
		log.Println("✅ Usuario admin ya existe")
	}

	log.Println("✅ Tablas verificadas/creadas correctamente")
	return nil
}
