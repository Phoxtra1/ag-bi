
import React from 'react';
import Header from '@/components/Header';
import HelpSupport from '@/components/dashboard/HelpSupport';
import ChatbotWidget from '@/components/ChatbotWidget';

const HelpCenter = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Amniva Help Center</h1>
          <p className="text-lg text-gray-600">
            Find answers, get support, and learn how to make the most of Amniva's intelligent platform
          </p>
        </div>
        
        <HelpSupport />
      </div>
      
      <ChatbotWidget />
    </div>
  );
};

export default HelpCenter;
