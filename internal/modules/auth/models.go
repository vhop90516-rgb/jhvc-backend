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

type License struct {
	ID        int        `json:"id"`
	UserID    int        `json:"user_id"`
	Modules   []string   `json:"modules"`
	ExpiresAt *time.Time `json:"expires_at"`
	IsActive  bool       `json:"is_active"`
	CreatedAt time.Time  `json:"created_at"`
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
