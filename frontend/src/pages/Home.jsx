import React from 'react';
import BannerSlider from '../components/home/BannerSlider';
import ProductCategories from '../components/home/ProductCategories';
import ServicesSection from '../components/home/ServicesSection';
import VideoSection from '../components/home/VideoSection';
import ProjectsMarquee from '../components/home/ProjectsMarquee';
import BranchesSection from '../components/home/BranchesSection';

export default function Home() {
  return (
    <>
      <BannerSlider />
      <ProductCategories />
      <ServicesSection />
      <VideoSection />
      <ProjectsMarquee />
      <BranchesSection />
    </>
  );
}