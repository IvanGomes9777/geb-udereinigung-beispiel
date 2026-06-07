/**
 * Rechtliche Pflichtinhalte fuer KLARWERK Gebaeudereinigung
 *
 * Rechtsgrundlagen:
 * - § 5 DDG (Digitale-Dienste-Gesetz, ersetzt § 5 TMG seit 14.05.2024)
 * - Art. 13 DSGVO (Informationspflichten bei Erhebung)
 * - § 25 TDDDG (vormals TTDSG) — Cookies & Tracker
 * - HwO Anlage A — Gebaeudereiniger ist zulassungspflichtiges Handwerk
 *
 * Alle [Platzhalter] muss der Inhaber vor Live-Gang ausfuellen.
 */

import type { ReactNode } from 'react'

export type LegalSection = {
  heading: string
  body: ReactNode
}

export const IMPRESSUM: { title: string; lastUpdated: string; sections: LegalSection[] } = {
  title: 'Impressum',
  lastUpdated: 'Juni 2026',
  sections: [
    {
      heading: 'Anbieter nach § 5 DDG',
      body: (
        <>
          <p>
            <strong>[Inhaber-Vorname Inhaber-Nachname]</strong>
            <br />
            KLARWERK Gebäudereinigung
            <br />
            [Straße, Hausnummer]
            <br />
            48[XXX] Münster
          </p>
        </>
      ),
    },
    {
      heading: 'Kontakt',
      body: (
        <>
          <p>
            Telefon: +49 251 [XXX XXXX]
            <br />
            E-Mail:{' '}
            <a href="mailto:info@klarwerk-muenster.de">info@klarwerk-muenster.de</a>
          </p>
        </>
      ),
    },
    {
      heading: 'Berufsrechtliche Angaben',
      body: (
        <>
          <p>
            <strong>Berufsbezeichnung:</strong> Gebäudereiniger
            <br />
            <strong>Verliehen in:</strong> Bundesrepublik Deutschland
          </p>
          <p>
            <strong>Zuständige Kammer / Aufsicht:</strong>
            <br />
            Handwerkskammer Münster
            <br />
            Bismarckallee 1, 48151 Münster
            <br />
            <a
              href="https://www.hwk-muenster.de"
              target="_blank"
              rel="noopener noreferrer"
            >
              www.hwk-muenster.de
            </a>
          </p>
          <p>
            <strong>Eintragung:</strong> Handwerksrolle der HWK Münster
            <br />
            <strong>Eintragungs-Nr.:</strong> [HWK-Nr.]
          </p>
          <p>
            <strong>Berufsrechtliche Regelungen:</strong> Handwerksordnung (HwO),
            Anlage A (zulassungspflichtige Handwerke).
            <br />
            Einsehbar unter{' '}
            <a
              href="https://www.gesetze-im-internet.de/hwo/"
              target="_blank"
              rel="noopener noreferrer"
            >
              gesetze-im-internet.de/hwo
            </a>
            .
          </p>
        </>
      ),
    },
    {
      heading: 'Umsatzsteuer-Identifikationsnummer',
      body: (
        <p>
          Umsatzsteuer-ID gemäß § 27a UStG: <strong>DE[XXXXXXXXX]</strong>
        </p>
      ),
    },
    {
      heading: 'Verantwortlich für den Inhalt nach § 18 II MStV',
      body: (
        <p>
          [Inhaber-Vorname Inhaber-Nachname]
          <br />
          Anschrift wie oben.
        </p>
      ),
    },
    {
      heading: 'Verbraucherstreitbeilegung / Universalschlichtungsstelle',
      body: (
        <p>
          Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor
          einer Verbraucherschlichtungsstelle teilzunehmen (§ 36 Abs. 1 Nr. 1 VSBG).
        </p>
      ),
    },
    {
      heading: 'EU-Streitschlichtungsplattform',
      body: (
        <p>
          Die Europäische Kommission stellt eine Plattform zur
          Online-Streitbeilegung (OS) bereit:{' '}
          <a
            href="https://ec.europa.eu/consumers/odr/"
            target="_blank"
            rel="noopener noreferrer"
          >
            ec.europa.eu/consumers/odr/
          </a>
          .
          <br />
          Unsere E-Mail-Adresse finden Sie oben im Impressum.
        </p>
      ),
    },
    {
      heading: 'Haftungsausschluss',
      body: (
        <>
          <p>
            <strong>Haftung für Inhalte:</strong> Als Diensteanbieter sind wir
            gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach den
            allgemeinen Gesetzen verantwortlich. Nach §§ 8 – 10 DDG sind wir
            jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
            Informationen zu überwachen.
          </p>
          <p>
            <strong>Haftung für Links:</strong> Unser Angebot enthält Links zu
            externen Websites Dritter, auf deren Inhalte wir keinen Einfluss
            haben. Eine permanente inhaltliche Kontrolle ist ohne konkrete
            Anhaltspunkte einer Rechtsverletzung nicht zumutbar.
          </p>
          <p>
            <strong>Urheberrecht:</strong> Die durch die Seitenbetreiber
            erstellten Inhalte und Werke auf diesen Seiten unterliegen dem
            deutschen Urheberrecht.
          </p>
        </>
      ),
    },
  ],
}

export const DATENSCHUTZ: {
  title: string
  lastUpdated: string
  sections: LegalSection[]
} = {
  title: 'Datenschutzerklärung',
  lastUpdated: 'Juni 2026',
  sections: [
    {
      heading: '1. Datenschutz auf einen Blick',
      body: (
        <>
          <p>
            <strong>Allgemeine Hinweise.</strong> Die folgenden Hinweise geben
            einen einfachen Überblick darüber, was mit Ihren personenbezogenen
            Daten passiert, wenn Sie diese Website besuchen. Personenbezogene
            Daten sind alle Daten, mit denen Sie persönlich identifiziert werden
            können (Art. 4 Nr. 1 DSGVO).
          </p>
          <p>
            <strong>Verantwortlich für die Datenerfassung</strong> ist der
            Betreiber dieser Website (siehe Abschnitt „Verantwortlicher" und
            unser Impressum).
          </p>
        </>
      ),
    },
    {
      heading: '2. Verantwortlicher (Art. 4 Nr. 7 DSGVO)',
      body: (
        <>
          <p>
            [Inhaber-Vorname Inhaber-Nachname]
            <br />
            KLARWERK Gebäudereinigung
            <br />
            [Straße, Hausnummer], 48[XXX] Münster
            <br />
            Telefon: +49 251 [XXX XXXX]
            <br />
            E-Mail:{' '}
            <a href="mailto:datenschutz@klarwerk-muenster.de">
              datenschutz@klarwerk-muenster.de
            </a>
          </p>
        </>
      ),
    },
    {
      heading: '3. Hosting',
      body: (
        <>
          <p>
            Diese Website wird gehostet bei <strong>[Hosting-Anbieter]</strong>{' '}
            (z. B. Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA
            — oder ein deutscher/EU-Anbieter, je nach finalem Deployment).
          </p>
          <p>
            Der Hoster verarbeitet auf unseren Auftrag personenbezogene Daten
            (IP-Adressen, Zugriffszeitpunkte, übermittelte Daten) als
            Auftragsverarbeiter (Art. 28 DSGVO). Mit dem Anbieter besteht ein
            Auftragsverarbeitungsvertrag.
          </p>
          <p>
            <em>Rechtsgrundlage:</em> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes
            Interesse an stabilem Hosting).
          </p>
        </>
      ),
    },
    {
      heading: '4. Server-Log-Dateien',
      body: (
        <>
          <p>
            Beim Aufruf dieser Website erhebt unser Hoster automatisch
            Informationen in Server-Log-Dateien: Browsertyp und -version, das
            verwendete Betriebssystem, Referrer-URL, Hostname des zugreifenden
            Rechners, Zeitpunkt der Anfrage und die IP-Adresse.
          </p>
          <p>
            Eine Zusammenführung dieser Daten mit anderen Datenquellen erfolgt
            nicht. Die Speicherung dient der Sicherstellung der
            Funktionsfähigkeit und Sicherheit der Website.
            <br />
            <em>Rechtsgrundlage:</em> Art. 6 Abs. 1 lit. f DSGVO.
            <br />
            <em>Speicherdauer:</em> max. 7 Tage, danach werden IP-Adressen
            gekürzt oder gelöscht.
          </p>
        </>
      ),
    },
    {
      heading: '5. Cookies & vergleichbare Technologien (§ 25 TDDDG)',
      body: (
        <>
          <p>
            Diese Website verwendet ausschließlich{' '}
            <strong>technisch notwendige Cookies</strong>, die für den Betrieb
            der Seite zwingend erforderlich sind (§ 25 Abs. 2 Nr. 2 TDDDG). Diese
            speichern z. B. Ihre Cookie-Präferenz und Spracheinstellungen.
          </p>
          <p>
            <strong>Nicht-essenzielle Cookies und externe Dienste</strong> (z.
            B. die Einbindung von Google Maps im Bereich „Kontakt") werden{' '}
            <em>nur nach Ihrer ausdrücklichen Einwilligung</em> geladen
            (Cookie-Banner beim ersten Besuch).
          </p>
          <p>
            Ihre Einwilligung können Sie jederzeit über den Link{' '}
            <strong>„Cookie-Einstellungen"</strong> im Footer widerrufen.
          </p>
        </>
      ),
    },
    {
      heading: '6. Externe Dienste — Google Maps',
      body: (
        <>
          <p>
            Wir binden im Bereich „Kontakt" eine Karte des Anbieters{' '}
            <strong>Google Maps</strong> (Google Ireland Limited, Gordon House,
            Barrow Street, Dublin 4, Irland) ein.
          </p>
          <p>
            Beim Laden der Karte werden Daten (insb. IP-Adresse) an Google
            übertragen, ggf. auch in die USA. Die Karte wird erst nach Ihrer
            <strong>aktiven Einwilligung</strong> geladen (Klick auf „Karte
            anzeigen"). Ohne Einwilligung sehen Sie nur einen Platzhalter.
          </p>
          <p>
            <em>Rechtsgrundlage:</em> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung).
            <br />
            <em>Datentransfer USA:</em> Google ist unter dem EU-US Data Privacy
            Framework (DPF) zertifiziert.
            <br />
            <em>Details:</em>{' '}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              policies.google.com/privacy
            </a>
          </p>
        </>
      ),
    },
    {
      heading: '7. Kontaktaufnahme (E-Mail, Telefon, WhatsApp)',
      body: (
        <>
          <p>
            Wenn Sie uns per E-Mail, Telefon oder WhatsApp kontaktieren,
            werden Ihre Angaben zur Bearbeitung der Anfrage und für etwaige
            Anschlussfragen gespeichert.
            <br />
            <em>Rechtsgrundlage:</em> Art. 6 Abs. 1 lit. b DSGVO
            (Vertragsanbahnung) bzw. lit. f (berechtigtes Interesse).
            <br />
            <em>Speicherdauer:</em> Wir löschen die Daten, sobald sie für den
            Zweck nicht mehr erforderlich sind; gesetzliche
            Aufbewahrungspflichten (z. B. § 147 AO, § 257 HGB) bleiben
            unberührt.
          </p>
          <p>
            <strong>Hinweis WhatsApp:</strong> WhatsApp ist ein Dienst der
            Meta Platforms Ireland Ltd. Bei Nutzung gelten zusätzlich die
            Datenschutzbestimmungen von WhatsApp/Meta. Wir empfehlen für
            sensible Anfragen die Kontaktaufnahme per Telefon oder E-Mail.
          </p>
        </>
      ),
    },
    {
      heading: '8. Ihre Rechte als betroffene Person (Art. 15–22 DSGVO)',
      body: (
        <>
          <p>Sie haben gegenüber uns folgende Rechte:</p>
          <ul>
            <li>
              <strong>Auskunft</strong> (Art. 15 DSGVO)
            </li>
            <li>
              <strong>Berichtigung</strong> (Art. 16 DSGVO)
            </li>
            <li>
              <strong>Löschung</strong> (Art. 17 DSGVO)
            </li>
            <li>
              <strong>Einschränkung der Verarbeitung</strong> (Art. 18 DSGVO)
            </li>
            <li>
              <strong>Datenübertragbarkeit</strong> (Art. 20 DSGVO)
            </li>
            <li>
              <strong>Widerspruch</strong> gegen Verarbeitung (Art. 21 DSGVO)
            </li>
            <li>
              <strong>Widerruf einer Einwilligung</strong> jederzeit mit
              Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO)
            </li>
          </ul>
        </>
      ),
    },
    {
      heading: '9. Beschwerderecht bei der Aufsichtsbehörde',
      body: (
        <>
          <p>
            Sie haben das Recht, sich bei einer Aufsichtsbehörde zu beschweren
            (Art. 77 DSGVO). Für KLARWERK in Münster zuständig ist:
          </p>
          <p>
            <strong>
              Landesbeauftragte für Datenschutz und Informationsfreiheit
              Nordrhein-Westfalen (LDI NRW)
            </strong>
            <br />
            Postfach 20 04 44, 40102 Düsseldorf
            <br />
            <a
              href="https://www.ldi.nrw.de"
              target="_blank"
              rel="noopener noreferrer"
            >
              www.ldi.nrw.de
            </a>
          </p>
        </>
      ),
    },
    {
      heading: '10. SSL-/TLS-Verschlüsselung',
      body: (
        <p>
          Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der
          Übertragung vertraulicher Inhalte eine SSL- bzw. TLS-Verschlüsselung
          (erkennbar am Schloss-Symbol in der Adresszeile Ihres Browsers).
        </p>
      ),
    },
  ],
}
