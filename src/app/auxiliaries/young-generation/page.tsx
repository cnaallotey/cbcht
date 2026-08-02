'use client';

import React, { useState } from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { motion } from 'motion/react';
import { 
  Sparkles, CheckCircle2, Calendar, Clock, MapPin, 
  Send, Users, Music, Briefcase, GraduationCap, Flame, Loader2 
} from 'lucide-react';
import { db } from '../../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function YoungGenerationPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subGroup, setSubGroup] = useState('Teens');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'contactRequests'), {
        name,
        email,
        subject: `Young Generation Join Inquiry (${subGroup})`,
        message: `Phone: ${phone}\nSub-Group: ${subGroup}\n\n${message}`,
        timestamp: new Date().toISOString()
      });
      setSubmitted(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err: any) {
      console.error("Inquiry submission error:", err);
      alert("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 flex flex-col">
      <Navbar />

      {/* Hero Header */}
      <header className="relative bg-stone-900 text-white pt-36 pb-24 overflow-hidden">
        <div className="absolute inset-0 opacity-35">
          <img 
            src="https://images.unsplash.com/photo-1469474094887-b1e7632f7b21?q=80&w=2547&auto=format&fit=crop" 
            alt="Young Generation Youth Worship" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/80 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-church-gold/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-church-gold backdrop-blur-md mb-6 border border-church-gold/30">
            <Sparkles className="h-3.5 w-3.5" /> CBC NextGen Auxiliary
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-4">
            Young Generation Ministry
          </h1>
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-stone-300 font-light leading-relaxed mb-6">
            Empowering children, teenagers, and young adults to discover their God-given identity, excel in life, and impact their world for Christ.
          </p>
          <div className="inline-block bg-stone-800/80 backdrop-blur-md px-6 py-3 border border-stone-700 text-xs font-serif italic text-church-gold">
            &ldquo;Let no one despise your youth, but set an example for believers in speech, conduct, love, faith and purity.&rdquo; &mdash; 1 Timothy 4:12
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 mx-auto max-w-7xl px-6 py-16 w-full space-y-16">
        {/* 3 Sub-Groups Breakdown */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-church-gold block mb-1">Our Age Divisions</span>
            <h2 className="font-serif text-3xl font-bold text-stone-900 mb-2">Tailored Ministry for Every Youth Stage</h2>
            <p className="text-sm text-stone-600">We nurture young minds from childhood through campus years into young adulthood.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Children's Ministry */}
            <div className="bg-white border border-stone-200 p-8 shadow-sm flex flex-col justify-between hover:border-church-blue transition-colors">
              <div>
                <div className="p-3 bg-amber-100 text-amber-800 w-fit mb-4 font-bold text-xs uppercase tracking-wider">
                  Ages 3 &ndash; 12
                </div>
                <h3 className="font-serif text-2xl font-bold text-stone-900 mb-2">Children&apos;s Church</h3>
                <p className="text-xs font-bold uppercase tracking-widest text-church-gold mb-3">Kingdom Kids</p>
                <p className="text-sm text-stone-600 leading-relaxed mb-4">
                  Interactive Sunday School lessons, Bible memory verses, songs, puppet shows, and creative arts that lay a solid spiritual foundation.
                </p>
              </div>
              <div className="pt-4 border-t border-stone-100 text-xs text-stone-500 font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-church-blue" />
                <span>Sunday Service • 8:00 AM</span>
              </div>
            </div>

            {/* Teens Ministry */}
            <div className="bg-white border border-stone-200 p-8 shadow-sm flex flex-col justify-between hover:border-church-blue transition-colors">
              <div>
                <div className="p-3 bg-blue-100 text-blue-800 w-fit mb-4 font-bold text-xs uppercase tracking-wider">
                  Ages 13 &ndash; 19
                </div>
                <h3 className="font-serif text-2xl font-bold text-stone-900 mb-2">Teens Ministry</h3>
                <p className="text-xs font-bold uppercase tracking-widest text-church-gold mb-3">Generation Impact</p>
                <p className="text-sm text-stone-600 leading-relaxed mb-4">
                  A safe, high-energy environment addressing identity, peer pressure, academics, and spiritual growth through vibrant discussions and camps.
                </p>
              </div>
              <div className="pt-4 border-t border-stone-100 text-xs text-stone-500 font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-church-blue" />
                <span>Friday Youth Night • 6:30 PM</span>
              </div>
            </div>

            {/* Young Adults */}
            <div className="bg-white border border-stone-200 p-8 shadow-sm flex flex-col justify-between hover:border-church-blue transition-colors">
              <div>
                <div className="p-3 bg-purple-100 text-purple-800 w-fit mb-4 font-bold text-xs uppercase tracking-wider">
                  Ages 20 &ndash; 35
                </div>
                <h3 className="font-serif text-2xl font-bold text-stone-900 mb-2">Young Adults &amp; Campus</h3>
                <p className="text-xs font-bold uppercase tracking-widest text-church-gold mb-3">Halleluyah Trailblazers</p>
                <p className="text-sm text-stone-600 leading-relaxed mb-4">
                  Empowering university students and young professionals with career mentorship, relationship seminars, worship nights, and missions.
                </p>
              </div>
              <div className="pt-4 border-t border-stone-100 text-xs text-stone-500 font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-church-blue" />
                <span>Monthly Worship Night &amp; Seminars</span>
              </div>
            </div>
          </div>
        </section>

        {/* Core Pillars */}
        <section className="bg-white border border-stone-200 p-8 md:p-12 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-serif text-3xl font-bold text-stone-900 mb-2">What Defines Our Youth Ministry</h2>
            <p className="text-sm text-stone-600">Equipping the next generation for excellence in faith, career, and leadership.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 border-l-2 border-church-blue space-y-2">
              <Flame className="h-6 w-6 text-church-blue" />
              <h4 className="font-serif font-bold text-base">Vibrant Worship</h4>
              <p className="text-xs text-stone-600 leading-relaxed">Praise bands, choir, choreography, and spoken word expression.</p>
            </div>

            <div className="p-4 border-l-2 border-church-blue space-y-2">
              <Briefcase className="h-6 w-6 text-church-blue" />
              <h4 className="font-serif font-bold text-base">Career Guidance</h4>
              <p className="text-xs text-stone-600 leading-relaxed">CV writing, job placement mentorship, and entrepreneurship workshops.</p>
            </div>

            <div className="p-4 border-l-2 border-church-blue space-y-2">
              <GraduationCap className="h-6 w-6 text-church-blue" />
              <h4 className="font-serif font-bold text-base">Academic Mentorship</h4>
              <p className="text-xs text-stone-600 leading-relaxed">Tuition support, study groups, and university guidance.</p>
            </div>

            <div className="p-4 border-l-2 border-church-blue space-y-2">
              <Users className="h-6 w-6 text-church-blue" />
              <h4 className="font-serif font-bold text-base">Socials &amp; Outings</h4>
              <p className="text-xs text-stone-600 leading-relaxed">Youth camps, sports competitions, games nights, and community service.</p>
            </div>
          </div>
        </section>

        {/* Join / Contact Form */}
        <section className="bg-white border border-stone-200 p-8 md:p-12 shadow-sm max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="font-serif text-2xl font-bold text-stone-900">Join the Young Generation</h3>
            <p className="text-xs text-stone-500 mt-1">Get plugged into our youth programs or register your child/teen today.</p>
          </div>

          {submitted ? (
            <div className="p-6 bg-green-50 border border-green-200 text-center text-green-800">
              <CheckCircle2 className="h-10 w-10 text-green-600 mx-auto mb-2" />
              <h4 className="font-bold text-lg">Welcome to NextGen!</h4>
              <p className="text-xs mt-1 text-green-700">Your registration inquiry has been received. A youth pastor or coordinator will reach out shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600">Full Name *</label>
                  <input 
                    type="text"
                    required
                    className="w-full border border-stone-200 bg-stone-50 p-3 text-sm focus:bg-white focus:outline-none focus:border-church-blue"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600">Phone Number *</label>
                  <input 
                    type="tel"
                    required
                    className="w-full border border-stone-200 bg-stone-50 p-3 text-sm focus:bg-white focus:outline-none focus:border-church-blue"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600">Email Address *</label>
                  <input 
                    type="email"
                    required
                    className="w-full border border-stone-200 bg-stone-50 p-3 text-sm focus:bg-white focus:outline-none focus:border-church-blue"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600">Interest Group *</label>
                  <select
                    className="w-full border border-stone-200 bg-stone-50 p-3 text-sm focus:bg-white focus:outline-none focus:border-church-blue"
                    value={subGroup}
                    onChange={(e) => setSubGroup(e.target.value)}
                  >
                    <option value="Children's Church (Ages 3-12)">Children&apos;s Church (Ages 3-12)</option>
                    <option value="Teens Ministry (Ages 13-19)">Teens Ministry (Ages 13-19)</option>
                    <option value="Young Adults & Campus (Ages 20-35)">Young Adults &amp; Campus (Ages 20-35)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600">Message / Inquiry</label>
                <textarea 
                  rows={3}
                  placeholder="I'd like to get involved in youth worship team / register for youth fellowship..."
                  className="w-full border border-stone-200 bg-stone-50 p-3 text-sm focus:bg-white focus:outline-none focus:border-church-blue"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-church-blue hover:bg-blue-800 text-white font-bold py-3.5 text-xs uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Join Young Generation
              </button>
            </form>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
