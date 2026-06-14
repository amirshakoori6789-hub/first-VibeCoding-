import db from '@/api/api.js';

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { MapPin, Phone, ExternalLink } from 'lucide-react';

export default function BranchesSection() {
  const { data: branches } = useQuery({
    queryKey: ['branches'],
    queryFn: () => db.entities.Branch.list('sort_order'),
    initialData: [],
  });

  const [selectedIdx, setSelectedIdx] = useState(0);
  const selected = branches[selectedIdx];

  useEffect(() => {
    setSelectedIdx(0);
  }, [branches.length]);

  if (branches.length === 0) {
    return (
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] mb-4">
            شما میتوانید به راحتی شعب ما را پیدا کنید
          </h2>
          <p className="text-muted-foreground mb-12">روی استان مورد نظر کلیک کنید</p>
          <div className="text-muted-foreground py-16">
            شعبهای اضافه نشده است
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] mb-2">
            شما میتوانید به راحتی شعب ما را پیدا کنید
          </h2>
          <p className="text-muted-foreground">روی استان مورد نظر کلیک کنید</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Branch List */}
          <div className="lg:col-span-1">
            <div className="relative">
              <div className="absolute right-3 top-0 bottom-0 w-0.5 bg-border" />
              <div className="space-y-1">
                {branches.map((branch, idx) => (
                  <button
                    key={branch.id}
                    onClick={() => setSelectedIdx(idx)}
                    className={`w-full text-right pr-8 py-4 px-4 rounded-lg transition-all duration-300 relative
                      ${idx === selectedIdx
                        ? 'bg-primary/10 text-primary font-bold'
                        : 'text-[#334155] hover:bg-muted'}`}
                  >
                    <div className={`absolute right-[7px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 transition-all
                      ${idx === selectedIdx
                        ? 'bg-primary border-primary scale-110'
                        : 'bg-white border-border'}`} />
                    {branch.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Branch Detail */}
          <div className="lg:col-span-2">
            {selected && (
              <div className="bg-white rounded-2xl border overflow-hidden shadow-lg">
                {selected.image_url && (
                  <div className="aspect-[600/400] overflow-hidden">
                    <img
                      key={selected.id}
                      src={selected.image_url}
                      alt={selected.name}
                      className="w-full h-full object-cover animate-[slideInRight_0.4s_ease-out]"
                    />
                  </div>
                )}
                <div className="p-6 sm:p-8">
                  <h3 className="font-bold text-xl text-[#0F172A] mb-4">{selected.name}</h3>
                  <div className="space-y-3 text-sm text-[#334155]">
                    {selected.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-primary shrink-0" />
                        <span dir="ltr">{selected.phone}</span>
                      </div>
                    )}
                    {selected.address && (
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span>{selected.address}</span>
                      </div>
                    )}
                  </div>
                  {selected.link_url && (
                    <a
                      href={selected.link_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      مشاهده صفحه شعبه
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}