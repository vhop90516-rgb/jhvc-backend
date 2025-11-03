// internal/calculadora/models.go
package calculadora

// ConfigFiscal representa una configuración de impuestos predefinida
type ConfigFiscal struct {
	Nombre       string  `json:"nombre"`
	IVARate      float64 `json:"iva_rate"`
	ISRRate      float64 `json:"isr_rate"`
	ISHRate      float64 `json:"ish_rate"`
	IVARetencion bool    `json:"iva_retencion"`
	Descripcion  string  `json:"descripcion"`
}

// CalculoFiscal representa el resultado de un cálculo fiscal
type CalculoFiscal struct {
	Subtotal      float64 `json:"subtotal"`
	IVA           float64 `json:"iva"`
	ISH           float64 `json:"ish"`
	RetencionISR  float64 `json:"retencion_isr"`
	RetencionIVA  float64 `json:"retencion_iva"`
	Total         float64 `json:"total"`
	Factor        float64 `json:"factor"`
	TipoCalculo   string  `json:"tipo_calculo"`
	Configuracion string  `json:"configuracion"`
}

// CalculoRequest representa la petición de cálculo
type CalculoRequest struct {
	Tipo              string  `form:"tipo" binding:"required,oneof=directo inverso"`
	Monto             float64 `form:"monto" binding:"required,gt=0"`
	ConfigIndex       int     `form:"config" binding:"required,gte=0"`
	RetencionEspecial float64 `form:"retencion_especial"`
}
