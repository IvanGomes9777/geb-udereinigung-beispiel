import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_ITEMS = [
  { label: 'Leistungen', href: '#leistungen' },
  { label: 'Über uns', href: '#ueber-uns' },
  { label: 'Bewertungen', href: '#bewertungen' },
  { label: 'Kontakt', href: '#kontakt' },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const [terminHover, setTerminHover] = useState(false)

  // Header ist absolut positioniert ueber dem Hero — scrollt mit dem Hero weg.
  // Schrift immer cream (passt zum dunklen Photo-Hero).
  const fg = '#f5f2eb'
  const fgMuted = 'rgba(245,242,235,0.65)'

  return (
    <>
      <header
        className="absolute top-0 left-0 right-0 z-50"
        style={{
          backgroundColor: 'transparent',
        }}
      >
        <div
          className="mx-auto px-6 lg:px-10 h-16 lg:h-20 flex items-center justify-between"
          style={{ maxWidth: 'var(--container-max)' }}
        >
          <a
            href="#hero"
            className="font-bold tracking-[0.04em] text-sm lg:text-base transition-colors duration-300"
            style={{
              fontFamily: 'var(--font-mono)',
              color: fg,
              textShadow: '0 1px 4px rgba(0,0,0,0.4)',
            }}
          >
            KLARWERK
            <span
              className="ml-2 hidden sm:inline-block transition-colors duration-300"
              style={{ color: fgMuted, fontWeight: 400 }}
            >
              ✦ MÜNSTER
            </span>
          </a>

          <nav className="hidden lg:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-[13px] uppercase transition-colors hover:text-[color:var(--color-accent)]"
                style={{
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.12em',
                  color: fgMuted,
                  textShadow: '0 1px 4px rgba(0,0,0,0.4)',
                }}
              >
                {item.label}
              </a>
            ))}
            <a
              href="#termin"
              onMouseEnter={() => setTerminHover(true)}
              onMouseLeave={() => setTerminHover(false)}
              className="ml-4 inline-flex items-center gap-2 px-4 py-2 text-[12px] uppercase"
              style={{
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.12em',
                backgroundColor: terminHover ? 'var(--color-accent)' : '#f5f2eb',
                color: terminHover ? '#f5f2eb' : 'var(--color-ink-primary)',
                borderRadius: '2px',
                transform: terminHover ? 'translateY(-2px)' : 'translateY(0)',
                boxShadow: terminHover
                  ? '0 10px 22px -10px rgba(255,87,34,0.55)'
                  : '0 0 0 rgba(0,0,0,0)',
                transition:
                  'background-color 240ms cubic-bezier(0.25,1,0.5,1), color 240ms ease, transform 280ms cubic-bezier(0.25,1,0.5,1), box-shadow 280ms ease',
              }}
            >
              Termin
              <span
                aria-hidden
                className="inline-block"
                style={{
                  transform: terminHover ? 'translateX(4px)' : 'translateX(0)',
                  transition:
                    'transform 280ms cubic-bezier(0.25,1,0.5,1)',
                }}
              >
                →
              </span>
            </a>
          </nav>

          <button
            type="button"
            aria-label={open ? 'Menü schließen' : 'Menü öffnen'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden w-12 h-12 -mr-2 inline-flex items-center justify-center"
          >
            <div className="relative w-6 h-4">
              <span
                className="absolute left-0 right-0 h-[1.5px] transition-all duration-300"
                style={{
                  backgroundColor: fg,
                  top: open ? '50%' : '0',
                  transform: open
                    ? 'translateY(-50%) rotate(45deg)'
                    : 'translateY(0) rotate(0)',
                }}
              />
              <span
                className="absolute left-0 right-0 h-[1.5px] transition-all duration-300"
                style={{
                  backgroundColor: fg,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  opacity: open ? 0 : 1,
                }}
              />
              <span
                className="absolute left-0 right-0 h-[1.5px] transition-all duration-300"
                style={{
                  backgroundColor: fg,
                  bottom: open ? '50%' : '0',
                  transform: open
                    ? 'translateY(50%) rotate(-45deg)'
                    : 'translateY(0) rotate(0)',
                }}
              />
            </div>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
            style={{
              backgroundColor: 'rgba(239, 237, 231, 0.95)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <motion.div
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
              className="absolute inset-0 flex flex-col justify-center px-8"
            >
              <nav className="flex flex-col gap-1">
                {NAV_ITEMS.map((item, i) => (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{
                      delay: 0.15 + i * 0.06,
                      duration: 0.5,
                      ease: [0.25, 1, 0.5, 1],
                    }}
                    className="block py-3 border-b"
                    style={{
                      borderColor: 'var(--color-line)',
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(32px, 8vw, 48px)',
                      fontWeight: 400,
                      letterSpacing: '-0.02em',
                      lineHeight: 1.1,
                      color: 'var(--color-ink-primary)',
                    }}
                  >
                    {item.label}
                    <span
                      className="ml-3 inline-block"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        verticalAlign: 'middle',
                        color: 'var(--color-ink-muted)',
                      }}
                    >
                      N° 0{i + 2}
                    </span>
                  </motion.a>
                ))}

                <motion.a
                  href="#termin"
                  onClick={() => setOpen(false)}
                  initial={{ y: 16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="mt-8 inline-flex items-center justify-center gap-3 px-6 py-4 text-sm uppercase"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: '0.18em',
                    backgroundColor: 'var(--color-ink-primary)',
                    color: 'var(--color-bg-base)',
                    borderRadius: '2px',
                  }}
                >
                  Termin vereinbaren →
                </motion.a>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
