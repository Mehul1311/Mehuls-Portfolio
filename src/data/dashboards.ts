export type KpiFormat = 'int' | 'inr' | 'pct' | 'min' | 'sec' | 'rating'

export type Kpi = { label: string; value: number; step: number; format: KpiFormat; min?: number; max?: number; fixed?: boolean }

export type Series = { label: string; value: number }

export type DashboardPanel =
  | { type: 'bars'; title: string; items: Series[] }
  | { type: 'funnel'; title: string; items: Series[] }
  | { type: 'split'; title: string; items: Series[]; center: string; caption: string }
  | { type: 'board'; title: string; columns: [string, string, string]; items: string[] }

export type Dashboard = {
  id: string
  product: string
  module: string
  kind: string
  path: string
  nav: string[]
  kpis: Kpi[]
  chart: { title: string; base: number; spread: number }
  panel: DashboardPanel
  feed: { templates: string[]; pools: Record<string, string[]> }
}

// Concept consoles for real products. Every number is simulated in the browser; only menu items,
// collections, the 4.6 rating and the 10% commission come from the live sites / READMEs.
export const dashboards: Dashboard[] = [
  {
    id: 'campusnest',
    product: 'CampusNest',
    module: 'Admin console',
    kind: 'ERP',
    path: 'campusnest / admin',
    nav: ['Overview', 'Listings', 'Orders', 'Users', 'Activity logs'],
    kpis: [
      { label: 'Active listings', value: 1284, step: 4, format: 'int' },
      { label: 'Orders today', value: 86, step: 2, format: 'int' },
      { label: 'GMV today', value: 142300, step: 1400, format: 'inr' },
      { label: 'Students online', value: 312, step: 9, format: 'int', min: 180, max: 520 },
    ],
    chart: { title: 'Orders · live', base: 60, spread: 26 },
    panel: { type: 'bars', title: 'Listings by category', items: [
      { label: 'Books', value: 38 }, { label: 'Electronics', value: 26 }, { label: 'Hostel essentials', value: 18 }, { label: 'Cycles', value: 10 },
    ] },
    feed: {
      templates: ['New listing in {cat}', 'Order #{id} paid via Razorpay · {amt}', 'Student signed up · {place}', 'Admin approved listing #{id}', 'Item marked sold · {cat}'],
      pools: { cat: ['Books', 'Electronics', 'Hostel essentials', 'Cycles'], place: ['North campus', 'Hostel B4', 'Main block', 'Library lane'], amt: ['₹450', '₹799', '₹1,200', '₹2,999', '₹3,450'] },
    },
  },
  {
    id: 'oldtadka',
    product: 'Old Tadka Dhaba',
    module: 'Kitchen OS',
    kind: 'POS',
    path: 'oldtadka / kitchen',
    nav: ['Live orders', 'Menu', 'Kitchen', 'Pickup', 'Reports'],
    kpis: [
      { label: 'Live orders', value: 14, step: 2, format: 'int', min: 6, max: 28 },
      { label: 'Avg prep time', value: 18, step: 1, format: 'min', min: 12, max: 26 },
      { label: 'Revenue today', value: 38420, step: 420, format: 'inr' },
      { label: 'Guest rating', value: 4.6, step: 0, format: 'rating', fixed: true },
    ],
    chart: { title: 'Orders per hour', base: 22, spread: 10 },
    panel: { type: 'board', title: 'Kitchen tickets', columns: ['New', 'Cooking', 'Ready'], items: [
      'Paneer Dum Biryani', 'Rajasthani Thali', 'Special Thali', 'Rajma Masala', 'Sarson Ka Saag', 'Dahi Fry', 'Bhindi Masala', 'Momos', 'Dosa', 'Chaap Gravy', 'Roll', 'Chowmein',
    ] },
    feed: {
      templates: ['Order #{id} · {dish} × {qty}', 'OTP verified · new guest', '{dish} marked ready', 'Order #{id} paid · {amt}', 'Pickup collected · #{id}'],
      pools: { dish: ['Paneer Dum Biryani', 'Rajasthani Thali', 'Special Thali', 'Rajma Masala', 'Dosa', 'Momos'], qty: ['1', '2', '3'], amt: ['₹180', '₹260', '₹349', '₹540', '₹720'] },
    },
  },
  {
    id: 'urbantheka',
    product: 'UrbanTheka',
    module: 'Commerce CRM',
    kind: 'CRM',
    path: 'urbantheka / crm',
    nav: ['Dashboard', 'Customers', 'Orders', 'Collections', 'Campaigns'],
    kpis: [
      { label: 'Visitors now', value: 248, step: 12, format: 'int', min: 120, max: 420 },
      { label: 'Conversion', value: 3.4, step: 0.1, format: 'pct', min: 2.4, max: 4.8 },
      { label: 'Avg order value', value: 1890, step: 30, format: 'inr', min: 1500, max: 2400 },
      { label: 'Repeat customers', value: 41, step: 0.4, format: 'pct', min: 36, max: 48 },
    ],
    chart: { title: 'Revenue · live', base: 70, spread: 22 },
    panel: { type: 'funnel', title: 'Customer journey', items: [
      { label: 'Visitors', value: 100 }, { label: 'Product views', value: 62 }, { label: 'Added to cart', value: 21 }, { label: 'Checkout', value: 9 }, { label: 'Paid', value: 6 },
    ] },
    feed: {
      templates: ['{product} added to cart · {city}', 'Order #{id} · {product} · {amt}', 'New customer from {city}', '{product} restocked · size {size}', 'Abandoned cart recovered · {amt}'],
      pools: { product: ["Men's T-shirt", "Men's Hoodie", "Men's Lower", 'Punjabi Royalty tee'], city: ['Mohali', 'Chandigarh', 'Ludhiana', 'Amritsar', 'Jalandhar'], size: ['S', 'M', 'L', 'XL'], amt: ['₹999', '₹1,499', '₹1,899', '₹2,598'] },
    },
  },
  {
    id: 'cabshare',
    product: 'Cab Share',
    module: 'Payments & payouts',
    kind: 'Fintech',
    path: 'cabshare / payments',
    nav: ['Rides', 'Drivers', 'Payments', 'Payouts', 'Admin'],
    kpis: [
      { label: 'Rides live', value: 37, step: 3, format: 'int', min: 18, max: 60 },
      { label: 'Seats booked today', value: 214, step: 3, format: 'int' },
      { label: 'Driver payouts', value: 52860, step: 540, format: 'inr' },
      { label: 'Platform fee · 10%', value: 5873, step: 60, format: 'inr' },
    ],
    chart: { title: 'Bookings · live', base: 40, spread: 15 },
    panel: { type: 'split', title: 'Fare split per seat', items: [{ label: 'Driver payout', value: 90 }, { label: 'Platform commission', value: 10 }], center: '90 / 10', caption: 'Cashfree order → verify → split' },
    feed: {
      templates: ['Seat booked · {route} · {amt}', 'Cashfree payment verified · #{id}', 'Driver payout released · {amt}', 'New ride posted · {route}', 'Rider signed in with Firebase'],
      pools: { route: ['Mohali → Chandigarh', 'Phagwara → Jalandhar', 'Jaipur → Ajmer', 'Ludhiana → Amritsar'], amt: ['₹120', '₹180', '₹240', '₹310'] },
    },
  },
  {
    id: 'kyc',
    product: 'KYC Verify',
    module: 'Verification pipeline',
    kind: 'AI Ops',
    path: 'kyc / pipeline',
    nav: ['Queue', 'Documents', 'OCR', 'Reviews', 'Users'],
    kpis: [
      { label: 'Documents today', value: 182, step: 3, format: 'int' },
      { label: 'OCR confidence', value: 97.8, step: 0.2, format: 'pct', min: 95.5, max: 99.4 },
      { label: 'Avg verification', value: 42, step: 2, format: 'sec', min: 30, max: 60 },
      { label: 'Pending review', value: 9, step: 1, format: 'int', min: 2, max: 18 },
    ],
    chart: { title: 'Documents processed', base: 50, spread: 18 },
    panel: { type: 'bars', title: 'Document types', items: [
      { label: 'Aadhaar', value: 44 }, { label: 'PAN', value: 31 }, { label: 'Driving licence', value: 13 }, { label: 'Passport', value: 12 },
    ] },
    feed: {
      templates: ['{doc} uploaded · user #{id}', 'EasyOCR extracted {n} fields · {doc}', 'Verified · user #{id}', 'Flagged for review · blurry {doc}', 'Admin approved KYC #{id}'],
      pools: { doc: ['Aadhaar', 'PAN', 'Passport', 'Driving licence'], n: ['6', '7', '8', '9'] },
    },
  },
]

export const OPEN_SYSTEM_EVENT = 'systems:open'

export const dashboardById = (id?: string) => dashboards.find((dashboard) => dashboard.id === id)
