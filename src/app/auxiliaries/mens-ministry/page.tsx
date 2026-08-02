'use client';

import React, { useState } from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { motion } from 'motion/react';
import { 
  Shield, CheckCircle2, Calendar, Clock, MapPin, 
  Send, Users, BookOpen, HeartHandshake, Award, Loader2 
} from 'lucide-react';
import { db } from '../../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function MensMinistryPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
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
        subject: "Men's Ministry Join Inquiry",
        message: `Phone: ${phone}\n\n${message}`,
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
        <div className="absolute inset-0 opacity-30">
          <img 
            src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2670&auto=format&fit=crop" 
            alt="Men's Ministry Fellowship" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/80 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-church-gold/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-church-gold backdrop-blur-md mb-6 border border-church-gold/30">
            <Shield className="h-3.5 w-3.5" /> CBC Auxiliary Ministry
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-4">
            Men&apos;s Ministry — Men of Valor
          </h1>
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-stone-300 font-light leading-relaxed mb-6">
            Equipping men to walk in integrity, godly leadership, brotherhood, and Christ-like service at home, in church, and in society.
          </p>
          <div className="inline-block bg-stone-800/80 backdrop-blur-md px-6 py-3 border border-stone-700 text-xs font-serif italic text-church-gold">
            &ldquo;As iron sharpens iron, so one man sharpens another.&rdquo; &mdash; Proverbs 27:17
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 mx-auto max-w-7xl px-6 py-16 w-full space-y-16">
        {/* Mission & Vision */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white border border-stone-200 p-8 md:p-12 shadow-sm">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-church-gold block mb-2">Our Mission</span>
            <h2 className="font-serif text-3xl font-bold text-stone-900 mb-4">Building Strong Christian Men</h2>
            <p className="text-stone-600 text-sm leading-relaxed mb-4">
              The Men&apos;s Ministry at Calvary Baptist Church (Halleluyah Temple) is dedicated to mentoring, encouraging, and equipping men of all ages. We believe that strong men build strong families, strong churches, and resilient communities.
            </p>
            <p className="text-stone-600 text-sm leading-relaxed">
              Through regular prayer breakfasts, Bible studies, brotherhood gatherings, and outreach projects, we create a safe environment for authentic discussion, accountability, and spiritual maturity.
            </p>
          </div>

          <div className="relative h-72 md:h-full min-h-[300px] overflow-hidden bg-stone-900 border border-stone-200">
            <img 
              src="https://images.unsplash.com/photo-1544427928-c49cdfebf194?q=80&w=1200&auto=format&fit=crop" 
              alt="Men's fellowship worship" 
              className="h-full w-full object-cover"
            />
          </div>
        </section>

        {/* 4 Core Pillars */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-serif text-3xl font-bold text-stone-900 mb-2">Pillars of Men&apos;s Ministry</h2>
            <p className="text-sm text-stone-600">The foundational values that drive our activities and gatherings.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 border border-stone-200 shadow-sm hover:border-church-blue transition-colors">
              <div className="p-3 bg-church-blue/10 text-church-blue w-fit mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-lg font-bold mb-2">Brotherhood &amp; Unity</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Fostering genuine brotherhood where men support each other through prayer, accountability, and shared experiences.
              </p>
            </div>

            <div className="bg-white p-6 border border-stone-200 shadow-sm hover:border-church-blue transition-colors">
              <div className="p-3 bg-church-blue/10 text-church-blue w-fit mb-4">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-lg font-bold mb-2">Biblical Discipleship</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Deepening our knowledge of God&apos;s Word and applying Christian principles in career, marriage, and personal life.
              </p>
            </div>

            <div className="bg-white p-6 border border-stone-200 shadow-sm hover:border-church-blue transition-colors">
              <div className="p-3 bg-church-blue/10 text-church-blue w-fit mb-4">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-lg font-bold mb-2">Family Leadership</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Equipping men to lead their households with humility, love, spiritual oversight, and godly wisdom.
              </p>
            </div>

            <div className="bg-white p-6 border border-stone-200 shadow-sm hover:border-church-blue transition-colors">
              <div className="p-3 bg-church-blue/10 text-church-blue w-fit mb-4">
                <HeartHandshake className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-lg font-bold mb-2">Community Impact</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Engaging in practical service, church building projects, and community outreach in Lashibi and Tema.
              </p>
            </div>
          </div>
        </section>

        {/* Meeting Schedules & Events */}
        <section className="bg-stone-900 text-white p-8 md:p-12 shadow-xl border-t-4 border-church-gold">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-church-gold block">Fellowship Times</span>
              <h3 className="font-serif text-2xl font-bold">When We Gather</h3>
              <p className="text-stone-300 text-sm leading-relaxed">
                Join our regular meetings for uplifting worship, devotional teaching, and fellowship over breakfast.
              </p>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-stone-800 p-6 border border-stone-700">
                <div className="flex items-center gap-2 text-church-gold font-bold text-xs uppercase tracking-widest mb-2">
                  <Calendar className="h-4 w-4" /> Bi-Weekly Prayer Breakfast
                </div>
                <div className="text-lg font-bold mb-1">2nd &amp; 4th Saturdays</div>
                <div className="text-xs text-stone-400 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" /> 6:30 AM &mdash; 8:30 AM
                </div>
                <p className="text-xs text-stone-300 mt-3">Church Premises, Lashibi</p>
              </div>

              <div className="bg-stone-800 p-6 border border-stone-700">
                <div className="flex items-center gap-2 text-church-gold font-bold text-xs uppercase tracking-widest mb-2">
                  <Calendar className="h-4 w-4" /> Annual Men&apos;s Conference
                </div>
                <div className="text-lg font-bold mb-1">Annual Summit</div>
                <div className="text-xs text-stone-400 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" /> Special Retreat &amp; Workshop
                </div>
                <p className="text-xs text-stone-300 mt-3">Theme &amp; Dates announced annually</p>
              </div>
            </div>
          </div>
        </section>

        {/* Join / Contact Form */}
        <section className="bg-white border border-stone-200 p-8 md:p-12 shadow-sm max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="font-serif text-2xl font-bold text-stone-900">Get Involved with Men&apos;s Ministry</h3>
            <p className="text-xs text-stone-500 mt-1">Fill out the quick form below and a ministry coordinator will reach out to you.</p>
          </div>

          {submitted ? (
            <div className="p-6 bg-green-50 border border-green-200 text-center text-green-800">
              <CheckCircle2 className="h-10 w-10 text-green-600 mx-auto mb-2" />
              <h4 className="font-bold text-lg">Thank You for Connecting!</h4>
              <p className="text-xs mt-1 text-green-700">Your message has been received. Our Men&apos;s Ministry team will contact you shortly.</p>
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
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600">Message / Inquiry</label>
                <textarea 
                  rows={3}
                  placeholder="I would like to join the bi-weekly prayer breakfast..."
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
                Submit Interest
              </button>
            </form>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
