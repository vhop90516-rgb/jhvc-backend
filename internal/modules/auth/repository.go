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
	result, err := r.db.Exec(`
        INSERT INTO users (email, password_hash, full_name, company_name, phone)
        VALUES (?, ?, ?, ?, ?)
    `, email, passwordHash, fullName, companyName, phone)

	if err != nil {
		return 0, err
	}

	return result.LastInsertId()
}

func (r *Repository) GetUserByEmail(email string) (*User, string, error) {
	var user User
	var passwordHash string

	err := r.db.QueryRow(`
        SELECT id, email, password_hash, full_name, company_name, phone, is_active, created_at
        FROM users WHERE email = ?
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
        FROM users WHERE id = ?
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
	err := r.db.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE email = ?)", email).Scan(&exists)
	return exists, err
}

func (r *Repository) SaveSession(userID int, token, ipAddress string, expiresAt string) error {
	_, err := r.db.Exec(`
        INSERT INTO sessions (user_id, token, ip_address, expires_at)
        VALUES (?, ?, ?, ?)
    `, userID, token, ipAddress, expiresAt)

	return err
}
