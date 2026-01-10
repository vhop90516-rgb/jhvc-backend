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
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    
    @keyframes float {
      0%, 100% { transform: translateY(0) scale(1); }
      50% { transform: translateY(-20px) scale(1.02); }
    }
    
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(40px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    
    @keyframes slideInLeft {
      from { opacity: 0; transform: translateX(-40px); }
      to { opacity: 1; transform: translateX(0); }
    }
    
    @keyframes gradient {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    
    .animate-in { animation: fadeInUp 0.8s ease-out forwards; }
    .scale-in { animation: scaleIn 0.6s ease-out forwards; }
    .slide-left { animation: slideInLeft 0.8s ease-out forwards; }
    .gradient-bg { 
      background: linear-gradient(135deg, #0c4d7b 0%, #17a2b8 50%, #0c4d7b 100%);
      background-size: 200% 200%;
      animation: gradient 15s ease infinite;
    }
  `

  return (
    <>
      <style>{styles}</style>
      
      {/* NAVBAR */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: scrolled ? 'rgba(12, 77, 123, 0.95)' : 'rgba(12, 77, 123, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
        transition: 'all 0.3s ease',
        padding: scrolled ? '0.75rem 0' : '1rem 0'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #17a2b8, #93c5fd)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em',
            cursor: 'pointer'
          }} onClick={() => navigate('/')}>
            JHVC Tech Solutions
          </div>
          
          <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
            {[
              { name: 'Inicio', href: '#hero' },
              { name: 'Nosotros', href: '#about' },
              { name: 'Producto', href: '#product' },
              { name: 'Contacto', href: '#contact' }
            ].map(item => (
              <a key={item.name} href={item.href} style={{
                color: 'rgba(255, 255, 255, 0.85)',
                textDecoration: 'none',
                fontWeight: 500,
                fontSize: '0.95rem',
                transition: 'all 0.3s',
                letterSpacing: '0.01em'
              }}
              onMouseEnter={e => e.target.style.color = 'white'}
              onMouseLeave={e => e.target.style.color = 'rgba(255, 255, 255, 0.85)'}>
                {item.name}
              </a>
            ))}
            
            <button onClick={() => navigate('/login')} style={{
              padding: '0.75rem 1.75rem',
              background: 'linear-gradient(135deg, #17a2b8, #0c4d7b)',
              border: 'none',
              borderRadius: '10px',
              color: 'white',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseEnter={e => {
              e.target.style.transform = 'translateY(-2px)'
              e.target.style.boxShadow = '0 8px 20px rgba(23, 162, 184, 0.4)'
            }}
            onMouseLeave={e => {
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = 'none'
            }}>
              Iniciar Sesión
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section id="hero" className="gradient-bg" style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: '5rem'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.2
        }}>
          {[...Array(25)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: Math.random() * 250 + 40 + 'px',
              height: Math.random() * 250 + 40 + 'px',
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(255,255,255,${Math.random() * 0.08}) 0%, transparent 70%)`,
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animation: `float ${Math.random() * 18 + 12}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 4}s`
            }} />
          ))}
        </div>

        <div style={{ 
          maxWidth: '1400px', 
          margin: '0 auto', 
          padding: '0 2rem', 
          position: 'relative', 
          zIndex: 1,
          textAlign: 'center'
        }}>
          <div className="animate-in" style={{ marginBottom: '1.5rem' }}>
            <div style={{
              display: 'inline-block',
              padding: '0.5rem 1.5rem',
              background: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '50px',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: 'white',
              fontSize: '0.9rem',
              fontWeight: 600,
              marginBottom: '2rem',
              backdropFilter: 'blur(10px)'
            }}>
              🚀 Tecnología Contable Moderna
            </div>
          </div>

          <h1 className="animate-in" style={{
            fontSize: '4.5rem',
            fontWeight: 900,
            color: 'white',
            lineHeight: 1.1,
            marginBottom: '1.5rem',
            letterSpacing: '-0.03em',
            animationDelay: '0.15s'
          }}>
            Soluciones Contables<br/>
            <span style={{
              background: 'linear-gradient(135deg, #93c5fd, #ddd6fe)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Inteligentes
            </span>
          </h1>

          <p className="animate-in" style={{
            fontSize: '1.35rem',
            color: 'rgba(255, 255, 255, 0.85)',
            maxWidth: '680px',
            margin: '0 auto 2.5rem',
            lineHeight: 1.7,
            animationDelay: '0.3s',
            fontWeight: 400
          }}>
            Tecnología diseñada para contadores. Automatiza procesos, ahorra tiempo y enfócate en lo que realmente importa: asesorar a tus clientes
          </p>

          <div className="animate-in" style={{
            display: 'flex',
            gap: '1.25rem',
            justifyContent: 'center',
            animationDelay: '0.45s',
            flexWrap: 'wrap'
          }}>
            <button onClick={() => navigate('/register')} style={{
              padding: '1.2rem 2.75rem',
              background: 'white',
              border: 'none',
              borderRadius: '12px',
              color: '#0c4d7b',
              fontWeight: 700,
              fontSize: '1.05rem',
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)'
            }}
            onMouseEnter={e => {
              e.target.style.transform = 'translateY(-3px) scale(1.03)'
              e.target.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.3)'
            }}
            onMouseLeave={e => {
              e.target.style.transform = 'translateY(0) scale(1)'
              e.target.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.2)'
            }}>
              Comenzar Gratis →
            </button>

            <button onClick={() => document.getElementById('product').scrollIntoView({ behavior: 'smooth' })} style={{
              padding: '1.2rem 2.75rem',
              background: 'transparent',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '12px',
              color: 'white',
              fontWeight: 600,
              fontSize: '1.05rem',
              cursor: 'pointer',
              transition: 'all 0.3s',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={e => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)'
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)'
              e.target.style.transform = 'translateY(-3px)'
            }}
            onMouseLeave={e => {
              e.target.style.background = 'transparent'
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)'
              e.target.style.transform = 'translateY(0)'
            }}>
              Ver Producto
            </button>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" style={{
        minHeight: '85vh',
        background: '#ffffff',
        padding: '7rem 2rem',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
            <div className="slide-left">
              <h2 style={{
                fontSize: '3.2rem',
                fontWeight: 900,
                color: '#0c4d7b',
                marginBottom: '1.5rem',
                letterSpacing: '-0.025em'
              }}>
                Nuestra Historia
              </h2>
              <p style={{
                fontSize: '1.15rem',
                color: '#555',
                marginBottom: '1.2rem',
                lineHeight: 1.8
              }}>
                Los contadores pasan horas en tareas repetitivas que pueden automatizarse con tecnología.
              </p>
              <p style={{
                fontSize: '1.15rem',
                color: '#555',
                marginBottom: '1.2rem',
                lineHeight: 1.8
              }}>
                Por eso fundamos <strong style={{ color: '#0c4d7b' }}>JHVC Tech Solutions</strong>: para desarrollar herramientas que faciliten el trabajo diario de los contadores mexicanos.
              </p>
              <p style={{
                fontSize: '1.15rem',
                color: '#555',
                lineHeight: 1.8
              }}>
                Nuestra misión es simple: <strong style={{ color: '#17a2b8' }}>que los contadores dejen de perder tiempo en procesos manuales y se enfoquen en asesorar a sus clientes.</strong>
              </p>
            </div>
            <div className="scale-in" style={{ textAlign: 'center', animationDelay: '0.2s' }}>
              <div style={{
                fontSize: '18rem',
                color: '#0c4d7b',
                opacity: 0.08,
                lineHeight: 1
              }}>
                💼
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT SECTION - SOLO VISOR */}
      <section id="product" style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e8ecef 100%)',
        padding: '7rem 2rem',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <h2 className="scale-in" style={{
              fontSize: '3.2rem',
              fontWeight: 900,
              color: '#0c4d7b',
              marginBottom: '1.25rem',
              letterSpacing: '-0.025em'
            }}>
              Nuestro Producto
            </h2>
            <p className="scale-in" style={{
              fontSize: '1.25rem',
              color: '#666',
              maxWidth: '600px',
              margin: '0 auto',
              animationDelay: '0.15s'
            }}>
              La herramienta más intuitiva para gestionar tus facturas electrónicas
            </p>
          </div>

          {/* VISOR DESTACADO */}
          <div style={{ maxWidth: '950px', margin: '0 auto 4rem' }}>
            <div className="scale-in" style={{
              background: 'white',
              borderRadius: '20px',
              padding: '3rem',
              borderLeft: '6px solid #17a2b8',
              boxShadow: '0 10px 40px rgba(23, 162, 184, 0.15)',
              animationDelay: '0.25s'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem' }}>
                <div style={{ fontSize: '4rem' }}>📊</div>
                <div>
                  <h3 style={{
                    fontSize: '2.3rem',
                    fontWeight: 800,
                    color: '#0c4d7b',
                    letterSpacing: '-0.02em',
                    marginBottom: '0.5rem'
                  }}>
                    Visor de CFDI Profesional
                  </h3>
                  <span style={{
                    padding: '0.4rem 1rem',
                    background: '#10b981',
                    color: 'white',
                    borderRadius: '10px',
                    fontSize: '0.85rem',
                    fontWeight: 600
                  }}>
                    ✓ Disponible Ahora
                  </span>
                </div>
              </div>
              
              <p style={{
                fontSize: '1.15rem',
                color: '#555',
                lineHeight: 1.8,
                marginBottom: '2rem'
              }}>
                Administra tus archivos XML, visualiza la información de forma clara y exporta a Excel. Todo de manera local y segura en tu equipo.
              </p>

              {/* CARACTERÍSTICAS */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1.25rem'
              }}>
                {[
                  { icon: '📁', title: 'Administra XML', desc: 'Organiza y gestiona tus archivos XML de forma eficiente' },
                  { icon: '📊', title: 'Exporta a Excel', desc: 'Convierte tus XML a hojas de cálculo en un clic' },
                  { icon: '🔒', title: 'Todo Local', desc: 'Tus datos nunca salen de tu computadora' },
                  { icon: '⚡', title: 'Ultra Rápido', desc: 'Procesa miles de facturas en segundos' }
                ].map((feature, idx) => (
                  <div key={idx} style={{
                    background: 'linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(23, 162, 184, 0.15)',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(23, 162, 184, 0.2)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{feature.icon}</div>
                    <h4 style={{ color: '#0c4d7b', fontWeight: 700, marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                      {feature.title}
                    </h4>
                    <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: 1.6 }}>
                      {feature.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <button onClick={() => navigate('/register')} style={{
                  padding: '1.2rem 3rem',
                  background: 'linear-gradient(135deg, #17a2b8, #0c4d7b)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '1.05rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: '0 8px 25px rgba(23, 162, 184, 0.3)'
                }}
                onMouseEnter={e => {
                  e.target.style.transform = 'translateY(-3px) scale(1.03)'
                  e.target.style.boxShadow = '0 12px 35px rgba(23, 162, 184, 0.4)'
                }}
                onMouseLeave={e => {
                  e.target.style.transform = 'translateY(0) scale(1)'
                  e.target.style.boxShadow = '0 8px 25px rgba(23, 162, 184, 0.3)'
                }}>
                  Probar Gratis →
                </button>
              </div>
            </div>
          </div>

          {/* BENEFICIOS */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.75rem'
          }}>
            {[
              { icon: '🔐', title: 'Máxima Seguridad', desc: 'Tus datos están protegidos en tu equipo, sin envíos a la nube' },
              { icon: '💻', title: 'Sistema Local', desc: 'Funciona completamente en tu PC, sin dependencia de internet' },
              { icon: '🎯', title: 'Fácil de Usar', desc: 'Interfaz intuitiva diseñada para contadores' }
            ].map((benefit, idx) => (
              <div key={idx} className="slide-left" style={{
                background: 'white',
                borderRadius: '16px',
                padding: '2rem',
                textAlign: 'center',
                border: '1px solid #e5e7eb',
                transition: 'all 0.3s',
                cursor: 'pointer',
                animationDelay: `${idx * 0.1}s`
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-8px)'
                e.currentTarget.style.borderColor = '#17a2b8'
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(23, 162, 184, 0.2)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.borderColor = '#e5e7eb'
                e.currentTarget.style.boxShadow = 'none'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{benefit.icon}</div>
                <h4 style={{ color: '#0c4d7b', fontWeight: 700, marginBottom: '0.75rem', fontSize: '1.15rem' }}>
                  {benefit.title}
                </h4>
                <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: 1.6 }}>
                  {benefit.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="gradient-bg" style={{
        padding: '7rem 2rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h2 style={{
            fontSize: '3.2rem',
            fontWeight: 900,
            color: 'white',
            marginBottom: '1.25rem',
            letterSpacing: '-0.025em'
          }}>
            ¿Listo para transformar tu práctica contable?
          </h2>
          <p style={{
            fontSize: '1.25rem',
            color: 'rgba(255, 255, 255, 0.85)',
            marginBottom: '2.5rem',
            lineHeight: 1.7
          }}>
            Únete a los contadores que ya están ahorrando tiempo con nuestro Visor de CFDI
          </p>
          <button onClick={() => navigate('/register')} style={{
            padding: '1.4rem 3.5rem',
            background: 'white',
            border: 'none',
            borderRadius: '14px',
            color: '#0c4d7b',
            fontWeight: 700,
            fontSize: '1.15rem',
            cursor: 'pointer',
            transition: 'all 0.3s',
            boxShadow: '0 15px 50px rgba(0, 0, 0, 0.3)'
          }}
          onMouseEnter={e => {
            e.target.style.transform = 'scale(1.08) translateY(-4px)'
            e.target.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.4)'
          }}
          onMouseLeave={e => {
            e.target.style.transform = 'scale(1) translateY(0)'
            e.target.style.boxShadow = '0 15px 50px rgba(0, 0, 0, 0.3)'
          }}>
            Crear Cuenta Gratis →
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" style={{
        background: '#0a0f1e',
        padding: '4rem 2rem 2rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gap: '4rem',
            marginBottom: '3rem'
          }}>
            <div>
              <div style={{
                fontSize: '1.75rem',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #17a2b8, #93c5fd)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '1rem'
              }}>
                JHVC Tech Solutions
              </div>
              <p style={{
                color: 'rgba(255, 255, 255, 0.5)',
                lineHeight: 1.7,
                fontSize: '0.95rem'
              }}>
                Soluciones tecnológicas diseñadas para contadores mexicanos
              </p>
            </div>

            <div>
              <h4 style={{ color: 'white', marginBottom: '1rem', fontWeight: 600 }}>Producto</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {['Visor de CFDI', 'Características', 'Precios'].map(item => (
                  <a key={item} href="#product" style={{
                    color: 'rgba(255, 255, 255, 0.5)',
                    textDecoration: 'none',
                    fontSize: '0.95rem',
                    transition: 'color 0.3s'
                  }}
                  onMouseEnter={e => e.target.style.color = 'white'}
                  onMouseLeave={e => e.target.style.color = 'rgba(255, 255, 255, 0.5)'}>
                    {item}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{ color: 'white', marginBottom: '1rem', fontWeight: 600 }}>Empresa</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {['Nosotros', 'Blog', 'Contacto'].map(item => (
                  <a key={item} href="#about" style={{
                    color: 'rgba(255, 255, 255, 0.5)',
                    textDecoration: 'none',
                    fontSize: '0.95rem',
                    transition: 'color 0.3s'
                  }}
                  onMouseEnter={e => e.target.style.color = 'white'}
                  onMouseLeave={e => e.target.style.color = 'rgba(255, 255, 255, 0.5)'}>
                    {item}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{ color: 'white', marginBottom: '1rem', fontWeight: 600 }}>Contacto</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem' }}>
                <div style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                  📧 bahiacontable02@gmail.com
                </div>
                <div style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                  📱 +52 322 328 7655
                </div>
                <div style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                  📘 Virtual Accounting
                </div>
              </div>
            </div>
          </div>

          <div style={{
            paddingTop: '2rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.4)',
            fontSize: '0.9rem'
          }}>
            © 2025 JHVC Tech Solutions. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </>
  )
}

export default Landing