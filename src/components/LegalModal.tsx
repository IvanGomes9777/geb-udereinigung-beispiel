import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { LegalSection } from '../data/legalContent'

type Props = {
  open: boolean
  onClose: () => void
  title: string
  lastUpdated: string
  sections: LegalSection[]
}

export function LegalModal({
  open,
  onClose,
  title,
  lastUpdated,
  sections,
}: Props) {
  const dialogRef = useRef<HTMLDivElement>(null)

  // ESC schliesst Modal + Body-Scroll-Lock waehrend Modal offen
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    // Initial focus auf Dialog fuer Screenreader
    requestAnimationFrame(() => dialogRef.current?.focus())
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-stretch justify-center"
          style={{
            backgroundColor: 'rgba(14, 13, 10, 0.65)',
            backdropFilter: 'blur(8px)',
          }}
          onClick={onClose}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="legal-modal-title"
            tabIndex={-1}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
            className="relative w-full overflow-y-auto"
            style={{
              maxWidth: '900px',
              margin: 'clamp(16px, 4vh, 64px) clamp(12px, 3vw, 32px)',
              background: 'var(--color-bg-base)',
              border: '1px solid rgba(14,14,14,0.12)',
              borderRadius: '4px',
              boxShadow: '0 40px 80px -32px rgba(0,0,0,0.55)',
              outline: 'none',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sticky header */}
            <div
              className="sticky top-0 flex items-baseline justify-between gap-4 px-6 py-4 lg:px-8"
              style={{
                background: 'var(--color-bg-base)',
                borderBottom: '1px solid rgba(14,14,14,0.1)',
                zIndex: 2,
              }}
            >
              <div>
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: 'var(--color-ink-muted)',
                    margin: 0,
                  }}
                >
                  Rechtliches · Stand {lastUpdated}
                </p>
                <h2
                  id="legal-modal-title"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(24px, 2.4vw, 40px)',
                    lineHeight: 1.1,
                    letterSpacing: '-0.025em',
                    color: 'var(--color-ink-primary)',
                    margin: '4px 0 0 0',
                    fontWeight: 500,
                  }}
                >
                  {title}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Schließen"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'var(--color-ink-primary)',
                  background: 'transparent',
                  border: '1px solid rgba(14,14,14,0.2)',
                  padding: '8px 14px',
                  cursor: 'pointer',
                  borderRadius: '2px',
                  flexShrink: 0,
                  transition: 'background 200ms ease, border-color 200ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(14,14,14,0.06)'
                  e.currentTarget.style.borderColor = 'rgba(14,14,14,0.4)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.borderColor = 'rgba(14,14,14,0.2)'
                }}
              >
                Schließen ✕
              </button>
            </div>

            {/* Content */}
            <div
              className="px-6 lg:px-8 py-6 lg:py-8"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(14px, 1vw, 16px)',
                lineHeight: 1.65,
                color: 'var(--color-ink-secondary)',
              }}
            >
              {sections.map((section, i) => (
                <section
                  key={i}
                  className="mb-6"
                  style={{ scrollMarginTop: '90px' }}
                >
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(16px, 1.3vw, 22px)',
                      lineHeight: 1.2,
                      letterSpacing: '-0.015em',
                      color: 'var(--color-ink-primary)',
                      margin: '0 0 10px 0',
                      fontWeight: 500,
                    }}
                  >
                    {section.heading}
                  </h3>
                  <div
                    style={{ color: 'var(--color-ink-secondary)' }}
                    className="legal-prose"
                  >
                    {section.body}
                  </div>
                </section>
              ))}

              {/* Footer note */}
              <p
                className="mt-8 pt-4"
                style={{
                  borderTop: '1px solid rgba(14,14,14,0.1)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--color-ink-muted)',
                  margin: 0,
                }}
              >
                KLARWERK Gebäudereinigung · Münster · Stand {lastUpdated}
              </p>
            </div>

            {/* Embedded styles for content links + lists */}
            <style>{`
              .legal-prose p { margin: 0 0 12px 0; }
              .legal-prose ul { margin: 8px 0 12px 18px; padding: 0; }
              .legal-prose li { margin-bottom: 4px; }
              .legal-prose a {
                color: var(--color-ink-primary);
                text-decoration: underline;
                text-decoration-color: rgba(255,87,34,0.5);
                text-decoration-thickness: 1.5px;
                text-underline-offset: 3px;
                transition: text-decoration-color 200ms ease, color 200ms ease;
              }
              .legal-prose a:hover {
                color: var(--color-accent);
                text-decoration-color: var(--color-accent);
              }
              .legal-prose strong { color: var(--color-ink-primary); font-weight: 500; }
            `}</style>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
