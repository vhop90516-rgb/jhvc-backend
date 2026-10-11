package config

import (
	"crypto/rand"
	"encoding/hex"
	"log"
	"os"
)

type Config struct {
	Port      string
	JWTSecret string
}

func Load() *Config {
	return &Config{
		Port:      getEnv("PORT", "8080"),
		JWTSecret: jwtSecret(),
	}
}

// jwtSecret usa JWT_SECRET de las variables de entorno. Si falta o es el valor
// viejo público ("secret-key"), genera uno aleatorio al arrancar. Eso solo
// cierra sesiones del panel de admin; la verificación de licencias no usa JWT.
func jwtSecret() string {
	s := os.Getenv("JWT_SECRET")
	if s != "" && s != "secret-key" {
		return s
	}
	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		log.Fatal("no se pudo generar JWT_SECRET: ", err)
	}
	log.Println("⚠️  JWT_SECRET no configurada en Railway: se usa una aleatoria (las sesiones del admin se cerrarán al reiniciar)")
	return hex.EncodeToString(b)
}

func (c *Config) GetDSN() string {
	// Railway SIEMPRE proporciona DATABASE_URL
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		log.Fatal("DATABASE_URL no está configurada en Railway")
	}
	log.Println("✅ Usando DATABASE_URL de Railway")
	return dbURL
}

func getEnv(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}
