import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_ITEMS = [
  { label: 'Leistungen', href: '#leistungen' },
  { label: 'Über uns', href: '#ueber-uns' },
  { label: 'Bewertungen', href: '#bewertungen' },
  { label: 'Kontakt', href: '#kontakt' },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: scrolled ? 'rgba(239, 237, 231, 0.78)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
          borderBottom: scrolled
            ? '1px solid var(--color-line)'
            : '1px solid transparent',
        }}
      >
        <div className="mx-auto max-w-[1440px] px-6 lg:px-10 h-16 lg:h-20 flex items-center justify-between">
          <a
            href="#hero"
            className="font-bold tracking-[0.04em] text-sm lg:text-base"
            style={{
              fontFamily: 'var(--font-mono)',
              color: 'var(--color-ink-primary)',
            }}
          >
            KLARWERK
            <span
              className="ml-2 hidden sm:inline-block"
              style={{ color: 'var(--color-ink-muted)', fontWeight: 400 }}
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
                  color: 'var(--color-ink-secondary)',
                }}
              >
                {item.label}
              </a>
            ))}
            <a
              href="#termin"
              className="ml-4 inline-flex items-center gap-2 px-4 py-2 text-[12px] uppercase transition-all"
              style={{
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.12em',
                backgroundColor: 'var(--color-ink-primary)',
                color: 'var(--color-bg-base)',
                borderRadius: '2px',
              }}
            >
              Termin →
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
                  backgroundColor: 'var(--color-ink-primary)',
                  top: open ? '50%' : '0',
                  transform: open
                    ? 'translateY(-50%) rotate(45deg)'
                    : 'translateY(0) rotate(0)',
                }}
              />
              <span
                className="absolute left-0 right-0 h-[1.5px] transition-all duration-300"
                style={{
                  backgroundColor: 'var(--color-ink-primary)',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  opacity: open ? 0 : 1,
                }}
              />
              <span
                className="absolute left-0 right-0 h-[1.5px] transition-all duration-300"
                style={{
                  backgroundColor: 'var(--color-ink-primary)',
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
