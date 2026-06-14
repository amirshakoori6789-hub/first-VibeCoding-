import React from 'react';
import { Headphones, ShieldCheck, Truck, Wrench } from 'lucide-react';

const services = [
  {
    icon: Headphones,
    title: 'پشتیبانی ۲۴ ساعته',
    desc: 'کارشناسان ما پاسخگوی سوالات فنی هستند.',
  },
  {
    icon: ShieldCheck,
    title: 'ضمانت اصالت کالا',
    desc: 'تمامی محصولات دارای گارانتی معتبر میباشند. کلیه محصولات دارای ۶ ماه گارانتی و ۵ سال خدمات پس از فروش میباشند.',
  },
  {
    icon: Truck,
    title: 'ارسال سریع',
    desc: 'ارسال به سراسر ایران با بستهبندی استاندارد.',
  },
  {
    icon: Wrench,
    title: 'نصب و راهاندازی',
    desc: 'تیم متخصص نصب و راهاندازی تجهیزات در محل شما میباشد.',
  },
];

export default function ServicesSection() {
  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-sm font-medium text-primary bg-primary/10 px-4 py-1.5 rounded-full">
            خدمات ما
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] mt-4">
            چرا آسا پمپ؟
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s) => (
            <div
              key={s.title}
              className="bg-white rounded-xl border border-border p-6 sm:p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <s.icon className="w-6 h-6 text-primary group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="font-bold text-[#0F172A] text-base mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-7">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}