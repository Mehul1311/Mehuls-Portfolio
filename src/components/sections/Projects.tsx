import { type CSSProperties, type KeyboardEvent, type PointerEvent, useRef, useState } from 'react'
import { LiveDashboard } from '../LiveDashboard'
import { Motes, Mountains, Terrain, TerrainFx } from '../WorldScene'
import { ArrowIcon, GitHubIcon } from '../Icons'
import { type Project, profile } from '../../data/profile'
import { OPEN_SYSTEM_EVENT, dashboardById } from '../../data/dashboards'

const TILT = 0.53 // cos of the plane's rotateX — screen-space drag is foreshortened by this much
const PAN_LIMIT = 42

function PortalContent({ project }: { project: Project }) {
  const dashboard = dashboardById(project.dashboard)
  if (dashboard) return <LiveDashboard dashboard={dashboard} variant="mini" accent={project.map.hue} />
  return (
    <div className="portal-cover">
      <span>{project.category}</span>
      <strong>{project.title}</strong>
      <div>{project.tags.slice(0, 3).map((tag) => <i key={tag}>{tag}</i>)}</div>
    </div>
  )
}

export function Projects() {
  const projects = profile.projects
  const [active, setActive] = useState<number | null>(0)
  const [pan, setPan] = useState(() => ({ x: 50 - projects[0].map.x, y: 50 - projects[0].map.y }))
  const [dragging, setDragging] = useState(false)
  const planeRef = useRef<HTMLDivElement>(null)
  const drag = useRef<{ id: number; x: number; y: number; pan: { x: number; y: number }; moved: boolean } | null>(null)

  const parallaxFrame = useRef(0)

  const current = active === null ? null : projects[active]

  const focus = (index: number) => {
    const target = (index + projects.length) % projects.length
    setActive(target)
    setPan({ x: 50 - projects[target].map.x, y: 50 - projects[target].map.y })
  }

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || (event.target as HTMLElement).closest('.world-hud, .world-head')) return
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, pan, moved: false }
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && !parallaxFrame.current) {
      const world = event.currentTarget
      const { clientX, clientY } = event
      parallaxFrame.current = requestAnimationFrame(() => {
        parallaxFrame.current = 0
        const rect = world.getBoundingClientRect()
        world.style.setProperty('--mx', ((clientX - rect.left) / rect.width - 0.5).toFixed(2))
        world.style.setProperty('--my', ((clientY - rect.top) / rect.height - 0.5).toFixed(2))
      })
    }
    const state = drag.current
    const plane = planeRef.current
    if (!state || state.id !== event.pointerId || !plane) return
    const dx = event.clientX - state.x
    const dy = event.clientY - state.y
    if (!state.moved) {
      if (Math.hypot(dx, dy) < 6) return
      state.moved = true
      event.currentTarget.setPointerCapture(event.pointerId)
      setDragging(true)
      setActive(null)
    }
    const size = plane.offsetWidth
    const clamp = (value: number) => Math.max(-PAN_LIMIT, Math.min(PAN_LIMIT, value))
    setPan({ x: clamp(state.pan.x + (dx / size) * 100), y: clamp(state.pan.y + (dy / TILT / size) * 100) })
  }

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const state = drag.current
    if (!state || state.id !== event.pointerId) return
    drag.current = null
    if (!state.moved) return
    setDragging(false)
    const center = { x: 50 - pan.x, y: 50 - pan.y }
    let nearest = -1
    let best = 11
    projects.forEach((project, index) => {
      const distance = Math.hypot(project.map.x - center.x, project.map.y - center.y)
      if (distance < best) { best = distance; nearest = index }
    })
    if (nearest >= 0) focus(nearest)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'ArrowRight') { event.preventDefault(); focus((active ?? -1) + 1) }
    if (event.key === 'ArrowLeft') { event.preventDefault(); focus((active ?? 0) - 1) }
  }

  const openDashboard = (id: string) => window.dispatchEvent(new CustomEvent(OPEN_SYSTEM_EVENT, { detail: id }))

  return (
    <section id="projects" className="world-section" aria-labelledby="work-title">
      <div
        className={`world${dragging ? ' is-dragging' : ''}${current ? ' has-active' : ''}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
      >
        <div className="world-sky" aria-hidden="true"><i /><i /><i /><i /></div>
        <Mountains />

        <div className="world-camera">
          <div ref={planeRef} className="world-plane" style={{ '--tx': `${pan.x}%`, '--ty': `${pan.y}%` } as CSSProperties}>
            <Terrain projects={projects} />
            <TerrainFx />
            {projects.map((project, index) => (
              <button
                key={project.id}
                type="button"
                className={`world-marker${index === active ? ' is-active' : ''}`}
                style={{ left: `${project.map.x}%`, top: `${project.map.y}%`, '--hue': project.map.hue } as CSSProperties}
                aria-label={`${project.title} — ${project.category}`}
                aria-pressed={index === active}
                onClick={() => focus(index)}
              >
                <i className="marker-ring" aria-hidden="true" />
                <span className="marker-pin" aria-hidden="true">
                  <span className="marker-label">{project.title}</span>
                  <i className="marker-core" />
                  <i className="marker-beam" />
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="world-fog" aria-hidden="true" />
        <Motes />

        {current && (
          <div key={current.id} className="world-portal" style={{ '--hue': current.map.hue } as CSSProperties} aria-hidden="true">
            <div className="portal-orb"><PortalContent project={current} /></div>
            <i className="portal-beam" />
          </div>
        )}

        <header className="world-head container">
          <p className="section-label"><span>01</span> Selected work</p>
          <h2 id="work-title" className="world-title">Building products<br />people <em>actually use.</em></h2>
        </header>

        <div className="world-hud">
          <p className="world-count" aria-hidden="true">
            <b>{current ? String((active ?? 0) + 1).padStart(2, '0') : '—'}</b> / {String(projects.length).padStart(2, '0')}
          </p>

          <div className="world-caption" aria-live="polite">
            {current ? (
              <div key={current.id} className="world-caption-inner">
                <small>{current.client}</small>
                <h3>{current.title}</h3>
                <p>{current.summary}</p>
                <div className="world-actions">
                  <a className="world-btn" href={current.href} target="_blank" rel="noreferrer">{current.kind === 'live' ? 'Visit live site' : 'View project'}<ArrowIcon /></a>
                  {current.repo && <a className="world-btn world-btn--ghost" href={current.repo} target="_blank" rel="noreferrer"><GitHubIcon /> Source</a>}
                  {current.dashboard && <a className="world-btn world-btn--ghost" href="#systems" onClick={() => openDashboard(current.dashboard!)}>Open dashboard</a>}
                </div>
              </div>
            ) : (
              <div className="world-caption-inner">
                <small>Exploring</small>
                <h3>Select a marker</h3>
              </div>
            )}
          </div>

          <div className="world-nav">
            <button type="button" aria-label="Previous project" onClick={() => focus((active ?? 0) - 1)}><ArrowIcon /></button>
            <button type="button" aria-label="Next project" onClick={() => focus((active ?? -1) + 1)}><ArrowIcon /></button>
          </div>
        </div>

        <p className="world-hint" aria-hidden="true">Drag to explore.<br />Click markers to open.</p>
      </div>

      <div className="container">
        <ol className="project-index" aria-label="All projects">
          {projects.map((project, index) => (
            <li key={project.id} style={{ '--hue': project.map.hue } as CSSProperties} data-reveal>
              <span className="index-num">{String(index + 1).padStart(2, '0')}</span>
              <div className="index-title">
                <h3>{project.title}</h3>
                <p>{project.client}</p>
              </div>
              <p className="index-summary">{project.summary}</p>
              <div className="index-links">
                <a href={project.href} target="_blank" rel="noreferrer">{project.kind === 'live' ? 'Live' : 'Code'} <ArrowIcon /></a>
                {project.repo && <a href={project.repo} target="_blank" rel="noreferrer">Code <ArrowIcon /></a>}
              </div>
            </li>
          ))}
          <li className="index-more">
            <a href={profile.links.githubRepos} target="_blank" rel="noreferrer">Explore every repository on GitHub <ArrowIcon /></a>
          </li>
        </ol>
      </div>
    </section>
  )
}
