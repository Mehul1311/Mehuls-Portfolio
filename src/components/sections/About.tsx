import { TiltCard } from '../TiltCard'
import { profile } from '../../data/profile'

const [journey, built, exploring] = profile.about.split('\n\n')

const cards = [
  { index: '01', title: 'What I build', body: journey, wide: true },
  { index: '02', title: 'Where I’ve shipped', body: built },
  { index: '03', title: 'Engineering mindset', body: profile.subhead },
  { index: '04', title: 'Learning next', body: exploring },
]

const facts = [
  { label: 'Location', value: profile.location },
  { label: 'Education', value: 'MCA · LPU · 2025–27' },
  { label: 'Experience', value: 'Software Engineer · Techyukt Solutions' },
  { label: 'Live products', value: String(profile.projects.filter((project) => project.kind === 'live').length) },
  { label: 'Status', value: profile.heroStatTitle },
]

export function About() {
  return (
    <section id="about" className="section about">
      <div className="container">
        <header className="section-head" data-reveal>
          <p className="section-label"><span>03</span> About</p>
          <h2 className="section-title">Engineering software that feels <em>effortless</em> to use.</h2>
        </header>

        <div className="about-layout">
          <div className="about-cards">
            {cards.map((card) => (
              <TiltCard key={card.index} className={`glass-card about-card${card.wide ? ' about-card--wide' : ''}`} data-reveal>
                <span className="card-index">{card.index}</span>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </TiltCard>
            ))}
          </div>

          <aside className="glass-card about-facts" data-reveal>
            <p className="facts-title">Profile</p>
            <dl>
              {facts.map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}
            </dl>
            <div className="facts-skills">
              {profile.skills.map((skill) => <span key={skill}>{skill}</span>)}
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
