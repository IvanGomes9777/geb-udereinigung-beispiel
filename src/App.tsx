import { Header } from './components/Header'
import { Hero } from './sections/Hero'
import { AboutUs } from './sections/AboutUs'
import { Services } from './sections/Services'
import { Reviews } from './sections/Reviews'
import { OpeningHours } from './sections/OpeningHours'
import { Contact } from './sections/Contact'
import { Footer } from './sections/Footer'

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <AboutUs />
        <Services />
        <Reviews />
        <OpeningHours />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
