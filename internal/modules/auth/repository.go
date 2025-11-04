package auth

import (
	"database/sql"
	"encoding/json"
	"time"
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
	var companyName, phone sql.NullString

	err := r.db.QueryRow(`
        SELECT id, email, password_hash, full_name, company_name, phone, is_active, is_admin, created_at
        FROM users WHERE email = $1
    `, email).Scan(
		&user.ID, &user.Email, &passwordHash, &user.FullName,
		&companyName, &phone, &user.IsActive, &user.IsAdmin, &user.CreatedAt,
	)
	if err != nil {
		return nil, "", err
	}

	if companyName.Valid {
		user.CompanyName = companyName.String
	}
	if phone.Valid {
		user.Phone = phone.String
	}

	return &user, passwordHash, nil
}

func (r *Repository) GetUserByID(id int) (*User, error) {
	var user User
	var companyName, phone sql.NullString

	err := r.db.QueryRow(`
        SELECT id, email, full_name, company_name, phone, is_active, is_admin, created_at
        FROM users WHERE id = $1
    `, id).Scan(
		&user.ID, &user.Email, &user.FullName,
		&companyName, &phone, &user.IsActive, &user.IsAdmin, &user.CreatedAt,
	)
	if err != nil {
		return nil, err
	}

	if companyName.Valid {
		user.CompanyName = companyName.String
	}
	if phone.Valid {
		user.Phone = phone.String
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

// CÓDIGOS DE INVITACIÓN
func (r *Repository) ValidateInvitationCode(code string) (*InvitationCode, error) {
	var inv InvitationCode
	var expiresAt sql.NullTime

	err := r.db.QueryRow(`
        SELECT id, code, max_uses, current_uses, is_active, created_by, created_at, expires_at
        FROM invitation_codes 
        WHERE code = $1 AND is_active = true
    `, code).Scan(
		&inv.ID, &inv.Code, &inv.MaxUses, &inv.CurrentUses,
		&inv.IsActive, &inv.CreatedBy, &inv.CreatedAt, &expiresAt,
	)

	if err != nil {
		return nil, err
	}

	if expiresAt.Valid {
		inv.ExpiresAt = &expiresAt.Time
	}

	return &inv, nil
}

func (r *Repository) IncrementCodeUsage(codeID int) error {
	_, err := r.db.Exec(`
        UPDATE invitation_codes 
        SET current_uses = current_uses + 1 
        WHERE id = $1
    `, codeID)
	return err
}

func (r *Repository) RecordCodeUsage(codeID, userID int) error {
	_, err := r.db.Exec(`
        INSERT INTO code_usage (invitation_code_id, user_id)
        VALUES ($1, $2)
    `, codeID, userID)
	return err
}

func (r *Repository) CreateLicense(userID, codeID int, modules []string, expiresAt *time.Time) error {
	modulesJSON, _ := json.Marshal(modules)

	_, err := r.db.Exec(`
        INSERT INTO licenses (user_id, invitation_code_id, modules, expires_at)
        VALUES ($1, $2, $3, $4)
    `, userID, codeID, modulesJSON, expiresAt)

	return err
}

func (r *Repository) GetUserLicense(userID int) (*License, error) {
	var lic License
	var modulesJSON []byte
	var expiresAt sql.NullTime

	err := r.db.QueryRow(`
        SELECT id, user_id, modules, expires_at, is_active, created_at
        FROM licenses 
        WHERE user_id = $1
        ORDER BY created_at DESC LIMIT 1
    `, userID).Scan(
		&lic.ID, &lic.UserID, &modulesJSON, &expiresAt, &lic.IsActive, &lic.CreatedAt,
	)

	if err != nil {
		return nil, err
	}

	// Manejar JSON vacío o null
	if len(modulesJSON) > 0 {
		json.Unmarshal(modulesJSON, &lic.Modules)
	}
	if lic.Modules == nil {
		lic.Modules = []string{}
	}

	if expiresAt.Valid {
		lic.ExpiresAt = &expiresAt.Time
	}

	return &lic, nil
}

// ADMIN FUNCTIONS
func (r *Repository) GetAllUsers() ([]User, error) {
	rows, err := r.db.Query(`
        SELECT id, email, full_name, company_name, phone, is_active, is_admin, created_at
        FROM users 
        ORDER BY created_at DESC
    `)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []User
	for rows.Next() {
		var u User
		var companyName, phone sql.NullString

		err := rows.Scan(&u.ID, &u.Email, &u.FullName, &companyName, &phone, &u.IsActive, &u.IsAdmin, &u.CreatedAt)
		if err != nil {
			continue
		}

		if companyName.Valid {
			u.CompanyName = companyName.String
		}
		if phone.Valid {
			u.Phone = phone.String
		}

		users = append(users, u)
	}

	return users, nil
}

func (r *Repository) UpdateUserStatus(userID int, isActive bool) error {
	_, err := r.db.Exec("UPDATE users SET is_active = $1 WHERE id = $2", isActive, userID)
	return err
}

func (r *Repository) CreateInvitationCode(code string, maxUses int, createdBy int, expiresAt *time.Time) error {
	_, err := r.db.Exec(`
        INSERT INTO invitation_codes (code, max_uses, created_by, expires_at)
        VALUES ($1, $2, $3, $4)
    `, code, maxUses, createdBy, expiresAt)
	return err
}

func (r *Repository) GetAllInvitationCodes() ([]InvitationCode, error) {
	rows, err := r.db.Query(`
        SELECT id, code, max_uses, current_uses, is_active, created_by, created_at, expires_at
        FROM invitation_codes 
        ORDER BY created_at DESC
    `)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var codes []InvitationCode
	for rows.Next() {
		var c InvitationCode
		var expiresAt sql.NullTime
		var createdBy sql.NullInt64

		err := rows.Scan(&c.ID, &c.Code, &c.MaxUses, &c.CurrentUses, &c.IsActive, &createdBy, &c.CreatedAt, &expiresAt)
		if err != nil {
			continue
		}

		if createdBy.Valid {
			c.CreatedBy = int(createdBy.Int64)
		}

		if expiresAt.Valid {
			c.ExpiresAt = &expiresAt.Time
		}

		codes = append(codes, c)
	}

	return codes, nil
}

func (r *Repository) UpdateCodeStatus(codeID int, isActive bool) error {
	_, err := r.db.Exec("UPDATE invitation_codes SET is_active = $1 WHERE id = $2", isActive, codeID)
	return err
}

// ✅ FUNCIÓN CORREGIDA - UPSERT (INSERT o UPDATE)
func (r *Repository) UpdateLicense(userID int, modules []string, expiresAt *time.Time, isActive bool) error {
	modulesJSON, _ := json.Marshal(modules)

	// Verificar si el usuario YA tiene una licencia
	var existingLicenseID int
	err := r.db.QueryRow("SELECT id FROM licenses WHERE user_id = $1 LIMIT 1", userID).Scan(&existingLicenseID)

	if err == sql.ErrNoRows {
		// NO EXISTE -> INSERT (crear nueva licencia)
		_, err = r.db.Exec(`
            INSERT INTO licenses (user_id, modules, expires_at, is_active, invitation_code_id)
            VALUES ($1, $2, $3, $4, NULL)
        `, userID, modulesJSON, expiresAt, isActive)
	} else if err == nil {
		// SÍ EXISTE -> UPDATE (actualizar licencia existente)
		_, err = r.db.Exec(`
            UPDATE licenses 
            SET modules = $1, expires_at = $2, is_active = $3, updated_at = CURRENT_TIMESTAMP
            WHERE user_id = $4
        `, modulesJSON, expiresAt, isActive, userID)
	}

	return err
}

func (r *Repository) GetAllLicenses() ([]License, error) {
	rows, err := r.db.Query(`
        SELECT id, user_id, modules, expires_at, is_active, created_at
        FROM licenses 
        ORDER BY created_at DESC
    `)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var licenses []License
	for rows.Next() {
		var lic License
		var modulesJSON []byte
		var expiresAt sql.NullTime

		err := rows.Scan(&lic.ID, &lic.UserID, &modulesJSON, &expiresAt, &lic.IsActive, &lic.CreatedAt)
		if err != nil {
			continue
		}

		// Manejar JSON vacío o null
		if len(modulesJSON) > 0 {
			json.Unmarshal(modulesJSON, &lic.Modules)
		}
		if lic.Modules == nil {
			lic.Modules = []string{}
		}

		if expiresAt.Valid {
			lic.ExpiresAt = &expiresAt.Time
		}

		licenses = append(licenses, lic)
	}

	return licenses, nil
}
