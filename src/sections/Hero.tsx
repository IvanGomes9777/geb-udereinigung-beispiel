import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { HeroBackground, HERO_SCENES, type HeroScene } from '../components/HeroBackground'

gsap.registerPlugin(ScrollTrigger)

const HEADLINE_LINES = [
  { text: 'Sauberkeit', italic: false, weight: 500, indent: 0 },
  { text: 'als', italic: true, weight: 200, indent: 0.5 },
  { text: 'Handwerk.', italic: false, weight: 500, indent: 0 },
] as const

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

function useTypewriter(text: string, speedMs = 24, startDelayMs = 200) {
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

  const eyebrowText = `N° 01 — REFLECTION STUDY · ${scene.label} · MÜNSTER`
  const eyebrow = useTypewriter(eyebrowText, 22, 120)

  // ---------- Entrance animation ----------
  useEffect(() => {
    const sectionEl = sectionRef.current
    if (!sectionEl || !headlineRef.current) return

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
        duration: 1.15,
        stagger: 0.085,
      })
        .from(
          cardRef.current,
          { x: 24, opacity: 0, duration: 0.95 },
          '-=0.75'
        )
    }, sectionEl)

    return () => ctx.revert()
  }, [reduced])

  // Scroll-Parallax deaktiviert — konnte in Kombination mit dvh-Layout
  // Mess-Probleme verursachen. Hero scrolt normal aus dem Viewport.

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full overflow-hidden flex flex-col"
      style={{
        height: '100dvh',
        minHeight: '640px',
        color: 'var(--color-bg-base)',
      }}
    >
      {/* ---------- FULL-BLEED PHOTO BACKGROUND ---------- */}
      <div ref={bgWrapRef} className="absolute inset-0 will-change-transform">
        <HeroBackground onSceneChange={handleSceneChange} />
      </div>

      {/* ---------- CONTENT (vertical flex 3-zone: top eyebrow / middle stage / bottom strip) ---------- */}
      <div
        ref={innerRef}
        className="relative flex-1 flex flex-col mx-auto w-full px-6 lg:px-10"
        style={{
          maxWidth: 'var(--container-max)',
          zIndex: 2,
          paddingTop: 'clamp(80px, 11vh, 112px)',
          paddingBottom: 'clamp(56px, 7vh, 80px)',
        }}
      >
        {/* Editorial marker — dynamisch */}
        <p
          className="text-[11px]"
          style={{
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.20em',
            textTransform: 'uppercase',
            color: 'rgba(245,242,235,0.78)',
            minHeight: '1.2em',
            textShadow: '0 1px 6px rgba(0,0,0,0.45)',
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

        {/* ---------- STAGE: vertikal zentriert, Headline links / Card rechts ---------- */}
        <div className="flex-1 flex items-center">
          <div className="grid grid-cols-12 gap-x-6 lg:gap-x-10 w-full">
            {/* ----- HEADLINE (LEFT) ----- */}
            <h1
              ref={headlineRef}
              className="col-span-12 lg:col-span-7 m-0"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(56px, 9vw, 260px)',
                lineHeight: 0.88,
                letterSpacing: '-0.045em',
                color: '#f5f2eb',
                fontVariationSettings:
                  '"opsz" 144, "SOFT" 50, "WONK" 1',
                textShadow: '0 2px 32px rgba(0,0,0,0.42)',
              }}
            >
              {HEADLINE_LINES.map((line, i) => (
                <span
                  key={i}
                  className="block overflow-hidden"
                  style={{
                    paddingBottom: '0.04em',
                    marginLeft: `${line.indent}em`,
                  }}
                >
                  <span
                    data-headline-line
                    className="inline-block will-change-transform"
                    style={{
                      fontStyle: line.italic ? 'italic' : 'normal',
                      fontWeight: line.weight,
                      fontVariationSettings: line.italic
                        ? '"opsz" 144, "SOFT" 100, "WONK" 1'
                        : '"opsz" 144, "SOFT" 50, "WONK" 1',
                      color: line.italic ? 'rgba(245,242,235,0.88)' : '#f5f2eb',
                      letterSpacing: line.italic ? '-0.02em' : '-0.045em',
                      fontSize: line.italic ? '0.72em' : '1em',
                    }}
                  >
                    {line.text}
                  </span>
                </span>
              ))}
            </h1>

            {/* ----- GLASMORPHISM CARD (RIGHT) ----- */}
            <div
              ref={cardRef}
              className="col-span-12 lg:col-span-5 mt-8 lg:mt-0 self-center"
              style={{
                backdropFilter: 'blur(24px) saturate(180%)',
                WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                background:
                  'linear-gradient(135deg, rgba(245,242,235,0.18) 0%, rgba(245,242,235,0.08) 100%)',
                border: '1px solid rgba(255,255,255,0.22)',
                borderRadius: '3px',
                padding: 'clamp(22px, 2.2vw, 32px)',
                boxShadow:
                  'inset 0 1px 0 rgba(255,255,255,0.4), 0 30px 70px -28px rgba(0,0,0,0.55)',
              }}
            >
              {/* Mini-Eyebrow inside card */}
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'rgba(245,242,235,0.55)',
                  margin: '0 0 14px 0',
                }}
              >
                Gebäudereinigung · seit 2019
              </p>

              {/* Lead (kurz, 2 Saetze) */}
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'clamp(15px, 1.05vw, 24px)',
                  lineHeight: 1.55,
                  color: 'rgba(245,242,235,0.92)',
                  margin: 0,
                }}
              >
                Fassaden, Büros, Praxen und Wohnanlagen in{' '}
                <span style={{ color: '#f5f2eb', fontWeight: 500 }}>Münster</span>.
                <span
                  className="block mt-2"
                  style={{
                    color: '#f5f2eb',
                    fontWeight: 500,
                    fontStyle: 'italic',
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(16px, 1.15vw, 28px)',
                    fontVariationSettings: '"opsz" 36, "SOFT" 80',
                    letterSpacing: '-0.005em',
                  }}
                >
                  Kein Subunternehmer. Kein Schnellschuss.
                </span>
              </p>

              {/* CTAs gestapelt — alle gleich breit */}
              <div className="mt-6 flex flex-col gap-2.5">
                {/* Primary */}
                <a
                  href="#termin"
                  className="group relative inline-flex items-center justify-between gap-3 px-5 py-3.5 overflow-hidden transition-transform active:scale-[0.99]"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    backgroundColor: '#f5f2eb',
                    color: 'var(--color-ink-primary)',
                    borderRadius: '2px',
                    minHeight: '48px',
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
                  <span className="relative z-10 inline-flex items-center gap-2.5">
                    <span
                      aria-hidden
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        border: '1px solid currentColor',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 11,
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

                {/* Secondary */}
                <a
                  href="#kontakt"
                  className="group inline-flex items-center justify-between gap-3 px-5 py-3.5 transition-all"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11.5px',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: '#f5f2eb',
                    border: '1px solid rgba(245,242,235,0.55)',
                    background: 'rgba(245,242,235,0.04)',
                    borderRadius: '2px',
                    minHeight: '46px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(245,242,235,0.18)'
                    e.currentTarget.style.borderColor = '#f5f2eb'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(245,242,235,0.04)'
                    e.currentTarget.style.borderColor = 'rgba(245,242,235,0.55)'
                  }}
                >
                  <span>Angebot anfragen</span>
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </a>
              </div>

              {/* Phone + Trust-Strip in einer Zeile, Trennlinie oben */}
              <div
                className="mt-5 pt-4 flex items-center justify-between gap-3 flex-wrap"
                style={{ borderTop: '1px solid rgba(245,242,235,0.18)' }}
              >
                <a
                  href="tel:+49251XXXXXXX"
                  className="inline-flex items-center gap-2"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    letterSpacing: '0.08em',
                    color: 'rgba(245,242,235,0.85)',
                    textDecoration: 'underline',
                    textUnderlineOffset: '3px',
                    textDecorationThickness: '1px',
                  }}
                >
                  <span aria-hidden>☎</span>+49 251 [XXX XXXX]
                </a>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'rgba(245,242,235,0.7)',
                  }}
                >
                  <span style={{ color: 'var(--color-accent)', marginRight: 4 }}>
                    ★
                  </span>
                  4,9 · 127 Bewertungen
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- HERO FOOTER STRIP (immer am Boden) ---------- */}
      <div
        className="relative w-full"
        style={{
          borderTop: '1px solid rgba(245,242,235,0.18)',
          background:
            'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.42) 100%)',
          zIndex: 3,
        }}
      >
        <div
          className="mx-auto px-6 lg:px-10 py-3.5 flex items-center justify-between gap-6 flex-wrap"
          style={{
            maxWidth: 'var(--container-max)',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(245,242,235,0.72)',
          }}
        >
          <span className="inline-flex items-center gap-2">
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{
                background: 'var(--color-accent)',
                animation: reduced
                  ? 'none'
                  : 'accent-pulse 2.4s ease-in-out infinite',
              }}
            />
            {liveTime} · MÜNSTER
          </span>

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
                    width: sceneIndex === i ? 18 : 5,
                    height: 2,
                    background:
                      sceneIndex === i
                        ? '#f5f2eb'
                        : 'rgba(245,242,235,0.32)',
                    transition:
                      'width 600ms cubic-bezier(0.25,1,0.5,1), background 400ms',
                  }}
                />
              ))}
            </span>
          </span>

          <span className="hidden sm:inline-flex items-center gap-2">
            Scroll
            <span
              aria-hidden
              className="inline-block"
              style={{
                animation: reduced ? 'none' : 'scroll-arrow 1.6s ease-in-out infinite',
              }}
            >
              ↓
            </span>
          </span>
        </div>
      </div>

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
