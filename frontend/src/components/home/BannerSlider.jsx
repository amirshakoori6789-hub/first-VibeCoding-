import db from '@/api/api.js';

import React, { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';

import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function BannerSlider() {
  const [current, setCurrent] = useState(0);

  const { data: banners } = useQuery({
    queryKey: ['banners'],
    queryFn: () => db.entities.Banner.list('sort_order'),
    initialData: [],
  });

  const next = useCallback(() => {
    if (banners.length > 0) {
      setCurrent(c => (c + 1) % banners.length);
    }
  }, [banners.length]);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(next, 4000);
    return () => clearInterval(interval);
  }, [next, banners.length]);

  if (banners.length === 0) {
    return (
      <div className="w-full bg-muted" style={{ aspectRatio: '1920/600' }}>
        <div className="flex items-center justify-center h-full text-muted-foreground text-lg">
          بنری اضافه نشده است
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden" style={{ aspectRatio: '1920/600' }}>
      {banners.map((banner, idx) => (
        <a
          key={banner.id}
          href={banner.link_url || '#'}
          target={banner.link_url ? '_blank' : undefined}
          rel="noopener noreferrer"
          className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out cursor-pointer
            ${idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
          <img
            src={banner.image_url}
            alt={`بنر ${idx + 1}`}
            className="w-full h-full object-cover"
          />
        </a>
      ))}

      {/* Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-3 h-3 rounded-full transition-all duration-300
                ${idx === current ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/70'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}