import { useEffect, useState } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

/**
 * 10-Sek Loop "Reflection Study" — vier wechselnde Innenraum-Szenen,
 * die als refraktierte Spiegelung in der Glas-Sculpture erscheinen.
 *
 * Szenen (je 2.5s sichtbar, 700ms Crossfade):
 *  0 — Bürofoyer (Marmor + Glas)
 *  1 — Krankenhausflur (sterile Linien)
 *  2 — Altbau-Treppenhaus (Holz)
 *  3 — Match-Cut zurück zum Foyer
 *
 * Drop-in für echtes Video: ersetze diesen Component durch
 *   <video autoPlay loop muted playsInline poster="/images/glass-poster.jpg">
 *     <source src="/videos/reflection-study.webm" type="video/webm" />
 *     <source src="/videos/reflection-study.mp4" type="video/mp4" />
 *   </video>
 * Aspect-Ratio & Border-Radius bleiben gleich.
 */

const SCENE_LABELS = ['BÜROFOYER', 'KLINIK', 'TREPPENHAUS', 'FOYER']
const STROKE = 'var(--color-ink-primary)'

function FoyerScene() {
  // Bürofoyer Marmor + Glas: Symmetrische vertikale Pillar-Lines + Horizon
  return (
    <g>
      {/* horizon / floor line */}
      <line x1="0" y1="115" x2="120" y2="115" stroke={STROKE} strokeWidth="0.5" />
      {/* marble floor reflection */}
      <line x1="0" y1="120" x2="120" y2="120" stroke={STROKE} strokeWidth="0.2" opacity="0.4" />
      <line x1="0" y1="128" x2="120" y2="128" stroke={STROKE} strokeWidth="0.2" opacity="0.3" />
      {/* pillars */}
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
      {/* ceiling beam */}
      <line x1="0" y1="35" x2="120" y2="35" stroke={STROKE} strokeWidth="0.4" />
      {/* small accent: reception desk silhouette */}
      <rect x="48" y="100" width="24" height="15" fill={STROKE} opacity="0.6" />
    </g>
  )
}

function ClinicScene() {
  // Krankenhausflur — perspektivische konvergierende Linien
  return (
    <g>
      {/* vanishing-point corridor */}
      <line x1="0" y1="20" x2="60" y2="80" stroke={STROKE} strokeWidth="0.5" />
      <line x1="120" y1="20" x2="60" y2="80" stroke={STROKE} strokeWidth="0.5" />
      <line x1="0" y1="140" x2="60" y2="80" stroke={STROKE} strokeWidth="0.5" />
      <line x1="120" y1="140" x2="60" y2="80" stroke={STROKE} strokeWidth="0.5" />
      {/* floor tile lines */}
      <line x1="20" y1="140" x2="55" y2="80" stroke={STROKE} strokeWidth="0.3" opacity="0.5" />
      <line x1="100" y1="140" x2="65" y2="80" stroke={STROKE} strokeWidth="0.3" opacity="0.5" />
      {/* door frames left */}
      <rect x="6" y="48" width="3" height="44" fill={STROKE} opacity="0.7" />
      <rect x="22" y="55" width="3" height="36" fill={STROKE} opacity="0.7" />
      {/* door frames right */}
      <rect x="111" y="48" width="3" height="44" fill={STROKE} opacity="0.7" />
      <rect x="95" y="55" width="3" height="36" fill={STROKE} opacity="0.7" />
      {/* end-of-corridor sign */}
      <rect x="55" y="65" width="10" height="6" fill={STROKE} opacity="0.5" />
    </g>
  )
}

function StaircaseScene() {
  // Altbau-Treppenhaus — diagonale Zickzack-Stufen + Geländer
  return (
    <g>
      {/* diagonal staircase steps */}
      <path
        d="M5 140 L25 140 L25 125 L45 125 L45 110 L65 110 L65 95 L85 95 L85 80 L105 80 L105 65 L120 65"
        stroke={STROKE}
        strokeWidth="0.7"
        fill="none"
      />
      {/* second flight (zigzag back) */}
      <path
        d="M120 65 L120 45 L100 45 L100 30 L80 30 L80 18"
        stroke={STROKE}
        strokeWidth="0.5"
        fill="none"
        opacity="0.6"
      />
      {/* banister rail */}
      <path
        d="M5 132 L25 132 L25 117 L45 117 L45 102 L65 102 L65 87 L85 87 L85 72 L105 72 L105 57 L120 57"
        stroke={STROKE}
        strokeWidth="0.3"
        fill="none"
        opacity="0.7"
      />
      {/* wall on left */}
      <rect x="0" y="0" width="3" height="160" fill={STROKE} opacity="0.8" />
      {/* wooden floor at top hint */}
      <line x1="0" y1="20" x2="80" y2="20" stroke={STROKE} strokeWidth="0.3" opacity="0.5" />
    </g>
  )
}

const SCENES = [<FoyerScene />, <ClinicScene />, <StaircaseScene />, <FoyerScene />]

export function ReflectionLoop() {
  const [active, setActive] = useState(0)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const id = window.setInterval(() => {
      setActive((s) => (s + 1) % SCENES.length)
    }, 2500)
    return () => window.clearInterval(id)
  }, [reduced])

  return (
    <>
      {/* the 4 scenes — all rendered, opacity toggled */}
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
        {/* persistent refraction lines (always visible) */}
        <line x1="20" y1="0" x2="80" y2="160" stroke={STROKE} strokeWidth="0.25" opacity="0.18" />
        <line x1="100" y1="0" x2="40" y2="160" stroke={STROKE} strokeWidth="0.25" opacity="0.14" />

        {SCENES.map((scene, i) => (
          <g
            key={i}
            style={{
              opacity: active === i ? 0.22 : 0,
              transition: 'opacity 700ms cubic-bezier(0.25, 1, 0.5, 1)',
            }}
          >
            {scene}
          </g>
        ))}
      </svg>

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
          color: 'var(--color-ink-secondary)',
          opacity: 0.55,
          transition: 'opacity 400ms ease',
        }}
      >
        REFL · {SCENE_LABELS[active]}
      </div>
    </>
  )
}
