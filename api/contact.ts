import nodemailer from 'nodemailer'

type ApiRequest = {
  method?: string
  body?: Record<string, unknown>
}

type ApiResponse = {
  setHeader: (name: string, value: string) => void
  status: (code: number) => ApiResponse
  json: (body: unknown) => void
}

const MAX_NAME_LENGTH = 100
const MAX_EMAIL_LENGTH = 254
const MAX_MESSAGE_LENGTH = 5000
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function clean(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

function cleanSingleLine(value: unknown, maxLength: number) {
  return clean(value, maxLength).replace(/[\r\n\t]+/g, ' ')
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  })[character] ?? character)
}

export default async function handler(request: ApiRequest, response: ApiResponse) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return response.status(405).json({ error: 'Method not allowed.' })
  }

  const name = cleanSingleLine(request.body?.name, MAX_NAME_LENGTH)
  const email = cleanSingleLine(request.body?.email, MAX_EMAIL_LENGTH).toLowerCase()
  const message = clean(request.body?.message, MAX_MESSAGE_LENGTH)
  const website = clean(request.body?.website, 200)

  // Hidden honeypot field: bots commonly fill it, people never see it.
  if (website) return response.status(200).json({ ok: true })

  if (name.length < 2 || !EMAIL_PATTERN.test(email) || message.length < 10) {
    return response.status(400).json({ error: 'Please provide a valid name, email and message.' })
  }

  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT ?? 587)
  const user = process.env.SMTP_USER
  // Google displays app passwords in four groups; SMTP expects the spaces removed.
  const password = process.env.SMTP_PASS?.replace(/\s+/g, '')
  const recipient = process.env.CONTACT_TO ?? user
  const sender = process.env.CONTACT_FROM ?? user

  if (!host || !user || !password || !recipient || !sender || !Number.isFinite(port)) {
    console.error('Contact email environment variables are incomplete.')
    return response.status(503).json({ error: 'Email service is not configured yet.' })
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: process.env.SMTP_SECURE === 'true' || port === 465,
      auth: { user, pass: password },
      connectionTimeout: 12_000,
      greetingTimeout: 12_000,
      socketTimeout: 20_000,
    })

    await transporter.sendMail({
      from: `Portfolio Contact <${sender}>`,
      to: recipient,
      replyTo: email,
      subject: `Portfolio enquiry from ${name}`,
      text: `New portfolio enquiry\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `<div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;padding:28px;color:#102326"><p style="font-size:12px;letter-spacing:2px;color:#16858b">NEW PORTFOLIO TRANSMISSION</p><h1 style="font-size:26px">Message from ${escapeHtml(name)}</h1><p><strong>Reply to:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p><hr style="border:0;border-top:1px solid #d6e4e4;margin:24px 0"><p style="line-height:1.7;white-space:pre-wrap">${escapeHtml(message)}</p></div>`,
    })

    return response.status(200).json({ ok: true })
  } catch (error) {
    console.error('Contact email delivery failed:', error)
    return response.status(500).json({ error: 'The message could not be delivered. Please try again.' })
  }
}
