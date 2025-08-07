
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  TrendingUp, 
  Globe, 
  AlertTriangle, 
  CheckCircle, 
  Settings, 
  RefreshCw, 
  ExternalLink,
  Clock,
  Eye,
  BookOpen,
  BarChart3
} from 'lucide-react';
import CustomFeedManager from './CustomFeedManager';
import { newsFeedEngine } from '@/lib/dynamicContentEngines';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  category: string;
  timestamp: string;
  credibilityScore: number;
  trending: boolean;
  verified: boolean;
  url?: string;
  engagement: number;
}

interface FeedSource {
  id: string;
  name: string;
  url: string;
  type: 'rss' | 'news' | 'social' | 'api';
  category: string;
  isActive: boolean;
  lastUpdated: string;
}

const InsightsFeed = () => {
  const { toast } = useToast();
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [feedSources, setFeedSources] = useState<FeedSource[]>([]);

  // Load feed sources from localStorage
  const loadFeedSources = () => {
    try {
      const savedFeeds = localStorage.getItem('customFeedSources');
      if (savedFeeds) {
        const feeds = JSON.parse(savedFeeds) as FeedSource[];
        setFeedSources(feeds);
        return feeds.filter(feed => feed.isActive);
      }
    } catch (error) {
      console.error('Error loading feed sources:', error);
    }
    return [];
  };

  // Get unique categories from active feed sources only
  const getActiveCategories = () => {
    const activeFeeds = feedSources.filter(feed => feed.isActive);
    const categories = ['all', ...new Set(activeFeeds.map(feed => feed.category))];
    return categories;
  };

  const categories = getActiveCategories();

  const generateNewsFromFeeds = (activeFeeds: FeedSource[]) => {
    // If no active feeds, return empty array
    if (activeFeeds.length === 0) {
      return [];
    }

    // Generate realistic news based on active feed sources
    const newsTemplates = [
      {
        titles: {
          'Global News': ['Breaking: International Summit Reaches Historic Agreement', 'Global Markets React to Policy Changes', 'World Leaders Address Climate Crisis'],
          'Breaking News': ['Major Development in Ongoing Investigation', 'Emergency Response Teams Deploy to Region', 'Live Updates: Situation Continues to Develop'],
          'Technology': ['Breakthrough in Quantum Computing Achieved', 'New AI System Shows Remarkable Capabilities', 'Tech Giant Announces Revolutionary Platform'],
          'Business': ['Market Analysis: Unexpected Growth in Sector', 'Corporate Merger Creates Industry Giant', 'Economic Indicators Show Positive Trends'],
          'Sports': ['Championship Finals Set Record Attendance', 'Athlete Breaks Long-Standing World Record', 'Playoff Race Intensifies as Season Nears End'],
          'Health': ['Medical Breakthrough Offers New Hope', 'Health Officials Issue Important Guidelines', 'Research Study Reveals Significant Findings'],
          'Science': ['Scientists Make Groundbreaking Discovery', 'Space Mission Achieves Major Milestone', 'Research Team Publishes Revolutionary Study'],
          'Politics': ['Legislative Session Addresses Key Issues', 'Political Leaders Announce New Initiative', 'Policy Reform Gains Bipartisan Support'],
          'Entertainment': ['Film Festival Celebrates Outstanding Cinema', 'Music Industry Honors Top Artists', 'Cultural Event Draws International Attention'],
          'Weather': ['Severe Weather System Approaches Region', 'Seasonal Forecast Shows Unusual Patterns', 'Climate Data Reveals Important Trends']
        },
        summaries: {
          'Global News': 'International cooperation reaches new heights as world leaders collaborate on pressing global challenges.',
          'Breaking News': 'Developing story with significant implications continues to unfold with new details emerging.',
          'Technology': 'Latest technological advancement promises to transform industry standards and user experiences.',
          'Business': 'Market dynamics shift as new economic factors influence trading patterns and investment strategies.',
          'Sports': 'Athletic competition reaches peak intensity with outstanding performances capturing global attention.',
          'Health': 'Medical research advances provide new insights into treatment options and preventive measures.',
          'Science': 'Scientific exploration yields remarkable discoveries that expand our understanding of the world.',
          'Politics': 'Political developments shape policy landscape with potential long-term societal impacts.',
          'Entertainment': 'Cultural celebrations showcase artistic excellence and creative innovation from around the world.',
          'Weather': 'Meteorological patterns show significant changes requiring public awareness and preparedness.'
        }
      }
    ];

    const template = newsTemplates[0];
    const generatedNews: NewsItem[] = [];

    activeFeeds.forEach((feed, index) => {
      const titles = template.titles[feed.category as keyof typeof template.titles] || ['General News Update'];
      const summary = template.summaries[feed.category as keyof typeof template.summaries] || 'Latest updates from this source.';
      
      // Generate 1-2 news items per active feed
      for (let i = 0; i < Math.min(2, titles.length); i++) {
        generatedNews.push({
          id: `${feed.id}_${i}_${Date.now()}`,
          title: titles[i] || `${feed.category} Update`,
          summary: summary,
          source: feed.name,
          category: feed.category,
          timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
          credibilityScore: Math.floor(Math.random() * 15) + 85, // 85-100
          trending: Math.random() > 0.7,
          verified: true,
          url: feed.url,
          engagement: Math.floor(Math.random() * 5000) + 1000
        });
      }
    });

    return generatedNews.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const loadNews = () => {
    setIsLoading(true);
    
    const activeFeeds = loadFeedSources();
    
    // Simulate API call
    setTimeout(() => {
      const newNews = generateNewsFromFeeds(activeFeeds);
      setNewsItems(newNews);
      setLastUpdated(new Date());
      setIsLoading(false);
      
      if (newNews.length > 0) {
        toast({
          title: "Feed Updated",
          description: `Loaded ${newNews.length} new insights from ${activeFeeds.length} active feed sources`
        });
      } else {
        toast({
          title: "No Active Feeds",
          description: "Add and activate feed sources to see insights",
          variant: "destructive"
        });
      }
    }, 1000);
  };

  const handleCustomFeedUpdate = (event: any) => {
    console.log('Feed update detected, refreshing insights...');
    // Update feed sources and refresh insights
    setTimeout(() => {
      loadNews();
    }, 500); // Small delay to ensure localStorage is updated
  };

  useEffect(() => {
    loadNews();
    
    // Listen for custom feed updates
    window.addEventListener('customFeedUpdate', handleCustomFeedUpdate);
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      loadNews();
    }, 300000);

    return () => {
      window.removeEventListener('customFeedUpdate', handleCustomFeedUpdate);
      clearInterval(interval);
    };
  }, []);

  const filteredNews = newsItems.filter(item => 
    selectedCategory === 'all' || item.category === selectedCategory
  );

  const getCredibilityColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const formatRelativeTime = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const handleViewFullAnalytics = () => {
    const activeFeeds = feedSources.filter(f => f.isActive);
    const analyticsData = {
      totalInsights: filteredNews.length,
      activeFeedSources: activeFeeds.length,
      verifiedSources: filteredNews.filter(n => n.verified).length,
      averageCredibility: filteredNews.length > 0 
        ? Math.round(filteredNews.reduce((sum, n) => sum + n.credibilityScore, 0) / filteredNews.length) 
        : 0,
      trendingTopics: filteredNews.filter(n => n.trending).length,
      categories: categories.slice(1).map(cat => ({
        category: cat,
        count: filteredNews.filter(n => n.category === cat).length,
        avgEngagement: Math.round(filteredNews.filter(n => n.category === cat).reduce((sum, n) => sum + n.engagement, 0) / Math.max(1, filteredNews.filter(n => n.category === cat).length))
      })),
      feedSources: activeFeeds.map(feed => ({
        name: feed.name,
        category: feed.category,
        type: feed.type,
        articlesGenerated: filteredNews.filter(n => n.source === feed.name).length
      })),
      timestamp: new Date().toISOString()
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(analyticsData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `amniva-insights-analytics-${Date.now()}.json`);
    downloadAnchor.click();

    toast({
      title: "Analytics Downloaded",
      description: "Detailed analytics report has been downloaded successfully"
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Live Insights Feed
            </CardTitle>
            <CardDescription>
              Real-time intelligence from your configured sources • {feedSources.filter(f => f.isActive).length} active feeds • Last updated: {lastUpdated.toLocaleTimeString()}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadNews}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Configure Feed Sources
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Custom Feed Configuration</DialogTitle>
                </DialogHeader>
                <CustomFeedManager />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Category Filter - Only show categories that have active feeds */}
        <div className="flex flex-wrap gap-2">
          {categories.map(category => {
            const categoryCount = category === 'all' 
              ? newsItems.length 
              : newsItems.filter(n => n.category === category).length;
            
            return (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'all' ? 'All Categories' : category}
                <Badge variant="secondary" className="ml-2">
                  {categoryCount}
                </Badge>
              </Button>
            );
          })}
        </div>

        {/* News Items */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNews.map(item => (
              <Card key={item.id} className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 flex-1">
                      <h3 className="font-semibold text-gray-900 flex-1">{item.title}</h3>
                      {item.trending && <Badge className="bg-red-100 text-red-800">Trending</Badge>}
                      {item.verified && <CheckCircle className="w-4 h-4 text-green-600" />}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3">{item.summary}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        {item.source}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatRelativeTime(item.timestamp)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {item.engagement.toLocaleString()} views
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getCredibilityColor(item.credibilityScore)}>
                        {item.credibilityScore}% Credible
                      </Badge>
                      <Badge variant="outline">{item.category}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredNews.length === 0 && !isLoading && (
          <div className="text-center py-8 text-gray-500">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No insights available for selected category</p>
            {feedSources.filter(f => f.isActive).length === 0 ? (
              <p className="text-sm">Configure and activate feed sources to start receiving insights</p>
            ) : (
              <p className="text-sm">Try selecting a different category or refresh your feeds</p>
            )}
          </div>
        )}

        {/* Analytics CTA */}
        {filteredNews.length > 0 && (
          <div className="pt-4 border-t">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleViewFullAnalytics}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              View Detailed Analytics ({feedSources.filter(f => f.isActive).length} sources active)
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InsightsFeed;
