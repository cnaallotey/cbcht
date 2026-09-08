"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Menu, X, Phone, Mail, MapPin, ChevronDown, 
  Shield, Heart, Sparkles, Layers, Building2, 
  Image as ImageIcon, BookOpen, Video, Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const NavLink = ({ href, children, onClick, className }: NavLinkProps) => (
  <Link
    href={href}
    onClick={onClick}
    className={cn(
      "text-xs font-bold uppercase tracking-[0.12em] text-stone-800 transition-colors hover:text-church-blue py-2",
      className
    )}
  >
    {children}
  </Link>
);

const churchLifeMinistries = [
  {
    name: "Auxiliaries Overview",
    description: "Explore all ministry departments & fellowship groups",
    href: "/auxiliaries",
    icon: Layers,
  },
  {
    name: "Men's Ministry",
    description: "Men of Valor, Discipleship & Leadership",
    href: "/auxiliaries/mens-ministry",
    icon: Shield,
  },
  {
    name: "Women's Ministry",
    description: "Women of Grace, Sisterhood & Prayer",
    href: "/auxiliaries/womens-ministry",
    icon: Heart,
  },
  {
    name: "Young Generation",
    description: "Children, Teens & Young Adults in Christ",
    href: "/auxiliaries/young-generation",
    icon: Sparkles,
  },
];

const churchLifeCommunity = [
  {
    name: "Member Business Directory",
    description: "Discover and support member-owned businesses in our church family",
    href: "/directory",
    icon: Building2,
    badge: "Directory",
    badgeColor: "bg-church-gold text-white",
  },
  {
    name: "Photo Gallery",
    description: "Sunday worship, church events & community milestones",
    href: "/gallery",
    icon: ImageIcon,
  },
];

const wordMediaItems = [
  {
    name: "Sermons & Messages",
    description: "Watch and listen to recent Sunday and midweek teachings",
    href: "/sermons",
    icon: Video,
  },
  {
    name: "Devotionals & Announcements",
    description: "Daily spiritual reflections, scripture guides & church notices",
    href: "/blog",
    icon: BookOpen,
  },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'church-life' | 'word-media' | null>(null);
  const [mobileChurchLifeOpen, setMobileChurchLifeOpen] = useState(false);
  const [mobileWordMediaOpen, setMobileWordMediaOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (menu: 'church-life' | 'word-media') => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const closeDropdown = () => {
    setActiveDropdown(null);
  };

  return (
    <nav className="fixed top-0 z-50 w-full bg-white border-b border-stone-200 font-sans">
      {/* Top Bar */}
      <div className="hidden bg-church-blue w-full py-2 text-white md:block border-b border-blue-900">
        <div className="mx-auto flex max-w-screen-xl items-center justify-between px-6 text-[11px] uppercase tracking-widest font-medium">
          <div className="flex gap-6 items-center">
            <span className="flex items-center gap-1.5"><Phone className="h-3 w-3 text-church-gold" /> +233 (0) XX XXX XXXX</span>
            <span className="flex items-center gap-1.5"><Mail className="h-3 w-3 text-church-gold" /> info@calvarybaptist.com</span>
            <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3 text-church-gold" /> Lashibi, Tema</span>
          </div>
          <div className="text-stone-300">
            Sunday Service: <strong className="text-white">8:00 AM</strong> • Wed: <strong className="text-white">6:30 PM</strong>
          </div>
        </div>
      </div>

      {/* Main Nav Container */}
      <div className="mx-auto max-w-screen-xl px-6 py-4 transition-all">
        <div className="flex items-center justify-between gap-6">
          {/* Logo & Church Name */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-95 transition-opacity shrink-0" onClick={closeDropdown}>
            <img src="/images/logo.png" alt="CBC Halleluyah Temple" className="h-10 md:h-11 w-auto object-contain" />
            <div className="flex flex-col">
              <span className="text-church-blue font-black text-sm md:text-base tracking-tight leading-none font-serif">
                CBC HALLELUYAH TEMPLE
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-stone-500 mt-0.5">
                Calvary Baptist Church
              </span>
            </div>
          </Link>

          {/* Desktop Curated Nav Links */}
          <div className="hidden items-center gap-8 lg:gap-9 md:flex">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/about">About</NavLink>

            {/* Pillar 1: Church Life ▾ */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('church-life')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'church-life' ? null : 'church-life')}
                aria-expanded={activeDropdown === 'church-life'}
                aria-haspopup="true"
                className={cn(
                  "flex items-center gap-1 text-xs font-bold uppercase tracking-[0.12em] transition-colors py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-church-blue",
                  activeDropdown === 'church-life' ? "text-church-blue" : "text-stone-800 hover:text-church-blue"
                )}
              >
                <span>Church Life</span>
                <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", activeDropdown === 'church-life' && "rotate-180")} />
              </button>

              <AnimatePresence>
                {activeDropdown === 'church-life' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-[620px] z-50"
                  >
                    <div className="bg-white border border-stone-200 p-6 rounded-none grid grid-cols-2 gap-6">
                      {/* Column 1: Ministries */}
                      <div className="space-y-3">
                        <div className="border-b border-stone-200 pb-2">
                          <span className="text-[11px] font-bold uppercase tracking-widest text-church-blue">
                            Ministries &amp; Auxiliaries
                          </span>
                        </div>
                        <div className="space-y-1">
                          {churchLifeMinistries.map((item) => {
                            const Icon = item.icon;
                            return (
                              <Link
                                key={item.name}
                                href={item.href}
                                onClick={closeDropdown}
                                className="flex items-start gap-3 p-2.5 hover:bg-stone-50 transition-colors group rounded-none"
                              >
                                <div className="p-2 bg-stone-100 group-hover:bg-church-blue group-hover:text-white transition-colors shrink-0 rounded-none">
                                  <Icon className="h-4 w-4 text-church-blue group-hover:text-white" />
                                </div>
                                <div className="min-w-0">
                                  <div className="text-xs font-bold uppercase tracking-wider text-stone-900 group-hover:text-church-blue transition-colors">
                                    {item.name}
                                  </div>
                                  <div className="text-[11px] text-stone-500 line-clamp-1 font-normal normal-case mt-0.5">
                                    {item.description}
                                  </div>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>

                      {/* Column 2: Community & Directory */}
                      <div className="space-y-3 border-l border-stone-100 pl-6 flex flex-col justify-between">
                        <div>
                          <div className="border-b border-stone-200 pb-2">
                            <span className="text-[11px] font-bold uppercase tracking-widest text-church-blue">
                              Community &amp; Fellowship
                            </span>
                          </div>
                          <div className="space-y-1 pt-3">
                            {churchLifeCommunity.map((item) => {
                              const Icon = item.icon;
                              return (
                                <Link
                                  key={item.name}
                                  href={item.href}
                                  onClick={closeDropdown}
                                  className="flex items-start gap-3 p-2.5 hover:bg-stone-50 transition-colors group rounded-none"
                                >
                                  <div className="p-2 bg-stone-100 group-hover:bg-church-blue group-hover:text-white transition-colors shrink-0 rounded-none">
                                    <Icon className="h-4 w-4 text-church-blue group-hover:text-white" />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-xs font-bold uppercase tracking-wider text-stone-900 group-hover:text-church-blue transition-colors">
                                        {item.name}
                                      </span>
                                      {item.badge && (
                                        <span className={`px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-none ${item.badgeColor}`}>
                                          {item.badge}
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[11px] text-stone-500 line-clamp-2 font-normal normal-case mt-0.5">
                                      {item.description}
                                    </div>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                        </div>

                        {/* Callout Footer */}
                        <div className="bg-stone-50 p-3 border border-stone-200 mt-2">
                          <p className="text-[11px] text-stone-600 leading-snug">
                            Connect with fellow believers and discover active church initiatives.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Pillar 2: Word & Media ▾ */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('word-media')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'word-media' ? null : 'word-media')}
                aria-expanded={activeDropdown === 'word-media'}
                aria-haspopup="true"
                className={cn(
                  "flex items-center gap-1 text-xs font-bold uppercase tracking-[0.12em] transition-colors py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-church-blue",
                  activeDropdown === 'word-media' ? "text-church-blue" : "text-stone-800 hover:text-church-blue"
                )}
              >
                <span>Word &amp; Media</span>
                <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", activeDropdown === 'word-media' && "rotate-180")} />
              </button>

              <AnimatePresence>
                {activeDropdown === 'word-media' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-96 z-50"
                  >
                    <div className="bg-white border border-stone-200 p-5 rounded-none space-y-3">
                      <div className="border-b border-stone-200 pb-2">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-church-blue">
                          Spiritual Food &amp; Teaching
                        </span>
                      </div>
                      <div className="space-y-1">
                        {wordMediaItems.map((item) => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={item.name}
                              href={item.href}
                              onClick={closeDropdown}
                              className="flex items-start gap-3 p-3 hover:bg-stone-50 transition-colors group rounded-none"
                            >
                              <div className="p-2 bg-stone-100 group-hover:bg-church-blue group-hover:text-white transition-colors shrink-0 rounded-none">
                                <Icon className="h-4 w-4 text-church-blue group-hover:text-white" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-bold uppercase tracking-wider text-stone-900 group-hover:text-church-blue transition-colors">
                                  {item.name}
                                </div>
                                <div className="text-[11px] text-stone-500 line-clamp-2 font-normal normal-case mt-0.5">
                                  {item.description}
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>

                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                        <span>Weekly teachings uploaded every Sunday</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <NavLink href="/contact">Contact</NavLink>
          </div>

          {/* Right Action Button */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/sermons"
              className="inline-flex items-center gap-2 bg-church-blue hover:bg-blue-900 px-5 py-2.5 text-xs font-bold text-white transition-colors uppercase tracking-widest rounded-none focus-visible:ring-2 focus-visible:ring-church-blue focus-visible:outline-none"
            >
              <Play className="h-3 w-3 fill-current" />
              <span>Watch Latest</span>
            </Link>
          </div>

          {/* Mobile Toggle Button */}
          <button
            type="button"
            className="p-2.5 text-stone-800 hover:text-church-blue md:hidden rounded-none border border-stone-200"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-stone-200 bg-white md:hidden overflow-hidden"
          >
            <div className="flex flex-col space-y-3 px-6 py-6 max-h-[80vh] overflow-y-auto">
              <Link 
                href="/" 
                onClick={() => setIsOpen(false)} 
                className="text-sm font-bold uppercase tracking-wider py-2.5 border-b border-stone-100 text-stone-900"
              >
                Home
              </Link>
              
              <Link 
                href="/about" 
                onClick={() => setIsOpen(false)} 
                className="text-sm font-bold uppercase tracking-wider py-2.5 border-b border-stone-100 text-stone-900"
              >
                About
              </Link>

              {/* Mobile Church Life Accordion */}
              <div className="border-b border-stone-100 py-1">
                <button
                  type="button"
                  onClick={() => setMobileChurchLifeOpen(!mobileChurchLifeOpen)}
                  className="flex items-center justify-between w-full text-sm font-bold uppercase tracking-wider py-2 text-stone-900"
                >
                  <span>Church Life</span>
                  <ChevronDown className={cn("h-4 w-4 transition-transform", mobileChurchLifeOpen && "rotate-180")} />
                </button>
                {mobileChurchLifeOpen && (
                  <div className="pl-3 py-2 space-y-2 bg-stone-50 border-l-2 border-church-blue my-2">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-stone-500 pt-1 px-2">Ministries</div>
                    {churchLifeMinistries.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="block text-xs font-bold uppercase tracking-wider text-stone-700 hover:text-church-blue py-1 px-2"
                      >
                        {item.name}
                      </Link>
                    ))}
                    <div className="text-[10px] font-bold uppercase tracking-widest text-stone-500 pt-2 px-2 border-t border-stone-200">Community</div>
                    {churchLifeCommunity.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-stone-700 hover:text-church-blue py-1 px-2"
                      >
                        <span>{item.name}</span>
                        {item.badge && (
                          <span className={`px-1.5 py-0.2 text-[9px] font-black uppercase rounded-none ${item.badgeColor}`}>
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Word & Media Accordion */}
              <div className="border-b border-stone-100 py-1">
                <button
                  type="button"
                  onClick={() => setMobileWordMediaOpen(!mobileWordMediaOpen)}
                  className="flex items-center justify-between w-full text-sm font-bold uppercase tracking-wider py-2 text-stone-900"
                >
                  <span>Word &amp; Media</span>
                  <ChevronDown className={cn("h-4 w-4 transition-transform", mobileWordMediaOpen && "rotate-180")} />
                </button>
                {mobileWordMediaOpen && (
                  <div className="pl-3 py-2 space-y-2 bg-stone-50 border-l-2 border-church-blue my-2">
                    {wordMediaItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="block text-xs font-bold uppercase tracking-wider text-stone-700 hover:text-church-blue py-1 px-2"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link 
                href="/contact" 
                onClick={() => setIsOpen(false)} 
                className="text-sm font-bold uppercase tracking-wider py-2.5 border-b border-stone-100 text-stone-900"
              >
                Contact
              </Link>

              <div className="pt-2">
                <Link
                  href="/sermons"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full bg-church-blue py-3.5 text-center text-xs font-bold text-white uppercase tracking-widest rounded-none"
                >
                  <Play className="h-3 w-3 fill-current" />
                  <span>Watch Latest</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
