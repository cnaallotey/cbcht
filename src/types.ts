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
  id?: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  timestamp: string;
}

export interface Leader {
  id: string;
  name: string;
  role: string;
  image?: string;
  order: number;
}

export interface GalleryImage {
  id: string;
  url: string;
  caption?: string;
}

export interface GalleryGroup {
  id: string;
  name: string;
  description?: string;
  date?: string;
  images: GalleryImage[];
  createdAt: string;
}

