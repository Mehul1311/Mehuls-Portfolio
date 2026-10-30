import { type CSSProperties, useEffect, useRef, useState } from 'react'
import type { Dashboard, KpiFormat } from '../data/dashboards'

const TICK_MS = 1700
const POINTS = 26

type Ticket = { id: number; label: string; stage: number }
type FeedItem = { id: number; text: string; age: number }
type LiveState = {
  tick: number
  kpis: number[]
  deltas: number[]
  series: number[]
  bars: number[]
  feed: FeedItem[]
  tickets: Ticket[]
  clock: string
}

type Random = () => number

function seeded(text: string): Random {
  let seed = [...text].reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) >>> 0, 2166136261)
  return () => {
    seed = (seed + 0x6d2b79f5) >>> 0
    let t = seed
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const pick = <T,>(list: readonly T[], rand: Random) => list[Math.floor(rand() * list.length)]

function formatValue(value: number, format: KpiFormat) {
  switch (format) {
    case 'inr': return `₹${Math.round(value).toLocaleString('en-IN')}`
    case 'pct': return `${value.toFixed(1)}%`
    case 'min': return `${Math.round(value)} min`
    case 'sec': return `${Math.round(value)}s`
    case 'rating': return `${value.toFixed(1)} ★`
    default: return Math.round(value).toLocaleString('en-IN')
  }
}

function seriesPoint(dashboard: Dashboard, tick: number, rand: Random) {
  const { base, spread } = dashboard.chart
  return base + Math.sin(tick / 3.2) * spread * 0.5 + Math.sin(tick / 1.7) * spread * 0.15 + (rand() - 0.5) * spread * 0.55
}

function feedLine(dashboard: Dashboard, rand: Random) {
  const template = pick(dashboard.feed.templates, rand)
  return template.replace(/\{(\w+)\}/g, (_, key: string) => key === 'id' ? String(1000 + Math.floor(rand() * 8999)) : pick(dashboard.feed.pools[key] ?? ['—'], rand))
}

function createState(dashboard: Dashboard): LiveState {
  const rand = seeded(dashboard.id)
  const items = dashboard.panel.type === 'board' ? dashboard.panel.items : []
  return {
    tick: 0,
    kpis: dashboard.kpis.map((kpi) => kpi.value),
    deltas: dashboard.kpis.map(() => 0),
    series: Array.from({ length: POINTS }, (_, index) => seriesPoint(dashboard, index - POINTS, rand)),
    bars: 'items' in dashboard.panel && dashboard.panel.type !== 'board' ? dashboard.panel.items.map((item) => item.value) : [],
    feed: Array.from({ length: 5 }, (_, index) => ({ id: -index - 1, text: feedLine(dashboard, rand), age: index * 3 + 1 })),
    tickets: items.slice(0, 6).map((label, index) => ({ id: index, label, stage: index % 3 })),
    clock: 'LIVE',
  }
}

function step(state: LiveState, dashboard: Dashboard): LiveState {
  const rand = Math.random
  const tick = state.tick + 1
  const deltas = dashboard.kpis.map((kpi) => {
    if (kpi.fixed) return 0
    const change = (rand() - 0.32) * kpi.step * 2
    return Number((kpi.max === undefined ? Math.abs(change) : change).toFixed(kpi.step < 1 ? 1 : 0))
  })
  const kpis = state.kpis.map((value, index) => {
    const kpi = dashboard.kpis[index]
    return Math.min(kpi.max ?? Infinity, Math.max(kpi.min ?? 0, value + deltas[index]))
  })
  const series = [...state.series.slice(1), seriesPoint(dashboard, tick, rand)]
  const bars = state.bars.map((value) => Math.max(4, value + (rand() - 0.5) * 3))
  const feed = [{ id: tick, text: feedLine(dashboard, rand), age: 0 }, ...state.feed.slice(0, 4).map((item) => ({ ...item, age: item.age + 1 }))]

  let tickets = state.tickets
  if (dashboard.panel.type === 'board') {
    const items = dashboard.panel.items
    const moving = tickets.filter((ticket) => ticket.stage < 2)
    const target = moving.length ? pick(moving, rand) : undefined
    tickets = tickets.map((ticket) => ticket === target ? { ...ticket, stage: ticket.stage + 1 } : ticket)
    const ready = tickets.filter((ticket) => ticket.stage === 2)
    if (ready.length > 2) tickets = tickets.filter((ticket) => ticket !== ready[0])
    if (tickets.filter((ticket) => ticket.stage === 0).length < 2) tickets = [...tickets, { id: tick + 100, label: pick(items, rand), stage: 0 }]
  }

  const clock = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
  return { tick, kpis, deltas, series, bars, feed, tickets, clock }
}

function useLive(dashboard: Dashboard, paused: boolean) {
  const ref = useRef<HTMLDivElement>(null)
  const [state, setState] = useState(() => createState(dashboard))
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '80px' })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (paused || !visible || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = window.setInterval(() => {
      if (!document.hidden) setState((current) => step(current, dashboard))
    }, TICK_MS)
    return () => window.clearInterval(timer)
  }, [dashboard, paused, visible])

  return { ref, state }
}

function LiveChart({ series, tick, id, base, spread }: { series: number[]; tick: number; id: string; base: number; spread: number }) {
  const width = 300
  const height = 120
  const gap = width / (series.length - 2)
  const min = base - spread * 1.2
  const max = base + spread * 1.2
  const points = series.map((value, index) => [index * gap, height - 8 - ((value - min) / (max - min)) * (height - 24)] as const)
  const line = points.map(([x, y], index) => {
    if (!index) return `M${x.toFixed(1)} ${y.toFixed(1)}`
    const [px, py] = points[index - 1]
    return `C${(px + gap / 2).toFixed(1)} ${py.toFixed(1)} ${(x - gap / 2).toFixed(1)} ${y.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`
  }).join(' ')
  const area = `${line} L${points[points.length - 1][0]} ${height} L0 ${height} Z`

  return (
    <svg className="dash-chart-svg" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={`area-${id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="var(--dash-accent)" stopOpacity="0.38" />
          <stop offset="1" stopColor="var(--dash-accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((row) => <line key={row} x1="0" x2={width} y1={height * row} y2={height * row} className="dash-grid-line" />)}
      <g key={tick} className="dash-chart-slide" style={{ '--slide': `${-gap}px` } as CSSProperties}>
        <path d={area} fill={`url(#area-${id})`} />
        <path d={line} className="dash-chart-line" />
      </g>
    </svg>
  )
}

function Panel({ dashboard, state }: { dashboard: Dashboard; state: LiveState }) {
  const panel = dashboard.panel

  if (panel.type === 'board') {
    return (
      <div className="dash-board">
        {panel.columns.map((column, stage) => (
          <div key={column} className="dash-board-col">
            <p>{column}<span>{state.tickets.filter((ticket) => ticket.stage === stage).length}</span></p>
            {state.tickets.filter((ticket) => ticket.stage === stage).map((ticket) => (
              <div key={ticket.id} className={`dash-ticket stage-${stage}`}><b>#{String(ticket.id + 241).padStart(3, '0')}</b>{ticket.label}</div>
            ))}
          </div>
        ))}
      </div>
    )
  }

  if (panel.type === 'split') {
    const radius = 42
    const circumference = 2 * Math.PI * radius
    const [driver] = panel.items
    return (
      <div className="dash-split">
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <circle cx="60" cy="60" r={radius} className="dash-split-track" />
          <circle cx="60" cy="60" r={radius} className="dash-split-value" transform="rotate(-90 60 60)" strokeDasharray={`${(driver.value / 100) * circumference} ${circumference}`} />
          <text x="60" y="58" textAnchor="middle">{panel.center}</text>
          <text x="60" y="74" textAnchor="middle" className="dash-split-sub">driver / fee</text>
        </svg>
        <ul>{panel.items.map((item) => <li key={item.label}><i />{item.label}<b>{item.value}%</b></li>)}</ul>
        <small>{panel.caption}</small>
      </div>
    )
  }

  const funnel = panel.type === 'funnel'
  const total = state.bars.reduce((sum, value) => sum + value, 0)
  const peak = Math.max(...state.bars)
  return (
    <ul className={`dash-bars${funnel ? ' is-funnel' : ''}`}>
      {panel.items.map((item, index) => {
        const value = state.bars[index]
        const share = funnel ? value / state.bars[0] : value / total
        return (
          <li key={item.label}>
            <span>{item.label}</span>
            <b>{Math.round(share * 100)}%</b>
            <i style={{ '--w': funnel ? share : value / peak } as CSSProperties} />
          </li>
        )
      })}
    </ul>
  )
}

type Props = { dashboard: Dashboard; variant?: 'full' | 'mini'; paused?: boolean; accent?: number }

export function LiveDashboard({ dashboard, variant = 'full', paused = false, accent = 262 }: Props) {
  const { ref, state } = useLive(dashboard, paused)
  const style = { '--dash-hue': accent } as CSSProperties

  if (variant === 'mini') {
    return (
      <div ref={ref} className="dash dash--mini" style={style}>
        <div className="dash-chrome"><i /><i /><i /><span>{dashboard.path}</span><em>Live</em></div>
        <div className="dash-mini-kpis">
          {dashboard.kpis.slice(0, 2).map((kpi, index) => (
            <div key={kpi.label}><small>{kpi.label}</small><strong>{formatValue(state.kpis[index], kpi.format)}</strong></div>
          ))}
        </div>
        <div className="dash-mini-chart"><LiveChart series={state.series} tick={state.tick} id={`${dashboard.id}-mini`} {...dashboard.chart} /></div>
        <ul className="dash-mini-feed">{state.feed.slice(0, 2).map((item) => <li key={item.id}>{item.text}</li>)}</ul>
      </div>
    )
  }

  return (
    <div ref={ref} className="dash" style={style}>
      <div className="dash-chrome">
        <i /><i /><i />
        <span>{dashboard.path}</span>
        <em>Live</em>
        <small>Simulated data</small>
      </div>
      <div className="dash-body">
        <aside className="dash-side" aria-hidden="true">
          <span className="dash-logo">{dashboard.product.slice(0, 2)}</span>
          {dashboard.nav.map((item, index) => <span key={item} className={index ? '' : 'is-active'}><i />{item}</span>)}
        </aside>
        <div className="dash-main">
          <header className="dash-top">
            <div><small>{dashboard.kind} · {dashboard.module}</small><h4>{dashboard.product}</h4></div>
            <span className="dash-clock"><i />{state.clock}</span>
          </header>
          <div className="dash-kpis">
            {dashboard.kpis.map((kpi, index) => {
              const delta = state.deltas[index]
              return (
                <div key={kpi.label} className="dash-kpi">
                  <small>{kpi.label}</small>
                  <strong>{formatValue(state.kpis[index], kpi.format)}</strong>
                  <span className={delta > 0 ? 'is-up' : delta < 0 ? 'is-down' : ''}>{delta > 0 ? '▲' : delta < 0 ? '▼' : '•'} {kpi.fixed ? 'steady' : Math.abs(delta).toLocaleString('en-IN')}</span>
                </div>
              )
            })}
          </div>
          <div className="dash-grid">
            <section className="dash-card dash-card--chart">
              <p className="dash-card-title">{dashboard.chart.title}</p>
              <LiveChart series={state.series} tick={state.tick} id={dashboard.id} {...dashboard.chart} />
            </section>
            <section className="dash-card">
              <p className="dash-card-title">{dashboard.panel.title}</p>
              <Panel dashboard={dashboard} state={state} />
            </section>
            <section className="dash-card dash-card--feed">
              <p className="dash-card-title">Live activity</p>
              <ul className="dash-feed">
                {state.feed.map((item) => <li key={item.id}><i /><span>{item.text}</span><time>{item.age ? `${Math.round(item.age * TICK_MS / 1000)}s` : 'now'}</time></li>)}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
