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

export type BusinessCategory = 
  | 'Food & Catering'
  | 'Technology & Digital Services'
  | 'Health, Beauty & Wellness'
  | 'Education & Tutoring'
  | 'Construction & Real Estate'
  | 'Retail & Fashion'
  | 'Financial Services'
  | 'Transportation & Logistics'
  | 'Creative Arts & Media'
  | 'Agriculture & Produce'
  | 'Other';

export type BusinessStatus = 'draft' | 'pending' | 'published';

export interface Business {
  id: string;
  name: string;
  slug: string;
  ownerName: string;
  category: BusinessCategory;
  shortDescription: string;
  fullDescription?: string;
  services?: string[];
  logo?: string;
  gallery?: string[];
  whatsapp: string;
  phone: string;
  email?: string;
  website?: string;
  location?: string;
  instagram?: string;
  facebook?: string;
  tags?: string[];
  featured: boolean;
  status: BusinessStatus;
  isChurchMember?: boolean;
  createdAt: string;
  updatedAt?: string;
  publishedAt?: string;
}

