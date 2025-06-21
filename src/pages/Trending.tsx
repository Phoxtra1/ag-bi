
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, CheckCircle, AlertTriangle, XCircle, ExternalLink, Clock } from 'lucide-react';

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
        return <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">✅ Verified</Badge>;
      case 'under-review':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">⚠️ Under Review</Badge>;
      case 'unverified':
        return <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">❌ Unverified</Badge>;
      default:
        return <Badge variant="outline">❓ Unknown</Badge>;
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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Today's Trends</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay updated with the most talked-about headlines and verified trending stories from around the world.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Column - 3/4 width */}
          <div className="lg:col-span-3">
            <Card className="p-6">
              <div className="prose prose-lg max-w-none">
                <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 mb-4">
                  🌍 Today's Trend
                </h2>
                
                <p className="text-gray-700 mb-4">
                  Welcome to the <strong>Trending</strong> page — a space dedicated to the <strong>most talked-about headlines</strong>, 
                  viral topics, and rapidly evolving conversations across the globe.
                </p>

                <p className="text-gray-700 mb-4">
                  We track stories from verified sources across <strong>Entertainment, Tech, Science, Lifestyle, Business, and World Affairs</strong>, 
                  offering you a reliable snapshot of what's currently making waves.
                </p>

                <h4 className="text-lg font-semibold text-gray-900 mb-2">✅ Why This Matters</h4>
                <p className="text-gray-700 mb-4">
                  In a world overwhelmed by misinformation, Amnova ensures you're updated with <strong>accurate, timely, and engaging</strong> headlines. 
                  Stories featured here are not only trending — they're also <strong>reviewed</strong> for truthfulness as part of our wider mission to combat fake news.
                </p>

                <h4 className="text-lg font-semibold text-gray-900 mb-2">🌐 What You'll See</h4>
                <ul className="text-gray-700 mb-4 list-disc list-inside">
                  <li>Real-time headline rotations</li>
                  <li>Curated content from trusted sources</li>
                  <li>Each headline labeled as <strong>Verified ✅</strong>, <strong>Under Review ⚠️</strong>, or <strong>Unverified ❌</strong></li>
                  <li>A focus on <strong>relevance and accuracy</strong>, not just hype</li>
                </ul>

                <h4 className="text-lg font-semibold text-gray-900 mb-2">🧠 Verification Status Key:</h4>
                <ul className="text-gray-700 mb-4 list-none space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <strong>Verified</strong> – Confirmed through Amnova Intelligence & fact-check partners.
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <strong>Under Review</strong> – Still being assessed by our editorial or AI review team.
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <strong>Unverified or Fake</strong> – Contains claims not supported by credible evidence.
                  </li>
                </ul>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800 mb-0">
                    <strong>📌 Note:</strong> This section is dynamically updated and reflects <strong>external credible sources</strong>. 
                    All content is properly credited.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - 1/4 width */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🔥 Live Trending Stories
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
  );
};

export default Trending;
