export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      id="footer"
      className="relative w-full"
      style={{
        backgroundColor: '#0a0a0a',
        color: 'rgba(245,242,235,0.85)',
        borderTop: '1px solid rgba(245,242,235,0.06)',
      }}
    >
      {/* Hauptbereich */}
      <div
        className="mx-auto w-full px-6 lg:px-10 pt-16 lg:pt-24 pb-10"
        style={{ maxWidth: 'var(--container-max)' }}
      >
        {/* Top — Wortmarke + Claim */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 mb-12 lg:mb-16">
          <div className="lg:col-span-7">
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgba(245,242,235,0.55)',
                margin: '0 0 12px 0',
              }}
            >
              N° 07 — FOOTER · IMPRESSUM
            </p>
            <h3
              className="m-0"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(40px, 5vw, 180px)',
                lineHeight: 0.95,
                letterSpacing: '-0.04em',
                fontVariationSettings: '"opsz" 144, "SOFT" 50, "WONK" 1',
                color: '#f5f2eb',
                fontWeight: 400,
              }}
            >
              KLARWERK
              <span
                style={{
                  fontStyle: 'italic',
                  fontWeight: 300,
                  color: 'rgba(245,242,235,0.55)',
                  display: 'block',
                  fontVariationSettings: '"opsz" 144, "SOFT" 100, "WONK" 1',
                }}
              >
                Gebäudereinigung Münster.
              </span>
            </h3>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-end gap-4">
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(14px, 1vw, 16px)',
                lineHeight: 1.55,
                color: 'rgba(245,242,235,0.75)',
                margin: 0,
                maxWidth: '40ch',
              }}
            >
              Inhabergeführt. Eigene Mitarbeiter. Versichert. Seit 2019 in
              Münster und 30 km Umkreis.
            </p>
            <a
              href="#kontakt"
              className="inline-flex items-center gap-3 self-start"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#f5f2eb',
                borderBottom: '1px solid rgba(245,242,235,0.5)',
                paddingBottom: '2px',
              }}
            >
              Termin anfragen →
            </a>
          </div>
        </div>

        {/* Spalten */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-10 mb-12 lg:mb-16">
          <FooterCol title="Kontakt">
            <FooterLink href="tel:+49251XXXXXXX">+49 251 [XXX XXXX]</FooterLink>
            <FooterLink href="mailto:hallo@klarwerk.de">
              hallo@klarwerk.de
            </FooterLink>
            <FooterText>
              [Strasse 00]
              <br />
              48143 Münster
            </FooterText>
          </FooterCol>

          <FooterCol title="Leistungen">
            <FooterLink href="#leistungen">Fassaden & Glas</FooterLink>
            <FooterLink href="#leistungen">Büro & Praxis</FooterLink>
            <FooterLink href="#leistungen">Treppenhaus</FooterLink>
            <FooterLink href="#leistungen">Bauend & Grund</FooterLink>
            <FooterLink href="#leistungen">Sonderreinigung</FooterLink>
            <FooterLink href="#leistungen">Industrie</FooterLink>
          </FooterCol>

          <FooterCol title="Unternehmen">
            <FooterLink href="#ueber-uns">Über uns</FooterLink>
            <FooterLink href="#bewertungen">Bewertungen</FooterLink>
            <FooterLink href="#oeffnungszeiten">Öffnungszeiten</FooterLink>
            <FooterLink href="#kontakt">Kontakt & Termin</FooterLink>
          </FooterCol>

          <FooterCol title="Rechtliches">
            <FooterLink href="#impressum">Impressum</FooterLink>
            <FooterLink href="#datenschutz">Datenschutzerklärung</FooterLink>
            <FooterLink href="#agb">AGB</FooterLink>
            <FooterLink href="#cookies">Cookie-Einstellungen</FooterLink>
          </FooterCol>
        </div>

        {/* IMPRESSUM-Block */}
        <div
          id="impressum"
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 pt-10"
          style={{ borderTop: '1px solid rgba(245,242,235,0.10)' }}
        >
          <div>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgba(245,242,235,0.5)',
                margin: '0 0 12px 0',
              }}
            >
              Impressum
            </p>
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                lineHeight: 1.6,
                color: 'rgba(245,242,235,0.72)',
              }}
            >
              <strong style={{ color: '#f5f2eb' }}>
                KLARWERK Gebäudereinigung
              </strong>
              <br />
              [Inhaber-Vor- &amp; Nachname], Inhaber
              <br />
              [Strasse 00], 48143 Münster
              <br />
              Telefon: +49 251 [XXX XXXX]
              <br />
              E-Mail: hallo@klarwerk.de
              <br />
              <br />
              USt-IdNr.: DE [123 456 789]
              <br />
              Handwerksrolle: HWK Münster, Nr. [XXX/XXX]
              <br />
              Berufsbezeichnung: Gebäudereiniger (Deutschland)
              <br />
              Aufsichtsbehörde: HWK Münster, Bismarckallee 1, 48151 Münster
            </div>
          </div>

          <div id="datenschutz">
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgba(245,242,235,0.5)',
                margin: '0 0 12px 0',
              }}
            >
              Datenschutz · Kurzfassung
            </p>
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                lineHeight: 1.6,
                color: 'rgba(245,242,235,0.72)',
              }}
            >
              Verantwortlich: [Inhaber-Name], Anschrift wie Impressum.
              <br />
              Wir verarbeiten personenbezogene Daten gemäß DSGVO und BDSG
              ausschließlich zur Anfrage- und Auftragsabwicklung.
              <br />
              Externe Dienste: OpenStreetMap (Kartenanzeige), Google Fonts
              (Schriftarten — selbst gehostet möglich), Unsplash (Bilder).
              <br />
              Cookies werden nur nach ausdrücklicher Einwilligung gesetzt.
              <br />
              Auskunfts-, Löschungs- und Widerspruchsrechte: hallo@klarwerk.de
              <br />
              <br />
              <a
                href="#datenschutz-volltext"
                style={{
                  color: '#f5f2eb',
                  textDecoration: 'underline',
                  textUnderlineOffset: '3px',
                }}
              >
                → Vollständige Datenschutzerklärung
              </a>
            </div>
          </div>
        </div>

        {/* Trust-Strip */}
        <div
          className="mt-10 lg:mt-14 pt-6 flex items-center justify-between flex-wrap gap-4"
          style={{
            borderTop: '1px solid rgba(245,242,235,0.10)',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(245,242,235,0.5)',
          }}
        >
          <span>
            DIN ISO 9001 · TÜV-Reinigungsmittel · BGN-versichert · HWK Münster ·
            EU-DSGVO
          </span>
          <span>51°57′N · 7°37′E</span>
        </div>
      </div>

      {/* Bottom-Bar */}
      <div
        style={{
          borderTop: '1px solid rgba(245,242,235,0.08)',
          background: 'rgba(0,0,0,0.35)',
        }}
      >
        <div
          className="mx-auto w-full px-6 lg:px-10 py-5 flex items-center justify-between flex-wrap gap-3"
          style={{
            maxWidth: 'var(--container-max)',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(245,242,235,0.45)',
          }}
        >
          <span>
            © {year} KLARWERK Gebäudereinigung · Münster
          </span>
          <span>
            Made in Münster <span style={{ color: 'var(--color-accent)' }}>·</span> KLARWERK 2019—{year}
          </span>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div>
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'rgba(245,242,235,0.55)',
          margin: '0 0 14px 0',
        }}
      >
        {title}
      </p>
      <ul
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {children}
      </ul>
    </div>
  )
}

function FooterLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <li>
      <a
        href={href}
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '14px',
          color: 'rgba(245,242,235,0.85)',
          textDecoration: 'none',
          transition: 'color 200ms',
        }}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLAnchorElement).style.color = '#f5f2eb'
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLAnchorElement).style.color =
            'rgba(245,242,235,0.85)'
        }}
      >
        {children}
      </a>
    </li>
  )
}

function FooterText({ children }: { children: React.ReactNode }) {
  return (
    <li
      style={{
        fontFamily: 'var(--font-body)',
        fontSize: '14px',
        lineHeight: 1.5,
        color: 'rgba(245,242,235,0.7)',
      }}
    >
      {children}
    </li>
  )
}
