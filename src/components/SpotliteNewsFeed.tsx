
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Clock, RefreshCw, AlertCircle } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  url: string;
  image?: string;
  timestamp: string;
  source: string;
  excerpt?: string;
}

const SpotliteNewsFeed: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSpotliteNews = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Since we can't directly access the iframe content due to CORS,
      // we'll simulate fetching news stories for now
      // In a real implementation, you'd need a backend proxy or API
      
      // For now, we'll create some sample news items that would come from Amnewsworld
      const sampleNews: NewsItem[] = [
        {
          id: '1',
          title: 'Global Climate Summit Reaches Historic Agreement',
          url: 'https://www.amnewsworld.com/spotlite/climate-summit-agreement',
          source: 'AMNews World',
          timestamp: new Date().toISOString(),
          excerpt: 'World leaders unite on ambitious climate targets for 2030...'
        },
        {
          id: '2',
          title: 'Tech Innovation Drives Economic Growth in Q4',
          url: 'https://www.amnewsworld.com/spotlite/tech-innovation-growth',
          source: 'AMNews World',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          excerpt: 'Technology sector shows unprecedented growth rates...'
        },
        {
          id: '3',
          title: 'Healthcare Breakthrough: New Treatment Shows Promise',
          url: 'https://www.amnewsworld.com/spotlite/healthcare-breakthrough',
          source: 'AMNews World',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          excerpt: 'Revolutionary medical treatment enters final trials...'
        },
        {
          id: '4',
          title: 'Education Reform Initiative Launches Globally',
          url: 'https://www.amnewsworld.com/spotlite/education-reform',
          source: 'AMNews World',
          timestamp: new Date(Date.now() - 10800000).toISOString(),
          excerpt: 'New educational framework aims to transform learning...'
        },
        {
          id: '5',
          title: 'Space Exploration Milestone Achieved',
          url: 'https://www.amnewsworld.com/spotlite/space-milestone',
          source: 'AMNews World',
          timestamp: new Date(Date.now() - 14400000).toISOString(),
          excerpt: 'Historic space mission marks new era of exploration...'
        }
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setNews(sampleNews);
    } catch (err) {
      console.error('Error fetching Spotlite news:', err);
      setError('Failed to load Spotlite stories');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSpotliteNews();
    
    // Set up auto-refresh every 10 minutes
    const interval = setInterval(fetchSpotliteNews, 10 * 60 * 1000);
    
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

  return (
    <Card className="p-4 bg-gradient-to-br from-red-50 to-blue-50 border-red-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          </div>
          <img 
            src="/lovable-uploads/a2e4a86e-128d-4262-8b13-16c3e14fb4be.png" 
            alt="AMNews Logo" 
            className="h-6 w-6"
          />
          <h3 className="text-lg font-semibold text-gray-700">Spotlite</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchSpotliteNews}
          disabled={isLoading}
          className="h-8 w-8 p-0"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {error && (
        <div className="text-sm text-red-600 mb-3 p-2 bg-red-50 rounded">
          {error}
        </div>
      )}

      {isLoading && news.length === 0 ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg p-3 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {news.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => window.open(item.url, '_blank')}
            >
              <div className="flex justify-between items-start gap-2 mb-2">
                <h4 className="text-sm font-medium text-gray-900 line-clamp-2 flex-1">
                  {item.title}
                </h4>
                <ExternalLink className="h-3 w-3 text-gray-400 flex-shrink-0 mt-1" />
              </div>
              
              {item.excerpt && (
                <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                  {item.excerpt}
                </p>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {item.source}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    {formatTimeAgo(item.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {news.length === 0 && !isLoading && (
            <p className="text-sm text-gray-500 text-center py-4">
              No Spotlite stories available
            </p>
          )}
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-gray-200">
        <Button
          variant="link"
          size="sm"
          className="text-xs text-blue-600 p-0"
          onClick={() => window.open('https://www.amnewsworld.com/spotlite/', '_blank')}
        >
          View all stories on AMNews World →
        </Button>
      </div>
    </Card>
  );
};

export default SpotliteNewsFeed;
