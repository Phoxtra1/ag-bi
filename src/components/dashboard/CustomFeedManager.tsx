
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Globe, Rss, Settings, ExternalLink, CheckCircle } from 'lucide-react';

interface FeedSource {
  id: string;
  name: string;
  url: string;
  type: 'rss' | 'news' | 'social' | 'api';
  category: string;
  isActive: boolean;
  lastUpdated: string;
}

const CustomFeedManager = () => {
  const { toast } = useToast();
  const [feedSources, setFeedSources] = useState<FeedSource[]>([
    {
      id: '1',
      name: 'Reuters World News',
      url: 'https://feeds.reuters.com/reuters/worldNews',
      type: 'rss',
      category: 'Global News',
      isActive: true,
      lastUpdated: new Date().toISOString()
    },
    {
      id: '2', 
      name: 'BBC Breaking News',
      url: 'https://feeds.bbci.co.uk/news/rss.xml',
      type: 'rss',
      category: 'Breaking News',
      isActive: true,
      lastUpdated: new Date().toISOString()
    },
    {
      id: '3',
      name: 'TechCrunch',
      url: 'https://techcrunch.com/feed/',
      type: 'rss',
      category: 'Technology',
      isActive: false,
      lastUpdated: new Date().toISOString()
    }
  ]);

  const [newFeed, setNewFeed] = useState({
    name: '',
    url: '',
    type: 'rss' as const,
    category: ''
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

  const handleAddFeed = () => {
    if (!newFeed.name || !newFeed.url || !newFeed.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const feed: FeedSource = {
      id: Date.now().toString(),
      name: newFeed.name,
      url: newFeed.url,
      type: newFeed.type,
      category: newFeed.category,
      isActive: true,
      lastUpdated: new Date().toISOString()
    };

    setFeedSources(prev => [...prev, feed]);
    setNewFeed({ name: '', url: '', type: 'rss', category: '' });
    setShowAddForm(false);

    // Update the insights feed in real-time
    const event = new CustomEvent('customFeedUpdate', { detail: feedSources });
    window.dispatchEvent(event);

    toast({
      title: "Feed Added Successfully",
      description: `${feed.name} has been added to your custom feeds`
    });
  };

  const toggleFeedStatus = (feedId: string) => {
    setFeedSources(prev => prev.map(feed => 
      feed.id === feedId ? { ...feed, isActive: !feed.isActive } : feed
    ));

    // Trigger insights feed update
    const updatedFeeds = feedSources.map(feed => 
      feed.id === feedId ? { ...feed, isActive: !feed.isActive } : feed
    );
    
    const event = new CustomEvent('customFeedUpdate', { detail: updatedFeeds });
    window.dispatchEvent(event);

    toast({
      title: "Feed Status Updated",
      description: "Your insights feed will update shortly"
    });
  };

  const removeFeed = (feedId: string) => {
    const feedToRemove = feedSources.find(feed => feed.id === feedId);
    setFeedSources(prev => prev.filter(feed => feed.id !== feedId));

    const event = new CustomEvent('customFeedUpdate', { detail: feedSources.filter(feed => feed.id !== feedId) });
    window.dispatchEvent(event);

    toast({
      title: "Feed Removed",
      description: `${feedToRemove?.name} has been removed from your feeds`
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configure Custom Feed
          </CardTitle>
          <CardDescription>
            Manage your custom news sources and feeds. Active feeds will appear in your Live Insights Feed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add New Feed Button */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {feedSources.filter(f => f.isActive).length} active feeds configured
            </p>
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
                      <label className="text-sm font-medium mb-2 block">Feed Name</label>
                      <Input
                        placeholder="e.g., CNN Breaking News"
                        value={newFeed.name}
                        onChange={(e) => setNewFeed(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Feed Type</label>
                      <Select value={newFeed.type} onValueChange={(value: any) => setNewFeed(prev => ({ ...prev, type: value }))}>
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
                    <label className="text-sm font-medium mb-2 block">Feed URL</label>
                    <Input
                      placeholder="https://example.com/rss"
                      value={newFeed.url}
                      onChange={(e) => setNewFeed(prev => ({ ...prev, url: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
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

          {/* Feed Sources List */}
          <div className="space-y-3">
            {feedSources.map(feed => (
              <Card key={feed.id} className={`transition-all ${feed.isActive ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getFeedIcon(feed.type)}
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
                      <Badge variant={feed.isActive ? "default" : "secondary"}>
                        {feed.category}
                      </Badge>
                      <Badge variant={feed.isActive ? "default" : "outline"}>
                        {feed.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleFeedStatus(feed.id)}
                      >
                        {feed.isActive ? 'Deactivate' : 'Activate'}
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

          {feedSources.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Rss className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No custom feeds configured</p>
              <p className="text-sm">Add your first feed source to get started</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomFeedManager;
