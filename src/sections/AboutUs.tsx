import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

const VALUES = [
  {
    key: 'discretion',
    label: 'Diskretion',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
        <path d="M12 3l8 4v6c0 4.5-3.5 8-8 8s-8-3.5-8-8V7l8-4z" stroke="currentColor" strokeWidth="1.2" />
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: 'thoroughness',
    label: 'Gründlichkeit',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
        <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.2" />
        <path d="M8 10l3 3 5-6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: 'punctuality',
    label: 'Pünktlichkeit',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.2" />
        <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: 'local',
    label: 'Lokal · Münster',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
        <path d="M12 22s-7-7.5-7-13a7 7 0 0114 0c0 5.5-7 13-7 13z" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
  },
] as const

const TRUST_STRIP = [
  'DIN ISO 9001',
  'TÜV-geprüfte Reinigungsmittel',
  'BGN-versichert',
  'HWK Münster',
  'EU-DSGVO',
]

export function AboutUs() {
  const sectionRef = useRef<HTMLElement>(null)
  const headRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      if (reduced) return

      // 1) SECTION SCRUB — Section "rises" from below as it enters viewport
      //    (während Hero parallax-out scrolt, hebt sich About sanft hoch)
      gsap.fromTo(
        sectionRef.current,
        { yPercent: 6 },
        {
          yPercent: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'top top',
            scrub: 0.8,
          },
        }
      )

      // 2) HEAD reveal — Eyebrow + Title staggern beim Eintritt von unten rein
      const headElements = headRef.current?.children
      if (headElements) {
        gsap.from(headElements, {
          y: 28,
          opacity: 0,
          duration: 0.85,
          stagger: 0.08,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            once: true,
          },
        })
      }

      // 3) BENTO Cards Magic-Mosaik
      const cards = gsap.utils.toArray<HTMLElement>('[data-bento-card]')
      const dirs = [
        { x: -32, y: 0 },
        { x: 0, y: -28 },
        { x: 0, y: 28 },
        { x: 32, y: 0 },
      ]
      cards.forEach((card, i) => {
        const d = dirs[i % dirs.length]
        gsap.from(card, {
          x: d.x,
          y: d.y,
          opacity: 0,
          duration: 0.9,
          delay: i * 0.05,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            once: true,
          },
        })
      })

      // 4) Pull-Quote Wort-Stagger
      const quote = sectionRef.current?.querySelector<HTMLElement>(
        '[data-mission-quote]'
      )
      if (quote && quote.textContent) {
        const words = quote.textContent.split(' ')
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
          duration: 0.65,
          ease: 'expo.out',
          stagger: 0.045,
          scrollTrigger: {
            trigger: quote,
            start: 'top 85%',
            once: true,
          },
        })
      }

      // 5) Counter-Animation auf Stats
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
            el.textContent = proxy.v.toFixed(decimals).replace('.', ',')
          },
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
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
      className="relative w-full overflow-hidden flex flex-col"
      style={{
        height: '100dvh',
        minHeight: '640px',
        backgroundColor: '#e9e4d6',
        // "Card emerges" — About hebt sich aus der Hero hervor
        borderTopLeftRadius: '32px',
        borderTopRightRadius: '32px',
        marginTop: '-32px',
        zIndex: 5,
        boxShadow: '0 -20px 50px -28px rgba(0,0,0,0.35)',
      }}
    >
      {/* Subtile Atmosphaeren-Orbs */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 80% 0%, rgba(255,87,34,0.06) 0%, transparent 55%), radial-gradient(ellipse at 0% 100%, rgba(70,55,30,0.05) 0%, transparent 60%)',
        }}
      />
      {/* Editorial 12-col Linien */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(to right, var(--color-ink-primary) 1px, transparent 1px)',
          backgroundSize: 'calc(100% / 12) 100%',
        }}
      />

      {/* CONTENT WRAPPER — flex column 3 Zonen */}
      <div
        className="relative flex-1 flex flex-col mx-auto w-full px-6 lg:px-10"
        style={{
          maxWidth: 'var(--container-max)',
          zIndex: 2,
          paddingTop: 'clamp(56px, 7vh, 80px)',
          paddingBottom: 'clamp(48px, 6vh, 64px)',
        }}
      >
        {/* ZONE 1 — HEAD: Eyebrow + kompakter Title */}
        <div ref={headRef}>
          <div className="flex items-baseline justify-between flex-wrap gap-3 mb-4 lg:mb-6">
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
              N° 02 — ÜBER UNS · INHABER · WERTE
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
              KLARWERK · MÜNSTER
            </p>
          </div>

          <h2
            className="m-0"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(36px, 5.4vw, 80px)',
              lineHeight: 0.95,
              letterSpacing: '-0.04em',
              fontVariationSettings: '"opsz" 144, "SOFT" 50, "WONK" 1',
              color: 'var(--color-ink-primary)',
              fontWeight: 400,
              display: 'flex',
              flexWrap: 'wrap',
              columnGap: '0.4em',
              alignItems: 'baseline',
            }}
          >
            <span>Ein Betrieb,</span>
            <span
              style={{
                fontStyle: 'italic',
                fontWeight: 300,
                color: 'var(--color-ink-secondary)',
                fontVariationSettings: '"opsz" 144, "SOFT" 100, "WONK" 1',
              }}
            >
              ein Versprechen.
            </span>
          </h2>
        </div>

        {/* ZONE 2 — BENTO 4-Karten-Grid, faellt mittig vertikal */}
        <div className="flex-1 flex items-center mt-6 lg:mt-8">
          <div
            className="grid grid-cols-1 md:grid-cols-12 gap-3 lg:gap-4 w-full"
            style={{ minHeight: 0 }}
          >
            {/* CARD 1 — INHABER PORTRAIT (col 1-6, beide Rows — dominanteste Karte) */}
            <div
              data-bento-card
              className="md:col-span-6 md:row-span-2 relative overflow-hidden flex flex-col"
              style={{
                borderRadius: '4px',
                background: 'rgba(255,255,255,0.5)',
                backdropFilter: 'blur(18px) saturate(160%)',
                WebkitBackdropFilter: 'blur(18px) saturate(160%)',
                border: '1px solid rgba(255,255,255,0.65)',
                boxShadow:
                  'inset 0 1px 0 rgba(255,255,255,0.85), 0 24px 50px -28px rgba(14,14,14,0.18)',
                padding: '16px',
                minHeight: 0,
              }}
            >
              <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
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
                  N° 01 — Inhaber
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'var(--color-ink-muted)',
                    margin: 0,
                  }}
                >
                  Seit <span data-counter="2019">2019</span>
                </p>
              </div>

              <div
                className="relative flex-1 flex items-center justify-center"
                style={{ minHeight: 0 }}
              >
                {/* Frame haelt das Foto auf 4:5 — nutzt verfuegbare Hoehe maximal,
                    centered horizontal wenn die Karte breiter ist als das Foto */}
                <div
                  className="relative overflow-hidden"
                  style={{
                    aspectRatio: '4 / 5',
                    height: '100%',
                    maxWidth: '100%',
                    borderRadius: '2px',
                    background: '#d8d3c4',
                    border: '1px solid rgba(255,255,255,0.7)',
                    boxShadow:
                      'inset 0 1px 0 rgba(255,255,255,0.5), 0 8px 24px -12px rgba(14,14,14,0.25)',
                  }}
                >
                  <img
                    src="/images/inhaber-portrait.jpg"
                    alt="[Inhaber-Vorname] [Inhaber-Nachname], Gründer und Inhaber von KLARWERK"
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ filter: 'contrast(1.02) saturate(0.95)' }}
                  />
                </div>
              </div>

              <div className="mt-3 flex items-baseline justify-between flex-wrap gap-2">
                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(18px, 1.6vw, 22px)',
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
                    fontSize: '10px',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'var(--color-ink-secondary)',
                    margin: 0,
                  }}
                >
                  Gründer · Inhaber
                </p>
              </div>
            </div>

            {/* CARD 2 — LEITSATZ QUOTE (col 7-9, row 1) */}
            <div
              data-bento-card
              className="md:col-span-3"
              style={{
                borderRadius: '4px',
                background:
                  'linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.25) 100%)',
                backdropFilter: 'blur(18px) saturate(160%)',
                WebkitBackdropFilter: 'blur(18px) saturate(160%)',
                border: '1px solid rgba(255,255,255,0.65)',
                boxShadow:
                  'inset 0 1px 0 rgba(255,255,255,0.85), 0 24px 50px -28px rgba(14,14,14,0.18)',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: 0,
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
                Leitsatz
              </p>

              <blockquote
                data-mission-quote
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(18px, 1.85vw, 28px)',
                  lineHeight: 1.12,
                  letterSpacing: '-0.025em',
                  color: 'var(--color-ink-primary)',
                  fontStyle: 'italic',
                  fontWeight: 350,
                  fontVariationSettings: '"opsz" 144, "SOFT" 100, "WONK" 1',
                  margin: '12px 0',
                }}
              >
                Wir kommen wieder, wenn niemand hinsieht.
              </blockquote>

              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--color-ink-muted)',
                  paddingTop: '8px',
                  borderTop: '1px solid rgba(14,14,14,0.1)',
                }}
              >
                — [Inhabername] · Gründer
              </div>
            </div>

            {/* CARD 3 — KENNZAHLEN DARK (col 10-12, beide Rows) */}
            <div
              data-bento-card
              className="md:col-span-3 md:row-span-2"
              style={{
                borderRadius: '4px',
                background:
                  'linear-gradient(140deg, var(--color-ink-primary) 0%, #1a1814 100%)',
                border: '1px solid rgba(14,14,14,0.4)',
                boxShadow:
                  'inset 0 1px 0 rgba(255,255,255,0.08), 0 24px 50px -28px rgba(14,14,14,0.35)',
                padding: '20px',
                color: '#f5f2eb',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: 0,
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

              <div className="grid grid-cols-1 gap-3">
                <Stat number="127" label="Objekte aktuell betreut" />
                <Stat number="4,9" label="Sterne · 127 Reviews" accent />
                <Stat number="14" label="eigene Mitarbeiter" />
              </div>

              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'rgba(245,242,235,0.4)',
                  margin: 0,
                  paddingTop: '12px',
                  borderTop: '1px solid rgba(245,242,235,0.12)',
                }}
              >
                Stand <span data-placeholder>Q2 / 2026</span>
              </p>
            </div>

            {/* CARD 4 — WERTE (col 7-9, row 2) */}
            <div
              data-bento-card
              className="md:col-span-3"
              style={{
                borderRadius: '4px',
                background: 'rgba(255,255,255,0.4)',
                backdropFilter: 'blur(18px) saturate(160%)',
                WebkitBackdropFilter: 'blur(18px) saturate(160%)',
                border: '1px solid rgba(255,255,255,0.65)',
                boxShadow:
                  'inset 0 1px 0 rgba(255,255,255,0.85), 0 24px 50px -28px rgba(14,14,14,0.18)',
                padding: '18px',
                minHeight: 0,
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'var(--color-ink-secondary)',
                  margin: '0 0 10px 0',
                }}
              >
                Werte
              </p>
              <div className="flex flex-col gap-2.5">
                {VALUES.map((v) => (
                  <div key={v.key} className="flex items-center gap-3">
                    <div style={{ color: 'var(--color-ink-primary)', flexShrink: 0 }}>
                      {v.icon}
                    </div>
                    <p
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(13px, 1vw, 16px)',
                        letterSpacing: '-0.015em',
                        color: 'var(--color-ink-primary)',
                        margin: 0,
                        fontWeight: 500,
                        fontVariationSettings: '"opsz" 36',
                        lineHeight: 1.1,
                      }}
                    >
                      {v.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ZONE 3 — TRUST STRIP (Certs als Mono-Inline) */}
        <div
          className="mt-6 lg:mt-8 pt-4 flex items-center justify-between gap-4 flex-wrap"
          style={{
            borderTop: '1px solid rgba(14,14,14,0.12)',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--color-ink-secondary)',
          }}
        >
          <span style={{ color: 'var(--color-ink-muted)' }}>Nachweise</span>
          <div className="flex items-center flex-wrap gap-x-3 gap-y-1">
            {TRUST_STRIP.map((c, i) => (
              <span key={c} className="inline-flex items-center gap-3">
                {i > 0 && (
                  <span style={{ color: 'var(--color-ink-muted)' }}>·</span>
                )}
                {c}
              </span>
            ))}
          </div>
          <span
            style={{ color: 'var(--color-ink-muted)' }}
            className="hidden md:inline"
          >
            51°57′N · 7°37′E
          </span>
        </div>
      </div>
    </section>
  )
}

function Stat({
  number,
  label,
  accent,
}: {
  number: string
  label: string
  accent?: boolean
}) {
  return (
    <div>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(32px, 3.6vw, 48px)',
          lineHeight: 0.95,
          letterSpacing: '-0.04em',
          fontVariationSettings: '"opsz" 144, "SOFT" 50, "WONK" 1',
          color: accent ? 'var(--color-accent)' : '#f5f2eb',
          fontWeight: 500,
        }}
      >
        <span data-counter={number.replace(',', '.')}>{number}</span>
      </div>
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'rgba(245,242,235,0.6)',
          margin: '4px 0 0 0',
        }}
      >
        {label}
      </p>
    </div>
  )
}
