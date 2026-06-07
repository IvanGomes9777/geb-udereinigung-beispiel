import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { ReflectionLoop } from '../components/ReflectionLoop'

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
      {/* ---------- BACKGROUND: SOFT-MORPHISM ORBS ----------
          Diese großen, weichgeblurrten Farb-Orbs geben dem
          backdrop-filter der Glas-Sculpture etwas zum Refraktieren.
          Ohne sie würde der Glaseffekt auf cremefarbenem Grund
          unsichtbar bleiben. */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none overflow-hidden"
      >
        {/* Orange-Akzent oben rechts */}
        <div
          style={{
            position: 'absolute',
            top: '8%',
            right: '6%',
            width: 'clamp(320px, 38vw, 620px)',
            height: 'clamp(320px, 38vw, 620px)',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(255,87,34,0.55) 0%, rgba(255,87,34,0) 65%)',
            filter: 'blur(60px)',
            animation: 'orb-drift-a 18s ease-in-out infinite',
          }}
        />
        {/* Cool-Cyan unten links */}
        <div
          style={{
            position: 'absolute',
            bottom: '12%',
            left: '-4%',
            width: 'clamp(280px, 32vw, 540px)',
            height: 'clamp(280px, 32vw, 540px)',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(110,180,210,0.45) 0%, rgba(110,180,210,0) 65%)',
            filter: 'blur(70px)',
            animation: 'orb-drift-b 22s ease-in-out infinite',
          }}
        />
        {/* Warmes Gelb-Beige zentriert (hinter Headline) */}
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '34%',
            width: 'clamp(240px, 28vw, 460px)',
            height: 'clamp(240px, 28vw, 460px)',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(255,210,90,0.35) 0%, rgba(255,210,90,0) 65%)',
            filter: 'blur(80px)',
            animation: 'orb-drift-c 26s ease-in-out infinite',
          }}
        />
      </div>

      {/* faint editorial column grid (vorne, über Orbs, hinter Inhalt) */}
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
            <div
              className="relative w-full max-w-[360px] lg:max-w-none"
              style={{ minHeight: 'clamp(260px, 32vw, 460px)' }}
            >
              {/* small back-shard for morphism depth (statisch, leicht versetzt) */}
              <div
                aria-hidden
                className="absolute"
                style={{
                  width: 'clamp(110px, 13vw, 180px)',
                  aspectRatio: '3 / 4',
                  right: 'clamp(20px, 5vw, 60px)',
                  top: 'clamp(40px, 6vw, 80px)',
                  borderRadius: '20px',
                  background: `linear-gradient(160deg,
                    rgba(255,255,255,0.45) 0%,
                    rgba(255,255,255,0.12) 60%,
                    rgba(110,180,210,0.18) 100%)`,
                  border: '1px solid rgba(255,255,255,0.55)',
                  boxShadow:
                    'inset 0 1px 0 rgba(255,255,255,0.7), 0 20px 40px -16px rgba(14,14,14,0.18)',
                  backdropFilter: 'blur(14px) saturate(160%)',
                  WebkitBackdropFilter: 'blur(14px) saturate(160%)',
                  animation: reduced
                    ? 'none'
                    : 'glass-float-slow 9s ease-in-out infinite',
                  transform: 'rotate(-6deg)',
                  zIndex: 0,
                }}
              />

              {/* float-wrapper: nur translateY (CSS) — separiert vom GSAP-Element,
                  damit GSAP-Rotation (rotateX/Y) nicht von der CSS-Keyframe ueberschrieben wird. */}
              <div
                className="relative mx-auto"
                style={{
                  width: 'clamp(180px, 22vw, 320px)',
                  aspectRatio: '3 / 4',
                  zIndex: 1,
                  animation: reduced
                    ? 'none'
                    : 'glass-float 7s ease-in-out infinite',
                  willChange: 'transform',
                }}
              >
              {/* the main rotating glass shard — alle Transforms via GSAP */}
              <div
                ref={sculptureRef}
                aria-hidden
                className="relative w-full h-full"
                style={{
                  borderRadius: '24px',
                  transformStyle: 'preserve-3d',
                  willChange: 'transform',
                }}
              >
                {/* outer glass plate — verstärkter Glasmorphism */}
                <div
                  className="absolute inset-0"
                  style={{
                    borderRadius: '24px',
                    background: `
                      linear-gradient(
                        135deg,
                        rgba(255,255,255,0.7) 0%,
                        rgba(255,255,255,0.22) 32%,
                        rgba(255,87,34,0.1) 58%,
                        rgba(255,255,255,0.55) 100%
                      ),
                      radial-gradient(
                        ellipse at 28% 18%,
                        rgba(255,255,255,0.85) 0%,
                        transparent 55%
                      )`,
                    border: '1px solid rgba(255,255,255,0.85)',
                    boxShadow: `
                      inset 0 1px 0 rgba(255,255,255,1),
                      inset 0 -1px 0 rgba(14,14,14,0.08),
                      0 30px 60px -20px rgba(14,14,14,0.28),
                      0 60px 120px -40px rgba(255,87,34,0.22)`,
                    backdropFilter: 'blur(24px) saturate(200%) brightness(1.06)',
                    WebkitBackdropFilter:
                      'blur(24px) saturate(200%) brightness(1.06)',
                  }}
                />

                {/* ---------- INNER LOOP: REFLECTION STUDY ----------
                    Vier wechselnde Innenraum-Szenen, 10s Loop, Crossfade.
                    Drop-in fürs echte Video: ReflectionLoop → <video> tauschen. */}
                <ReflectionLoop />

                {/* corner mono mark top-left */}
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
                {/* rotation marker top-right */}
                <div
                  className="absolute"
                  style={{
                    top: 12,
                    right: 14,
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9px',
                    letterSpacing: '0.18em',
                    color: 'var(--color-ink-secondary)',
                    opacity: 0.6,
                  }}
                >
                  Ø 360°
                </div>

                {/* accent micro dot — pulsiert */}
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
                    animation: reduced
                      ? 'none'
                      : 'accent-pulse 2.4s ease-in-out infinite',
                  }}
                />
              </div>
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
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes glass-float-slow {
          0%, 100% { transform: translateY(0) rotate(-6deg); }
          50% { transform: translateY(-14px) rotate(-3deg); }
        }
        @keyframes scroll-arrow {
          0%, 100% { transform: translateY(0); opacity: 0.4 }
          50% { transform: translateY(4px); opacity: 1 }
        }
        @keyframes accent-pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 16px rgba(255,87,34,0.6); }
          50% { transform: scale(1.4); box-shadow: 0 0 28px rgba(255,87,34,0.9); }
        }
        @keyframes orb-drift-a {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-40px, 30px) scale(1.08); }
        }
        @keyframes orb-drift-b {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(50px, -25px) scale(1.1); }
        }
        @keyframes orb-drift-c {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-25px, -35px) scale(0.95); }
        }
        a[href="#termin"]:hover [data-cta-fill] {
          transform: translateX(0) !important;
        }
      `}</style>
    </section>
  )
}
