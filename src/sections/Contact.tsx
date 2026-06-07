import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

const SERVICES = [
  'Fassaden- & Glasreinigung',
  'Büro- & Praxisreinigung',
  'Treppenhaus & Wohnanlagen',
  'Bauend- & Grundreinigung',
  'Sonderreinigung',
  'Industrie- & Hallenreinigung',
  'Sonstiges',
] as const

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const sectionEl = sectionRef.current
    if (!sectionEl) return
    if (reduced) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-contact-fade]',
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.0,
          stagger: 0.1,
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

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Demo only — kein Backend angebunden.
    setSubmitted(true)
  }

  return (
    <section
      ref={sectionRef}
      id="kontakt"
      className="relative w-full overflow-hidden"
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
            'radial-gradient(ellipse at 10% 10%, rgba(255,87,34,0.06) 0%, transparent 55%), radial-gradient(ellipse at 90% 90%, rgba(110,180,210,0.05) 0%, transparent 60%)',
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
        className="relative mx-auto w-full px-6 lg:px-10 py-20 lg:py-24"
        style={{ maxWidth: 'var(--container-max)', zIndex: 2 }}
      >
        {/* HEAD */}
        <div data-contact-fade>
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
              N° 06 — KONTAKT · TERMIN ANFRAGEN
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
              Antwort werktags binnen 24 h
            </p>
          </div>

          <h2
            className="m-0 mb-10 lg:mb-14"
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
            <span>Schreib uns,</span>
            <span
              style={{
                fontStyle: 'italic',
                fontWeight: 300,
                color: 'var(--color-ink-secondary)',
                fontVariationSettings: '"opsz" 144, "SOFT" 100, "WONK" 1',
              }}
            >
              ruf an.
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
          {/* LEFT — FORM */}
          <div className="lg:col-span-7" data-contact-fade>
            <div
              style={{
                borderRadius: '4px',
                background: 'rgba(255,255,255,0.5)',
                backdropFilter: 'blur(18px) saturate(160%)',
                WebkitBackdropFilter: 'blur(18px) saturate(160%)',
                border: '1px solid rgba(255,255,255,0.6)',
                boxShadow:
                  'inset 0 1px 0 rgba(255,255,255,0.8), 0 24px 50px -28px rgba(14,14,14,0.18)',
                padding: 'clamp(20px, 2.4vw, 32px)',
              }}
            >
              {submitted ? (
                <div className="py-8 text-center">
                  <p
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                      color: 'var(--color-accent)',
                      margin: '0 0 12px 0',
                    }}
                  >
                    Anfrage angenommen
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(22px, 2.4vw, 32px)',
                      lineHeight: 1.15,
                      letterSpacing: '-0.025em',
                      color: 'var(--color-ink-primary)',
                      margin: 0,
                      fontWeight: 400,
                      fontStyle: 'italic',
                      fontVariationSettings: '"opsz" 144, "SOFT" 100, "WONK" 1',
                    }}
                  >
                    Danke. Wir melden uns binnen 24 Stunden bei dir.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-6"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: 'var(--color-ink-secondary)',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      textUnderlineOffset: '4px',
                    }}
                  >
                    Neue Anfrage stellen
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} noValidate>
                  <p
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                      color: 'var(--color-ink-secondary)',
                      margin: '0 0 18px 0',
                    }}
                  >
                    Anfrageformular
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Field id="name" label="Name *" required type="text" autoComplete="name" />
                    <Field id="company" label="Firma · Hausverwaltung" type="text" autoComplete="organization" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Field id="email" label="E-Mail *" required type="email" autoComplete="email" />
                    <Field id="phone" label="Telefon" type="tel" autoComplete="tel" />
                  </div>

                  <div className="mb-4">
                    <Label htmlFor="service">Leistung *</Label>
                    <select
                      id="service"
                      name="service"
                      required
                      defaultValue=""
                      style={inputStyle}
                    >
                      <option value="" disabled>
                        Bitte wählen…
                      </option>
                      {SERVICES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-5">
                    <Label htmlFor="message">Nachricht</Label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      placeholder="Objekt, Quadratmeter, gewünschter Termin…"
                      style={{
                        ...inputStyle,
                        resize: 'vertical',
                        minHeight: '96px',
                      }}
                    />
                  </div>

                  <label
                    className="flex items-start gap-3 mb-5"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '12px',
                      lineHeight: 1.45,
                      color: 'var(--color-ink-secondary)',
                    }}
                  >
                    <input
                      type="checkbox"
                      required
                      style={{
                        width: 16,
                        height: 16,
                        marginTop: 2,
                        accentColor: 'var(--color-accent)',
                        flexShrink: 0,
                      }}
                    />
                    <span>
                      Ich habe die <a href="#datenschutz" style={{ color: 'var(--color-ink-primary)', textDecoration: 'underline' }}>Datenschutzerklärung</a> gelesen und stimme der Verarbeitung meiner Daten zur Bearbeitung der Anfrage zu.
                    </span>
                  </label>

                  <button
                    type="submit"
                    className="group relative inline-flex items-center justify-between gap-3 px-6 py-4 overflow-hidden transition-transform active:scale-[0.99] w-full sm:w-auto"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12px',
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      backgroundColor: 'var(--color-ink-primary)',
                      color: 'var(--color-bg-base)',
                      borderRadius: '2px',
                      minHeight: '52px',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <span className="inline-flex items-center gap-3">
                      <span
                        aria-hidden
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: '50%',
                          border: '1px solid currentColor',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 12,
                        }}
                      >
                        ✦
                      </span>
                      Anfrage senden
                    </span>
                    <span className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* RIGHT — Kontakt-Karte mit Map */}
          <div className="lg:col-span-5 flex flex-col gap-6" data-contact-fade>
            {/* Kontakt-Block */}
            <div
              style={{
                borderRadius: '4px',
                background: 'rgba(255,255,255,0.5)',
                backdropFilter: 'blur(18px) saturate(160%)',
                WebkitBackdropFilter: 'blur(18px) saturate(160%)',
                border: '1px solid rgba(255,255,255,0.6)',
                boxShadow:
                  'inset 0 1px 0 rgba(255,255,255,0.8), 0 24px 50px -28px rgba(14,14,14,0.18)',
                padding: 'clamp(20px, 2.4vw, 32px)',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'var(--color-ink-secondary)',
                  margin: '0 0 18px 0',
                }}
              >
                Direkt
              </p>

              <div className="flex flex-col gap-3">
                <ContactLine
                  label="Telefon"
                  value="+49 251 [XXX XXXX]"
                  href="tel:+49251XXXXXXX"
                />
                <ContactLine
                  label="Notfall · 24/7"
                  value="+49 251 [XXX 999]"
                  href="tel:+49251999999"
                  accent
                />
                <ContactLine
                  label="E-Mail"
                  value="hallo@klarwerk.de"
                  href="mailto:hallo@klarwerk.de"
                />
                <ContactLine
                  label="Adresse"
                  value={'[Strasse 00]\n48143 Münster'}
                  multiline
                />
              </div>
            </div>

            {/* Map */}
            <div
              className="relative overflow-hidden"
              style={{
                borderRadius: '4px',
                aspectRatio: '4 / 3',
                border: '1px solid rgba(255,255,255,0.6)',
                boxShadow:
                  'inset 0 1px 0 rgba(255,255,255,0.8), 0 24px 50px -28px rgba(14,14,14,0.18)',
              }}
            >
              <iframe
                title="KLARWERK Standort Münster"
                src="https://www.openstreetmap.org/export/embed.html?bbox=7.5800%2C51.9300%2C7.7000%2C51.9900&layer=mapnik&marker=51.9607%2C7.6261"
                style={{
                  border: 0,
                  width: '100%',
                  height: '100%',
                  filter: 'grayscale(0.5) contrast(0.95) saturate(0.85)',
                }}
                loading="lazy"
              />
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(233,228,214,0.10) 0%, rgba(255,87,34,0.04) 100%)',
                  mixBlendMode: 'multiply',
                }}
              />
              <div
                className="absolute top-3 left-3 inline-flex items-center gap-2 px-2.5 py-1.5"
                style={{
                  background: 'rgba(255,255,255,0.85)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: '2px',
                  border: '1px solid rgba(14,14,14,0.1)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'var(--color-ink-primary)',
                }}
              >
                <span style={{ color: 'var(--color-accent)' }}>⌖</span>
                Münster · 51°57′N 7°37′E
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  fontFamily: 'var(--font-body)',
  fontSize: '15px',
  lineHeight: 1.5,
  color: 'var(--color-ink-primary)',
  background: 'rgba(255,255,255,0.7)',
  border: '1px solid rgba(14,14,14,0.15)',
  borderRadius: '2px',
  padding: '12px 14px',
  outline: 'none',
}

function Label({
  htmlFor,
  children,
}: {
  htmlFor?: string
  children: React.ReactNode
}) {
  return (
    <label
      htmlFor={htmlFor}
      style={{
        display: 'block',
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: 'var(--color-ink-secondary)',
        marginBottom: '6px',
      }}
    >
      {children}
    </label>
  )
}

function Field({
  id,
  label,
  type = 'text',
  required,
  autoComplete,
}: {
  id: string
  label: string
  type?: string
  required?: boolean
  autoComplete?: string
}) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        autoComplete={autoComplete}
        style={inputStyle}
      />
    </div>
  )
}

function ContactLine({
  label,
  value,
  href,
  accent,
  multiline,
}: {
  label: string
  value: string
  href?: string
  accent?: boolean
  multiline?: boolean
}) {
  const labelEl = (
    <span
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: accent ? 'var(--color-accent)' : 'var(--color-ink-secondary)',
        display: 'block',
        marginBottom: '2px',
      }}
    >
      {label}
    </span>
  )
  const valueEl = (
    <span
      style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(16px, 1.4vw, 19px)',
        letterSpacing: '-0.015em',
        color: 'var(--color-ink-primary)',
        fontWeight: 500,
        fontVariationSettings: '"opsz" 36',
        whiteSpace: multiline ? 'pre-line' : 'normal',
      }}
    >
      {value}
    </span>
  )

  return (
    <div
      className="py-2"
      style={{
        borderBottom: '1px solid rgba(14,14,14,0.08)',
      }}
    >
      {href ? (
        <a href={href} style={{ display: 'block', textDecoration: 'none' }}>
          {labelEl}
          {valueEl}
        </a>
      ) : (
        <>
          {labelEl}
          {valueEl}
        </>
      )}
    </div>
  )
}
