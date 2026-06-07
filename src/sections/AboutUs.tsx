import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

const VALUES = [
  {
    key: 'discretion',
    label: 'Diskretion',
    desc: 'Schlüssel-übergaben, eigene Mitarbeiter, NDAs.',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
        <path d="M12 3l8 4v6c0 4.5-3.5 8-8 8s-8-3.5-8-8V7l8-4z" stroke="currentColor" strokeWidth="1.2" />
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: 'thoroughness',
    label: 'Gründlichkeit',
    desc: 'Checklisten, doppelte Sichtkontrolle, Fotodokumentation.',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
        <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.2" />
        <path d="M8 10l3 3 5-6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: 'punctuality',
    label: 'Pünktlichkeit',
    desc: 'Fixe Zeitfenster, keine Verschiebungen ohne Rücksprache.',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.2" />
        <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: 'local',
    label: 'Lokal',
    desc: 'Münster und 30 km Umkreis. Kurze Wege, klare Verantwortung.',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
        <path d="M12 22s-7-7.5-7-13a7 7 0 0114 0c0 5.5-7 13-7 13z" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
  },
] as const

const CERTS = [
  { label: 'DIN ISO 9001', note: 'Qualitätsmanagement' },
  { label: 'TÜV-geprüfte Reinigungsmittel', note: 'Ökologisch unbedenklich' },
  { label: 'BGN-versichert', note: 'Berufsgenossenschaft Nahrung & Gastgewerbe' },
  { label: 'HWK Münster', note: 'Eingetragen, Inhaber Reinigungstechnik' },
  { label: 'EU-DSGVO', note: 'Datenschutzkonform · Schlüsselverwaltung' },
]

export function AboutUs() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('[data-bento-card]')

      // Eintritts-Direktion pro Karte (Magic-Mosaik)
      const directions = [
        { x: -40, y: 0 },
        { x: 0, y: -40 },
        { x: 0, y: 40 },
        { x: -40, y: 40 },
        { x: 0, y: 40 },
        { x: 40, y: 40 },
      ]

      if (reduced) {
        gsap.set(cards, { opacity: 1, x: 0, y: 0 })
        return
      }

      cards.forEach((card, i) => {
        const dir = directions[i % directions.length]
        gsap.from(card, {
          x: dir.x,
          y: dir.y,
          opacity: 0,
          duration: 0.9,
          ease: 'expo.out',
          delay: i * 0.06,
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            once: true,
          },
        })
      })

      // SplitText-like word-stagger fuer die grosse Pull-Quote
      const quote = sectionRef.current?.querySelector<HTMLElement>(
        '[data-mission-quote]'
      )
      if (quote) {
        const words = quote.textContent?.split(' ') ?? []
        quote.textContent = ''
        words.forEach((w, i) => {
          const span = document.createElement('span')
          span.textContent = (i === 0 ? '' : ' ') + w
          span.style.opacity = '0'
          span.style.display = 'inline-block'
          span.style.transform = 'translateY(0.4em)'
          quote.appendChild(span)
        })
        gsap.to(quote.children, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'expo.out',
          stagger: 0.05,
          scrollTrigger: {
            trigger: quote,
            start: 'top 80%',
            once: true,
          },
        })
      }

      // Counter-Animation auf Zahlen
      const counters = gsap.utils.toArray<HTMLElement>('[data-counter]')
      counters.forEach((el) => {
        const target = parseFloat(el.dataset.counter || '0')
        const decimals = (el.dataset.counter || '0').split('.')[1]?.length || 0
        const proxy = { v: 0 }
        gsap.to(proxy, {
          v: target,
          duration: 1.6,
          ease: 'expo.out',
          onUpdate: () => {
            el.textContent = proxy.v
              .toFixed(decimals)
              .replace('.', ',')
          },
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true,
          },
        })
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      ref={sectionRef}
      id="ueber-uns"
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: '#e9e4d6',
        paddingTop: 'clamp(80px, 10vh, 128px)',
        paddingBottom: 'clamp(80px, 10vh, 128px)',
      }}
    >
      {/* Subtile Architektur-Atmosphäre */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 80% 0%, rgba(255,87,34,0.06) 0%, transparent 55%), radial-gradient(ellipse at 0% 100%, rgba(70,55,30,0.05) 0%, transparent 60%)',
        }}
      />
      {/* feine 12-col Linien */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(to right, var(--color-ink-primary) 1px, transparent 1px)',
          backgroundSize: 'calc(100% / 12) 100%',
        }}
      />

      <div
        className="relative mx-auto px-6 lg:px-10"
        style={{ maxWidth: 'var(--container-max)' }}
      >
        {/* Section-Eyebrow */}
        <div className="flex items-baseline justify-between flex-wrap gap-4 mb-10 lg:mb-14">
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--color-ink-secondary)',
              margin: 0,
            }}
          >
            N° 02 — ÜBER UNS · INHABER · WERTE · STANDORT
          </p>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--color-ink-muted)',
              margin: 0,
            }}
          >
            KLARWERK · GEBÄUDEREINIGUNG · MÜNSTER
          </p>
        </div>

        {/* Section-Title */}
        <h2
          className="m-0 mb-12 lg:mb-16"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(40px, 6vw, 96px)',
            lineHeight: 0.95,
            letterSpacing: '-0.04em',
            fontVariationSettings: '"opsz" 144, "SOFT" 50, "WONK" 1',
            color: 'var(--color-ink-primary)',
            fontWeight: 400,
            maxWidth: '14ch',
          }}
        >
          Ein Betrieb.
          <span
            style={{
              fontStyle: 'italic',
              fontWeight: 300,
              color: 'var(--color-ink-secondary)',
              fontVariationSettings: '"opsz" 144, "SOFT" 100, "WONK" 1',
              display: 'block',
            }}
          >
            ein Versprechen.
          </span>
        </h2>

        {/* Bento-Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-5"
          style={{ gridAutoRows: 'auto' }}
        >
          {/* ---------- CARD 1 — INHABER-PORTRAIT (col 1-7, row 1-3) ---------- */}
          <div
            data-bento-card
            className="md:col-span-7 md:row-span-2 relative overflow-hidden"
            style={{
              borderRadius: '4px',
              background: 'rgba(255,255,255,0.45)',
              backdropFilter: 'blur(18px) saturate(160%)',
              WebkitBackdropFilter: 'blur(18px) saturate(160%)',
              border: '1px solid rgba(255,255,255,0.6)',
              boxShadow:
                'inset 0 1px 0 rgba(255,255,255,0.8), 0 24px 50px -28px rgba(14,14,14,0.18)',
              padding: '24px',
              minHeight: '460px',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--color-ink-secondary)',
                margin: 0,
              }}
            >
              N° 01 — INHABER
            </p>

            <div
              className="mt-4 relative overflow-hidden"
              style={{
                aspectRatio: '4 / 5',
                borderRadius: '2px',
                background: '#d8d3c4',
                border: '1px solid rgba(255,255,255,0.7)',
                boxShadow:
                  'inset 0 1px 0 rgba(255,255,255,0.5), 0 8px 24px -12px rgba(14,14,14,0.25)',
              }}
            >
              {/* Portrait wird hier eingehängt sobald Higgsfield-Job fertig ist */}
              <img
                src="/images/inhaber-portrait.jpg"
                alt="[Inhaber-Vorname] [Inhaber-Nachname], Gründer und Inhaber von KLARWERK"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: 'contrast(1.02) saturate(0.95)' }}
                onError={(e) => {
                  // Fallback: zeige Placeholder-Look bis das Bild da ist
                  ;(e.currentTarget as HTMLImageElement).style.display = 'none'
                }}
              />
              {/* Placeholder-Layer falls Bild noch nicht da */}
              <div
                aria-hidden
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(229,224,210,0.95) 0%, rgba(216,211,196,0.95) 100%)',
                  zIndex: -1,
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: 'var(--color-ink-muted)',
                  }}
                >
                  [INHABER-PORTRAIT]
                </span>
              </div>
            </div>

            <div className="mt-5 flex items-baseline justify-between flex-wrap gap-2">
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '24px',
                  letterSpacing: '-0.02em',
                  color: 'var(--color-ink-primary)',
                  margin: 0,
                  fontWeight: 500,
                  fontVariationSettings: '"opsz" 36, "SOFT" 50',
                }}
              >
                [Vorname Nachname]
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--color-ink-secondary)',
                  margin: 0,
                }}
              >
                Gründer · Inhaber
              </p>
            </div>

            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '15px',
                lineHeight: 1.55,
                color: 'var(--color-ink-secondary)',
                marginTop: '12px',
                margin: '12px 0 0 0',
              }}
            >
              Aufgewachsen in [Stadt], gelernter [Beruf], seit{' '}
              <span data-counter="2019">2019</span> mit eigenem Betrieb in
              Münster. Persönlich vor Ort bei jedem Erstbesuch und jeder Abnahme.
            </p>
          </div>

          {/* ---------- CARD 2 — MISSION QUOTE (col 8-12, row 1) ---------- */}
          <div
            data-bento-card
            className="md:col-span-5 relative"
            style={{
              borderRadius: '4px',
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.25) 100%)',
              backdropFilter: 'blur(18px) saturate(160%)',
              WebkitBackdropFilter: 'blur(18px) saturate(160%)',
              border: '1px solid rgba(255,255,255,0.6)',
              boxShadow:
                'inset 0 1px 0 rgba(255,255,255,0.8), 0 24px 50px -28px rgba(14,14,14,0.18)',
              padding: '28px',
              minHeight: '220px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--color-ink-secondary)',
                margin: 0,
              }}
            >
              Leitsatz seit 2019
            </p>

            <blockquote
              data-mission-quote
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(24px, 2.4vw, 36px)',
                lineHeight: 1.1,
                letterSpacing: '-0.025em',
                color: 'var(--color-ink-primary)',
                fontStyle: 'italic',
                fontWeight: 350,
                fontVariationSettings: '"opsz" 144, "SOFT" 100, "WONK" 1',
                margin: 0,
              }}
            >
              Wir kommen wieder, wenn niemand hinsieht.
            </blockquote>

            <div
              style={{
                paddingTop: '14px',
                borderTop: '1px solid rgba(14,14,14,0.1)',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--color-ink-muted)',
              }}
            >
              — [Inhabername] · Gründer
            </div>
          </div>

          {/* ---------- CARD 3 — WERTE (col 8-12, row 2) ---------- */}
          <div
            data-bento-card
            className="md:col-span-5"
            style={{
              borderRadius: '4px',
              background: 'rgba(255,255,255,0.4)',
              backdropFilter: 'blur(18px) saturate(160%)',
              WebkitBackdropFilter: 'blur(18px) saturate(160%)',
              border: '1px solid rgba(255,255,255,0.6)',
              boxShadow:
                'inset 0 1px 0 rgba(255,255,255,0.8), 0 24px 50px -28px rgba(14,14,14,0.18)',
              padding: '24px',
              minHeight: '220px',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--color-ink-secondary)',
                margin: '0 0 16px 0',
              }}
            >
              Werte
            </p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              {VALUES.map((v) => (
                <div key={v.key}>
                  <div
                    style={{
                      color: 'var(--color-ink-primary)',
                      marginBottom: '8px',
                    }}
                  >
                    {v.icon}
                  </div>
                  <p
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '18px',
                      letterSpacing: '-0.015em',
                      color: 'var(--color-ink-primary)',
                      margin: '0 0 4px 0',
                      fontWeight: 500,
                      fontVariationSettings: '"opsz" 36',
                    }}
                  >
                    {v.label}
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '12.5px',
                      lineHeight: 1.45,
                      color: 'var(--color-ink-secondary)',
                      margin: 0,
                    }}
                  >
                    {v.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ---------- CARD 4 — STANDORT KARTE (col 1-4) ---------- */}
          <div
            data-bento-card
            className="md:col-span-4 relative"
            style={{
              borderRadius: '4px',
              background: 'rgba(255,255,255,0.4)',
              backdropFilter: 'blur(18px) saturate(160%)',
              WebkitBackdropFilter: 'blur(18px) saturate(160%)',
              border: '1px solid rgba(255,255,255,0.6)',
              boxShadow:
                'inset 0 1px 0 rgba(255,255,255,0.8), 0 24px 50px -28px rgba(14,14,14,0.18)',
              padding: '20px',
              minHeight: '260px',
              overflow: 'hidden',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--color-ink-secondary)',
                margin: '0 0 12px 0',
              }}
            >
              Standort
            </p>

            {/* OpenStreetMap-Embed: echte Münster-Karte */}
            <div
              className="relative overflow-hidden"
              style={{
                aspectRatio: '4 / 3',
                borderRadius: '2px',
                border: '1px solid rgba(14,14,14,0.1)',
              }}
            >
              <iframe
                title="KLARWERK Standort Münster"
                src="https://www.openstreetmap.org/export/embed.html?bbox=7.5800%2C51.9300%2C7.7000%2C51.9900&layer=mapnik&marker=51.9607%2C7.6261"
                style={{
                  border: 0,
                  width: '100%',
                  height: '100%',
                  filter: 'grayscale(0.6) contrast(0.95) saturate(0.85)',
                }}
                loading="lazy"
                aria-hidden
              />
              {/* Soft tint overlay zur Brand-Anpassung */}
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(233,228,214,0.15) 0%, rgba(255,87,34,0.06) 100%)',
                  mixBlendMode: 'multiply',
                }}
              />
            </div>

            <div className="mt-3 flex items-baseline justify-between flex-wrap gap-2">
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'var(--color-ink-primary)',
                }}
              >
                Münster · Westfalen
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--color-ink-muted)',
                }}
              >
                51°57′N · 7°37′E
              </span>
            </div>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                lineHeight: 1.45,
                color: 'var(--color-ink-secondary)',
                marginTop: '6px',
                margin: '6px 0 0 0',
              }}
            >
              Einzugsgebiet: Münster + 30 km Umkreis (Telgte, Greven, Senden,
              Havixbeck, Drensteinfurt).
            </p>
          </div>

          {/* ---------- CARD 5 — ZERTIFIKATE (col 5-8) ---------- */}
          <div
            data-bento-card
            className="md:col-span-4"
            style={{
              borderRadius: '4px',
              background: 'rgba(255,255,255,0.4)',
              backdropFilter: 'blur(18px) saturate(160%)',
              WebkitBackdropFilter: 'blur(18px) saturate(160%)',
              border: '1px solid rgba(255,255,255,0.6)',
              boxShadow:
                'inset 0 1px 0 rgba(255,255,255,0.8), 0 24px 50px -28px rgba(14,14,14,0.18)',
              padding: '24px',
              minHeight: '260px',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--color-ink-secondary)',
                margin: '0 0 14px 0',
              }}
            >
              Nachweise · Mitgliedschaften
            </p>
            <ul
              style={{
                listStyle: 'none',
                margin: 0,
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {CERTS.map((cert, i) => (
                <li
                  key={cert.label}
                  style={{
                    paddingTop: i === 0 ? 0 : '10px',
                    paddingBottom: '10px',
                    borderBottom:
                      i === CERTS.length - 1
                        ? 'none'
                        : '1px solid rgba(14,14,14,0.08)',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12px',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'var(--color-ink-primary)',
                      margin: '0 0 2px 0',
                      fontWeight: 600,
                    }}
                  >
                    {cert.label}
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '12px',
                      color: 'var(--color-ink-muted)',
                      margin: 0,
                    }}
                  >
                    {cert.note}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* ---------- CARD 6 — KENNZAHLEN (col 9-12) ---------- */}
          <div
            data-bento-card
            className="md:col-span-4"
            style={{
              borderRadius: '4px',
              background:
                'linear-gradient(135deg, var(--color-ink-primary) 0%, #1a1814 100%)',
              border: '1px solid rgba(14,14,14,0.4)',
              boxShadow:
                'inset 0 1px 0 rgba(255,255,255,0.08), 0 24px 50px -28px rgba(14,14,14,0.35)',
              padding: '24px',
              minHeight: '260px',
              color: '#f5f2eb',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgba(245,242,235,0.55)',
                margin: 0,
              }}
            >
              In Zahlen
            </p>

            <div className="grid grid-cols-2 gap-5 mt-4">
              <Stat number="2019" suffix="" label="gegründet" />
              <Stat number="127" suffix="" label="Objekte aktuell" />
              <Stat number="4,9" suffix="" label="Sterne · 127 Reviews" accent />
              <Stat number="14" suffix="" label="eigene Mitarbeiter" />
            </div>

            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'rgba(245,242,235,0.4)',
                margin: 0,
                paddingTop: '14px',
                borderTop: '1px solid rgba(245,242,235,0.12)',
              }}
            >
              Stand: <span data-placeholder>Q2 / 2026</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function Stat({
  number,
  suffix,
  label,
  accent,
}: {
  number: string
  suffix?: string
  label: string
  accent?: boolean
}) {
  return (
    <div>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(40px, 4.5vw, 56px)',
          lineHeight: 0.95,
          letterSpacing: '-0.04em',
          fontVariationSettings: '"opsz" 144, "SOFT" 50, "WONK" 1',
          color: accent ? 'var(--color-accent)' : '#f5f2eb',
          fontWeight: 500,
        }}
      >
        <span data-counter={number.replace(',', '.')}>{number}</span>
        {suffix && (
          <span
            style={{
              fontSize: '0.5em',
              marginLeft: '0.1em',
              color: 'rgba(245,242,235,0.55)',
            }}
          >
            {suffix}
          </span>
        )}
      </div>
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'rgba(245,242,235,0.6)',
          margin: '8px 0 0 0',
        }}
      >
        {label}
      </p>
    </div>
  )
}
