# Mehul Sain — Portfolio

A cyber-futuristic portfolio built with React, TypeScript, Vite, Framer Motion, GSAP and a secure Nodemailer contact endpoint.

## Local development

Requirements: Node.js 20.19 or newer and npm.

```bash
npm ci
Copy-Item .env.example .env
npm run dev
```

`npm run dev` runs the frontend. The `/api/contact` serverless function runs automatically after deployment on Vercel. To test both the frontend and function locally, use the Vercel CLI:

```bash
npx vercel dev
```

## Contact email configuration

Copy `.env.example` to `.env` and replace the placeholder values. These variables are server-only and must never use a `VITE_` prefix:

| Variable | Required | Purpose |
| --- | --- | --- |
| `SMTP_HOST` | Yes | SMTP server, such as `smtp.gmail.com` |
| `SMTP_PORT` | Yes | Usually `465` for secure SMTP or `587` for STARTTLS |
| `SMTP_SECURE` | Yes | `true` for port 465; normally `false` for port 587 |
| `SMTP_USER` | Yes | SMTP account email address |
| `SMTP_PASS` | Yes | SMTP or provider app password |
| `CONTACT_TO` | Yes | Inbox that receives enquiries |
| `CONTACT_FROM` | Yes | Verified sender; normally the same as `SMTP_USER` |
| `VITE_WHATSAPP_NUMBER` | No | Keeps the separate WhatsApp profile link enabled |

For Gmail, enable two-step verification and create a Google App Password. Use that 16-character app password as `SMTP_PASS`; do not use your regular Google password.

When deploying on Vercel, add the same SMTP variables under **Project Settings → Environment Variables**, then redeploy. Do not commit a real `.env` file.

## Quality checks

```bash
npm run check
```

This runs ESLint, TypeScript compilation and the optimized Vite build.
