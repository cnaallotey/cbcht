export interface Sermon {
  id: string;
  title: string;
  date: string;
  scripture?: string;
  videoId: string;
  thumbnail?: string;
  transcript?: string;
  notesUrl?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  image?: string;
}

export interface ServiceTime {
  id: string;
  serviceName: string;
  day: string;
  time: string;
}

export interface ContactRequest {
  name: string;
  email: string;
  subject?: string;
  message: string;
  timestamp: string;
}
