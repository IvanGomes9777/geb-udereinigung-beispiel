import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../hooks/useReducedMotion'

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

function useTypewriter(text: string, speedMs = 35, startDelayMs = 200) {
  const [out, setOut] = useState('')
  useEffect(() => {
    let i = 0
    let t1: number | undefined
    let t2: number | undefined
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
  const leadRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const sculptureRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const liveTime = useLiveTime()
  const eyebrow = useTypewriter(
    `N° 01 — HERO · MÜNSTER · ANNO 2019`,
    24,
    150
  )

  // ---------- Entrance animation ----------
  useEffect(() => {
    if (!headlineRef.current) return

    const ctx = gsap.context(() => {
      const lines = headlineRef.current!.querySelectorAll<HTMLSpanElement>(
        '[data-headline-line]'
      )

      const tl = gsap.timeline({
        defaults: { ease: 'expo.out' },
        delay: reduced ? 0 : 0.15,
      })

      if (reduced) {
        tl.set(lines, { yPercent: 0, opacity: 1 })
          .set(leadRef.current, { opacity: 1 })
          .set(ctaRef.current?.children ?? [], { opacity: 1, y: 0 })
        return
      }

      tl.from(lines, {
        yPercent: 110,
        opacity: 0,
        duration: 1.1,
        stagger: 0.08,
      })
        .from(
          leadRef.current,
          { y: 24, opacity: 0, duration: 0.9 },
          '-=0.7'
        )
        .from(
          ctaRef.current?.children ?? [],
          { y: 16, opacity: 0, duration: 0.7, stagger: 0.08 },
          '-=0.5'
        )
        .from(
          sculptureRef.current,
          { opacity: 0, scale: 0.94, duration: 1.2, ease: 'power3.out' },
          '-=1'
        )
    }, sectionRef)

    return () => ctx.revert()
  }, [reduced])

  // ---------- Scroll-driven: glass rotation tied to scroll progress (all viewports) ----------
  useEffect(() => {
    if (reduced) return
    if (!sectionRef.current || !sculptureRef.current) return

    const ctx = gsap.context(() => {
      gsap.to(sculptureRef.current, {
        rotateY: 360,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [reduced])

  // ---------- Mouse parallax on glass (desktop only) ----------
  useEffect(() => {
    if (reduced) return
    if (!sculptureRef.current) return
    const el = sculptureRef.current
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = (e.clientX - cx) / window.innerWidth
      const dy = (e.clientY - cy) / window.innerHeight
      gsap.to(el, {
        rotateX: -dy * 6,
        x: dx * 16,
        duration: 0.8,
        ease: 'power3.out',
      })
    }
    const mql = window.matchMedia('(min-width: 1024px)')
    if (mql.matches) window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [reduced])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: 'var(--color-bg-base)',
        paddingTop: 'clamp(96px, 12vh, 132px)',
        paddingBottom: 'clamp(72px, 8vh, 96px)',
      }}
    >
      {/* faint grid overlay for editorial feel */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(to right, var(--color-ink-primary) 1px, transparent 1px)',
          backgroundSize: 'calc(100% / 12) 100%',
        }}
      />

      <div
        ref={innerRef}
        className="relative mx-auto px-6 lg:px-10"
        style={{ maxWidth: 'var(--container-max)' }}
      >
        {/* Editorial marker */}
        <p
          className="text-[11px] mb-8 lg:mb-12"
          style={{
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--color-ink-secondary)',
            minHeight: '1.2em',
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
                eyebrow.length === 38 ? 'transparent' : 'var(--color-accent)',
              animation:
                eyebrow.length === 38 ? 'none' : 'caret 0.8s steps(1) infinite',
            }}
          />
        </p>

        <div className="grid grid-cols-12 gap-x-4 lg:gap-x-6">
          {/* ---------- HEADLINE ---------- */}
          <h1
            ref={headlineRef}
            className="col-span-12 lg:col-span-8"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(48px, 10.5vw, 168px)',
              lineHeight: 0.94,
              letterSpacing: '-0.04em',
              fontWeight: 350,
              color: 'var(--color-ink-primary)',
              margin: 0,
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

          {/* ---------- GLASS SCULPTURE ---------- */}
          <div
            className="col-span-12 lg:col-span-4 mt-10 lg:mt-0 flex items-start justify-center lg:justify-end"
            style={{ perspective: '1200px' }}
          >
            <div className="relative w-full max-w-[360px] lg:max-w-none">
              {/* the rotating glass shard */}
              <div
                ref={sculptureRef}
                aria-hidden
                className="relative mx-auto"
                style={{
                  width: 'clamp(180px, 22vw, 320px)',
                  aspectRatio: '3 / 4',
                  borderRadius: '24px',
                  transformStyle: 'preserve-3d',
                  animation: reduced
                    ? 'none'
                    : 'glass-float 7s ease-in-out infinite',
                  willChange: 'transform',
                }}
              >
                {/* outer glass plate */}
                <div
                  className="absolute inset-0"
                  style={{
                    borderRadius: '24px',
                    background: `
                      linear-gradient(
                        135deg,
                        rgba(255,255,255,0.55) 0%,
                        rgba(255,255,255,0.18) 35%,
                        rgba(255,87,34,0.06) 60%,
                        rgba(255,255,255,0.4) 100%
                      ),
                      radial-gradient(
                        ellipse at 28% 18%,
                        rgba(255,255,255,0.7) 0%,
                        transparent 55%
                      )`,
                    border: '1px solid rgba(255,255,255,0.7)',
                    boxShadow: `
                      inset 0 1px 0 rgba(255,255,255,0.9),
                      inset 0 -1px 0 rgba(14,14,14,0.06),
                      0 30px 60px -20px rgba(14,14,14,0.22),
                      0 60px 120px -40px rgba(255,87,34,0.16)`,
                    backdropFilter: 'blur(20px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                  }}
                />

                {/* inner architectural reflection (SVG) */}
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 120 160"
                  fill="none"
                  style={{
                    mixBlendMode: 'multiply',
                    opacity: 0.18,
                    borderRadius: '24px',
                  }}
                  preserveAspectRatio="xMidYMid slice"
                >
                  {/* skyline silhouette */}
                  <path
                    d="M0 130 L0 100 L10 100 L10 80 L22 80 L22 95 L34 95 L34 60 L48 60 L48 50 L58 50 L58 70 L70 70 L70 45 L82 45 L82 65 L92 65 L92 78 L102 78 L102 90 L112 90 L112 105 L120 105 L120 130 Z"
                    fill="var(--color-ink-primary)"
                  />
                  {/* horizon line */}
                  <line
                    x1="0"
                    y1="130"
                    x2="120"
                    y2="130"
                    stroke="var(--color-ink-primary)"
                    strokeWidth="0.4"
                  />
                  {/* light refraction lines */}
                  <line
                    x1="20"
                    y1="0"
                    x2="80"
                    y2="160"
                    stroke="var(--color-ink-primary)"
                    strokeWidth="0.3"
                    opacity="0.4"
                  />
                  <line
                    x1="100"
                    y1="0"
                    x2="40"
                    y2="160"
                    stroke="var(--color-ink-primary)"
                    strokeWidth="0.3"
                    opacity="0.3"
                  />
                </svg>

                {/* corner mono mark */}
                <div
                  className="absolute"
                  style={{
                    top: 12,
                    left: 14,
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9px',
                    letterSpacing: '0.18em',
                    color: 'var(--color-ink-secondary)',
                    opacity: 0.6,
                  }}
                >
                  KW · 01
                </div>
                <div
                  className="absolute"
                  style={{
                    bottom: 14,
                    right: 16,
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9px',
                    letterSpacing: '0.18em',
                    color: 'var(--color-ink-secondary)',
                    opacity: 0.6,
                  }}
                >
                  Ø 360°
                </div>

                {/* accent micro dot */}
                <div
                  className="absolute"
                  style={{
                    top: '38%',
                    right: '18%',
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: 'var(--color-accent)',
                    boxShadow: '0 0 16px rgba(255,87,34,0.6)',
                  }}
                />
              </div>

              {/* social-proof badge below the sculpture */}
              <div
                className="mx-auto mt-6 inline-flex items-center gap-2 px-4 py-2"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  background: 'var(--color-glass-tint)',
                  border: '1px solid var(--color-glass-border)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  borderRadius: '999px',
                  color: 'var(--color-ink-primary)',
                  display: 'inline-flex',
                  position: 'relative',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{ color: 'var(--color-accent)' }}>★</span>
                4,9 / 127 Bewertungen
              </div>
            </div>
          </div>

          {/* ---------- LEAD PARAGRAPH ---------- */}
          <p
            ref={leadRef}
            className="col-span-12 sm:col-span-10 md:col-span-6 lg:col-span-5 mt-12 lg:mt-16"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(16px, 1.4vw, 20px)',
              lineHeight: 1.5,
              color: 'var(--color-ink-secondary)',
              maxWidth: '52ch',
            }}
          >
            <span style={{ color: 'var(--color-ink-primary)', fontWeight: 500 }}>
              KLARWERK
            </span>{' '}
            reinigt seit <span data-placeholder>2019</span> Gewerbeobjekte,
            Praxen und Wohnanlagen in{' '}
            <span data-placeholder>Münster</span> und Umgebung.
            <span
              className="block mt-3"
              style={{
                color: 'var(--color-ink-primary)',
                fontWeight: 500,
                fontStyle: 'italic',
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(18px, 1.6vw, 22px)',
              }}
            >
              Kein Subunternehmer. Kein Schnellschuss.
            </span>
          </p>

          {/* ---------- CTA BLOCK ---------- */}
          <div
            ref={ctaRef}
            className="col-span-12 md:col-span-12 lg:col-span-5 lg:col-start-8 mt-10 lg:mt-16 flex flex-col gap-3"
          >
            {/* Primary: Termin */}
            <a
              href="#termin"
              className="group relative inline-flex items-center justify-between gap-4 px-6 py-5 overflow-hidden transition-transform active:scale-[0.98]"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                backgroundColor: 'var(--color-ink-primary)',
                color: 'var(--color-bg-base)',
                borderRadius: '2px',
                minHeight: '56px',
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
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    border: '1px solid currentColor',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
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
              className="group inline-flex items-center justify-between gap-4 px-6 py-4 transition-all"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--color-ink-primary)',
                border: '1px solid var(--color-ink-primary)',
                backgroundColor: 'transparent',
                borderRadius: '2px',
                minHeight: '52px',
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
              <span>Angebot anfragen</span>
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </a>

            {/* Tertiary: phone */}
            <a
              href="tel:+49251XXXXXXX"
              className="inline-flex items-center gap-3 mt-1 self-start"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                letterSpacing: '0.06em',
                color: 'var(--color-ink-secondary)',
                textDecoration: 'underline',
                textUnderlineOffset: '4px',
                textDecorationThickness: '1px',
              }}
            >
              <span aria-hidden>☎</span>
              +49 251 [XXX XXXX]
            </a>
          </div>
        </div>
      </div>

      {/* ---------- HERO FOOTER STRIP ---------- */}
      <div
        className="mt-16 lg:mt-24 border-t"
        style={{ borderColor: 'var(--color-line)' }}
      >
        <div
          className="mx-auto px-6 lg:px-10 pt-4 flex items-center justify-between"
          style={{
            maxWidth: 'var(--container-max)',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--color-ink-secondary)',
          }}
        >
          <span>
            <span
              className="inline-block w-1.5 h-1.5 rounded-full mr-2 align-middle"
              style={{ background: 'var(--color-accent)' }}
            />
            {liveTime} · MÜNSTER
          </span>
          <span className="hidden sm:inline-flex items-center gap-2">
            Scroll to explore
            <span
              aria-hidden
              className="inline-block"
              style={{ animation: 'scroll-arrow 1.6s ease-in-out infinite' }}
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
        @keyframes glass-float {
          0%, 100% { transform: translateY(0) rotateX(2deg); }
          50% { transform: translateY(-8px) rotateX(-2deg); }
        }
        @keyframes scroll-arrow {
          0%, 100% { transform: translateY(0); opacity: 0.4 }
          50% { transform: translateY(4px); opacity: 1 }
        }
        a[href="#termin"]:hover [data-cta-fill] {
          transform: translateX(0) !important;
        }
      `}</style>
    </section>
  )
}
