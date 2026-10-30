import { type KeyboardEvent, useEffect, useRef, useState } from 'react'
import { LiveDashboard } from '../LiveDashboard'
import { ArrowIcon } from '../Icons'
import { OPEN_SYSTEM_EVENT, dashboards } from '../../data/dashboards'
import { profile } from '../../data/profile'

export function Systems() {
  const [activeId, setActiveId] = useState(dashboards[0].id)
  const tabsRef = useRef<HTMLDivElement>(null)
  const active = dashboards.find((dashboard) => dashboard.id === activeId) ?? dashboards[0]
  const project = profile.projects.find((item) => item.id === active.id)

  useEffect(() => {
    const open = (event: Event) => {
      const id = (event as CustomEvent<string>).detail
      if (dashboards.some((dashboard) => dashboard.id === id)) setActiveId(id)
    }
    window.addEventListener(OPEN_SYSTEM_EVENT, open)
    return () => window.removeEventListener(OPEN_SYSTEM_EVENT, open)
  }, [])

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
    event.preventDefault()
    const index = dashboards.findIndex((dashboard) => dashboard.id === activeId)
    const next = (index + (event.key === 'ArrowRight' ? 1 : -1) + dashboards.length) % dashboards.length
    setActiveId(dashboards[next].id)
    tabsRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus()
  }

  return (
    <section id="systems" className="section systems">
      <div className="systems-glow" aria-hidden="true" />
      <div className="container">
        <header className="section-head systems-head" data-reveal>
          <p className="section-label"><span>02</span> Live systems</p>
          <h2 className="section-title">Dashboards that run <em>the business.</em></h2>
          <p className="section-copy">The CRM, ERP, kitchen, payments and verification consoles behind my products — reimagined as live, interactive concepts. Numbers are simulated in your browser, not real business data.</p>
        </header>

        <div ref={tabsRef} className="systems-tabs" role="tablist" aria-label="Product dashboards" onKeyDown={onKeyDown} data-reveal>
          {dashboards.map((dashboard) => {
            const selected = dashboard.id === activeId
            return (
              <button
                key={dashboard.id}
                type="button"
                role="tab"
                id={`tab-${dashboard.id}`}
                aria-selected={selected}
                aria-controls="systems-panel"
                tabIndex={selected ? 0 : -1}
                className={selected ? 'is-active' : ''}
                onClick={() => setActiveId(dashboard.id)}
              >
                <span>{dashboard.kind}</span>
                <b>{dashboard.product}</b>
              </button>
            )
          })}
        </div>

        <div id="systems-panel" className="systems-panel" role="tabpanel" aria-labelledby={`tab-${active.id}`} data-reveal>
          <LiveDashboard key={active.id} dashboard={active} accent={project?.map.hue} />
        </div>

        {project && (
          <div className="systems-foot">
            <p><b>{project.title}</b> · {project.summary}</p>
            <a href={project.href} target="_blank" rel="noreferrer">{project.kind === 'live' ? 'Visit live product' : 'View source'} <ArrowIcon /></a>
          </div>
        )}
      </div>
    </section>
  )
}
