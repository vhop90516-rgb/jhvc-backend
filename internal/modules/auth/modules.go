package auth

var AvailableModules = map[string]string{
	"calculadora":  "Calculadora de Impuestos",
	"visor":        "Visor de Facturas CFDI",
	"contabilidad": "Módulo de Contabilidad",
	"nomina":       "Gestión de Nómina",
	"reportes":     "Reportes Avanzados",
	"facturacion":  "Facturación Electrónica",
}

func IsValidModule(module string) bool {
	_, exists := AvailableModules[module]
	return exists
}

func GetModulesList() []string {
	modules := make([]string, 0, len(AvailableModules))
	for key := range AvailableModules {
		modules = append(modules, key)
	}
	return modules
}

func GetModulesMap() map[string]string {
	return AvailableModules
}
