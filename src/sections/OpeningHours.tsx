import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

const DAYS = [
  { name: 'Montag', short: 'MO', hours: '07:00 – 18:00', open: true },
  { name: 'Dienstag', short: 'DI', hours: '07:00 – 18:00', open: true },
  { name: 'Mittwoch', short: 'MI', hours: '07:00 – 18:00', open: true },
  { name: 'Donnerstag', short: 'DO', hours: '07:00 – 18:00', open: true },
  { name: 'Freitag', short: 'FR', hours: '07:00 – 16:00', open: true },
  { name: 'Samstag', short: 'SA', hours: '09:00 – 13:00', open: true },
  { name: 'Sonntag', short: 'SO', hours: 'Geschlossen', open: false },
] as const

function useNowDay() {
  const [idx, setIdx] = useState(() => {
    const d = new Date().getDay()
    return d === 0 ? 6 : d - 1 // shift Sunday from 0 to 6
  })
  useEffect(() => {
    const update = () => {
      const d = new Date().getDay()
      setIdx(d === 0 ? 6 : d - 1)
    }
    const id = window.setInterval(update, 60_000)
    return () => window.clearInterval(id)
  }, [])
  return idx
}

function useLiveTime() {
  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  )
  useEffect(() => {
    const id = window.setInterval(() => {
      setTime(
        new Date().toLocaleTimeString('de-DE', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      )
    }, 30_000)
    return () => window.clearInterval(id)
  }, [])
  return time
}

export function OpeningHours() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const todayIdx = useNowDay()
  const time = useLiveTime()

  useEffect(() => {
    const sectionEl = sectionRef.current
    if (!sectionEl) return
    if (reduced) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-day-row]',
        { x: -24, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: 'expo.out',
          immediateRender: false,
          scrollTrigger: {
            trigger: sectionEl,
            start: 'top 85%',
            once: true,
          },
        }
      )
    }, sectionEl)
    return () => ctx.revert()
  }, [reduced])

  const isOpenNow = (() => {
    const day = DAYS[todayIdx]
    if (!day.open) return false
    const [openStr, closeStr] = day.hours.split(' – ')
    if (!openStr || !closeStr) return false
    const now = new Date()
    const [oh, om] = openStr.split(':').map(Number)
    const [ch, cm] = closeStr.split(':').map(Number)
    const nowMin = now.getHours() * 60 + now.getMinutes()
    const openMin = oh * 60 + om
    const closeMin = ch * 60 + cm
    return nowMin >= openMin && nowMin < closeMin
  })()

  return (
    <section
      ref={sectionRef}
      id="oeffnungszeiten"
      className="relative w-full overflow-hidden flex flex-col"
      style={{
        minHeight: '100dvh',
        backgroundColor: '#0e0d0a',
        color: '#f5f2eb',
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 80% 0%, rgba(255,87,34,0.08) 0%, transparent 55%), radial-gradient(ellipse at 0% 100%, rgba(110,180,210,0.05) 0%, transparent 60%)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #f5f2eb 1px, transparent 1px)',
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
        <div>
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
              N° 05 — ÖFFNUNGSZEITEN · MÜNSTER
            </p>
            <p
              className="inline-flex items-center gap-2"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgba(245,242,235,0.55)',
                margin: 0,
              }}
            >
              <span
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{
                  background: isOpenNow ? '#3fd97f' : 'var(--color-accent)',
                  animation:
                    'pulse-dot 2.4s ease-in-out infinite',
                }}
              />
              {isOpenNow ? 'GEÖFFNET' : 'GESCHLOSSEN'} · {time}
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
            <span>Wann wir</span>
            <span
              style={{
                fontStyle: 'italic',
                fontWeight: 300,
                color: 'rgba(245,242,235,0.6)',
                fontVariationSettings: '"opsz" 144, "SOFT" 100, "WONK" 1',
              }}
            >
              da sind.
            </span>
          </h2>
        </div>

        {/* GRID: links Öffnungstabelle, rechts Notfall-Kontakt */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 mt-8 lg:mt-10 items-center">
          {/* DAYS TABLE */}
          <div className="lg:col-span-7">
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgba(245,242,235,0.5)',
                margin: '0 0 14px 0',
              }}
            >
              Regulär · Werkstattzeiten
            </p>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {DAYS.map((day, i) => {
                const isToday = i === todayIdx
                return (
                  <li
                    key={day.short}
                    data-day-row
                    className="flex items-center gap-4 lg:gap-6 py-3 lg:py-4"
                    style={{
                      borderBottom:
                        i < DAYS.length - 1
                          ? '1px solid rgba(245,242,235,0.12)'
                          : 'none',
                      background: isToday
                        ? 'linear-gradient(90deg, rgba(255,87,34,0.08) 0%, transparent 70%)'
                        : 'transparent',
                      marginInline: isToday ? '-16px' : '0',
                      paddingInline: isToday ? '16px' : '0',
                      borderRadius: isToday ? '2px' : 0,
                      position: 'relative',
                    }}
                  >
                    {isToday && (
                      <span
                        aria-hidden
                        style={{
                          position: 'absolute',
                          left: '4px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: 4,
                          height: '60%',
                          background: 'var(--color-accent)',
                          borderRadius: '2px',
                        }}
                      />
                    )}
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: isToday
                          ? 'var(--color-accent)'
                          : 'rgba(245,242,235,0.5)',
                        width: '32px',
                        flexShrink: 0,
                        fontWeight: isToday ? 700 : 400,
                      }}
                    >
                      {day.short}
                    </span>
                    <span
                      className="flex-1"
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(20px, 2.4vw, 64px)',
                        letterSpacing: '-0.025em',
                        color: day.open ? '#f5f2eb' : 'rgba(245,242,235,0.4)',
                        fontWeight: isToday ? 500 : 350,
                        fontVariationSettings: '"opsz" 144, "SOFT" 50',
                      }}
                    >
                      {day.name}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 'clamp(12px, 1vw, 15px)',
                        letterSpacing: '0.08em',
                        color: day.open ? '#f5f2eb' : 'rgba(245,242,235,0.4)',
                        fontWeight: isToday ? 700 : 500,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {day.hours}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* NOTFALL / SONDERTERMINE Card */}
          <div className="lg:col-span-5">
            <div
              style={{
                borderRadius: '4px',
                background:
                  'linear-gradient(135deg, rgba(245,242,235,0.10) 0%, rgba(245,242,235,0.04) 100%)',
                backdropFilter: 'blur(18px) saturate(160%)',
                WebkitBackdropFilter: 'blur(18px) saturate(160%)',
                border: '1px solid rgba(245,242,235,0.18)',
                boxShadow:
                  'inset 0 1px 0 rgba(255,255,255,0.10), 0 24px 50px -28px rgba(0,0,0,0.5)',
                padding: '24px lg:32px',
              }}
              className="p-6 lg:p-8"
            >
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'rgba(245,242,235,0.55)',
                  margin: '0 0 10px 0',
                }}
              >
                24/7 · Notfallreinigung
              </p>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(22px, 2.4vw, 64px)',
                  lineHeight: 1.05,
                  letterSpacing: '-0.025em',
                  color: '#f5f2eb',
                  margin: '0 0 14px 0',
                  fontWeight: 500,
                  fontStyle: 'italic',
                  fontVariationSettings: '"opsz" 120, "SOFT" 100, "WONK" 1',
                }}
              >
                Wasser, Brand, Glasbruch — wir sind in 60 Min vor Ort.
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'clamp(13px, 1vw, 15px)',
                  lineHeight: 1.5,
                  color: 'rgba(245,242,235,0.78)',
                  margin: '0 0 22px 0',
                }}
              >
                Außerhalb der Bürozeiten erreichbar über die 24/7-Notfallnummer.
                Mit Versicherungsabwicklung und Sofort-Dokumentation.
              </p>

              <div className="flex flex-col gap-2.5">
                <a
                  href="tel:+49251999999"
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
                  <span className="inline-flex items-center gap-2.5">
                    <span aria-hidden>☎</span> Notfall · +49 251 [XXX 999]
                  </span>
                  <span>→</span>
                </a>
                <a
                  href="#kontakt"
                  className="inline-flex items-center justify-between gap-3 px-5 py-3 transition-all"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11.5px',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: '#f5f2eb',
                    border: '1px solid rgba(245,242,235,0.4)',
                    background: 'transparent',
                    borderRadius: '2px',
                    minHeight: '44px',
                  }}
                >
                  Termin anfragen
                  <span>→</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER STRIP */}
        <div
          className="mt-6 lg:mt-8 pt-4 flex items-center justify-between gap-4 flex-wrap"
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
            Außerhalb der Werkstattzeiten <span style={{ color: 'var(--color-accent)' }}>›</span>{' '}
            24/7 Notfallnummer
          </span>
          <span style={{ color: 'rgba(245,242,235,0.45)' }}>
            Termine ausserhalb auf Anfrage
          </span>
        </div>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.6); opacity: 0.6; }
        }
      `}</style>
    </section>
  )
}
