import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { profile } from '../../data/profile'

gsap.registerPlugin(ScrollTrigger)

export function Journey() {
  const listRef = useRef<HTMLOListElement>(null)

  useEffect(() => {
    const list = listRef.current
    if (!list || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.timeline-fill', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: list, start: 'top 70%', end: 'bottom 60%', scrub: 0.5 } })
      gsap.utils.toArray<HTMLElement>('.timeline-item').forEach((item) => {
        ScrollTrigger.create({ trigger: item, start: 'top 72%', onEnter: () => item.classList.add('is-active'), onLeaveBack: () => item.classList.remove('is-active') })
      })
    }, list)
    return () => ctx.revert()
  }, [])

  return (
    <section id="experience" className="section journey">
      <div className="container journey-layout">
        <header className="section-head journey-head" data-reveal>
          <p className="section-label"><span>05</span> Journey</p>
          <h2 className="section-title">Learn. Build. <em>Iterate.</em></h2>
          <p className="section-copy">Every project is a new system to understand, improve and ship. The loop never stops.</p>
        </header>

        <ol ref={listRef} className="timeline">
          <span className="timeline-line" aria-hidden="true"><i className="timeline-fill" /></span>
          {profile.experience.map((item) => (
            <li key={item.role} className="timeline-item" data-reveal>
              <span className="timeline-node" aria-hidden="true" />
              <div className="glass-card timeline-card">
                <p className="timeline-time">{item.time}</p>
                <h3>{item.role}</h3>
                <p className="timeline-org">{item.company}</p>
                {item.bullets.length > 0 && <ul>{item.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
