
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, CheckCircle, AlertTriangle, XCircle, ExternalLink, Clock, Shield, Search, Eye, Globe, DollarSign, Building2, BarChart3 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface TrendingStory {
  id: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
  category: string;
  verificationStatus: 'verified' | 'under-review' | 'unverified';
}

const Trending = () => {
  const [trendingStories, setTrendingStories] = useState<TrendingStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  // Business-focused trending stories
  const mockTrendingStories: TrendingStory[] = [
    {
      id: '1',
      title: 'AI-Powered Trading Algorithms Show 40% Performance Improvement',
      description: 'Leading financial institutions report significant gains from new machine learning models in algorithmic trading strategies.',
      url: '#',
      urlToImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop',
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      source: { name: 'Bloomberg' },
      category: 'Markets',
      verificationStatus: 'verified'
    },
    {
      id: '2',
      title: 'Global Supply Chain Restructuring Accelerates Post-Pandemic',
      description: 'Major corporations announce nearshoring initiatives, reshaping international trade patterns and investment flows.',
      url: '#',
      urlToImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=200&fit=crop',
      publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      source: { name: 'Financial Times' },
      category: 'Trade',
      verificationStatus: 'verified'
    },
    {
      id: '3',
      title: 'Emerging Market Bonds Attract Record Institutional Investment',
      description: 'Fixed income flows to developing economies reach new highs as investors seek yield in diversified portfolios.',
      url: '#',
      urlToImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop',
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      source: { name: 'Reuters' },
      category: 'Investment',
      verificationStatus: 'under-review'
    },
    {
      id: '4',
      title: 'Central Banks Signal Coordinated Policy Shifts',
      description: 'G20 monetary authorities indicate synchronized approach to inflation targeting and interest rate adjustments.',
      url: '#',
      urlToImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=200&fit=crop',
      publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      source: { name: 'Wall Street Journal' },
      category: 'Markets',
      verificationStatus: 'verified'
    },
    {
      id: '5',
      title: 'ESG Investment Mandates Drive Corporate Governance Changes',
      description: 'Environmental, social, and governance factors increasingly influence board decisions and capital allocation.',
      url: '#',
      urlToImage: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=200&fit=crop',
      publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
      source: { name: 'Amniva Intelligence' },
      category: 'Investment',
      verificationStatus: 'verified'
    }
  ];

  useEffect(() => {
    const fetchTrendingStories = async () => {
      setLoading(true);
      setTimeout(() => {
        setTrendingStories(mockTrendingStories);
        setLoading(false);
      }, 1000);
    };

    fetchTrendingStories();
  }, []);

  useEffect(() => {
    if (trendingStories.length > 0) {
      const interval = setInterval(() => {
        setCurrentStoryIndex((prev) => (prev + 1) % trendingStories.length);
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [trendingStories.length]);

  const getVerificationIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'under-review':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'unverified':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200">Verified</Badge>;
      case 'under-review':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200">Under Review</Badge>;
      case 'unverified':
        return <Badge variant="destructive" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200">Unverified</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      'Markets': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'Trade': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      'Investment': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'Risk': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    };
    return <Badge className={colors[category] || 'bg-muted text-muted-foreground'}>{category}</Badge>;
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const publishedDate = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - publishedDate.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-8 min-h-[600px]">
            {/* Left Column - 3/4 width */}
            <div className="lg:col-span-3 flex flex-col">
              {/* Header Section */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="h-8 w-8 text-primary" />
                  <h1 className="text-4xl font-bold text-foreground">Business Trends & Innovations</h1>
                </div>
                <p className="text-lg text-muted-foreground max-w-3xl">
                  Curated market intelligence from verified financial sources to help you make informed business decisions.
                </p>
              </div>

              {/* Why This Matters Section */}
              <Card className="mb-6 bg-primary/5 border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <BarChart3 className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">Why This Matters</h3>
                      <p className="text-muted-foreground">
                        In rapidly evolving markets, Amniva ensures you're updated with <strong>accurate, timely, and actionable</strong> business intelligence. 
                        This isn't just what's trending—it's what's <strong>verified and relevant</strong> for your business.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* What You'll Find Section */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <Search className="h-6 w-6 text-primary mt-1" />
                    <h3 className="text-lg font-semibold text-foreground">What You'll Find</h3>
                  </div>
                  <div className="space-y-3 ml-9">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <span className="text-muted-foreground">Real-time market updates from verified sources</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-5 w-5 text-muted-foreground" />
                      <span className="text-muted-foreground">Financial trends and investment signals</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Building2 className="h-5 w-5 text-muted-foreground mt-1" />
                      <div>
                        <span className="text-muted-foreground">Categorized by sector:</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">Markets</Badge>
                          <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">Trade</Badge>
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Investment</Badge>
                          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">Risk</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-5 w-5 text-muted-foreground" />
                      <span className="text-muted-foreground">Data-driven insights, not speculation</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Verification Status Key */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Data Verification Status</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-green-800 dark:text-green-300">Verified</div>
                        <div className="text-sm text-green-700 dark:text-green-400">Cross-referenced with credible sources</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-yellow-800 dark:text-yellow-300">Under Review</div>
                        <div className="text-sm text-yellow-700 dark:text-yellow-400">Being verified by our analysts</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                      <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-red-800 dark:text-red-300">Unverified</div>
                        <div className="text-sm text-red-700 dark:text-red-400">Insufficient supporting data</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Note at Bottom */}
              <div className="mt-auto">
                <div className="bg-muted border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground italic text-center">
                    Business trends are updated continuously from verified financial sources. For the latest market intelligence, refresh regularly.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - 1/4 width */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Live Market Trends
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="text-sm text-muted-foreground mt-2">Loading market trends...</p>
                    </div>
                  ) : (
                    <>
                      {/* Current Featured Story */}
                      {trendingStories.length > 0 && (
                        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20">
                          <div className="relative">
                            <img 
                              src={trendingStories[currentStoryIndex].urlToImage} 
                              alt={trendingStories[currentStoryIndex].title}
                              className="w-full h-32 object-cover rounded-lg mb-3"
                            />
                            <div className="absolute top-2 right-2">
                              {getVerificationBadge(trendingStories[currentStoryIndex].verificationStatus)}
                            </div>
                          </div>
                          <div className="flex gap-2 mb-2">
                            {getCategoryBadge(trendingStories[currentStoryIndex].category)}
                          </div>
                          <h4 className="font-semibold text-sm mb-2 line-clamp-2">
                            {trendingStories[currentStoryIndex].title}
                          </h4>
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                            {trendingStories[currentStoryIndex].description}
                          </p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTimeAgo(trendingStories[currentStoryIndex].publishedAt)}
                            </span>
                            <span>{trendingStories[currentStoryIndex].source.name}</span>
                          </div>
                        </div>
                      )}

                      {/* Story List */}
                      <div className="space-y-3">
                        {trendingStories.slice(0, 5).map((story, index) => (
                          <div 
                            key={story.id} 
                            className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                              index === currentStoryIndex ? 'bg-primary/5 border-primary/20' : 'bg-card border-border'
                            }`}
                            onClick={() => setCurrentStoryIndex(index)}
                          >
                            <div className="flex items-start gap-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  {getVerificationIcon(story.verificationStatus)}
                                  <h5 className="font-medium text-sm line-clamp-2">{story.title}</h5>
                                </div>
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                  <span>{formatTimeAgo(story.publishedAt)}</span>
                                  <ExternalLink className="h-3 w-3" />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="text-xs text-muted-foreground bg-muted p-3 rounded-lg">
                        <p className="mb-1">
                          <strong>Sources:</strong> Bloomberg, Reuters, Financial Times, WSJ
                        </p>
                        <p>
                          <strong>Note:</strong> Some data may still be under verification. Check back for updates.
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Trending;
