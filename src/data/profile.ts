export type Project = {
  id: string
  title: string
  client: string
  category: string
  summary: string
  tags: readonly string[]
  href: string
  repo?: string
  kind: 'live' | 'repo'
  dashboard?: string
  map: { x: number; y: number; hue: number }
}

const projects: Project[] = [
  {
    id: 'campusnest',
    title: 'CampusNest',
    client: 'SaaS · Campus marketplace',
    category: 'Full-stack product',
    summary: 'A campus marketplace where students list, search by college, add to cart and pay — with an admin console for stats, users, items, orders and activity logs.',
    tags: ['Next.js', 'PostgreSQL', 'Express', 'Razorpay', 'Docker'],
    href: 'https://campusnest.in/',
    repo: 'https://github.com/Mehul1311/CampusNest',
    kind: 'live',
    dashboard: 'campusnest',
    map: { x: 50, y: 40, hue: 250 },
  },
  {
    id: 'oldtadka',
    title: 'Old Tadka Dhaba',
    client: 'Restaurant · Jaipur',
    category: 'Online ordering platform',
    summary: 'Ordering site for a pure-veg kitchen in Malviya Nagar — categorised menu, portion choices, synced cart and bill totals, OTP sign-in and live order updates.',
    tags: ['Online ordering', 'OTP auth', 'Cart & billing', 'Live orders'],
    href: 'https://oldtadkadhaba.com/',
    kind: 'live',
    dashboard: 'oldtadka',
    map: { x: 28, y: 54, hue: 188 },
  },
  {
    id: 'urbantheka',
    title: 'UrbanTheka',
    client: 'Fashion brand · Mohali',
    category: 'E-commerce storefront',
    summary: 'Storefront for a Punjabi streetwear label — shop-by-collection for tees, hoodies and lowers, brand story and store location for The House of UrbanTheka.',
    tags: ['E-commerce', 'Collections', 'Brand', 'Responsive'],
    href: 'https://urbantheka.in/',
    kind: 'live',
    dashboard: 'urbantheka',
    map: { x: 71, y: 56, hue: 275 },
  },
  {
    id: 'cabshare',
    title: 'Cab Share',
    client: 'Ride sharing · MERN',
    category: 'Marketplace platform',
    summary: 'Ride sharing for riders, drivers and admins — Firebase auth, MongoDB rides, Cashfree seat payments with automatic driver payout and platform commission.',
    tags: ['React', 'Express', 'MongoDB', 'Cashfree', 'Firebase'],
    href: 'https://cab-share-platform.vercel.app',
    repo: 'https://github.com/Mehul1311/Cab-Share-Platform',
    kind: 'live',
    dashboard: 'cabshare',
    map: { x: 40, y: 74, hue: 165 },
  },
  {
    id: 'kyc',
    title: 'KYC Verify',
    client: 'AI · Document verification',
    category: 'Automation system',
    summary: 'AI-powered KYC: users upload identity documents, EasyOCR extracts the details and admins review them through a role-based verification workflow.',
    tags: ['React', 'Node.js', 'EasyOCR', 'Python', 'Firebase'],
    href: 'https://github.com/Mehul1311/KYC-Project',
    kind: 'repo',
    dashboard: 'kyc',
    map: { x: 63, y: 27, hue: 215 },
  },
  {
    id: 'lastminute',
    title: 'LastMinute',
    client: 'AI · Productivity',
    category: 'Planning companion',
    summary: 'An AI planning agent that parses tasks from plain language, ranks priorities, breaks work into steps and plans your day with Gemini.',
    tags: ['React', 'TypeScript', 'Gemini API', 'Framer Motion'],
    href: 'https://github.com/Mehul1311/lastminute-ai',
    kind: 'repo',
    map: { x: 82, y: 38, hue: 315 },
  },
  {
    id: 'sev7n',
    title: 'Sev7n',
    client: 'Local brand · Hometown',
    category: 'Brand website',
    summary: 'A web presence for a brand from my hometown, built and shipped on Vercel.',
    tags: ['JavaScript', 'Brand', 'Vercel'],
    href: 'https://sev7n-ten.vercel.app/',
    repo: 'https://github.com/Mehul1311/Sev7n',
    kind: 'live',
    map: { x: 22, y: 30, hue: 232 },
  },
  {
    id: 'jarvis',
    title: 'JARVIS',
    client: 'Python · Assistant',
    category: 'Automation experiment',
    summary: 'A Python virtual assistant that listens, responds and automates everyday desktop tasks.',
    tags: ['Python', 'Assistant', 'Automation'],
    href: 'https://github.com/Mehul1311/JARVIS',
    kind: 'repo',
    map: { x: 57, y: 86, hue: 200 },
  },
]

export const profile = {
  name: 'Mehul Sain',
  initials: 'MS',
  email: 'mehulsain1603@gmail.com',
  shortTitle: 'Full-stack developer',
  role: 'Software Engineer | Full Stack Developer',
  intro: 'I build scalable software and modern web applications that solve real-world problems — from clean APIs and data models to interfaces that feel effortless.',
  location: 'Jaipur, Rajasthan',
  headline: 'Building reliable, AI-ready web products.',
  heroLead: 'Building reliable,',
  heroAccent: 'AI-ready web products.',
  subhead: 'I care about clean, maintainable code and scalable systems — and I’m going deeper into system design, backend architecture and DSA while preparing for SDE roles.',
  badge: 'Full-stack · Modern web products',
  heroStatTitle: 'Open to opportunities',
  heroStatSubtitle: 'Internships · freelance · collaboration',
  heroPhoto: '/profile-photo.jpg',
  heroPhotoRemote: 'https://unavatar.io/github/Mehul1311',
  heroPhotoAlt: 'Mehul Sain — portrait',
  links: {
    linkedin: 'https://www.linkedin.com/in/mehulsain/',
    github: 'https://github.com/Mehul1311',
    githubRepos: 'https://github.com/Mehul1311?tab=repositories',
    medium: 'https://medium.com/@mehulsain1603',
  },
  about: `I'm Mehul Sain, a software engineer and full-stack developer working across the MERN stack and Next.js, turning ideas into real products — storefronts, ordering systems, marketplaces, admin dashboards and payment flows.

I currently work as a Software Engineer at Techyukt Solutions, shipping production MERN features and third-party API integrations. Alongside that I've built CampusNest — a campus marketplace with Razorpay checkout, Docker and an admin console — and an AI-powered KYC system that reads identity documents with EasyOCR.

Right now I'm learning advanced Next.js, system design (LLD / HLD), scalable backend architecture and data structures & algorithms.`,
  skills: ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'Docker', 'Python', 'C++', 'REST APIs'],
  marquee: ['Full-stack', 'React', 'AI-ready UX', 'REST APIs', 'MongoDB', 'Python', 'UI systems', 'GitHub', 'Performance', 'Motion'],
  certifications: [
    'Full Stack Development — Apna College',
    'Building Web Applications in PHP — Coursera',
    'HTML, CSS & JavaScript for Web Developers — Coursera',
  ],
  experience: [
    {
      role: 'Software Engineer',
      company: 'Techyukt Solutions',
      time: 'Present',
      bullets: [
        'Worked on production web applications with the MERN stack across frontend and backend.',
        'Optimised application performance and integrated third-party APIs.',
        'Collaborated through Git, pull requests and Agile workflows.',
      ],
    },
    {
      role: 'Master of Computer Applications',
      company: 'Lovely Professional University',
      time: '2025 — 2027',
      bullets: [
        'Focused on system design, scalable backend architecture and DSA.',
        'Building full-stack and AI-integrated projects alongside coursework.',
      ],
    },
    {
      role: 'Bachelor of Computer Applications',
      company: 'University of Rajasthan',
      time: '2022 — 2025',
      bullets: [
        'Foundations in programming, databases and web development.',
        'Certified in full-stack development (Apna College) and PHP / web development (Coursera).',
      ],
    },
  ],
  projects,
  articles: [
    {
      title: 'At 19, I Thought I Had Lost at Life. At 22, I Finally Understand It.',
      href: 'https://medium.com/@mehulsain1603/at-19-i-thought-i-had-lost-at-life-at-22-i-finally-understand-it-9ea8d6830deb',
      date: 'Oct 29, 2026',
      topic: 'A life lesson',
      readTime: '5 min read',
      excerpt: 'For most of my life, I wanted everyone to like me. I was so confident in my own perspective that I rarely considered the possibility that I could be wrong…',
      quote: 'Trust your life. Trust your timing. And never let losing someone become the reason you lose yourself.',
    },
  ],
}
