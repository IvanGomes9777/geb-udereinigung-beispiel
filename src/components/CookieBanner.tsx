import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * DSGVO-konformer Cookie-Banner nach § 25 TDDDG:
 * - Essenzielle Cookies werden ohne Einwilligung gesetzt (technisch notwendig).
 * - Externe Dienste (z. B. Google Maps) brauchen aktive Opt-in-Einwilligung.
 * - Gleichwertige Buttons "Alle akzeptieren" / "Nur essenzielle" (keine Dark Patterns).
 * - Granulare Einstellungen ueber Toggle.
 * - Einwilligung wird in localStorage persistiert.
 * - Widerruf jederzeit ueber Footer-Link "Cookie-Einstellungen".
 */

const STORAGE_KEY = 'klarwerk-cookie-consent-v1'

export type ConsentState = {
  essential: true // immer true, nicht abwaehlbar
  externalMaps: boolean
  decidedAt: string // ISO timestamp
}

export const DEFAULT_CONSENT: ConsentState = {
  essential: true,
  externalMaps: false,
  decidedAt: '',
}

export function loadConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as ConsentState
    if (typeof parsed?.externalMaps !== 'boolean') return null
    return { ...parsed, essential: true }
  } catch {
    return null
  }
}

export function saveConsent(c: Omit<ConsentState, 'essential' | 'decidedAt'>) {
  if (typeof window === 'undefined') return
  const state: ConsentState = {
    essential: true,
    externalMaps: c.externalMaps,
    decidedAt: new Date().toISOString(),
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  window.dispatchEvent(new CustomEvent('klarwerk:consent-change', { detail: state }))
}

export function useConsent(): {
  consent: ConsentState | null
  setConsent: (c: Omit<ConsentState, 'essential' | 'decidedAt'>) => void
} {
  const [consent, setConsentState] = useState<ConsentState | null>(() => loadConsent())
  useEffect(() => {
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<ConsentState>).detail
      if (detail) setConsentState(detail)
    }
    window.addEventListener('klarwerk:consent-change', onChange as EventListener)
    return () =>
      window.removeEventListener('klarwerk:consent-change', onChange as EventListener)
  }, [])
  return {
    consent,
    setConsent: (c) => {
      saveConsent(c)
      setConsentState({
        essential: true,
        externalMaps: c.externalMaps,
        decidedAt: new Date().toISOString(),
      })
    },
  }
}

type Props = {
  forceOpen?: boolean
  onClose?: () => void
}

export function CookieBanner({ forceOpen, onClose }: Props) {
  const [visible, setVisible] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [externalMaps, setExternalMaps] = useState(false)

  useEffect(() => {
    if (forceOpen) {
      const current = loadConsent()
      setExternalMaps(current?.externalMaps ?? false)
      setVisible(true)
      setShowSettings(true)
      return
    }
    // Auto-show wenn noch keine Entscheidung gespeichert wurde
    const existing = loadConsent()
    if (!existing) setVisible(true)
  }, [forceOpen])

  const close = () => {
    setVisible(false)
    setShowSettings(false)
    onClose?.()
  }

  const acceptAll = () => {
    saveConsent({ externalMaps: true })
    close()
  }
  const rejectAll = () => {
    saveConsent({ externalMaps: false })
    close()
  }
  const saveSelection = () => {
    saveConsent({ externalMaps })
    close()
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
          role="dialog"
          aria-modal="false"
          aria-label="Cookie-Einstellungen"
          className="fixed bottom-0 left-0 right-0 z-[90]"
          style={{
            padding: 'clamp(12px, 2vw, 24px)',
          }}
        >
          <div
            className="mx-auto"
            style={{
              maxWidth: '1024px',
              background: 'var(--color-ink-primary)',
              color: '#f5f2eb',
              borderRadius: '4px',
              border: '1px solid rgba(245,242,235,0.18)',
              boxShadow: '0 30px 70px -28px rgba(0,0,0,0.55)',
              padding: 'clamp(20px, 2.5vw, 32px)',
            }}
          >
            {/* Header */}
            <div className="flex items-baseline justify-between gap-3 mb-3 flex-wrap">
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'rgba(245,242,235,0.6)',
                  margin: 0,
                }}
              >
                Cookies & Datenschutz · § 25 TDDDG
              </p>
              {forceOpen && (
                <button
                  type="button"
                  onClick={close}
                  aria-label="Schließen"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    letterSpacing: '0.18em',
                    color: 'rgba(245,242,235,0.7)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  ✕ Schließen
                </button>
              )}
            </div>

            {/* Body */}
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(18px, 1.5vw, 24px)',
                lineHeight: 1.2,
                letterSpacing: '-0.015em',
                color: '#f5f2eb',
                margin: '0 0 10px 0',
                fontWeight: 500,
              }}
            >
              Diese Website verwendet Cookies — Sie entscheiden, was wir laden.
            </h3>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(13px, 0.95vw, 15px)',
                lineHeight: 1.55,
                color: 'rgba(245,242,235,0.85)',
                margin: '0 0 16px 0',
              }}
            >
              Technisch notwendige Cookies setzen wir ohne Einwilligung — sie
              merken sich nur diese Auswahl. Externe Dienste wie die{' '}
              <strong style={{ color: '#f5f2eb' }}>Google-Maps-Karte</strong> im
              Bereich Kontakt laden wir <em>nur, wenn Sie zustimmen</em>. Mehr
              dazu in unserer Datenschutzerklärung.
            </p>

            {/* Granular settings */}
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ overflow: 'hidden' }}
                  className="mb-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Essential — always on, disabled */}
                    <div
                      className="flex items-start gap-3 p-3"
                      style={{
                        background: 'rgba(245,242,235,0.04)',
                        border: '1px solid rgba(245,242,235,0.12)',
                        borderRadius: '2px',
                      }}
                    >
                      <div
                        aria-hidden
                        style={{
                          width: 36,
                          height: 20,
                          borderRadius: '10px',
                          background: 'var(--color-accent)',
                          position: 'relative',
                          flexShrink: 0,
                          marginTop: 2,
                        }}
                      >
                        <span
                          style={{
                            position: 'absolute',
                            top: 2,
                            right: 2,
                            width: 16,
                            height: 16,
                            borderRadius: '50%',
                            background: '#f5f2eb',
                          }}
                        />
                      </div>
                      <div>
                        <p
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '11px',
                            letterSpacing: '0.16em',
                            textTransform: 'uppercase',
                            color: '#f5f2eb',
                            margin: 0,
                          }}
                        >
                          Essenziell · Pflicht
                        </p>
                        <p
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '12px',
                            lineHeight: 1.4,
                            color: 'rgba(245,242,235,0.7)',
                            margin: '4px 0 0 0',
                          }}
                        >
                          Cookie-Einstellung selbst, SSL-Sitzung. § 25 Abs. 2
                          TDDDG — keine Einwilligung erforderlich.
                        </p>
                      </div>
                    </div>

                    {/* External Maps toggle */}
                    <button
                      type="button"
                      onClick={() => setExternalMaps((v) => !v)}
                      className="text-left flex items-start gap-3 p-3 transition-colors"
                      style={{
                        background: 'rgba(245,242,235,0.04)',
                        border: '1px solid rgba(245,242,235,0.18)',
                        borderRadius: '2px',
                        cursor: 'pointer',
                      }}
                    >
                      <div
                        aria-hidden
                        style={{
                          width: 36,
                          height: 20,
                          borderRadius: '10px',
                          background: externalMaps
                            ? 'var(--color-accent)'
                            : 'rgba(245,242,235,0.2)',
                          position: 'relative',
                          flexShrink: 0,
                          marginTop: 2,
                          transition: 'background 200ms ease',
                        }}
                      >
                        <span
                          style={{
                            position: 'absolute',
                            top: 2,
                            left: externalMaps ? 'auto' : 2,
                            right: externalMaps ? 2 : 'auto',
                            width: 16,
                            height: 16,
                            borderRadius: '50%',
                            background: '#f5f2eb',
                            transition: 'all 200ms ease',
                          }}
                        />
                      </div>
                      <div>
                        <p
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '11px',
                            letterSpacing: '0.16em',
                            textTransform: 'uppercase',
                            color: '#f5f2eb',
                            margin: 0,
                          }}
                        >
                          Externe Karten · Google Maps
                        </p>
                        <p
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '12px',
                            lineHeight: 1.4,
                            color: 'rgba(245,242,235,0.7)',
                            margin: '4px 0 0 0',
                          }}
                        >
                          Lädt eingebettete Karte im Bereich Kontakt. Daten an
                          Google (Irland/USA — DPF-zertifiziert).
                        </p>
                      </div>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Buttons — gleichwertig, keine Dark Patterns */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-wrap">
              {showSettings ? (
                <button
                  type="button"
                  onClick={saveSelection}
                  className="flex-1"
                  style={btnStylePrimary}
                >
                  Auswahl speichern →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={acceptAll}
                  className="flex-1"
                  style={btnStylePrimary}
                >
                  Alle akzeptieren
                </button>
              )}
              <button
                type="button"
                onClick={rejectAll}
                className="flex-1"
                style={btnStyleSecondary}
              >
                Nur essenzielle
              </button>
              {!showSettings && (
                <button
                  type="button"
                  onClick={() => setShowSettings(true)}
                  style={btnStyleLink}
                >
                  Einstellungen
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const btnStylePrimary: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '12px',
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  background: '#f5f2eb',
  color: 'var(--color-ink-primary)',
  border: 'none',
  padding: '14px 20px',
  borderRadius: '2px',
  cursor: 'pointer',
  transition: 'background 200ms ease',
}
const btnStyleSecondary: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '12px',
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  background: 'transparent',
  color: '#f5f2eb',
  border: '1px solid rgba(245,242,235,0.5)',
  padding: '14px 20px',
  borderRadius: '2px',
  cursor: 'pointer',
  transition: 'background 200ms ease, border-color 200ms ease',
}
const btnStyleLink: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '11px',
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  background: 'transparent',
  color: 'rgba(245,242,235,0.7)',
  border: 'none',
  padding: '14px 8px',
  borderRadius: '2px',
  cursor: 'pointer',
  textDecoration: 'underline',
  textUnderlineOffset: '3px',
}
