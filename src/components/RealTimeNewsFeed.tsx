
import React, { useState, useEffect } from 'react';
import { newsFeedEngine } from '@/lib/dynamicContentEngines';
import useRealTimeData from '@/hooks/useRealTimeData';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  url: string;
  image: string;
  timestamp: string;
  source: string;
}

const RealTimeNewsFeed: React.FC = () => {
  const { data: newsFeeds } = useRealTimeData<any[]>('newsFeeds', []);
  const [breakingNews, setBreakingNews] = useState<NewsItem[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      if (newsFeeds && newsFeeds.length > 0) {
        setLoading(true);
        try {
          const fetchedNews = await newsFeedEngine.fetchNewsFromFeeds();
          setBreakingNews(fetchedNews.slice(0, 10)); // Limit to 10 items
          console.log('Real-time news fetched:', fetchedNews.length, 'articles');
        } catch (error) {
          console.error('Error fetching real-time news:', error);
          // Use fallback news if feeds fail
          setBreakingNews(getFallbackNews());
        } finally {
          setLoading(false);
        }
      } else {
        // Use curated content when no feeds configured
        setBreakingNews(getFallbackNews());
      }
    };

    fetchNews();
    
    // Refresh news every 10 minutes
    const interval = setInterval(fetchNews, 10 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [newsFeeds]);

  // Auto-rotate carousel
  useEffect(() => {
    if (breakingNews.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % breakingNews.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, [breakingNews.length]);

  const getFallbackNews = (): NewsItem[] => {
    return [
      {
        id: '1',
        title: "AI-Powered Weather Systems Show 95% Accuracy in Climate Predictions",
        url: "https://www.amnewsworld.com/",
        image: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=400&h=200&fit=crop",
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        source: "Curated"
      },
      {
        id: '2',
        title: "Global Economic Summit Addresses Rising Inflation Concerns",
        url: "https://www.amnewsworld.com/",
        image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop",
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        source: "Curated"
      },
      {
        id: '3',
        title: "Breakthrough in Renewable Energy Technology Announced",
        url: "https://www.amnewsworld.com/",
        image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=200&fit=crop",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        source: "Curated"
      }
    ];
  };

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const newsDate = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - newsDate.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % breakingNews.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + breakingNews.length) % breakingNews.length);
  };

  return (
    <Card className="p-4 bg-white border-gray-200 rounded-2xl shadow-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-[#374151]">Breaking News</h3>
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </div>
          {newsFeeds && newsFeeds.length > 0 && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              Live Feeds
            </span>
          )}
        </div>
        <div className="flex gap-1">
          <button 
            onClick={prevSlide}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            <ChevronLeft className="h-4 w-4 text-[#374151]" />
          </button>
          <button 
            onClick={nextSlide}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            <ChevronRight className="h-4 w-4 text-[#374151]" />
          </button>
        </div>
      </div>
      
      <div className="relative overflow-hidden rounded-xl shadow-lg bg-gray-100 min-h-[200px]">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1D4ED8]"></div>
          </div>
        ) : (
          <div className="relative h-48">
            {breakingNews.map((news, index) => (
              <div 
                key={news.id} 
                className={`absolute inset-0 transition-opacity duration-500 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <a href={news.url} target="_blank" rel="noopener noreferrer" className="block h-full group">
                  <div className="relative h-full">
                    <img 
                      src={news.image} 
                      alt={news.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = `https://images.unsplash.com/photo-${1504711434969 + index * 100}?w=400&h=200&fit=crop`;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h4 className="text-white font-bold text-sm mb-2 line-clamp-3 group-hover:text-[#F59E0B] transition-colors leading-tight">
                        {news.title}
                      </h4>
                      <div className="flex justify-between items-center">
                        <span className="text-white/90 text-xs bg-black/40 px-2 py-1 rounded-full backdrop-blur-sm">
                          {formatTimestamp(news.timestamp)}
                        </span>
                        <span className="text-white/70 text-xs">
                          {news.source}
                        </span>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Pagination dots */}
      {!loading && breakingNews.length > 0 && (
        <div className="flex justify-center space-x-1 mt-3">
          {breakingNews.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentSlide ? 'bg-[#1D4ED8] scale-125' : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}
    </Card>
  );
};

export default RealTimeNewsFeed;
