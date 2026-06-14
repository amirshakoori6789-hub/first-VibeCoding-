import db from '@/api/api.js';

import React from 'react';
import { useQuery } from '@tanstack/react-query';

export default function ProjectsMarquee() {
  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: () => db.entities.Project.list('sort_order'),
    initialData: [],
  });

  return (
    <section className="py-16 sm:py-24 bg-[#F8FAFC] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A]">
          آخرین{' '}
          <span className="bg-primary text-white px-3 py-1 rounded-lg inline-block">
            پروژهها
          </span>
        </h2>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          پروژهای اضافه نشده است
        </div>
      ) : (
        <div className="relative">
          <div className="flex animate-marquee" style={{ width: 'max-content' }}>
            {/* Duplicate for seamless loop */}
            {[...projects, ...projects].map((project, idx) => (
              <div key={`${project.id}-${idx}`} className="flex-shrink-0 mx-3 w-[280px] sm:w-[320px]">
                <div className="rounded-lg overflow-hidden bg-white shadow-md hover:shadow-xl transition-shadow duration-300">
                  <div className="aspect-[400/530] overflow-hidden">
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 bg-[#F8FAFC]" style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.06)' }}>
                    <h3 className="font-semibold text-[#0F172A] text-sm text-center">
                      {project.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}