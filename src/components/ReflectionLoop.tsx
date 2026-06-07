import { useEffect, useState, type ReactNode } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

/**
 * 10-Sek Loop "Reflection Study" — vier wechselnde Innenraum-Fotos,
 * die als refraktierte Spiegelung in der Glas-Sculpture erscheinen.
 *
 * Szenen (je 2.5s sichtbar, 700ms Crossfade):
 *  0 — Bürofoyer / Marmor
 *  1 — Klinikflur / Perspektive
 *  2 — Altbau-Treppenhaus
 *  3 — Moderne Lobby (Match-Cut zurück)
 *
 * Realistik-Strategie:
 *  - Echte Architektur-Fotos via Unsplash (production CDN)
 *  - Pro Szene ein SVG-Fallback unter dem Foto: lädt das Foto nicht,
 *    bleibt die stilisierte Silhouette sichtbar
 *  - Fotos sind in mix-blend-mode "luminosity" eingebettet — Farben der
 *    Glas-Sculpture bleiben dominant, das Foto liefert Helligkeitsstruktur
 */

type Scene = {
  label: string
  photo: string
  fallback: ReactNode
}

const STROKE = 'var(--color-ink-primary)'

function FoyerFallback() {
  return (
    <g>
      <line x1="0" y1="115" x2="120" y2="115" stroke={STROKE} strokeWidth="0.5" />
      <line x1="0" y1="120" x2="120" y2="120" stroke={STROKE} strokeWidth="0.2" opacity="0.4" />
      <line x1="0" y1="128" x2="120" y2="128" stroke={STROKE} strokeWidth="0.2" opacity="0.3" />
      {[20, 45, 75, 100].map((x, i) => (
        <rect
          key={i}
          x={x - 3}
          y={i === 1 || i === 2 ? 35 : 40}
          width="6"
          height={i === 1 || i === 2 ? 80 : 75}
          fill={STROKE}
          opacity="0.85"
        />
      ))}
      <line x1="0" y1="35" x2="120" y2="35" stroke={STROKE} strokeWidth="0.4" />
      <rect x="48" y="100" width="24" height="15" fill={STROKE} opacity="0.6" />
    </g>
  )
}

function ClinicFallback() {
  return (
    <g>
      <line x1="0" y1="20" x2="60" y2="80" stroke={STROKE} strokeWidth="0.5" />
      <line x1="120" y1="20" x2="60" y2="80" stroke={STROKE} strokeWidth="0.5" />
      <line x1="0" y1="140" x2="60" y2="80" stroke={STROKE} strokeWidth="0.5" />
      <line x1="120" y1="140" x2="60" y2="80" stroke={STROKE} strokeWidth="0.5" />
      <rect x="6" y="48" width="3" height="44" fill={STROKE} opacity="0.7" />
      <rect x="22" y="55" width="3" height="36" fill={STROKE} opacity="0.7" />
      <rect x="111" y="48" width="3" height="44" fill={STROKE} opacity="0.7" />
      <rect x="95" y="55" width="3" height="36" fill={STROKE} opacity="0.7" />
      <rect x="55" y="65" width="10" height="6" fill={STROKE} opacity="0.5" />
    </g>
  )
}

function StaircaseFallback() {
  return (
    <g>
      <path
        d="M5 140 L25 140 L25 125 L45 125 L45 110 L65 110 L65 95 L85 95 L85 80 L105 80 L105 65 L120 65"
        stroke={STROKE}
        strokeWidth="0.7"
        fill="none"
      />
      <path
        d="M120 65 L120 45 L100 45 L100 30 L80 30 L80 18"
        stroke={STROKE}
        strokeWidth="0.5"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M5 132 L25 132 L25 117 L45 117 L45 102 L65 102 L65 87 L85 87 L85 72 L105 72 L105 57 L120 57"
        stroke={STROKE}
        strokeWidth="0.3"
        fill="none"
        opacity="0.7"
      />
      <rect x="0" y="0" width="3" height="160" fill={STROKE} opacity="0.8" />
    </g>
  )
}

function LobbyFallback() {
  return (
    <g>
      <line x1="0" y1="100" x2="120" y2="100" stroke={STROKE} strokeWidth="0.5" />
      <line x1="0" y1="120" x2="120" y2="120" stroke={STROKE} strokeWidth="0.2" opacity="0.5" />
      <rect x="15" y="30" width="4" height="70" fill={STROKE} opacity="0.85" />
      <rect x="40" y="20" width="4" height="80" fill={STROKE} opacity="0.85" />
      <rect x="76" y="20" width="4" height="80" fill={STROKE} opacity="0.85" />
      <rect x="101" y="30" width="4" height="70" fill={STROKE} opacity="0.85" />
      <line x1="0" y1="20" x2="120" y2="20" stroke={STROKE} strokeWidth="0.4" />
      <rect x="44" y="85" width="32" height="15" fill={STROKE} opacity="0.5" />
    </g>
  )
}

/**
 * Echte Unsplash-Fotos, vertical-crop auf 3:4 Aspect.
 * Stable Production-CDN URLs.
 */
const SCENES: Scene[] = [
  {
    label: 'BÜROFOYER',
    photo:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=560&fit=crop&q=70&auto=format',
    fallback: <FoyerFallback />,
  },
  {
    label: 'KLINIK',
    photo:
      'https://images.unsplash.com/photo-1551076805-e1869033e561?w=400&h=560&fit=crop&q=70&auto=format',
    fallback: <ClinicFallback />,
  },
  {
    label: 'TREPPENHAUS',
    photo:
      'https://images.unsplash.com/photo-1564540583246-934409427776?w=400&h=560&fit=crop&q=70&auto=format',
    fallback: <StaircaseFallback />,
  },
  {
    label: 'LOBBY',
    photo:
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&h=560&fit=crop&q=70&auto=format',
    fallback: <LobbyFallback />,
  },
]

export function ReflectionLoop() {
  const [active, setActive] = useState(0)
  const [photoLoaded, setPhotoLoaded] = useState<boolean[]>(() =>
    new Array(SCENES.length).fill(false)
  )
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const id = window.setInterval(() => {
      setActive((s) => (s + 1) % SCENES.length)
    }, 2500)
    return () => window.clearInterval(id)
  }, [reduced])

  const onPhotoLoad = (i: number) => {
    setPhotoLoaded((prev) => {
      if (prev[i]) return prev
      const next = [...prev]
      next[i] = true
      return next
    })
  }

  return (
    <>
      {/* SVG-Fallback-Schicht (immer da, falls Foto nicht lädt) */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 120 160"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        style={{
          mixBlendMode: 'multiply',
          borderRadius: 'inherit',
          pointerEvents: 'none',
        }}
      >
        {/* persistent refraction lines */}
        <line x1="20" y1="0" x2="80" y2="160" stroke={STROKE} strokeWidth="0.25" opacity="0.18" />
        <line x1="100" y1="0" x2="40" y2="160" stroke={STROKE} strokeWidth="0.25" opacity="0.14" />

        {SCENES.map((scene, i) => (
          <g
            key={i}
            style={{
              opacity: active === i && !photoLoaded[i] ? 0.22 : 0,
              transition: 'opacity 700ms cubic-bezier(0.25, 1, 0.5, 1)',
            }}
          >
            {scene.fallback}
          </g>
        ))}
      </svg>

      {/* Echtes-Foto-Schicht — bevorzugt sichtbar, sobald geladen */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ borderRadius: 'inherit', pointerEvents: 'none' }}
      >
        {SCENES.map((scene, i) => (
          <img
            key={i}
            src={scene.photo}
            alt=""
            loading={i === 0 ? 'eager' : 'lazy'}
            decoding="async"
            onLoad={() => onPhotoLoad(i)}
            onError={() => {
              /* belasse photoLoaded[i] = false, dann übernimmt SVG-Fallback */
            }}
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              opacity: active === i && photoLoaded[i] ? 0.62 : 0,
              transition: 'opacity 700ms cubic-bezier(0.25, 1, 0.5, 1)',
              mixBlendMode: 'luminosity',
              filter: 'contrast(1.1) brightness(0.95)',
              borderRadius: 'inherit',
            }}
          />
        ))}
      </div>

      {/* scene-name label (Mono, bottom-left of glass) */}
      <div
        className="absolute"
        aria-hidden
        style={{
          bottom: 14,
          left: 14,
          fontFamily: 'var(--font-mono)',
          fontSize: '8px',
          letterSpacing: '0.22em',
          color: 'var(--color-ink-primary)',
          opacity: 0.7,
          transition: 'opacity 400ms ease',
          zIndex: 2,
          mixBlendMode: 'multiply',
        }}
      >
        REFL · {SCENES[active].label}
      </div>
    </>
  )
}
