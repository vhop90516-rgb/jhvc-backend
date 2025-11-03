package auth

import (
	"database/sql"
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type Service struct {
	repo      *Repository
	jwtSecret []byte
}

func NewService(repo *Repository, jwtSecret string) *Service {
	return &Service{
		repo:      repo,
		jwtSecret: []byte(jwtSecret),
	}
}

func (s *Service) Register(req RegisterRequest) (*AuthResponse, error) {
	// Verificar si email existe
	exists, err := s.repo.EmailExists(req.Email)
	if err != nil {
		return nil, err
	}
	if exists {
		return nil, errors.New("email ya registrado")
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	// Crear usuario
	userID, err := s.repo.CreateUser(req.Email, string(hashedPassword), req.FullName, req.CompanyName, req.Phone)
	if err != nil {
		return nil, err
	}

	// Obtener usuario creado
	user, err := s.repo.GetUserByID(int(userID))
	if err != nil {
		return nil, err
	}

	// Generar token
	token, err := s.generateToken(user.ID, user.Email, 24*time.Hour)
	if err != nil {
		return nil, err
	}

	return &AuthResponse{
		Token: token,
		User:  *user,
	}, nil
}

func (s *Service) Login(req LoginRequest) (*AuthResponse, error) {
	// Obtener usuario
	user, passwordHash, err := s.repo.GetUserByEmail(req.Email)
	if err == sql.ErrNoRows {
		return nil, errors.New("credenciales inválidas")
	}
	if err != nil {
		return nil, err
	}

	// Verificar password
	if err := bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(req.Password)); err != nil {
		return nil, errors.New("credenciales inválidas")
	}

	// Verificar activo
	if !user.IsActive {
		return nil, errors.New("cuenta desactivada")
	}

	// Generar token
	duration := 24 * time.Hour
	if req.Remember {
		duration = 30 * 24 * time.Hour
	}

	token, err := s.generateToken(user.ID, user.Email, duration)
	if err != nil {
		return nil, err
	}

	return &AuthResponse{
		Token: token,
		User:  *user,
	}, nil
}

func (s *Service) GetProfile(userID int) (*User, error) {
	return s.repo.GetUserByID(userID)
}

func (s *Service) generateToken(userID int, email string, duration time.Duration) (string, error) {
	claims := jwt.MapClaims{
		"user_id": userID,
		"email":   email,
		"exp":     time.Now().Add(duration).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(s.jwtSecret)
}

func (s *Service) ValidateToken(tokenString string) (int, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("método de firma inválido")
		}
		return s.jwtSecret, nil
	})

	if err != nil {
		return 0, err
	}

	if !token.Valid {
		return 0, errors.New("token inválido")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return 0, errors.New("claims inválidos")
	}

	userIDFloat, ok := claims["user_id"].(float64)
	if !ok {
		return 0, errors.New("user_id inválido en token")
	}

	return int(userIDFloat), nil
}
