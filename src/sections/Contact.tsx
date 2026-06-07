import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useConsent } from '../components/CookieBanner'

gsap.registerPlugin(ScrollTrigger)

const DISTRICTS = [
  'Aaseestadt',
  'Albachten',
  'Amelsbüren',
  'Coerde',
  'Geist',
  'Gievenbeck',
  'Hansaviertel',
  'Hiltrup',
  'Innenstadt',
  'Kinderhaus',
  'Kreuzviertel',
  'Mauritz',
  'Mecklenbeck',
  'Roxel',
  'Südviertel',
  'Wolbeck',
] as const

const UMLAND = ['Telgte', 'Albersloh', 'Senden', 'Drensteinfurt', 'Havixbeck'] as const

const HOURS = [
  { day: 'MO–FR', time: '7:00 – 18:00' },
  { day: 'SA', time: '9:00 – 14:00' },
  { day: 'Notfall', time: '24 / 7', accent: true },
] as const

type CTAProps = {
  kind: 'tel' | 'wa' | 'form'
  label: string
  value: string
  href: string
  primary?: boolean
}

function ContactCTA({ cta }: { cta: CTAProps }) {
  const [hover, setHover] = useState(false)
  const icon = (() => {
    if (cta.kind === 'tel') return '☎'
    if (cta.kind === 'wa') return '✦'
    return '✉'
  })()
  return (
    <a
      data-contact-cta
      href={cta.href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group relative inline-flex items-center gap-4 px-5 py-4 lg:px-6 lg:py-5 overflow-hidden"
      style={{
        backgroundColor: cta.primary
          ? hover
            ? 'var(--color-accent)'
            : 'var(--color-ink-primary)'
          : hover
            ? 'rgba(14,14,14,0.06)'
            : 'rgba(255,255,255,0.45)',
        color: cta.primary
          ? '#f5f2eb'
          : 'var(--color-ink-primary)',
        border: cta.primary
          ? '1px solid rgba(14,14,14,0.5)'
          : '1px solid rgba(14,14,14,0.18)',
        borderRadius: '2px',
        transition:
          'background-color 260ms cubic-bezier(0.25,1,0.5,1), color 260ms ease, transform 320ms cubic-bezier(0.25,1,0.5,1), box-shadow 320ms ease',
        transform: hover ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hover
          ? cta.primary
            ? '0 14px 28px -10px rgba(255,87,34,0.45)'
            : '0 10px 22px -10px rgba(14,14,14,0.2)'
          : '0 0 0 rgba(0,0,0,0)',
        textDecoration: 'none',
      }}
    >
      {/* Icon */}
      <span
        aria-hidden
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          border: '1px solid currentColor',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 14,
          flexShrink: 0,
        }}
      >
        {icon}
      </span>

      {/* Label + Value */}
      <div className="flex-1 min-w-0">
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: cta.primary
              ? 'rgba(245,242,235,0.65)'
              : 'var(--color-ink-muted)',
            margin: '0 0 4px 0',
          }}
        >
          {cta.label}
        </p>
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(18px, 1.8vw, 28px)',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            fontVariationSettings: '"opsz" 36, "SOFT" 50',
            color: cta.primary ? '#f5f2eb' : 'var(--color-ink-primary)',
            margin: 0,
            fontWeight: 500,
          }}
        >
          {cta.value}
        </p>
      </div>

      {/* Arrow */}
      <span
        aria-hidden
        style={{
          fontSize: 20,
          flexShrink: 0,
          transform: hover ? 'translateX(6px)' : 'translateX(0)',
          transition: 'transform 320ms cubic-bezier(0.25,1,0.5,1)',
        }}
      >
        →
      </span>
    </a>
  )
}

const CTAS: readonly CTAProps[] = [
  {
    kind: 'tel',
    label: 'Anruf · direkt durchgestellt',
    value: '+49 251 [XXX XXXX]',
    href: 'tel:+49251XXXXXXX',
    primary: true,
  },
  {
    kind: 'wa',
    label: 'WhatsApp · Foto + Anfrage',
    value: 'Sofort-Chat öffnen',
    href: 'https://wa.me/49251XXXXXXX',
  },
  {
    kind: 'form',
    label: 'Formular · in 60 Sekunden',
    value: 'Angebot anfragen',
    href: '#termin',
  },
] as const

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const headRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const sectionEl = sectionRef.current
    if (!sectionEl) return
    const ctx = gsap.context(() => {
      if (reduced) return

      // SECTION SCRUB — leichter Rise
      gsap.fromTo(
        sectionEl,
        { yPercent: 6 },
        {
          yPercent: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionEl,
            start: 'top bottom',
            end: 'top top',
            scrub: 1.5,
          },
        }
      )

      // ENTRANCE Scrub-Timeline
      const headElements = headRef.current?.children
      const ctas = gsap.utils.toArray<HTMLElement>('[data-contact-cta]')
      const sideCards = gsap.utils.toArray<HTMLElement>('[data-side-card]')

      const entranceTL = gsap.timeline({
        scrollTrigger: {
          trigger: sectionEl,
          start: 'top bottom',
          end: 'center center',
          scrub: 2,
        },
      })

      if (headElements && headElements.length > 0) {
        entranceTL.fromTo(
          headElements,
          { y: 48, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.3,
            ease: 'power2.out',
            duration: 0.9,
          },
          0
        )
      }

      // CTAs einzeln gestaffelt
      ctas.forEach((cta, i) => {
        entranceTL.fromTo(
          cta,
          { x: -50, opacity: 0 },
          { x: 0, opacity: 1, duration: 1.1, ease: 'power3.out' },
          0.7 + i * 0.35
        )
      })

      // Side cards von rechts
      sideCards.forEach((card, i) => {
        entranceTL.fromTo(
          card,
          { x: 50, opacity: 0 },
          { x: 0, opacity: 1, duration: 1.2, ease: 'power3.out' },
          0.9 + i * 0.45
        )
      })

      // Map-Card kommt von unten (subtil, nach den CTAs)
      const mapCard = sectionEl.querySelector<HTMLElement>('[data-map-card]')
      if (mapCard) {
        entranceTL.fromTo(
          mapCard,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.3, ease: 'power3.out' },
          1.6
        )
      }

      // EXIT FADE
      const innerContent = sectionEl.querySelector<HTMLDivElement>(
        ':scope > div.relative.flex-1'
      )
      if (innerContent) {
        gsap.fromTo(
          innerContent,
          { opacity: 1, y: 0 },
          {
            opacity: 0.15,
            y: -80,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionEl,
              start: 'top top',
              end: 'bottom top',
              scrub: 1.2,
            },
          }
        )
      }
    }, sectionEl)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      ref={sectionRef}
      id="kontakt"
      className="relative w-full overflow-hidden flex flex-col"
      style={{
        minHeight: '100dvh',
        backgroundColor: '#ece7d8',
      }}
    >
      {/* Atmosphaeren-Orbs */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 100% 0%, rgba(255,87,34,0.06) 0%, transparent 55%), radial-gradient(ellipse at 0% 100%, rgba(70,55,30,0.04) 0%, transparent 60%)',
        }}
      />
      {/* 12-col Linien */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(to right, var(--color-ink-primary) 1px, transparent 1px)',
          backgroundSize: 'calc(100% / 12) 100%',
        }}
      />

      {/* CONTENT WRAPPER */}
      <div
        className="relative flex-1 flex flex-col mx-auto w-full px-6 lg:px-10"
        style={{
          maxWidth: 'var(--container-max)',
          zIndex: 2,
          minHeight: 0,
          paddingTop: 'clamp(40px, 5vh, 72px)',
          paddingBottom: 'clamp(32px, 4vh, 56px)',
        }}
      >
        {/* HEAD */}
        <div ref={headRef}>
          <div className="flex items-baseline justify-between flex-wrap gap-3 mb-3 lg:mb-4">
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
              N° 07 — KONTAKT · MÜNSTER
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
              Ø ANTWORT 18 H · ★ NOTFALL 24/7
            </p>
          </div>

          <h2
            className="m-0"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(36px, 5.4vw, 160px)',
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
            <span>Sprechen wir.</span>
            <span
              style={{
                fontStyle: 'italic',
                fontWeight: 300,
                color: 'var(--color-ink-secondary)',
                fontVariationSettings: '"opsz" 144, "SOFT" 100, "WONK" 1',
              }}
            >
              Persönlich. Schnell.
            </span>
          </h2>
        </div>

        {/* SPLIT GRID — Left CTAs / Right Info Cards */}
        <div
          className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-7 mt-5 lg:mt-7"
          style={{ minHeight: 0 }}
        >
          {/* LEFT — 3 CTAs + Trust Strip + Google Maps */}
          <div className="lg:col-span-7 flex flex-col gap-3 lg:gap-4 min-h-0">
            {CTAS.map((cta, i) => (
              <ContactCTA key={i} cta={cta} />
            ))}

            {/* Trust Strip below CTAs */}
            <div
              className="pt-3 flex items-center justify-between gap-4 flex-wrap"
              style={{
                borderTop: '1px solid rgba(14,14,14,0.12)',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--color-ink-secondary)',
              }}
            >
              <span>
                <span style={{ color: 'var(--color-accent)' }}>★</span> 4,9 ·
                127 Bewertungen
              </span>
              <span style={{ color: 'var(--color-ink-muted)' }}>
                Antwort vom Inhaber persönlich
              </span>
            </div>

            {/* GOOGLE MAPS CARD — fuellt Luecke unter CTAs/Trust */}
            <article
              data-map-card
              className="relative overflow-hidden flex-1 flex flex-col"
              style={{
                borderRadius: '4px',
                background:
                  'linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.25) 100%)',
                backdropFilter: 'blur(18px) saturate(160%)',
                WebkitBackdropFilter: 'blur(18px) saturate(160%)',
                border: '1px solid rgba(255,255,255,0.65)',
                boxShadow:
                  'inset 0 1px 0 rgba(255,255,255,0.85), 0 24px 50px -28px rgba(14,14,14,0.18)',
                padding: '14px 14px 12px',
                minHeight: 'clamp(180px, 26vh, 320px)',
              }}
            >
              <div className="flex items-baseline justify-between gap-2 mb-2">
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
                  Karte · Münster + Umland
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
                  20 KM RADIUS
                </p>
              </div>
              <div
                className="relative flex-1 overflow-hidden"
                style={{
                  borderRadius: '2px',
                  border: '1px solid rgba(14,14,14,0.12)',
                  minHeight: 0,
                }}
              >
                <MapEmbed />
              </div>
            </article>
          </div>

          {/* RIGHT — Sprechzeiten + Servicegebiet */}
          <div className="lg:col-span-5 flex flex-col gap-3 lg:gap-4 min-h-0">
            {/* SPRECHZEITEN CARD */}
            <article
              data-side-card
              className="relative overflow-hidden"
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
                Sprechzeiten
              </p>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {HOURS.map((h) => (
                  <li
                    key={h.day}
                    className="flex items-baseline justify-between gap-3 py-2"
                    style={{
                      borderBottom: '1px solid rgba(14,14,14,0.08)',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        color: 'accent' in h && h.accent
                          ? 'var(--color-accent)'
                          : 'var(--color-ink-secondary)',
                      }}
                    >
                      {h.day}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(15px, 1.2vw, 20px)',
                        letterSpacing: '-0.01em',
                        color: 'accent' in h && h.accent
                          ? 'var(--color-accent)'
                          : 'var(--color-ink-primary)',
                        fontWeight: 500,
                      }}
                    >
                      {h.time}
                    </span>
                  </li>
                ))}
              </ul>
            </article>

            {/* SERVICEGEBIET CARD — dark variant for contrast */}
            <article
              data-side-card
              className="relative overflow-hidden flex-1"
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
                minHeight: 0,
              }}
            >
              <div className="flex items-baseline justify-between gap-2 mb-3">
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
                  Servicegebiet
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'rgba(245,242,235,0.4)',
                    margin: 0,
                  }}
                >
                  + Umland 20 KM
                </p>
              </div>

              <div className="flex-1 flex flex-col gap-2 lg:gap-3" style={{ minHeight: 0 }}>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                  {DISTRICTS.map((d) => (
                    <span
                      key={d}
                      className="flex items-center gap-2"
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(13px, 1vw, 17px)',
                        letterSpacing: '-0.01em',
                        color: '#f5f2eb',
                        fontWeight: 500,
                      }}
                    >
                      <span
                        aria-hidden
                        style={{
                          width: 4,
                          height: 4,
                          borderRadius: '50%',
                          background: 'var(--color-accent)',
                          flexShrink: 0,
                        }}
                      />
                      {d}
                    </span>
                  ))}
                </div>

                {/* Umland-Zeile */}
                <div
                  className="mt-3 pt-3 flex flex-col gap-1.5"
                  style={{
                    borderTop: '1px dashed rgba(245,242,235,0.18)',
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
                    Umland · auf Anfrage
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(13px, 1vw, 16px)',
                      letterSpacing: '-0.005em',
                      color: 'rgba(245,242,235,0.85)',
                      margin: 0,
                      lineHeight: 1.35,
                    }}
                  >
                    {UMLAND.join(' · ')}
                  </p>
                </div>
              </div>

              {/* Bottom: Coordinates */}
              <div
                className="mt-3 pt-3 flex items-center justify-between gap-2 flex-wrap"
                style={{
                  borderTop: '1px solid rgba(245,242,235,0.12)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'rgba(245,242,235,0.55)',
                }}
              >
                <span>51°57′N · 7°37′E</span>
                <span style={{ color: 'rgba(245,242,235,0.4)' }}>MÜNSTER · NRW</span>
              </div>
            </article>
          </div>
        </div>

        {/* FOOTER STRIP — Adresse + Ansprechpartner */}
        <div
          className="mt-5 lg:mt-7 pt-3 flex items-center justify-between gap-4 flex-wrap"
          style={{
            borderTop: '1px solid rgba(14,14,14,0.12)',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--color-ink-secondary)',
          }}
        >
          <span style={{ color: 'var(--color-ink-muted)' }}>Ansprechpartner</span>
          <div className="flex items-center flex-wrap gap-x-3 gap-y-1">
            <span>[Inhaber-Vorname Nachname]</span>
            <span style={{ color: 'var(--color-ink-muted)' }}>·</span>
            <span>Direkt erreichbar</span>
            <span style={{ color: 'var(--color-ink-muted)' }}>·</span>
            <span>Kein Callcenter</span>
          </div>
          <span
            style={{ color: 'var(--color-ink-muted)' }}
            className="hidden md:inline"
          >
            [Straße] · 48143 Münster
          </span>
        </div>
      </div>
    </section>
  )
}

/**
 * MapEmbed — Two-Click-Solution gemaess DSGVO/§ 25 TDDDG.
 * Ohne Maps-Consent zeigen wir nur einen Platzhalter mit Erklaerung
 * und einem klaren Aktivierungs-Button. Erst nach Klick wird das
 * Google-Maps-iframe geladen (= zweiter Klick) — und die Einwilligung
 * fuer kuenftige Besuche gespeichert.
 */
function MapEmbed() {
  const { consent, setConsent } = useConsent()
  const accepted = consent?.externalMaps === true

  const activateMaps = () => {
    setConsent({ externalMaps: true })
  }

  if (accepted) {
    return (
      <>
        <iframe
          title="Servicegebiet Münster — Google Maps"
          src="https://maps.google.com/maps?q=51.9606%2C7.6262&z=11&hl=de&output=embed"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 w-full h-full"
          style={{
            border: 0,
            filter: 'grayscale(0.35) contrast(1.05) brightness(0.96)',
          }}
          allowFullScreen
        />
        <span
          aria-hidden
          className="absolute top-2 left-2 pointer-events-none"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(14,14,14,0.7)',
            background: 'rgba(245,242,235,0.85)',
            padding: '3px 7px',
            borderRadius: '1px',
          }}
        >
          ★ MÜNSTER
        </span>
      </>
    )
  }

  // === Two-Click-Placeholder ===
  return (
    <div
      role="region"
      aria-label="Google Maps — Einwilligung erforderlich"
      className="absolute inset-0 flex flex-col items-center justify-center text-center"
      style={{
        background:
          'linear-gradient(160deg, rgba(14,14,14,0.04) 0%, rgba(14,14,14,0.10) 100%)',
        padding: 'clamp(14px, 2vw, 24px)',
        gap: 'clamp(10px, 1.5vh, 16px)',
      }}
    >
      {/* Abstract Map-Pin Icon */}
      <svg
        width="42"
        height="42"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
        style={{ opacity: 0.55, flexShrink: 0 }}
      >
        <path
          d="M12 22s-7-7.5-7-13a7 7 0 0114 0c0 5.5-7 13-7 13z"
          stroke="var(--color-ink-primary)"
          strokeWidth="1.4"
        />
        <circle
          cx="12"
          cy="9"
          r="2.6"
          stroke="var(--color-ink-primary)"
          strokeWidth="1.4"
        />
        <circle cx="12" cy="9" r="0.9" fill="var(--color-accent)" />
      </svg>

      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '9px',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'var(--color-ink-muted)',
          margin: 0,
        }}
      >
        Google Maps · Einwilligung erforderlich
      </p>

      <p
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(14px, 1.05vw, 18px)',
          lineHeight: 1.3,
          letterSpacing: '-0.015em',
          color: 'var(--color-ink-primary)',
          margin: 0,
          fontWeight: 500,
          maxWidth: '32ch',
        }}
      >
        Karte wird erst nach Ihrer Zustimmung geladen.
      </p>

      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(11px, 0.78vw, 12.5px)',
          lineHeight: 1.5,
          color: 'var(--color-ink-secondary)',
          margin: 0,
          maxWidth: '40ch',
        }}
      >
        Beim Aktivieren werden Daten (insb. IP-Adresse) an Google übertragen
        — ggf. auch in die USA (DPF-zertifiziert). Sie können die
        Einwilligung jederzeit im Footer unter „Cookie-Einstellungen"
        widerrufen.
      </p>

      <button
        type="button"
        onClick={activateMaps}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          background: 'var(--color-ink-primary)',
          color: '#f5f2eb',
          border: 'none',
          padding: '10px 18px',
          borderRadius: '2px',
          cursor: 'pointer',
          transition:
            'background 220ms ease, transform 240ms cubic-bezier(0.25,1,0.5,1), box-shadow 240ms ease',
          marginTop: '4px',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--color-accent)'
          e.currentTarget.style.transform = 'translateY(-1px)'
          e.currentTarget.style.boxShadow =
            '0 10px 22px -10px rgba(255,87,34,0.5)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'var(--color-ink-primary)'
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = '0 0 0 rgba(0,0,0,0)'
        }}
      >
        Karte aktivieren →
      </button>
    </div>
  )
}
