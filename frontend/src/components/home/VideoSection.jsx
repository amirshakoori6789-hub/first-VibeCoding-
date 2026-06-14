import db from '@/api/api.js';

import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { Play } from 'lucide-react';

export default function VideoSection() {
  const { data: settings } = useQuery({
    queryKey: ['site-settings'],
    queryFn: () => db.entities.SiteSetting.list(),
    initialData: [],
  });

  const videoSetting = settings.find(s => s.key === 'video_url');
  const videoUrl = videoSetting?.value || '';

  return (
    <section className="bg-[#0F172A] py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Video */}
          <div className="order-2 lg:order-1">
            {videoUrl ? (
              <div className="rounded-2xl overflow-hidden aspect-video bg-black">
                <video
                  src={videoUrl}
                  controls
                  className="w-full h-full object-cover"
                  preload="metadata"
                />
              </div>
            ) : (
              <div className="rounded-2xl bg-white/5 border border-white/10 aspect-video flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                  <Play className="w-7 h-7 text-white/40" />
                </div>
              </div>
            )}
          </div>

          {/* Text */}
          <div className="order-1 lg:order-2 text-white">
            <span className="text-sm font-medium text-primary bg-primary/20 px-4 py-1.5 rounded-full inline-block mb-4">
              فروشگاه اینترنتی تجهیزات صنعتی
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-8 leading-tight">
              آسا پمپ
            </h2>
            <div className="flex gap-4">
              <Link
                to="/about"
                className="px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-colors text-sm"
              >
                درباره ما
              </Link>
              <Link
                to="/contact"
                className="px-6 py-3 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-colors text-sm border border-white/20"
              >
                تماس با ما
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}