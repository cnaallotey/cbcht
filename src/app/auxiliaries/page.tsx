'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { motion } from 'motion/react';
import { 
  Shield, Heart, Sparkles, ArrowRight, Users, 
  BookOpen, Calendar, Clock, CheckCircle2, MapPin 
} from 'lucide-react';

const auxiliariesList = [
  {
    id: 'mens-ministry',
    title: "Men's Ministry",
    subtitle: "Men of Valor — Strong in Faith, Leadership & Service",
    description: "Empowering men to be godly leaders in their homes, church, and society through fellowship, accountability, and the living Word.",
    href: "/auxiliaries/mens-ministry",
    icon: Shield,
    badge: "Brotherhood & Discipleship",
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1200&auto=format&fit=crop",
    pillars: ["Brotherhood & Accountability", "Family Leadership", "Community Outreach & Service", "Biblical Discipleship"],
    meeting: "2nd & 4th Saturday • 6:30 AM"
  },
  {
    id: 'womens-ministry',
    title: "Women's Ministry",
    subtitle: "Women of Grace — Clothed with Strength, Dignity & Prayer",
    description: "Fostering a supportive sisterhood where women grow spiritually, mentor one another, support families, and impact the community through charitable works.",
    href: "/auxiliaries/womens-ministry",
    icon: Heart,
    badge: "Sisterhood & Prayer",
    image: "https://images.unsplash.com/photo-1544427928-c49cdfebf194?q=80&w=1200&auto=format&fit=crop",
    pillars: ["Spiritual Growth & Prayer", "Mentorship & Counseling", "Hospitality & Mercy Ministry", "Annual Women's Retreat"],
    meeting: "Every 3rd Saturday • 7:00 AM"
  },
  {
    id: 'young-generation',
    title: "Young Generation",
    subtitle: "Children, Teens & Young Adults — Ignited for Purpose",
    description: "Building the next generation of passionate believers through vibrant worship, career guidance, relevant Bible teaching, and authentic youth fellowship.",
    href: "/auxiliaries/young-generation",
    icon: Sparkles,
    badge: "Youth & NextGen",
    image: "https://images.unsplash.com/photo-1469474094887-b1e7632f7b21?q=80&w=1200&auto=format&fit=crop",
    pillars: ["Children's Sunday School", "Teens & Campus Discipleship", "Career & Talent Empowerment", "Youth Worship & Socials"],
    meeting: "Sunday • 8:00 AM & Friday • 6:30 PM"
  }
];

export default function AuxiliariesOverviewPage() {
  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 flex flex-col">
      <Navbar />

      {/* Hero Banner */}
      <header className="relative bg-stone-900 text-white pt-36 pb-24 overflow-hidden">
        <div className="absolute inset-0 opacity-25">
          <img 
            src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2670&auto=format&fit=crop" 
            alt="Auxiliaries Banner" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/80 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-church-gold/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-church-gold backdrop-blur-md mb-6 border border-church-gold/30">
            <Users className="h-3.5 w-3.5" /> Church Auxiliaries &amp; Ministries
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-6">
            Growing Together in Faith, Fellowship &amp; Purpose
          </h1>
          <p className="mx-auto max-w-3xl text-base sm:text-lg text-stone-300 font-light leading-relaxed">
            At CBC Halleluyah Temple, our auxiliary ministries provide tailored spaces for every age and life stage to connect, serve, and flourish in Christ.
          </p>
        </div>
      </header>

      {/* Auxiliaries Cards Grid */}
      <main className="flex-1 mx-auto max-w-7xl px-6 py-16 w-full space-y-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-stone-900 mb-3">Our Core Auxiliary Ministries</h2>
          <p className="text-sm text-stone-600">Find your place of belonging, spiritual growth, and impactful service.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {auxiliariesList.map((aux, idx) => {
            const Icon = aux.icon;
            return (
              <motion.div
                key={aux.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.15 }}
                className="bg-white border border-stone-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group overflow-hidden"
              >
                <div>
                  {/* Card Image */}
                  <div className="relative h-56 w-full overflow-hidden bg-stone-900">
                    <img 
                      src={aux.image} 
                      alt={aux.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-stone-900/80 backdrop-blur-md text-church-gold border border-church-gold/30 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                        {aux.badge}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 md:p-8 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-church-blue/10 text-church-blue shrink-0">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-serif text-2xl font-bold text-stone-900 group-hover:text-church-blue transition-colors">
                          {aux.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-xs font-bold uppercase tracking-wider text-church-gold">
                      {aux.subtitle}
                    </p>

                    <p className="text-sm text-stone-600 leading-relaxed">
                      {aux.description}
                    </p>

                    <div className="pt-3 border-t border-stone-100 space-y-2">
                      <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Key Pillars:</div>
                      {aux.pillars.map((pillar) => (
                        <div key={pillar} className="flex items-center gap-2 text-xs text-stone-700">
                          <CheckCircle2 className="h-3.5 w-3.5 text-church-blue shrink-0" />
                          <span>{pillar}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 flex items-center gap-2 text-xs text-stone-500 font-medium">
                      <Clock className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                      <span>{aux.meeting}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-6 md:px-8 pt-0 border-t border-stone-100 bg-stone-50/50">
                  <Link
                    href={aux.href}
                    className="inline-flex items-center justify-center gap-2 w-full bg-church-blue hover:bg-blue-800 text-white py-3 text-xs font-bold uppercase tracking-widest transition-all shadow-sm group-hover:shadow-md"
                  >
                    Explore {aux.title} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Banner */}
        <section className="bg-stone-900 text-white p-8 md:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border-l-4 border-church-gold">
          <div>
            <h3 className="font-serif text-2xl md:text-3xl font-bold mb-2">Want to Join an Auxiliary?</h3>
            <p className="text-stone-300 text-sm max-w-xl leading-relaxed">
              We welcome every member and visitor to connect with our vibrant fellowship groups. Reach out to get plugged in!
            </p>
          </div>
          <Link
            href="/contact"
            className="rounded-none bg-church-gold hover:bg-amber-400 text-stone-900 px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap shadow-md"
          >
            Get Connected Today
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
