package auth

import (
	"database/sql"
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

// ============================================
// PRODUCT LICENSES
// ============================================

func (r *Repository) CreateProductLicense(licenseCode, clientName, clientEmail string, maxDevices, daysValid int, notes string) (int64, error) {
	var expiresAt *time.Time
	if daysValid > 0 {
		exp := time.Now().Add(time.Duration(daysValid) * 24 * time.Hour)
		expiresAt = &exp
	}

	var id int64
	err := r.db.QueryRow(`
        INSERT INTO product_licenses (license_code, client_name, client_email, max_devices, expires_at, notes)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
    `, licenseCode, clientName, clientEmail, maxDevices, expiresAt, notes).Scan(&id)
	return id, err
}

func (r *Repository) GetAllProductLicenses() ([]ProductLicenseWithDetails, error) {
	rows, err := r.db.Query(`
        SELECT id, license_code, client_name, client_email, is_active, max_devices, created_at, expires_at, notes
        FROM product_licenses 
        ORDER BY created_at DESC
    `)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var licenses []ProductLicenseWithDetails
	for rows.Next() {
		var lic ProductLicenseWithDetails
		var clientEmail, notes sql.NullString
		var expiresAt sql.NullTime

		err := rows.Scan(&lic.ID, &lic.LicenseCode, &lic.ClientName, &clientEmail,
			&lic.IsActive, &lic.MaxDevices, &lic.CreatedAt, &expiresAt, &notes)
		if err != nil {
			continue
		}

		if clientEmail.Valid {
			lic.ClientEmail = clientEmail.String
		}
		if expiresAt.Valid {
			lic.ExpiresAt = &expiresAt.Time
		}
		if notes.Valid {
			lic.Notes = notes.String
		}

		// Contar dispositivos activos
		r.db.QueryRow(`SELECT COUNT(*) FROM license_devices WHERE license_id = $1`, lic.ID).Scan(&lic.CurrentDevices)

		// Obtener módulos
		moduleRows, _ := r.db.Query(`SELECT module_name FROM license_modules WHERE license_id = $1`, lic.ID)
		defer moduleRows.Close()
		var modules []string
		for moduleRows.Next() {
			var moduleName string
			moduleRows.Scan(&moduleName)
			modules = append(modules, moduleName)
		}
		lic.Modules = modules

		licenses = append(licenses, lic)
	}

	return licenses, nil
}

func (r *Repository) UpdateProductLicenseStatus(id int, isActive bool) error {
	_, err := r.db.Exec("UPDATE product_licenses SET is_active = $1 WHERE id = $2", isActive, id)
	return err
}

func (r *Repository) DeleteProductLicense(id int) error {
	_, err := r.db.Exec("DELETE FROM product_licenses WHERE id = $1", id)
	return err
}

func (r *Repository) UpdateProductLicense(id int, clientName, clientEmail string, maxDevices, daysValid int, notes string, isActive bool) error {
	var expiresAt *time.Time
	if daysValid > 0 {
		exp := time.Now().Add(time.Duration(daysValid) * 24 * time.Hour)
		expiresAt = &exp
	}

	_, err := r.db.Exec(`
        UPDATE product_licenses 
        SET client_name = $1, client_email = $2, max_devices = $3, 
            expires_at = $4, notes = $5, is_active = $6
        WHERE id = $7
    `, clientName, clientEmail, maxDevices, expiresAt, notes, isActive, id)
	return err
}

func (r *Repository) GetProductLicenseByCode(licenseCode string) (*ProductLicense, error) {
	var lic ProductLicense
	var clientEmail, notes sql.NullString
	var expiresAt sql.NullTime

	err := r.db.QueryRow(`
        SELECT id, license_code, client_name, client_email, is_active, max_devices, created_at, expires_at, notes
        FROM product_licenses 
        WHERE license_code = $1
    `, licenseCode).Scan(
		&lic.ID, &lic.LicenseCode, &lic.ClientName, &clientEmail,
		&lic.IsActive, &lic.MaxDevices, &lic.CreatedAt, &expiresAt, &notes,
	)

	if err != nil {
		return nil, err
	}

	if clientEmail.Valid {
		lic.ClientEmail = clientEmail.String
	}
	if expiresAt.Valid {
		lic.ExpiresAt = &expiresAt.Time
	}
	if notes.Valid {
		lic.Notes = notes.String
	}

	return &lic, nil
}

// ============================================
// LICENSE DEVICES
// ============================================

func (r *Repository) GetDeviceByLicenseAndMachine(licenseID int, machineID string) (*LicenseDevice, error) {
	var device LicenseDevice
	var deviceName sql.NullString

	err := r.db.QueryRow(`
        SELECT id, license_id, machine_id, device_name, first_activation, last_check
        FROM license_devices
        WHERE license_id = $1 AND machine_id = $2
    `, licenseID, machineID).Scan(
		&device.ID, &device.LicenseID, &device.MachineID, &deviceName,
		&device.FirstActivation, &device.LastCheck,
	)

	if err != nil {
		return nil, err
	}

	if deviceName.Valid {
		device.DeviceName = deviceName.String
	}

	return &device, nil
}

func (r *Repository) CountDevicesByLicense(licenseID int) (int, error) {
	var count int
	err := r.db.QueryRow(`SELECT COUNT(*) FROM license_devices WHERE license_id = $1`, licenseID).Scan(&count)
	return count, err
}

func (r *Repository) CreateLicenseDevice(licenseID int, machineID, deviceName string) error {
	_, err := r.db.Exec(`
        INSERT INTO license_devices (license_id, machine_id, device_name)
        VALUES ($1, $2, $3)
    `, licenseID, machineID, deviceName)
	return err
}

func (r *Repository) UpdateDeviceLastCheck(deviceID int) error {
	_, err := r.db.Exec(`
        UPDATE license_devices 
        SET last_check = $1
        WHERE id = $2
    `, time.Now(), deviceID)
	return err
}

func (r *Repository) GetLicenseDevices(licenseID int) ([]LicenseDevice, error) {
	rows, err := r.db.Query(`
        SELECT id, license_id, machine_id, device_name, first_activation, last_check
        FROM license_devices
        WHERE license_id = $1
        ORDER BY first_activation DESC
    `, licenseID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var devices []LicenseDevice
	for rows.Next() {
		var device LicenseDevice
		var deviceName sql.NullString

		err := rows.Scan(&device.ID, &device.LicenseID, &device.MachineID, &deviceName,
			&device.FirstActivation, &device.LastCheck)
		if err != nil {
			continue
		}

		if deviceName.Valid {
			device.DeviceName = deviceName.String
		}

		devices = append(devices, device)
	}

	return devices, nil
}

func (r *Repository) DeleteLicenseDevice(deviceID int) error {
	_, err := r.db.Exec("DELETE FROM license_devices WHERE id = $1", deviceID)
	return err
}

// ============================================
// LICENSE MODULES
// ============================================

func (r *Repository) HasModule(licenseID int, moduleName string) (bool, error) {
	var exists bool
	err := r.db.QueryRow(`
        SELECT EXISTS(SELECT 1 FROM license_modules WHERE license_id = $1 AND module_name = $2)
    `, licenseID, moduleName).Scan(&exists)
	return exists, err
}

func (r *Repository) AddLicenseModule(licenseID int, moduleName string) error {
	_, err := r.db.Exec(`
        INSERT INTO license_modules (license_id, module_name)
        VALUES ($1, $2)
        ON CONFLICT (license_id, module_name) DO NOTHING
    `, licenseID, moduleName)
	return err
}

func (r *Repository) GetLicenseModules(licenseID int) ([]LicenseModule, error) {
	rows, err := r.db.Query(`
        SELECT id, license_id, module_name, added_at
        FROM license_modules
        WHERE license_id = $1
        ORDER BY added_at DESC
    `, licenseID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var modules []LicenseModule
	for rows.Next() {
		var module LicenseModule
		err := rows.Scan(&module.ID, &module.LicenseID, &module.ModuleName, &module.AddedAt)
		if err != nil {
			continue
		}
		modules = append(modules, module)
	}

	return modules, nil
}

func (r *Repository) DeleteLicenseModule(moduleID int) error {
	_, err := r.db.Exec("DELETE FROM license_modules WHERE id = $1", moduleID)
	return err
}

// ============================================
// PRODUCTS
// ============================================

func (r *Repository) GetAllProducts() ([]Product, error) {
	rows, err := r.db.Query(`
        SELECT id, product_name, display_name, description, is_active, created_at
        FROM products
        WHERE is_active = true
        ORDER BY display_name
    `)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var products []Product
	for rows.Next() {
		var product Product
		var description sql.NullString

		err := rows.Scan(&product.ID, &product.ProductName, &product.DisplayName,
			&description, &product.IsActive, &product.CreatedAt)
		if err != nil {
			continue
		}

		if description.Valid {
			product.Description = description.String
		}

		products = append(products, product)
	}

	return products, nil
}
