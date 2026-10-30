import { TiltCard } from '../TiltCard'
import { TechIcon } from '../TechIcon'
import { allTech, techGroups } from '../../data/stack'

const floating = ['Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'React']

export function TechStack() {
  return (
    <section id="stack" className="section stack">
      <div className="container">
        <header className="section-head stack-head" data-reveal>
          <p className="section-label"><span>04</span> Tech stack</p>
          <h2 className="section-title">The tools behind <em>the products.</em></h2>
          <div className="stack-float" aria-hidden="true">
            {floating.map((name, index) => {
              const tech = allTech.find((item) => item.name === name)
              return <span key={name} className={`float-chip float-chip-${index}`}>{tech && <TechIcon tech={tech} />}{name}</span>
            })}
          </div>
        </header>

        <div className="stack-grid">
          {techGroups.map((group) => (
            <TiltCard key={group.id} className="glass-card stack-card" data-reveal>
              <div className="stack-card-head">
                <h3>{group.title}</h3>
                <span>{String(group.items.length).padStart(2, '0')}</span>
              </div>
              <p>{group.note}</p>
              <ul>
                {group.items.map((tech) => <li key={tech.name}><TechIcon tech={tech} />{tech.name}</li>)}
              </ul>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  )
}
