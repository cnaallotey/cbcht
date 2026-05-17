import React from 'react';
import { Facebook, Youtube, MessageCircle, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-stone-900 pt-20 pb-10 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo & Info */}
          <div>
            <div className="mb-6 flex items-center gap-2">
              <div className="h-10 w-10 overflow-hidden rounded-full bg-church-blue flex items-center justify-center text-church-gold font-bold text-xl">C</div>
              <div>
                <h2 className="text-xl font-bold leading-tight tracking-tight">
                  CALVARY BAPTIST
                </h2>
                <p className="text-[10px] font-bold uppercase tracking-widest text-church-gold">
                  Halleluyah Temple
                </p>
              </div>
            </div>
            <p className="mb-8 text-sm leading-relaxed text-stone-400">
              A place of worship, community, and the living Word. Join us as we grow together in faith and serve the Lashibi community and beyond.
            </p>
            <div className="flex gap-4">
              <a href="#" className="rounded-full bg-stone-800 p-2 text-stone-400 transition-colors hover:bg-church-blue hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="rounded-full bg-stone-800 p-2 text-stone-400 transition-colors hover:bg-red-600 hover:text-white">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="#" className="rounded-full bg-stone-800 p-2 text-stone-400 transition-colors hover:bg-green-600 hover:text-white">
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 font-serif text-lg font-bold uppercase tracking-widest text-church-gold">Navigation</h3>
            <ul className="space-y-4 text-sm text-stone-400">
              <li><a href="#home" className="transition-colors hover:text-white">Home</a></li>
              <li><a href="#about" className="transition-colors hover:text-white">About Us</a></li>
              <li><a href="#sermons" className="transition-colors hover:text-white">Sermon Library</a></li>
              <li><a href="#blog" className="transition-colors hover:text-white">Pastor's Blog</a></li>
              <li><a href="#contact" className="transition-colors hover:text-white">Contact Us</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-6 font-serif text-lg font-bold uppercase tracking-widest text-church-gold">Get in Touch</h3>
            <ul className="space-y-4 text-sm text-stone-400">
              <li className="flex items-start gap-3">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-church-gold" />
                <span>Lashibi, Accra-Ghana<br />Off the Spintex Road</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-church-gold" />
                <span>+233 (0) XX XXX XXXX</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-church-gold" />
                <span>info@calvarybaptist.com</span>
              </li>
            </ul>
          </div>

          {/* Service Times */}
          <div>
            <h3 className="mb-6 font-serif text-lg font-bold uppercase tracking-widest text-church-gold">Join Us</h3>
            <div className="rounded-2xl bg-stone-800 p-6">
              <div className="mb-4">
                <p className="text-xs font-bold uppercase tracking-widest text-church-gold">Sunday Service</p>
                <p className="text-lg font-bold">8:00 AM — 10:30 AM</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-church-gold">Midweek Prayer</p>
                <p className="text-lg font-bold">Wednesday, 6:30 PM</p>
              </div>
              <a 
                href="#contact" 
                className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-church-blue py-3 text-sm font-bold transition-all hover:bg-blue-800"
              >
                Plan Your Visit <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-20 border-t border-stone-800 pt-10 text-center text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Calvary Baptist Church — Halleluyah Temple. All Rights Reserved.</p>
          <p className="mt-2 uppercase tracking-widest">A place of worship, community & the living Word</p>
        </div>
      </div>
    </footer>
  );
}
