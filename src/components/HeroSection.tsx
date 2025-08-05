
import React, { useState } from 'react';
import { Button } from './ui/button';
import { CheckCircle, Play, ArrowRight, Shield, Zap, Globe, ExternalLink } from 'lucide-react';
import VideoPlayerModal from './VideoPlayerModal';

const HeroSection = () => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const trustedOrganizations = [
    { name: 'TrustLaw', url: 'https://www.trust.org/trustlaw/' },
    { name: 'SJN', url: 'https://www.solutionsjournalism.org/' },
    { name: 'Amnewsworld', url: 'https://www.amnewsworld.com/' },
    { name: 'Project Shield', url: 'https://projectshield.google/landing' },
    { name: 'Phoxtra', url: 'https://www.phoxtra.com/' }
  ];

  const handleStartFreeTrial = () => {
    // Use React Router navigation instead of direct href
    window.location.href = '/signup';
  };

  return (
    <section id="home" className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <Shield className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Trusted by 10,000+ Organizations</span>
            </div>
            
            {/* Main Headline */}
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Real-time Media Intelligence
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                  Tool
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-blue-100 leading-relaxed max-w-2xl">
                Combat misinformation with AI-powered verification. Get instant fact-checks, 
                source validation, and intelligence insights before you share or publish.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-3">
              {[
                "Real-time fact verification",
                "AI-powered source analysis", 
                "Global misinformation tracking",
                "Enterprise-grade security"
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-blue-50">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-4 text-lg"
                onClick={handleStartFreeTrial}
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-4 text-lg"
                onClick={() => setIsVideoModalOpen(true)}
              >
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </div>

            {/* Social Proof */}
            <div className="pt-8 border-t border-white/20">
              <p className="text-blue-200 text-sm mb-4">Trusted by leading organizations worldwide</p>
              <div className="flex items-center flex-wrap gap-6 opacity-80">
                {trustedOrganizations.map((org, index) => (
                  <a
                    key={index}
                    href={org.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white font-semibold hover:text-blue-200 transition-colors flex items-center gap-1 group"
                  >
                    {org.name}
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Visual Elements */}
          <div className="relative">
            {/* Main Dashboard Mockup */}
            <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="text-white/60 text-sm">Amniva Dashboard</div>
                </div>
                
                {/* Content Cards */}
                <div className="space-y-4">
                  {/* Verification Status */}
                  <div className="bg-green-500/20 rounded-lg p-4 border border-green-400/30">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <div>
                        <div className="text-white font-medium">Claim Verified</div>
                        <div className="text-green-100 text-sm">98% confidence score</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Analytics */}
                  <div className="bg-blue-500/20 rounded-lg p-4 border border-blue-400/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">Daily Verifications</div>
                        <div className="text-blue-100 text-sm">2,847 processed</div>
                      </div>
                      <Zap className="w-6 h-6 text-blue-400" />
                    </div>
                  </div>
                  
                  {/* Global Reach */}
                  <div className="bg-purple-500/20 rounded-lg p-4 border border-purple-400/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">Global Coverage</div>
                        <div className="text-purple-100 text-sm">180+ countries</div>
                      </div>
                      <Globe className="w-6 h-6 text-purple-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-6 -right-6 bg-yellow-400 rounded-full p-4 shadow-lg animate-bounce">
              <Shield className="w-6 h-6 text-yellow-900" />
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-green-400 rounded-full p-3 shadow-lg animate-pulse">
              <CheckCircle className="w-5 h-5 text-green-900" />
            </div>
          </div>
        </div>
      </div>

      {/* Video Player Modal */}
      <VideoPlayerModal 
        isOpen={isVideoModalOpen} 
        onClose={() => setIsVideoModalOpen(false)} 
      />
    </section>
  );
};

export default HeroSection;
