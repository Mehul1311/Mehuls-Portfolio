import { useEffect, useState } from 'react'
import { ThemeToggle } from './ThemeToggle'
import { profile } from '../data/profile'

const links = [
  { href: '#projects', label: 'Work' },
  { href: '#systems', label: 'Systems' },
  { href: '#about', label: 'About' },
  { href: '#stack', label: 'Stack' },
  { href: '#experience', label: 'Journey' },
  { href: '#writing', label: 'Writing' },
  { href: '#contact', label: 'Contact' },
]

export function SiteNav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenuOpen(false) }
    const onResize = () => { if (window.innerWidth > 960) setMenuOpen(false) }
    const onPointerDown = (event: PointerEvent) => { if (!(event.target as HTMLElement).closest('.site-nav')) setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    document.addEventListener('pointerdown', onPointerDown)
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('resize', onResize); document.removeEventListener('pointerdown', onPointerDown) }
  }, [menuOpen])

  return (
    <header className={`site-nav${menuOpen ? ' is-open' : ''}${scrolled ? ' is-scrolled' : ''}`}>
      <a className="brand" href="#home" aria-label={`${profile.name} — back to top`} onClick={() => setMenuOpen(false)}>
        <span className="brand-mark">{profile.initials}</span>
        <span className="brand-name">{profile.name}</span>
      </a>
      <nav id="primary-nav" aria-label="Primary navigation" onClick={(event) => { if ((event.target as HTMLElement).closest('a')) setMenuOpen(false) }}>
        {links.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
      </nav>
      <div className="nav-tools">
        <ThemeToggle />
        <a className="nav-cta" href="#contact">Let's talk</a>
        <button type="button" className="menu-toggle" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="primary-nav" onClick={() => setMenuOpen((open) => !open)}><i /><i /></button>
      </div>
    </header>
  )
}
