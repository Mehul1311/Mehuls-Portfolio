import { type SimpleIcon, siBootstrap, siCplusplus, siDocker, siExpress, siFirebase, siFramer, siGit, siGithub, siGithubactions, siGooglegemini, siGsap, siHtml5, siJavascript, siMongodb, siNextdotjs, siNodedotjs, siPhp, siPostgresql, siPostman, siPython, siRailway, siRazorpay, siReact, siRedis, siTailwindcss, siTypescript, siVercel } from 'simple-icons'

export type Tech = { name: string; mark: string; icon?: SimpleIcon }
export type TechGroup = { id: string; title: string; note: string; items: Tech[] }

// Only technologies listed on the GitHub profile, in project READMEs or used in this codebase.
export const techGroups: TechGroup[] = [
  {
    id: 'frontend',
    title: 'Frontend',
    note: 'Interfaces, motion and component systems',
    items: [
      { name: 'React', mark: 'Re', icon: siReact },
      { name: 'Next.js', mark: 'N', icon: siNextdotjs },
      { name: 'HTML & CSS', mark: '</>', icon: siHtml5 },
      { name: 'Tailwind CSS', mark: 'Tw', icon: siTailwindcss },
      { name: 'Bootstrap', mark: 'Bs', icon: siBootstrap },
      { name: 'Framer Motion', mark: 'Fm', icon: siFramer },
      { name: 'GSAP', mark: 'Gs', icon: siGsap },
    ],
  },
  {
    id: 'backend',
    title: 'Backend',
    note: 'APIs, auth, payments and integrations',
    items: [
      { name: 'Node.js', mark: 'No', icon: siNodedotjs },
      { name: 'Express.js', mark: 'Ex', icon: siExpress },
      { name: 'REST APIs', mark: '{ }' },
      { name: 'Firebase Auth', mark: 'Fb', icon: siFirebase },
      { name: 'WebSockets', mark: 'Ws' },
      { name: 'Razorpay', mark: 'Rp', icon: siRazorpay },
      { name: 'Cashfree', mark: 'Cf' },
    ],
  },
  {
    id: 'databases',
    title: 'Databases',
    note: 'Relational, document and realtime data',
    items: [
      { name: 'PostgreSQL', mark: 'Pg', icon: siPostgresql },
      { name: 'MongoDB', mark: 'Mg', icon: siMongodb },
      { name: 'Firebase RTDB', mark: 'Rt', icon: siFirebase },
      { name: 'Redis', mark: 'Rd', icon: siRedis },
    ],
  },
  {
    id: 'cloud',
    title: 'DevOps & Cloud',
    note: 'Containers, pipelines and hosting',
    items: [
      { name: 'Docker', mark: 'Dk', icon: siDocker },
      { name: 'GitHub Actions', mark: 'GA', icon: siGithubactions },
      { name: 'Vercel', mark: '▲', icon: siVercel },
      { name: 'Railway', mark: 'Rw', icon: siRailway },
    ],
  },
  {
    id: 'languages',
    title: 'Programming Languages',
    note: 'Typed, scripted and systems',
    items: [
      { name: 'JavaScript', mark: 'JS', icon: siJavascript },
      { name: 'TypeScript', mark: 'TS', icon: siTypescript },
      { name: 'C++', mark: 'C+', icon: siCplusplus },
      { name: 'Python', mark: 'Py', icon: siPython },
      { name: 'PHP', mark: 'Ph', icon: siPhp },
      { name: 'SQL', mark: 'Sq' },
    ],
  },
  {
    id: 'tools',
    title: 'Tools & AI',
    note: 'Workflow, testing and AI tooling',
    items: [
      { name: 'Git', mark: 'Gt', icon: siGit },
      { name: 'GitHub', mark: 'Gh', icon: siGithub },
      { name: 'Postman', mark: 'Pm', icon: siPostman },
      { name: 'EasyOCR', mark: 'Oc' },
      { name: 'Gemini API', mark: 'Gm', icon: siGooglegemini },
    ],
  },
]

export const allTech = techGroups.flatMap((group) => group.items)
