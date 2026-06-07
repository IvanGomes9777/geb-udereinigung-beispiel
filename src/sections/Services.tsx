import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

type Service = {
  n: string
  name: string
  slug: string
  desc: string
  tags: string[]
  photo: string
}

/**
 * Reale Unsplash-Fotos pro Service. Wenn ein Foto nicht laedt, faengt
 * Picsum-Seeded-Fallback die Karte ab (deterministisch pro Slug).
 */
const SERVICES: Service[] = [
  {
    n: '01',
    name: 'Fassaden- & Glasreinigung',
    slug: 'fassade',
    desc: 'Streifenfrei bis 25 m Höhe. Vor- und Nachreinigung lückenlos dokumentiert.',
    tags: ['Glasfassaden', 'Schaufenster', 'Wintergärten'],
    photo:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=1600&fit=crop&q=72&auto=format',
  },
  {
    n: '02',
    name: 'Büro- & Praxisreinigung',
    slug: 'buero',
    desc: 'Werktags ausserhalb der Bürozeiten. Eigene Mitarbeiter, NDA, fester Ansprechpartner.',
    tags: ['Tagesreinigung', 'Glasflächen', 'Sanitär'],
    photo:
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&h=1600&fit=crop&q=72&auto=format',
  },
  {
    n: '03',
    name: 'Treppenhaus & Wohnanlagen',
    slug: 'treppenhaus',
    desc: 'Monatliche Standardreinigung. Briefkasten, Geländer, Glaseinlagen, Eingangsbereich.',
    tags: ['Hausverwaltung', 'WEG', 'Wartungsvertrag'],
    photo:
      'https://images.unsplash.com/photo-1564540583246-934409427776?w=1200&h=1600&fit=crop&q=72&auto=format',
  },
  {
    n: '04',
    name: 'Bauend- & Grundreinigung',
    slug: 'bauend',
    desc: 'Nach Handwerkern. Staub, Mörtel, Aufkleber, Versiegelungsreste — komplett zurück auf Null.',
    tags: ['Neubau', 'Renovierung', 'Schlüsselübergabe'],
    photo:
      'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&h=1600&fit=crop&q=72&auto=format',
  },
  {
    n: '05',
    name: 'Sonderreinigung',
    slug: 'sonder',
    desc: 'Wasserschaden, Brand- und Rauchspuren, Graffiti, Taubenkot. Mit Versicherungsabwicklung.',
    tags: ['24/7-Bereitschaft', 'Versicherung', 'Dokumentation'],
    photo:
      'https://images.unsplash.com/photo-1551076805-e1869033e561?w=1200&h=1600&fit=crop&q=72&auto=format',
  },
  {
    n: '06',
    name: 'Industrie- & Hallenreinigung',
    slug: 'industrie',
    desc: 'Maschinenparks, Hallenböden, Produktionsumgebungen. Mit Bodenreinigungsmaschinen.',
    tags: ['Lager', 'Produktion', 'Hochregal'],
    photo:
      'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=1200&h=1600&fit=crop&q=72&auto=format',
  },
]

export function Services() {
  const sectionRef = useRef<HTMLElement>(null)
  const headRef = useRef<HTMLDivElement>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const [active, setActive] = useState(0)

  // ---------- HEAD reveal (laeuft bevor pin engaged) ----------
  useEffect(() => {
    const sectionEl = sectionRef.current
    if (!sectionEl) return
    const ctx = gsap.context(() => {
      if (reduced) return
      const headEls = headRef.current?.children
      if (headEls) {
        gsap.from(headEls, {
          y: 36,
          opacity: 0,
          duration: 1.2,
          stagger: 0.15,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 78%',
            once: true,
          },
        })
      }
    }, sectionEl)
    return () => ctx.revert()
  }, [reduced])

  // ---------- ACTIVE CARD DETECTION via Intersection ----------
  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return
    const cards = Array.from(
      scroller.querySelectorAll<HTMLElement>('[data-service-card]')
    )
    if (cards.length === 0) return

    const io = new IntersectionObserver(
      (entries) => {
        let best = 0
        let bestIdx = 0
        entries.forEach((e) => {
          if (e.intersectionRatio > best) {
            best = e.intersectionRatio
            bestIdx = cards.indexOf(e.target as HTMLElement)
          }
        })
        if (best > 0 && bestIdx >= 0) setActive(bestIdx)
      },
      { root: scroller, threshold: [0.4, 0.6, 0.8, 1] }
    )
    cards.forEach((c) => io.observe(c))
    return () => io.disconnect()
  }, [])

  // Pagination -> Native horizontal scroll
  const scrollToCard = (index: number) => {
    const scroller = scrollerRef.current
    if (!scroller) return
    const card = scroller.querySelectorAll<HTMLElement>('[data-service-card]')[
      index
    ]
    if (!card) return
    scroller.scrollTo({ left: card.offsetLeft - 24, behavior: 'smooth' })
  }

  return (
    <section
      ref={sectionRef}
      id="leistungen"
      className="relative w-full overflow-hidden flex flex-col"
      style={{
        minHeight: '100dvh',
        backgroundColor: '#0e0d0a',
        color: '#f5f2eb',
      }}
    >
      {/* Atmosphaeren-Schichten */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 80% 0%, rgba(255,87,34,0.08) 0%, transparent 55%), radial-gradient(ellipse at 0% 100%, rgba(110,180,210,0.05) 0%, transparent 60%)',
        }}
      />
      {/* Filmkorn */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='280' height='280'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.9 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          mixBlendMode: 'overlay',
        }}
      />
      {/* feine 12-col Linien in Cream */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #f5f2eb 1px, transparent 1px)',
          backgroundSize: 'calc(100% / 12) 100%',
        }}
      />

      {/* CONTENT WRAPPER */}
      <div
        className="relative flex-1 flex flex-col w-full"
        style={{
          zIndex: 2,
          paddingTop: 'clamp(56px, 7vh, 80px)',
          paddingBottom: 'clamp(40px, 5vh, 56px)',
        }}
      >
        {/* HEAD */}
        <div
          ref={headRef}
          className="mx-auto w-full px-6 lg:px-10"
          style={{ maxWidth: 'var(--container-max)' }}
        >
          <div className="flex items-baseline justify-between flex-wrap gap-3 mb-4 lg:mb-6">
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
              N° 03 — LEISTUNGEN · INDEX
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
              {String(active + 1).padStart(2, '0')} / {String(SERVICES.length).padStart(2, '0')}
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
            <span>Was wir</span>
            <span
              style={{
                fontStyle: 'italic',
                fontWeight: 300,
                color: 'rgba(245,242,235,0.65)',
                fontVariationSettings: '"opsz" 144, "SOFT" 100, "WONK" 1',
              }}
            >
              machen.
            </span>
          </h2>
        </div>

        {/* CAROUSEL — native horizontal scroll mit Snap. Funktioniert auf Touch + Maus. */}
        <div className="flex-1 flex items-center mt-6 lg:mt-8" style={{ minHeight: 0 }}>
          <div
            ref={scrollerRef}
            className="w-full h-full"
            style={{
              overflowX: 'auto',
              overflowY: 'hidden',
              WebkitOverflowScrolling: 'touch',
              scrollSnapType: 'x mandatory',
              scrollPaddingLeft:
                'max(24px, calc((100vw - var(--container-max)) / 2 + 24px))',
            }}
          >
            <div
              ref={trackRef}
              className="flex gap-4 lg:gap-5 h-full"
              style={{
                paddingLeft:
                  'max(24px, calc((100vw - var(--container-max)) / 2 + 24px))',
                paddingRight:
                  'max(24px, calc((100vw - var(--container-max)) / 2 + 24px))',
                width: 'max-content',
              }}
            >
              {SERVICES.map((service, i) => (
                <ServiceCard
                  key={service.slug}
                  service={service}
                  isActive={active === i}
                />
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER STRIP — Progress + Hint */}
        <div
          className="mx-auto w-full px-6 lg:px-10 mt-6"
          style={{ maxWidth: 'var(--container-max)' }}
        >
          <div
            className="pt-4 flex items-center justify-between gap-4 flex-wrap"
            style={{
              borderTop: '1px solid rgba(245,242,235,0.14)',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(245,242,235,0.7)',
            }}
          >
            <span>
              <span style={{ color: 'var(--color-accent)' }}>★</span>{' '}
              {SERVICES[active].name}
            </span>

            <div className="flex items-center gap-1.5">
              {SERVICES.map((s, i) => (
                <button
                  key={s.slug}
                  type="button"
                  aria-label={`Springe zu ${s.name}`}
                  onClick={() => scrollToCard(i)}
                  style={{
                    width: active === i ? 24 : 6,
                    height: 2,
                    background:
                      active === i
                        ? '#f5f2eb'
                        : 'rgba(245,242,235,0.32)',
                    transition:
                      'width 600ms cubic-bezier(0.25,1,0.5,1), background 400ms',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                />
              ))}
            </div>

            <span className="hidden sm:inline-flex items-center gap-2">
              ← Drag oder Scroll →
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

function ServiceCard({
  service,
  isActive,
}: {
  service: Service
  isActive: boolean
}) {
  const [photoFailed, setPhotoFailed] = useState(false)
  const fallbackSrc = `https://picsum.photos/seed/klarwerk-${service.slug}/1200/1600`

  return (
    <article
      data-service-card
      className="relative overflow-hidden flex-shrink-0"
      style={{
        scrollSnapAlign: 'start',
        height: '100%',
        aspectRatio: '3 / 4',
        borderRadius: '4px',
        border: '1px solid rgba(245,242,235,0.14)',
        boxShadow:
          'inset 0 1px 0 rgba(255,255,255,0.06), 0 30px 60px -28px rgba(0,0,0,0.65)',
        transform: isActive ? 'scale(1)' : 'scale(0.96)',
        opacity: isActive ? 1 : 0.78,
        transition: 'transform 600ms cubic-bezier(0.25,1,0.5,1), opacity 600ms ease',
        background: '#1a1814',
      }}
    >
      {/* Photo */}
      <img
        src={photoFailed ? fallbackSrc : service.photo}
        alt=""
        loading="lazy"
        decoding="async"
        onError={() => setPhotoFailed(true)}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'contrast(1.04) saturate(0.95) brightness(0.92)' }}
      />

      {/* Top-Overlay */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: '100px',
          background:
            'linear-gradient(180deg, rgba(14,13,10,0.55) 0%, transparent 100%)',
        }}
      />
      {/* Bottom-Overlay (stark) */}
      <div
        aria-hidden
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: '70%',
          background:
            'linear-gradient(0deg, rgba(14,13,10,0.90) 0%, rgba(14,13,10,0.65) 35%, rgba(14,13,10,0.15) 75%, transparent 100%)',
        }}
      />

      {/* Top mono-Label */}
      <div className="absolute top-0 left-0 right-0 p-5 flex items-baseline justify-between">
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(245,242,235,0.85)',
            textShadow: '0 1px 4px rgba(0,0,0,0.5)',
          }}
        >
          N° {service.n}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(245,242,235,0.55)',
            textShadow: '0 1px 4px rgba(0,0,0,0.5)',
          }}
        >
          KLARWERK
        </span>
      </div>

      {/* Bottom Content + Glas-Panel */}
      <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-6">
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(22px, 2vw, 32px)',
            lineHeight: 1.05,
            letterSpacing: '-0.025em',
            fontWeight: 500,
            fontVariationSettings: '"opsz" 120, "SOFT" 50, "WONK" 1',
            color: '#f5f2eb',
            margin: '0 0 10px 0',
            textShadow: '0 2px 14px rgba(0,0,0,0.35)',
          }}
        >
          {service.name}
        </h3>

        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(12px, 0.95vw, 14px)',
            lineHeight: 1.5,
            color: 'rgba(245,242,235,0.84)',
            margin: '0 0 14px 0',
            textShadow: '0 1px 6px rgba(0,0,0,0.45)',
          }}
        >
          {service.desc}
        </p>

        {/* Glas-Strip mit Tags */}
        <div
          className="flex items-center justify-between gap-3 flex-wrap"
          style={{
            padding: '10px 12px',
            borderRadius: '2px',
            background: 'rgba(245,242,235,0.10)',
            backdropFilter: 'blur(14px) saturate(160%)',
            WebkitBackdropFilter: 'blur(14px) saturate(160%)',
            border: '1px solid rgba(245,242,235,0.18)',
          }}
        >
          <div className="flex flex-wrap gap-x-2 gap-y-1">
            {service.tags.map((tag, i) => (
              <span
                key={tag}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'rgba(245,242,235,0.85)',
                }}
              >
                {i > 0 && (
                  <span
                    style={{
                      color: 'rgba(245,242,235,0.4)',
                      marginRight: 6,
                    }}
                  >
                    ·
                  </span>
                )}
                {tag}
              </span>
            ))}
          </div>

          <a
            href="#kontakt"
            className="inline-flex items-center gap-1.5"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: '#f5f2eb',
              borderBottom: '1px solid rgba(245,242,235,0.6)',
              paddingBottom: '1px',
              whiteSpace: 'nowrap',
            }}
          >
            Anfragen →
          </a>
        </div>
      </div>
    </article>
  )
}
