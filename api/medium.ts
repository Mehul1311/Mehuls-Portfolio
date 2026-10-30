type ApiRequest = {
  method?: string
}

type ApiResponse = {
  setHeader: (name: string, value: string) => void
  status: (code: number) => ApiResponse
  json: (body: unknown) => void
}

export type MediumArticle = {
  title: string
  href: string
  date: string
  topic: string
  readTime: string
  excerpt: string
  quote?: string
}

const FEED_URL = 'https://medium.com/feed/@mehulsain1603'
const CACHE_MS = 5 * 60 * 1000
const WORDS_PER_MINUTE = 230

let cache: { at: number; articles: MediumArticle[] } | null = null

function decode(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
}

const stripTags = (html: string) => decode(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim()

function tag(xml: string, name: string) {
  const match = xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`))
  return match ? decode(match[1]).trim() : ''
}

function truncate(text: string, max: number) {
  if (text.length <= max) return text
  return `${text.slice(0, text.lastIndexOf(' ', max)).replace(/[,.;:!?]+$/, '')}…`
}

function parseItem(item: string): MediumArticle | null {
  const title = tag(item, 'title')
  const link = tag(item, 'link').split('?')[0]
  if (!title || !link) return null

  const content = tag(item, 'content:encoded')
  const paragraphs = [...content.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)].map((match) => stripTags(match[1])).filter(Boolean)
  const blockquote = content.match(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/)
  const words = stripTags(content).split(' ').length
  const category = tag(item, 'category').replace(/-/g, ' ')
  const published = new Date(tag(item, 'pubDate'))

  return {
    title,
    href: link,
    date: Number.isNaN(published.getTime()) ? '' : published.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }),
    topic: category ? category[0].toUpperCase() + category.slice(1) : 'Story',
    readTime: `${Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))} min read`,
    excerpt: truncate(paragraphs[0] ?? stripTags(content), 190),
    quote: blockquote ? truncate(stripTags(blockquote[1]), 180) : undefined,
  }
}

async function loadArticles() {
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.articles
  const feed = await fetch(FEED_URL, { headers: { Accept: 'application/rss+xml' }, signal: AbortSignal.timeout(10_000) })
  if (!feed.ok) throw new Error(`Medium responded with ${feed.status}`)
  const xml = await feed.text()
  const articles = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((match) => parseItem(match[1])).filter((article): article is MediumArticle => article !== null)
  cache = { at: Date.now(), articles }
  return articles
}

export default async function handler(request: ApiRequest, response: ApiResponse) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET')
    return response.status(405).json({ error: 'Method not allowed.' })
  }

  try {
    const articles = await loadArticles()
    response.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=86400')
    return response.status(200).json({ articles })
  } catch (error) {
    console.error('Medium feed could not be loaded:', error)
    if (cache) return response.status(200).json({ articles: cache.articles, stale: true })
    return response.status(502).json({ error: 'Medium feed is unavailable right now.' })
  }
}
