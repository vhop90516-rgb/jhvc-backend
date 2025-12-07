package config

import (
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
		JWTSecret: getEnv("JWT_SECRET", "secret-key"),
	}
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
