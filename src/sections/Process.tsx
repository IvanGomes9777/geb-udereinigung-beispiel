import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

type Step = {
  n: string
  label: string
  title: string
  body: string
  duration: string
  photo: string
  photoAlt: string
  accent?: boolean
}

/**
 * Photos: Unsplash, royalty-free, kommerzielle Nutzung erlaubt, keine
 * Attribution-Pflicht. Quelle: unsplash.com/license. Bei 404 faengt
 * Picsum-Seeded-Fallback (deterministisch pro Slug) die Karte ab.
 * w=2400&q=80 fuer Retina-/4K-Schaerfe.
 */
const STEPS: readonly Step[] = [
  {
    n: '01',
    label: 'Anfrage',
    title: 'Anruf oder Formular.',
    body: 'Sie schildern kurz Objekt und Aufgabe. Wir melden uns binnen 24 Stunden persönlich zurück — kein Callcenter.',
    duration: '< 24 H',
    photo:
      'https://images.unsplash.com/photo-1551434678-e076c223a692?w=2400&q=80&auto=format&fit=crop',
    photoAlt: 'Zwei Personen am Schreibtisch in modernem Büro',
  },
  {
    n: '02',
    label: 'Erstbesuch',
    title: 'Vor Ort, persönlich.',
    body: 'Inhaber kommt zum Objekt, schaut sich alles an, bespricht Details. Kostenfrei und unverbindlich.',
    duration: '< 48 H',
    photo:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=2400&q=80&auto=format&fit=crop',
    photoAlt: 'Modernes leeres Büro-Interieur mit Beton-Boden',
  },
  {
    n: '03',
    label: 'Angebot',
    title: 'Schwarz auf weiß.',
    body: 'Sie bekommen ein festes Angebot mit Leistungs­katalog und Preis. Keine Überraschungen, keine versteckten Kosten.',
    duration: '< 48 H',
    photo:
      'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=2400&q=80&auto=format&fit=crop',
    photoAlt: 'Hand schreibt mit Stift auf weißes Dokument',
  },
  {
    n: '04',
    label: 'Reinigung',
    title: 'In festem Rhythmus.',
    body: 'Wir kommen zum vereinbarten Termin. Wartungs­vertrag möglich, jederzeit anpassbar oder kündbar.',
    duration: 'Wartung',
    accent: true,
    photo:
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=2400&q=80&auto=format&fit=crop',
    photoAlt: 'Person mit gelben Handschuhen reinigt Fensterläden',
  },
] as const

export function Process() {
  const sectionRef = useRef<HTMLElement>(null)
  const headRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const sectionEl = sectionRef.current
    if (!sectionEl) return
    const ctx = gsap.context(() => {
      if (reduced) return

      // 1) SECTION SCRUB — "rises" subtle waehrend Section reinkommt
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

      // 2) ENTRANCE Scrub-Timeline (gleiche Mechanik wie AboutUs)
      //    HEAD + Cards kommen progressiv beim Scrollen rein
      const headElements = headRef.current?.children
      const cards = gsap.utils.toArray<HTMLElement>('[data-process-card]')

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

      // CARDS kommen einzeln rein — von unten, klar gestaffelt
      cards.forEach((card, i) => {
        entranceTL.fromTo(
          card,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.4,
            ease: 'power3.out',
          },
          0.8 + i * 0.7
        )
      })

      // 3) EXIT FADE — Section faded raus beim Uebergang zur naechsten
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
      id="prozess"
      className="relative w-full overflow-hidden flex flex-col"
      style={{
        // Desktop: 100dvh-Fit. Mobile: kann wachsen wenn 4 Cards stacken
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
            'radial-gradient(ellipse at 15% 0%, rgba(255,87,34,0.05) 0%, transparent 55%), radial-gradient(ellipse at 100% 100%, rgba(70,55,30,0.04) 0%, transparent 60%)',
        }}
      />
      {/* 12-col Editorial-Linien (wie AboutUs) */}
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
              N° 04 — SO ARBEITEN WIR · ABLAUF
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
              4 SCHRITTE · AB ANFRAGE
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
            <span>Vom Anruf zur Reinigung.</span>
            <span
              style={{
                fontStyle: 'italic',
                fontWeight: 300,
                color: 'var(--color-ink-secondary)',
                fontVariationSettings: '"opsz" 144, "SOFT" 100, "WONK" 1',
              }}
            >
              In vier Schritten.
            </span>
          </h2>
        </div>

        {/* STEPS GRID — 4 cards on desktop, 2x2 on tablet, stacked on mobile.
            auto-rows-fr (Desktop) sorgt dafuer dass Cards die volle verfuegbare
            Hoehe fuellen (statt content-sized 272px zu bleiben). */}
        <div
          className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mt-5 lg:mt-7 lg:auto-rows-fr"
          style={{ minHeight: 0 }}
        >
          {STEPS.map((step) => (
            <ProcessCard key={step.n} step={step} />
          ))}
        </div>

        {/* TRUST STRIP — Reaktionszeiten + Verfuegbarkeit */}
        <div
          className="mt-4 lg:mt-6 pt-3 flex items-center justify-between gap-4 flex-wrap"
          style={{
            borderTop: '1px solid rgba(14,14,14,0.12)',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--color-ink-secondary)',
          }}
        >
          <span style={{ color: 'var(--color-ink-muted)' }}>Reaktionszeit</span>
          <div className="flex items-center flex-wrap gap-x-3 gap-y-1">
            <span>Anfrage → Antwort</span>
            <span style={{ color: 'var(--color-ink-muted)' }}>·</span>
            <span>Ø 18 H</span>
            <span style={{ color: 'var(--color-ink-muted)' }}>·</span>
            <span>MO–SA 7–19</span>
            <span style={{ color: 'var(--color-ink-muted)' }}>·</span>
            <span style={{ color: 'var(--color-accent)' }}>★ Notfall 24/7</span>
          </div>
          <span
            style={{ color: 'var(--color-ink-muted)' }}
            className="hidden md:inline"
          >
            +49 251 · WhatsApp
          </span>
        </div>
      </div>
    </section>
  )
}

function ProcessCard({ step }: { step: Step }) {
  const [photoFailed, setPhotoFailed] = useState(false)
  const fallbackSrc = `https://picsum.photos/seed/klarwerk-process-${step.n}/1600/2000`

  return (
    <article
      data-process-card
      className="relative overflow-hidden flex flex-col"
      style={{
        borderRadius: '4px',
        border: '1px solid rgba(245,242,235,0.14)',
        boxShadow:
          'inset 0 1px 0 rgba(255,255,255,0.06), 0 30px 60px -28px rgba(0,0,0,0.55)',
        background: '#1a1814',
        minHeight: 0,
      }}
    >
      {/* FULL-BLEED PHOTO als Hintergrund */}
      <img
        src={photoFailed ? fallbackSrc : step.photo}
        alt={step.photoAlt}
        loading="lazy"
        decoding="async"
        onError={() => setPhotoFailed(true)}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'contrast(1.04) saturate(0.92) brightness(0.85)' }}
      />

      {/* Top dark gradient fuer Top-Label-Lesbarkeit */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: '110px',
          background:
            'linear-gradient(180deg, rgba(14,13,10,0.62) 0%, transparent 100%)',
        }}
      />
      {/* Starker Bottom-Gradient fuer Content-Lesbarkeit (Number+Title+Body) */}
      <div
        aria-hidden
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: '75%',
          background:
            'linear-gradient(0deg, rgba(14,13,10,0.92) 0%, rgba(14,13,10,0.62) 38%, rgba(14,13,10,0.12) 78%, transparent 100%)',
        }}
      />

      {/* TOP STRIP — N° + Dauer */}
      <div className="relative z-10 flex items-baseline justify-between gap-2 p-5 lg:p-6">
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(245,242,235,0.95)',
            margin: 0,
            textShadow: '0 1px 4px rgba(0,0,0,0.5)',
          }}
        >
          N° {step.n}
        </p>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: step.accent
              ? 'var(--color-accent)'
              : 'rgba(245,242,235,0.82)',
            margin: 0,
            textShadow: '0 1px 4px rgba(0,0,0,0.5)',
          }}
        >
          {step.duration}
        </p>
      </div>

      {/* CONTENT — sitzt am Boden der Card, ueber dem starken Gradient */}
      <div
        className="relative z-10 mt-auto flex flex-col"
        style={{ padding: '0 20px 20px', minHeight: 0 }}
      >
        {/* GIANT step number + label */}
        <div className="mb-2 lg:mb-3 flex items-baseline gap-3">
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(56px, 6vw, 128px)',
              lineHeight: 0.82,
              letterSpacing: '-0.05em',
              fontVariationSettings: '"opsz" 144, "SOFT" 50, "WONK" 1',
              color: '#f5f2eb',
              fontWeight: 500,
              display: 'inline-block',
              textShadow: '0 2px 14px rgba(0,0,0,0.4)',
            }}
          >
            {step.n}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(9px, 0.72vw, 11px)',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(245,242,235,0.65)',
              whiteSpace: 'nowrap',
              alignSelf: 'flex-end',
              paddingBottom: '6px',
              textShadow: '0 1px 4px rgba(0,0,0,0.5)',
            }}
          >
            {step.label}
          </span>
        </div>

        {/* Title + Body */}
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(18px, 1.7vw, 28px)',
            lineHeight: 1.1,
            letterSpacing: '-0.025em',
            fontVariationSettings: '"opsz" 120, "SOFT" 50, "WONK" 1',
            color: '#f5f2eb',
            margin: '0 0 8px 0',
            fontWeight: 500,
            textShadow: '0 2px 14px rgba(0,0,0,0.4)',
          }}
        >
          {step.title}
        </h3>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(12px, 0.92vw, 14px)',
            lineHeight: 1.5,
            color: 'rgba(245,242,235,0.85)',
            margin: 0,
            textShadow: '0 1px 6px rgba(0,0,0,0.45)',
          }}
        >
          {step.body}
        </p>
      </div>
    </article>
  )
}
