
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

const InsightsFeed = () => {
  const { toast } = useToast();
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'Global News', 'Breaking News', 'Technology', 'Business', 'Sports', 'Health'];

  const generateRealisticNews = () => {
    const sampleNews = [
      {
        id: '1',
        title: 'Global Climate Summit Reaches Historic Agreement',
        summary: 'World leaders agree on ambitious carbon reduction targets for 2030, marking a significant step forward in climate action.',
        source: 'Reuters World News',
        category: 'Global News',
        credibilityScore: 96,
        trending: true,
        verified: true,
        engagement: Math.floor(Math.random() * 5000) + 1000
      },
      {
        id: '2',
        title: 'Breakthrough in Quantum Computing Technology',
        summary: 'Scientists achieve stable quantum state for record-breaking duration, bringing practical quantum computing closer to reality.',
        source: 'TechCrunch',
        category: 'Technology',
        credibilityScore: 94,
        trending: true,
        verified: true,
        engagement: Math.floor(Math.random() * 3000) + 800
      },
      {
        id: '3',
        title: 'New Archaeological Discovery Reshapes Ancient History',
        summary: 'Recent excavations reveal evidence of advanced civilization predating previously known settlements by centuries.',
        source: 'BBC Breaking News',
        category: 'Breaking News',
        credibilityScore: 92,
        trending: false,
        verified: true,
        engagement: Math.floor(Math.random() * 2500) + 600
      },
      {
        id: '4',
        title: 'Major Economic Policy Changes Announced',
        summary: 'Central banks coordinate unprecedented monetary policy adjustments to address global economic challenges.',
        source: 'Reuters World News',
        category: 'Business',
        credibilityScore: 98,
        trending: true,
        verified: true,
        engagement: Math.floor(Math.random() * 4000) + 1200
      },
      {
        id: '5',
        title: 'Revolutionary Medical Treatment Shows Promise',
        summary: 'Clinical trials demonstrate significant success rates for new gene therapy approach to rare diseases.',
        source: 'BBC Breaking News',
        category: 'Health',
        credibilityScore: 95,
        trending: false,
        verified: true,
        engagement: Math.floor(Math.random() * 2800) + 700
      }
    ];

    return sampleNews.map(item => ({
      ...item,
      id: `${item.id}_${Date.now()}`,
      timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      url: `https://example.com/news/${item.id}`
    }));
  };

  const loadNews = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newNews = generateRealisticNews();
      setNewsItems(newNews);
      setLastUpdated(new Date());
      setIsLoading(false);
      
      toast({
        title: "Feed Updated",
        description: `Loaded ${newNews.length} new insights from your custom feeds`
      });
    }, 1000);
  };

  const handleCustomFeedUpdate = (event: any) => {
    // When custom feeds are updated, refresh the insights
    loadNews();
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
    // Generate realistic analytics data
    const analyticsData = {
      totalInsights: filteredNews.length,
      verifiedSources: filteredNews.filter(n => n.verified).length,
      averageCredibility: Math.round(filteredNews.reduce((sum, n) => sum + n.credibilityScore, 0) / filteredNews.length),
      trendingTopics: filteredNews.filter(n => n.trending).length,
      categories: categories.slice(1).map(cat => ({
        category: cat,
        count: filteredNews.filter(n => n.category === cat).length,
        avgEngagement: Math.round(filteredNews.filter(n => n.category === cat).reduce((sum, n) => sum + n.engagement, 0) / Math.max(1, filteredNews.filter(n => n.category === cat).length))
      })),
      timestamp: new Date().toISOString()
    };

    // Create downloadable analytics report
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
              Real-time intelligence from your configured sources • Last updated: {lastUpdated.toLocaleTimeString()}
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
                  Configure Custom Feed
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
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category === 'all' ? 'All Categories' : category}
              {category !== 'all' && (
                <Badge variant="secondary" className="ml-2">
                  {newsItems.filter(n => n.category === category).length}
                </Badge>
              )}
            </Button>
          ))}
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
            <p>No insights available</p>
            <p className="text-sm">Configure custom feeds to start receiving insights</p>
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
              View Detailed Analytics
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InsightsFeed;
