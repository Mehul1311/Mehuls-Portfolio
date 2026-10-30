import { ContactForm } from '../ContactForm'
import { ArrowIcon, GitHubIcon, LinkedInIcon, MailIcon, MediumIcon, WhatsAppIcon } from '../Icons'
import { profile } from '../../data/profile'
import { getWhatsAppUrl } from '../../lib/env'

export function Contact() {
  const whatsappUrl = getWhatsAppUrl()
  const channels = [
    { label: 'LinkedIn', detail: 'Professional profile', href: profile.links.linkedin, icon: <LinkedInIcon /> },
    { label: 'GitHub', detail: '@Mehul1311', href: profile.links.github, icon: <GitHubIcon /> },
    { label: 'Medium', detail: '@mehulsain1603', href: profile.links.medium, icon: <MediumIcon /> },
    ...(whatsappUrl ? [{ label: 'WhatsApp', detail: 'Quick chat', href: whatsappUrl, icon: <WhatsAppIcon /> }] : []),
  ]

  return (
    <section id="contact" className="section contact">
      <div className="contact-halo" aria-hidden="true" />
      <div className="container contact-layout">
        <div className="contact-intro" data-reveal>
          <p className="section-label"><span>07</span> Contact</p>
          <h2 className="contact-title">Have an interesting idea? <em>Let's build something.</em></h2>
          <p className="section-copy">Have an ambitious product, a strange idea, or a problem worth solving? Send a message — I usually reply within 24 hours.</p>

          <a className="contact-email" href={`mailto:${profile.email}`}>
            <span className="contact-email-icon"><MailIcon /></span>
            <span><b>Email me</b><small>{profile.email}</small></span>
            <ArrowIcon />
          </a>

          <ul className="contact-channels">
            {channels.map((channel) => (
              <li key={channel.label}>
                <a href={channel.href} target="_blank" rel="noreferrer">
                  {channel.icon}
                  <span><b>{channel.label}</b><small>{channel.detail}</small></span>
                  <ArrowIcon />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div id="contact-form" className="glass-card contact-panel" data-reveal>
          <div className="contact-panel-head">
            <span>New message</span>
            <span><i aria-hidden="true" /> Secure channel</span>
          </div>
          <ContactForm />
        </div>
      </div>
    </section>
  )
}
