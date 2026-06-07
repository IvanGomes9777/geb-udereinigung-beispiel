import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

type Review = {
  quote: string
  author: string
  context: string
  source: 'Google' | 'Direkt' | 'Empfehlung'
  rating: 5
}

const FEATURED: Review = {
  quote:
    'Das Treppenhaus sieht nach 7 Jahren wieder aus wie am ersten Tag. Persönlich vor Ort bei jedem Besuch. Keine Subunternehmer, keine Ausreden.',
  author: 'Sabine W.',
  context: 'Hausverwaltung Kreuzviertel',
  source: 'Google',
  rating: 5,
}

const REVIEWS: readonly Review[] = [
  {
    quote:
      'Schnelle Reaktion auf den Wasserschaden im OG, perfekte Dokumentation für die Versicherung.',
    author: 'M. Klein',
    context: 'Eigentümer · Hansaviertel',
    source: 'Direkt',
    rating: 5,
  },
  {
    quote:
      'Auch nach 3 Jahren noch derselbe Anspruch. Sowas ist selten geworden.',
    author: 'Dr. Hoff',
    context: 'Praxis · Aaseestadt',
    source: 'Google',
    rating: 5,
  },
  {
    quote:
      'Faires Angebot, ehrlich kalkuliert, keine Überraschungen auf der Rechnung.',
    author: 'Thomas R.',
    context: 'Büro · Südviertel',
    source: 'Empfehlung',
    rating: 5,
  },
  {
    quote:
      'Mitarbeiter sind freundlich und gründlich. Die Fenster sieht man nicht mehr — und das ist das Kompliment.',
    author: 'Petra M.',
    context: 'Wohnanlage · Geist',
    source: 'Google',
    rating: 5,
  },
] as const

function Stars({ count, accent = false }: { count: 5; accent?: boolean }) {
  return (
    <span
      aria-label={`${count} von 5 Sternen`}
      style={{
        color: accent ? 'var(--color-accent)' : 'rgba(245,242,235,0.92)',
        fontSize: '12px',
        letterSpacing: '0.18em',
      }}
    >
      {'★'.repeat(count)}
    </span>
  )
}

export function Reviews() {
  const sectionRef = useRef<HTMLElement>(null)
  const headRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const sectionEl = sectionRef.current
    if (!sectionEl) return
    const ctx = gsap.context(() => {
      if (reduced) return

      // SECTION SCRUB — leichter Rise beim Reinkommen
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

      // ENTRANCE Scrub-Timeline (gleiche Mechanik wie AboutUs/Process)
      const headElements = headRef.current?.children
      const featured = sectionEl.querySelector<HTMLElement>('[data-featured]')
      const cards = gsap.utils.toArray<HTMLElement>('[data-review-card]')

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

      // FEATURED QUOTE kommt nach HEAD — gross + sanft (bleibt im Scrub)
      if (featured) {
        entranceTL.fromTo(
          featured,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.6,
            ease: 'power3.out',
          },
          0.7
        )
      }

      // ---------- CARDS FLY-IN — separater One-Shot-Trigger ----------
      // Cards fliegen sequenziell rein, abwechselnd von links/rechts.
      // toggleActions:"play none none reverse" laesst Animation beim
      // Hochscrollen rueckwaerts laufen — feel-good Effekt.
      if (cards.length > 0) {
        gsap.from(cards, {
          x: (i: number) => (i % 2 === 0 ? -160 : 160),
          y: 40,
          opacity: 0,
          scale: 0.9,
          duration: 0.95,
          stagger: 0.22,
          ease: 'back.out(1.4)',
          immediateRender: true,
          scrollTrigger: {
            trigger: sectionEl,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        })
      }

      // EXIT FADE — wie Hero/AboutUs/Process
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
      id="bewertungen"
      className="relative w-full overflow-hidden flex flex-col"
      style={{
        minHeight: '100dvh',
        backgroundColor: '#0e0d0a',
        color: '#f5f2eb',
      }}
    >
      {/* Atmosphaeren-Orbs */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 80% 0%, rgba(255,87,34,0.07) 0%, transparent 55%), radial-gradient(ellipse at 0% 100%, rgba(110,180,210,0.04) 0%, transparent 60%)',
        }}
      />
      {/* Filmkorn */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='280' height='280'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.9 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          mixBlendMode: 'overlay',
        }}
      />
      {/* 12-col Editorial-Linien in Cream */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #f5f2eb 1px, transparent 1px)',
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
                color: 'rgba(245,242,235,0.78)',
                margin: 0,
              }}
            >
              N° 06 — STIMMEN AUS MÜNSTER
            </p>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgba(245,242,235,0.5)',
                margin: 0,
              }}
            >
              <span style={{ color: 'var(--color-accent)' }}>★</span> 4,9 ·{' '}
              <span data-counter="127">127</span> BEWERTUNGEN
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
              color: '#f5f2eb',
              fontWeight: 400,
              display: 'flex',
              flexWrap: 'wrap',
              columnGap: '0.4em',
              alignItems: 'baseline',
            }}
          >
            <span>Was Kunden sagen.</span>
            <span
              style={{
                fontStyle: 'italic',
                fontWeight: 300,
                color: 'rgba(245,242,235,0.55)',
                fontVariationSettings: '"opsz" 144, "SOFT" 100, "WONK" 1',
              }}
            >
              Ohne Stern­chen-Magie.
            </span>
          </h2>
        </div>

        {/* FEATURED QUOTE — dominant editorial card */}
        <div className="flex-1 flex flex-col gap-4 lg:gap-5 mt-5 lg:mt-7" style={{ minHeight: 0 }}>
          <article
            data-featured
            className="relative overflow-hidden flex flex-col justify-between"
            style={{
              borderRadius: '4px',
              background:
                'linear-gradient(135deg, rgba(245,242,235,0.06) 0%, rgba(245,242,235,0.02) 100%)',
              border: '1px solid rgba(245,242,235,0.14)',
              boxShadow:
                'inset 0 1px 0 rgba(255,255,255,0.05), 0 28px 60px -32px rgba(0,0,0,0.5)',
              padding: 'clamp(24px, 3vw, 40px)',
              flex: '1.4 1 0%',
              minHeight: 0,
            }}
          >
            {/* Decorative accent quote-mark, top-left */}
            <span
              aria-hidden
              style={{
                position: 'absolute',
                top: 'clamp(8px, 2vw, 24px)',
                left: 'clamp(20px, 2.5vw, 36px)',
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(120px, 14vw, 280px)',
                lineHeight: 0.6,
                color: 'rgba(255,87,34,0.18)',
                fontStyle: 'italic',
                fontWeight: 500,
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            >
              „
            </span>

            {/* Top meta strip */}
            <div className="relative z-10 flex items-baseline justify-between gap-2 flex-wrap">
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
                FEATURED · GOOGLE REVIEW
              </p>
              <Stars count={FEATURED.rating} accent />
            </div>

            {/* The Quote */}
            <blockquote
              className="relative z-10 my-4 lg:my-6"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(22px, 2.8vw, 64px)',
                lineHeight: 1.15,
                letterSpacing: '-0.025em',
                fontStyle: 'italic',
                fontWeight: 350,
                fontVariationSettings: '"opsz" 144, "SOFT" 100, "WONK" 1',
                color: '#f5f2eb',
                margin: 0,
              }}
            >
              {FEATURED.quote}
            </blockquote>

            {/* Author line */}
            <div
              className="relative z-10 flex items-baseline justify-between gap-3 flex-wrap"
              style={{
                paddingTop: 'clamp(12px, 1.5vw, 18px)',
                borderTop: '1px solid rgba(245,242,235,0.14)',
              }}
            >
              <div className="flex items-baseline gap-3 flex-wrap">
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(15px, 1.2vw, 22px)',
                    letterSpacing: '-0.01em',
                    color: '#f5f2eb',
                    fontWeight: 500,
                  }}
                >
                  — {FEATURED.author}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: 'rgba(245,242,235,0.55)',
                  }}
                >
                  · {FEATURED.context}
                </span>
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'rgba(245,242,235,0.5)',
                }}
              >
                Quelle: {FEATURED.source}
              </span>
            </div>
          </article>

          {/* SMALL CARDS GRID — 4 reviews */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 lg:auto-rows-fr"
            style={{ flex: '1 1 0%', minHeight: 0 }}
          >
            {REVIEWS.map((review, i) => (
              <ReviewCard key={i} review={review} />
            ))}
          </div>
        </div>

        {/* TRUST STRIP — Quellen */}
        <div
          className="mt-4 lg:mt-6 pt-3 flex items-center justify-between gap-4 flex-wrap"
          style={{
            borderTop: '1px solid rgba(245,242,235,0.14)',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'rgba(245,242,235,0.7)',
          }}
        >
          <span style={{ color: 'rgba(245,242,235,0.45)' }}>Quellen</span>
          <div className="flex items-center flex-wrap gap-x-3 gap-y-1">
            <span>Google Reviews</span>
            <span style={{ color: 'rgba(245,242,235,0.35)' }}>·</span>
            <span>Direkt-Feedback</span>
            <span style={{ color: 'rgba(245,242,235,0.35)' }}>·</span>
            <span>Empfehlungen</span>
            <span style={{ color: 'rgba(245,242,235,0.35)' }}>·</span>
            <span>HV-Portale</span>
          </div>
          <span
            style={{ color: 'rgba(245,242,235,0.45)' }}
            className="hidden md:inline"
          >
            Stand Q2 / 2026
          </span>
        </div>
      </div>
    </section>
  )
}

function ReviewCard({ review }: { review: Review }) {
  const sourceAccent = review.source === 'Google'
  return (
    <article
      data-review-card
      className="relative overflow-hidden flex flex-col justify-between"
      style={{
        borderRadius: '4px',
        background:
          'linear-gradient(135deg, rgba(245,242,235,0.05) 0%, rgba(245,242,235,0.02) 100%)',
        border: '1px solid rgba(245,242,235,0.12)',
        boxShadow:
          'inset 0 1px 0 rgba(255,255,255,0.04), 0 20px 40px -28px rgba(0,0,0,0.45)',
        padding: '18px',
        minHeight: 0,
      }}
    >
      {/* TOP — Stars + Source */}
      <div className="flex items-baseline justify-between gap-2 mb-3">
        <Stars count={review.rating} accent={sourceAccent} />
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: sourceAccent
              ? 'var(--color-accent)'
              : 'rgba(245,242,235,0.6)',
          }}
        >
          {review.source}
        </span>
      </div>

      {/* Quote */}
      <p
        className="flex-1"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(14px, 1.05vw, 17px)',
          lineHeight: 1.35,
          letterSpacing: '-0.01em',
          fontStyle: 'italic',
          fontWeight: 350,
          fontVariationSettings: '"opsz" 36, "SOFT" 80',
          color: 'rgba(245,242,235,0.92)',
          margin: 0,
        }}
      >
        „{review.quote}"
      </p>

      {/* Author */}
      <div
        className="mt-3 pt-2"
        style={{
          borderTop: '1px solid rgba(245,242,235,0.1)',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'rgba(245,242,235,0.85)',
            margin: 0,
          }}
        >
          — {review.author}
        </p>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(245,242,235,0.5)',
            margin: '2px 0 0 0',
          }}
        >
          {review.context}
        </p>
      </div>
    </article>
  )
}
