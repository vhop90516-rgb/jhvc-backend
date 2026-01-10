// internal/calculadora/service.go
package calculadora

import "errors"

var (
	ErrConfigNotFound = errors.New("configuración no encontrada")
	ErrInvalidAmount  = errors.New("monto inválido")
)

// Service maneja la lógica de negocio de cálculos fiscales
type Service struct {
	configuraciones []ConfigFiscal
}

// NewService crea una nueva instancia del servicio
func NewService() *Service {
	return &Service{
		configuraciones: loadDefaultConfigs(),
	}
}

// GetConfiguraciones devuelve todas las configuraciones disponibles
func (s *Service) GetConfiguraciones() []ConfigFiscal {
	return s.configuraciones
}

// GetConfiguracion obtiene una configuración específica por índice
func (s *Service) GetConfiguracion(index int) (*ConfigFiscal, error) {
	if index < 0 || index >= len(s.configuraciones) {
		return nil, ErrConfigNotFound
	}
	return &s.configuraciones[index], nil
}

// CalcularDirecto calcula de subtotal a total
func (s *Service) CalcularDirecto(subtotal float64, config ConfigFiscal, retencionEspecial float64) CalculoFiscal {
	iva := subtotal * config.IVARate
	ish := subtotal * config.ISHRate
	retencionISR := subtotal * config.ISRRate

	var retencionIVA float64
	if config.IVARetencion {
		retencionIVA = iva * (2.0 / 3.0)
	} else if retencionEspecial > 0 {
		retencionIVA = subtotal * retencionEspecial
	}

	total := subtotal + iva + ish - retencionISR - retencionIVA

	return CalculoFiscal{
		Subtotal:      roundTo2Decimals(subtotal),
		IVA:           roundTo2Decimals(iva),
		ISH:           roundTo2Decimals(ish),
		RetencionISR:  roundTo2Decimals(retencionISR),
		RetencionIVA:  roundTo2Decimals(retencionIVA),
		Total:         roundTo2Decimals(total),
		Factor:        0,
		TipoCalculo:   "directo",
		Configuracion: config.Descripcion,
	}
}

// CalcularInverso calcula de total a subtotal
func (s *Service) CalcularInverso(total float64, config ConfigFiscal, retencionEspecial float64) CalculoFiscal {
	var retencionIVARate float64
	if config.IVARetencion {
		retencionIVARate = config.IVARate * (2.0 / 3.0)
	} else if retencionEspecial > 0 {
		retencionIVARate = retencionEspecial
	}

	factor := 1 + config.IVARate + config.ISHRate - config.ISRRate - retencionIVARate
	subtotal := total / factor

	iva := subtotal * config.IVARate
	ish := subtotal * config.ISHRate
	retencionISR := subtotal * config.ISRRate

	var retencionIVA float64
	if config.IVARetencion {
		retencionIVA = iva * (2.0 / 3.0)
	} else if retencionEspecial > 0 {
		retencionIVA = subtotal * retencionEspecial
	}

	return CalculoFiscal{
		Subtotal:      roundTo2Decimals(subtotal),
		IVA:           roundTo2Decimals(iva),
		ISH:           roundTo2Decimals(ish),
		RetencionISR:  roundTo2Decimals(retencionISR),
		RetencionIVA:  roundTo2Decimals(retencionIVA),
		Total:         roundTo2Decimals(total),
		Factor:        roundTo2Decimals(factor),
		TipoCalculo:   "inverso",
		Configuracion: config.Descripcion,
	}
}

// loadDefaultConfigs carga las configuraciones predeterminadas
func loadDefaultConfigs() []ConfigFiscal {
	return []ConfigFiscal{
		{
			Nombre:       "honorarios_resico",
			IVARate:      0.16,
			ISRRate:      0.0125,
			ISHRate:      0.0,
			IVARetencion: true,
			Descripcion:  "RESICO - Honorarios (IVA 16%, ISR 1.25%, Ret. IVA 2/3)",
		},
		{
			Nombre:       "honorarios_general",
			IVARate:      0.16,
			ISRRate:      0.10,
			ISHRate:      0.0,
			IVARetencion: true,
			Descripcion:  "Honorarios Generales (IVA 16%, ISR 10%, Ret. IVA 2/3)",
		},
		{
			Nombre:       "arrendamiento_resico",
			IVARate:      0.16,
			ISRRate:      0.0125,
			ISHRate:      0.0,
			IVARetencion: true,
			Descripcion:  "RESICO - Arrendamiento (IVA 16%, ISR 1.25%, Ret. IVA 2/3)",
		},
		{
			Nombre:       "arrendamiento_general",
			IVARate:      0.16,
			ISRRate:      0.10,
			ISHRate:      0.0,
			IVARetencion: true,
			Descripcion:  "Arrendamiento General (IVA 16%, ISR 10%, Ret. IVA 2/3)",
		},
		{
			Nombre:       "hospedaje",
			IVARate:      0.16,
			ISRRate:      0.0,
			ISHRate:      0.05,
			IVARetencion: false,
			Descripcion:  "Hospedaje (IVA 16%, ISH 5%, Sin Retenciones)",
		},
		{
			Nombre:       "hospedaje_retencion",
			IVARate:      0.16,
			ISRRate:      0.0,
			ISHRate:      0.05,
			IVARetencion: true,
			Descripcion:  "Hospedaje con Retención (IVA 16%, ISH 5%, Ret. IVA 2/3)",
		},
		{
			Nombre:       "empresarial_resico",
			IVARate:      0.16,
			ISRRate:      0.0125,
			ISHRate:      0.0,
			IVARetencion: false,
			Descripcion:  "RESICO - Empresarial (IVA 16%, ISR 1.25%, Sin Ret. IVA)",
		},
		{
			Nombre:       "comisionista",
			IVARate:      0.16,
			ISRRate:      0.0,
			ISHRate:      0.0,
			IVARetencion: true,
			Descripcion:  "Comisionista (IVA 16%, Sin ISR, Ret. IVA 2/3)",
		},
		{
			Nombre:       "autotransporte",
			IVARate:      0.16,
			ISRRate:      0.0,
			ISHRate:      0.0,
			IVARetencion: false,
			Descripcion:  "Autotransporte (IVA 16%, Sin ISR, Ret. IVA 4%)",
		},
		{
			Nombre:       "frontera_resico",
			IVARate:      0.08,
			ISRRate:      0.0125,
			ISHRate:      0.0,
			IVARetencion: true,
			Descripcion:  "Frontera RESICO (IVA 8%, ISR 1.25%, Ret. IVA 2/3)",
		},
		{
			Nombre:       "sin_impuestos",
			IVARate:      0.0,
			ISRRate:      0.0,
			ISHRate:      0.0,
			IVARetencion: false,
			Descripcion:  "Sin Impuestos (IVA 0%, ISR 0%)",
		},
		{
			Nombre:       "solo_iva",
			IVARate:      0.16,
			ISRRate:      0.0,
			ISHRate:      0.0,
			IVARetencion: false,
			Descripcion:  "Solo IVA (IVA 16%, Sin ISR, Sin Retenciones)",
		},
		{
			Nombre:       "tasa_exenta_resico",
			IVARate:      0.0,
			ISRRate:      0.0115,
			ISHRate:      0.0,
			IVARetencion: false,
			Descripcion:  "Tasa Exenta/0% - ISR RESICO 1.15%",
		},
	}
}

// roundTo2Decimals redondea a 2 decimales
func roundTo2Decimals(val float64) float64 {
	return float64(int(val*100+0.5)) / 100
}
