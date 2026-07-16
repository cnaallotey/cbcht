import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, Facebook, Youtube, MessageCircle, Clock } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function Contact() {
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'contactRequests'), {
        ...formState,
        timestamp: new Date().toISOString()
      });
      setIsSent(true);
      setFormState({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setIsSent(false), 5000);
    } catch (err: any) {
      console.error("Error submitting contact request:", err);
      alert("Failed to submit message: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-24">
      {/* Page Header */}
      <section className="bg-stone-50 py-20 mb-20">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <motion.span {...fadeInUp} className="text-[10px] font-bold uppercase tracking-[0.4em] text-church-gold-warm mb-3 block">Get in Touch</motion.span>
          <motion.h1 {...fadeInUp} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl font-serif font-bold text-stone-900 mb-6">
            Contact <span className="text-church-blue italic">Us</span>
          </motion.h1>
          <motion.p {...fadeInUp} transition={{ delay: 0.2 }} className="mx-auto max-w-2xl text-lg text-stone-600 leading-relaxed">
            Have a prayer request, a question, or simply want to say hello? We'd love to hear from you.
          </motion.p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-16 lg:grid-cols-12">
          {/* Contact Details */}
          <div className="lg:col-span-5">
            <motion.div {...fadeInUp} className="mb-12">
              <h2 className="text-3xl font-serif font-bold text-stone-900 mb-8">Let's Connect</h2>
              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-church-blue/10 text-church-blue">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-stone-400 mb-1">Our Location</h4>
                    <p className="text-lg font-serif font-bold text-stone-900">Lashibi, Accra-Ghana</p>
                    <p className="text-stone-500">Opposite funeral homes, Halleluyah Temple</p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-church-blue/10 text-church-blue">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-stone-400 mb-1">Call Us</h4>
                    <p className="text-lg font-serif font-bold text-stone-900">+233 (0) XX XXX XXXX</p>
                    <p className="text-stone-500">Mon — Fri, 9:00 AM to 5:00 PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-church-blue/10 text-church-blue">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-stone-400 mb-1">Email Us</h4>
                    <p className="text-lg font-serif font-bold text-stone-900">info@calvarybaptist.com</p>
                    <p className="text-stone-500">We aim to respond within 24 hours</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="rounded-3xl bg-stone-900 p-8 text-white shadow-xl">
              <h3 className="font-serif text-2xl font-bold mb-6 text-church-gold">Service Times</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <Clock className="h-5 w-5 text-church-gold shrink-0 mt-1" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Sunday Service</p>
                    <p className="font-bold text-lg">8:00 AM — 10:30 AM</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Clock className="h-5 w-5 text-church-gold shrink-0 mt-1" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Bible Study</p>
                    <p className="font-bold text-lg">Wednesday, 6:30 PM</p>
                  </div>
                </div>
                 <div className="flex gap-4">
                  <Clock className="h-5 w-5 text-church-gold shrink-0 mt-1" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Prayer Service</p>
                    <p className="font-bold text-lg">Friday, 6:30 PM</p>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex gap-4 border-t border-white/10 pt-8">
                <Facebook className="h-5 w-5 cursor-pointer transition-colors hover:text-church-gold" />
                <Youtube className="h-5 w-5 cursor-pointer transition-colors hover:text-church-gold" />
                <MessageCircle className="h-5 w-5 cursor-pointer transition-colors hover:text-church-gold" />
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <motion.div 
              {...fadeInUp}
              transition={{ delay: 0.1 }}
              className="bg-white p-8 md:p-12 shadow-2xl shadow-stone-200 border border-stone-100"
            >
              <h2 className="text-3xl font-serif font-bold text-stone-900 mb-8">Send a Message</h2>
              
              {isSent ? (
                <div className="py-20 text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-500 mb-6">
                    <Send className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-stone-900 mb-4">Message Sent!</h3>
                  <p className="text-stone-500 mb-8">Thank you for reaching out. A member of our team will get back to you shortly.</p>
                  <button 
                    onClick={() => setIsSent(false)}
                    className="text-church-blue font-bold uppercase tracking-widest text-xs"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Full Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Jane Doe"
                      className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-church-blue/20 transition-all"
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Email Address</label>
                    <input 
                      required
                      type="email" 
                      placeholder="jane@example.com"
                      className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-church-blue/20 transition-all"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2 flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Subject</label>
                    <input 
                      required
                      type="text" 
                      placeholder="How can we help?"
                      className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-church-blue/20 transition-all"
                      value={formState.subject}
                      onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2 flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Message</label>
                    <textarea 
                      required
                      rows={6}
                      placeholder="Tell us more about your request..."
                      className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-church-blue/20 transition-all resize-none"
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    ></textarea>
                  </div>
                  <div className="md:col-span-2 flex justify-end">
                    <button 
                      disabled={isSubmitting}
                      className="group flex items-center justify-center gap-3 rounded-full bg-church-blue px-12 py-5 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-stone-900 hover:shadow-xl disabled:opacity-50"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'} 
                      <Send className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-[450px] w-full bg-stone-200 grayscale contrast-125 opacity-80 mt-20 overflow-hidden relative group">
        <div className="absolute inset-0 z-0">
          {/* Simple Map Embed Placeholder - In real app, use Google Maps API */}
          <iframe 
            src="https://maps.google.com/maps?q=Calvary%20Baptist%20Church%20Halleluyah%20Temple%20Lashibi&t=&z=16&ie=UTF8&iwloc=&output=embed" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-white via-transparent to-white/50"></div>
        <div className="absolute bottom-10 left-10 z-10 rounded-none bg-white p-6 shadow-2xl max-w-sm pointer-events-auto">
          <h4 className="font-serif font-bold text-stone-900 mb-1">Find Us in Lashibi</h4>
          <p className="text-xs text-stone-500 mb-4">Located opposite funeral homes.</p>
          <a 
             href="https://maps.app.goo.gl/vhnXWnB22XeQRZuf7" 
             target="_blank" 
             rel="noreferrer"
             className="text-xs font-bold text-church-blue uppercase tracking-widest underline decoration-2 underline-offset-4"
          >
            Get Directions
          </a>
        </div>
      </section>
    </div>
  );
}
