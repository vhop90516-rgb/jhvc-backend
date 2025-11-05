package auth

import (
	"crypto/rand"
	"database/sql"
	"encoding/hex"
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
	// Validar código de invitación
	invCode, err := s.repo.ValidateInvitationCode(req.InvitationCode)
	if err != nil {
		return nil, errors.New("código de invitación inválido")
	}

	// Verificar si ya se usó el máximo de veces
	if invCode.CurrentUses >= invCode.MaxUses {
		return nil, errors.New("código de invitación agotado")
	}

	// Verificar expiración
	if invCode.ExpiresAt != nil && time.Now().After(*invCode.ExpiresAt) {
		return nil, errors.New("código de invitación expirado")
	}

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

	// Incrementar uso del código
	s.repo.IncrementCodeUsage(invCode.ID)
	s.repo.RecordCodeUsage(invCode.ID, int(userID))

	// ✅ CAMBIO AQUÍ: Crear licencia con módulo VISOR por defecto (30 días)
	expiresAt := time.Now().Add(30 * 24 * time.Hour)
	s.repo.CreateLicense(int(userID), invCode.ID, []string{"visor"}, &expiresAt)

	// Obtener usuario creado
	user, err := s.repo.GetUserByID(int(userID))
	if err != nil {
		return nil, err
	}

	// Generar token
	token, err := s.generateToken(user.ID, user.Email, user.IsAdmin, 24*time.Hour)
	if err != nil {
		return nil, err
	}

	return &AuthResponse{
		Token: token,
		User:  *user,
	}, nil
}

func (s *Service) Login(req LoginRequest) (*AuthResponse, error) {
	user, passwordHash, err := s.repo.GetUserByEmail(req.Email)
	if err == sql.ErrNoRows {
		return nil, errors.New("credenciales inválidas")
	}
	if err != nil {
		return nil, err
	}

	if err := bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(req.Password)); err != nil {
		return nil, errors.New("credenciales inválidas")
	}

	if !user.IsActive {
		return nil, errors.New("cuenta desactivada")
	}

	duration := 24 * time.Hour
	if req.Remember {
		duration = 30 * 24 * time.Hour
	}

	token, err := s.generateToken(user.ID, user.Email, user.IsAdmin, duration)
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

func (s *Service) GetUserLicense(userID int) (*License, error) {
	return s.repo.GetUserLicense(userID)
}

func (s *Service) generateToken(userID int, email string, isAdmin bool, duration time.Duration) (string, error) {
	claims := jwt.MapClaims{
		"user_id":  userID,
		"email":    email,
		"is_admin": isAdmin,
		"exp":      time.Now().Add(duration).Unix(),
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

func (s *Service) IsAdmin(tokenString string) (bool, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("método de firma inválido")
		}
		return s.jwtSecret, nil
	})
	if err != nil {
		return false, err
	}
	if !token.Valid {
		return false, errors.New("token inválido")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return false, errors.New("claims inválidos")
	}

	isAdmin, ok := claims["is_admin"].(bool)
	if !ok {
		return false, nil
	}

	return isAdmin, nil
}

// ADMIN FUNCTIONS
func (s *Service) GenerateInvitationCode() string {
	bytes := make([]byte, 16)
	rand.Read(bytes)
	return hex.EncodeToString(bytes)
}

func (s *Service) CreateInvitationCode(adminID, maxUses int, daysValid int) (string, error) {
	code := s.GenerateInvitationCode()

	var expiresAt *time.Time
	if daysValid > 0 {
		exp := time.Now().Add(time.Duration(daysValid) * 24 * time.Hour)
		expiresAt = &exp
	}

	err := s.repo.CreateInvitationCode(code, maxUses, adminID, expiresAt)
	return code, err
}

func (s *Service) GetAllUsers() ([]User, error) {
	return s.repo.GetAllUsers()
}

func (s *Service) UpdateUserStatus(userID int, isActive bool) error {
	return s.repo.UpdateUserStatus(userID, isActive)
}

func (s *Service) GetAllInvitationCodes() ([]InvitationCode, error) {
	return s.repo.GetAllInvitationCodes()
}

func (s *Service) UpdateCodeStatus(codeID int, isActive bool) error {
	return s.repo.UpdateCodeStatus(codeID, isActive)
}

func (s *Service) UpdateLicense(userID int, modules []string, daysValid int, isActive bool) error {
	// ✅ VALIDAR QUE LOS MÓDULOS SEAN VÁLIDOS
	for _, module := range modules {
		if !IsValidModule(module) {
			return errors.New("módulo inválido: " + module)
		}
	}

	var expiresAt *time.Time
	if daysValid > 0 {
		exp := time.Now().Add(time.Duration(daysValid) * 24 * time.Hour)
		expiresAt = &exp
	}

	return s.repo.UpdateLicense(userID, modules, expiresAt, isActive)
}

func (s *Service) GetAllLicenses() ([]License, error) {
	return s.repo.GetAllLicenses()
}
