import { useEffect, useState } from 'react'
import { TiltCard } from '../TiltCard'
import { ArrowIcon } from '../Icons'
import { profile } from '../../data/profile'

type Article = { title: string; href: string; date: string; topic: string; readTime: string; excerpt: string; quote?: string }

const REFRESH_MS = 5 * 60 * 1000

function useMediumArticles() {
  const [articles, setArticles] = useState<Article[]>(profile.articles)
  const [live, setLive] = useState(false)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      if (document.hidden) return
      try {
        const response = await fetch('/api/medium')
        if (!response.ok) return
        const data = await response.json() as { articles?: Article[] }
        if (!cancelled && data.articles?.length) {
          setArticles(data.articles)
          setLive(true)
        }
      } catch {
        // Keep showing the bundled stories when the feed is unreachable.
      }
    }
    load()
    const timer = window.setInterval(load, REFRESH_MS)
    document.addEventListener('visibilitychange', load)
    return () => {
      cancelled = true
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', load)
    }
  }, [])

  return { articles, live }
}

export function Writing() {
  const { articles, live } = useMediumArticles()
  const [featured, ...rest] = articles
  const quote = featured.quote ?? profile.articles.find((article) => article.href === featured.href)?.quote

  return (
    <section id="writing" className="section writing">
      <div className="container">
        <header className="section-head writing-head" data-reveal>
          <p className="section-label"><span>06</span> Writing</p>
          <h2 className="section-title">Notes from <em>the journey.</em></h2>
          <p className="section-copy">Beyond code, I write on Medium about growth, setbacks and the lessons that shaped how I build — and how I live.</p>
        </header>

        <div className="writing-layout">
          <TiltCard className="glass-card article-card" max={4} data-reveal>
            <a href={featured.href} target="_blank" rel="noreferrer" className="article-link">
              <div className="article-meta">
                <span className="article-source"><b>M</b> Medium</span>
                {live && <span className="article-live"><i aria-hidden="true" /> Latest</span>}
                <span>{featured.topic}</span>
                <span>{featured.date}</span>
                <span>{featured.readTime}</span>
              </div>
              <h3>{featured.title}</h3>
              <p>{featured.excerpt}</p>
              <span className="article-cta">Read the story <ArrowIcon /></span>
            </a>
          </TiltCard>

          <figure className="article-quote" data-reveal>
            <span aria-hidden="true">“</span>
            {quote ? <blockquote>{quote}</blockquote> : <blockquote>{featured.title}</blockquote>}
            <figcaption>— {profile.name}, on Medium</figcaption>
            <a href={profile.links.medium} target="_blank" rel="noreferrer">All stories <ArrowIcon /></a>
          </figure>
        </div>

        {rest.length > 0 && (
          <ul className="article-more">
            {rest.slice(0, 4).map((article) => (
              <li key={article.href}>
                <a href={article.href} target="_blank" rel="noreferrer">
                  <span className="article-more-meta">{article.date} · {article.readTime}</span>
                  <strong>{article.title}</strong>
                  <ArrowIcon />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
