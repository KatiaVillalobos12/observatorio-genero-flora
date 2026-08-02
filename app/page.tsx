'use client'

import { ChatPanel } from '@/components/chat/ChatPanel'

const NAV_LINKS = [
  { label: 'Indicadores', id: 'feature-indicadores' },
  { label: 'Estudios', id: 'feature-estudios' },
  { label: 'Buenas Prácticas', id: 'feature-practicas' },
  { label: 'Sobre el Observatorio', id: 'sobre' },
]

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--paper)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Barra de navegación */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 32px', borderBottom: '3px solid var(--accent)',
        background: '#fff', flexWrap: 'wrap', gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.5rem' }}>⚖️</span>
          <div className="display" style={{ fontSize: '0.95rem', color: 'var(--ink)', lineHeight: 1.2 }}>
            OBSERVATORIO<br />DE GÉNERO
          </div>
        </div>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          {NAV_LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '0.88rem', fontWeight: 600, color: 'var(--ink)',
                padding: 0,
              }}
            >
              {l.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <header style={{
        background: 'linear-gradient(120deg, var(--primary) 0%, var(--accent) 100%)',
        padding: '48px 32px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div className="hero-grid" style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '32px',
          alignItems: 'center',
        }}>
          <div>
            <h1 className="display" style={{ fontSize: '2.4rem', lineHeight: 1.15, color: '#fff', marginBottom: '14px' }}>
              Consulta tus datos de igualdad con FLORA
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.92)', fontSize: '1rem', lineHeight: 1.6, maxWidth: '480px', marginBottom: '18px' }}>
              Tu asistente de inteligencia artificial para el <strong>Observatorio de Género</strong> en
              Educación Superior de la PUCP.
            </p>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.88rem', marginBottom: '24px' }}>
              📊 Indicadores &nbsp;|&nbsp; 📚 Estudios &nbsp;|&nbsp; 🌱 Buenas Prácticas
              <br />Respuestas con evidencia, no suposiciones.
            </p>
            <button
              onClick={() => scrollTo('chat-panel')}
              style={{
                background: '#fff', color: 'var(--primary-dark)', border: 'none',
                borderRadius: '10px', padding: '14px 24px', fontWeight: 700, fontSize: '0.95rem',
                cursor: 'pointer', boxShadow: '0 8px 20px rgba(4,35,84,0.2)',
              }}
            >
              ⚖️ Consultar con Flora
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', justifyContent: 'center' }}>
            <div style={{
              background: '#fff', borderRadius: '16px', padding: '14px 18px',
              maxWidth: '230px', boxShadow: '0 8px 24px rgba(4,35,84,0.18)', marginBottom: '80px',
            }}>
              <p style={{ margin: 0, fontSize: '0.83rem', lineHeight: 1.4, color: 'var(--ink)' }}>
                Hola, soy <strong style={{ color: 'var(--primary)' }}>Flora</strong>, inspirada
                en Flora Tristán. Respondo con datos, citando siempre la fuente. 📖
              </p>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/flora-character.png"
              alt="Flora, asistente virtual del Observatorio"
              style={{ width: '220px', height: 'auto', flexShrink: 0, filter: 'drop-shadow(0 12px 28px rgba(4,35,84,0.3))' }}
            />
          </div>
        </div>
      </header>

      <main className="main-grid" style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: 'minmax(280px, 380px) 1fr',
        gap: '28px',
        padding: '32px',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
      }}>
        <section id="sobre">
          <div style={{
            fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '1.5px', color: 'var(--accent-dark)', marginBottom: '10px',
          }}>
            Prototipo · Trabajo final
          </div>
          <h2 className="display" style={{ fontSize: '1.4rem', lineHeight: 1.25, color: 'var(--ink)', marginBottom: '14px' }}>
            Un asistente que responde con evidencia, no con suposiciones
          </h2>
          <p style={{ color: 'var(--ink-soft)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '20px' }}>
            El Observatorio reúne indicadores, estudios y buenas prácticas sobre igualdad de
            género en la educación superior. A medida que el catálogo crece, resulta más
            difícil ubicar el dato o el informe exacto que se necesita. Flora responde
            preguntas en lenguaje natural citando siempre la fuente original.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { id: 'feature-indicadores', icon: '📊', label: 'Indicadores', desc: '8 series de datos: matrícula, graduación, docencia, investigación, liderazgo' },
              { id: 'feature-estudios', icon: '📚', label: 'Estudios', desc: '54 investigaciones académicas sobre género en educación superior' },
              { id: 'feature-practicas', icon: '🌱', label: 'Buenas prácticas', desc: '15 programas e intervenciones implementados en universidades' },
            ].map((f) => (
              <div key={f.label} id={f.id} style={{
                display: 'flex', gap: '12px', padding: '12px 14px',
                background: '#fff', border: '1px solid var(--line)', borderRadius: '10px',
                scrollMarginTop: '24px',
              }}>
                <span style={{ fontSize: '1.2rem' }}>{f.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--ink)' }}>{f.label}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--ink-soft)' }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <p style={{ fontSize: '0.72rem', color: 'var(--ink-soft)', marginTop: '18px', lineHeight: 1.5 }}>
            El nombre <strong>Flora</strong> es un homenaje a <strong>Flora Tristán</strong>,
            pensadora y pionera del feminismo peruano.
          </p>
        </section>

        <section id="chat-panel" style={{ minHeight: '560px', height: 'calc(100vh - 260px)', scrollMarginTop: '24px' }}>
          <ChatPanel />
        </section>
      </main>
    </div>
  )
}
