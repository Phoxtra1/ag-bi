import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ExternalLink, Clock, RefreshCw, TrendingUp, DollarSign, Building2 } from 'lucide-react';
import Autoplay from 'embla-carousel-autoplay';

interface NewsItem {
  id: string;
  title: string;
  url: string;
  image?: string;
  timestamp: string;
  source: string;
  category: 'Markets' | 'Finance' | 'Trading' | 'Business';
  excerpt?: string;
}

const BusinessNewsFeed: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBusinessNews = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Business-focused news data
      const newsData: NewsItem[] = [
        {
          id: 'biz-1',
          title: 'Global Markets Rally on Strong Q4 Earnings Reports',
          url: 'https://www.amnewsworld.com/business/',
          image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop&q=80',
          source: 'Amniva Markets',
          timestamp: new Date().toISOString(),
          category: 'Markets',
          excerpt: 'Major indices reach new highs as corporate earnings exceed analyst expectations across sectors...'
        },
        {
          id: 'biz-2',
          title: 'Central Banks Signal Policy Shift Amid Inflation Data',
          url: 'https://hub.amineva.com/insight/',
          image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=250&fit=crop&q=80',
          source: 'Amineva Hub',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          category: 'Finance',
          excerpt: 'Federal Reserve and ECB officials indicate potential rate adjustments following economic indicators...'
        },
        {
          id: 'biz-3',
          title: 'Tech Sector M&A Activity Reaches Record Levels',
          url: 'https://www.amnewsworld.com/business/',
          image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop&q=80',
          source: 'Amniva Markets',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          category: 'Trading',
          excerpt: 'Merger and acquisition deals in technology reach unprecedented volumes as companies consolidate...'
        },
        {
          id: 'biz-4',
          title: 'Emerging Markets Attract Record Foreign Investment',
          url: 'https://hub.amineva.com/insight/',
          image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400&h=250&fit=crop&q=80',
          source: 'Amineva Hub',
          timestamp: new Date(Date.now() - 10800000).toISOString(),
          category: 'Finance',
          excerpt: 'Capital flows to developing economies surge as investors seek diversification and yield opportunities...'
        },
        {
          id: 'biz-5',
          title: 'Supply Chain Innovations Transform Global Trade',
          url: 'https://www.amnewsworld.com/business/',
          image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=250&fit=crop&q=80',
          source: 'Amniva Markets',
          timestamp: new Date(Date.now() - 14400000).toISOString(),
          category: 'Business',
          excerpt: 'AI and blockchain technologies reshape logistics and international trade operations worldwide...'
        },
        {
          id: 'biz-6',
          title: 'ESG Investment Mandates Drive Corporate Strategy',
          url: 'https://hub.amineva.com/insight/',
          image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=250&fit=crop&q=80',
          source: 'Amineva Hub',
          timestamp: new Date(Date.now() - 18000000).toISOString(),
          category: 'Markets',
          excerpt: 'Environmental and governance factors increasingly influence board decisions and capital allocation...'
        }
      ];

      setNews(newsData);
    } catch (err) {
      console.error('Error fetching business news:', err);
      setError('Failed to load business stories');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinessNews();
    
    // Auto-refresh every 10 minutes
    const interval = setInterval(fetchBusinessNews, 10 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Markets':
        return <TrendingUp className="h-3 w-3" />;
      case 'Finance':
        return <DollarSign className="h-3 w-3" />;
      case 'Trading':
        return <TrendingUp className="h-3 w-3" />;
      default:
        return <Building2 className="h-3 w-3" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Markets':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Finance':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'Trading':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      default:
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
    }
  };

  return (
    <Card className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <h3 className="text-lg font-semibold text-foreground">Business Intelligence</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchBusinessNews}
          disabled={isLoading}
          className="h-8 w-8 p-0"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {error && (
        <div className="text-sm text-destructive mb-3 p-2 bg-destructive/10 rounded">
          {error}
        </div>
      )}

      {isLoading && news.length === 0 ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card rounded-lg p-3 animate-pulse">
              <div className="h-32 bg-muted rounded mb-2"></div>
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : (
        <Carousel 
          className="w-full"
          plugins={[
            Autoplay({
              delay: 5000,
            }),
          ]}
        >
          <CarouselContent>
            {news.map((item) => (
              <CarouselItem key={item.id}>
                <div
                  className="bg-card rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow border"
                  onClick={() => window.open(item.url, '_blank')}
                >
                  {item.image && (
                    <div className="relative h-32 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                      <div className="absolute top-2 left-2">
                        <Badge className={getCategoryColor(item.category)}>
                          {getCategoryIcon(item.category)}
                          <span className="ml-1">{item.category}</span>
                        </Badge>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-3">
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h4 className="text-sm font-medium text-foreground line-clamp-2 flex-1">
                        {item.title}
                      </h4>
                      <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0 mt-1" />
                    </div>
                    
                    {item.excerpt && (
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                        {item.excerpt}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {item.source}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatTimeAgo(item.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          {news.length > 1 && (
            <>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </>
          )}
        </Carousel>
      )}
      
      {news.length === 0 && !isLoading && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No business stories available
        </p>
      )}

      <div className="mt-3 pt-3 border-t border-border">
        <div className="flex gap-2">
          <Button
            variant="link"
            size="sm"
            className="text-xs text-primary p-0"
            onClick={() => window.open('https://www.amnewsworld.com/business/', '_blank')}
          >
            Amnewsworld Business →
          </Button>
          <Button
            variant="link"
            size="sm"
            className="text-xs text-primary p-0"
            onClick={() => window.open('https://hub.amineva.com/insight/', '_blank')}
          >
            Amineva Hub →
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default BusinessNewsFeed;
