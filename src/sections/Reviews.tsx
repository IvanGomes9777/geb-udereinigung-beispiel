import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

const FEATURED = {
  quote: 'Sie hinterlassen Räume, in denen man wieder arbeiten kann.',
  author: 'Dr. M. Hövels',
  context: 'Praxis am Aasee · März 2026',
}

const MINI_REVIEWS = [
  { quote: 'Pünktlich, gründlich, diskret.', author: 'S. Becker' },
  { quote: 'Endlich kein Subunternehmer-Chaos mehr.', author: 'H. Tervooren' },
  { quote: 'Sauber, freundlich, dokumentiert.', author: 'K. Brüggemann' },
]

export function Reviews() {
  const sectionRef = useRef<HTMLElement>(null)
  const headRef = useRef<HTMLDivElement>(null)
  const quoteMarkRef = useRef<HTMLSpanElement>(null)
  const quoteRef = useRef<HTMLQuoteElement>(null)
  const attributionRef = useRef<HTMLParagraphElement>(null)
  const stripRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const sectionEl = sectionRef.current
    if (!sectionEl) return
    if (reduced) return

    const ctx = gsap.context(() => {
      // 1) Card-Emerges Scrub
      gsap.fromTo(
        sectionRef.current,
        { yPercent: 8 },
        {
          yPercent: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'top top',
            scrub: 1.5,
          },
        }
      )

      // 2) Head — fromTo statt from, immediateRender:false damit Content
      //    bei initialem Mount sichtbar bleibt falls Trigger nicht feuert.
      const headEls = headRef.current?.children
      if (headEls && headEls.length > 0) {
        gsap.fromTo(
          headEls,
          { y: 36, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.15,
            ease: 'expo.out',
            immediateRender: false,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 92%',
              once: true,
            },
          }
        )
      }

      // 3) Big quote mark — scale-bounce, immediateRender:false
      if (quoteMarkRef.current) {
        gsap.fromTo(
          quoteMarkRef.current,
          { scale: 0, rotation: -8, opacity: 0 },
          {
            scale: 1,
            rotation: 0,
            opacity: 1,
            duration: 1.4,
            ease: 'back.out(1.5)',
            immediateRender: false,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              once: true,
            },
          }
        )
      }

      // 4) Pull-Quote — simple slide-up (KEINE Text-Clearing-Logik mehr).
      //    Text bleibt sichtbar; nur ein subtiler Slide-In als Enhancement.
      if (quoteRef.current) {
        gsap.fromTo(
          quoteRef.current,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: 'expo.out',
            immediateRender: false,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              once: true,
            },
          }
        )
      }

      // 5) Attribution — simple fade
      if (attributionRef.current) {
        gsap.fromTo(
          attributionRef.current,
          { y: 12, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.0,
            delay: 0.3,
            ease: 'expo.out',
            immediateRender: false,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              once: true,
            },
          }
        )
      }

      // 6) Trust-Strip slides up
      if (stripRef.current) {
        gsap.fromTo(
          stripRef.current.children,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.0,
            stagger: 0.1,
            ease: 'expo.out',
            immediateRender: false,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 65%',
              once: true,
            },
          }
        )
      }

      // 7) Counter animation — mit null-safety auf el (HMR-Stale-Schutz)
      const counters = sectionEl.querySelectorAll<HTMLElement>(
        '[data-counter]'
      )
      counters.forEach((el) => {
        const target = parseFloat(el.dataset.counter || '0')
        const decimals = (el.dataset.counter || '0').split('.')[1]?.length || 0
        const proxy = { v: 0 }
        gsap.to(proxy, {
          v: target,
          duration: 2.0,
          ease: 'expo.out',
          onUpdate: () => {
            if (!el || !el.isConnected) return
            el.textContent = proxy.v.toFixed(decimals).replace('.', ',')
          },
          scrollTrigger: {
            trigger: el,
            start: 'top 95%',
            once: true,
          },
        })
      })
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
        backgroundColor: '#efede7',
        color: 'var(--color-ink-primary)',
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 90% 10%, rgba(255,87,34,0.07) 0%, transparent 55%), radial-gradient(ellipse at 10% 90%, rgba(110,180,210,0.06) 0%, transparent 60%)',
        }}
      />
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
        className="relative flex-1 flex flex-col mx-auto w-full px-6 lg:px-10"
        style={{
          maxWidth: 'var(--container-max)',
          zIndex: 2,
          paddingTop: 'clamp(56px, 7vh, 80px)',
          paddingBottom: 'clamp(40px, 5vh, 56px)',
        }}
      >
        {/* HEAD */}
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
              N° 04 — BEWERTUNGEN · GOOGLE
            </p>
            <p
              className="inline-flex items-center gap-2"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--color-ink-secondary)',
                margin: 0,
              }}
            >
              <span style={{ color: 'var(--color-accent)' }}>★</span>
              <span data-counter="4.9">4,9</span> ·{' '}
              <span data-counter="127">127</span> Bewertungen
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
            <span>Was Kunden</span>
            <span
              style={{
                fontStyle: 'italic',
                fontWeight: 300,
                color: 'var(--color-ink-secondary)',
                fontVariationSettings: '"opsz" 144, "SOFT" 100, "WONK" 1',
              }}
            >
              sagen.
            </span>
          </h2>
        </div>

        {/* FEATURED QUOTE — vertikal zentriert */}
        <div className="flex-1 flex items-center mt-8 lg:mt-12">
          <div className="relative w-full grid grid-cols-12 gap-x-4 lg:gap-x-6">
            {/* Big orange quote mark — links */}
            <div
              className="col-span-12 md:col-span-2 flex items-start justify-center md:justify-end relative"
              style={{ lineHeight: 1 }}
            >
              <span
                ref={quoteMarkRef}
                aria-hidden
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(140px, 18vw, 280px)',
                  lineHeight: 0.8,
                  letterSpacing: '-0.06em',
                  color: 'var(--color-accent)',
                  fontWeight: 400,
                  fontVariationSettings: '"opsz" 144, "SOFT" 100, "WONK" 1',
                  fontStyle: 'italic',
                  display: 'inline-block',
                  transform: 'translateY(-0.05em)',
                  marginRight: '-0.05em',
                }}
              >
                „
              </span>
            </div>

            {/* Quote text + attribution */}
            <div className="col-span-12 md:col-span-10">
              <blockquote
                ref={quoteRef}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(34px, 5.8vw, 96px)',
                  lineHeight: 1.04,
                  letterSpacing: '-0.035em',
                  color: 'var(--color-ink-primary)',
                  fontWeight: 350,
                  fontStyle: 'italic',
                  fontVariationSettings: '"opsz" 144, "SOFT" 100, "WONK" 1',
                  margin: '0 0 24px 0',
                  maxWidth: '20ch',
                }}
              >
                {FEATURED.quote}
              </blockquote>

              <p
                ref={attributionRef}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'clamp(11px, 0.9vw, 13px)',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'var(--color-ink-secondary)',
                  margin: 0,
                }}
              >
                — {FEATURED.author} · {FEATURED.context}
              </p>
            </div>
          </div>
        </div>

        {/* TRUST STRIP */}
        <div
          ref={stripRef}
          className="mt-6 lg:mt-8 pt-5 grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-6 items-start"
          style={{ borderTop: '1px solid rgba(14,14,14,0.14)' }}
        >
          {/* Aggregat */}
          <div className="md:col-span-3">
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--color-ink-secondary)',
                margin: '0 0 8px 0',
              }}
            >
              Aggregat
            </p>
            <p
              className="inline-flex items-baseline gap-2"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(32px, 3vw, 44px)',
                lineHeight: 1,
                letterSpacing: '-0.03em',
                color: 'var(--color-ink-primary)',
                margin: 0,
                fontWeight: 500,
                fontVariationSettings: '"opsz" 144, "SOFT" 50',
              }}
            >
              <span data-counter="4.9">4,9</span>
              <span style={{ color: 'var(--color-accent)', fontSize: '0.6em' }}>
                ★
              </span>
            </p>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--color-ink-muted)',
                margin: '6px 0 0 0',
              }}
            >
              <span data-counter="127">127</span> Bewertungen
            </p>
          </div>

          {/* Mini Reviews */}
          <div className="md:col-span-6 flex flex-col gap-2.5">
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
              Weitere Stimmen
            </p>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {MINI_REVIEWS.map((r, i) => (
                <li
                  key={i}
                  className="flex items-baseline gap-3 py-1"
                  style={{
                    borderBottom:
                      i < MINI_REVIEWS.length - 1
                        ? '1px solid rgba(14,14,14,0.08)'
                        : 'none',
                    paddingBottom: '8px',
                    paddingTop: i === 0 ? '4px' : '8px',
                  }}
                >
                  <span
                    style={{ color: 'var(--color-accent)', fontSize: '11px' }}
                  >
                    ★
                  </span>
                  <span
                    style={{
                      flex: 1,
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(13px, 1vw, 15px)',
                      lineHeight: 1.3,
                      letterSpacing: '-0.015em',
                      fontStyle: 'italic',
                      color: 'var(--color-ink-primary)',
                      fontVariationSettings: '"opsz" 36, "SOFT" 80',
                    }}
                  >
                    „{r.quote}"
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: 'var(--color-ink-muted)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    — {r.author}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="md:col-span-3 flex flex-col justify-between items-start md:items-end gap-3 h-full">
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
              Mehr lesen
            </p>
            <a
              href="https://www.google.com/maps"
              target="_blank"
              rel="noopener"
              className="group inline-flex items-center gap-3 px-5 py-3 transition-all"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--color-ink-primary)',
                border: '1px solid var(--color-ink-primary)',
                background: 'transparent',
                borderRadius: '2px',
                minHeight: '44px',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  'var(--color-ink-primary)'
                e.currentTarget.style.color = 'var(--color-bg-base)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = 'var(--color-ink-primary)'
              }}
            >
              Alle 127 lesen
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
