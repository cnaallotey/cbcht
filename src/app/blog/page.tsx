"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, onSnapshot } from 'firebase/firestore';
import { Search, ArrowLeft, MessageSquare, User, Calendar, Mail, X } from 'lucide-react';
import { db } from '../../lib/firebase';
import { BlogPost } from '../../types';
import { mockBlogPosts } from '../../data/mockData';
import BlogCard from '../../components/BlogCard';

export default function BlogListingPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'All' | 'Devotional' | 'Announcement'>('All');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubBlogs = onSnapshot(collection(db, 'blogPosts'), (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
      list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      // Fallback to mock data if empty
      if (list.length === 0) {
        setBlogs(mockBlogPosts);
      } else {
        setBlogs(list);
      }
      setLoading(false);
    }, (err) => {
      console.error("Blog page fetch error, falling back to mock data:", err);
      setBlogs(mockBlogPosts);
      setLoading(false);
    });

    return () => unsubBlogs();
  }, []);

  // Filter logic
  const filteredBlogs = blogs.filter(post => {
    // Search query matching
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.author && post.author.toLowerCase().includes(searchQuery.toLowerCase())) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase());

    // Category tab filtering
    if (activeCategory === 'All') return matchesSearch;
    if (activeCategory === 'Devotional') {
      return matchesSearch && post.category === 'Daily Devotional';
    }
    if (activeCategory === 'Announcement') {
      return matchesSearch && (
        post.category === 'Announcement' || 
        post.category === 'Event Update' || 
        post.category === 'Community News'
      );
    }
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 pt-32 pb-24 font-sans">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Navigation back */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-church-blue hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        {/* Page Header */}
        <div className="mb-12 border-b border-stone-200 pb-10">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-church-gold-warm mb-3 block">
            Calvary Baptist Church — Halleluyah Temple
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-stone-900 mb-6 leading-tight">
            Daily Devotionals <span className="text-church-blue italic">& Announcements</span>
          </h1>
          <p className="text-stone-600 max-w-2xl leading-relaxed text-sm md:text-base">
            Stay nourished in the Word with our daily devotionals written by the leadership team, and keep up to date with the latest announcements, events, and community news of Calvary Baptist Church.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 mb-12">
          {/* Category Tabs */}
          <div className="flex gap-2 p-1 bg-stone-200/50 border border-stone-200 rounded-none w-fit">
            {(['All', 'Devotional', 'Announcement'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-none text-xs font-bold uppercase tracking-widest transition-all ${
                  activeCategory === cat 
                    ? 'bg-church-blue text-white shadow-md' 
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                {cat === 'All' ? 'All Updates' : cat === 'Devotional' ? 'Devotionals' : 'Announcements'}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search devotionals, announcements..."
              className="w-full rounded-none border border-stone-200 bg-white py-3.5 pl-12 pr-4 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-church-blue/10 focus:border-church-blue/40 transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Content Listing Grid */}
        {loading ? (
          <div className="text-center py-24 text-stone-500">
            <div className="inline-block animate-spin h-6 w-6 border-2 border-church-blue border-t-transparent rounded-full mb-4"></div>
            <p className="text-sm font-bold uppercase tracking-wider">Loading dynamic posts...</p>
          </div>
        ) : (
          <>
            <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-2">
              {filteredBlogs.map((post) => (
                <div key={post.id} className="border border-stone-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                  <BlogCard post={post} onClick={(clickedPost) => setSelectedPost(clickedPost)} />
                </div>
              ))}
            </div>

            {filteredBlogs.length === 0 && (
              <div className="text-center py-24 border border-stone-200 bg-white shadow-sm">
                <MessageSquare className="h-12 w-12 text-stone-300 mx-auto mb-4" />
                <h3 className="font-serif text-xl font-bold mb-1 text-stone-900">No Articles Found</h3>
                <p className="text-stone-500 text-sm max-w-sm mx-auto">
                  We couldn't find any articles or announcements matching your selection or search query.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Blog Post Detail Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border border-stone-200 w-full max-w-2xl rounded-none p-6 md:p-8 text-stone-900 shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setSelectedPost(null)}
              className="absolute right-6 top-6 p-2 rounded-none bg-stone-50 border border-stone-200 hover:bg-stone-100 transition-colors text-stone-500 hover:text-stone-900"
            >
              <X className="h-5 w-5" />
            </button>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-church-gold-warm mb-2 block">
              {selectedPost.category}
            </span>
            <h3 className="font-serif text-3xl font-bold mb-3 text-stone-900">
              {selectedPost.title}
            </h3>
            <div className="text-xs text-stone-500 font-bold uppercase tracking-widest mb-6 pb-4 border-b border-stone-100">
              {new Date(selectedPost.date).toLocaleDateString(undefined, { dateStyle: 'medium' })} — By {selectedPost.author}
            </div>
            {selectedPost.image && (
              <div className="mb-6 aspect-[16/9] w-full overflow-hidden border border-stone-200 bg-stone-50">
                <img src={selectedPost.image} alt={selectedPost.title} className="h-full w-full object-cover" />
              </div>
            )}
            <div className="prose prose-stone max-w-none text-stone-600 leading-relaxed text-sm whitespace-pre-wrap font-sans">
              {selectedPost.content}
            </div>
            <div className="mt-8 pt-4 border-t border-stone-100 flex justify-end">
              <button 
                onClick={() => setSelectedPost(null)}
                className="px-6 py-2.5 bg-church-blue hover:bg-blue-800 text-white font-bold uppercase tracking-widest text-xs shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
