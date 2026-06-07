import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

/**
 * Vollflaechiger Hero-Hintergrund — vier Reflection-Study-Szenen im Crossfade-Cycle.
 *
 * Slot 0 BÜROFOYER  — Higgsfield Kling 3.0 (5s real video)
 * Slot 1 KLINIKFLUR — Unsplash photo (5s mit Ken-Burns Zoom)
 * Slot 2 TREPPENHAUS— Unsplash photo (5s mit Ken-Burns Zoom)
 * Slot 3 LOBBY      — Higgsfield Kling 3.0 (10s real video)
 *
 * Photo-Slots koennen jederzeit gegen Video-Slots getauscht werden, sobald
 * weitere Higgsfield-Renders verfuegbar sind — der Slot-Type Discriminator
 * unten ist die einzige Stelle, die anzupassen ist.
 *
 * Overlays (von unten nach oben):
 *  1. Media (Video/Photo)
 *  2. Dunkles Vertikal-Gradient (Text-Lesbarkeit)
 *  3. Cream-Multiply (Markenwaerme)
 *  4. Filmkorn (SVG-Noise via data-URI)
 *  5. Dezente 12-col Editorial-Linien
 */

export type HeroScene = {
  key: string
  label: string
}

type VideoSlot = HeroScene & {
  type: 'video'
  src: string
  poster?: string
  durationMs: number
}
type PhotoSlot = HeroScene & {
  type: 'photo'
  src: string
  durationMs: number
}
type Slot = VideoSlot | PhotoSlot

const SLOTS: Slot[] = [
  {
    key: 'foyer',
    label: 'BÜROFOYER',
    type: 'video',
    src: '/videos/foyer.mp4',
    poster:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=2000&h=1300&fit=crop&q=72&auto=format',
    durationMs: 5000,
  },
  {
    key: 'klinik',
    label: 'KLINIKFLUR',
    type: 'photo',
    src: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=2000&h=1300&fit=crop&q=75&auto=format',
    durationMs: 5000,
  },
  {
    key: 'treppenhaus',
    label: 'TREPPENHAUS',
    type: 'photo',
    src: 'https://images.unsplash.com/photo-1564540583246-934409427776?w=2000&h=1300&fit=crop&q=75&auto=format',
    durationMs: 5000,
  },
  {
    key: 'lobby',
    label: 'LOBBY',
    type: 'video',
    src: '/videos/lobby.mp4',
    poster:
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=2000&h=1300&fit=crop&q=72&auto=format',
    durationMs: 10000,
  },
]

export const HERO_SCENES: HeroScene[] = SLOTS.map(({ key, label }) => ({ key, label }))

type Props = {
  onSceneChange?: (index: number, scene: HeroScene) => void
}

export function HeroBackground({ onSceneChange }: Props) {
  const [active, setActive] = useState(0)
  const reduced = useReducedMotion()
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  // Cycle through slots — jede Szene hat ihre eigene durationMs
  useEffect(() => {
    if (reduced) return
    const id = window.setTimeout(() => {
      setActive((s) => (s + 1) % SLOTS.length)
    }, SLOTS[active].durationMs)
    return () => window.clearTimeout(id)
  }, [active, reduced])

  // Notify parent (eyebrow + footer-strip) ueber Szenen-Wechsel
  useEffect(() => {
    onSceneChange?.(active, SLOTS[active])
  }, [active, onSceneChange])

  // Video-Lifecycle: aktives Video startet von vorne + play(), andere pausieren
  useEffect(() => {
    SLOTS.forEach((slot, i) => {
      if (slot.type !== 'video') return
      const v = videoRefs.current[i]
      if (!v) return
      if (i === active) {
        try {
          v.currentTime = 0
        } catch {
          /* race condition wenn Video noch nicht ready */
        }
        v.play().catch(() => {
          /* autoplay-policy oder noch nicht ready */
        })
      } else {
        v.pause()
      }
    })
  }, [active])

  return (
    <div
      aria-hidden
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ backgroundColor: '#0a0a0a' }}
    >
      {SLOTS.map((slot, i) => {
        const isActive = active === i
        const commonStyle: React.CSSProperties = {
          opacity: isActive ? 1 : 0,
          transition: reduced
            ? 'none'
            : 'opacity 1500ms cubic-bezier(0.25, 1, 0.5, 1)',
          willChange: 'opacity, transform',
        }

        if (slot.type === 'video') {
          return (
            <video
              key={slot.key}
              ref={(el) => {
                videoRefs.current[i] = el
              }}
              src={slot.src}
              poster={slot.poster}
              loop
              muted
              playsInline
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                ...commonStyle,
                // sanfter Ken-Burns auch ueber Video, um Statik zu vermeiden
                transform: isActive ? 'scale(1.05)' : 'scale(1.02)',
                transitionProperty: 'opacity, transform',
                transitionDuration: `1500ms, ${slot.durationMs + 1500}ms`,
              }}
            />
          )
        }

        // photo slot — Ken-Burns Zoom synchron mit Slot-Dauer
        return (
          <img
            key={slot.key}
            src={slot.src}
            alt=""
            loading={i === 0 ? 'eager' : 'lazy'}
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              ...commonStyle,
              transform: isActive ? 'scale(1.08)' : 'scale(1.02)',
              transitionProperty: 'opacity, transform',
              transitionDuration: `1500ms, ${slot.durationMs + 1500}ms`,
            }}
          />
        )
      })}

      {/* Overlay 1: dunkles Vertikal-Gradient */}
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
