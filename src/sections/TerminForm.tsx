import { type FormEvent, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

const LEISTUNGEN = [
  { key: 'fassade', label: 'Fassaden- & Glasreinigung' },
  { key: 'buero', label: 'Büro- & Praxisreinigung' },
  { key: 'treppenhaus', label: 'Treppenhaus & Wohnanlagen' },
  { key: 'bauend', label: 'Bauend- & Grundreinigung' },
  { key: 'sonder', label: 'Sonderreinigung' },
  { key: 'industrie', label: 'Industrie- & Hallenreinigung' },
] as const

const KONTAKT_EMAIL = 'info@klarwerk-muenster.de'

export function TerminForm() {
  const sectionRef = useRef<HTMLElement>(null)
  const headRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const [services, setServices] = useState<Set<string>>(new Set())
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [consent, setConsent] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const toggleService = (key: string) => {
    setServices((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const serviceLabels = Array.from(services)
      .map((k) => LEISTUNGEN.find((l) => l.key === k)?.label)
      .filter(Boolean)
      .join(', ')

    const body = [
      'Termin-Anfrage über klarwerk-muenster.de',
      '',
      `Leistung(en): ${serviceLabels || '— keine Auswahl —'}`,
      `E-Mail: ${email}`,
      `Telefon: ${phone || '—'}`,
      '',
      'Nachricht:',
      message || '—',
      '',
      '— gesendet via Termin-Formular —',
    ].join('\n')

    const subject = `Termin-Anfrage${serviceLabels ? ` · ${serviceLabels}` : ''}`
    const mailto = `mailto:${KONTAKT_EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`

    // Oeffnet Mail-Client mit vorausgefuelltem Body
    window.location.href = mailto
    setSubmitted(true)
  }

  // Animationen — Scrub-Entrance fuer HEAD + Form-Card
  useEffect(() => {
    const sectionEl = sectionRef.current
    if (!sectionEl || reduced) return
    const ctx = gsap.context(() => {
      // Section rise
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

      const entranceTL = gsap.timeline({
        scrollTrigger: {
          trigger: sectionEl,
          start: 'top bottom',
          end: 'top 30%',
          scrub: 2,
        },
      })

      const headEls = headRef.current?.children
      if (headEls && headEls.length > 0) {
        entranceTL.fromTo(
          headEls,
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

      if (cardRef.current) {
        entranceTL.fromTo(
          cardRef.current,
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.5, ease: 'power3.out' },
          0.7
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
      id="termin"
      className="relative w-full overflow-hidden flex flex-col"
      style={{
        minHeight: '100dvh',
        backgroundColor: '#ece7d8',
      }}
    >
      {/* Atmospaeren */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 80% 0%, rgba(255,87,34,0.06) 0%, transparent 55%), radial-gradient(ellipse at 0% 100%, rgba(70,55,30,0.04) 0%, transparent 60%)',
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
          paddingTop: 'clamp(32px, 4vh, 64px)',
          paddingBottom: 'clamp(24px, 3vh, 48px)',
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
              N° 05 — TERMIN ANFRAGEN · IN 60 SEK
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
              ANTWORT &lt; 24 H · KOSTENFREI
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
            <span>Direkt anfragen.</span>
            <span
              style={{
                fontStyle: 'italic',
                fontWeight: 300,
                color: 'var(--color-ink-secondary)',
                fontVariationSettings: '"opsz" 144, "SOFT" 100, "WONK" 1',
              }}
            >
              Wir melden uns in den nächsten 24 Stunden.
            </span>
          </h2>
        </div>

        {/* FORM CARD */}
        <div
          ref={cardRef}
          className="flex-1 flex items-center mt-4 lg:mt-5"
          style={{ minHeight: 0 }}
        >
          <article
            className="relative w-full"
            style={{
              borderRadius: '4px',
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.25) 100%)',
              backdropFilter: 'blur(18px) saturate(160%)',
              WebkitBackdropFilter: 'blur(18px) saturate(160%)',
              border: '1px solid rgba(255,255,255,0.65)',
              boxShadow:
                'inset 0 1px 0 rgba(255,255,255,0.85), 0 24px 50px -28px rgba(14,14,14,0.18)',
              padding: 'clamp(16px, 2vw, 28px)',
            }}
          >
            {submitted ? (
              <SuccessState onReset={() => setSubmitted(false)} />
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                {/* STEP 1 — Leistungen */}
                <fieldset style={fieldsetStyle}>
                  <legend style={legendStyle}>
                    N° 01 · Welche Leistung?{' '}
                    <span style={hintStyle}>(Mehrfach möglich)</span>
                  </legend>
                  <div
                    className="grid grid-cols-2 sm:grid-cols-3 gap-2 lg:gap-3"
                    role="group"
                    aria-label="Leistungen auswählen"
                  >
                    {LEISTUNGEN.map((l) => {
                      const active = services.has(l.key)
                      return (
                        <button
                          key={l.key}
                          type="button"
                          onClick={() => toggleService(l.key)}
                          aria-pressed={active}
                          className="text-left transition-all"
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: 'clamp(11px, 0.85vw, 13px)',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            background: active
                              ? 'var(--color-ink-primary)'
                              : 'rgba(255,255,255,0.4)',
                            color: active
                              ? '#f5f2eb'
                              : 'var(--color-ink-primary)',
                            border: active
                              ? '1px solid var(--color-ink-primary)'
                              : '1px solid rgba(14,14,14,0.18)',
                            padding: '12px 14px',
                            borderRadius: '2px',
                            cursor: 'pointer',
                            transition:
                              'background 200ms ease, color 200ms ease, border-color 200ms ease, transform 220ms cubic-bezier(0.25,1,0.5,1)',
                          }}
                        >
                          <span
                            aria-hidden
                            style={{
                              display: 'inline-block',
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              marginRight: 8,
                              background: active
                                ? 'var(--color-accent)'
                                : 'transparent',
                              border: active
                                ? '1px solid var(--color-accent)'
                                : '1px solid currentColor',
                              verticalAlign: 'middle',
                              transition: 'background 200ms ease',
                            }}
                          />
                          {l.label}
                        </button>
                      )
                    })}
                  </div>
                </fieldset>

                {/* STEP 2 — Kontaktdaten */}
                <fieldset style={fieldsetStyle}>
                  <legend style={legendStyle}>
                    N° 02 · Wohin sollen wir uns melden?
                  </legend>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                    <FieldLabel label="E-Mail" required>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ihre@adresse.de"
                        autoComplete="email"
                        style={inputStyle}
                      />
                    </FieldLabel>
                    <FieldLabel label="Telefon" hint="optional">
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+49 …"
                        autoComplete="tel"
                        style={inputStyle}
                      />
                    </FieldLabel>
                  </div>
                </fieldset>

                {/* STEP 3 — Nachricht */}
                <fieldset style={fieldsetStyle}>
                  <legend style={legendStyle}>
                    N° 03 · Ihre Nachricht{' '}
                    <span style={hintStyle}>(Objekt, Umfang, Zeitrahmen)</span>
                  </legend>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Z. B.: Treppenhaus-Reinigung für 12-Parteien-Haus im Kreuzviertel, möglichst 14-tägig, Start ab Q3. Erstbesuch wäre gut."
                    rows={3}
                    style={{
                      ...inputStyle,
                      resize: 'vertical',
                      minHeight: '72px',
                      fontFamily: 'var(--font-body)',
                    }}
                  />
                </fieldset>

                {/* Consent — DSGVO Art. 6 Abs. 1 lit. a */}
                <label
                  className="flex items-start gap-3 mt-1 mb-3 cursor-pointer"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'clamp(12px, 0.85vw, 14px)',
                    lineHeight: 1.5,
                    color: 'var(--color-ink-secondary)',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    required
                    style={{
                      marginTop: 4,
                      width: 16,
                      height: 16,
                      accentColor: 'var(--color-accent)',
                      flexShrink: 0,
                    }}
                  />
                  <span>
                    Ich habe die{' '}
                    <a
                      href="#footer"
                      style={{
                        color: 'var(--color-ink-primary)',
                        textDecoration: 'underline',
                        textDecorationThickness: '1.5px',
                        textUnderlineOffset: '2px',
                      }}
                    >
                      Datenschutzerklärung
                    </a>{' '}
                    gelesen und stimme der Verarbeitung meiner Daten zur
                    Bearbeitung dieser Anfrage zu. Widerruf jederzeit möglich.
                  </span>
                </label>

                {/* SUBMIT */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <button
                    type="submit"
                    disabled={!email || !consent}
                    className="group inline-flex items-center justify-between gap-3 px-6 py-4 transition-all"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'clamp(12px, 0.95vw, 14px)',
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      background:
                        !email || !consent
                          ? 'rgba(14,14,14,0.25)'
                          : 'var(--color-ink-primary)',
                      color: '#f5f2eb',
                      borderRadius: '2px',
                      border: 'none',
                      minHeight: '56px',
                      cursor: !email || !consent ? 'not-allowed' : 'pointer',
                      flex: 1,
                    }}
                    onMouseEnter={(e) => {
                      if (!email || !consent) return
                      e.currentTarget.style.background = 'var(--color-accent)'
                    }}
                    onMouseLeave={(e) => {
                      if (!email || !consent) return
                      e.currentTarget.style.background =
                        'var(--color-ink-primary)'
                    }}
                  >
                    <span>Termin-Anfrage senden</span>
                    <span
                      aria-hidden
                      className="transition-transform group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </button>
                  <p
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: 'var(--color-ink-muted)',
                      margin: 0,
                      maxWidth: '24ch',
                      lineHeight: 1.5,
                    }}
                  >
                    Kostenfrei · Unverbindlich · Kein Newsletter
                  </p>
                </div>
              </form>
            )}
          </article>
        </div>

        {/* TRUST STRIP */}
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
          <span style={{ color: 'var(--color-ink-muted)' }}>
            Datenschutz
          </span>
          <div className="flex items-center flex-wrap gap-x-3 gap-y-1">
            <span>Keine Weitergabe</span>
            <span style={{ color: 'var(--color-ink-muted)' }}>·</span>
            <span>Nur Anfrage-Bearbeitung</span>
            <span style={{ color: 'var(--color-ink-muted)' }}>·</span>
            <span>Löschung nach Abschluss</span>
          </div>
          <span
            style={{ color: 'var(--color-ink-muted)' }}
            className="hidden md:inline"
          >
            ★ Antwort vom Inhaber
          </span>
        </div>
      </div>
    </section>
  )
}

// ---- helper components & styles ----

function FieldLabel({
  label,
  hint,
  required,
  children,
}: {
  label: string
  hint?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--color-ink-secondary)',
        }}
      >
        {label}
        {required && (
          <span style={{ color: 'var(--color-accent)', marginLeft: 4 }}>
            *
          </span>
        )}
        {hint && (
          <span
            style={{
              color: 'var(--color-ink-muted)',
              marginLeft: 8,
              fontSize: '9px',
            }}
          >
            ({hint})
          </span>
        )}
      </span>
      {children}
    </label>
  )
}

function SuccessState({ onReset }: { onReset: () => void }) {
  return (
    <div className="text-center py-6 lg:py-10">
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'var(--color-ink-muted)',
          margin: '0 0 12px 0',
        }}
      >
        Anfrage versendet
      </p>
      <h3
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(28px, 3vw, 56px)',
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
          color: 'var(--color-ink-primary)',
          margin: '0 0 16px 0',
          fontWeight: 500,
        }}
      >
        Danke, wir melden uns.
      </h3>
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(14px, 1vw, 17px)',
          lineHeight: 1.55,
          color: 'var(--color-ink-secondary)',
          maxWidth: '46ch',
          margin: '0 auto 20px',
        }}
      >
        Ihr Mail-Programm hat sich mit dem vorausgefüllten Termin-Antrag
        geöffnet. Falls nicht, schreiben Sie uns direkt an{' '}
        <a
          href={`mailto:${KONTAKT_EMAIL}`}
          style={{
            color: 'var(--color-ink-primary)',
            textDecoration: 'underline',
          }}
        >
          {KONTAKT_EMAIL}
        </a>
        .
      </p>
      <button
        type="button"
        onClick={onReset}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--color-ink-primary)',
          background: 'transparent',
          border: '1px solid rgba(14,14,14,0.3)',
          padding: '10px 18px',
          borderRadius: '2px',
          cursor: 'pointer',
        }}
      >
        Weitere Anfrage senden
      </button>
    </div>
  )
}

const fieldsetStyle: React.CSSProperties = {
  border: 'none',
  padding: 0,
  margin: '0 0 16px 0',
  minWidth: 0,
}

const legendStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '11px',
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  color: 'var(--color-ink-secondary)',
  margin: '0 0 10px 0',
  padding: 0,
}

const hintStyle: React.CSSProperties = {
  marginLeft: 8,
  color: 'var(--color-ink-muted)',
  fontSize: '9px',
  textTransform: 'none',
  letterSpacing: '0.05em',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  fontFamily: 'var(--font-body)',
  fontSize: 'clamp(14px, 1vw, 16px)',
  lineHeight: 1.5,
  color: 'var(--color-ink-primary)',
  background: 'rgba(255,255,255,0.55)',
  border: '1px solid rgba(14,14,14,0.18)',
  borderRadius: '2px',
  padding: '12px 14px',
  outline: 'none',
  transition: 'border-color 200ms ease, background 200ms ease',
}
