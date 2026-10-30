import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { HeroContent } from './HeroContent'

gsap.registerPlugin(ScrollTrigger)

type Props = { ready: boolean }

const KEY_ROWS = [14, 14, 13, 12, 11]

function offsetWithin(el: HTMLElement, ancestor: HTMLElement) {
  let x = 0
  let y = 0
  let node: HTMLElement | null = el
  while (node && node !== ancestor) {
    x += node.offsetLeft
    y += node.offsetTop
    node = node.offsetParent as HTMLElement | null
  }
  return { x, y }
}

export function LaptopIntro({ ready }: Props) {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      root.classList.add('is-static')
      return
    }

    const stage = root.querySelector<HTMLElement>('.intro-stage')!
    const device = root.querySelector<HTMLElement>('.device')!
    const screen = root.querySelector<HTMLElement>('.device-screen')!
    const zoom = { scale: 1, x: 0, y: 0 }

    const measure = () => {
      const vw = stage.clientWidth
      const vh = stage.clientHeight
      const sw = screen.offsetWidth
      const sh = screen.offsetHeight
      if (!sw || !sh) return
      const inner = offsetWithin(screen, device)
      const originX = inner.x + sw / 2
      const originY = inner.y + sh / 2
      zoom.scale = Math.max(vw / sw, vh / sh) * 1.015
      zoom.x = vw / 2 - (device.offsetLeft + originX)
      zoom.y = vh / 2 - (device.offsetTop + originY)
      device.style.transformOrigin = `${originX}px ${originY}px`
      stage.style.setProperty('--pw', `${vw}px`)
      stage.style.setProperty('--ph', `${vh}px`)
      stage.style.setProperty('--inv', `${1 / zoom.scale}`)
    }

    measure()
    ScrollTrigger.addEventListener('refreshInit', measure)

    const mm = gsap.matchMedia()
    mm.add({ mobile: '(max-width: 760px)', desktop: '(min-width: 761px)' }, (context) => {
      const mobile = Boolean(context.conditions?.mobile)
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: root, start: 'top top', end: 'bottom bottom', scrub: 0.8, invalidateOnRefresh: true },
      })

      tl.fromTo('.device-body', { rotateX: mobile ? 38 : -12 }, { rotateX: mobile ? 0 : -7, duration: 3.4, ease: 'power2.out' }, 0)
        .fromTo('.device-lid', { rotateX: mobile ? 0 : -44 }, { rotateX: 0, duration: 3.2, ease: 'power2.inOut' }, 0)
        .fromTo(device, { y: mobile ? 30 : -50, scale: mobile ? 0.94 : 0.9 }, { y: 0, scale: 1, duration: 3, ease: 'power2.out' }, 0)
        .to('.intro-hint', { autoAlpha: 0, y: -20, duration: 1 }, 0.2)
        .fromTo('.welcome-line', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, stagger: 0.25, duration: 0.8 }, 1.6)
        .fromTo('.welcome-bar i', { scaleX: 0 }, { scaleX: 1, duration: 1.6 }, 2.4)
        .to('.device-body', { rotateX: 0, duration: 1.4, ease: 'power2.inOut' }, 3.4)
        .to(device, { scale: () => zoom.scale, x: () => zoom.x, y: () => zoom.y, duration: 4.2, ease: 'power3.inOut' }, 4.2)
        .to('.screen-glare', { autoAlpha: 0, duration: 2 }, 4.6)
        .to('.intro-ambient', { autoAlpha: 0.25, duration: 3 }, 4.6)
        .to('.device-halo', { autoAlpha: 0, duration: 1.6 }, 4.2)
        .to('.screen-welcome', { autoAlpha: 0, scale: 0.94, duration: 0.8 }, 4.9)
        .fromTo('.screen-hero', { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 }, 5.5)
        .fromTo('.screen-hero [data-hero-item]', { autoAlpha: 0, y: 46 }, { autoAlpha: 1, y: 0, stagger: 0.22, duration: 1.3, ease: 'power3.out' }, 6)
        .fromTo('.hero-live', { opacity: 0 }, { opacity: 1, duration: 0.5 }, 8.6)
        .to({}, { duration: 0.6 })

      ScrollTrigger.create({
        trigger: root,
        start: 'bottom-=2% bottom',
        end: 'bottom top',
        toggleClass: { targets: '.hero-live', className: 'is-live' },
      })
    }, root)

    const fontsReady = document.fonts?.ready
    fontsReady?.then(() => ScrollTrigger.refresh())

    return () => {
      ScrollTrigger.removeEventListener('refreshInit', measure)
      mm.revert()
    }
  }, [])

  useEffect(() => {
    if (!ready || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const tween = gsap.timeline()
      .fromTo('.device-enter', { autoAlpha: 0, y: 120, scale: 0.55 }, { autoAlpha: 1, y: 0, scale: 1, duration: 1.4, ease: 'power3.out' }, 0)
      .fromTo('.device-body', { rotationY: -360 }, { rotationY: 0, duration: 2.6, ease: 'power3.inOut' }, 0)
      .fromTo('.device-halo', { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 1.2, ease: 'power2.out' }, 1.8)
      .fromTo('.device-screen', { filter: 'brightness(0)' }, { filter: 'brightness(1)', duration: 0.9, ease: 'power2.out', clearProps: 'filter' }, 2.3)
    const hint = gsap.fromTo('.intro-hint', { autoAlpha: 0 }, { autoAlpha: 1, duration: 1, delay: 2.8 })
    return () => { tween.kill(); hint.kill() }
  }, [ready])

  const revealHero = () => {
    const live = rootRef.current?.querySelector('.hero-live')
    if (!live || live.classList.contains('is-live') || rootRef.current?.classList.contains('is-static')) return
    document.getElementById('home')?.scrollIntoView({ behavior: 'instant' as ScrollBehavior, block: 'start' })
  }

  return (
    <section ref={rootRef} className="intro" aria-label="Introduction">
      <div className="intro-stage">
        <div className="intro-ambient" aria-hidden="true"><i /><i /><i /></div>

        <div className="device">
          <div className="device-halo" aria-hidden="true" />
          <div className="device-enter">
            <div className="device-body">
              <div className="device-lid">
                <div className="device-lid-back" aria-hidden="true"><span>MS</span></div>
                <div className="device-bezel">
                  <span className="device-camera" aria-hidden="true" />
                  <div className="device-screen">
                    <div className="screen-welcome" aria-hidden="true">
                      <div className="welcome-menubar"><span>●</span><span>●</span><span>●</span><b>mehul@portfolio — ~</b></div>
                      <div className="welcome-center">
                        <div className="welcome-mark welcome-line">MS</div>
                        <p className="welcome-title welcome-line">Welcome.</p>
                        <p className="welcome-sub welcome-line">Initialising Mehul Sain’s portfolio</p>
                        <div className="welcome-bar welcome-line"><i /></div>
                      </div>
                      <p className="welcome-foot">Keep scrolling to enter</p>
                    </div>
                    <div className="screen-hero" aria-hidden="true" inert>
                      <div className="screen-hero-frame"><HeroContent /></div>
                    </div>
                    <div className="screen-glare" aria-hidden="true" />
                  </div>
                </div>
              </div>
              <div className="device-deck" aria-hidden="true">
                <div className="deck-shadow" />
                <div className="deck-hinge" />
                <div className="deck-speaker deck-speaker--left" />
                <div className="deck-speaker deck-speaker--right" />
                <div className="deck-keys">
                  {KEY_ROWS.map((count, row) => <div key={row} className="deck-row">{Array.from({ length: count }, (_, key) => <i key={key} />)}</div>)}
                  <div className="deck-row deck-row-space"><i /><i /><i /><i className="space" /><i /><i /><i /></div>
                </div>
                <div className="deck-trackpad" />
                <div className="deck-lip"><span /></div>
              </div>
            </div>
          </div>
        </div>

        <div className="intro-hint" aria-hidden="true"><span className="intro-mouse"><i /></span>Scroll to open</div>

        <div className="hero-live" onFocus={revealHero}>
          <HeroContent />
        </div>
      </div>
      <div id="home" className="intro-anchor" aria-hidden="true" />
    </section>
  )
}
