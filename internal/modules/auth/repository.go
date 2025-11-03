package auth

import (
	"database/sql"
)

type Repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) CreateUser(email, passwordHash, fullName, companyName, phone string) (int64, error) {
	var id int64
	err := r.db.QueryRow(`
        INSERT INTO users (email, password_hash, full_name, company_name, phone)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
    `, email, passwordHash, fullName, companyName, phone).Scan(&id)

	if err != nil {
		return 0, err
	}
	return id, nil
}

func (r *Repository) GetUserByEmail(email string) (*User, string, error) {
	var user User
	var passwordHash string
	err := r.db.QueryRow(`
        SELECT id, email, password_hash, full_name, company_name, phone, is_active, created_at
        FROM users WHERE email = $1
    `, email).Scan(
		&user.ID, &user.Email, &passwordHash, &user.FullName,
		&user.CompanyName, &user.Phone, &user.IsActive, &user.CreatedAt,
	)
	if err != nil {
		return nil, "", err
	}
	return &user, passwordHash, nil
}

func (r *Repository) GetUserByID(id int) (*User, error) {
	var user User
	err := r.db.QueryRow(`
        SELECT id, email, full_name, company_name, phone, is_active, created_at
        FROM users WHERE id = $1
    `, id).Scan(
		&user.ID, &user.Email, &user.FullName,
		&user.CompanyName, &user.Phone, &user.IsActive, &user.CreatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *Repository) EmailExists(email string) (bool, error) {
	var exists bool
	err := r.db.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)", email).Scan(&exists)
	return exists, err
}

func (r *Repository) SaveSession(userID int, token, ipAddress string, expiresAt string) error {
	_, err := r.db.Exec(`
        INSERT INTO sessions (user_id, token, ip_address, expires_at)
        VALUES ($1, $2, $3, $4)
    `, userID, token, ipAddress, expiresAt)
	return err
}
