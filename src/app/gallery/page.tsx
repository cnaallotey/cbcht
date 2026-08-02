'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { db } from '../../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { GalleryGroup, GalleryImage } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, Calendar, ChevronLeft, ChevronRight, X, Maximize2, 
  Sparkles, Layers, Image as ImageIcon, Loader2 
} from 'lucide-react';

const mockDefaultGroups: GalleryGroup[] = [
  {
    id: 'mock_1',
    name: 'Easter Sunday Service 2026',
    description: 'Moments of praise and fellowship from our Resurrection Sunday Service.',
    date: '2026-04-05',
    createdAt: new Date().toISOString(),
    images: [
      { id: 'm1', url: 'https://images.unsplash.com/photo-1544427928-c49cdfebf194?q=80&w=1200&auto=format&fit=crop', caption: 'Choir Worship Service' },
      { id: 'm2', url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1200&auto=format&fit=crop', caption: 'Congregation Fellowship' },
      { id: 'm3', url: 'https://images.unsplash.com/photo-1499209974431-9dac3adaf471?q=80&w=1200&auto=format&fit=crop', caption: 'Prayer Time' }
    ]
  },
  {
    id: 'mock_2',
    name: 'Youth Conference & Outreach',
    description: 'Highlights from our annual Youth Halleluyah Summit at Lashibi.',
    date: '2026-02-14',
    createdAt: new Date().toISOString(),
    images: [
      { id: 'm4', url: 'https://images.unsplash.com/photo-1469474094887-b1e7632f7b21?q=80&w=1200&auto=format&fit=crop', caption: 'Youth Worship Team' },
      { id: 'm5', url: 'https://images.unsplash.com/photo-1512401763750-6a953e5e4823?q=80&w=1200&auto=format&fit=crop', caption: 'Group Photo' }
    ]
  }
];

interface FlatPhoto {
  id: string;
  url: string;
  caption?: string;
  groupName: string;
  groupId: string;
  date?: string;
}

export default function GalleryPage() {
  const [groups, setGroups] = useState<GalleryGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>('all');
  
  // Lightbox Modal State
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Fetch gallery groups from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'gallery'),
      (snapshot) => {
        if (!snapshot.empty) {
          const groupList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryGroup));
          groupList.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
          setGroups(groupList);
        } else {
          setGroups(mockDefaultGroups);
        }
        setLoading(false);
      },
      (err) => {
        console.warn("Gallery Firestore fetch failed, using fallback mock data:", err);
        setGroups(mockDefaultGroups);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Compute all photos flattened for display or filtered by group
  const allPhotos: FlatPhoto[] = groups.flatMap(group => 
    (group.images || []).map(img => ({
      ...img,
      groupName: group.name,
      groupId: group.id,
      date: group.date
    }))
  );

  const displayedPhotos = selectedGroupFilter === 'all' 
    ? allPhotos 
    : allPhotos.filter(photo => photo.groupId === selectedGroupFilter);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;

      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev !== null && prev < displayedPhotos.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : displayedPhotos.length - 1));
      } else if (e.key === 'Escape') {
        setLightboxIndex(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, displayedPhotos.length]);

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 flex flex-col">
      <Navbar />

      {/* Hero Header */}
      <header className="relative bg-stone-900 text-white pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-25">
          <img 
            src="https://images.unsplash.com/photo-1544427928-c49cdfebf194?q=80&w=2603&auto=format&fit=crop" 
            alt="Gallery background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/80 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-church-gold/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-church-gold backdrop-blur-md mb-6 border border-church-gold/30">
            <Camera className="h-3.5 w-3.5" /> Photo Gallery
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-4">
            Moments of Grace &amp; Fellowship
          </h1>
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-stone-300 font-light leading-relaxed">
            Explore photo memories from our worship services, youth summits, outreach missions, and church celebrations at CBC Halleluyah Temple.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 mx-auto max-w-7xl px-6 py-12 w-full">
        {/* Group Filter Tabs */}
        <div className="flex items-center justify-center mb-10 overflow-x-auto pb-2 scrollbar-none">
          <div className="inline-flex items-center gap-2 p-1.5 bg-white border border-stone-200 shadow-sm rounded-none">
            <button
              onClick={() => setSelectedGroupFilter('all')}
              className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all rounded-none ${
                selectedGroupFilter === 'all'
                  ? 'bg-church-blue text-white shadow-md'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              All Photos ({allPhotos.length})
            </button>
            {groups.map((group) => (
              <button
                key={group.id}
                onClick={() => setSelectedGroupFilter(group.id)}
                className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all rounded-none whitespace-nowrap ${
                  selectedGroupFilter === group.id
                    ? 'bg-church-blue text-white shadow-md'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                {group.name} ({(group.images || []).length})
              </button>
            ))}
          </div>
        </div>

        {/* Selected Group Description Banner */}
        {selectedGroupFilter !== 'all' && (
          <div className="mb-8 p-6 bg-white border-l-4 border-church-blue shadow-sm">
            {(() => {
              const currentGroup = groups.find(g => g.id === selectedGroupFilter);
              if (!currentGroup) return null;
              return (
                <div>
                  <h3 className="font-serif text-2xl font-bold text-stone-900">{currentGroup.name}</h3>
                  {currentGroup.date && (
                    <p className="text-xs text-stone-400 mt-1 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> {currentGroup.date}
                    </p>
                  )}
                  {currentGroup.description && (
                    <p className="text-sm text-stone-600 mt-2 leading-relaxed">{currentGroup.description}</p>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* Photo Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-stone-400">
            <Loader2 className="h-10 w-10 animate-spin text-church-blue mb-4" />
            <p className="text-xs font-bold uppercase tracking-wider">Loading photo gallery...</p>
          </div>
        ) : displayedPhotos.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
          >
            {displayedPhotos.map((photo, idx) => (
              <motion.div
                key={`${photo.groupId}_${photo.id}_${idx}`}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                onClick={() => setLightboxIndex(idx)}
                className="group relative cursor-pointer overflow-hidden bg-stone-900 border border-stone-200 aspect-[4/3] shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={photo.url}
                  alt={photo.caption || photo.groupName}
                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLElement).setAttribute('src', 'https://images.unsplash.com/photo-1544427928-c49cdfebf194?q=80&w=800&auto=format&fit=crop');
                  }}
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-between" />

                {/* Top Badge */}
                <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="bg-stone-900/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 border border-white/10">
                    {photo.groupName}
                  </span>
                </div>

                {/* Expand Icon */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/20 p-2 text-white backdrop-blur-md hover:bg-white/40">
                  <Maximize2 className="h-4 w-4" />
                </div>

                {/* Bottom Caption */}
                <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white">
                  <p className="text-xs font-bold truncate">{photo.caption || photo.groupName}</p>
                  {photo.date && (
                    <p className="text-[10px] text-stone-300 font-light mt-0.5">{photo.date}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="py-24 text-center border-2 border-dashed border-stone-200">
            <ImageIcon className="mx-auto h-12 w-12 text-stone-300 mb-3" />
            <h3 className="text-base font-bold text-stone-700">No Photos Found</h3>
            <p className="text-xs text-stone-500 mt-1">There are no photos in this group yet.</p>
          </div>
        )}
      </main>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && displayedPhotos[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 md:p-8"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between text-white z-10">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono uppercase tracking-widest text-stone-400">
                  Photo {lightboxIndex + 1} of {displayedPhotos.length}
                </span>
                <span className="hidden sm:inline-block text-stone-600">|</span>
                <span className="text-xs font-bold text-church-gold uppercase tracking-wider hidden sm:inline-block">
                  {displayedPhotos[lightboxIndex].groupName}
                </span>
              </div>
              <button
                onClick={() => setLightboxIndex(null)}
                className="p-2 bg-stone-800 hover:bg-stone-700 text-white transition-colors rounded-full"
                title="Close (Esc)"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Main Center Image */}
            <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
              {/* Prev Button */}
              {displayedPhotos.length > 1 && (
                <button
                  onClick={() => setLightboxIndex(lightboxIndex > 0 ? lightboxIndex - 1 : displayedPhotos.length - 1)}
                  className="absolute left-2 md:left-6 z-10 p-3 bg-stone-900/80 hover:bg-stone-800 text-white rounded-full transition-all border border-white/10 shadow-lg"
                  title="Previous (Left Arrow)"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              )}

              <motion.img
                key={displayedPhotos[lightboxIndex].url}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                src={displayedPhotos[lightboxIndex].url}
                alt={displayedPhotos[lightboxIndex].caption || displayedPhotos[lightboxIndex].groupName}
                className="max-h-[75vh] max-w-[90vw] object-contain shadow-2xl border border-white/10"
                onError={(e) => {
                  (e.target as HTMLElement).setAttribute('src', 'https://images.unsplash.com/photo-1544427928-c49cdfebf194?q=80&w=1200&auto=format&fit=crop');
                }}
              />

              {/* Next Button */}
              {displayedPhotos.length > 1 && (
                <button
                  onClick={() => setLightboxIndex(lightboxIndex < displayedPhotos.length - 1 ? lightboxIndex + 1 : 0)}
                  className="absolute right-2 md:right-6 z-10 p-3 bg-stone-900/80 hover:bg-stone-800 text-white rounded-full transition-all border border-white/10 shadow-lg"
                  title="Next (Right Arrow)"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              )}
            </div>

            {/* Bottom Caption Bar */}
            <div className="text-center text-white z-10 max-w-xl mx-auto">
              <h4 className="font-serif text-lg md:text-xl font-bold">
                {displayedPhotos[lightboxIndex].caption || displayedPhotos[lightboxIndex].groupName}
              </h4>
              <p className="text-xs text-stone-400 mt-1 uppercase tracking-widest">
                Album: {displayedPhotos[lightboxIndex].groupName}
                {displayedPhotos[lightboxIndex].date ? ` • ${displayedPhotos[lightboxIndex].date}` : ''}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
