import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, Play, BookOpen, Download, X, Calendar, Book } from 'lucide-react';
import { mockSermons } from '../data/mockData';
import { Sermon } from '../types';
import SermonCard from '../components/SermonCard';
import Markdown from 'react-markdown';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function Sermons() {
  const [selectedSermon, setSelectedSermon] = useState<Sermon | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All');

  const filteredSermons = mockSermons.filter(sermon => {
    const matchesSearch = sermon.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          sermon.scripture?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="pt-32 pb-24 min-h-screen bg-stone-50">
      {/* Page Header */}
      <section className="bg-white py-20 mb-12 border-b border-stone-100">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <motion.span {...fadeInUp} className="text-[10px] font-bold uppercase tracking-[0.4em] text-church-gold-warm mb-3 block">Media Library</motion.span>
            <motion.h1 {...fadeInUp} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl font-serif font-bold text-stone-900 mb-6">
              Sermons & <span className="text-church-blue italic">Messages</span>
            </motion.h1>
          </div>

          {/* Search & Filter Bar */}
          <motion.div 
            {...fadeInUp}
            transition={{ delay: 0.2 }}
            className="flex flex-col md:flex-row gap-4 items-center justify-between"
          >
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <input 
                type="text" 
                placeholder="Search by title or scripture..."
                className="w-full rounded-full border border-stone-200 bg-stone-50 py-4 pl-12 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-church-blue/20 transition-all font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 p-1 bg-stone-100 rounded-full w-full md:w-auto overflow-x-auto no-scrollbar">
              {['All', 'Sunday', 'Midweek', 'Devotionals'].map((item) => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                    filter === item ? 'bg-church-blue text-white shadow-lg' : 'text-stone-500 hover:text-church-blue'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sermons Grid */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredSermons.map((sermon) => (
              <motion.div
                key={sermon.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
              >
                <SermonCard sermon={sermon} onClick={setSelectedSermon} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredSermons.length === 0 && (
          <div className="text-center py-20">
            <p className="text-stone-400 font-serif italic text-xl">No sermons found matching your search.</p>
          </div>
        )}
      </section>

      {/* Sermon Detail Modal */}
      <AnimatePresence>
        {selectedSermon && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 pointer-events-auto"
          >
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-stone-950/90 backdrop-blur-md"
              onClick={() => setSelectedSermon(null)}
            ></div>

            {/* Content */}
            <motion.div 
              initial={{ y: 50, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 50, scale: 0.95 }}
              className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] bg-white shadow-2xl no-scrollbar"
            >
              <button 
                onClick={() => setSelectedSermon(null)}
                className="absolute top-6 right-6 z-10 rounded-full bg-stone-100 p-3 text-stone-500 transition-all hover:bg-red-50 hover:text-red-500"
              >
                <X className="h-6 w-6" />
              </button>

              <div className="grid lg:grid-cols-12">
                {/* Video / Top Area */}
                <div className="lg:col-span-12">
                  <div className="aspect-video w-full bg-stone-900 shadow-inner">
                    <iframe 
                      width="100%" 
                      height="100%" 
                      src={`https://www.youtube.com/embed/${selectedSermon.videoId}?autoplay=1`} 
                      title={selectedSermon.title}
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>

                {/* Details Area */}
                <div className="lg:col-span-8 p-8 md:p-12 border-r border-stone-100">
                  <div className="mb-6 flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-widest text-church-gold-warm">
                    <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {new Date(selectedSermon.date).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1.5"><Book className="h-3 w-3" /> {selectedSermon.scripture}</span>
                  </div>
                  <h2 className="mb-8 font-serif text-3xl md:text-4xl font-bold text-stone-900 leading-tight">
                    {selectedSermon.title}
                  </h2>
                  
                  {selectedSermon.transcript && (
                    <div className="prose prose-stone prose-stone:text-stone-600 max-w-none">
                      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-100">
                        <BookOpen className="h-5 w-5 text-church-blue" />
                        <h3 className="text-xl font-serif font-bold text-stone-800 m-0">Sermon Transcript & Notes</h3>
                      </div>
                      <Markdown>{selectedSermon.transcript}</Markdown>
                    </div>
                  )}
                </div>

                {/* Sidebar Info */}
                <div className="lg:col-span-4 p-8 bg-stone-50">
                  <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-stone-400 mb-6">Actions</h4>
                  <div className="flex flex-col gap-3">
                    {selectedSermon.notesUrl && (
                      <a 
                        href={selectedSermon.notesUrl}
                        className="flex items-center justify-center gap-2 rounded-xl bg-church-blue py-4 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-stone-900"
                      >
                        <Download className="h-4 w-4" /> Download PDF Notes
                      </a>
                    )}
                    <button className="flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white py-4 text-sm font-bold uppercase tracking-widest text-stone-600 transition-all hover:bg-stone-100">
                      Share Message
                    </button>
                  </div>

                  <div className="mt-12 rounded-2xl bg-white p-6 shadow-sm border border-stone-100">
                    <h5 className="text-[10px] font-bold uppercase tracking-widest text-church-gold-warm mb-4">Pastor Info</h5>
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-stone-100 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1544427928-c49cdfebf194?q=80&w=2603&auto=format&fit=crop" alt="Pastor" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-stone-900">Rev. Charles Allotey</p>
                        <p className="text-[10px] text-stone-400 uppercase tracking-widest">Head Pastor</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
