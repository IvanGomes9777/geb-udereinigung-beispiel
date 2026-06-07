import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { LegalModal } from '../components/LegalModal'
import { CookieBanner } from '../components/CookieBanner'
import { IMPRESSUM, DATENSCHUTZ } from '../data/legalContent'

gsap.registerPlugin(ScrollTrigger)

type ModalKey = 'impressum' | 'datenschutz' | null

const NAV_LINKS = [
  { label: 'Hero', href: '#hero' },
  { label: 'Über uns', href: '#ueber-uns' },
  { label: 'Leistungen', href: '#leistungen' },
  { label: 'So arbeiten wir', href: '#prozess' },
  { label: 'Termin anfragen', href: '#termin' },
  { label: 'Bewertungen', href: '#bewertungen' },
  { label: 'Kontakt', href: '#kontakt' },
]

export function Footer() {
  const sectionRef = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const reduced = useReducedMotion()
  const [modal, setModal] = useState<ModalKey>(null)
  const [cookieOpen, setCookieOpen] = useState(false)
  const year = 2026 // Statisch — vermeidet Hydration-Mismatch / aendert sich nicht je Render

  // Animations: massive Headline scrub-revealed, columns staggered
  useEffect(() => {
    const sectionEl = sectionRef.current
    if (!sectionEl) return
    const ctx = gsap.context(() => {
      if (reduced) return

      // Headline scrub-reveal — kommt von unten beim Reinkommen
      if (headlineRef.current) {
        gsap.fromTo(
          headlineRef.current,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionEl,
              start: 'top 85%',
              end: 'top 35%',
              scrub: 1.5,
            },
          }
        )
      }

      // Footer columns staggered
      const cols = gsap.utils.toArray<HTMLElement>('[data-footer-col]')
      cols.forEach((col, i) => {
        gsap.fromTo(
          col,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            delay: 0.15 + i * 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionEl,
              start: 'top 75%',
              once: true,
            },
          }
        )
      })
    }, sectionEl)
    return () => ctx.revert()
  }, [reduced])

  const openImpressum = () => setModal('impressum')
  const openDatenschutz = () => setModal('datenschutz')

  return (
    <>
      <footer
        ref={sectionRef}
        id="footer"
        className="relative w-full overflow-hidden"
        style={{
          backgroundColor: '#0e0d0a',
          color: '#f5f2eb',
        }}
      >
        {/* Atmosphaeren */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 20% 100%, rgba(255,87,34,0.08) 0%, transparent 60%), radial-gradient(ellipse at 100% 0%, rgba(110,180,210,0.04) 0%, transparent 55%)',
          }}
        />
        {/* 12-col Linien */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #f5f2eb 1px, transparent 1px)',
            backgroundSize: 'calc(100% / 12) 100%',
          }}
        />

        {/* CONTENT WRAPPER */}
        <div
          className="relative mx-auto w-full px-6 lg:px-10"
          style={{
            maxWidth: 'var(--container-max)',
            zIndex: 2,
            paddingTop: 'clamp(40px, 5vh, 64px)',
            paddingBottom: 'clamp(20px, 2.5vh, 32px)',
          }}
        >
          {/* TOP STRIP — Section label */}
          <div className="flex items-baseline justify-between flex-wrap gap-3 mb-4 lg:mb-5">
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgba(245,242,235,0.65)',
                margin: 0,
              }}
            >
              N° 08 — FOOTER · DSGVO · DDG
            </p>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgba(245,242,235,0.45)',
                margin: 0,
              }}
            >
              KLARWERK · MÜNSTER · SEIT 2019
            </p>
          </div>

          {/* HEADLINE — nebeneinander, kompakter */}
          <h2
            ref={headlineRef}
            className="m-0"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(40px, 5.4vw, 120px)',
              lineHeight: 0.95,
              letterSpacing: '-0.04em',
              fontVariationSettings: '"opsz" 144, "SOFT" 50, "WONK" 1',
              color: '#f5f2eb',
              fontWeight: 400,
              marginBottom: 'clamp(24px, 3.5vh, 48px)',
              display: 'flex',
              flexWrap: 'wrap',
              columnGap: '0.4em',
              alignItems: 'baseline',
            }}
          >
            <span>Bis bald.</span>
            <span
              style={{
                fontStyle: 'italic',
                fontWeight: 200,
                color: 'rgba(245,242,235,0.5)',
                fontVariationSettings: '"opsz" 144, "SOFT" 100, "WONK" 1',
              }}
            >
              In Münster.
            </span>
          </h2>

          {/* 4-Col Grid: Brand / Nav / Kontakt / Rechtliches */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 mb-6 lg:mb-8">
            {/* BRAND */}
            <div data-footer-col className="col-span-2 md:col-span-1">
              <p style={labelStyle}>KLARWERK</p>
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(18px, 1.4vw, 22px)',
                  lineHeight: 1.2,
                  letterSpacing: '-0.015em',
                  color: '#f5f2eb',
                  margin: '12px 0 8px 0',
                  fontWeight: 500,
                }}
              >
                Gebäudereinigung
                <br />
                seit 2019.
              </p>
              <p style={bodyMutedStyle}>
                Fassaden, Büros, Praxen und Wohnanlagen in Münster und Umland.
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'rgba(245,242,235,0.55)',
                  margin: '14px 0 0 0',
                }}
              >
                <span style={{ color: 'var(--color-accent)' }}>★</span> 4,9 ·
                127 Bewertungen
              </p>
            </div>

            {/* NAVIGATION */}
            <nav data-footer-col aria-label="Footer Navigation">
              <p style={labelStyle}>Navigation</p>
              <ul style={listStyle}>
                {NAV_LINKS.map((l) => (
                  <li key={l.href} style={listItemStyle}>
                    <a href={l.href} style={linkStyle} className="footer-link">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* KONTAKT */}
            <div data-footer-col>
              <p style={labelStyle}>Kontakt</p>
              <ul style={listStyle}>
                <li style={listItemStyle}>
                  <a
                    href="tel:+49251XXXXXXX"
                    style={linkStyle}
                    className="footer-link"
                  >
                    +49 251 [XXX XXXX]
                  </a>
                </li>
                <li style={listItemStyle}>
                  <a
                    href="mailto:info@klarwerk-muenster.de"
                    style={linkStyle}
                    className="footer-link"
                  >
                    info@klarwerk-muenster.de
                  </a>
                </li>
                <li style={listItemStyle}>
                  <a
                    href="https://wa.me/49251XXXXXXX"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={linkStyle}
                    className="footer-link"
                  >
                    WhatsApp
                  </a>
                </li>
                <li style={{ ...listItemStyle, color: 'rgba(245,242,235,0.55)' }}>
                  [Straße, Hausnummer]
                  <br />
                  48[XXX] Münster
                </li>
              </ul>
            </div>

            {/* RECHTLICHES */}
            <div data-footer-col>
              <p style={labelStyle}>Rechtliches</p>
              <ul style={listStyle}>
                <li style={listItemStyle}>
                  <button
                    type="button"
                    onClick={openImpressum}
                    style={linkButtonStyle}
                    className="footer-link"
                  >
                    Impressum
                  </button>
                </li>
                <li style={listItemStyle}>
                  <button
                    type="button"
                    onClick={openDatenschutz}
                    style={linkButtonStyle}
                    className="footer-link"
                  >
                    Datenschutz
                  </button>
                </li>
                <li style={listItemStyle}>
                  <button
                    type="button"
                    onClick={() => setCookieOpen(true)}
                    style={linkButtonStyle}
                    className="footer-link"
                  >
                    Cookie-Einstellungen
                  </button>
                </li>
                <li style={{ ...listItemStyle, color: 'rgba(245,242,235,0.55)' }}>
                  HWK Münster · Gebäudereiniger-Handwerk (Anlage A HwO)
                </li>
              </ul>
            </div>
          </div>

          {/* BOTTOM COPYRIGHT STRIP */}
          <div
            className="pt-5 flex items-center justify-between gap-4 flex-wrap"
            style={{
              borderTop: '1px solid rgba(245,242,235,0.14)',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(245,242,235,0.55)',
            }}
          >
            <span>
              © {year} KLARWERK Gebäudereinigung · [Inhaber]
            </span>
            <span style={{ color: 'rgba(245,242,235,0.35)' }}>
              Hergestellt in Münster · v 1.0
            </span>
            <span className="hidden md:inline" style={{ color: 'rgba(245,242,235,0.35)' }}>
              51°57′N · 7°37′E
            </span>
          </div>
        </div>

        {/* Footer-Link hover style (CSS-in-JS via <style>) */}
        <style>{`
          .footer-link {
            position: relative;
            transition: color 200ms ease;
          }
          .footer-link:hover {
            color: var(--color-accent);
          }
        `}</style>
      </footer>

      {/* MODALS */}
      <LegalModal
        open={modal === 'impressum'}
        onClose={() => setModal(null)}
        title={IMPRESSUM.title}
        lastUpdated={IMPRESSUM.lastUpdated}
        sections={IMPRESSUM.sections}
      />
      <LegalModal
        open={modal === 'datenschutz'}
        onClose={() => setModal(null)}
        title={DATENSCHUTZ.title}
        lastUpdated={DATENSCHUTZ.lastUpdated}
        sections={DATENSCHUTZ.sections}
      />

      {/* COOKIE BANNER — auf Wunsch erneut oeffenbar */}
      {cookieOpen && (
        <CookieBanner forceOpen onClose={() => setCookieOpen(false)} />
      )}
    </>
  )
}

// === inline shared styles ===
const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '10px',
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  color: 'rgba(245,242,235,0.55)',
  margin: 0,
  paddingBottom: '6px',
  borderBottom: '1px solid rgba(245,242,235,0.12)',
}

const listStyle: React.CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: '14px 0 0 0',
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
}

const listItemStyle: React.CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: 'clamp(13px, 1vw, 15px)',
  lineHeight: 1.4,
  color: 'rgba(245,242,235,0.85)',
}

const bodyMutedStyle: React.CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: 'clamp(12px, 0.9vw, 14px)',
  lineHeight: 1.5,
  color: 'rgba(245,242,235,0.7)',
  margin: 0,
}

const linkStyle: React.CSSProperties = {
  color: 'rgba(245,242,235,0.85)',
  textDecoration: 'none',
  cursor: 'pointer',
}

const linkButtonStyle: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  textAlign: 'left',
  fontFamily: 'var(--font-body)',
  fontSize: 'clamp(13px, 1vw, 15px)',
  lineHeight: 1.4,
  color: 'rgba(245,242,235,0.85)',
}
