import { defineConfig, loadEnv, type Connect, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import contactHandler from './api/contact'
import mediumHandler from './api/medium'

function localContactApi(): Plugin {
  const mount = (middlewares: Connect.Server) => {
      middlewares.use('/api/contact', async (request, response) => {
        let rawBody = ''
        for await (const chunk of request) rawBody += chunk.toString()

        let body: Record<string, unknown> = {}
        try {
          body = rawBody ? JSON.parse(rawBody) as Record<string, unknown> : {}
        } catch {
          response.statusCode = 400
          response.setHeader('Content-Type', 'application/json')
          response.end(JSON.stringify({ error: 'Invalid request body.' }))
          return
        }

        const apiResponse = {
          setHeader(name: string, value: string) {
            response.setHeader(name, value)
          },
          status(code: number) {
            response.statusCode = code
            return apiResponse
          },
          json(payload: unknown) {
            response.setHeader('Content-Type', 'application/json')
            response.end(JSON.stringify(payload))
          },
        }

        await contactHandler({ method: request.method, body }, apiResponse)
      })

      middlewares.use('/api/medium', async (request, response) => {
        const apiResponse = {
          setHeader(name: string, value: string) {
            response.setHeader(name, value)
          },
          status(code: number) {
            response.statusCode = code
            return apiResponse
          },
          json(payload: unknown) {
            response.setHeader('Content-Type', 'application/json')
            response.end(JSON.stringify(payload))
          },
        }

        await mediumHandler({ method: request.method }, apiResponse)
      })
  }
  return {
    name: 'local-contact-api',
    configureServer(server) { mount(server.middlewares) },
    configurePreviewServer(server) { mount(server.middlewares) },
  }
}

function seo(siteUrl: string, googleVerification?: string): Plugin {
  return {
    name: 'seo',
    transformIndexHtml(html) {
      const verification = googleVerification ? `<meta name="google-site-verification" content="${googleVerification}" />` : ''
      return html.replaceAll('%SITE_URL%', siteUrl).replace('<!-- seo:verification -->', verification)
    },
    generateBundle() {
      const today = new Date().toISOString().slice(0, 10)
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
      })
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${siteUrl}/</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>\n`,
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  // Vite exposes only VITE_* variables to the browser, but the local API needs
  // all server-only SMTP variables inside this Node process.
  Object.assign(process.env, loadEnv(mode, '.', ''))

  // Production always publishes the official domain so the sitemap, canonical
  // signals, and structured data cannot drift to a preview or Vercel host.
  const configuredUrl = process.env.SITE_URL?.replace(/\/+$/, '')
  const siteUrl = (configuredUrl?.startsWith('https://')
    ? configuredUrl
    : mode === 'production'
      ? 'https://www.mehulsain.in'
      : 'http://localhost:4173')

  return {
    plugins: [localContactApi(), seo(siteUrl, process.env.GOOGLE_SITE_VERIFICATION), react(), tailwindcss()],
    preview: { allowedHosts: ['.trycloudflare.com'] },
    build: {
      rolldownOptions: {
        output: {
          codeSplitting: {
            groups: [
              { name: 'react', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
              { name: 'gsap', test: /node_modules[\\/]gsap[\\/]/ },
            ],
          },
        },
      },
    },
  }
})
