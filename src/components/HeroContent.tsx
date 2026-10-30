import { MagneticButton } from './MagneticButton'
import { GitHubIcon, LinkedInIcon } from './Icons'
import { profile } from '../data/profile'

export function HeroContent() {
  const [first, last] = profile.name.split(' ')
  const [primaryRole, secondaryRole] = profile.role.split(' | ')
  return (
    <div className="hero">
      <div className="hero-glow" aria-hidden="true" />
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-inner">
        <p className="hero-kicker" data-hero-item><i aria-hidden="true" /> {profile.heroStatTitle} <span>·</span> {profile.location}</p>
        <p className="hero-title" data-hero-item>
          <span>{first}</span> <span className="hero-title-accent">{last}</span>
        </p>
        <p className="hero-role" data-hero-item>{primaryRole}<span aria-hidden="true" /> {secondaryRole}</p>
        <p className="hero-lead" data-hero-item>{profile.intro}</p>
        <div className="hero-ctas" data-hero-item>
          <MagneticButton href="#projects">View Projects</MagneticButton>
          <MagneticButton href="#contact" variant="ghost">Contact Me</MagneticButton>
        </div>
        <div className="hero-social" data-hero-item>
          <a href={profile.links.github} target="_blank" rel="noreferrer" aria-label="GitHub profile"><GitHubIcon /> GitHub</a>
          <a href={profile.links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn profile"><LinkedInIcon /> LinkedIn</a>
        </div>
      </div>
      <div className="hero-code" aria-hidden="true" data-hero-item>
        <div className="hero-code-bar"><i /><i /><i /><span>engineer.ts</span></div>
        <pre>
          <code>
            <span className="k">const</span> engineer = {'{'}{'\n'}
            {'  '}name: <span className="s">'{profile.name}'</span>,{'\n'}
            {'  '}role: <span className="s">'{primaryRole}'</span>,{'\n'}
            {'  '}stack: [<span className="s">'Next.js'</span>, <span className="s">'Node.js'</span>,{'\n'}
            {'          '}<span className="s">'PostgreSQL'</span>, <span className="s">'Docker'</span>],{'\n'}
            {'  '}shipped: [<span className="s">'CampusNest'</span>, <span className="s">'UrbanTheka'</span>,{'\n'}
            {'            '}<span className="s">'Old Tadka Dhaba'</span>],{'\n'}
            {'  '}location: <span className="s">'{profile.location}'</span>,{'\n'}
            {'}'}{'\n\n'}
            <span className="k">await</span> engineer.<span className="f">ship</span>(<span className="s">'next idea'</span>)<span className="caret" />
          </code>
        </pre>
      </div>
      <div className="hero-scroll" aria-hidden="true"><span />Scroll to explore</div>
    </div>
  )
}
