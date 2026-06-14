import db from '@/api/api.js';

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Menu, X } from 'lucide-react';
import NotificationBar from './NotificationBar';

const navLinks = [
  { label: 'صفحه اصلی', path: '/' },
  { label: 'محصولات', path: '/products' },
  { label: 'درباره ما', path: '/about' },
  { label: 'تماس با ما', path: '/contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50">
      <NotificationBar />
      <div className={`transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-xl shadow-md' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo + Name */}
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/uploads/logo.png"
                alt="آسا پمپ"
                style={{ height: '50px', width: 'auto', objectFit: 'contain' }}
              />
              <span style={{ fontWeight: 'bold', fontSize: '22px', color: '#1a2340' }}>AsaPump</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all relative group
                    ${location.pathname === link.path
                      ? 'text-primary'
                      : 'text-[#334155] hover:text-primary'}`}
                >
                  {link.label}
                  <span className={`absolute bottom-0 right-1/2 translate-x-1/2 h-0.5 bg-primary transition-all duration-300
                    ${location.pathname === link.path ? 'w-8' : 'w-0 group-hover:w-8'}`} />
                </Link>
              ))}
            </nav>

            {/* Phone + Mobile Toggle */}
            <div className="flex items-center gap-3">
              <a href="tel:09157372377" className="hidden sm:flex items-center gap-2 text-sm font-medium text-[#334155] hover:text-primary transition-colors">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <span dir="ltr">0915-737-2377</span>
              </a>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t bg-white px-4 py-4 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors
                  ${location.pathname === link.path
                    ? 'bg-primary/10 text-primary'
                    : 'text-[#334155] hover:bg-muted'}`}
              >
                {link.label}
              </Link>
            ))}
            <a href="tel:09157372377" className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-[#334155]">
              <Phone className="w-4 h-4 text-primary" />
              <span dir="ltr">0915-737-2377</span>
            </a>
          </div>
        )}
      </div>
    </header>
  );
}