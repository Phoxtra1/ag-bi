import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Globe, 
  Zap, 
  Building2, 
  Leaf, 
  Cpu, 
  FlaskConical, 
  Landmark 
} from 'lucide-react';
import { executeTrending } from '@/lib/moduleRegistry';

interface TrendingTopic {
  id: string;
  topic: string;
  category: string;
  score: number;
  velocity: number;
}

const categoryIcons: Record<string, any> = {
  Business: Building2,
  Environment: Leaf,
  Technology: Cpu,
  Science: FlaskConical,
  Politics: Landmark,
  Global: Globe,
  default: TrendingUp
};

const categoryColors: Record<string, string> = {
  Business: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  Environment: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  Technology: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  Science: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  Politics: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  Global: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  default: 'bg-muted text-muted-foreground'
};

const TrendingNews = () => {
  const [trends, setTrends] = useState<TrendingTopic[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  // Fetch trending data from engine
  const fetchTrends = useCallback(async () => {
    try {
      const response = await executeTrending();
      
      if (response?.data?.trending_topics && response.data.trending_topics.length > 0) {
        const topics = response.data.trending_topics.map((item: any, idx: number) => ({
          id: `trend-${idx}-${Date.now()}`,
          topic: item.topic,
          category: item.category || 'Global',
          score: item.score || 0,
          velocity: item.velocity || 0
        }));
        setTrends(topics);
      } else {
        // Fallback trending data when engine unavailable
        setTrends([
          { id: '1', topic: 'AI Transforming Media Industry', category: 'Technology', score: 95, velocity: 12 },
          { id: '2', topic: 'Climate Summit Reaches Historic Agreement', category: 'Environment', score: 92, velocity: 8 },
          { id: '3', topic: 'Global Markets Rally on Economic Data', category: 'Business', score: 88, velocity: 15 },
          { id: '4', topic: 'Breakthrough in Renewable Energy Storage', category: 'Science', score: 85, velocity: 6 },
          { id: '5', topic: 'International Trade Policy Reforms', category: 'Politics', score: 82, velocity: 10 },
          { id: '6', topic: 'Tech Giants Announce Strategic Partnerships', category: 'Business', score: 80, velocity: 9 },
          { id: '7', topic: 'New Space Mission Discoveries', category: 'Science', score: 78, velocity: 7 },
          { id: '8', topic: 'Sustainable Cities Initiative Expands', category: 'Environment', score: 75, velocity: 5 }
        ]);
      }
    } catch (error) {
      console.error('Error fetching trending data:', error);
      // Use fallback data on error
      setTrends([
        { id: '1', topic: 'AI Transforming Media Industry', category: 'Technology', score: 95, velocity: 12 },
        { id: '2', topic: 'Climate Summit Reaches Historic Agreement', category: 'Environment', score: 92, velocity: 8 },
        { id: '3', topic: 'Global Markets Rally on Economic Data', category: 'Business', score: 88, velocity: 15 },
        { id: '4', topic: 'Breakthrough in Renewable Energy Storage', category: 'Science', score: 85, velocity: 6 },
        { id: '5', topic: 'International Trade Policy Reforms', category: 'Politics', score: 82, velocity: 10 }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch and periodic refresh
  useEffect(() => {
    fetchTrends();
    
    // Refresh trending data every 5 minutes
    const refreshInterval = setInterval(() => {
      fetchTrends();
    }, 300000);

    return () => clearInterval(refreshInterval);
  }, [fetchTrends]);

  // Auto-rotate headlines
  useEffect(() => {
    if (trends.length === 0 || isPaused) return;

    const rotationInterval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % trends.length);
    }, 4000); // Rotate every 4 seconds

    return () => clearInterval(rotationInterval);
  }, [trends.length, isPaused]);

  const getCategoryIcon = (category: string) => {
    const Icon = categoryIcons[category] || categoryIcons.default;
    return <Icon className="w-4 h-4" />;
  };

  const getCategoryColor = (category: string) => {
    return categoryColors[category] || categoryColors.default;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Zap className="w-5 h-5 text-amber-500" />
            Trending News
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-6 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (trends.length === 0) {
    return null;
  }

  const currentTrend = trends[currentIndex];
  const visibleTrends = trends.slice(0, 5);

  return (
    <Card 
      className="overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <CardHeader className="pb-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500 animate-pulse" />
            Trending News
          </div>
          <span className="text-xs font-normal text-muted-foreground">
            Live updates
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {/* Featured headline with animation */}
        <div 
          className="p-4 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 transition-all duration-500"
          key={currentTrend.id}
        >
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-full ${getCategoryColor(currentTrend.category)}`}>
              {getCategoryIcon(currentTrend.category)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground animate-fade-in">
                {currentTrend.topic}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className={getCategoryColor(currentTrend.category)}>
                  {currentTrend.category}
                </Badge>
                {currentTrend.velocity > 10 && (
                  <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Hot
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Progress indicators */}
        <div className="flex gap-1">
          {visibleTrends.map((_, idx) => (
            <div 
              key={idx}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                idx === currentIndex 
                  ? 'bg-primary' 
                  : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Quick list of other trends */}
        <div className="space-y-2">
          {visibleTrends.map((trend, idx) => (
            <div 
              key={trend.id}
              className={`flex items-center gap-2 p-2 rounded-lg transition-all duration-200 cursor-pointer hover:bg-muted/50 ${
                idx === currentIndex ? 'bg-muted/30' : ''
              }`}
              onClick={() => setCurrentIndex(idx)}
            >
              <span className="text-xs text-muted-foreground font-mono w-5">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <span className="flex-1 text-sm truncate">
                {trend.topic}
              </span>
              <Badge variant="outline" className={`text-xs ${getCategoryColor(trend.category)}`}>
                {trend.category}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendingNews;
