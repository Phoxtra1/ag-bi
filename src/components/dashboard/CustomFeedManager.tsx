
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Globe, Rss, Settings, ExternalLink, CheckCircle, AlertTriangle, TestTube } from 'lucide-react';
import { linkValidationEngine, newsFeedEngine } from '@/lib/dynamicContentEngines';

interface FeedSource {
  id: string;
  name: string;
  url: string;
  type: 'rss' | 'news' | 'social' | 'api';
  category: string;
  isActive: boolean;
  lastUpdated: string;
  apiKey?: string;
  isValidated?: boolean;
  validationStatus?: string;
}

// New: explicit state type for newFeed so type is a proper union, not a "rss" literal
type NewFeedState = {
  name: string;
  url: string;
  type: FeedSource['type'];
  category: string;
  apiKey: string;
};

const CustomFeedManager = () => {
  const { toast } = useToast();
  const [feedSources, setFeedSources] = useState<FeedSource[]>([]);
  const [testingFeed, setTestingFeed] = useState<string | null>(null);

  // Updated: use explicit type and remove 'as const' to prevent literal narrowing
  const [newFeed, setNewFeed] = useState<NewFeedState>({
    name: '',
    url: '',
    type: 'rss',
    category: '',
    apiKey: ''
  });

  const [showAddForm, setShowAddForm] = useState(false);

  const categories = [
    'Global News',
    'Breaking News', 
    'Technology',
    'Business',
    'Sports',
    'Health',
    'Science',
    'Politics',
    'Entertainment',
    'Weather'
  ];

  // Load feed sources from localStorage on component mount
  useEffect(() => {
    loadFeedSources();
  }, []);

  const loadFeedSources = () => {
    try {
      const savedFeeds = localStorage.getItem('customFeedSources');
      if (savedFeeds) {
        const feeds = JSON.parse(savedFeeds) as FeedSource[];
        setFeedSources(feeds);
      } else {
        // Initialize with default business intelligence feeds
        const defaultFeeds: FeedSource[] = [
          {
            id: '1',
            name: 'Bloomberg Markets',
            url: 'https://www.bloomberg.com/markets',
            type: 'news',
            category: 'Markets',
            isActive: true,
            lastUpdated: new Date().toISOString(),
            isValidated: true,
            validationStatus: 'verified'
          },
          {
            id: '2',
            name: 'Reuters World News',
            url: 'https://feeds.reuters.com/reuters/worldNews',
            type: 'rss',
            category: 'Global News',
            isActive: true,
            lastUpdated: new Date().toISOString(),
            isValidated: true,
            validationStatus: 'verified'
          },
          {
            id: '3', 
            name: 'BBC Breaking News',
            url: 'https://feeds.bbci.co.uk/news/rss.xml',
            type: 'rss',
            category: 'Breaking News',
            isActive: true,
            lastUpdated: new Date().toISOString(),
            isValidated: true,
            validationStatus: 'verified'
          }
        ];
        setFeedSources(defaultFeeds);
        saveFeedSources(defaultFeeds);
      }
    } catch (error) {
      console.error('Error loading feed sources:', error);
      toast({
        title: "Error Loading Feeds",
        description: "Could not load saved feed sources",
        variant: "destructive"
      });
    }
  };

  const saveFeedSources = (feeds: FeedSource[]) => {
    try {
      localStorage.setItem('customFeedSources', JSON.stringify(feeds));
      
      // Update the news feed engine with new feeds
      newsFeedEngine.updateFeeds(feeds);
      
      // Trigger update event for InsightsFeed
      const event = new CustomEvent('customFeedUpdate', { detail: feeds });
      window.dispatchEvent(event);
      
      console.log('Feed sources saved and engines updated:', feeds.length, 'feeds');
    } catch (error) {
      console.error('Error saving feed sources:', error);
    }
  };

  const validateFeedUrl = async (url: string, type: string) => {
    try {
      const validation = await linkValidationEngine.validateUrl(url);
      
      if (!validation.isValid) {
        return { isValid: false, error: validation.error };
      }
      
      // Additional type-specific validation
      if (type === 'rss' && validation.type !== 'rss' && validation.type !== 'general') {
        return { 
          isValid: false, 
          error: 'URL does not appear to be an RSS feed' 
        };
      }
      
      if (type === 'api' && validation.type !== 'api' && validation.type !== 'general') {
        return { 
          isValid: false, 
          error: 'URL does not appear to be an API endpoint' 
        };
      }
      
      return { 
        isValid: true, 
        details: validation.details,
        validationType: validation.type
      };
    } catch (error) {
      return { 
        isValid: false, 
        error: 'Validation failed: ' + (error as Error).message 
      };
    }
  };

  const testFeedConnection = async (feedId: string) => {
    const feed = feedSources.find(f => f.id === feedId);
    if (!feed) return;
    
    setTestingFeed(feedId);
    
    try {
      // Test the feed URL
      const validation = await validateFeedUrl(feed.url, feed.type);
      
      if (validation.isValid) {
        // Update feed status
        const updatedFeeds = feedSources.map(f => 
          f.id === feedId 
            ? { ...f, isValidated: true, validationStatus: 'verified', lastUpdated: new Date().toISOString() }
            : f
        );
        
        setFeedSources(updatedFeeds);
        saveFeedSources(updatedFeeds);
        
        toast({
          title: "Feed Test Successful",
          description: `${feed.name} is working correctly and can fetch content`
        });
      } else {
        // Update feed with error status
        const updatedFeeds = feedSources.map(f => 
          f.id === feedId 
            ? { ...f, isValidated: false, validationStatus: 'error', lastUpdated: new Date().toISOString() }
            : f
        );
        
        setFeedSources(updatedFeeds);
        saveFeedSources(updatedFeeds);
        
        toast({
          title: "Feed Test Failed",
          description: validation.error || 'Could not connect to feed source',
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Feed Test Error",
        description: 'An error occurred while testing the feed',
        variant: "destructive"
      });
    } finally {
      setTestingFeed(null);
    }
  };

  const handleAddFeed = async () => {
    if (!newFeed.name || !newFeed.url || !newFeed.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Validate the URL before adding
    const validation = await validateFeedUrl(newFeed.url, newFeed.type);
    
    const feed: FeedSource = {
      id: Date.now().toString(),
      name: newFeed.name,
      url: newFeed.url,
      type: newFeed.type,
      category: newFeed.category,
      isActive: true,
      lastUpdated: new Date().toISOString(),
      apiKey: newFeed.apiKey || undefined,
      isValidated: validation.isValid,
      validationStatus: validation.isValid ? 'verified' : 'error'
    };

    const updatedFeeds = [...feedSources, feed];
    setFeedSources(updatedFeeds);
    saveFeedSources(updatedFeeds);
    
    setNewFeed({ name: '', url: '', type: 'rss', category: '', apiKey: '' });
    setShowAddForm(false);

    toast({
      title: "Feed Added Successfully",
      description: `${feed.name} has been added ${validation.isValid ? 'and verified' : 'but requires attention'}`
    });
  };

  const toggleFeedStatus = (feedId: string) => {
    const updatedFeeds = feedSources.map(feed => 
      feed.id === feedId ? { ...feed, isActive: !feed.isActive, lastUpdated: new Date().toISOString() } : feed
    );
    
    setFeedSources(updatedFeeds);
    saveFeedSources(updatedFeeds);

    const toggledFeed = updatedFeeds.find(feed => feed.id === feedId);
    
    toast({
      title: "Feed Status Updated",
      description: `${toggledFeed?.name} is now ${toggledFeed?.isActive ? 'active' : 'inactive'}. Insights feed will update shortly.`
    });
  };

  const removeFeed = (feedId: string) => {
    const feedToRemove = feedSources.find(feed => feed.id === feedId);
    const updatedFeeds = feedSources.filter(feed => feed.id !== feedId);
    
    setFeedSources(updatedFeeds);
    saveFeedSources(updatedFeeds);

    toast({
      title: "Feed Removed",
      description: `${feedToRemove?.name} has been removed from your feeds. Insights will no longer show content from this source.`
    });
  };

  const getFeedIcon = (type: string) => {
    switch (type) {
      case 'rss':
        return <Rss className="w-4 h-4" />;
      case 'news':
        return <Globe className="w-4 h-4" />;
      default:
        return <Settings className="w-4 h-4" />;
    }
  };

  const getValidationIcon = (feed: FeedSource) => {
    if (!feed.isValidated) {
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    }
    
    if (feed.validationStatus === 'verified') {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    
    return <AlertTriangle className="w-4 h-4 text-red-500" />;
  };

  const activeFeeds = feedSources.filter(feed => feed.isActive);
  const inactiveFeeds = feedSources.filter(feed => !feed.isActive);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Feed Source Management
          </CardTitle>
          <CardDescription>
            Configure and manage news sources for the Live Insights Feed. Test connections and monitor feed health.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status Summary */}
          <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{activeFeeds.length}</div>
                <div className="text-sm text-blue-600">Active Feeds</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-500">{inactiveFeeds.length}</div>
                <div className="text-sm text-gray-500">Inactive Feeds</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {feedSources.filter(f => f.isValidated && f.validationStatus === 'verified').length}
                </div>
                <div className="text-sm text-green-600">Verified Feeds</div>
              </div>
            </div>
            <Button onClick={() => setShowAddForm(!showAddForm)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Feed Source
            </Button>
          </div>

          {/* Add Feed Form */}
          {showAddForm && (
            <Card className="border-dashed">
              <CardContent className="pt-4">
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Feed Name *</label>
                      <Input
                        placeholder="e.g., CNN Breaking News"
                        value={newFeed.name}
                        onChange={(e) => setNewFeed(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Feed Type *</label>
                      {/* Updated: type the onValueChange to the union type */}
                      <Select value={newFeed.type} onValueChange={(value: FeedSource['type']) => setNewFeed(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rss">RSS Feed</SelectItem>
                          <SelectItem value="news">News API</SelectItem>
                          <SelectItem value="social">Social Media</SelectItem>
                          <SelectItem value="api">Custom API</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Feed URL *</label>
                    <Input
                      placeholder="https://example.com/rss"
                      value={newFeed.url}
                      onChange={(e) => setNewFeed(prev => ({ ...prev, url: e.target.value }))}
                    />
                  </div>
                  {(newFeed.type === 'api' || newFeed.type === 'news') && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">API Key (optional)</label>
                      <Input
                        type="password"
                        placeholder="Enter API key if required"
                        value={newFeed.apiKey}
                        onChange={(e) => setNewFeed(prev => ({ ...prev, apiKey: e.target.value }))}
                      />
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category *</label>
                    <Select value={newFeed.category} onValueChange={(value) => setNewFeed(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddFeed}>Add Feed</Button>
                    <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Active Feed Sources */}
          {activeFeeds.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-green-700 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Active Feed Sources ({activeFeeds.length})
              </h4>
              {activeFeeds.map(feed => (
                <Card key={feed.id} className="border-green-200 bg-green-50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getFeedIcon(feed.type)}
                        {getValidationIcon(feed)}
                        <div>
                          <h4 className="font-medium">{feed.name}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>{feed.url}</span>
                            <a href={feed.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="default">{feed.category}</Badge>
                        <Badge variant="default" className="bg-green-600">Active</Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => testFeedConnection(feed.id)}
                          disabled={testingFeed === feed.id}
                        >
                          <TestTube className={`w-4 h-4 mr-1 ${testingFeed === feed.id ? 'animate-spin' : ''}`} />
                          Test
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleFeedStatus(feed.id)}
                        >
                          Deactivate
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeFeed(feed.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Inactive Feed Sources */}
          {inactiveFeeds.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700">Inactive Feed Sources ({inactiveFeeds.length})</h4>
              {inactiveFeeds.map(feed => (
                <Card key={feed.id} className="border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getFeedIcon(feed.type)}
                        {getValidationIcon(feed)}
                        <div>
                          <h4 className="font-medium text-gray-600">{feed.name}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>{feed.url}</span>
                            <a href={feed.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{feed.category}</Badge>
                        <Badge variant="outline">Inactive</Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => testFeedConnection(feed.id)}
                          disabled={testingFeed === feed.id}
                        >
                          <TestTube className={`w-4 h-4 mr-1 ${testingFeed === feed.id ? 'animate-spin' : ''}`} />
                          Test
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleFeedStatus(feed.id)}
                        >
                          Activate
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeFeed(feed.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {feedSources.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Rss className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No feed sources configured</p>
              <p className="text-sm">Add your first feed source to start receiving insights</p>
            </div>
          )}

          {/* Important Note */}
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="text-sm">
                <strong>Important:</strong> Feed sources are tested automatically when added. Use the "Test" button to verify connectivity. 
                Only active and verified sources will generate content in the Live Insights Feed.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomFeedManager;
