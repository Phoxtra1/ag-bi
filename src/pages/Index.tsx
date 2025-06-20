
import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import MainContent from '@/components/MainContent';
import RightWidget from '@/components/RightWidget';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Header />
      <HeroSection />
      
      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content - Left Side */}
          <MainContent />
          
          {/* Right Widget - Sidebar */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <RightWidget />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
