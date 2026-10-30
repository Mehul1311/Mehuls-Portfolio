import { useMemo, useState } from 'react'

type Status = 'idle' | 'sending' | 'sent' | 'error'

type ApiResponse = {
  ok?: boolean
  error?: string
}

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [website, setWebsite] = useState('')
  const disabled = status === 'sending'
  const canSubmit = useMemo(() => name.trim().length >= 2 && email.trim().length >= 5 && message.trim().length >= 10, [name, email, message])

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!canSubmit || disabled) return
    setStatus('sending')
    setError(null)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, website }),
      })
      const result = await response.json().catch(() => ({})) as ApiResponse
      if (!response.ok || !result.ok) throw new Error(result.error ?? 'The email API is unavailable. Restart the development server and try again.')

      setStatus('sent')
      setName('')
      setEmail('')
      setMessage('')
      window.setTimeout(() => setStatus('idle'), 5000)
    } catch (caught) {
      setStatus('error')
      setError(caught instanceof Error ? caught.message : 'Transmission failed. Please try again.')
    }
  }

  return (
    <form className="cyber-form" onSubmit={onSubmit}>
      <input className="form-honeypot" name="website" value={website} onChange={(event) => setWebsite(event.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className="form-grid">
        <label className="field-label">01 / Your name<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Enter identification" disabled={disabled} autoComplete="name" maxLength={100} required /></label>
        <label className="field-label">02 / Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@domain.com" disabled={disabled} autoComplete="email" maxLength={254} required /></label>
        <label className="field-label">03 / Project brief<textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Describe the idea, problem or mission..." disabled={disabled} minLength={10} maxLength={5000} required /></label>
      </div>
      <div className="form-footer"><button className="submit-signal" type="submit" disabled={!canSubmit || disabled}>{status === 'sending' ? 'Transmitting...' : status === 'sent' ? 'Signal sent ✓' : 'Send message ↗'}</button><span className="form-hint">SECURE EMAIL CHANNEL<br />RESPONSE / ~24H</span></div>
      {status === 'error' && error && <p className="form-message error">ERROR: {error}</p>}
      {status === 'sent' && <p className="form-message">SUCCESS: Your message was delivered.</p>}
    </form>
  )
}
