import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, MapPin, Clock, Calendar, Play, BookOpen, Quote } from 'lucide-react';
import { mockSermons, mockBlogPosts, mockServiceTimes } from '../data/mockData';
import SermonCard from '../components/SermonCard';
import BlogCard from '../components/BlogCard';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

export default function Home() {
  const latestSermon = mockSermons[0];
  const featuredBlog = mockBlogPosts[0];

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
        <div className="flex flex-wrap items-center justify-around bg-church-gold py-6 px-10 text-church-blue font-bold text-sm tracking-widest uppercase">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>Lashibi, Ghana</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Sunday Services: 8:00 AM & 10:30 AM</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Midweek: Wednesdays 6:30 PM</span>
          </div>
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
            <motion.a 
              {...fadeInUp}
              href="#" 
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-church-blue border-b-2 border-church-blue pb-1 transition-all hover:gap-4"
            >
              Browse All Sermons <ArrowRight className="h-3 w-3" />
            </motion.a>
          </div>

          <div className="grid gap-12 lg:grid-cols-12">
            {/* Featured Sermon */}
            <motion.div 
              {...fadeInUp}
              className="lg:col-span-8 group relative overflow-hidden rounded-[2.5rem] bg-white shadow-xl"
            >
              <div className="aspect-video w-full overflow-hidden">
                <img 
                  src={latestSermon.thumbnail} 
                  alt={latestSermon.title} 
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="rounded-full bg-church-gold p-6 text-church-blue shadow-2xl">
                    <Play className="h-8 w-8 fill-current" />
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
                <div className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-church-gold">
                  <span>Most Recent</span>
                  <span className="h-1 w-1 rounded-full bg-white/30"></span>
                  <span>{latestSermon.scripture}</span>
                </div>
                <h3 className="mb-6 font-serif text-3xl md:text-4xl font-bold leading-tight">
                  {latestSermon.title}
                </h3>
                <div className="flex gap-4">
                  <button className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold uppercase tracking-widest text-church-blue transition-colors hover:bg-church-gold">
                    Watch Now <Play className="h-4 w-4 fill-current" />
                  </button>
                  <button className="flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm font-bold uppercase tracking-widest text-white backdrop-blur-md transition-colors hover:bg-white/20">
                    Sermon Notes <BookOpen className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Side Sermons */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {mockSermons.slice(1, 3).map((sermon, idx) => (
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
              <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1544427928-c49cdfebf194?q=80&w=2603&auto=format&fit=crop" 
                  alt="Pastor Allotey" 
                  className="h-full w-full object-cover"
                />
                {/* Accent shape */}
                <div className="absolute -bottom-6 -right-6 h-48 w-48 bg-church-gold rounded-3xl -z-10"></div>
              </div>
              <div className="absolute -bottom-10 -left-10 hidden md:block rounded-3xl bg-church-blue p-8 text-white shadow-xl max-w-xs">
                <Quote className="h-8 w-8 text-church-gold mb-4" />
                <p className="font-serif text-lg italic leading-relaxed">
                  "Our mission is to build a community that reflects the glory of God in every action."
                </p>
                <div className="mt-4 text-xs font-bold uppercase tracking-widest text-church-gold">
                  Rev. Dr. Charles K. Allotey
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
                <a 
                  href="#about" 
                  className="inline-flex items-center gap-2 rounded-full bg-church-blue px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-stone-900 hover:shadow-xl"
                >
                  Learn More About Us <ArrowRight className="h-4 w-4" />
                </a>
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
                Pastor's Blog
              </motion.span>
              <motion.h2 
                {...fadeInUp}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-5xl font-serif font-bold text-stone-900"
              >
                Daily <span className="text-church-blue italic">Devotionals</span>
              </motion.h2>
            </div>
            <motion.a 
              {...fadeInUp}
              href="#blog" 
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-church-blue border-b-2 border-church-blue pb-1 transition-all hover:gap-4"
            >
              Read All Posts <ArrowRight className="h-3 w-3" />
            </motion.a>
          </div>

          <div className="grid gap-10 md:grid-cols-2">
            {mockBlogPosts.map((post, idx) => (
              <motion.div
                key={post.id}
                {...fadeInUp}
                transition={{ delay: idx * 0.1 }}
              >
                <BlogCard post={post} onClick={() => {}} />
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
              <a 
                href="#contact" 
                className="w-full sm:w-auto rounded-full bg-church-gold px-12 py-5 text-sm font-bold uppercase tracking-widest text-church-blue transition-all hover:bg-white"
              >
                Plan Your Visit
              </a>
              <div className="text-white/50 text-sm italic">
                Need more info? <a href="#contact" className="text-white font-bold underline hover:text-church-gold">Contact Us</a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
