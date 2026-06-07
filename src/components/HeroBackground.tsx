import { useEffect, useState } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

/**
 * Vollflächiger Hero-Hintergrund: echtes 10-Sekunden cinematic Loop-Video
 * (Higgsfield / Kling 3.0 Pro) durchquert einen pristinen, polierten Architektur-Raum
 * mit Marmor-Reflexionen, Glasfassade und warmem Sonnenstrahl.
 *
 * Datei: public/videos/reflection-study.mp4 (~13 MB, 1080p H.264, autoplay-tauglich).
 *
 * Die dekorativen Szenen-Labels (Foyer / Klinik / Treppenhaus / Lobby) zyklen
 * unabhängig vom Video in 2.5s-Schritten — sie geben dem Editorial-Footer-Strip
 * seinen Rhythmus, sind aber keine wörtliche Abbildung der Video-Inhalte.
 *
 * Overlays (Reihenfolge unten -> oben):
 *  1. Video
 *  2. Dunkles Vertikal-Gradient für Text-Lesbarkeit
 *  3. Warmer Cream-Multiply-Tint für Markenwärme
 *  4. Filmkorn via SVG-Noise
 *  5. Dezente 12-Spalten-Linie (editorial)
 */

export type HeroScene = {
  key: string
  label: string
}

export const HERO_SCENES: HeroScene[] = [
  { key: 'foyer', label: 'BÜROFOYER' },
  { key: 'klinik', label: 'KLINIKFLUR' },
  { key: 'treppenhaus', label: 'TREPPENHAUS' },
  { key: 'lobby', label: 'LOBBY' },
]

const SCENE_DURATION_MS = 2500

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
      {/* Echtes cinematic Loop-Video */}
      <video
        src="/videos/reflection-study.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=2000&h=1300&fit=crop&q=72&auto=format"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ willChange: 'transform' }}
      />

      {/* Overlay 1: dunkles Vertikal-Gradient (Top + Bottom dunkler für Lesbarkeit) */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            180deg,
            rgba(14,14,14,0.58) 0%,
            rgba(14,14,14,0.32) 22%,
            rgba(14,14,14,0.28) 50%,
            rgba(14,14,14,0.58) 85%,
            rgba(14,14,14,0.82) 100%
          )`,
        }}
      />

      {/* Overlay 2: warmer Cream-Tint via multiply */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(160deg, rgba(70,55,30,0.20) 0%, rgba(40,30,15,0.30) 100%)',
          mixBlendMode: 'multiply',
        }}
      />

      {/* Overlay 3: Filmkorn */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='280' height='280'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.9 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Overlay 4: editoriale 12-col Linie */}
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
