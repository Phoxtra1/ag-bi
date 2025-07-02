
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, CheckCircle, AlertTriangle, XCircle, ExternalLink, Clock, Shield, Search, Eye, Globe } from 'lucide-react';
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
  verificationStatus: 'verified' | 'under-review' | 'unverified';
}

const Trending = () => {
  const [trendingStories, setTrendingStories] = useState<TrendingStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  // Mock trending stories with verification status
  const mockTrendingStories: TrendingStory[] = [
    {
      id: '1',
      title: 'Breakthrough in AI Technology Revolutionizes Healthcare',
      description: 'New artificial intelligence system shows 95% accuracy in early disease detection, potentially saving millions of lives worldwide.',
      url: '#',
      urlToImage: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop',
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      source: { name: 'TechNews Today' },
      verificationStatus: 'verified'
    },
    {
      id: '2',
      title: 'Global Climate Summit Reaches Historic Agreement',
      description: 'World leaders unite on ambitious climate action plan with binding commitments for carbon neutrality.',
      url: '#',
      urlToImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=200&fit=crop',
      publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      source: { name: 'Global News Network' },
      verificationStatus: 'verified'
    },
    {
      id: '3',
      title: 'Revolutionary Space Mission Discovers New Exoplanet',
      description: 'Scientists identify potentially habitable planet just 20 light-years away from Earth.',
      url: '#',
      urlToImage: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=200&fit=crop',
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      source: { name: 'Space Today' },
      verificationStatus: 'under-review'
    },
    {
      id: '4',
      title: 'Economic Markets Show Unprecedented Growth Pattern',
      description: 'Global markets experience unusual stability amid economic uncertainty, experts analyze the trend.',
      url: '#',
      urlToImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop',
      publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      source: { name: 'Financial Times' },
      verificationStatus: 'under-review'
    },
    {
      id: '5',
      title: 'Breakthrough in Renewable Energy Storage',
      description: 'New battery technology promises to store renewable energy for weeks, transforming the energy sector.',
      url: '#',
      urlToImage: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=200&fit=crop',
      publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
      source: { name: 'Energy Weekly' },
      verificationStatus: 'verified'
    }
  ];

  useEffect(() => {
    // Simulate API call
    const fetchTrendingStories = async () => {
      setLoading(true);
      // In a real implementation, you would fetch from GNews API or similar
      setTimeout(() => {
        setTrendingStories(mockTrendingStories);
        setLoading(false);
      }, 1000);
    };

    fetchTrendingStories();
  }, []);

  // Auto-rotate stories every 30 seconds
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
        return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">Verified</Badge>;
      case 'under-review':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">Under Review</Badge>;
      case 'unverified':
        return <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">Unverified</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-4 gap-8 min-h-[600px]">
            {/* Left Column - 3/4 width - Redesigned */}
            <div className="lg:col-span-3 flex flex-col">
              {/* Header Section */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                  <h1 className="text-4xl font-bold text-gray-900">Today's Trending Insights</h1>
                </div>
                <p className="text-lg text-gray-600 max-w-3xl">
                  Curated updates from verified media channels to help you stay informed, not misled.
                </p>
              </div>

              {/* Why This Matters Section */}
              <Card className="mb-6 bg-blue-50 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <Shield className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Why This Matters</h3>
                      <p className="text-gray-700">
                        In a world overwhelmed by misinformation, Amniva ensures you're updated with <strong>accurate, timely, and engaging</strong> headlines. 
                        This isn't just what's trending, it's what's <strong>trustworthy</strong>.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* What You'll Find Section */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <Search className="h-6 w-6 text-blue-600 mt-1" />
                    <h3 className="text-lg font-semibold text-gray-900">What You'll Find</h3>
                  </div>
                  <div className="space-y-3 ml-9">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-gray-500" />
                      <span className="text-gray-700">Real-time updates refreshed periodically</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Eye className="h-5 w-5 text-gray-500" />
                      <span className="text-gray-700">Curated by experts and AI systems</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Globe className="h-5 w-5 text-gray-500 mt-1" />
                      <div>
                        <span className="text-gray-700">Categorized for truth:</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge className="bg-green-100 text-green-800 border-green-200">Verified</Badge>
                          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Under Review</Badge>
                          <Badge className="bg-red-100 text-red-800 border-red-200">Unverified</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-5 w-5 text-gray-500" />
                      <span className="text-gray-700">Relevance-driven, not sensational hype</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Verification Status Key */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Status Key</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-green-800">Verified</div>
                        <div className="text-sm text-green-700">AI + fact-check confirmed</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-yellow-800">Under Review</div>
                        <div className="text-sm text-yellow-700">Still under assessment</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                      <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-red-800">Unverified</div>
                        <div className="text-sm text-red-700">No evidence backing</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Note at Bottom */}
              <div className="mt-auto">
                <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 italic text-center">
                    This content is dynamically updated. For the latest verified trends, please refresh regularly.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - 1/4 width */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Live Trending Stories
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="text-sm text-gray-600 mt-2">Loading trending stories...</p>
                    </div>
                  ) : (
                    <>
                      {/* Current Featured Story */}
                      {trendingStories.length > 0 && (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
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
                          <h4 className="font-semibold text-sm mb-2 line-clamp-2">
                            {trendingStories[currentStoryIndex].title}
                          </h4>
                          <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                            {trendingStories[currentStoryIndex].description}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
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
                              index === currentStoryIndex ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                            }`}
                            onClick={() => setCurrentStoryIndex(index)}
                          >
                            <div className="flex items-start gap-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  {getVerificationIcon(story.verificationStatus)}
                                  <h5 className="font-medium text-sm line-clamp-2">{story.title}</h5>
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                  <span>{formatTimeAgo(story.publishedAt)}</span>
                                  <ExternalLink className="h-3 w-3" />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                        <p className="mb-1">
                          <strong>Example sources:</strong> GNews.io, BBC Trending, Reuters, etc.
                        </p>
                        <p>
                          <strong>Note:</strong> Some stories may still be in the process of verification. Please check back for updates.
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
