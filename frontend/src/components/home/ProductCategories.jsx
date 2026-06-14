import db from '@/api/api.js';

import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  { name: 'کشاورزی', image: '/uploads/agriculture.png' },
  { name: 'صنعتی', image: '/uploads/industrial.png' },
  { name: 'فاضلابی', image: '/uploads/wastewater.png' },
  { name: 'خانگی', image: '/uploads/residential.png' },
];

export default function ProductCategories() {
  return (
    <section className="py-16 sm:py-24 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-sm font-medium text-primary bg-primary/10 px-4 py-1.5 rounded-full">
            دستهبندیها
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] mt-4">
            محصولات ما
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to="/products"
              className="group relative overflow-hidden rounded-xl block"
              style={{ aspectRatio: '4/3' }}
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full transition-transform duration-500 group-hover:scale-105"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-primary/70 group-hover:via-primary/20 transition-all duration-500" />
              <div className="absolute bottom-0 right-0 p-4 sm:p-6 text-white">
                <h3 className="text-lg sm:text-xl font-bold mb-1">{cat.name}</h3>
                <span className="text-xs sm:text-sm opacity-80 group-hover:opacity-100 transition-all duration-300 inline-block group-hover:-translate-x-2">
                  مشاهده محصولات ←
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}