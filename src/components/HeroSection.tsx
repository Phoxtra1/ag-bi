import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { CheckCircle, Play, ArrowRight, Shield, Zap, TrendingUp, FileText } from 'lucide-react';
import VideoPlayerModal from './VideoPlayerModal';

const HeroSection = () => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleStartFreeTrial = () => {
    navigate('/signup');
  };

  return (
    <section id="home" className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f2847] to-[#0a1628] text-white relative overflow-hidden">
      {/* Grid background */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(212, 175, 55, 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(212, 175, 55, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-amber-500/10 backdrop-blur-sm border border-amber-500/30">
              <Shield className="w-4 h-4 mr-2 text-amber-400" />
              <span className="text-sm font-medium text-amber-200">Business Intelligence Platform</span>
            </div>
            
            {/* Main Headline */}
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                Turn Data into Insight.
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">
                  Verify What Matters.
                </span>
                <span className="block text-slate-300">
                  Predict What's Next.
                </span>
              </h1>
              
              <p className="text-lg lg:text-xl text-slate-300 leading-relaxed max-w-2xl">
                A platform that verifies information, transforms existing data into insight, 
                delivers business-focused prediction and trend analysis.
              </p>
            </div>

            {/* Primary Capabilities */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Shield, label: "Verify", desc: "Validate claims & data" },
                { icon: FileText, label: "Info", desc: "Transform data to insights" },
                { icon: TrendingUp, label: "Prediction", desc: "Forecast outcomes" },
                { icon: Zap, label: "Business Trends", desc: "Market intelligence" }
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 border border-white/10">
                  <item.icon className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <div>
                    <span className="text-white font-medium block">{item.label}</span>
                    <span className="text-slate-400 text-sm">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                size="lg" 
                className="bg-amber-500 text-slate-900 hover:bg-amber-400 font-semibold px-8 py-4 text-lg"
                onClick={handleStartFreeTrial}
              >
                Get Started
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
          </div>

          {/* Right Column - Visual Elements */}
          <div className="relative">
            <div className="relative bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-2xl">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="text-white/60 text-sm">Amniva Dashboard</div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-green-500/20 rounded-lg p-4 border border-green-400/30">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <div>
                        <div className="text-white font-medium">Data Verified</div>
                        <div className="text-green-100 text-sm">98% confidence score</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-amber-500/20 rounded-lg p-4 border border-amber-400/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">Insights Generated</div>
                        <div className="text-amber-100 text-sm">2,847 processed today</div>
                      </div>
                      <FileText className="w-6 h-6 text-amber-400" />
                    </div>
                  </div>
                  
                  <div className="bg-blue-500/20 rounded-lg p-4 border border-blue-400/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">Forecast Outlook</div>
                        <div className="text-blue-100 text-sm">Market trends positive</div>
                      </div>
                      <TrendingUp className="w-6 h-6 text-blue-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -top-6 -right-6 bg-amber-400 rounded-full p-4 shadow-lg animate-bounce">
              <Shield className="w-6 h-6 text-slate-900" />
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-green-400 rounded-full p-3 shadow-lg animate-pulse">
              <CheckCircle className="w-5 h-5 text-slate-900" />
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