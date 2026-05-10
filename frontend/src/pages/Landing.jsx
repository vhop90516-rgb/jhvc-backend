import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

const Landing = () => {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,600;1,700;1,800&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: #ffffff; color: #2C3E50; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(30px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50%       { transform: translateY(-10px); }
    }
    @keyframes shimmer {
      0%   { background-position: -1000px 0; }
      100% { background-position:  1000px 0; }
    }
    @keyframes pulse {
      0%, 100% { opacity: 0.6; transform: scale(1); }
      50%       { opacity: 1;   transform: scale(1.03); }
    }

    .fade-up   { animation: fadeUp 0.7s ease forwards; }
    .fade-up-2 { animation: fadeUp 0.7s ease 0.15s both; }
    .fade-up-3 { animation: fadeUp 0.7s ease 0.30s both; }
    .fade-up-4 { animation: fadeUp 0.7s ease 0.45s both; }
    .float     { animation: float 5s ease-in-out infinite; }

    .nav-link {
      color: #2C3E50;
      text-decoration: none;
      font-size: 0.88rem;
      font-weight: 600;
      font-style: italic;
      letter-spacing: 0.3px;
      transition: color 0.2s;
    }
    .nav-link:hover { color: #17a2b8; }

    .card-hover {
      transition: transform 0.25s ease, box-shadow 0.25s ease;
    }
    .card-hover:hover {
      transform: translateY(-6px);
      box-shadow: 0 16px 40px rgba(44,62,80,0.12) !important;
    }

    .feature-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 0.45rem 1rem;
      border: 1px solid #EBEBEB;
      border-radius: 50px;
      font-size: 0.8rem;
      font-weight: 600;
      font-style: italic;
      color: #546E7A;
      background: white;
      transition: all 0.2s;
    }
    .feature-chip:hover {
      border-color: #17a2b8;
      color: #17a2b8;
      background: #f0fbfd;
    }

    .btn-primary {
      padding: 0.85rem 2rem;
      background: #2C3E50;
      border: none;
      border-radius: 8px;
      color: white;
      font-size: 0.9rem;
      font-weight: 700;
      font-style: italic;
      cursor: pointer;
      transition: all 0.25s;
      letter-spacing: 0.3px;
    }
    .btn-primary:hover {
      background: #17a2b8;
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(23,162,184,0.3);
    }

    .btn-outline {
      padding: 0.85rem 2rem;
      background: transparent;
      border: 2px solid #2C3E50;
      border-radius: 8px;
      color: #2C3E50;
      font-size: 0.9rem;
      font-weight: 700;
      font-style: italic;
      cursor: pointer;
      transition: all 0.25s;
    }
    .btn-outline:hover {
      background: #2C3E50;
      color: white;
      transform: translateY(-2px);
    }

    .module-card {
      background: white;
      border: 1.5px solid #EBEBEB;
      border-radius: 12px;
      padding: 1.75rem;
      transition: all 0.25s;
    }
    .module-card:hover {
      border-color: #17a2b8;
      box-shadow: 0 8px 24px rgba(23,162,184,0.1);
      transform: translateY(-4px);
    }

    .accent-line {
      width: 40px;
      height: 3px;
      background: #17a2b8;
      border-radius: 2px;
      margin-bottom: 1rem;
    }

    .shimmer-bar {
      height: 4px;
      background: linear-gradient(90deg, #2C3E50 0%, #17a2b8 50%, #2C3E50 100%);
      background-size: 200% 100%;
      animation: shimmer 2.5s linear infinite;
    }

    @media (max-width: 768px) {
      .hide-mobile { display: none !important; }
      .mobile-col  { flex-direction: column !important; }
      .mobile-grid-1 { grid-template-columns: 1fr !important; }
      .mobile-center { text-align: center !important; }
      .mobile-px { padding-left: 1.25rem !important; padding-right: 1.25rem !important; }
      .mobile-h1 { font-size: 2.2rem !important; }
      .mobile-h2 { font-size: 1.8rem !important; }
    }
  `

  const modulos = [
    {
      icon: '📥',
      nombre: 'Descarga SAT',
      desc: 'Descarga masiva de CFDIs directamente desde el portal del SAT con tu e.firma. Manual o automática por lote.',
      chips: ['CFDI 4.0', 'Webservice', 'e.firma']
    },
    {
      icon: '🔍',
      nombre: 'Visor CFDI',
      desc: 'Visualiza, filtra y analiza tus CFDIs con desglose completo de impuestos: IVA, IEPS, ISR, retenciones y complementos.',
      chips: ['Ingresos', 'Pagos', 'Nómina']
    },
    {
      icon: '📊',
      nombre: 'Módulo ISR',
      desc: 'Calcula las bases gravables por régimen fiscal. Compatible con RESICO, AEFP, 601 PM y más. Exporta a Excel.',
      chips: ['626 RESICO', '612 AEFP', '601 PM']
    },
    {
      icon: '💰',
      nombre: 'Módulo IVA',
      desc: 'Determina el IVA trasladado, acreditable y retenido por período. Reportes listos para declaración.',
      chips: ['16%', '8%', '0%', 'Exento']
    },
    {
      icon: '📑',
      nombre: 'Retenciones',
      desc: 'Gestiona comprobantes de retención e información de pagos con desglose por tipo y período.',
      chips: ['ISR', 'IVA', 'IEPS']
    },
    {
      icon: '📤',
      nombre: 'Exportar Excel',
      desc: 'Genera reportes Excel profesionales con un clic: bases ISR, desglose IVA, listado de CFDIs y más.',
      chips: ['XLSX', 'Multi-hoja', 'Automático']
    },
  ]

  return (
    <>
      <style>{styles}</style>

      {/* ── NAVBAR ─────────────────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${scrolled ? '#EBEBEB' : 'transparent'}`,
        transition: 'all 0.3s',
        padding: scrolled ? '0.75rem 0' : '1rem 0',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <span style={{ fontSize: '1.35rem', fontWeight: 900, fontStyle: 'italic', color: '#2C3E50', letterSpacing: '-0.5px' }}>EXC</span>
            <span style={{ fontSize: '1.35rem', fontWeight: 900, fontStyle: 'italic', color: '#17a2b8', letterSpacing: '-0.5px' }}>FDI</span>
            <span style={{ fontSize: '0.65rem', fontWeight: 600, color: '#90A4AE', fontStyle: 'italic', marginLeft: 4, letterSpacing: '1px' }}>by JHVC</span>
          </div>

          <div className="hide-mobile" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            {[
              { label: 'Inicio',    href: '#hero' },
              { label: 'Producto', href: '#modulos' },
              { label: 'Nosotros', href: '#about' },
              { label: 'Contacto', href: '#contact' },
            ].map(item => (
              <a key={item.label} href={item.href} className="nav-link">{item.label}</a>
            ))}
          </div>

          <button className="btn-primary" onClick={() => navigate('/login')}
            style={{ padding: '0.6rem 1.4rem', fontSize: '0.82rem' }}>
            Iniciar Sesión
          </button>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section id="hero" style={{
        minHeight: '100vh',
        background: '#ffffff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        paddingTop: '5rem', paddingBottom: '4rem',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* fondo decorativo */}
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: '45%', height: '100%',
          background: 'linear-gradient(135deg, #f8fbfd 0%, #e8f4f8 100%)',
          clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)',
          zIndex: 0,
        }}/>
        <div style={{
          position: 'absolute', bottom: '8%', left: '4%',
          width: 200, height: 200,
          background: 'radial-gradient(circle, rgba(23,162,184,0.08) 0%, transparent 70%)',
          borderRadius: '50%',
        }}/>

        <div className="mobile-px" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 1, width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>

            <div>
              <div className="fade-up" style={{ marginBottom: '1.5rem' }}>
                <span style={{
                  display: 'inline-block',
                  padding: '0.4rem 1rem',
                  background: '#EEF2F5',
                  borderRadius: '50px',
                  fontSize: '0.72rem', fontWeight: 700, fontStyle: 'italic',
                  color: '#2C3E50', letterSpacing: '1.5px', textTransform: 'uppercase',
                }}>
                  Plataforma para Contadores Mexicanos
                </span>
              </div>

              <h1 className="fade-up-2 mobile-h1" style={{
                fontSize: '3.2rem', fontWeight: 900, fontStyle: 'italic',
                color: '#2C3E50', lineHeight: 1.15, marginBottom: '1.5rem',
                letterSpacing: '-1px',
              }}>
                Gestión profesional<br/>
                de <span style={{ color: '#17a2b8' }}>CFDI</span> para<br/>
                tu despacho
              </h1>

              <p className="fade-up-3" style={{
                fontSize: '1.1rem', color: '#546E7A', lineHeight: 1.75,
                marginBottom: '2.5rem', fontStyle: 'italic', maxWidth: 480,
              }}>
                EXCFDI es la plataforma todo-en-uno para descargar, visualizar, analizar y exportar tus CFDIs. Funciona 100% local — tus datos nunca salen de tu equipo.
              </p>

              <div className="fade-up-4" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button className="btn-primary"
                  onClick={() => document.getElementById('modulos').scrollIntoView({ behavior: 'smooth' })}>
                  Ver módulos
                </button>
                <button className="btn-outline"
                  onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}>
                  Contactar
                </button>
              </div>

              <div className="fade-up-4" style={{ display: 'flex', gap: '2rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
                {[
                  { valor: '100%', label: 'Local y seguro' },
                  { valor: 'CFDI 4.0', label: 'Actualizado SAT' },
                  { valor: '∞', label: 'Sin límite de XML' },
                ].map(({ valor, label }) => (
                  <div key={label}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, fontStyle: 'italic', color: '#2C3E50' }}>{valor}</div>
                    <div style={{ fontSize: '0.75rem', fontStyle: 'italic', color: '#90A4AE', fontWeight: 600 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* panel derecho */}
            <div className="hide-mobile float" style={{ position: 'relative' }}>
              <div style={{
                background: 'white', borderRadius: 16,
                border: '1.5px solid #EBEBEB',
                boxShadow: '0 20px 60px rgba(44,62,80,0.1)',
                overflow: 'hidden',
              }}>
                <div className="shimmer-bar"/>
                <div style={{ padding: '1.5rem' }}>
                  {/* header simulado */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ fontSize: '0.65rem', fontStyle: 'italic', fontWeight: 700, color: '#90A4AE', textTransform: 'uppercase', letterSpacing: '0.5px' }}>EXCFDI — Visor</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, fontStyle: 'italic', color: '#2C3E50' }}>AALS811005274</div>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {['2024', 'Enero'].map(chip => (
                        <span key={chip} style={{ padding: '2px 10px', background: '#2C3E50', color: 'white', borderRadius: 50, fontSize: '0.65rem', fontWeight: 700 }}>{chip}</span>
                      ))}
                    </div>
                  </div>
                  {/* tabs simulados */}
                  <div style={{ display: 'flex', borderBottom: '2px solid #EBEBEB', marginBottom: '1rem', gap: '1.5rem' }}>
                    {['↑ EMITIDOS 142', '↓ RECIBIDOS 89'].map((tab, i) => (
                      <div key={tab} style={{
                        fontSize: '0.72rem', fontWeight: 700, fontStyle: 'italic',
                        color: i === 0 ? '#2C3E50' : '#90A4AE',
                        borderBottom: i === 0 ? '2px solid #2C3E50' : 'none',
                        paddingBottom: '0.5rem', marginBottom: '-2px',
                      }}>{tab}</div>
                    ))}
                  </div>
                  {/* filas simuladas */}
                  {[
                    { tipo: 'I', uuid: 'A3F2-7B91...', total: '$45,320.00', iva: '$7,251.20' },
                    { tipo: 'E', uuid: 'C8D1-2E44...', total: '$12,000.00', iva: '$1,920.00' },
                    { tipo: 'P', uuid: 'F1A9-9C33...', total: '$28,750.00', iva: '$4,600.00' },
                    { tipo: 'N', uuid: 'B7E5-4D82...', total: '$18,500.00', iva: '—' },
                  ].map((row, i) => (
                    <div key={i} style={{
                      display: 'grid', gridTemplateColumns: '28px 1fr 90px 80px',
                      gap: 8, padding: '0.6rem 0',
                      borderBottom: '1px solid #F5F5F5',
                      alignItems: 'center',
                    }}>
                      <span style={{
                        width: 22, height: 22, borderRadius: 4,
                        background: row.tipo === 'I' ? '#E8F5E9' : row.tipo === 'E' ? '#FFEBEE' : row.tipo === 'P' ? '#E3F2FD' : '#FFF8E1',
                        color: row.tipo === 'I' ? '#2E7D32' : row.tipo === 'E' ? '#C62828' : row.tipo === 'P' ? '#1565C0' : '#F57F17',
                        fontSize: '0.65rem', fontWeight: 800,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>{row.tipo}</span>
                      <span style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: '#546E7A' }}>{row.uuid}</span>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, fontStyle: 'italic', color: '#2C3E50', textAlign: 'right' }}>{row.total}</span>
                      <span style={{ fontSize: '0.68rem', fontStyle: 'italic', color: '#90A4AE', textAlign: 'right' }}>{row.iva}</span>
                    </div>
                  ))}
                  {/* totales */}
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    marginTop: '1rem', padding: '0.75rem',
                    background: '#F8F9FA', borderRadius: 8,
                  }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, fontStyle: 'italic', color: '#2C3E50' }}>∑ TOTALES — 142 CFDIs</span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, fontStyle: 'italic', color: '#17a2b8' }}>$104,570.00</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── MÓDULOS ────────────────────────────────────────────────── */}
      <section id="modulos" style={{ background: '#F8F9FA', padding: '6rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div className="accent-line" style={{ margin: '0 auto 1rem' }}/>
            <h2 className="mobile-h2" style={{ fontSize: '2.4rem', fontWeight: 800, fontStyle: 'italic', color: '#2C3E50', marginBottom: '1rem' }}>
              Todo lo que necesita tu despacho
            </h2>
            <p style={{ fontSize: '1rem', color: '#546E7A', fontStyle: 'italic', maxWidth: 560, margin: '0 auto' }}>
              EXCFDI integra todos los módulos que un contador necesita en una sola plataforma portable
            </p>
          </div>

          <div className="mobile-grid-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {modulos.map((mod, i) => (
              <div key={i} className="module-card">
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{mod.icon}</div>
                <div className="accent-line"/>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, fontStyle: 'italic', color: '#2C3E50', marginBottom: '0.6rem' }}>
                  {mod.nombre}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#546E7A', fontStyle: 'italic', lineHeight: 1.65, marginBottom: '1rem' }}>
                  {mod.desc}
                </p>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {mod.chips.map(chip => (
                    <span key={chip} className="feature-chip">{chip}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ──────────────────────────────────────────────────── */}
      <section id="about" style={{ background: '#ffffff', padding: '6rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="mobile-grid-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
            <div>
              <div className="accent-line"/>
              <h2 className="mobile-h2" style={{ fontSize: '2.4rem', fontWeight: 800, fontStyle: 'italic', color: '#2C3E50', marginBottom: '1.5rem', lineHeight: 1.2 }}>
                Hecho por contadores,<br/>para contadores
              </h2>
              <p style={{ fontSize: '1rem', color: '#546E7A', fontStyle: 'italic', lineHeight: 1.8, marginBottom: '1.25rem' }}>
                JHVC Tech Solutions nació de una necesidad real: los contadores pasan horas en tareas repetitivas que la tecnología puede resolver.
              </p>
              <p style={{ fontSize: '1rem', color: '#546E7A', fontStyle: 'italic', lineHeight: 1.8, marginBottom: '1.25rem' }}>
                <strong style={{ color: '#2C3E50' }}>EXCFDI</strong> es nuestra respuesta — una plataforma profesional que compite con software de miles de pesos al año, disponible para todos los contadores mexicanos.
              </p>
              <p style={{ fontSize: '1rem', color: '#546E7A', fontStyle: 'italic', lineHeight: 1.8 }}>
                Funciona sin internet, sin suscripciones ocultas, sin que tus datos salgan de tu equipo.
              </p>

              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
                {[
                  { valor: '100%', label: 'Portable' },
                  { valor: 'SAT', label: 'CFDI 4.0 + Pagos 2.0' },
                  { valor: '0', label: 'Datos en la nube' },
                ].map(({ valor, label }) => (
                  <div key={label} style={{
                    padding: '1.25rem 1.5rem',
                    border: '1.5px solid #EBEBEB',
                    borderRadius: 10, textAlign: 'center', flex: 1, minWidth: 100,
                  }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, fontStyle: 'italic', color: '#17a2b8' }}>{valor}</div>
                    <div style={{ fontSize: '0.72rem', fontStyle: 'italic', color: '#90A4AE', fontWeight: 600, marginTop: 4 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="hide-mobile">
              <div style={{
                background: '#F8F9FA', borderRadius: 16,
                border: '1.5px solid #EBEBEB',
                padding: '2rem', position: 'relative',
              }}>
                <div className="shimmer-bar" style={{ borderRadius: '4px 4px 0 0', marginBottom: '1.5rem', marginTop: '-2rem', marginLeft: '-2rem', marginRight: '-2rem', borderTopLeftRadius: 14, borderTopRightRadius: 14 }}/>
                <div style={{ fontWeight: 800, fontStyle: 'italic', color: '#2C3E50', fontSize: '0.85rem', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  ¿Por qué EXCFDI?
                </div>
                {[
                  { icon: '🔒', texto: 'Tus datos nunca salen de tu PC' },
                  { icon: '⚡', texto: 'Descarga masiva desde el SAT con e.firma' },
                  { icon: '📊', texto: 'Bases ISR por régimen fiscal automáticas' },
                  { icon: '💾', texto: 'Sin instalación — un solo ejecutable .exe' },
                  { icon: '📤', texto: 'Exporta reportes Excel profesionales' },
                  { icon: '🆓', texto: 'Versión gratuita disponible — 1 RFC' },
                ].map(({ icon, texto }, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '0.85rem',
                    padding: '0.85rem 0',
                    borderBottom: i < 5 ? '1px solid #EBEBEB' : 'none',
                  }}>
                    <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{icon}</span>
                    <span style={{ fontSize: '0.88rem', fontStyle: 'italic', color: '#546E7A', fontWeight: 500 }}>{texto}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────── */}
      <section style={{
        background: '#2C3E50', padding: '5rem 2rem', textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600, height: 600,
          background: 'radial-gradient(circle, rgba(23,162,184,0.15) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }}/>
        <div style={{ maxWidth: 700, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-block', padding: '0.4rem 1rem',
            background: 'rgba(23,162,184,0.2)',
            borderRadius: 50, fontSize: '0.72rem', fontWeight: 700,
            fontStyle: 'italic', color: '#17a2b8',
            letterSpacing: '1.5px', textTransform: 'uppercase',
            marginBottom: '1.5rem',
          }}>
            Versión Gratuita Disponible
          </div>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 800, fontStyle: 'italic', color: 'white', marginBottom: '1rem', lineHeight: 1.2 }}>
            Empieza hoy con EXCFDI
          </h2>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.7)', fontStyle: 'italic', marginBottom: '2rem', lineHeight: 1.7 }}>
            Descarga la versión gratuita con 1 RFC incluido y descubre por qué los contadores prefieren EXCFDI sobre el software tradicional.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary" style={{ background: '#17a2b8' }}
              onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}>
              Obtener versión gratuita
            </button>
            <button className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'white' }}
              onClick={() => navigate('/login')}>
              Ya tengo cuenta
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────── */}
      <footer id="contact" style={{ background: '#1A252F', padding: '4rem 2rem 2rem', color: 'white' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="mobile-grid-1" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 900, fontStyle: 'italic', color: 'white' }}>EXC</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 900, fontStyle: 'italic', color: '#17a2b8' }}>FDI</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)', fontStyle: 'italic', lineHeight: 1.7, maxWidth: 280 }}>
                Plataforma profesional de gestión de CFDI para contadores mexicanos. Desarrollado por JHVC Tech Solutions.
              </p>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, fontStyle: 'italic', color: '#17a2b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>Producto</div>
              {['Módulos', 'Descarga SAT', 'Visor CFDI', 'Módulo ISR'].map(item => (
                <div key={item} style={{ marginBottom: '0.6rem' }}>
                  <a href="#modulos" style={{ color: 'rgba(255,255,255,0.55)', textDecoration: 'none', fontSize: '0.85rem', fontStyle: 'italic', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color = 'white'}
                    onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.55)'}>
                    {item}
                  </a>
                </div>
              ))}
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, fontStyle: 'italic', color: '#17a2b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>Empresa</div>
              {['Nosotros', 'JHVC Tech Solutions'].map(item => (
                <div key={item} style={{ marginBottom: '0.6rem' }}>
                  <a href="#about" style={{ color: 'rgba(255,255,255,0.55)', textDecoration: 'none', fontSize: '0.85rem', fontStyle: 'italic', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color = 'white'}
                    onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.55)'}>
                    {item}
                  </a>
                </div>
              ))}
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, fontStyle: 'italic', color: '#17a2b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>Contacto</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {[
                  { icon: '📧', text: 'bahiacontable02@gmail.com' },
                  { icon: '📱', text: '+52 322 328 7655' },
                  { icon: '📘', text: 'Virtual Accounting' },
                  { icon: '💬', text: 'WhatsApp disponible' },
                ].map(({ icon, text }) => (
                  <div key={text} style={{ fontSize: '0.82rem', fontStyle: 'italic', color: 'rgba(255,255,255,0.55)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>{icon}</span>{text}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <span style={{ fontSize: '0.8rem', fontStyle: 'italic', color: 'rgba(255,255,255,0.35)' }}>
              © 2025 JHVC Tech Solutions. Todos los derechos reservados.
            </span>
            <span style={{ fontSize: '0.8rem', fontStyle: 'italic', color: 'rgba(255,255,255,0.35)' }}>
              EXCFDI — Plataforma CFDI 4.0
            </span>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Landing