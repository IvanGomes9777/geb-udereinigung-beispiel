import { Header } from './components/Header'
import { Hero } from './sections/Hero'
import { AboutUs } from './sections/AboutUs'
import { Services } from './sections/Services'
import { Process } from './sections/Process'
import { TerminForm } from './sections/TerminForm'
import { Reviews } from './sections/Reviews'
import { Contact } from './sections/Contact'
import { Footer } from './sections/Footer'
import { CookieBanner } from './components/CookieBanner'

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <AboutUs />
        <Services />
        <Process />
        <TerminForm />
        <Reviews />
        <Contact />
      </main>
      <Footer />
      {/* DSGVO-konformer Cookie-Banner — Auto-Anzeige beim Erstbesuch */}
      <CookieBanner />
    </>
  )
}
