package auth

import (
	"crypto/rand"
	"database/sql"
	"encoding/hex"
	"errors"
	"strings"
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
	invCode, err := s.repo.ValidateInvitationCode(req.InvitationCode)
	if err != nil {
		return nil, errors.New("código de invitación inválido")
	}

	if invCode.CurrentUses >= invCode.MaxUses {
		return nil, errors.New("código de invitación agotado")
	}

	if invCode.ExpiresAt != nil && time.Now().After(*invCode.ExpiresAt) {
		return nil, errors.New("código de invitación expirado")
	}

	exists, err := s.repo.EmailExists(req.Email)
	if err != nil {
		return nil, err
	}
	if exists {
		return nil, errors.New("email ya registrado")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	userID, err := s.repo.CreateUser(req.Email, string(hashedPassword), req.FullName, req.CompanyName, req.Phone)
	if err != nil {
		return nil, err
	}

	s.repo.IncrementCodeUsage(invCode.ID)
	s.repo.RecordCodeUsage(invCode.ID, int(userID))

	user, err := s.repo.GetUserByID(int(userID))
	if err != nil {
		return nil, err
	}

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

func (s *Service) GenerateProductLicenseCode() string {
	bytes := make([]byte, 16)
	rand.Read(bytes)
	return strings.ToUpper(hex.EncodeToString(bytes))
}

func (s *Service) CreateProductLicense(req CreateProductLicenseRequest) (string, error) {
	licenseCode := s.GenerateProductLicenseCode()

	if req.MaxDevices == 0 {
		req.MaxDevices = 1
	}

	err := s.repo.CreateProductLicense(licenseCode, req.ClientName, req.ClientEmail, req.ProductName, req.MaxDevices, req.DaysValid, req.Notes)
	return licenseCode, err
}

func (s *Service) GetAllProductLicenses() ([]ProductLicense, error) {
	return s.repo.GetAllProductLicenses()
}

func (s *Service) UpdateProductLicenseStatus(id int, isActive bool) error {
	return s.repo.UpdateProductLicenseStatus(id, isActive)
}

func (s *Service) DeleteProductLicense(id int) error {
	return s.repo.DeleteProductLicense(id)
}

func (s *Service) UpdateProductLicense(id int, req UpdateProductLicenseRequest) error {
	if req.MaxDevices == 0 {
		req.MaxDevices = 1
	}
	return s.repo.UpdateProductLicense(id, req.ClientName, req.ClientEmail, req.ProductName, req.MaxDevices, req.DaysValid, req.Notes, req.IsActive)
}

func (s *Service) VerifyProductLicense(req VerifyLicenseRequest) (VerifyLicenseResponse, error) {
	license, err := s.repo.VerifyProductLicense(req.LicenseCode, req.ProductName)
	if err != nil {
		return VerifyLicenseResponse{
			Valid:   false,
			Message: "Licencia no encontrada",
		}, nil
	}

	if !license.IsActive {
		return VerifyLicenseResponse{
			Valid:   false,
			Message: "Licencia inactiva",
		}, nil
	}

	if license.ExpiresAt != nil && time.Now().After(*license.ExpiresAt) {
		return VerifyLicenseResponse{
			Valid:   false,
			Message: "Licencia expirada",
		}, nil
	}

	if license.MachineID == "" {
		s.repo.UpdateMachineID(license.ID, req.MachineID)
	} else if license.MachineID != req.MachineID {
		return VerifyLicenseResponse{
			Valid:   false,
			Message: "Esta licencia está activada en otro dispositivo",
		}, nil
	}

	s.repo.UpdateLastCheck(license.ID)

	expiresStr := "Sin límite"
	if license.ExpiresAt != nil {
		expiresStr = license.ExpiresAt.Format("2006-01-02")
	}

	return VerifyLicenseResponse{
		Valid:      true,
		Message:    "Licencia válida",
		ClientName: license.ClientName,
		ExpiresAt:  expiresStr,
	}, nil
}
