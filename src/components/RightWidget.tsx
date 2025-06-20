
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Shield, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';

const RightWidget = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Mock trending data
  const trendingTopics = [
    { title: "Climate Change Misinformation Surge", severity: "high", time: "2h ago" },
    { title: "Economic Prediction Models Updated", severity: "medium", time: "4h ago" }
  ];

  // Mock breaking news data
  const breakingNews = [
    {
      id: 1,
      headline: "Global Climate Summit Reaches Historic Agreement",
      timestamp: "2h ago",
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=200&object=cover",
      link: "#"
    },
    {
      id: 2,
      headline: "AI-Powered Weather Prediction Shows 95% Accuracy",
      timestamp: "4h ago", 
      image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=400&h=200&object=cover",
      link: "#"
    },
    {
      id: 3,
      headline: "New Earthquake Early Warning System Deployed",
      timestamp: "6h ago",
      image: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400&h=200&object=cover",
      link: "#"
    }
  ];

  // Auto-rotate carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % breakingNews.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, [breakingNews.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % breakingNews.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + breakingNews.length) % breakingNews.length);
  };

  return (
    <div className="w-full lg:w-80 space-y-6">
      {/* Trending Highlight Scroll */}
      <Card className="p-4 bg-gradient-to-br from-[#1D4ED8]/5 to-[#3B82F6]/5 border-[#1D4ED8]/20">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="h-5 w-5 text-[#1D4ED8]" />
          <h3 className="text-lg font-semibold text-[#374151]">Trending Alerts</h3>
        </div>
        <div className="space-y-2">
          {trendingTopics.map((topic, index) => (
            <div key={index} className="p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <p className="text-sm font-medium text-[#374151] mb-1">{topic.title}</p>
              <div className="flex justify-between items-center">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  topic.severity === 'high' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {topic.severity === 'high' ? 'High Priority' : 'Medium'}
                </span>
                <span className="text-xs text-gray-500">{topic.time}</span>
              </div>
            </div>
          ))}
        </div>
        <Button 
          variant="outline" 
          className="w-full mt-3 border-[#1D4ED8] text-[#1D4ED8] hover:bg-[#1D4ED8] hover:text-white"
        >
          View All Trending
        </Button>
      </Card>

      {/* False Info Checker */}
      <Card className="p-4 bg-gradient-to-br from-[#F59E0B]/5 to-[#D97706]/5 border-[#F59E0B]/20">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="h-5 w-5 text-[#F59E0B]" />
          <h3 className="text-lg font-semibold text-[#374151]">Quick Verify</h3>
        </div>
        <p className="text-sm text-[#374151] mb-4">
          Paste a link or headline to instantly verify information
        </p>
        <Button className="w-full bg-[#F59E0B] hover:bg-[#D97706] text-white">
          Verify Info Now
        </Button>
      </Card>

      {/* Disaster Prediction Alert */}
      <Card className="p-4 bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="h-5 w-5 text-red-600 animate-pulse" />
          <h3 className="text-lg font-semibold text-red-700">Live Alert</h3>
          <div className="ml-auto">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-3 mb-3">
          <p className="text-sm font-medium text-red-700 mb-1">⚠️ Potential landslide risk in Dakar</p>
          <p className="text-xs text-gray-600">Updated 30 min ago</p>
        </div>
        <Button 
          variant="outline" 
          className="w-full border-red-300 text-red-700 hover:bg-red-50"
        >
          View Disaster Alerts
        </Button>
      </Card>

      {/* Breaking News Carousel */}
      <Card className="p-4 bg-white border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-[#374151]">Breaking News</h3>
          <div className="flex gap-1">
            <button 
              onClick={prevSlide}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="h-4 w-4 text-[#374151]" />
            </button>
            <button 
              onClick={nextSlide}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="h-4 w-4 text-[#374151]" />
            </button>
          </div>
        </div>
        
        <div className="relative overflow-hidden rounded-xl shadow-md">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {breakingNews.map((news) => (
              <div key={news.id} className="w-full flex-shrink-0 relative cursor-pointer group">
                <div className="aspect-video relative">
                  <img 
                    src={news.image} 
                    alt={news.headline}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h4 className="text-white font-bold text-sm mb-2 line-clamp-2 group-hover:text-[#F59E0B] transition-colors">
                      {news.headline}
                    </h4>
                    <span className="text-white/80 text-xs">{news.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Pagination dots */}
        <div className="flex justify-center space-x-1 mt-3">
          {breakingNews.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentSlide ? 'bg-[#1D4ED8]' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </Card>

      {/* ANA News Live Radio */}
      <Card className="p-4 bg-gradient-to-br from-[#1D4ED8]/5 to-[#3B82F6]/5 border-[#1D4ED8]/20">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            </div>
            <h3 className="text-lg font-semibold text-[#374151]">ANA News Live</h3>
          </div>
        </div>
        <p className="text-sm text-[#374151] mb-3">Now Streaming!</p>
        <div className="bg-white rounded-lg overflow-hidden shadow-sm">
          <iframe 
            src="https://stream.zeno.fm/m2wnv2cnyrhvv" 
            className="w-full h-20 border-none"
            allow="autoplay"
            title="ANA News Live Stream"
          ></iframe>
        </div>
      </Card>
    </div>
  );
};

export default RightWidget;
