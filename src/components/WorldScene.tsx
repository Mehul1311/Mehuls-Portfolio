import { type CSSProperties, useEffect, useRef } from 'react'
import type { Project } from '../data/profile'

const RINGS = [70, 128, 186, 244, 302, 360, 418, 470]
const SILVER = ['#FFFFFF', '#E4E4E7', '#D4D4D8', '#A1A1AA']

function random(seed: number) {
  return () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646
}

const ringDash = (index: number) => {
  const gap = 4 + (index % 3) * 3
  return `${34 - index} ${gap} ${22 + index * 2} ${gap + 2} ${30 - index} ${gap}`
}

const LIGHTS = (() => {
  const rand = random(7)
  return Array.from({ length: 150 }, () => {
    const ring = RINGS[Math.floor(rand() * RINGS.length)] + 29 + (rand() - 0.5) * 18
    const angle = rand() * Math.PI * 2
    return {
      x: 500 + Math.cos(angle) * ring,
      y: 500 + Math.sin(angle) * ring,
      r: 0.8 + rand() * 1.8,
      o: 0.3 + rand() * 0.6,
      color: SILVER[Math.floor(rand() * SILVER.length)],
      twinkle: rand() > 0.8,
    }
  })
})()

const ridge = (seed: number, base: number, amp: number) => {
  const rand = random(seed)
  let d = `M0 320 L0 ${base}`
  for (let x = 0; x <= 1600; x += 24) {
    const y = base - amp * (0.55 + 0.45 * Math.sin(x / 190 + seed)) * (0.7 + rand() * 0.3) - amp * 0.28 * Math.abs(Math.sin(x / 61 + seed * 2))
    d += ` L${x} ${y.toFixed(1)}`
  }
  return `${d} L1600 320 Z`
}

const MOUNTAINS = [ridge(3, 210, 150), ridge(9, 250, 110), ridge(17, 290, 70)]

const MOTES = (() => {
  const rand = random(29)
  return Array.from({ length: 14 }, () => ({
    left: rand() * 100,
    top: 30 + rand() * 62,
    size: 2 + rand() * 3,
    delay: -rand() * 12,
    duration: 9 + rand() * 9,
  }))
})()

export function Terrain({ projects }: { projects: Project[] }) {
  const sourceRef = useRef<SVGSVGElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const source = sourceRef.current
    const canvas = canvasRef.current
    if (!source || !canvas) return
    const size = Math.min(1600, Math.round(Math.max(window.innerWidth, 900) * Math.min(window.devicePixelRatio || 1, 1.5)))
    const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(source)], { type: 'image/svg+xml' }))
    const image = new Image()
    let cancelled = false
    image.onload = () => {
      if (cancelled) return
      canvas.width = size
      canvas.height = size
      canvas.getContext('2d')?.drawImage(image, 0, 0, size, size)
      canvas.classList.add('is-ready')
      URL.revokeObjectURL(url)
    }
    image.src = url
    return () => { cancelled = true; URL.revokeObjectURL(url) }
  }, [projects])

  return (
    <>
      <svg ref={sourceRef} xmlns="http://www.w3.org/2000/svg" width="1000" height="1000" viewBox="0 0 1000 1000" className="world-terrain-src" aria-hidden="true">
        <defs>
          <radialGradient id="ground" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#3F3F46" />
            <stop offset="0.3" stopColor="#27272A" />
            <stop offset="0.6" stopColor="#18181B" />
            <stop offset="0.85" stopColor="#111111" />
            <stop offset="1" stopColor="#0A0A0A" />
          </radialGradient>
          <radialGradient id="island-fade" cx="50%" cy="50%" r="50%">
            <stop offset="0.72" stopColor="#fff" />
            <stop offset="1" stopColor="#000" />
          </radialGradient>
          <mask id="island">
            <rect width="1000" height="1000" fill="url(#island-fade)" />
          </mask>
          <filter id="relief" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves="5" seed="11" result="noise" />
            <feDiffuseLighting in="noise" surfaceScale="9" diffuseConstant="1.15" lightingColor="#ffffff" result="light">
              <feDistantLight azimuth="235" elevation="34" />
            </feDiffuseLighting>
            <feComposite in="light" in2="SourceGraphic" operator="arithmetic" k1="1.35" k2="0" k3="0" k4="0" />
          </filter>
          <filter id="ridge" x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" seed="4" result="warp" />
            <feDisplacementMap in="SourceGraphic" in2="warp" scale="11" xChannelSelector="R" yChannelSelector="G" result="shape" />
            <feGaussianBlur in="shape" stdDeviation="3.5" result="soft" />
            <feSpecularLighting in="soft" surfaceScale="6" specularConstant="1" specularExponent="18" lightingColor="#FFFFFF" result="spec">
              <feDistantLight azimuth="235" elevation="42" />
            </feSpecularLighting>
            <feComposite in="spec" in2="shape" operator="in" result="specIn" />
            <feComposite in="shape" in2="specIn" operator="arithmetic" k1="0" k2="1" k3="0.9" k4="0" result="lit" />
            <feGaussianBlur in="shape" stdDeviation="7" result="shadowBlur" />
            <feOffset in="shadowBlur" dx="12" dy="14" result="shadowOffset" />
            <feFlood floodColor="#000000" floodOpacity="0.9" />
            <feComposite in2="shadowOffset" operator="in" result="shadow" />
            <feMerge><feMergeNode in="shadow" /><feMergeNode in="lit" /></feMerge>
          </filter>
          <radialGradient id="pool">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.32" />
            <stop offset="0.45" stopColor="#FFFFFF" stopOpacity="0.08" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="core">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.85" />
            <stop offset="0.3" stopColor="#E4E4E7" stopOpacity="0.3" />
            <stop offset="1" stopColor="#E4E4E7" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="river" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#A1A1AA" />
            <stop offset="0.5" stopColor="#FFFFFF" />
            <stop offset="1" stopColor="#71717A" />
          </linearGradient>
        </defs>
        <g mask="url(#island)">
          <rect width="1000" height="1000" fill="url(#ground)" filter="url(#relief)" />
          <g filter="url(#ridge)">
            {RINGS.map((radius, index) => (
              <circle key={radius} cx="500" cy="500" r={radius} transform={`rotate(${index * 47} 500 500)`} fill="none" stroke="#2A2A2D" strokeWidth="26" strokeLinecap="round" pathLength={100} strokeDasharray={ringDash(index)} />
            ))}
          </g>
          {RINGS.slice(0, -1).map((radius, index) => (
            <circle key={radius} cx="500" cy="500" r={radius + 29} transform={`rotate(${index * 63} 500 500)`} fill="none" stroke="url(#river)" strokeWidth="1.6" strokeOpacity="0.55" strokeLinecap="round" pathLength={100} strokeDasharray="9 16 4 21" />
          ))}
          {projects.map((project) => (
            <circle key={project.id} cx={project.map.x * 10} cy={project.map.y * 10} r="90" fill="url(#pool)" />
          ))}
          <circle cx="500" cy="500" r="90" fill="url(#core)" />
          {LIGHTS.filter((light) => !light.twinkle).map((light, index) => (
            <circle key={index} cx={light.x} cy={light.y} r={light.r} fill={light.color} opacity={light.o} />
          ))}
        </g>
      </svg>
      <canvas ref={canvasRef} className="world-terrain" aria-hidden="true" />
    </>
  )
}

export function TerrainFx() {
  return (
    <svg className="world-fx" viewBox="0 0 1000 1000" aria-hidden="true">
      {LIGHTS.filter((light) => light.twinkle).map((light, index) => (
        <circle key={index} cx={light.x} cy={light.y} r={light.r + 0.4} fill="#FFFFFF" />
      ))}
    </svg>
  )
}

export function Mountains() {
  return (
    <svg className="world-mountains" viewBox="0 0 1600 320" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="mt-far" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3F3F46" />
          <stop offset="1" stopColor="#141414" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="mt-mid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#27272A" />
          <stop offset="1" stopColor="#101010" />
        </linearGradient>
        <linearGradient id="mt-near" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#18181B" />
          <stop offset="1" stopColor="#0A0A0A" />
        </linearGradient>
      </defs>
      <path d={MOUNTAINS[0]} fill="url(#mt-far)" opacity="0.75" />
      <path d={MOUNTAINS[0]} fill="none" stroke="#FFFFFF" strokeWidth="1" opacity="0.22" />
      <path d={MOUNTAINS[1]} fill="url(#mt-mid)" />
      <path d={MOUNTAINS[1]} fill="none" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.12" />
      <path d={MOUNTAINS[2]} fill="url(#mt-near)" />
    </svg>
  )
}

export function Motes() {
  return (
    <div className="world-motes" aria-hidden="true">
      {MOTES.map((mote, index) => (
        <i
          key={index}
          style={{ left: `${mote.left}%`, top: `${mote.top}%`, width: mote.size, height: mote.size, animationDelay: `${mote.delay}s`, animationDuration: `${mote.duration}s` } as CSSProperties}
        />
      ))}
    </div>
  )
}
