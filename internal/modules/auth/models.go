package auth

import "time"

type User struct {
	ID          int       `json:"id"`
	Email       string    `json:"email"`
	FullName    string    `json:"full_name"`
	CompanyName string    `json:"company_name,omitempty"`
	Phone       string    `json:"phone,omitempty"`
	IsActive    bool      `json:"is_active"`
	IsAdmin     bool      `json:"is_admin"`
	CreatedAt   time.Time `json:"created_at"`
}

type RegisterRequest struct {
	Email          string `json:"email" binding:"required,email"`
	Password       string `json:"password" binding:"required,min=8"`
	FullName       string `json:"fullName" binding:"required"`
	Phone          string `json:"phone"`
	CompanyName    string `json:"company"`
	InvitationCode string `json:"invitationCode" binding:"required"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
	Remember bool   `json:"remember"`
}

type AuthResponse struct {
	Token string `json:"token"`
	User  User   `json:"user"`
}

type InvitationCode struct {
	ID          int        `json:"id"`
	Code        string     `json:"code"`
	MaxUses     int        `json:"max_uses"`
	CurrentUses int        `json:"current_uses"`
	IsActive    bool       `json:"is_active"`
	CreatedBy   int        `json:"created_by"`
	CreatedAt   time.Time  `json:"created_at"`
	ExpiresAt   *time.Time `json:"expires_at,omitempty"`
}

type ProductLicense struct {
	ID             int        `json:"id"`
	LicenseCode    string     `json:"license_code"`
	ClientName     string     `json:"client_name"`
	ClientEmail    string     `json:"client_email,omitempty"`
	ProductName    string     `json:"product_name"`
	IsActive       bool       `json:"is_active"`
	MaxDevices     int        `json:"max_devices"`
	CurrentDevices int        `json:"current_devices"`
	MachineID      string     `json:"machine_id,omitempty"`
	CreatedAt      time.Time  `json:"created_at"`
	ExpiresAt      *time.Time `json:"expires_at,omitempty"`
	LastCheck      *time.Time `json:"last_check,omitempty"`
	Notes          string     `json:"notes,omitempty"`
}

type CreateProductLicenseRequest struct {
	ClientName  string `json:"client_name" binding:"required"`
	ClientEmail string `json:"client_email"`
	ProductName string `json:"product_name" binding:"required"`
	MaxDevices  int    `json:"max_devices"`
	DaysValid   int    `json:"days_valid"`
	Notes       string `json:"notes"`
}

type UpdateProductLicenseRequest struct {
	ClientName  string `json:"client_name" binding:"required"`
	ClientEmail string `json:"client_email"`
	ProductName string `json:"product_name" binding:"required"`
	MaxDevices  int    `json:"max_devices"`
	DaysValid   int    `json:"days_valid"`
	Notes       string `json:"notes"`
	IsActive    bool   `json:"is_active"`
}

type VerifyLicenseRequest struct {
	LicenseCode string `json:"license_code" binding:"required"`
	MachineID   string `json:"machine_id" binding:"required"`
	ProductName string `json:"product_name" binding:"required"`
}

type VerifyLicenseResponse struct {
	Valid      bool   `json:"valid"`
	Message    string `json:"message"`
	ClientName string `json:"client_name,omitempty"`
	ExpiresAt  string `json:"expires_at,omitempty"`
}
