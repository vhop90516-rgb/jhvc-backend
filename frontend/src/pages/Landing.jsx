import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

const Landing = () => {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight })
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('mousemove', handleMouseMove)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    
    @keyframes float {
      0%, 100% { transform: translateY(0) scale(1); }
      50% { transform: translateY(-30px) scale(1.05); }
    }
    
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(60px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.9); }
      to { opacity: 1; transform: scale(1); }
    }
    
    @keyframes slideInLeft {
      from { opacity: 0; transform: translateX(-60px); }
      to { opacity: 1; transform: translateX(0); }
    }
    
    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(60px); }
      to { opacity: 1; transform: translateX(0); }
    }
    
    @keyframes gradient {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    
    @keyframes glow {
      0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
      50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6); }
    }
    
    .animate-in { animation: fadeInUp 0.8s ease-out forwards; }
    .scale-in { animation: scaleIn 0.6s ease-out forwards; }
    .slide-left { animation: slideInLeft 0.8s ease-out forwards; }
    .slide-right { animation: slideInRight 0.8s ease-out forwards; }
    .gradient-bg { 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%);
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
        background: scrolled ? 'rgba(15, 23, 42, 0.95)' : 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        padding: scrolled ? '0.75rem 0' : '1.25rem 0'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em',
            cursor: 'pointer'
          }} onClick={() => navigate('/')}>
            JHVC
          </div>
          
          <div style={{ display: 'flex', gap: '3rem', alignItems: 'center' }}>
            {[
              { name: 'Inicio', href: '#hero' },
              { name: 'Producto', href: '#product' },
              { name: 'Contacto', href: '#contact' }
            ].map(item => (
              <a key={item.name} href={item.href} style={{
                color: 'rgba(255, 255, 255, 0.8)',
                textDecoration: 'none',
                fontWeight: 500,
                fontSize: '0.95rem',
                transition: 'all 0.3s',
                position: 'relative',
                letterSpacing: '0.01em'
              }}
              onMouseEnter={e => {
                e.target.style.color = 'white'
                e.target.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={e => {
                e.target.style.color = 'rgba(255, 255, 255, 0.8)'
                e.target.style.transform = 'translateY(0)'
              }}>
                {item.name}
              </a>
            ))}
            
            <button onClick={() => navigate('/login')} style={{
              padding: '0.75rem 2rem',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: 'pointer',
              transition: 'all 0.3s',
              letterSpacing: '0.01em'
            }}
            onMouseEnter={e => {
              e.target.style.transform = 'translateY(-2px) scale(1.05)'
              e.target.style.boxShadow = '0 10px 30px rgba(59, 130, 246, 0.4)'
            }}
            onMouseLeave={e => {
              e.target.style.transform = 'translateY(0) scale(1)'
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
        paddingTop: '6rem'
      }}>
        {/* Animated Background Elements */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.3
        }}>
          {[...Array(30)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: Math.random() * 300 + 50 + 'px',
              height: Math.random() * 300 + 50 + 'px',
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(255,255,255,${Math.random() * 0.1}) 0%, transparent 70%)`,
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animation: `float ${Math.random() * 20 + 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }} />
          ))}
        </div>

        <div style={{ 
          maxWidth: '1400px', 
          margin: '0 auto', 
          padding: '0 3rem', 
          position: 'relative', 
          zIndex: 1,
          textAlign: 'center'
        }}>
          <div className="animate-in" style={{ marginBottom: '2rem' }}>
            <div style={{
              display: 'inline-block',
              padding: '0.5rem 1.5rem',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              fontSize: '0.9rem',
              fontWeight: 500,
              marginBottom: '2rem',
              backdropFilter: 'blur(10px)'
            }}>
              🚀 Tecnología Contable Moderna
            </div>
          </div>

          <h1 className="animate-in" style={{
            fontSize: '5rem',
            fontWeight: 900,
            color: 'white',
            lineHeight: 1.1,
            marginBottom: '2rem',
            letterSpacing: '-0.03em',
            animationDelay: '0.2s'
          }}>
            Visor de CFDI<br/>
            <span style={{
              background: 'linear-gradient(135deg, #93c5fd, #ddd6fe)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Profesional
            </span>
          </h1>

          <p className="animate-in" style={{
            fontSize: '1.4rem',
            color: 'rgba(255, 255, 255, 0.8)',
            maxWidth: '700px',
            margin: '0 auto 3rem',
            lineHeight: 1.7,
            animationDelay: '0.4s',
            fontWeight: 400
          }}>
            Visualiza, gestiona y analiza tus facturas electrónicas con la herramienta más intuitiva del mercado
          </p>

          <div className="animate-in" style={{
            display: 'flex',
            gap: '1.5rem',
            justifyContent: 'center',
            animationDelay: '0.6s'
          }}>
            <button onClick={() => navigate('/register')} style={{
              padding: '1.25rem 3rem',
              background: 'white',
              border: 'none',
              borderRadius: '14px',
              color: '#667eea',
              fontWeight: 700,
              fontSize: '1.1rem',
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
              letterSpacing: '0.02em'
            }}
            onMouseEnter={e => {
              e.target.style.transform = 'translateY(-4px) scale(1.05)'
              e.target.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.3)'
            }}
            onMouseLeave={e => {
              e.target.style.transform = 'translateY(0) scale(1)'
              e.target.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.2)'
            }}>
              Comenzar Gratis →
            </button>

            <button onClick={() => document.getElementById('product').scrollIntoView({ behavior: 'smooth' })} style={{
              padding: '1.25rem 3rem',
              background: 'transparent',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '14px',
              color: 'white',
              fontWeight: 600,
              fontSize: '1.1rem',
              cursor: 'pointer',
              transition: 'all 0.3s',
              backdropFilter: 'blur(10px)',
              letterSpacing: '0.02em'
            }}
            onMouseEnter={e => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)'
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)'
              e.target.style.transform = 'translateY(-4px)'
            }}
            onMouseLeave={e => {
              e.target.style.background = 'transparent'
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)'
              e.target.style.transform = 'translateY(0)'
            }}>
              Ver Demo
            </button>
          </div>

          {/* Floating Device Mockup */}
          <div className="animate-in" style={{
            marginTop: '6rem',
            position: 'relative',
            animationDelay: '0.8s'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '24px',
              padding: '2rem',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 30px 80px rgba(0, 0, 0, 0.3)',
              animation: 'float 6s ease-in-out infinite'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                borderRadius: '16px',
                padding: '3rem',
                textAlign: 'left'
              }}>
                <div style={{ marginBottom: '2rem', display: 'flex', gap: '0.5rem' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }} />
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }} />
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }} />
                </div>
                
                <div style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  CFDI Visualizado
                </div>
                
                <div style={{ background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                  <div style={{ color: 'white', fontWeight: 600, marginBottom: '0.5rem' }}>Factura #12345</div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>RFC: XAXX010101000</div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', padding: '1.5rem' }}>
                    <div style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Subtotal</div>
                    <div style={{ color: 'white', fontSize: '1.3rem', fontWeight: 700 }}>$12,500</div>
                  </div>
                  <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', padding: '1.5rem' }}>
                    <div style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>IVA</div>
                    <div style={{ color: 'white', fontSize: '1.3rem', fontWeight: 700 }}>$2,000</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT SECTION */}
      <section id="product" style={{
        minHeight: '100vh',
        background: '#0f172a',
        padding: '8rem 3rem',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
            <h2 className="scale-in" style={{
              fontSize: '3.5rem',
              fontWeight: 900,
              color: 'white',
              marginBottom: '1.5rem',
              letterSpacing: '-0.02em'
            }}>
              Todo lo que necesitas
            </h2>
            <p className="scale-in" style={{
              fontSize: '1.3rem',
              color: 'rgba(255, 255, 255, 0.6)',
              maxWidth: '600px',
              margin: '0 auto',
              animationDelay: '0.2s'
            }}>
              Una solución completa para la gestión de tus facturas electrónicas
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '2rem'
          }}>
            {[
              {
                icon: '📊',
                title: 'Visualización Clara',
                desc: 'Interfaz intuitiva que muestra toda la información de tus CFDIs de forma organizada y fácil de entender',
                color: '#3b82f6'
              },
              {
                icon: '🔍',
                title: 'Búsqueda Rápida',
                desc: 'Encuentra cualquier factura en segundos con filtros avanzados por fecha, RFC, monto y más',
                color: '#8b5cf6'
              },
              {
                icon: '📈',
                title: 'Reportes Detallados',
                desc: 'Genera reportes fiscales automáticos y analiza tus operaciones con dashboards interactivos',
                color: '#ec4899'
              },
              {
                icon: '🔒',
                title: 'Seguridad Total',
                desc: 'Tus datos protegidos con encriptación de nivel bancario y backups automáticos diarios',
                color: '#10b981'
              },
              {
                icon: '☁️',
                title: 'En la Nube',
                desc: 'Accede desde cualquier dispositivo, en cualquier momento. Sin instalaciones ni configuraciones',
                color: '#f59e0b'
              },
              {
                icon: '⚡',
                title: 'Ultra Rápido',
                desc: 'Procesamiento optimizado que carga miles de facturas en milisegundos',
                color: '#06b6d4'
              }
            ].map((feature, idx) => (
              <div key={idx} className="slide-left" style={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '20px',
                padding: '2.5rem',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                animationDelay: `${idx * 0.1}s`,
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-10px)'
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                e.currentTarget.style.borderColor = feature.color
                e.currentTarget.style.boxShadow = `0 20px 60px ${feature.color}40`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                e.currentTarget.style.boxShadow = 'none'
              }}>
                <div style={{
                  fontSize: '3rem',
                  marginBottom: '1.5rem',
                  filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.3))'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: 'white',
                  marginBottom: '1rem',
                  letterSpacing: '-0.01em'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  lineHeight: 1.7,
                  fontSize: '1rem'
                }}>
                  {feature.desc}
                </p>
                <div style={{
                  position: 'absolute',
                  top: -50,
                  right: -50,
                  width: 100,
                  height: 100,
                  background: `radial-gradient(circle, ${feature.color}20 0%, transparent 70%)`,
                  borderRadius: '50%',
                  pointerEvents: 'none'
                }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="gradient-bg" style={{
        padding: '8rem 3rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h2 style={{
            fontSize: '3.5rem',
            fontWeight: 900,
            color: 'white',
            marginBottom: '1.5rem',
            letterSpacing: '-0.02em'
          }}>
            Comienza hoy mismo
          </h2>
          <p style={{
            fontSize: '1.3rem',
            color: 'rgba(255, 255, 255, 0.8)',
            marginBottom: '3rem',
            lineHeight: 1.7
          }}>
            Únete a los contadores que ya están optimizando su tiempo con nuestro visor de CFDI
          </p>
          <button onClick={() => navigate('/register')} style={{
            padding: '1.5rem 4rem',
            background: 'white',
            border: 'none',
            borderRadius: '16px',
            color: '#667eea',
            fontWeight: 700,
            fontSize: '1.2rem',
            cursor: 'pointer',
            transition: 'all 0.3s',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            letterSpacing: '0.02em'
          }}
          onMouseEnter={e => {
            e.target.style.transform = 'scale(1.1) translateY(-5px)'
            e.target.style.boxShadow = '0 30px 80px rgba(0, 0, 0, 0.4)'
          }}
          onMouseLeave={e => {
            e.target.style.transform = 'scale(1) translateY(0)'
            e.target.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.3)'
          }}>
            Crear Cuenta Gratis →
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" style={{
        background: '#0a0f1e',
        padding: '4rem 3rem 2rem',
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
                fontSize: '1.8rem',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '1rem'
              }}>
                JHVC
              </div>
              <p style={{
                color: 'rgba(255, 255, 255, 0.5)',
                lineHeight: 1.7,
                fontSize: '0.95rem'
              }}>
                Tecnología contable moderna para profesionales exigentes
              </p>
            </div>

            <div>
              <h4 style={{ color: 'white', marginBottom: '1rem', fontWeight: 600 }}>Producto</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {['Características', 'Precios', 'Demo'].map(item => (
                  <a key={item} href="#" style={{
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
                  <a key={item} href="#" style={{
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