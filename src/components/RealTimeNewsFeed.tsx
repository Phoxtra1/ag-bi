
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Clock, RefreshCw, AlertCircle } from 'lucide-react';
import { newsFeedEngine } from '@/lib/dynamicContentEngines';
import useRealTimeData from '@/hooks/useRealTimeData';

interface NewsItem {
  id: string;
  title: string;
  url: string;
  image?: string;
  timestamp: string;
  source: string;
}

const RealTimeNewsFeed: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: newsFeeds } = useRealTimeData<any[]>('newsFeeds', []);

  const fetchNews = async () => {
    if (!newsFeeds || newsFeeds.length === 0) {
      setNews([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const fetchedNews = await newsFeedEngine.fetchNewsFromFeeds();
      setNews(fetchedNews.slice(0, 5)); // Limit to 5 items
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Failed to load news');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    
    // Set up auto-refresh every 5 minutes
    const interval = setInterval(fetchNews, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [newsFeeds]);

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  if (!newsFeeds || newsFeeds.length === 0) {
    return (
      <Card className="p-4 bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle className="h-5 w-5 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-700">Breaking News</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          No news feeds configured. Set up news sources in the Admin Panel to see live updates.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <h3 className="text-lg font-semibold text-gray-700">Breaking News</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchNews}
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
              No recent news available
            </p>
          )}
        </div>
      )}
    </Card>
  );
};

export default RealTimeNewsFeed;
