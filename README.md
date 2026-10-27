# Mehul Sain — Portfolio

Personal site for Mehul Sain, built with React, TypeScript, Vite, Tailwind CSS, Framer Motion, and GSAP.

The page is one scroll: hero, about, journey, selected work, and contact. It includes a loader, theme toggle, magnetic buttons, a custom cursor, and a WhatsApp link from `VITE_WHATSAPP_NUMBER`. Profile copy lives in `src/data/profile.ts`.

## Local development

Requirements: Node.js 20.19 or newer and npm.

```bash
npm ci
Copy-Item .env.example .env
npm run dev
```

Update `.env` with the values for your environment. Variables prefixed with `VITE_` are embedded in the browser bundle and must never contain secrets.

| Variable | Required | Purpose |
| --- | --- | --- |
| `VITE_WHATSAPP_NUMBER` | Yes | WhatsApp destination in E.164 digits, without `+` |
| `VITE_API_URL` | Only when using the API helpers | Backend URL without a trailing slash |

## Quality checks

```bash
npm run check
```

This runs ESLint, TypeScript compilation, and the optimized Vite production build. The deployable output is generated in `dist/`.

## Deploy to Vercel

1. Import the repository into Vercel.
2. Add `VITE_WHATSAPP_NUMBER` under Project Settings → Environment Variables.
3. Add `VITE_API_URL` if the backend API helpers are used.
4. Deploy. `vercel.json` defines the build, output directory, asset caching, and baseline security headers.

The same app can be deployed to any static host by running `npm ci && npm run build` and publishing `dist/`.

## Environment safety

Local `.env` variants, build output, dependencies, logs, coverage, and tool caches are ignored by Git. Only `.env.example` is committed as the configuration template.
