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
	if dbURL := os.Getenv("DATABASE_URL"); dbURL != "" {
		log.Println("✅ Usando DATABASE_URL de Railway")
		return dbURL
	}

	log.Println("✅ Usando variables locales (.env)")
	return "host=" + getEnv("DB_HOST", "127.0.0.1") +
		" port=" + getEnv("DB_PORT", "5432") +
		" user=" + getEnv("DB_USER", "postgres") +
		" password=" + getEnv("DB_PASS", "") +
		" dbname=" + getEnv("DB_NAME", "jhvc_system") +
		" sslmode=disable"
}

func getEnv(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}
