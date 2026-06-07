export default function App() {
  return (
    <main className="min-h-dvh flex items-center justify-center px-6">
      <div className="max-w-xl text-center">
        <p
          className="text-[11px] uppercase"
          style={{
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.18em',
            color: 'var(--color-ink-secondary)',
          }}
        >
          KLARWERK · MÜNSTER · ANNO 2019
        </p>

        <h1
          className="mt-8 leading-[0.92]"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(48px, 10vw, 96px)',
            letterSpacing: '-0.04em',
            color: 'var(--color-ink-primary)',
            fontWeight: 400,
          }}
        >
          Projekt-Setup bereit.
        </h1>

        <p
          className="mt-6 text-base sm:text-lg"
          style={{ color: 'var(--color-ink-secondary)' }}
        >
          Vite + React 19 + Tailwind v4 + GSAP + Lenis + Framer Motion installiert.
          Warte auf Freigabe der Hero-Spec, dann startet Section 1.
        </p>

        <div
          className="mt-10 inline-flex items-center gap-2 px-4 py-2 rounded-full"
          style={{
            background: 'var(--color-glass-tint)',
            border: '1px solid var(--color-glass-border)',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--color-ink-secondary)',
          }}
        >
          <span
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{ background: 'var(--color-accent)' }}
          />
          Status: Ready for Hero
        </div>
      </div>
    </main>
  )
}
