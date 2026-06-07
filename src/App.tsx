import { Header } from './components/Header'
import { Hero } from './sections/Hero'
import { useSmoothScroll } from './hooks/useSmoothScroll'

export default function App() {
  useSmoothScroll()

  return (
    <>
      <Header />
      <main>
        <Hero />
        {/* Placeholder area to allow scroll past hero */}
        <section
          aria-hidden
          style={{
            minHeight: '40vh',
            background: 'var(--color-bg-base)',
            borderTop: '1px solid var(--color-line)',
            display: 'grid',
            placeItems: 'center',
            padding: '4rem 1.5rem',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--color-ink-muted)',
              textAlign: 'center',
            }}
          >
            N° 02 — ÜBER UNS · in Vorbereitung · wartet auf Layout-Freigabe
          </p>
        </section>
      </main>
    </>
  )
}
