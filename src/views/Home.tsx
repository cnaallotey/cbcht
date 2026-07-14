import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight, MapPin, Clock, Calendar, Play, BookOpen, Quote, X } from 'lucide-react';
import { mockSermons, mockBlogPosts, mockServiceTimes } from '../data/mockData';
import SermonCard from '../components/SermonCard';
import BlogCard from '../components/BlogCard';
import { db } from '../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Sermon, BlogPost, ServiceTime } from '../types';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

export default function Home() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [services, setServices] = useState<ServiceTime[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [playLatestSermon, setPlayLatestSermon] = useState(false);

  useEffect(() => {
    const unsubSermons = onSnapshot(collection(db, 'sermons'), (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sermon));
      list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setSermons(list);
    }, (err) => console.error("Home sermons fetch error:", err));

    const unsubBlogs = onSnapshot(collection(db, 'blogPosts'), (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
      list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setBlogs(list);
    }, (err) => console.error("Home blogs fetch error:", err));

    const unsubServices = onSnapshot(collection(db, 'serviceTimes'), (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ServiceTime));
      setServices(list);
    }, (err) => console.error("Home services fetch error:", err));

    return () => {
      unsubSermons();
      unsubBlogs();
      unsubServices();
    };
  }, []);

  const activeSermons = sermons.length > 0 ? sermons : mockSermons;
  const activeBlogs = blogs.length > 0 ? blogs : mockBlogPosts;
  const activeServices = services.length > 0 ? services : mockServiceTimes;

  const latestSermon = activeSermons[0];
  const featuredBlog = activeBlogs[0];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center pt-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2673&auto=format&fit=crop" 
            alt="Church Hero" 
            className="h-full w-full object-cover brightness-[0.3]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-church-blue/40 to-transparent"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 text-white">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.4em] text-church-gold">
              Welcome to Calvary Baptist Church
            </h2>
            <h1 className="mb-6 font-serif text-5xl font-bold leading-[1.1] md:text-8xl">
              A Place of Worship, Community & the Word
            </h1>
            <p className="mb-10 text-lg leading-relaxed text-stone-300 md:text-xl max-w-lg">
              Join us in Lashibi as we celebrate the living Word and grow together in faith.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="#sermons" 
                className="flex items-center justify-center gap-2 rounded-sm bg-church-gold px-8 py-5 text-sm font-bold uppercase tracking-widest text-church-blue transition-all hover:bg-white hover:scale-105"
              >
                Watch Latest Sermon
              </a>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50"
        >
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/0 via-white to-white/0"></div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Scroll</span>
        </motion.div>
      </section>

      {/* Service Info Banner */}
      <section className="relative z-20 mx-auto w-full max-w-full">
        <div className="flex flex-wrap items-center justify-around bg-church-gold py-6 px-10 text-church-blue font-bold text-sm tracking-widest uppercase gap-6">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>Lashibi, Tema, Ghana</span>
          </div>
          {activeServices.map((service) => (
            <div key={service.id || service.serviceName} className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{service.serviceName}: {service.day}s {service.time}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Sermon Section */}
      <section id="sermons" className="py-24 bg-stone-50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-xl">
              <motion.span 
                {...fadeInUp}
                className="text-[10px] font-bold uppercase tracking-[0.4em] text-church-gold-warm mb-3 block"
              >
                Media Library
              </motion.span>
              <motion.h2 
                {...fadeInUp}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-5xl font-serif font-bold text-stone-900"
              >
                The Latest <span className="text-church-blue italic">Messages</span>
              </motion.h2>
            </div>
            <motion.div 
              {...fadeInUp}
              className="inline-block"
            >
              <Link 
                href="/sermons"
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-church-blue border-b-2 border-church-blue pb-1 transition-all hover:gap-4"
              >
                Browse All Sermons <ArrowRight className="h-3 w-3" />
              </Link>
            </motion.div>
          </div>

          <div className="grid gap-12 lg:grid-cols-12">
            <motion.div 
              {...fadeInUp}
              className="lg:col-span-12 group relative overflow-hidden bg-white shadow-xl border border-stone-200"
            >
              {playLatestSermon ? (
                <div className="aspect-video w-full bg-black">
                  <iframe
                    className="w-full h-full border-none"
                    src={`https://www.youtube.com/embed/${latestSermon.videoId}?autoplay=1`}
                    title={latestSermon.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <div className="relative aspect-video w-full overflow-hidden cursor-pointer" onClick={() => setPlayLatestSermon(true)}>
                  <img 
                    src={latestSermon.thumbnail} 
                    alt={latestSermon.title} 
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="rounded-none bg-church-gold p-6 text-church-blue shadow-2xl transition-transform group-hover:scale-110">
                      <Play className="h-8 w-8 fill-current" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white pointer-events-none">
                    <div className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-church-gold">
                      <span>Most Recent</span>
                      <span className="h-1 w-1 rounded-full bg-white/30"></span>
                      <span>{latestSermon.scripture}</span>
                    </div>
                    <h3 className="mb-6 font-serif text-3xl md:text-4xl font-bold leading-tight">
                      {latestSermon.title}
                    </h3>
                    <div className="flex gap-4 pointer-events-auto">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setPlayLatestSermon(true);
                        }}
                        className="flex items-center gap-2 rounded-none bg-white px-6 py-3 text-sm font-bold uppercase tracking-widest text-church-blue transition-colors hover:bg-church-gold"
                      >
                        Watch Now <Play className="h-4 w-4 fill-current" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Side Sermons */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {activeSermons.slice(1, 3).map((sermon, idx) => (
                <motion.div 
                  key={sermon.id}
                  {...fadeInUp}
                  transition={{ delay: 0.2 + (idx * 0.1) }}
                >
                  <SermonCard sermon={sermon} onClick={() => {}} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pastor Welcome Section */}
      <section id="about" className="py-24 bg-white overflow-hidden">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-16 lg:grid-cols-2 items-center">
            <motion.div 
              {...fadeInUp}
              className="relative"
            >
              <div className="relative aspect-[4/5] overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1544427928-c49cdfebf194?q=80&w=2603&auto=format&fit=crop" 
                  alt="Reverend Lina Sunu Atta" 
                  className="h-full w-full object-cover"
                />
                {/* Accent shape */}
                <div className="absolute -bottom-6 -right-6 h-48 w-48 bg-church-gold -z-10"></div>
              </div>
              <div className="absolute -bottom-10 -left-10 hidden md:block bg-church-blue p-8 text-white shadow-xl max-w-xs">
                <Quote className="h-8 w-8 text-church-gold mb-4" />
                <p className="font-serif text-lg italic leading-relaxed">
                  "Our mission is to build a community that reflects the glory of God in every action."
                </p>
                <div className="mt-4 text-xs font-bold uppercase tracking-widest text-church-gold">
                  Reverend Lina Sunu Atta
                </div>
              </div>
            </motion.div>

            <div className="flex flex-col gap-8">
              <motion.div {...fadeInUp}>
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-church-gold-warm mb-3 block">Welcome Home</span>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-6">
                  A Message from <span className="text-church-blue italic">Our Pastor</span>
                </h2>
                <p className="text-lg text-stone-600 leading-relaxed mb-6">
                  At Calvary Baptist Church — Halleluyah Temple, we believe that every individual has a divine purpose. Our doors are open to everyone, regardless of where they are on their spiritual journey.
                </p>
                <p className="text-lg text-stone-600 leading-relaxed">
                  Since our founding in Lashibi, we have seen countless lives transformed by the power of the Gospel. We invite you to be part of what God is doing here. Come and experience true community and the life-changing Word of God.
                </p>
              </motion.div>

              <motion.div 
                {...fadeInUp}
                className="grid grid-cols-2 gap-8 py-8 border-y border-stone-100"
              >
                <div>
                  <h4 className="text-3xl font-serif font-bold text-church-blue">30+</h4>
                  <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Years of Ministry</p>
                </div>
                <div>
                  <h4 className="text-3xl font-serif font-bold text-church-blue">1200+</h4>
                  <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Members</p>
                </div>
              </motion.div>

              <motion.div {...fadeInUp}>
              <Link 
                href="/about" 
                className="inline-flex items-center gap-2 rounded-full bg-church-blue px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-stone-900 hover:shadow-xl"
              >
                Learn More About Us <ArrowRight className="h-4 w-4" />
              </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Teaser */}
      <section id="blog" className="py-24 bg-stone-50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-xl">
              <motion.span 
                {...fadeInUp}
                className="text-[10px] font-bold uppercase tracking-[0.4em] text-church-gold-warm mb-3 block"
              >
                Daily Devotionals & Announcements
              </motion.span>
              <motion.h2 
                {...fadeInUp}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-5xl font-serif font-bold text-stone-900"
              >
                Daily <span className="text-church-blue italic">Devotionals & Announcements</span>
              </motion.h2>
            </div>
            <Link 
              href="/blog" 
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-church-blue border-b-2 border-church-blue pb-1 transition-all hover:gap-4"
            >
              Daily Devotionals & Announcements <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid gap-10 md:grid-cols-2">
            {activeBlogs.map((post, idx) => (
              <motion.div
                key={post.id}
                {...fadeInUp}
                transition={{ delay: idx * 0.1 }}
              >
                <BlogCard post={post} onClick={(clickedPost) => setSelectedPost(clickedPost)} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Pin */}
      <section className="bg-church-blue py-20 text-white text-center">
        <div className="mx-auto max-w-3xl px-6">
          <motion.div {...fadeInUp}>
            <h2 className="mb-6 font-serif text-4xl font-bold leading-tight md:text-5xl">
              Ready to <span className="text-church-gold italic">Join Us</span> this Sunday?
            </h2>
            <p className="mb-10 text-lg text-white/70">
              We can't wait to meet you. Join our vibrant community and experience the warmth and power of Halleluyah Temple.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link 
                href="/contact" 
                className="w-full sm:w-auto rounded-full bg-church-gold px-12 py-5 text-sm font-bold uppercase tracking-widest text-church-blue transition-all hover:bg-white"
              >
                Plan Your Visit
              </Link>
              <div className="text-white/50 text-sm italic">
                Need more info? <Link href="/contact" className="text-white font-bold underline hover:text-church-gold">Contact Us</Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

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
