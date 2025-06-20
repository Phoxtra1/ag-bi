
import React from 'react';
import { Button } from '@/components/ui/button';
import { Shield, TrendingUp, AlertTriangle } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-[#1D4ED8] via-[#3B82F6] to-[#1E40AF] py-20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="7" cy="7" r="7"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-8">
            <span className="text-white text-sm font-medium">🚀 Real-time Media Intelligence Platform</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Track Truth. <br />
            <span className="text-[#F59E0B]">Predict Impact.</span>
          </h1>
          
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Amnova helps organizations and individuals verify information, track real-time trends, 
            and get AI-powered predictions on economic, civic, and environmental developments.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="bg-[#F59E0B] hover:bg-[#D97706] text-white px-8 py-3 text-lg font-semibold">
              Start Verifying Now
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#1D4ED8] px-8 py-3 text-lg">
              Watch Demo
            </Button>
          </div>
          
          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <Shield className="h-8 w-8 text-[#F59E0B] mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Misinformation Detection</h3>
              <p className="text-blue-100 text-sm">Real-time verification of news and claims</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <TrendingUp className="h-8 w-8 text-[#F59E0B] mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Trend Analysis</h3>
              <p className="text-blue-100 text-sm">AI-powered trending topic identification</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <AlertTriangle className="h-8 w-8 text-[#F59E0B] mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Crisis Prediction</h3>
              <p className="text-blue-100 text-sm">Early warning system for disasters</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
