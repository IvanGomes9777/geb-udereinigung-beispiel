import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { HeroBackground, HERO_SCENES, type HeroScene } from '../components/HeroBackground'

gsap.registerPlugin(ScrollTrigger)

const HEADLINE_LINES = ['Sauber-', 'keit als', 'Hand-', 'werk.']

function useLiveTime() {
  const [time, setTime] = useState(() => {
    const d = new Date()
    return d.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  })
  useEffect(() => {
    const id = window.setInterval(() => {
      const d = new Date()
      setTime(
        d.toLocaleTimeString('de-DE', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      )
    }, 1000 * 15)
    return () => window.clearInterval(id)
  }, [])
  return time
}

function useTypewriter(text: string, speedMs = 28, startDelayMs = 200) {
  const [out, setOut] = useState('')
  useEffect(() => {
    let i = 0
    let t1: number | undefined
    let t2: number | undefined
    setOut('')
    t1 = window.setTimeout(function tick() {
      setOut(text.slice(0, i + 1))
      i++
      if (i < text.length) t2 = window.setTimeout(tick, speedMs)
    }, startDelayMs)
    return () => {
      if (t1) window.clearTimeout(t1)
      if (t2) window.clearTimeout(t2)
    }
  }, [text, speedMs, startDelayMs])
  return out
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const bgWrapRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const liveTime = useLiveTime()

  const [scene, setScene] = useState<HeroScene>(HERO_SCENES[0])
  const [sceneIndex, setSceneIndex] = useState(0)

  const handleSceneChange = useCallback((i: number, s: HeroScene) => {
    setScene(s)
    setSceneIndex(i)
  }, [])

  // Eyebrow zeigt dynamisch die aktuelle Szene
  const eyebrowText = `N° 01 — REFLECTION STUDY · ${scene.label} · MÜNSTER`
  const eyebrow = useTypewriter(eyebrowText, 22, 120)

  // ---------- Entrance animation ----------
  useEffect(() => {
    if (!headlineRef.current) return

    const ctx = gsap.context(() => {
      const lines = headlineRef.current!.querySelectorAll<HTMLSpanElement>(
        '[data-headline-line]'
      )

      const tl = gsap.timeline({
        defaults: { ease: 'expo.out' },
        delay: reduced ? 0 : 0.2,
      })

      if (reduced) {
        tl.set(lines, { yPercent: 0, opacity: 1 })
          .set(cardRef.current, { opacity: 1, y: 0 })
        return
      }

      tl.from(lines, {
        yPercent: 110,
        opacity: 0,
        duration: 1.2,
        stagger: 0.09,
      })
        .from(
          cardRef.current,
          { y: 28, opacity: 0, duration: 1.0 },
          '-=0.7'
        )
    }, sectionRef)

    return () => ctx.revert()
  }, [reduced])

  // ---------- Scroll-driven: Photo-BG zoomt + driftet hoch (cinematic) ----------
  useEffect(() => {
    if (reduced) return
    if (!sectionRef.current || !bgWrapRef.current || !innerRef.current) return

    const ctx = gsap.context(() => {
      gsap.to(bgWrapRef.current, {
        yPercent: -14,
        scale: 1.08,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8,
        },
      })
      gsap.to(innerRef.current, {
        yPercent: -8,
        opacity: 0.6,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full overflow-hidden"
      style={{
        minHeight: '100dvh',
        paddingTop: 'clamp(96px, 12vh, 132px)',
        paddingBottom: 'clamp(88px, 10vh, 120px)',
        color: 'var(--color-bg-base)',
      }}
    >
      {/* ---------- FULL-BLEED PHOTO BACKGROUND ---------- */}
      <div ref={bgWrapRef} className="absolute inset-0 will-change-transform">
        <HeroBackground onSceneChange={handleSceneChange} />
      </div>

      {/* ---------- CONTENT ---------- */}
      <div
        ref={innerRef}
        className="relative mx-auto px-6 lg:px-10"
        style={{ maxWidth: 'var(--container-max)', zIndex: 2 }}
      >
        {/* Editorial marker — dynamisch mit Szene */}
        <p
          className="text-[11px] mb-8 lg:mb-12"
          style={{
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(239,237,231,0.78)',
            minHeight: '1.2em',
            textShadow: '0 1px 4px rgba(0,0,0,0.4)',
          }}
        >
          {eyebrow}
          <span
            className="inline-block ml-1"
            style={{
              width: '0.5em',
              height: '1em',
              verticalAlign: '-2px',
              background:
                eyebrow.length === eyebrowText.length
                  ? 'transparent'
                  : 'var(--color-accent)',
              animation:
                eyebrow.length === eyebrowText.length
                  ? 'none'
                  : 'caret 0.8s steps(1) infinite',
            }}
          />
        </p>

        <div className="grid grid-cols-12 gap-x-4 lg:gap-x-6">
          {/* ---------- HEADLINE ---------- */}
          <h1
            ref={headlineRef}
            className="col-span-12 lg:col-span-9"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(56px, 11.5vw, 192px)',
              lineHeight: 0.94,
              letterSpacing: '-0.04em',
              fontWeight: 350,
              color: '#f5f2eb',
              margin: 0,
              textShadow: '0 2px 24px rgba(0,0,0,0.35)',
            }}
          >
            {HEADLINE_LINES.map((line, i) => (
              <span
                key={i}
                className="block overflow-hidden"
                style={{ paddingBottom: '0.04em' }}
              >
                <span
                  data-headline-line
                  className="inline-block will-change-transform"
                  style={{
                    fontStyle: i === 1 ? 'italic' : 'normal',
                    fontWeight: i === 1 ? 300 : 350,
                  }}
                >
                  {line}
                </span>
              </span>
            ))}
          </h1>

          {/* ---------- GLASMORPHISM CONTENT CARD ---------- */}
          <div
            ref={cardRef}
            className="col-span-12 md:col-span-10 lg:col-span-7 mt-10 lg:mt-14"
            style={{
              backdropFilter: 'blur(22px) saturate(180%)',
              WebkitBackdropFilter: 'blur(22px) saturate(180%)',
              background:
                'linear-gradient(135deg, rgba(239,237,231,0.16) 0%, rgba(239,237,231,0.08) 100%)',
              border: '1px solid rgba(255,255,255,0.20)',
              borderRadius: '4px',
              padding: 'clamp(20px, 2.4vw, 36px)',
              boxShadow:
                'inset 0 1px 0 rgba(255,255,255,0.35), 0 30px 60px -24px rgba(0,0,0,0.45)',
            }}
          >
            {/* Lead — gestrafft für cinematic Tonalität */}
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(15px, 1.25vw, 18px)',
                lineHeight: 1.55,
                color: 'rgba(245,242,235,0.88)',
                margin: 0,
                maxWidth: '52ch',
              }}
            >
              Seit <span data-placeholder>2019</span> reinigt{' '}
              <span style={{ color: '#f5f2eb', fontWeight: 500 }}>KLARWERK</span>{' '}
              Gewerbeobjekte, Praxen und Wohnanlagen in{' '}
              <span data-placeholder>Münster</span>.
              <span
                className="block mt-2.5"
                style={{
                  color: '#f5f2eb',
                  fontWeight: 500,
                  fontStyle: 'italic',
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(17px, 1.4vw, 21px)',
                  letterSpacing: '-0.01em',
                }}
              >
                Kein Subunternehmer. Kein Schnellschuss.
              </span>
            </p>

            {/* CTA-Row */}
            <div className="mt-7 lg:mt-9 flex flex-col sm:flex-row sm:items-stretch gap-3">
              {/* Primary: Termin */}
              <a
                href="#termin"
                className="group relative inline-flex items-center justify-center gap-3 px-6 py-4 overflow-hidden transition-transform active:scale-[0.98] flex-1 sm:flex-none"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12.5px',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  backgroundColor: '#f5f2eb',
                  color: 'var(--color-ink-primary)',
                  borderRadius: '2px',
                  minHeight: '52px',
                }}
              >
                <span
                  aria-hidden
                  className="absolute inset-0 -z-0 transition-transform duration-500"
                  style={{
                    background: 'var(--color-accent)',
                    transform: 'translateX(-101%)',
                  }}
                  data-cta-fill
                />
                <span className="relative z-10 inline-flex items-center gap-3">
                  <span
                    aria-hidden
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      border: '1px solid currentColor',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 13,
                    }}
                  >
                    ✦
                  </span>
                  Termin vereinbaren
                </span>
                <span
                  className="relative z-10 transition-transform group-hover:translate-x-1"
                  aria-hidden
                >
                  →
                </span>
              </a>

              {/* Secondary: Angebot */}
              <a
                href="#kontakt"
                className="group inline-flex items-center justify-center gap-3 px-6 py-4 transition-all flex-1 sm:flex-none"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: '#f5f2eb',
                  border: '1px solid rgba(245,242,235,0.6)',
                  background: 'rgba(245,242,235,0.04)',
                  borderRadius: '2px',
                  minHeight: '52px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(245,242,235,0.18)'
                  e.currentTarget.style.borderColor = '#f5f2eb'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(245,242,235,0.04)'
                  e.currentTarget.style.borderColor = 'rgba(245,242,235,0.6)'
                }}
              >
                <span>Angebot anfragen</span>
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </a>
            </div>

            {/* Tertiary: phone */}
            <a
              href="tel:+49251XXXXXXX"
              className="inline-flex items-center gap-3 mt-5"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                letterSpacing: '0.06em',
                color: 'rgba(245,242,235,0.75)',
                textDecoration: 'underline',
                textUnderlineOffset: '4px',
                textDecorationThickness: '1px',
              }}
            >
              <span aria-hidden>☎</span>
              +49 251 [XXX XXXX]
            </a>

            {/* Mini social-proof inside card */}
            <div
              className="mt-6 pt-5 flex items-center gap-4 flex-wrap"
              style={{ borderTop: '1px solid rgba(245,242,235,0.18)' }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'rgba(245,242,235,0.85)',
                }}
              >
                <span style={{ color: 'var(--color-accent)', marginRight: 6 }}>★</span>
                4,9 / 127 Bewertungen
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'rgba(245,242,235,0.55)',
                }}
              >
                · Versichert · TÜV-geprüfte Reinigungsmittel
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- HERO FOOTER STRIP ---------- */}
      <div
        className="absolute left-0 right-0 bottom-0"
        style={{
          borderTop: '1px solid rgba(245,242,235,0.18)',
          background:
            'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.35) 100%)',
          zIndex: 3,
        }}
      >
        <div
          className="mx-auto px-6 lg:px-10 py-4 flex items-center justify-between gap-6 flex-wrap"
          style={{
            maxWidth: 'var(--container-max)',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(245,242,235,0.7)',
          }}
        >
          <span className="inline-flex items-center gap-2">
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{
                background: 'var(--color-accent)',
                animation: reduced ? 'none' : 'accent-pulse 2.4s ease-in-out infinite',
              }}
            />
            {liveTime} · MÜNSTER
          </span>

          {/* Scene indicator + progress dots */}
          <span className="inline-flex items-center gap-3">
            <span style={{ color: 'rgba(245,242,235,0.55)' }}>
              REFL · {scene.label}
            </span>
            <span className="inline-flex items-center gap-1.5">
              {HERO_SCENES.map((s, i) => (
                <span
                  key={s.key}
                  aria-label={s.label}
                  style={{
                    display: 'inline-block',
                    width: sceneIndex === i ? 16 : 5,
                    height: 2,
                    background:
                      sceneIndex === i
                        ? '#f5f2eb'
                        : 'rgba(245,242,235,0.35)',
                    transition: 'width 600ms cubic-bezier(0.25,1,0.5,1), background 400ms',
                  }}
                />
              ))}
            </span>
          </span>

          <span className="hidden sm:inline-flex items-center gap-2">
            Scroll to explore
            <span
              aria-hidden
              className="inline-block"
              style={{ animation: reduced ? 'none' : 'scroll-arrow 1.6s ease-in-out infinite' }}
            >
              ↓
            </span>
          </span>
        </div>
      </div>

      {/* keyframes */}
      <style>{`
        @keyframes caret {
          0%, 100% { opacity: 0 }
          50% { opacity: 1 }
        }
        @keyframes scroll-arrow {
          0%, 100% { transform: translateY(0); opacity: 0.5 }
          50% { transform: translateY(4px); opacity: 1 }
        }
        @keyframes accent-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.6); opacity: 0.7; }
        }
        a[href="#termin"]:hover [data-cta-fill] {
          transform: translateX(0) !important;
        }
      `}</style>
    </section>
  )
}
