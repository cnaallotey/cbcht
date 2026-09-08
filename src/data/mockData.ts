import { Sermon, BlogPost, ServiceTime, Business } from '../types';

export const mockSermons: Sermon[] = [
  {
    id: '1',
    title: 'Walking in Divine Purpose',
    date: '2026-05-10T08:00:00Z',
    scripture: 'Jeremiah 29:11',
    videoId: 'qW_S_1B5JvU', // Example YT ID
    thumbnail: 'https://images.unsplash.com/photo-1544427928-c49cdfebf194?q=80&w=2603&auto=format&fit=crop',
    transcript: '## Sermon Notes\n\nGod has a plan for your life. Even in the midst of uncertainty, His promises remain true.\n\n1. **God knows your heart**: He sees beyond your current situation.\n2. **God has a plan**: It is for your welfare, not for evil.\n3. **God gives hope**: Your future is secure in Him.',
    notesUrl: '#'
  },
  {
    id: '2',
    title: 'The Power of Prayer',
    date: '2026-05-03T08:00:00Z',
    scripture: 'Philippians 4:6-7',
    videoId: 'zP8S0_0L5aA',
    thumbnail: 'https://images.unsplash.com/photo-1499209974431-9dac3adaf471?q=80&w=2670&auto=format&fit=crop',
    transcript: '## Finding Peace in Prayer\n\nDo not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God.',
    notesUrl: '#'
  },
  {
    id: '3',
    title: 'Abiding in the Vine',
    date: '2026-04-26T08:00:00Z',
    scripture: 'John 15:1-5',
    videoId: 'pG9z-uP0S8k',
    thumbnail: 'https://images.unsplash.com/photo-1512401763750-6a953e5e4823?q=80&w=2612&auto=format&fit=crop',
    transcript: '## Staying Connected to Jesus\n\nWithout Me, you can do nothing. True fruitfulness comes from maintaining a deep, constant connection with Christ.',
    notesUrl: '#'
  }
];

export const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Finding Joy in the Small Things',
    date: '2026-05-15T10:00:00Z',
    excerpt: 'In the hustle and bustle of Lashibi life, it\'s easy to miss the quiet blessings God pours out on us every single day. Today, let\'s look for them.',
    content: 'Full devotional content here...',
    author: 'Reverend Lina Sunu Atta',
    category: 'Daily Devotional',
    image: 'https://images.unsplash.com/photo-1469474094887-b1e7632f7b21?q=80&w=2547&auto=format&fit=crop'
  },
  {
    id: '2',
    title: 'Community: More Than Just Neighbors',
    date: '2026-05-12T09:00:00Z',
    excerpt: 'What does it mean to be a "temple of Halleluyah" in our local community? It means being the hands and feet of Jesus to every neighbor.',
    content: 'Full blog content here...',
    author: 'Pastor Emmanuel Mensah',
    category: 'Community News',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2670&auto=format&fit=crop'
  }
];

export const mockServiceTimes: ServiceTime[] = [
  { id: '1', serviceName: 'Sunday Service', day: 'Sunday', time: '8:00 AM — 10:30 AM' },
  { id: '2', serviceName: 'Midweek Bible Study', day: 'Wednesday', time: '6:30 PM — 8:00 PM' },
  { id: '3', serviceName: 'Prayer Service', day: 'Friday', time: '6:00 AM — 7:00 PM' }
];

export const mockBusinesses: Business[] = [
  {
    id: 'biz_1',
    name: 'Grace & Savour Catering',
    slug: 'grace-and-savour-catering',
    ownerName: 'Deaconess Mary',
    category: 'Food & Catering',
    shortDescription: 'Exquisite African and Continental buffet catering for weddings, corporate celebrations, church events, and home gatherings across Greater Accra.',
    fullDescription: 'Grace & Savour Catering brings love and excellence to the table. Founded in 2018 by Deaconess Mary, we specialize in authentic Ghanaian delicacies (Jollof, Waakye, Fried Rice, Banku & Tilapia) alongside contemporary continental menus. Whether you are hosting an intimate family thanksgiving or a grand wedding of 500 guests, our team guarantees hygiene, timeliness, and mouth-watering culinary presentations.',
    services: ['Wedding Buffets', 'Corporate Lunches', 'Private Parties', 'Packed Event Meals', 'Cocktail Bites & Pastries'],
    logo: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop'
    ],
    whatsapp: '+233244123456',
    phone: '+233244123456',
    email: 'graceandsavour@gmail.com',
    website: 'https://instagram.com/graceandsavour',
    location: 'Lashibi, Community 18',
    instagram: '@graceandsavour',
    tags: ['food', 'catering', 'jollof', 'wedding', 'event food', 'buffet'],
    featured: true,
    status: 'published',
    createdAt: '2026-03-01T10:00:00Z',
    publishedAt: '2026-03-02T12:00:00Z'
  },
  {
    id: 'biz_2',
    name: 'Apex Horizon Tech Labs',
    slug: 'apex-horizon-tech-labs',
    ownerName: 'Kwame Mensah',
    category: 'Technology & Digital Services',
    shortDescription: 'Modern web design, custom mobile app development, and cloud IT infrastructure for small-to-medium businesses and non-profits.',
    fullDescription: 'Apex Horizon Tech Labs helps businesses transform their digital presence. We build fast, reliable websites, e-commerce stores, custom business dashboards, and mobile applications with cutting-edge engineering standards. We also offer IT consultancy and cybersecurity audits for churches, schools, and growing enterprises.',
    services: ['Web Design & Dev', 'Mobile Apps (iOS & Android)', 'Cloud Hosting & DevOps', 'Cybersecurity Review', 'SEO & Analytics'],
    logo: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop',
    whatsapp: '+233501987654',
    phone: '+233501987654',
    email: 'info@apexhorizonlabs.com',
    website: 'https://apexhorizonlabs.com',
    location: 'Tema Motorway / Lashibi',
    instagram: '@apexhorizontech',
    tags: ['tech', 'software', 'website', 'mobile app', 'it services'],
    featured: false,
    status: 'published',
    createdAt: '2026-03-05T08:30:00Z',
    publishedAt: '2026-03-06T09:00:00Z'
  },
  {
    id: 'biz_3',
    name: 'Serene Haven Spa & Esthetics',
    slug: 'serene-haven-spa-and-esthetics',
    ownerName: 'Akosua Boakye',
    category: 'Health, Beauty & Wellness',
    shortDescription: 'Holistic skincare, relaxing therapeutic massage, nail artistry, and bridal beauty services in a peaceful, restful atmosphere.',
    fullDescription: 'At Serene Haven Spa, we believe wellness is a God-given gift. Our tranquil clinic in Spintex/Lashibi offers medical-grade facials, tension-relieving deep tissue massages, pedicures, and organic skin treatment plans. Dedicated to pampering you and renewing your strength.',
    services: ['Deep Tissue Massage', 'Organic Facials', 'Manicure & Pedicure', 'Bridal Glam Packages', 'Waxing & Skin Polish'],
    logo: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop',
    whatsapp: '+233540112233',
    phone: '+233540112233',
    email: 'serenehavenwellness@gmail.com',
    location: 'Spintex Road, Near Kasapreko',
    instagram: '@serenehavenspa_gh',
    tags: ['spa', 'massage', 'skincare', 'beauty', 'wellness', 'nails'],
    featured: false,
    status: 'published',
    createdAt: '2026-03-10T14:15:00Z',
    publishedAt: '2026-03-11T11:00:00Z'
  },
  {
    id: 'biz_4',
    name: 'BrightMinds Academy & Tutoring',
    slug: 'brightminds-academy-tutoring',
    ownerName: 'Mr. Emmanuel Darko',
    category: 'Education & Tutoring',
    shortDescription: 'Exceptional after-school tuition, BECE/WASSCE exam prep, Cambridge IGCSE training, and coding classes for kids.',
    fullDescription: 'BrightMinds Academy pairs passionate Christian teachers with students seeking academic mastery and godly character. We provide individualized home tutoring and weekend group classes in Mathematics, Science, English, and Computing, with proven 98% grade improvement rates.',
    services: ['BECE / WASSCE Prep', 'IGCSE & Cambridge Support', 'Primary After-School Classes', 'Kids Coding & STEM', 'Home Tutoring'],
    logo: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop',
    whatsapp: '+233208554433',
    phone: '+233208554433',
    email: 'brightmindstutors@yahoo.com',
    location: 'Lashibi Comm 19',
    tags: ['education', 'tuition', 'exams', 'wassce', 'stem', 'tutoring'],
    featured: false,
    status: 'published',
    createdAt: '2026-03-12T16:00:00Z',
    publishedAt: '2026-03-13T10:00:00Z'
  },
  {
    id: 'biz_5',
    name: 'SolidRock Builders & Civil Engineering',
    slug: 'solidrock-builders-civil-engineering',
    ownerName: 'Ing. Kofi Annan',
    category: 'Construction & Real Estate',
    shortDescription: 'High-integrity residential building construction, architectural design, structural renovation, and land surveying.',
    fullDescription: 'Founded upon biblical integrity, SolidRock Builders delivers durable construction without corner-cutting. From building plan architectural drafting and structural engineering to complete key-in-hand residential construction and commercial tiling, we build homes that stand the test of time.',
    services: ['Residential Building', 'Architectural Drafting', 'Roofing & Plastering', 'Building Renovations', 'Tiling & Finishing'],
    logo: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop',
    whatsapp: '+233244889900',
    phone: '+233244889900',
    email: 'solidrockengineers@gmail.com',
    website: 'https://solidrockbuilders.com.gh',
    location: 'Tema Community 20',
    tags: ['construction', 'building', 'architecture', 'renovation', 'engineering'],
    featured: false,
    status: 'published',
    createdAt: '2026-03-15T09:20:00Z',
    publishedAt: '2026-03-16T08:00:00Z'
  },
  {
    id: 'biz_6',
    name: 'Kente & Stitch Bespoke Couture',
    slug: 'kente-and-stitch-bespoke-couture',
    ownerName: 'Sister Abena',
    category: 'Retail & Fashion',
    shortDescription: 'Authentic handwoven Bonwire Kente, custom bespoke kaftans, and elegant church fashion for men, women, and children.',
    fullDescription: 'Kente & Stitch crafts royal heritage fashion with modest Christian elegance. We source authentic grade-A Kente cloth straight from Asante weavers, paired with precision master tailoring for graduation stoles, wedding ensembles, Sunday best dresses, and men\'s senator kaftans.',
    services: ['Bespoke Sunday Fashion', 'Traditional Wedding Attire', 'Graduation & Bridal Kente', 'Men\'s Kaftans', 'Worldwide Courier Delivery'],
    logo: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop',
    whatsapp: '+233552334455',
    phone: '+233552334455',
    email: 'kenteandstitch@gmail.com',
    location: 'Sakumono Estates',
    instagram: '@kente_and_stitch',
    tags: ['fashion', 'kente', 'kaftan', 'tailoring', 'dressmaking', 'clothing'],
    featured: false,
    status: 'published',
    createdAt: '2026-03-18T11:45:00Z',
    publishedAt: '2026-03-19T13:30:00Z'
  }
];

