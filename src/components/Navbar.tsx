import React, { useState } from 'react';
import { Menu, X, Phone, Mail, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const NavLink = ({ href, children, onClick, className }: NavLinkProps) => (
  <a
    href={href}
    onClick={onClick}
    className={cn(
      "text-sm font-semibold uppercase tracking-[0.1em] transition-colors hover:text-church-blue",
      className
    )}
  >
    {children}
  </a>
);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Sermons', href: '#sermons' },
    { name: 'Blog', href: '#blog' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className="fixed top-0 z-50 w-full bg-white shadow-sm">
      {/* Top Bar */}
      <div className="hidden bg-church-blue py-2 text-white md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 text-xs uppercase tracking-widest">
          <div className="flex gap-6">
            <span className="flex items-center gap-1.5"><Phone className="h-3 w-3" /> +233 (0) XX XXX XXXX</span>
            <span className="flex items-center gap-1.5"><Mail className="h-3 w-3" /> info@calvarybaptist.com</span>
            <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3" /> Lashibi, Ghana</span>
          </div>
          <div>Service Times: Sun 8:00 AM • Wed 6:30 PM</div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="mx-auto max-w-7xl px-6 py-6 transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-church-blue font-black text-2xl tracking-tighter">CBC HALLELUYAH TEMPLE</div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-10 md:flex">
            {navLinks.map((link) => (
              <NavLink key={link.name} href={link.href}>
                {link.name}
              </NavLink>
            ))}
            <a
              href="#sermons"
              className="rounded-sm bg-church-blue px-8 py-3 text-sm font-bold text-white transition-all hover:bg-stone-900 shadow-md uppercase tracking-wider"
            >
              Watch Latest
            </a>
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
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-lg py-2 border-b border-gray-100"
                >
                  {link.name}
                </NavLink>
              ))}
              <a
                href="#sermons"
                onClick={() => setIsOpen(false)}
                className="mt-4 rounded-full bg-church-blue py-4 text-center text-lg font-bold text-white"
              >
                WATCH LATEST
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
