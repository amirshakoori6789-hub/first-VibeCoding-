import db from '@/api/api.js';

import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';

const navLinks = [
  { label: 'صفحه اصلی', path: '/' },
  { label: 'محصولات', path: '/products' },
  { label: 'درباره ما', path: '/about' },
  { label: 'تماس با ما', path: '/contact' },
];

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] text-white">
      {/* Flow Line */}
      <div className="h-1 bg-gradient-to-l from-primary via-primary/60 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="https://media.db.com/images/public/6a29e0da1dbd45017b7f8a85/3bad6bec3_logo.png"
                alt="آسا پمپ"
                style={{ height: '50px', width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
              />
            </div>
            <p className="text-sm text-gray-400 leading-7">
              تولیدکننده پمپهای کفکش و لجنکش صنعتی، کشاورزی، خانگی و فاضلابی
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-base mb-4">دسترسی سریع</h3>
            <nav className="space-y-3">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-base mb-4">اطلاعات تماس</h3>
            <div className="space-y-3 text-sm text-gray-400">
              <a href="tel:09157372377" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span dir="ltr">0915-737-2377</span>
              </a>
              <a href="mailto:Asa.pump@gmail.com" className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span>Asa.pump@gmail.com</span>
              </a>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-1" />
                <span>مشهد، ایثارگران، پیامبر اعظم</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-6 text-center text-xs text-gray-500">
        © ۱۴۰۴ آسا پمپ — تمامی حقوق محفوظ است
      </div>
    </footer>
  );
}