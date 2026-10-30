import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { ScrollProgress } from './components/ScrollProgress'
import { Loader } from './components/Loader'
import { SiteNav } from './components/SiteNav'
import { LaptopIntro } from './components/LaptopIntro'
import { About } from './components/sections/About'
import { TechStack } from './components/sections/TechStack'
import { Projects } from './components/sections/Projects'
import { Systems } from './components/sections/Systems'
import { Journey } from './components/sections/Journey'
import { Writing } from './components/sections/Writing'
import { Contact } from './components/sections/Contact'
import { profile } from './data/profile'

gsap.registerPlugin(ScrollTrigger)

function App() {
  const [siteReady, setSiteReady] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!rootRef.current || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('main [data-reveal]').forEach((element) => {
        gsap.fromTo(element, { y: 48, opacity: 0 }, {
          y: 0, opacity: 1, duration: 1.1, ease: 'power3.out', clearProps: 'transform',
          scrollTrigger: { trigger: element, start: 'top 90%', once: true },
        })
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={rootRef} className="site">
      <Loader onReady={() => setSiteReady(true)} />
      <ScrollProgress />
      <SiteNav />

      <main>
        <LaptopIntro ready={siteReady} />
        <Projects />
        <Systems />
        <About />
        <TechStack />
        <Journey />
        <Writing />
        <Contact />
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <a href="#home" className="footer-brand"><span className="brand-mark">{profile.initials}</span>{profile.name}</a>
          <p>Designed &amp; engineered by {profile.name}</p>
          <span>© {new Date().getFullYear()} · {profile.location}</span>
        </div>
      </footer>
    </div>
  )
}

export default App
