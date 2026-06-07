# KLARWERK — Gebäudereinigung Münster

Landing Page für eine fiktive Gebäudereinigungsfirma in Münster, NRW.
Design-Konzept: **Editorial Brutalism × Soft Morphism** (Option C).

## Stack

- Vite + React 19 + TypeScript
- Tailwind CSS v4 (mit `@theme` für Design-Tokens)
- GSAP + ScrollTrigger + SplitText (Animationen)
- Lenis (smoothes Scrollen)
- Framer Motion (Page/Section-Transitions)

## Setup

```bash
npm install
npm run dev    # http://localhost:5173
```

## Folder-Struktur

```
src/
├── sections/      # Eine Datei pro Landing-Page-Section
├── components/    # Wiederverwendbare UI-Bausteine
├── lib/           # Helper, Utils, Tokens-JS-Bridge
├── hooks/         # Custom React Hooks (z.B. useReducedMotion)
├── styles/
│   └── tokens.css # Alle Design-Tokens als @theme
├── App.tsx
└── main.tsx

public/
├── videos/        # Loop-Videos (Hero etc.)
└── images/        # Statische Bilder, Poster-Fallbacks
```

## Sections (Stand)

1. ⏳ Hero — Spec freigegeben, Code wartet auf Final-OK
2. ⬜ Über uns
3. ⬜ Leistungen
4. ⬜ Google Bewertungen
5. ⬜ Öffnungszeiten
6. ⬜ Kontakt (mit Termin-Buchung)
7. ⬜ Footer (DSGVO, Impressum, Datenschutz)

## Brand-Lock

- **Firma:** KLARWERK
- **Stadt:** Münster, NRW
- **Tel:** +49 251 [XXX XXXX] (Platzhalter)
- **Mail:** hallo@klarwerk.de (Platzhalter)
- **Gründung:** 2019 (Platzhalter)
