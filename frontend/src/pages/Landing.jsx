import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

const Landing = () => {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [visibleSections, setVisibleSections] = useState(new Set())

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
      
      const sections = document.querySelectorAll('.animate-on-scroll')
      sections.forEach(section => {
        const rect = section.getBoundingClientRect()
        if (rect.top < window.innerHeight * 0.75) {
          setVisibleSections(prev => new Set([...prev, section.id]))
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navbarStyle = {
    background: scrolled ? 'rgba(12, 77, 123, 0.98)' : '#0c4d7b',
    padding: scrolled ? '0.5rem 0' : '1rem 0',
    boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.2)' : '0 2px 10px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    transition: 'all 0.3s ease',
    backdropFilter: scrolled ? 'blur(10px)' : 'none'
  }

  const floatingAnimation = `
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeInLeft {
      from { opacity: 0; transform: translateX(-50px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.8); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    .floating { animation: float 6s ease-in-out infinite; }
    .fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
    .fade-in-left { animation: fadeInLeft 0.8s ease-out forwards; }
    .scale-in { animation: scaleIn 0.6s ease-out forwards; }
    .pulse-slow { animation: pulse 3s ease-in-out infinite; }
    .gradient-shift { background-size: 200% 200%; animation: gradientShift 8s ease infinite; }
  `

  return (
    <div style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <style>{floatingAnimation}</style>

      <nav style={navbarStyle}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="/" className="pulse-slow" style={{ fontSize: '1.8rem', fontWeight: 700, color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            📊 JHVC Tech Solutions
          </a>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            {['about', 'services', 'features'].map(item => (
              <a key={item} href={`#${item}`} style={{ color: 'white', textDecoration: 'none', fontWeight: 500, position: 'relative', transition: 'all 0.3s' }}
                onMouseEnter={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.color = '#17a2b8' }}
                onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.color = 'white' }}>
                {item === 'about' ? 'Nosotros' : item === 'services' ? 'Servicios' : 'Características'}
              </a>
            ))}
            <button onClick={() => navigate('/login')} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', background: 'transparent', color: 'white', border: '2px solid white', fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s' }}
              onMouseOver={(e) => { e.target.style.background = 'white'; e.target.style.color = '#0c4d7b'; e.target.style.transform = 'scale(1.05)' }}
              onMouseOut={(e) => { e.target.style.background = 'transparent'; e.target.style.color = 'white'; e.target.style.transform = 'scale(1)' }}>
              Iniciar Sesión
            </button>
          </div>
        </div>
      </nav>

      <section className="gradient-shift" style={{ background: 'linear-gradient(135deg, #0c4d7b 0%, #17a2b8 50%, #0c4d7b 100%)', color: 'white', padding: '6rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', pointerEvents: 'none' }}>
          {[...Array(20)].map((_, i) => (
            <div key={i} style={{ position: 'absolute', width: Math.random() * 10 + 5 + 'px', height: Math.random() * 10 + 5 + 'px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '50%', top: Math.random() * 100 + '%', left: Math.random() * 100 + '%', animation: `float ${Math.random() * 10 + 5}s ease-in-out infinite`, animationDelay: Math.random() * 5 + 's' }} />
          ))}
        </div>
        <div className="fade-in-up" style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem', fontWeight: 700, lineHeight: 1.2, textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}>Soluciones Contables Inteligentes</h1>
          <p style={{ fontSize: '1.3rem', marginBottom: '2rem', opacity: 0.95 }}>Tecnología diseñada para contadores. Automatiza procesos, ahorra tiempo y enfócate en lo que realmente importa: asesorar a tus clientes.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/register')} style={{ padding: '1rem 2rem', fontSize: '1.2rem', borderRadius: '8px', background: '#17a2b8', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s', boxShadow: '0 4px 15px rgba(23, 162, 184, 0.3)' }}
              onMouseOver={(e) => { e.target.style.background = '#138496'; e.target.style.transform = 'translateY(-5px) scale(1.05)'; e.target.style.boxShadow = '0 8px 25px rgba(23, 162, 184, 0.5)' }}
              onMouseOut={(e) => { e.target.style.background = '#17a2b8'; e.target.style.transform = 'translateY(0) scale(1)'; e.target.style.boxShadow = '0 4px 15px rgba(23, 162, 184, 0.3)' }}>
              🚀 Comenzar Ahora
            </button>
            <a href="#about" style={{ padding: '1rem 2rem', fontSize: '1.2rem', borderRadius: '8px', background: 'transparent', color: 'white', border: '2px solid white', fontWeight: 600, textDecoration: 'none', display: 'inline-block', transition: 'all 0.3s' }}
              onMouseOver={(e) => { e.target.style.background = 'white'; e.target.style.color = '#0c4d7b'; e.target.style.transform = 'translateY(-5px)' }}
              onMouseOut={(e) => { e.target.style.background = 'transparent'; e.target.style.color = 'white'; e.target.style.transform = 'translateY(0)' }}>
              ℹ️ Conocer Más
            </a>
          </div>
        </div>
      </section>

      <section id="about" className="animate-on-scroll" style={{ padding: '6rem 2rem', background: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div className={visibleSections.has('about') ? 'fade-in-left' : ''} style={{ opacity: visibleSections.has('about') ? 1 : 0 }}>
              <h2 style={{ fontSize: '2.5rem', color: '#0c4d7b', marginBottom: '1.5rem', fontWeight: 700 }}>Nuestra Historia</h2>
              <p style={{ fontSize: '1.1rem', marginBottom: '1rem', lineHeight: 1.8 }}>Los contadores pasan horas en tareas repetitivas que pueden automatizarse con tecnología.</p>
              <p style={{ fontSize: '1.1rem', marginBottom: '1rem', lineHeight: 1.8 }}>Por eso fundamos <strong>JHVC Tech Solutions</strong>: para desarrollar herramientas que faciliten el trabajo diario de los contadores mexicanos.</p>
              <p style={{ fontSize: '1.1rem', lineHeight: 1.8 }}>Nuestra misión es simple: <strong>que los contadores dejen de perder tiempo en procesos manuales y se enfoquen en asesorar a sus clientes.</strong></p>
            </div>
            <div className={visibleSections.has('about') ? 'floating' : ''} style={{ textAlign: 'center', opacity: visibleSections.has('about') ? 1 : 0, transition: 'opacity 0.8s' }}>
              <div style={{ fontSize: '15rem', color: '#0c4d7b', opacity: 0.1 }}>👔</div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="animate-on-scroll" style={{ padding: '6rem 2rem', background: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 className={visibleSections.has('services') ? 'scale-in' : ''} style={{ textAlign: 'center', fontSize: '2.5rem', color: '#0c4d7b', marginBottom: '3rem', fontWeight: 700, opacity: visibleSections.has('services') ? 1 : 0 }}>Nuestros Servicios</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
            {[
              { icon: '🤖', title: 'Automatización con IA', desc: 'Herramientas impulsadas por inteligencia artificial para automatizar procesos contables repetitivos.', features: ['Transcripción automática de documentos', 'Procesamiento inteligente de datos', 'Análisis predictivo', 'Conciliaciones automáticas'] },
              { icon: '💻', title: 'Software Contable', desc: 'Sistemas contables modernos, 100% en la nube, diseñados para contadores mexicanos.', features: ['Cumplimiento fiscal automático', 'Integración con SAT', 'Multi-empresa', 'Reportes en tiempo real'] },
              { icon: '⚙️', title: 'Integraciones API', desc: 'Conecta tus sistemas existentes con nuestras soluciones a través de APIs robustas.', features: ['API REST documentada', 'Webhooks en tiempo real', 'SDKs para múltiples lenguajes', 'Soporte técnico dedicado'] }
            ].map((service, idx) => (
              <div key={idx} className={visibleSections.has('services') ? 'fade-in-up' : ''} style={{ background: 'linear-gradient(135deg, #f0f7ff 0%, #ffffff 100%)', padding: '2.5rem', borderRadius: '12px', borderLeft: '4px solid #0c4d7b', transition: 'all 0.4s', opacity: visibleSections.has('services') ? 1 : 0, animationDelay: `${idx * 0.2}s`, cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 15px 40px rgba(12, 77, 123, 0.15)' }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = 'none' }}>
                <div style={{ position: 'absolute', top: -50, right: -50, width: 150, height: 150, background: 'radial-gradient(circle, rgba(23,162,184,0.1) 0%, transparent 70%)', borderRadius: '50%' }} />
                <h3 style={{ color: '#0c4d7b', fontSize: '1.8rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', position: 'relative' }}>
                  <span style={{ fontSize: '2.5rem' }} className="pulse-slow">{service.icon}</span> {service.title}
                </h3>
                <p style={{ marginBottom: '1rem', position: 'relative' }}>{service.desc}</p>
                <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
                  {service.features.map((feature, i) => (
                    <li key={i} style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', transition: 'all 0.3s', position: 'relative' }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(5px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}>
                      <span style={{ color: '#17a2b8', marginTop: '0.25rem', fontWeight: 'bold' }}>✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="animate-on-scroll" style={{ padding: '6rem 2rem', background: '#f8f9fa' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 className={visibleSections.has('features') ? 'scale-in' : ''} style={{ textAlign: 'center', fontSize: '2.5rem', color: '#0c4d7b', marginBottom: '3rem', fontWeight: 700, opacity: visibleSections.has('features') ? 1 : 0 }}>¿Por qué elegir JHVC?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {[
              { icon: '🧠', title: 'Hecho por Contadores', desc: 'Desarrollado por un equipo que entiende tus necesidades reales.' },
              { icon: '⏰', title: 'Ahorra Tiempo', desc: 'Automatiza tareas repetitivas y recupera horas de trabajo cada semana.' },
              { icon: '🛡️', title: 'Seguridad Total', desc: 'Encriptación de datos, backups automáticos y cumplimiento con estándares.' },
              { icon: '☁️', title: '100% en la Nube', desc: 'Accede desde cualquier lugar, cualquier dispositivo. Sin instalaciones.' },
              { icon: '⚖️', title: 'Cumplimiento Fiscal', desc: 'Actualizado siempre con las últimas disposiciones del SAT.' },
              { icon: '🎧', title: 'Soporte Experto', desc: 'Atención personalizada de contador a contador. Entendemos tu lenguaje.' }
            ].map((feature, idx) => (
              <div key={idx} className={visibleSections.has('features') ? 'scale-in' : ''} style={{ background: 'white', padding: '2rem', borderRadius: '12px', textAlign: 'center', transition: 'all 0.4s', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', opacity: visibleSections.has('features') ? 1 : 0, animationDelay: `${idx * 0.1}s`, cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-15px) rotate(2deg)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(12, 77, 123, 0.2)' }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0) rotate(0)'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem', position: 'relative' }} className="pulse-slow">{feature.icon}</div>
                <h3 style={{ fontSize: '1.5rem', color: '#0c4d7b', marginBottom: '1rem', position: 'relative' }}>{feature.title}</h3>
                <p style={{ color: '#333', lineHeight: 1.6, position: 'relative' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="gradient-shift" style={{ background: 'linear-gradient(135deg, #0c4d7b 0%, #17a2b8 50%, #0c4d7b 100%)', color: 'white', padding: '4rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}>¿Listo para transformar tu práctica contable?</h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.95 }}>Únete a los contadores que ya están ahorrando tiempo con nuestras soluciones</p>
          <button onClick={() => navigate('/register')} className="pulse-slow" style={{ padding: '1rem 2rem', fontSize: '1.2rem', borderRadius: '8px', background: 'white', color: '#0c4d7b', border: 'none', fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s', boxShadow: '0 5px 20px rgba(0,0,0,0.2)' }}
            onMouseEnter={(e) => { e.target.style.transform = 'scale(1.1) translateY(-5px)'; e.target.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)' }}
            onMouseLeave={(e) => { e.target.style.transform = 'scale(1) translateY(0)'; e.target.style.boxShadow = '0 5px 20px rgba(0,0,0,0.2)' }}>
            👤 Crear Cuenta Gratis
          </button>
        </div>
      </section>

      <footer style={{ background: '#0c4d7b', color: 'white', padding: '3rem 2rem 1rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
            <div><h4 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>JHVC Tech Solutions</h4><p>Soluciones tecnológicas diseñadas para contadores mexicanos.</p></div>
            <div><h4 style={{ marginBottom: '1rem' }}>Servicios</h4><ul style={{ listStyle: 'none', padding: 0 }}>{['Automatización con IA', 'Software Contable', 'Integraciones API', 'Documentación'].map((item, i) => (<li key={i} style={{ marginBottom: '0.5rem' }}><a href="#services" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', transition: 'all 0.3s' }} onMouseEnter={(e) => { e.target.style.color = 'white'; e.target.style.paddingLeft = '5px' }} onMouseLeave={(e) => { e.target.style.color = 'rgba(255,255,255,0.8)'; e.target.style.paddingLeft = '0' }}>{item}</a></li>))}</ul></div>
            <div><h4 style={{ marginBottom: '1rem' }}>Empresa</h4><ul style={{ listStyle: 'none', padding: 0 }}>{['Nosotros', 'Blog', 'Casos de Éxito', 'Contacto'].map((item, i) => (<li key={i} style={{ marginBottom: '0.5rem' }}><a href="#about" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', transition: 'all 0.3s' }} onMouseEnter={(e) => { e.target.style.color = 'white'; e.target.style.paddingLeft = '5px' }} onMouseLeave={(e) => { e.target.style.color = 'rgba(255,255,255,0.8)'; e.target.style.paddingLeft = '0' }}>{item}</a></li>))}</ul></div>
            <div><h4 style={{ marginBottom: '1rem' }}>Contacto</h4><ul style={{ listStyle: 'none', padding: 0 }}><li style={{ marginBottom: '0.5rem' }}>📧 bahiacontable02@gmail.com</li><li style={{ marginBottom: '0.5rem' }}>📱 +52 322 328 7655</li><li style={{ marginBottom: '0.5rem' }}>📘 Virtual Accounting</li></ul></div>
          </div>
          <div style={{ textAlign: 'center', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}>
            <p>&copy; 2025 JHVC Tech Solutions. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing