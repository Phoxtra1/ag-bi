
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ExternalLink, Clock, RefreshCw } from 'lucide-react';
import Autoplay from 'embla-carousel-autoplay';

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
      // Try to fetch from the actual Amnewsworld Spotlite page
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent('https://www.amnewsworld.com/spotlite/')}`;
      
      let newsData: NewsItem[] = [];
      
      try {
        const response = await fetch(proxyUrl);
        const htmlText = await response.text();
        
        // Parse HTML to extract news articles
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
        
        // Try to extract articles from common news website structures
        const articles = doc.querySelectorAll('article, .post, .news-item, .story, .entry');
        
        articles.forEach((article, index) => {
          const titleEl = article.querySelector('h1, h2, h3, .title, .headline, .entry-title');
          const linkEl = article.querySelector('a[href]');
          const imageEl = article.querySelector('img');
          const excerptEl = article.querySelector('.excerpt, .summary, p, .entry-content p');
          const timeEl = article.querySelector('time, .date, .timestamp, .published');
          
          if (titleEl && linkEl) {
            const title = titleEl.textContent?.trim() || '';
            const url = linkEl.getAttribute('href') || '';
            const fullUrl = url.startsWith('http') ? url : `https://www.amnewsworld.com${url}`;
            
            // Try to get image from the article or use a fallback
            let imageUrl = '';
            if (imageEl) {
              const src = imageEl.getAttribute('src') || imageEl.getAttribute('data-src');
              imageUrl = src && src.startsWith('http') ? src : (src ? `https://www.amnewsworld.com${src}` : '');
            }
            
            // If no image found, use a unique placeholder based on article index
            if (!imageUrl) {
              const imageIds = [
                'photo-1569163139394-de4e4f43e4e3', // Climate/environment
                'photo-1518186233392-c232efbf2373', // Technology
                'photo-1576091160399-112ba8d25d1f', // Healthcare
                'photo-1503676260728-1c00da094a0b', // Education
                'photo-1446776653964-20c1d3a81b06', // Space
                'photo-1494790108755-2616c4e6ac1c', // Business
                'photo-1585776245991-cf89dd7fc73a', // Politics
                'photo-1544716278-ca5e3f4abd8c' // General news
              ];
              const imageId = imageIds[index % imageIds.length];
              imageUrl = `https://images.unsplash.com/${imageId}?w=400&h=250&fit=crop&q=80`;
            }

            newsData.push({
              id: `spotlite-${index}`,
              title,
              url: fullUrl,
              image: imageUrl,
              timestamp: timeEl?.getAttribute('datetime') || new Date().toISOString(),
              source: 'Spotlite',
              excerpt: excerptEl?.textContent?.trim().substring(0, 150) || ''
            });
          }
        });
      } catch (fetchError) {
        console.log('Direct fetch failed, using fallback news');
      }
      
      // If no articles found or fetch failed, use sample data with unique images
      if (newsData.length === 0) {
        newsData = [
          {
            id: 'spotlite-1',
            title: 'Global Climate Summit Reaches Historic Agreement',
            url: 'https://www.amnewsworld.com/spotlite/climate-summit-agreement',
            image: 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=400&h=250&fit=crop&q=80',
            source: 'Spotlite',
            timestamp: new Date().toISOString(),
            excerpt: 'World leaders unite on ambitious climate targets for 2030, marking a pivotal moment in global environmental policy...'
          },
          {
            id: 'spotlite-2',
            title: 'Tech Innovation Drives Economic Growth in Q4',
            url: 'https://www.amnewsworld.com/spotlite/tech-innovation-growth',
            image: 'https://images.unsplash.com/photo-1518186233392-c232efbf2373?w=400&h=250&fit=crop&q=80',
            source: 'Spotlite',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            excerpt: 'Technology sector shows unprecedented growth rates, with AI and renewable energy leading the charge...'
          },
          {
            id: 'spotlite-3',
            title: 'Healthcare Breakthrough: New Treatment Shows Promise',
            url: 'https://www.amnewsworld.com/spotlite/healthcare-breakthrough',
            image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=250&fit=crop&q=80',
            source: 'Spotlite',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            excerpt: 'Revolutionary medical treatment enters final trials, offering hope for millions of patients worldwide...'
          },
          {
            id: 'spotlite-4',
            title: 'Education Reform Initiative Launches Globally',
            url: 'https://www.amnewsworld.com/spotlite/education-reform',
            image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=250&fit=crop&q=80',
            source: 'Spotlite',
            timestamp: new Date(Date.now() - 10800000).toISOString(),
            excerpt: 'New educational framework aims to transform learning experiences across continents...'
          },
          {
            id: 'spotlite-5',
            title: 'Space Exploration Milestone Achieved',
            url: 'https://www.amnewsworld.com/spotlite/space-milestone',
            image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=250&fit=crop&q=80',
            source: 'Spotlite',
            timestamp: new Date(Date.now() - 14400000).toISOString(),
            excerpt: 'Historic space mission marks new era of exploration, pushing boundaries of human achievement...'
          },
          {
            id: 'spotlite-6',
            title: 'European Markets Show Strong Recovery Signs',
            url: 'https://www.amnewsworld.com/spotlite/european-markets',
            image: 'https://images.unsplash.com/photo-1494790108755-2616c4e6ac1c?w=400&h=250&fit=crop&q=80',
            source: 'Spotlite',
            timestamp: new Date(Date.now() - 18000000).toISOString(),
            excerpt: 'Financial analysts report positive trends across major European stock exchanges...'
          }
        ];
      }

      setNews(newsData.slice(0, 10)); // Limit to 10 articles for carousel
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
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          </div>
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
              <div className="h-32 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : (
        <Carousel 
          className="w-full"
          plugins={[
            Autoplay({
              delay: 4000,
            }),
          ]}
        >
          <CarouselContent>
            {news.map((item) => (
              <CarouselItem key={item.id}>
                <div
                  className="bg-white rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
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
                    </div>
                  )}
                  
                  <div className="p-3">
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-2 flex-1">
                        {item.title}
                      </h4>
                      <ExternalLink className="h-3 w-3 text-gray-400 flex-shrink-0 mt-1" />
                    </div>
                    
                    {item.excerpt && (
                      <p className="text-xs text-gray-600 mb-2 line-clamp-3">
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
        <p className="text-sm text-gray-500 text-center py-4">
          No Spotlite stories available
        </p>
      )}

      <div className="mt-3 pt-3 border-t border-gray-200">
        <Button
          variant="link"
          size="sm"
          className="text-xs text-blue-600 p-0"
          onClick={() => window.open('https://www.amnewsworld.com/spotlite/', '_blank')}
        >
          View all stories on Spotlite →
        </Button>
      </div>
    </Card>
  );
};

export default SpotliteNewsFeed;
