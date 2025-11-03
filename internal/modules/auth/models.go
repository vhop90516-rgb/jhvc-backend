package auth

import "time"

type User struct {
	ID          int       `json:"id"`
	Email       string    `json:"email"`
	FullName    string    `json:"full_name"`
	CompanyName string    `json:"company_name,omitempty"`
	Phone       string    `json:"phone,omitempty"`
	IsActive    bool      `json:"is_active"`
	CreatedAt   time.Time `json:"created_at"`
}

type RegisterRequest struct {
	Email       string `json:"email" binding:"required,email"`
	Password    string `json:"password" binding:"required,min=8"`
	FullName    string `json:"fullName" binding:"required"`
	Phone       string `json:"phone"`
	CompanyName string `json:"company"`
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
