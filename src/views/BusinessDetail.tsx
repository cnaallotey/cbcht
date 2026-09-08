"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, MessageCircle, Phone, Mail, Globe, MapPin, 
  Sparkles, Share2, Copy, Check, ExternalLink, Building2, 
  Instagram, Facebook, Tag, CheckCircle2, X, ChevronRight, Maximize2
} from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { Business } from '../types';
import { mockBusinesses } from '../data/mockData';
import { 
  getMonogramInitials, 
  getMonogramTheme, 
  formatWhatsAppLink, 
  formatTelLink, 
  sanitizeWebUrl,
  sanitizeInstagramUrl,
  sanitizeFacebookUrl
} from '../lib/security';

export default function BusinessDetail() {
  const params = useParams();
  const router = useRouter();
  const slug = typeof params?.slug === 'string' ? params.slug : '';

  const [allBusinesses, setAllBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeImagePreview, setActiveImagePreview] = useState<string | null>(null);

  // Close lightbox on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeImagePreview) {
        setActiveImagePreview(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeImagePreview]);

  // Real-time Firestore sync querying strictly published businesses
  useEffect(() => {
    const q = query(
      collection(db, 'businesses'),
      where('status', '==', 'published')
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Business));
      if (list.length > 0) {
        setAllBusinesses(list);
      } else {
        setAllBusinesses(mockBusinesses);
      }
      setLoading(false);
    }, (err) => {
      console.warn("Firestore fetch error, falling back to mock:", err);
      setAllBusinesses(mockBusinesses);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // Find business matching slug or id
  const business = useMemo(() => {
    return allBusinesses.find(b => b.slug === slug || b.id === slug) || null;
  }, [allBusinesses, slug]);

  // Related businesses (same category or others, max 3)
  const relatedBusinesses = useMemo(() => {
    if (!business) return [];
    const sameCategory = allBusinesses.filter(b => b.id !== business.id && b.category === business.category);
    if (sameCategory.length >= 3) {
      return sameCategory.slice(0, 3);
    }
    const others = allBusinesses.filter(b => b.id !== business.id && b.category !== business.category);
    return [...sameCategory, ...others].slice(0, 3);
  }, [allBusinesses, business]);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleWhatsAppShare = () => {
    if (typeof window !== 'undefined' && business) {
      const shareUrl = window.location.href;
      const shareText = encodeURIComponent(`Check out ${business.name} (${business.category}) on the Calvary Baptist Church Business Directory: ${shareUrl}`);
      window.open(`https://api.whatsapp.com/send?text=${shareText}`, '_blank');
    }
  };

  const handleNativeShare = async () => {
    if (typeof window !== 'undefined' && business) {
      if (navigator.share) {
        try {
          await navigator.share({
            title: `${business.name} | Calvary Baptist Church Business Directory`,
            text: `Support ${business.name} (${business.category}) on the CBC Directory:`,
            url: window.location.href
          });
          return;
        } catch {
          // Fallback to WhatsApp
        }
      }
      handleWhatsAppShare();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 font-sans text-stone-900 pt-36 pb-24">
        <div className="mx-auto max-w-7xl px-6 animate-pulse space-y-8">
          <div className="h-6 bg-stone-200 w-48 rounded-none" />
          <div className="bg-white border border-stone-200 p-8 flex flex-col md:flex-row gap-8 rounded-none">
            <div className="h-32 w-32 bg-stone-200 rounded-none shrink-0" />
            <div className="space-y-4 flex-1">
              <div className="h-8 bg-stone-200 w-2/3" />
              <div className="h-4 bg-stone-200 w-1/3" />
              <div className="h-4 bg-stone-100 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-stone-50 font-sans text-stone-900 pt-36 pb-24">
        <div className="mx-auto max-w-3xl px-6 text-center py-20 bg-white border border-stone-200 rounded-none">
          <Building2 className="h-12 w-12 text-stone-400 mx-auto mb-4" />
          <h2 className="font-serif text-3xl font-bold text-stone-900 mb-2">Business Not Found</h2>
          <p className="text-stone-600 mb-6 text-sm">
            We couldn't locate this business profile. It may have been moved or is pending review.
          </p>
          <Link
            href="/directory"
            className="inline-flex items-center gap-2 bg-church-blue text-white px-6 py-3 text-xs font-bold uppercase tracking-wider rounded-none"
          >
            <ArrowLeft className="h-4 w-4" /> Return to Directory
          </Link>
        </div>
      </div>
    );
  }

  const initials = getMonogramInitials(business.name);
  const theme = getMonogramTheme(business.name);
  const allPhotos = [
    ...(business.logo ? [business.logo] : []),
    ...(business.gallery || [])
  ];

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 pt-28 pb-24">
      {/* Top Breadcrumb Bar */}
      <nav aria-label="Breadcrumb" className="bg-white border-b border-stone-200 py-4">
        <div className="mx-auto max-w-7xl px-6 flex items-center justify-between">
          <Link
            href="/directory"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-600 hover:text-church-blue transition-colors group"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            Back to Directory
          </Link>

          <span className="text-[11px] font-bold uppercase tracking-wider text-church-gold bg-stone-900 px-3 py-1">
            {business.category}
          </span>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-6 py-12 space-y-12">
        {/* Hero Header Card */}
        <section className="bg-white border border-stone-200 p-6 sm:p-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Logo / Image 1:1 */}
            <div className="md:col-span-4 lg:col-span-3">
              <div className="relative aspect-square w-full max-w-[260px] mx-auto overflow-hidden bg-stone-100 border border-stone-200 rounded-none">
                {business.logo ? (
                  <img 
                    src={business.logo} 
                    alt={business.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center font-serif text-7xl font-bold ${theme.bg} ${theme.text}`}>
                    <span className="tracking-widest">{initials}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Title & Metadata */}
            <div className="md:col-span-8 lg:col-span-9 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-church-blue/10 text-church-blue font-bold px-3 py-1 text-xs uppercase tracking-wider border border-church-blue/20">
                  {business.category}
                </span>

                {business.featured && (
                  <span className="bg-church-gold text-white font-bold px-3 py-1 text-xs uppercase tracking-wider flex items-center gap-1.5 border border-church-gold-warm">
                    <Sparkles className="h-3.5 w-3.5 fill-current" /> Featured This Week
                  </span>
                )}
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-950 leading-tight">
                {business.name}
              </h1>

              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-stone-600 font-semibold uppercase tracking-wider">
                <div>Run by <span className="text-stone-900 font-bold">{business.ownerName}</span></div>
                {business.location && (
                  <div className="flex items-center gap-1 text-stone-700">
                    <MapPin className="h-3.5 w-3.5 text-amber-700" /> {business.location}
                  </div>
                )}
              </div>

              <p className="text-stone-700 text-base leading-relaxed font-light pt-2 max-w-3xl">
                {business.shortDescription}
              </p>
            </div>
          </div>
        </section>

        {/* Main Body Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Full Copy & Services */}
          <div className="lg:col-span-8 space-y-10">
            {/* Full Description */}
            {business.fullDescription && (
              <section className="bg-white border border-stone-200 p-8 space-y-4 rounded-none">
                <h2 className="font-serif text-2xl font-bold text-stone-900 border-b border-stone-100 pb-3">
                  About Our Business
                </h2>
                <div className="text-stone-700 text-sm sm:text-base leading-relaxed whitespace-pre-line font-light">
                  {business.fullDescription}
                </div>
              </section>
            )}

            {/* Services / Products Offered */}
            {business.services && business.services.length > 0 && (
              <section className="bg-white border border-stone-200 p-8 space-y-4 rounded-none">
                <h2 className="font-serif text-2xl font-bold text-stone-900 border-b border-stone-100 pb-3">
                  Products &amp; Services
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {business.services.map((service, idx) => (
                    <div 
                      key={idx}
                      className="flex items-start gap-3 bg-stone-50 p-3.5 border border-stone-200 text-sm text-stone-800 rounded-none"
                    >
                      <CheckCircle2 className="h-4 w-4 text-church-blue shrink-0 mt-0.5" />
                      <span className="font-medium">{service}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Photo Gallery */}
            {business.gallery && business.gallery.length > 0 && (
              <section className="bg-white border border-stone-200 p-8 space-y-4 rounded-none">
                <h2 className="font-serif text-2xl font-bold text-stone-900 border-b border-stone-100 pb-3">
                  Photo Showcase
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                  {business.gallery.map((photoUrl, idx) => (
                    <button 
                      key={idx}
                      type="button"
                      onClick={() => setActiveImagePreview(photoUrl)}
                      aria-label={`View photo ${idx + 1} of ${business.name}`}
                      className="relative aspect-square bg-stone-100 overflow-hidden border border-stone-200 group cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-church-blue"
                    >
                      <img 
                        src={photoUrl} 
                        alt={`${business.name} photo ${idx + 1}`} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <Maximize2 className="h-5 w-5" />
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column: Contact & Share Sidebar */}
          <aside className="lg:col-span-4 space-y-8 sticky top-36">
            {/* Direct Contact Card */}
            <div className="bg-stone-900 text-white p-8 space-y-6 border-t-4 border-church-gold rounded-none">
              <div>
                <h3 className="font-serif text-2xl font-bold text-white mb-1">
                  Connect Directly
                </h3>
                <p className="text-xs text-stone-400">
                  Reach out to support this member-owned business.
                </p>
              </div>

              <div className="space-y-3">
                {business.whatsapp && (
                  <a
                    href={formatWhatsAppLink(business.whatsapp, business.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Chat with ${business.name} on WhatsApp`}
                    className="w-full min-h-[44px] flex items-center justify-center gap-2.5 bg-emerald-700 hover:bg-emerald-800 text-white py-3.5 px-4 text-xs font-bold uppercase tracking-widest transition-colors rounded-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:outline-none"
                  >
                    <img src="/images/whatsapp-white.svg" alt="" aria-hidden="true" className="h-4 w-4 shrink-0 object-contain" /> Chat on WhatsApp
                  </a>
                )}

                {business.phone && (
                  <a
                    href={formatTelLink(business.phone)}
                    aria-label={`Call ${business.name}`}
                    className="w-full min-h-[44px] flex items-center justify-center gap-2.5 bg-church-blue hover:bg-blue-900 text-white py-3.5 px-4 text-xs font-bold uppercase tracking-widest transition-colors rounded-none focus-visible:ring-2 focus-visible:ring-church-blue focus-visible:outline-none"
                  >
                    <Phone className="h-4 w-4 shrink-0" /> Call {business.phone}
                  </a>
                )}

                {business.email && (
                  <a
                    href={`mailto:${business.email}`}
                    aria-label={`Email ${business.name}`}
                    className="w-full min-h-[44px] flex items-center justify-center gap-2.5 bg-stone-800 hover:bg-stone-700 text-white py-3.5 px-4 text-xs font-bold uppercase tracking-widest transition-colors border border-stone-700 rounded-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:outline-none"
                  >
                    <Mail className="h-4 w-4 shrink-0" /> Send Email
                  </a>
                )}

                {sanitizeWebUrl(business.website) && (
                  <a
                    href={sanitizeWebUrl(business.website)!}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit official website of ${business.name}`}
                    className="w-full min-h-[44px] flex items-center justify-center gap-2.5 bg-stone-800 hover:bg-stone-700 text-white py-3.5 px-4 text-xs font-bold uppercase tracking-widest transition-colors border border-stone-700 rounded-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:outline-none"
                  >
                    <Globe className="h-4 w-4 shrink-0" /> Visit Website
                  </a>
                )}

                {business.location && (
                  <div className="flex items-center gap-2.5 text-xs text-stone-300 pt-3 border-t border-stone-800">
                    <MapPin className="h-4 w-4 text-church-gold shrink-0" />
                    <span>{business.location}</span>
                  </div>
                )}

                {(business.instagram || business.facebook) && (
                  <div className="flex items-center gap-4 pt-3 border-t border-stone-800">
                    {business.instagram && (
                      <a
                        href={sanitizeInstagramUrl(business.instagram) || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-stone-400 hover:text-white transition-colors"
                        aria-label={`${business.name} Instagram page`}
                      >
                        <Instagram className="h-5 w-5" />
                      </a>
                    )}
                    {business.facebook && (
                      <a
                        href={sanitizeFacebookUrl(business.facebook) || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-stone-400 hover:text-white transition-colors"
                        aria-label={`${business.name} Facebook page`}
                      >
                        <Facebook className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Share & Recommend */}
            <div className="bg-white border border-stone-200 p-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-stone-900 border-b border-stone-100 pb-2">
                Share this Business
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Recommend this member's business with family, fellowship groups, or friends.
              </p>

              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <button
                    onClick={handleNativeShare}
                    className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-1.5 bg-church-blue text-white hover:bg-blue-900 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors rounded-none focus-visible:ring-2 focus-visible:ring-church-blue"
                  >
                    <Share2 className="h-4 w-4" /> Share
                  </button>

                  <button
                    onClick={handleWhatsAppShare}
                    className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors rounded-none focus-visible:ring-2 focus-visible:ring-emerald-700"
                  >
                    <img src="/images/whatsapp.svg" alt="" aria-hidden="true" className="h-4 w-4 shrink-0 object-contain" /> WhatsApp
                  </button>
                </div>

                <button
                  onClick={handleCopyLink}
                  aria-live="polite"
                  className="w-full min-h-[44px] inline-flex items-center justify-center gap-1.5 bg-stone-100 text-stone-800 border border-stone-300 hover:bg-stone-200 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors rounded-none focus-visible:ring-2 focus-visible:ring-stone-400"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-600" /> Link Copied to Clipboard!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" /> Copy Listing Link
                    </>
                  )}
                </button>
              </div>
            </div>
          </aside>
        </div>

        {/* "You Might Also Like" Recommendation Section */}
        {relatedBusinesses.length > 0 && (
          <section className="pt-12 border-t border-stone-200 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-church-gold-warm block mb-1">
                  Discover More
                </span>
                <h2 className="font-serif text-3xl font-bold text-stone-900">
                  Other Member Businesses
                </h2>
              </div>
              <Link
                href="/directory"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-church-blue hover:underline"
              >
                Browse All &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBusinesses.map(rel => {
                const relInitials = getMonogramInitials(rel.name);
                const relTheme = getMonogramTheme(rel.name);

                return (
                  <Link
                    key={rel.id}
                    href={`/directory/${rel.slug}`}
                    className="bg-white border border-stone-200 p-5 hover:border-church-blue transition-colors group flex flex-col justify-between rounded-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-church-blue"
                  >
                    <div className="space-y-3">
                      <div className="relative aspect-[16/9] w-full overflow-hidden bg-stone-100 border border-stone-200">
                        {rel.logo ? (
                          <img 
                            src={rel.logo} 
                            alt={rel.name} 
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                              const parent = (e.target as HTMLElement).parentElement;
                              if (parent) {
                                const fallback = document.createElement('div');
                                fallback.className = `w-full h-full flex items-center justify-center font-serif text-3xl font-bold ${relTheme.bg} ${relTheme.text}`;
                                fallback.innerHTML = `<span class="tracking-wider">${relInitials}</span>`;
                                parent.appendChild(fallback);
                              }
                            }}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className={`w-full h-full flex items-center justify-center font-serif text-3xl font-bold ${relTheme.bg} ${relTheme.text}`}>
                            <span className="tracking-wider">{relInitials}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                          {rel.category}
                        </span>
                        <h3 className="font-serif text-lg font-bold text-stone-900 group-hover:text-church-blue transition-colors">
                          {rel.name}
                        </h3>
                        <p className="text-xs text-stone-600 line-clamp-2 mt-1 font-sans">
                          {rel.shortDescription}
                        </p>
                      </div>
                    </div>
                    <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-church-blue">
                      <span>View Profile</span>
                      <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* Lightbox Modal for Photo Showcase */}
      <AnimatePresence>
        {activeImagePreview && (
          <div 
            role="dialog" 
            aria-modal="true" 
            aria-label="Photo Preview Lightbox"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-4xl max-h-[90vh] overflow-hidden"
            >
              <button
                onClick={() => setActiveImagePreview(null)}
                className="absolute top-4 right-4 min-w-[44px] min-h-[44px] flex items-center justify-center bg-black/70 hover:bg-black text-white rounded-none transition-colors z-10 focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Close image preview dialog"
              >
                <X className="h-6 w-6" />
              </button>
              <img 
                src={activeImagePreview} 
                alt="Enlarged photo preview"
                className="max-h-[85vh] w-auto object-contain mx-auto"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
