import { Header } from './components/Header'
import { Hero } from './sections/Hero'
import { AboutUs } from './sections/AboutUs'
import { Services } from './sections/Services'
import { useSmoothScroll } from './hooks/useSmoothScroll'

export default function App() {
  useSmoothScroll()

  return (
    <>
      <Header />
      <main>
        <Hero />
        <AboutUs />
        <Services />
        {/* Placeholder for upcoming sections */}
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
            N° 04 — GOOGLE BEWERTUNGEN · in Vorbereitung
          </p>
        </section>
      </main>
    </>
  )
}
