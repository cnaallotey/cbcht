"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, X, Filter, Phone, MessageCircle, Globe, 
  ExternalLink, Sparkles, Building2, Plus, ArrowRight, 
  Check, ChevronRight, SlidersHorizontal, MapPin
} from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { Business, BusinessCategory } from '../types';
import { mockBusinesses } from '../data/mockData';
import { 
  getMonogramInitials, 
  getMonogramTheme, 
  formatWhatsAppLink, 
  formatTelLink, 
  sanitizeWebUrl 
} from '../lib/security';

const ALL_CATEGORIES: BusinessCategory[] = [
  'Food & Catering',
  'Technology & Digital Services',
  'Health, Beauty & Wellness',
  'Education & Tutoring',
  'Construction & Real Estate',
  'Retail & Fashion',
  'Financial Services',
  'Transportation & Logistics',
  'Creative Arts & Media',
  'Agriculture & Produce',
  'Other'
];

const ITEMS_PER_PAGE = 12;

function DirectoryCardImage({ 
  src, 
  alt, 
  initials, 
  theme 
}: { 
  src?: string; 
  alt: string; 
  initials: string; 
  theme: { bg: string; text: string }; 
}) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className={`w-full h-full flex items-center justify-center font-serif text-3xl font-bold ${theme.bg} ${theme.text}`}>
        <span className="tracking-widest">{initials}</span>
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt}
      onError={() => setHasError(true)}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
    />
  );
}

export default function Directory() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<BusinessCategory[]>([]);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileFilterOpen) {
        setMobileFilterOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileFilterOpen]);

  // Real-time Firestore sync - querying strictly published items
  useEffect(() => {
    const q = query(
      collection(db, 'businesses'),
      where('status', '==', 'published')
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Business));
      
      // Sort: Featured first, then newest published
      list.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      });

      if (list.length > 0) {
        setBusinesses(list);
      } else {
        setBusinesses(mockBusinesses);
      }
      setLoading(false);
    }, (err) => {
      console.warn("Firestore businesses fetch error, falling back to mock:", err);
      setBusinesses(mockBusinesses);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // Debounce search input (300ms) & reset page count
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setVisibleCount(ITEMS_PER_PAGE);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Category toggle handler
  const toggleCategory = (category: BusinessCategory) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSearchQuery('');
    setDebouncedSearch('');
    setVisibleCount(ITEMS_PER_PAGE);
  };

  // Filtered & searched businesses
  const filteredBusinesses = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();
    return businesses.filter(biz => {
      // Category filter match
      if (selectedCategories.length > 0 && !selectedCategories.includes(biz.category)) {
        return false;
      }
      // Search filter match
      if (query) {
        const inName = biz.name.toLowerCase().includes(query);
        const inShortDesc = biz.shortDescription?.toLowerCase().includes(query) || false;
        const inFullDesc = biz.fullDescription?.toLowerCase().includes(query) || false;
        const inOwner = biz.ownerName.toLowerCase().includes(query);
        const inCategory = biz.category.toLowerCase().includes(query);
        const inTags = biz.tags?.some(tag => tag.toLowerCase().includes(query)) || false;
        const inServices = biz.services?.some(s => s.toLowerCase().includes(query)) || false;
        const inLocation = biz.location?.toLowerCase().includes(query) || false;

        return inName || inShortDesc || inFullDesc || inOwner || inCategory || inTags || inServices || inLocation;
      }
      return true;
    });
  }, [businesses, selectedCategories, debouncedSearch]);

  const displayedBusinesses = filteredBusinesses.slice(0, visibleCount);
  const hasMore = visibleCount < filteredBusinesses.length;

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    ALL_CATEGORIES.forEach(cat => { counts[cat] = 0; });
    businesses.forEach(biz => {
      if (counts[biz.category] !== undefined) {
        counts[biz.category]++;
      }
    });
    return counts;
  }, [businesses]);

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 pt-28 pb-24">
      {/* Hero Banner */}
      <header className="relative bg-stone-900 text-white pt-20 pb-16 overflow-hidden border-b border-stone-800">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2684&auto=format&fit=crop" 
            alt="CBC Marketplace" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/80 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 bg-church-gold/20 text-church-gold border border-church-gold/30 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest mb-4">
                <Building2 className="h-3.5 w-3.5" /> Calvary Baptist Church Community
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-4">
                Member Business <span className="text-church-gold italic">Directory</span>
              </h1>
              <p className="text-stone-300 text-base sm:text-lg leading-relaxed font-light">
                Discover, support, and connect with trusted businesses owned and operated by church members.
              </p>
            </div>

            <div className="shrink-0">
              <Link
                href="/directory/register"
                className="inline-flex items-center justify-center gap-2 bg-church-gold hover:bg-church-gold-warm text-white font-bold px-6 py-4 text-xs uppercase tracking-widest transition-all rounded-none whitespace-nowrap"
              >
                <Plus className="h-4 w-4" /> Register Your Business
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Mobile Filter Bar & Search */}
        <div className="md:hidden space-y-4 mb-8">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input 
              type="text"
              aria-label="Search businesses, services, or tags"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search businesses, services, tags..."
              className="w-full bg-white border border-stone-300 pl-10 pr-12 py-3 text-sm focus-visible:border-church-blue focus-visible:ring-2 focus-visible:ring-church-blue focus-visible:outline-none rounded-none"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-1 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center text-stone-400 hover:text-stone-700"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => setMobileFilterOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={mobileFilterOpen}
              className="min-h-[44px] inline-flex items-center gap-2 bg-white border border-stone-300 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-stone-800 rounded-none focus-visible:ring-2 focus-visible:ring-church-blue"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-church-blue" />
              Filter Categories {selectedCategories.length > 0 && `(${selectedCategories.length})`}
            </button>

            {selectedCategories.length > 0 && (
              <button 
                onClick={clearFilters}
                className="min-h-[44px] px-2 inline-flex items-center text-xs font-bold text-church-blue uppercase tracking-wider underline underline-offset-4"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Desktop Filter Rail */}
          <aside className="hidden lg:block lg:col-span-3 space-y-8">
            {/* Search Input */}
            <div>
              <label htmlFor="desktop-search" className="block text-xs font-bold uppercase tracking-widest text-stone-700 mb-2">
                Search Directory
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                <input 
                  id="desktop-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search businesses..."
                  className="w-full bg-white border border-stone-300 pl-10 pr-10 py-2.5 text-sm focus:border-church-blue focus:outline-none rounded-none"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700"
                    aria-label="Clear search query"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter Group */}
            <div className="bg-white border border-stone-200 p-6">
              <div className="flex items-center justify-between mb-4 border-b border-stone-100 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-stone-900">
                  Categories
                </h3>
                {selectedCategories.length > 0 && (
                  <button 
                    onClick={clearFilters}
                    className="text-[11px] font-bold text-church-blue hover:text-blue-900 tracking-wider uppercase underline underline-offset-2"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <fieldset className="space-y-2.5">
                <legend className="sr-only">Filter by business category</legend>
                {ALL_CATEGORIES.map((cat) => {
                  const isChecked = selectedCategories.includes(cat);
                  const count = categoryCounts[cat] || 0;
                  return (
                    <label 
                      key={cat}
                      className="flex items-center justify-between text-xs text-stone-700 hover:text-stone-950 cursor-pointer select-none group py-1"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`h-4 w-4 rounded-none border flex items-center justify-center transition-colors ${
                          isChecked ? 'bg-church-blue border-church-blue text-white' : 'border-stone-300 group-hover:border-stone-400 bg-white'
                        }`}>
                          {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                        <span className={isChecked ? 'font-bold text-stone-900' : 'font-normal'}>
                          {cat}
                        </span>
                      </div>
                      <span className="text-[11px] text-stone-400 group-hover:text-stone-600 font-mono">
                        {count}
                      </span>
                      <input 
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleCategory(cat)}
                        className="sr-only"
                        aria-label={`Category ${cat}`}
                      />
                    </label>
                  );
                })}
              </fieldset>
            </div>

            {/* Need Help Box */}
            <div className="bg-stone-100 border-l-4 border-church-gold p-5 text-xs text-stone-600 space-y-2">
              <p className="font-bold text-stone-900 uppercase tracking-wider">Are you a CBC business owner?</p>
              <p className="leading-relaxed">
                Add your business to our official directory and get featured across church communications.
              </p>
              <Link 
                href="/directory/register"
                className="inline-block text-church-blue font-bold uppercase tracking-wider underline decoration-2 underline-offset-4 pt-1"
              >
                Submit your listing &rarr;
              </Link>
            </div>
          </aside>

          {/* Business Cards Grid */}
          <main className="lg:col-span-9 space-y-8">
            {/* Header info / count */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
              <div className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Showing <span className="text-stone-900">{displayedBusinesses.length}</span> of <span className="text-stone-900">{filteredBusinesses.length}</span> businesses
                {selectedCategories.length > 0 && ` in ${selectedCategories.length} selected categor${selectedCategories.length > 1 ? 'ies' : 'y'}`}
              </div>

              {selectedCategories.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  {selectedCategories.map(cat => (
                    <span 
                      key={cat}
                      className="inline-flex items-center gap-1 text-[11px] font-medium bg-stone-200 text-stone-800 px-2.5 py-1 rounded-none"
                    >
                      {cat}
                      <button 
                        onClick={() => toggleCategory(cat)} 
                        className="hover:text-red-700 min-w-[24px] min-h-[24px] flex items-center justify-center -mr-1" 
                        aria-label={`Remove category filter ${cat}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Loading Skeleton */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse" aria-label="Loading directory listings">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white border border-stone-200 p-6 space-y-4 rounded-none">
                    <div className="aspect-square bg-stone-200 w-full rounded-none" />
                    <div className="h-4 bg-stone-200 w-1/3" />
                    <div className="h-6 bg-stone-200 w-3/4" />
                    <div className="h-3 bg-stone-200 w-1/2" />
                    <div className="h-10 bg-stone-100 mt-4" />
                  </div>
                ))}
              </div>
            ) : displayedBusinesses.length > 0 ? (
              /* Business Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {displayedBusinesses.map((biz) => {
                  const initials = getMonogramInitials(biz.name);
                  const theme = getMonogramTheme(biz.name);

                  return (
                    <article 
                      key={biz.id || biz.slug}
                      className="bg-white border border-stone-200 transition-all duration-300 flex flex-col justify-between group overflow-hidden relative rounded-none hover:border-church-blue"
                    >
                      {/* Clickable Card Body leading to [slug] */}
                      <Link 
                        href={`/directory/${biz.slug}`}
                        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-church-blue focus-visible:ring-offset-2 flex-1"
                      >
                        {/* 16:10 Aspect Ratio Logo / Photo */}
                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-100 border-b border-stone-100">
                          <DirectoryCardImage
                            src={biz.logo}
                            alt={biz.name}
                            initials={initials}
                            theme={theme}
                          />

                          {/* Featured Badge (Orange) */}
                          {biz.featured && (
                            <div className="absolute top-3 right-3 bg-church-gold text-white font-bold px-2.5 py-1 text-[10px] uppercase tracking-widest flex items-center gap-1.5 border border-church-gold-warm">
                              <Sparkles className="h-3 w-3 fill-current" /> Featured This Week
                            </div>
                          )}
                        </div>

                        {/* Text Information */}
                        <div className="p-5 sm:p-6 space-y-2.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-church-gold-warm">
                              {biz.category}
                            </span>
                            {biz.location && (
                              <span className="inline-flex items-center gap-1 text-[11px] text-stone-500 font-medium truncate max-w-[140px]">
                                <MapPin className="h-3 w-3 text-stone-400 shrink-0" />
                                <span className="truncate">{biz.location}</span>
                              </span>
                            )}
                          </div>

                          <h2 className="font-serif text-xl font-bold text-stone-900 group-hover:text-church-blue transition-colors leading-snug line-clamp-2">
                            {biz.name}
                          </h2>
                          
                          <p className="text-xs font-medium text-stone-500">
                            Run by <span className="text-stone-800 font-semibold">{biz.ownerName}</span>
                          </p>

                          <p className="text-xs text-stone-600 leading-relaxed line-clamp-2 pt-1 font-sans">
                            {biz.shortDescription}
                          </p>
                        </div>
                      </Link>

                      {/* Card Action Footer: Elegant & Clutter-Free */}
                      <div className="px-5 sm:px-6 py-3.5 mt-auto border-t border-stone-100 bg-stone-50/70 flex items-center justify-between gap-3">
                        <Link
                          href={`/directory/${biz.slug}`}
                          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-church-blue hover:text-church-gold-warm transition-colors py-1 group/link"
                        >
                          <span>View Profile</span>
                          <ArrowRight className="h-3.5 w-3.5 group-hover/link:translate-x-1 transition-transform" />
                        </Link>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {biz.whatsapp && (
                            <a 
                              href={formatWhatsAppLink(biz.whatsapp, biz.name)}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Chat with ${biz.name} on WhatsApp`}
                              title="Chat on WhatsApp"
                              className="min-w-[38px] min-h-[38px] w-9.5 h-9.5 inline-flex items-center justify-center border border-stone-200 bg-white hover:bg-emerald-50 hover:border-emerald-500 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none rounded-none p-2"
                            >
                              <img 
                                src="/images/whatsapp.svg" 
                                alt="" 
                                aria-hidden="true" 
                                className="w-full h-full object-contain" 
                              />
                            </a>
                          )}

                          {biz.phone && (
                            <a 
                              href={formatTelLink(biz.phone)}
                              aria-label={`Call ${biz.name}`}
                              title={`Call ${biz.phone}`}
                              className="min-w-[38px] min-h-[38px] w-9.5 h-9.5 inline-flex items-center justify-center border border-stone-200 bg-white text-church-blue hover:bg-church-blue hover:text-white hover:border-church-blue transition-colors focus-visible:ring-2 focus-visible:ring-church-blue focus-visible:outline-none rounded-none"
                            >
                              <Phone className="h-4 w-4" />
                            </a>
                          )}

                          {sanitizeWebUrl(biz.website) && (
                            <a 
                              href={sanitizeWebUrl(biz.website)!}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Visit website for ${biz.name}`}
                              title="Visit Website"
                              className="min-w-[38px] min-h-[38px] w-9.5 h-9.5 inline-flex items-center justify-center border border-stone-200 bg-white text-stone-600 hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-colors focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:outline-none rounded-none"
                            >
                              <Globe className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              /* Verified Empty State */
              <div className="bg-white border border-stone-200 p-12 text-center space-y-4 max-w-xl mx-auto my-12 rounded-none">
                <div className="h-16 w-16 bg-stone-100 text-stone-400 border border-stone-200 flex items-center justify-center mx-auto mb-2 rounded-none">
                  <Building2 className="h-8 w-8 text-church-blue" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-stone-900">
                  {debouncedSearch ? `No businesses match "${debouncedSearch}"` : "No businesses found"}
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  {debouncedSearch || selectedCategories.length > 0
                    ? `No businesses match your current search or category filters. Try a different word or browse all categories.`
                    : "No approved member businesses listed yet. Be the first to register and get discovered by our church family!"}
                </p>
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  {(debouncedSearch || selectedCategories.length > 0) && (
                    <button 
                      onClick={clearFilters}
                      className="min-h-[44px] bg-stone-200 hover:bg-stone-300 text-stone-800 px-6 py-3 text-xs font-bold uppercase tracking-widest transition-colors rounded-none"
                    >
                      Clear All Filters
                    </button>
                  )}
                  <Link
                    href="/directory/register"
                    className="min-h-[44px] inline-flex items-center justify-center bg-church-blue hover:bg-blue-900 text-white px-6 py-3 text-xs font-bold uppercase tracking-widest transition-colors rounded-none"
                  >
                    Register Your Business
                  </Link>
                </div>
              </div>
            )}

            {/* Pagination / Load More */}
            {hasMore && (
              <div className="text-center pt-8">
                <button
                  onClick={() => setVisibleCount(prev => prev + ITEMS_PER_PAGE)}
                  className="bg-white hover:bg-stone-100 text-stone-900 border-2 border-stone-900 px-10 py-4 text-xs font-bold uppercase tracking-widest transition-colors rounded-none"
                >
                  Load More Businesses ({filteredBusinesses.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Category Drawer Bottom Sheet */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center md:hidden">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFilterOpen(false)}
              className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm"
            />

            {/* Sheet */}
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="mobile-filter-heading"
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-h-[85vh] bg-white border-t border-stone-300 p-6 overflow-y-auto z-10 space-y-6 rounded-none"
            >
              <div className="flex items-center justify-between border-b border-stone-200 pb-4">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-church-blue" />
                  <h3 id="mobile-filter-heading" className="text-sm font-bold uppercase tracking-wider text-stone-900">
                    Filter by Category
                  </h3>
                </div>
                <button 
                  onClick={() => setMobileFilterOpen(false)}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center text-stone-400 hover:text-stone-700"
                  aria-label="Close filters dialog"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <fieldset className="space-y-3">
                <legend className="sr-only">Select business categories</legend>
                {ALL_CATEGORIES.map(cat => {
                  const isChecked = selectedCategories.includes(cat);
                  const count = categoryCounts[cat] || 0;
                  return (
                    <label 
                      key={cat}
                      className="flex items-center justify-between text-sm text-stone-800 p-2.5 min-h-[44px] hover:bg-stone-50 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-5 w-5 border flex items-center justify-center peer-focus-visible:ring-2 peer-focus-visible:ring-church-blue ${
                          isChecked ? 'bg-church-blue border-church-blue text-white' : 'border-stone-300 bg-white'
                        }`}>
                          {isChecked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                        </div>
                        <span className={isChecked ? 'font-bold text-stone-950' : 'text-stone-700'}>
                          {cat}
                        </span>
                      </div>
                      <span className="text-xs text-stone-500 font-mono">({count})</span>
                      <input 
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleCategory(cat)}
                        className="sr-only peer"
                        aria-label={`Category ${cat}`}
                      />
                    </label>
                  );
                })}
              </fieldset>

              <div className="pt-4 border-t border-stone-200 flex gap-3">
                <button 
                  onClick={clearFilters}
                  className="min-h-[44px] flex-1 bg-stone-100 text-stone-700 py-3 text-xs font-bold uppercase tracking-wider rounded-none"
                >
                  Clear All
                </button>
                <button 
                  onClick={() => setMobileFilterOpen(false)}
                  className="min-h-[44px] flex-1 bg-church-blue text-white py-3 text-xs font-bold uppercase tracking-wider rounded-none"
                >
                  Apply Filters ({selectedCategories.length})
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
