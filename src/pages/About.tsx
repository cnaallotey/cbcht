import React from 'react';
import { motion } from 'motion/react';
import { History, ShieldCheck, Heart, User, Users, MapPin } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function About() {
  const coreBeliefs = [
    { title: 'The Bible', description: 'We believe the Bible is the inspired, only infallible, authoritative Word of God.' },
    { title: 'The Trinity', description: 'We believe that there is one God, eternally existent in three persons: Father, Son and Holy Spirit.' },
    { title: 'Salvation', description: 'We believe that for the salvation of lost and sinful people, regeneration by the Holy Spirit is absolutely essential.' },
    { title: 'Community', description: 'We believe in the spiritual unity of believers in our Lord Jesus Christ and the call to serve one another.' }
  ];

  return (
    <div className="pt-32 pb-24">
      {/* Page Header */}
      <section className="bg-stone-50 py-20 mb-20">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <motion.span {...fadeInUp} className="text-[10px] font-bold uppercase tracking-[0.4em] text-church-gold-warm mb-3 block">Our Identity</motion.span>
          <motion.h1 {...fadeInUp} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl font-serif font-bold text-stone-900 mb-6">
            About <span className="text-church-blue italic">Our Church</span>
          </motion.h1>
          <motion.p {...fadeInUp} transition={{ delay: 0.2 }} className="mx-auto max-w-2xl text-lg text-stone-600 leading-relaxed">
            Discover the heart behind Calvary Baptist Church – Halleluyah Temple, our history, our mission, and what we believe.
          </motion.p>
        </div>
      </section>

      {/* Story & History */}
      <section className="mx-auto max-w-7xl px-6 mb-32">
        <div className="grid gap-16 lg:grid-cols-2 items-center">
          <motion.div {...fadeInUp}>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-church-blue/10 text-church-blue">
                <History className="h-5 w-5" />
              </div>
              <h2 className="text-3xl font-serif font-bold">Our Humble Beginnings</h2>
            </div>
            <p className="text-stone-600 leading-relaxed mb-6">
              Founded in the early 1990s, Calvary Baptist Church started with a small group of faithful believers meeting in a living room in Lashibi. Our vision was simple: to create a space where the Gospel could be preached without compromise and where community could flourish.
            </p>
            <p className="text-stone-600 leading-relaxed mb-8">
              Over the decades, God has blessed our faithfulness. What started as a handful of members has grown into Halleluyah Temple, a vibrant spiritual home for over a thousand worshippers today.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div className="border-l-4 border-church-gold pl-6">
                <h4 className="text-2xl font-serif font-bold text-church-blue mb-1">1992</h4>
                <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Church Founded</p>
              </div>
              <div className="border-l-4 border-church-gold pl-6">
                <h4 className="text-2xl font-serif font-bold text-church-blue mb-1">Lashibi</h4>
                <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Our Spiritual Home</p>
              </div>
            </div>
          </motion.div>
          <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
            <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1544427928-c49cdfebf194?q=80&w=2603&auto=format&fit=crop" 
                alt="Church History"
                className="h-full w-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-church-blue py-32 text-white mb-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 h-64 w-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <div className="grid gap-20 lg:grid-cols-2">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Heart className="h-6 w-6 text-church-gold" />
                <h2 className="text-3xl font-serif font-bold tracking-tight">Our Mission</h2>
              </div>
              <p className="text-2xl font-serif leading-relaxed text-stone-200">
                "To preach the gospel of Christ, build a community of disciples, and transform lives through the living Word of God in Lashibi and beyond."
              </p>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-6">
                <ShieldCheck className="h-6 w-6 text-church-gold" />
                <h2 className="text-3xl font-serif font-bold tracking-tight">Our Vision</h2>
              </div>
              <p className="text-2xl font-serif leading-relaxed text-stone-200">
                "To be a light in the darkness, a sanctuary for the weary, and a powerhouse for spiritual transformation in Ghana."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Beliefs */}
      <section className="mx-auto max-w-7xl px-6 lg:mb-32 mb-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-4">What We <span className="text-church-blue italic">Believe</span></h2>
          <p className="text-stone-500 max-w-xl mx-auto">Our statement of faith anchors everything we do, from our Sunday services to our community outreach.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {coreBeliefs.map((belief, idx) => (
            <motion.div 
              key={belief.title}
              {...fadeInUp}
              transition={{ delay: idx * 0.1 }}
              className="rounded-[2rem] bg-stone-50 p-10 transition-all hover:bg-white hover:shadow-xl hover:shadow-blue-900/5 group"
            >
              <h3 className="text-xl font-serif font-bold mb-4 text-church-blue group-hover:text-stone-900">{belief.title}</h3>
              <p className="text-sm text-stone-600 leading-relaxed">{belief.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Leadership Team Placeholder */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-900">Leadership <span className="text-church-blue italic">Team</span></h2>
        </div>
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { name: 'Rev. Dr. Charles Allotey', role: 'Head Pastor' },
            { name: 'Rev. Emmanuel Mensah', role: 'Associate Pastor' },
            { name: 'Deaconess Mary Appiah', role: 'Women\'s Ministry' }
          ].map((leader, idx) => (
            <motion.div 
              key={leader.name}
              {...fadeInUp}
              transition={{ delay: idx * 0.1 }}
              className="text-center"
            >
              <div className="relative mb-6 aspect-square overflow-hidden rounded-[2.5rem] bg-stone-100 shadow-md">
                <div className="absolute inset-0 flex items-center justify-center text-stone-300">
                  <User className="h-20 w-20" />
                </div>
              </div>
              <h4 className="text-xl font-serif font-bold text-stone-900 mb-1">{leader.name}</h4>
              <p className="text-xs font-bold uppercase tracking-widest text-church-gold-warm">{leader.role}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
