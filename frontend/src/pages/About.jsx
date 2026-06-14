import db from '@/api/api.js';

import React from 'react';
import { useQuery } from '@tanstack/react-query';

import { Play } from 'lucide-react';

export default function About() {
  const { data: settings } = useQuery({
    queryKey: ['site-settings'],
    queryFn: () => db.entities.SiteSetting.list(),
    initialData: [],
  });

  const videoSetting = settings.find(s => s.key === 'video_url');
  const videoUrl = videoSetting?.value || '';

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-[#0F172A] py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">درباره ما</h1>
        </div>
      </div>

      {/* Company Intro */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-6">شرکت آسا پمپ</h2>
          <p className="text-[#334155] leading-8 text-base">
            شرکت آسا پمپ با تکیه بر دانش فنی، تجربه تخصصی و بهرهگیری از فناوریهای روز، در زمینه طراحی، تولید و عرضه انواع پمپهای کفکش و لجنکش فعالیت میکند. هدف ما ارائه محصولاتی با کیفیت بالا، عملکرد مطمئن و طول عمر مناسب برای پاسخگویی به نیازهای صنایع مختلف، کشاورزی، ساختمانسازی، تأسیسات شهری و پروژههای عمرانی است. ما با استفاده از مواد اولیه استاندارد، تجهیزات پیشرفته و کنترل کیفیت دقیق در تمامی مراحل تولید، توانستهایم محصولاتی مطابق با نیاز بازار و استانداردهای فنی ارائه دهیم. رضایت مشتری، نوآوری مستمر و ارائه خدمات پس از فروش مطلوب از مهمترین اصول کاری ماست. ما همواره تلاش میکنیم با توسعه محصولات و ارتقای کیفیت، سهمی مؤثر در پیشرفت صنعت پمپ کشور داشته باشیم.
          </p>
        </div>
      </section>

      {/* Video */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {videoUrl ? (
            <div className="rounded-2xl overflow-hidden aspect-video bg-black shadow-2xl">
              <video src={videoUrl} controls className="w-full h-full object-cover" preload="metadata" />
            </div>
          ) : (
            <div className="rounded-2xl bg-muted border aspect-video flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <Play className="w-7 h-7 text-primary/40" />
                </div>
                <p className="text-muted-foreground text-sm">ویدیو هنوز اضافه نشده است</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Mission */}
      <section className="bg-[#0F172A] py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <span className="text-sm font-medium text-primary bg-primary/20 px-4 py-1.5 rounded-full inline-block mb-4">
            ماموریت ما
          </span>
          <p className="text-gray-300 leading-8 text-base">
            در شرکت آسا پمپ، مأموریت ما طراحی، تولید و عرضه انواع پمپهای کفکش و لجنکش با بالاترین سطح کیفیت، کارایی و اطمینان است تا نیازهای صنایع، کشاورزی، پروژههای عمرانی و تأسیسات را به بهترین شکل برآورده کنیم. ما متعهد هستیم با بهرهگیری از فناوریهای نوین، دانش فنی متخصصان، مواد اولیه استاندارد و فرآیندهای تولید پیشرفته، محصولاتی بادوام، کممصرف و قابل اعتماد ارائه دهیم. همچنین با توسعه مستمر محصولات، بهبود کیفیت و ارائه خدمات پشتیبانی مؤثر، در مسیر افزایش رضایت مشتریان و ایجاد ارزش پایدار برای تمامی ذینفعان گام برمیداریم. رسالت ما تنها تولید یک محصول نیست؛ بلکه ارائه راهکارهای مطمئن برای انتقال و مدیریت آب و سیالات، کمک به توسعه زیرساختها و حمایت از رشد و پیشرفت صنایع کشور است. ما بر این باوریم که کیفیت، نوآوری و مسئولیتپذیری، پایههای اصلی موفقیت و اعتماد بلندمدت مشتریان هستند.
          </p>
        </div>
      </section>
    </div>
  );
}