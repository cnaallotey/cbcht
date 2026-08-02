"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Phone, Mail, MapPin, ChevronDown, Users, Shield, Heart, Sparkles, Layers } from 'lucide-react';
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
      "text-sm font-semibold uppercase tracking-[0.1em] transition-colors hover:text-church-blue",
      className
    )}
  >
    {children}
  </Link>
);

const auxiliaryItems = [
  {
    name: "Overview",
    description: "Discover all church auxiliaries & groups",
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
    description: "Children, Teens & Young Adults",
    href: "/auxiliaries/young-generation",
    icon: Sparkles,
  },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileAuxOpen, setMobileAuxOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full bg-white shadow-sm">
      {/* Top Bar */}
      <div className="hidden bg-church-blue w-full  py-2 text-white md:block">
        <div className="mx-auto flex max-w-screen-xl items-center justify-between px-6 text-xs uppercase tracking-widest">
          <div className="flex gap-6">
            <span className="flex items-center gap-1.5"><Phone className="h-3 w-3" /> +233 (0) XX XXX XXXX</span>
            <span className="flex items-center gap-1.5"><Mail className="h-3 w-3" /> info@calvarybaptist.com</span>
            <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3" /> Lashibi, Tema</span>
          </div>
          <div>Service Times: Sun 8:00 AM • Wed 6:30 PM • Fri 6:30 PM</div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="mx-auto max-w-screen-2xl px-6 py-6 transition-all">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <img src="/images/logo.png" alt="CBC Halleluyah Temple" className="h-10 md:h-12 w-auto object-contain" />
            <span className="text-church-blue font-black text-sm md:text-sm tracking-tighter hidden sm:inline-block">
              CBC HALLELUYAH TEMPLE
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden items-center text-center whitespace-nowrap gap-8 lg:gap-10 md:flex">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/about">About</NavLink>

            {/* Auxiliaries Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1 text-sm font-semibold uppercase tracking-[0.1em] text-stone-800 transition-colors hover:text-church-blue py-2"
              >
                Auxiliaries
                <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", dropdownOpen && "rotate-180")} />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full pt-2 w-72 z-50"
                  >
                    <div className="bg-white w-fit border border-stone-200 shadow-xl p-2 rounded-none space-y-1">
                      {auxiliaryItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-start gap-3 p-3 hover:bg-stone-50 transition-colors text-left group"
                          >
                            <div className="p-2 bg-stone-100 group-hover:bg-church-blue group-hover:text-white transition-colors shrink-0">
                              <Icon className="h-4 w-4 text-church-blue group-hover:text-white" />
                            </div>
                            <div>
                              <div className="text-xs font-bold uppercase whitespace-wrap tracking-wider text-stone-900 group-hover:text-church-blue transition-colors">
                                {item.name}
                              </div>
                              <div className="text-[11px] text-stone-500 whitespace-wrap font-normal normal-case leading-snug">
                                {item.description}
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <NavLink href="/sermons">Sermons</NavLink>
            <NavLink href="/blog">Devotionals &amp; Announcements</NavLink>
            <NavLink href="/gallery">Gallery</NavLink>
            <NavLink href="/contact">Contact</NavLink>

            <Link
              href="/sermons"
              className="rounded-sm bg-church-blue px-8 py-3 text-sm font-bold text-white transition-all hover:bg-stone-900 shadow-md uppercase tracking-wider"
            >
              Watch Latest
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="rounded-lg p-2 text-church-blue md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t bg-white md:hidden"
          >
            <div className="flex flex-col space-y-4 px-6 py-6">
              <NavLink href="/" onClick={() => setIsOpen(false)} className="text-lg py-2 border-b border-gray-100">
                Home
              </NavLink>
              <NavLink href="/about" onClick={() => setIsOpen(false)} className="text-lg py-2 border-b border-gray-100">
                About
              </NavLink>

              {/* Mobile Auxiliaries Accordion */}
              <div className="border-b border-gray-100 pb-2">
                <button
                  onClick={() => setMobileAuxOpen(!mobileAuxOpen)}
                  className="flex items-center justify-between w-full text-lg font-semibold uppercase tracking-[0.1em] py-2 text-stone-900"
                >
                  <span>Auxiliaries</span>
                  <ChevronDown className={cn("h-5 w-5 transition-transform", mobileAuxOpen && "rotate-180")} />
                </button>
                {mobileAuxOpen && (
                  <div className="pl-4 py-2 space-y-3 bg-stone-50 border-l-2 border-church-blue my-2">
                    {auxiliaryItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="block text-sm font-bold uppercase tracking-wider text-stone-700 hover:text-church-blue"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <NavLink href="/sermons" onClick={() => setIsOpen(false)} className="text-lg py-2 border-b border-gray-100">
                Sermons
              </NavLink>
              <NavLink href="/blog" onClick={() => setIsOpen(false)} className="text-lg py-2 border-b border-gray-100">
                Devotionals &amp; Announcements
              </NavLink>
              <NavLink href="/gallery" onClick={() => setIsOpen(false)} className="text-lg py-2 border-b border-gray-100">
                Gallery
              </NavLink>
              <NavLink href="/contact" onClick={() => setIsOpen(false)} className="text-lg py-2 border-b border-gray-100">
                Contact
              </NavLink>

              <Link
                href="/sermons"
                onClick={() => setIsOpen(false)}
                className="mt-4 rounded-full bg-church-blue py-4 text-center text-lg font-bold text-white uppercase tracking-wider"
              >
                WATCH LATEST
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
