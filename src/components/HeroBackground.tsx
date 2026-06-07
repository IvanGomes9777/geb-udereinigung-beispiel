import { useEffect, useState } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

/**
 * Vollflächiger Foto-Hintergrund für den Hero — vier reale Architektur-Szenen
 * im Crossfade-Loop mit subtiler Ken-Burns-Bewegung.
 *
 * Scenes (je 4.5s sichtbar, 1.5s Crossfade):
 *  0 — Bürofoyer / Marmor + Glas
 *  1 — Klinikflur / sterile Perspektive
 *  2 — Altbau-Treppenhaus
 *  3 — Moderne Lobby / Empfangshalle
 *
 * Overlays von oben nach unten:
 *  - Photo (cover, scale 1 → 1.08 über Standzeit, Ken Burns)
 *  - Dunkles Vertikal-Gradient (für Text-Lesbarkeit)
 *  - Cream-Tint via multiply (Markenwärme behalten)
 *  - Filmkorn (SVG-Noise via data-URI)
 */

export type HeroScene = {
  key: string
  label: string
  url: string
}

export const HERO_SCENES: HeroScene[] = [
  {
    key: 'foyer',
    label: 'BÜROFOYER',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=2000&h=1300&fit=crop&q=72&auto=format',
  },
  {
    key: 'klinik',
    label: 'KLINIKFLUR',
    url: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=2000&h=1300&fit=crop&q=72&auto=format',
  },
  {
    key: 'treppenhaus',
    label: 'TREPPENHAUS',
    url: 'https://images.unsplash.com/photo-1564540583246-934409427776?w=2000&h=1300&fit=crop&q=72&auto=format',
  },
  {
    key: 'lobby',
    label: 'LOBBY',
    url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=2000&h=1300&fit=crop&q=72&auto=format',
  },
]

const SCENE_DURATION_MS = 4500

type Props = {
  onSceneChange?: (index: number, scene: HeroScene) => void
}

export function HeroBackground({ onSceneChange }: Props) {
  const [active, setActive] = useState(0)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const id = window.setInterval(() => {
      setActive((s) => (s + 1) % HERO_SCENES.length)
    }, SCENE_DURATION_MS)
    return () => window.clearInterval(id)
  }, [reduced])

  useEffect(() => {
    onSceneChange?.(active, HERO_SCENES[active])
  }, [active, onSceneChange])

  return (
    <div
      aria-hidden
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ backgroundColor: '#0a0a0a' }}
    >
      {/* Photo cycle */}
      {HERO_SCENES.map((scene, i) => (
        <img
          key={scene.key}
          src={scene.url}
          alt=""
          loading={i === 0 ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={i === 0 ? 'high' : 'low'}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: active === i ? 1 : 0,
            transform: active === i ? 'scale(1.08)' : 'scale(1.02)',
            transition: reduced
              ? 'none'
              : `opacity 1500ms cubic-bezier(0.25, 1, 0.5, 1), transform ${SCENE_DURATION_MS + 1500}ms linear`,
            willChange: 'opacity, transform',
          }}
        />
      ))}

      {/* Overlay 1: dunkles Vertikal-Gradient (Top + Bottom dunkler für Lesbarkeit) */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            180deg,
            rgba(14,14,14,0.55) 0%,
            rgba(14,14,14,0.30) 22%,
            rgba(14,14,14,0.25) 50%,
            rgba(14,14,14,0.55) 85%,
            rgba(14,14,14,0.80) 100%
          )`,
        }}
      />

      {/* Overlay 2: warmer Cream-Tint via multiply — gibt Marken-Wärme zurück */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(160deg, rgba(70,55,30,0.18) 0%, rgba(40,30,15,0.28) 100%)',
          mixBlendMode: 'multiply',
        }}
      />

      {/* Overlay 3: Filmkorn (kein extra HTTP-request — SVG-Noise als data-URI) */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='280' height='280'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.9 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Overlay 4: editoriale 12-Spalten-Linie sehr dezent in Cream */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(to right, var(--color-bg-base) 1px, transparent 1px)',
          backgroundSize: 'calc(100% / 12) 100%',
        }}
      />
    </div>
  )
}
