import { Sermon, BlogPost, ServiceTime } from '../types';

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
