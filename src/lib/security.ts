/**
 * Security and Data Sanitization Utilities
 * Calvary Baptist Church Business Directory
 */

export const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

/**
 * Validates uploaded image files by MIME type and size
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { valid: false, error: 'Only PNG, JPEG, and WebP images are allowed.' };
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { valid: false, error: 'File size must be 5MB or smaller.' };
  }
  return { valid: true };
}

/**
 * Generates an isolated, safe storage path preventing path traversal
 */
export function generateSafeStoragePath(folder: string, originalFilename: string, mimeType: string): string {
  const extensionMap: Record<string, string> = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/webp': 'webp'
  };
  const ext = extensionMap[mimeType] || 'jpg';
  const randomId = typeof crypto !== 'undefined' && crypto.randomUUID 
    ? crypto.randomUUID() 
    : `${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
  
  return `${folder}/${randomId}.${ext}`;
}

/**
 * Sanitizes external web URLs, preventing javascript: and data: XSS schemes
 */
export function sanitizeWebUrl(rawUrl: string | undefined | null): string | null {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;

  try {
    const hasProtocol = /^https?:\/\//i.test(trimmed);
    const candidate = hasProtocol ? trimmed : `https://${trimmed}`;
    const parsed = new URL(candidate);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null;
    }
    return parsed.href;
  } catch {
    return null;
  }
}

/**
 * Sanitizes Instagram handles/links strictly to instagram.com
 */
export function sanitizeInstagramUrl(input: string | undefined | null): string | null {
  if (!input || typeof input !== 'string') return null;
  const trimmed = input.trim();
  if (!trimmed) return null;

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const parsed = new URL(trimmed);
      if (parsed.hostname === 'instagram.com' || parsed.hostname === 'www.instagram.com') {
        return parsed.href;
      }
      return null;
    } catch {
      return null;
    }
  }

  const cleanHandle = trimmed.replace(/^@/, '').replace(/[^a-zA-Z0-9._]/g, '');
  return cleanHandle ? `https://instagram.com/${cleanHandle}` : null;
}

/**
 * Sanitizes Facebook page names/links strictly to facebook.com
 */
export function sanitizeFacebookUrl(input: string | undefined | null): string | null {
  if (!input || typeof input !== 'string') return null;
  const trimmed = input.trim();
  if (!trimmed) return null;

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const parsed = new URL(trimmed);
      if (parsed.hostname === 'facebook.com' || parsed.hostname === 'www.facebook.com') {
        return parsed.href;
      }
      return null;
    } catch {
      return null;
    }
  }

  const cleanHandle = trimmed.replace(/[^a-zA-Z0-9.-]/g, '');
  return cleanHandle ? `https://facebook.com/${cleanHandle}` : null;
}

/**
 * Validates and normalizes URL slugs safely, preventing collision with system routes
 */
export function sanitizeSlug(name: string): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  const reserved = ['register', 'admin', 'login', 'api', 'new', 'edit', 'directory', 'businesses'];
  const safeBase = reserved.includes(base) ? `${base}-biz` : base;
  return safeBase || 'business';
}

/**
 * 2-character monogram generator for fallback business avatars
 */
export function getMonogramInitials(name: string): string {
  if (!name) return 'CB';
  const clean = name.trim();
  const words = clean.split(/\s+/).filter(w => !['&', 'and', 'the', 'of', 'for'].includes(w.toLowerCase()));
  if (words.length >= 2) {
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase();
}

/**
 * Deterministic CBC-aligned brand color themes for monograms
 */
export function getMonogramTheme(str: string): { bg: string; text: string; border: string } {
  const themes = [
    { bg: 'bg-[#003399]', text: 'text-[#EA580C]', border: 'border-[#EA580C]/40' },
    { bg: 'bg-stone-900', text: 'text-orange-400', border: 'border-orange-500/40' },
    { bg: 'bg-blue-900', text: 'text-amber-300', border: 'border-amber-400/40' },
    { bg: 'bg-stone-950', text: 'text-stone-100', border: 'border-stone-700' },
    { bg: 'bg-emerald-900', text: 'text-emerald-200', border: 'border-emerald-600/40' },
    { bg: 'bg-amber-950', text: 'text-orange-200', border: 'border-orange-600/40' },
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return themes[Math.abs(hash) % themes.length];
}

/**
 * Formats a Ghanaian phone number for wa.me links
 */
export function formatWhatsAppLink(phone: string, businessName: string): string {
  if (!phone) return '#';
  const digits = phone.replace(/[^0-9]/g, '');
  let fullNumber = digits;
  if (digits.startsWith('0') && digits.length === 10) {
    fullNumber = '233' + digits.slice(1);
  } else if (!digits.startsWith('233') && digits.length === 9) {
    fullNumber = '233' + digits;
  }
  const prefill = encodeURIComponent(`Hi ${businessName}, I found your business on the Calvary Baptist Church directory!`);
  return `https://wa.me/${fullNumber}?text=${prefill}`;
}

/**
 * Formats a phone number for tel: links
 */
export function formatTelLink(phone: string): string {
  if (!phone) return '#';
  const cleaned = phone.trim();
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    return `tel:+233${cleaned.slice(1)}`;
  }
  return `tel:${cleaned}`;
}
