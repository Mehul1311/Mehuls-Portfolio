import type { CSSProperties } from 'react'
import type { Tech } from '../data/stack'

function luminance(hex: string) {
  const [r, g, b] = [0, 2, 4].map((offset) => {
    const channel = parseInt(hex.slice(offset, offset + 2), 16) / 255
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function TechIcon({ tech }: { tech: Tech }) {
  const { icon } = tech
  if (!icon) return <b className="tech-icon tech-icon--text" aria-hidden="true">{tech.mark}</b>

  // Near-black brand colours would vanish on the dark theme, so they inherit the text colour instead.
  const color = luminance(icon.hex) < 0.04 ? 'var(--text)' : `#${icon.hex}`
  return (
    <b className="tech-icon" style={{ '--brand': color } as CSSProperties} aria-hidden="true">
      <svg viewBox="0 0 24 24"><path d={icon.path} /></svg>
    </b>
  )
}
