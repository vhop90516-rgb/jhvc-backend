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
    
    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(40px); }
      to { opacity: 1; transform: translateX(0); }
    }
    
    @keyframes gradient {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 0.8; }
      50% { transform: scale(1.05); opacity: 1; }
    }

    @keyframes shimmer {
      0% { background-position: -1000px 0; }
      100% { background-position: 1000px 0; }
    }
    
    .animate-in { animation: fadeInUp 0.8s ease-out forwards; }
    .scale-in { animation: scaleIn 0.6s ease-out forwards; }
    .slide-left { animation: slideInLeft 0.8s ease-out forwards; }
    .slide-right { animation: slideInRight 0.8s ease-out forwards; }
    .pulse-slow { animation: pulse 3s ease-in-out infinite; }
    .gradient-bg { 
      background: linear-gradient(135deg, #0c4d7b 0%, #17a2b8 100%);
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
            color: 'white',
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
                transition: 'all 0.3s'
              }}
              onMouseEnter={e => e.target.style.color = 'white'}
              onMouseLeave={e => e.target.style.color = 'rgba(255, 255, 255, 0.85)'}>
                {item.name}
              </a>
            ))}
            
            <button onClick={() => navigate('/login')} style={{
              padding: '0.75rem 1.75rem',
              background: 'white',
              border: 'none',
              borderRadius: '8px',
              color: '#0c4d7b',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 4px 14px rgba(0,0,0,0.2)'
            }}
            onMouseEnter={e => {
              e.target.style.transform = 'translateY(-2px)'
              e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)'
            }}
            onMouseLeave={e => {
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = '0 4px 14px rgba(0,0,0,0.2)'
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
        paddingTop: '5rem',
        color: 'white'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-10%',
          width: '60%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          borderRadius: '50%'
        }} />

        <div style={{ 
          maxWidth: '1200px', 
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
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '50px',
              color: 'white',
              fontSize: '0.9rem',
              fontWeight: 600,
              marginBottom: '2rem'
            }}>
              SISTEMA PROFESIONAL
            </div>
          </div>

          <h1 className="animate-in" style={{
            fontSize: '3.5rem',
            fontWeight: 800,
            lineHeight: 1.2,
            marginBottom: '1.5rem',
            animationDelay: '0.15s'
          }}>
            Soluciones Contables Inteligentes
          </h1>

          <p className="animate-in" style={{
            fontSize: '1.3rem',
            opacity: 0.95,
            maxWidth: '680px',
            margin: '0 auto 2.5rem',
            lineHeight: 1.6,
            animationDelay: '0.3s',
            fontWeight: 300
          }}>
            Tecnología diseñada para contadores. Automatiza procesos, ahorra tiempo y enfócate en lo que realmente importa: asesorar a tus clientes
          </p>

          <div className="animate-in" style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            animationDelay: '0.45s',
            flexWrap: 'wrap'
          }}>
            

            <button onClick={() => document.getElementById('product').scrollIntoView({ behavior: 'smooth' })} style={{
              padding: '1rem 2.5rem',
              background: 'transparent',
              border: '2px solid white',
              borderRadius: '8px',
              color: 'white',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseEnter={e => {
              e.target.style.background = 'rgba(255, 255, 255, 0.15)'
              e.target.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={e => {
              e.target.style.background = 'transparent'
              e.target.style.transform = 'translateY(0)'
            }}>
              Ver Producto
            </button>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION - MEJORADA */}
      <section id="about" style={{
        minHeight: '85vh',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fbfd 100%)',
        padding: '6rem 2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Elementos decorativos de fondo */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '-5%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(12, 77, 123, 0.05) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'pulse 4s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '20%',
          right: '-5%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(23, 162, 184, 0.05) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'pulse 5s ease-in-out infinite'
        }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
            <div className="slide-left">
              <div style={{
                display: 'inline-block',
                padding: '0.5rem 1.5rem',
                background: 'linear-gradient(135deg, rgba(12, 77, 123, 0.1) 0%, rgba(23, 162, 184, 0.1) 100%)',
                borderRadius: '50px',
                color: '#0c4d7b',
                fontSize: '0.85rem',
                fontWeight: 700,
                marginBottom: '1.5rem',
                letterSpacing: '1px'
              }}>
                SOBRE NOSOTROS
              </div>

              <h2 style={{
                fontSize: '2.8rem',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #0c4d7b 0%, #17a2b8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '2rem',
                lineHeight: 1.2
              }}>
                Nuestra Historia
              </h2>

              <div style={{
                borderLeft: '4px solid #17a2b8',
                paddingLeft: '1.5rem',
                marginBottom: '1.5rem'
              }}>
                <p style={{
                  fontSize: '1.15rem',
                  color: '#2c3e50',
                  marginBottom: '1.2rem',
                  lineHeight: 1.8,
                  fontWeight: 400
                }}>
                  Los contadores pasan horas en tareas repetitivas que pueden automatizarse con tecnología.
                </p>
                <p style={{
                  fontSize: '1.15rem',
                  color: '#2c3e50',
                  marginBottom: '1.2rem',
                  lineHeight: 1.8,
                  fontWeight: 400
                }}>
                  Por eso fundamos <strong style={{ color: '#0c4d7b', fontWeight: 700 }}>JHVC Tech Solutions</strong>: para desarrollar herramientas que faciliten el trabajo diario de los contadores mexicanos.
                </p>
                <p style={{
                  fontSize: '1.15rem',
                  color: '#2c3e50',
                  lineHeight: 1.8,
                  fontWeight: 400
                }}>
                  Nuestra misión es simple: <strong style={{ 
                    color: '#17a2b8', 
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, rgba(12, 77, 123, 0.1) 0%, rgba(23, 162, 184, 0.1) 100%)',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px'
                  }}>que los contadores dejen de perder tiempo en procesos manuales y se enfoquen en asesorar a sus clientes.</strong>
                </p>
              </div>

              <div style={{
                display: 'flex',
                gap: '2rem',
                marginTop: '2rem'
              }}>
                <div style={{
                  textAlign: 'center',
                  padding: '1.5rem',
                  background: 'linear-gradient(135deg, #0c4d7b 0%, #17a2b8 100%)',
                  borderRadius: '12px',
                  color: 'white',
                  flex: 1,
                  boxShadow: '0 8px 20px rgba(12, 77, 123, 0.2)',
                  transition: 'transform 0.3s'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>100%</div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Local y Seguro</div>
                </div>
                <div style={{
                  textAlign: 'center',
                  padding: '1.5rem',
                  background: 'linear-gradient(135deg, #17a2b8 0%, #0c4d7b 100%)',
                  borderRadius: '12px',
                  color: 'white',
                  flex: 1,
                  boxShadow: '0 8px 20px rgba(23, 162, 184, 0.2)',
                  transition: 'transform 0.3s'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>+50</div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Horas Ahorradas</div>
                </div>
              </div>
            </div>

            <div className="slide-right" style={{ 
              textAlign: 'center', 
              animationDelay: '0.2s',
              position: 'relative'
            }}>
              <div style={{
                position: 'relative',
                display: 'inline-block'
              }}>
                {/* Círculos decorativos animados */}
                <div style={{
                  position: 'absolute',
                  top: '-20px',
                  right: '-20px',
                  width: '150px',
                  height: '150px',
                  background: 'linear-gradient(135deg, rgba(12, 77, 123, 0.2) 0%, rgba(23, 162, 184, 0.2) 100%)',
                  borderRadius: '50%',
                  animation: 'pulse 3s ease-in-out infinite'
                }} />
                <div style={{
                  position: 'absolute',
                  bottom: '-30px',
                  left: '-30px',
                  width: '200px',
                  height: '200px',
                  background: 'linear-gradient(135deg, rgba(23, 162, 184, 0.15) 0%, rgba(12, 77, 123, 0.15) 100%)',
                  borderRadius: '50%',
                  animation: 'pulse 4s ease-in-out infinite',
                  animationDelay: '1s'
                }} />

                {/* Icono principal */}
                <div style={{
                  fontSize: '12rem',
                  position: 'relative',
                  zIndex: 1,
                  filter: 'drop-shadow(0 10px 30px rgba(12, 77, 123, 0.2))',
                  animation: 'float 6s ease-in-out infinite'
                }}>
                  💼
                </div>

                {/* Badges flotantes */}
                <div className="pulse-slow" style={{
                  position: 'absolute',
                  top: '20%',
                  right: '10%',
                  background: 'linear-gradient(135deg, #0c4d7b 0%, #17a2b8 100%)',
                  color: 'white',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '50px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  boxShadow: '0 8px 20px rgba(12, 77, 123, 0.3)',
                  zIndex: 2
                }}>
                  ⚡ Rápido
                </div>
                <div className="pulse-slow" style={{
                  position: 'absolute',
                  bottom: '25%',
                  left: '5%',
                  background: 'linear-gradient(135deg, #17a2b8 0%, #0c4d7b 100%)',
                  color: 'white',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '50px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  boxShadow: '0 8px 20px rgba(23, 162, 184, 0.3)',
                  zIndex: 2,
                  animationDelay: '1.5s'
                }}>
                  🔒 Seguro
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CARACTERÍSTICAS - CARDS COMO DASHBOARD */}
      <section style={{
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e8ecef 100%)',
        padding: '6rem 2rem',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            textAlign: 'center',
            color: '#0c4d7b',
            marginBottom: '4rem'
          }}>
            ¿Por qué elegir JHVC?
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '2rem'
          }}>
            {[
              { title: 'Datos Locales', desc: 'Todo se guarda en tu equipo, sin envíos a la nube' },
              { title: 'Exporta a Excel', desc: 'Convierte XML a hojas de cálculo en un clic' },
              { title: 'Seguridad Total', desc: 'Tus datos nunca salen de tu PC' }
            ].map((feature, idx) => (
              <div key={idx} className="scale-in" style={{
                padding: '2rem',
                textAlign: 'center',
                background: 'linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)',
                borderTop: '4px solid #0c4d7b',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                transition: 'all 0.3s',
                cursor: 'pointer',
                animationDelay: `${0.6 + idx * 0.1}s`
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-8px)'
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{
                  fontSize: '1.3rem',
                  fontWeight: 700,
                  color: '#0c4d7b',
                  marginBottom: '0.75rem'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  color: '#666',
                  fontSize: '1rem',
                  lineHeight: 1.6
                }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCT SECTION - MEJORADA */}
      <section id="product" style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0c4d7b 0%, #17a2b8 100%)',
        padding: '6rem 2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Elementos decorativos de fondo */}
        <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div className="animate-in" style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{
              display: 'inline-block',
              padding: '0.5rem 1.5rem',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '50px',
              color: 'white',
              fontSize: '0.85rem',
              fontWeight: 700,
              marginBottom: '1.5rem',
              letterSpacing: '1px'
            }}>
              PRODUCTO DESTACADO
            </div>

            <h2 className="animate-in" style={{
              fontSize: '3rem',
              fontWeight: 800,
              color: 'white',
              marginBottom: '1rem',
              animationDelay: '0.1s',
              textShadow: '0 2px 20px rgba(0, 0, 0, 0.2)'
            }}>
              Nuestro Producto
            </h2>
            <p className="animate-in" style={{
              fontSize: '1.3rem',
              color: 'rgba(255, 255, 255, 0.9)',
              animationDelay: '0.2s',
              fontWeight: 300
            }}>
              La herramienta más intuitiva para gestionar tus facturas electrónicas
            </p>
          </div>

          {/* VISOR CARD - ESTILO DASHBOARD MEJORADO */}
          <div style={{ maxWidth: '950px', margin: '0 auto' }}>
            <div className="scale-in" style={{
              padding: '3.5rem',
              textAlign: 'center',
              background: 'white',
              borderRadius: '20px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              transition: 'all 0.4s',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              animationDelay: '0.3s'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-15px)'
              e.currentTarget.style.boxShadow = '0 30px 80px rgba(0, 0, 0, 0.4)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.3)'
            }}>
              {/* Barra decorativa superior */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '8px',
                background: 'linear-gradient(90deg, #0c4d7b 0%, #17a2b8 50%, #0c4d7b 100%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 3s linear infinite'
              }} />

              {/* Badge flotante */}
              <div style={{
                position: 'absolute',
                top: '2rem',
                right: '2rem',
                background: 'linear-gradient(135deg, #0c4d7b 0%, #17a2b8 100%)',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '50px',
                fontSize: '0.8rem',
                fontWeight: 700,
                boxShadow: '0 4px 15px rgba(12, 77, 123, 0.3)'
              }}>
                ⭐ POPULAR
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <div style={{
                  fontSize: '4rem',
                  marginBottom: '1rem',
                  display: 'inline-block',
                  animation: 'float 4s ease-in-out infinite'
                }}>
                  📊
                </div>
              </div>

              <h3 style={{
                fontSize: '2.5rem',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #0c4d7b 0%, #17a2b8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '1.5rem'
              }}>
                Visor de CFDI
              </h3>

              <p style={{
                fontSize: '1.15rem',
                color: '#555',
                marginBottom: '2.5rem',
                lineHeight: 1.8,
                maxWidth: '650px',
                margin: '0 auto 2.5rem'
              }}>
                Administra tus archivos XML, visualiza la información de forma clara y exporta a Excel. Todo de manera local y segura en tu equipo.
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1.25rem',
                marginBottom: '2.5rem'
              }}>
                {[
                  { icon: '📁', text: 'Administra XML' },
                  { icon: '📊', text: 'Exporta a Excel' },
                  { icon: '💻', text: 'Todo Local' },
                  { icon: '⚡', text: 'Ultra Rápido' }
                ].map((feat, i) => (
                  <div key={i} style={{
                    padding: '1.25rem',
                    background: 'linear-gradient(135deg, #f8fbfd 0%, #e8f4f8 100%)',
                    borderRadius: '12px',
                    fontSize: '0.95rem',
                    color: '#0c4d7b',
                    fontWeight: 600,
                    border: '2px solid rgba(12, 77, 123, 0.1)',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #0c4d7b 0%, #17a2b8 100%)'
                    e.currentTarget.style.color = 'white'
                    e.currentTarget.style.transform = 'scale(1.05)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #f8fbfd 0%, #e8f4f8 100%)'
                    e.currentTarget.style.color = '#0c4d7b'
                    e.currentTarget.style.transform = 'scale(1)'
                  }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{feat.icon}</div>
                    {feat.text}
                  </div>
                ))}
              </div>

               

              <p style={{
                marginTop: '1.5rem',
                color: '#999',
                fontSize: '0.9rem'
              }}>
                Sin tarjeta de crédito requerida • Prueba todas las funciones
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="gradient-bg" style={{
        padding: '6rem 2rem',
        textAlign: 'center',
        color: 'white'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            marginBottom: '1rem'
          }}>
            ¿Listo para transformar tu práctica contable?
          </h2>
          <p style={{
            fontSize: '1.2rem',
            opacity: 0.95,
            marginBottom: '2rem'
          }}>
            Únete a los contadores que ya están ahorrando tiempo con nuestro Visor de CFDI
          </p>
          
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" style={{
        background: '#0c4d7b',
        padding: '3rem 2rem 1rem',
        color: 'white'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gap: '3rem',
            marginBottom: '2rem'
          }}>
            <div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                marginBottom: '1rem'
              }}>
                JHVC Tech Solutions
              </h3>
              <p style={{
                opacity: 0.8,
                lineHeight: 1.6
              }}>
                Soluciones tecnológicas diseñadas para contadores mexicanos
              </p>
            </div>

            <div>
              <h4 style={{ marginBottom: '1rem', fontWeight: 600 }}>Producto</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {['Visor de CFDI', 'Características', 'Precios'].map(item => (
                  <a key={item} href="#product" style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    textDecoration: 'none',
                    transition: 'color 0.3s'
                  }}
                  onMouseEnter={e => e.target.style.color = 'white'}
                  onMouseLeave={e => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}>
                    {item}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{ marginBottom: '1rem', fontWeight: 600 }}>Empresa</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {['Nosotros', 'Blog', 'Contacto'].map(item => (
                  <a key={item} href="#about" style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    textDecoration: 'none',
                    transition: 'color 0.3s'
                  }}
                  onMouseEnter={e => e.target.style.color = 'white'}
                  onMouseLeave={e => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}>
                    {item}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{ marginBottom: '1rem', fontWeight: 600 }}>Contacto</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.95rem', opacity: 0.8 }}>
                <div>📧 bahiacontable02@gmail.com</div>
                <div>📱 +52 322 328 7655</div>
                <div>📘 Virtual Accounting</div>
              </div>
            </div>
          </div>

          <div style={{
            paddingTop: '2rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            textAlign: 'center',
            opacity: 0.7,
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