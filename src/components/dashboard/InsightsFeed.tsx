
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Globe, MapPin, Star, Share, Bookmark, Flag } from 'lucide-react';

const InsightsFeed = () => {
  const [savedInsights, setSavedInsights] = useState<number[]>([]);

  const insights = [
    {
      id: 1,
      title: 'Political Stability Index Rising in Europe',
      category: 'Political',
      region: 'Global',
      description: 'Analysis shows increased political stability across European nations with a 15% improvement in governance metrics.',
      timestamp: '2 hours ago',
      accuracy: '94%',
      trending: true
    },
    {
      id: 2,
      title: 'Climate Change Impact on Agricultural Yields',
      category: 'Climate',
      region: 'Local',
      description: 'Predictive models indicate a 12% decrease in crop yields for the upcoming season due to changing weather patterns.',
      timestamp: '4 hours ago',
      accuracy: '87%',
      trending: false
    },
    {
      id: 3,
      title: 'Economic Recovery Signals in Tech Sector',
      category: 'Economic',
      region: 'Global',
      description: 'Leading indicators suggest a strong recovery in technology markets with projected 8% growth over the next quarter.',
      timestamp: '6 hours ago',
      accuracy: '91%',
      trending: true
    }
  ];

  const toggleSave = (insightId: number) => {
    setSavedInsights(prev => 
      prev.includes(insightId) 
        ? prev.filter(id => id !== insightId)
        : [...prev, insightId]
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-6 h-6" />
          Insights Feed
        </CardTitle>
        <CardDescription>
          Personalized real-time insights based on your subscription and interests
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="trending" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="local">Local</TabsTrigger>
            <TabsTrigger value="global">Global</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>
          
          <TabsContent value="trending" className="space-y-4 mt-4">
            {insights.filter(insight => insight.trending).map((insight) => (
              <div key={insight.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium text-gray-900">{insight.title}</h3>
                      {insight.trending && <TrendingUp className="w-4 h-4 text-orange-500" />}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{insight.category}</Badge>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        {insight.region === 'Global' ? <Globe className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                        {insight.region}
                      </Badge>
                      <Badge variant="outline">{insight.accuracy}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                    <p className="text-xs text-gray-500">{insight.timestamp}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => toggleSave(insight.id)}
                    className="flex items-center gap-1"
                  >
                    <Bookmark className={`w-4 h-4 ${savedInsights.includes(insight.id) ? 'fill-current' : ''}`} />
                    {savedInsights.includes(insight.id) ? 'Saved' : 'Save'}
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <Share className="w-4 h-4" />
                    Share
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1 text-red-600">
                    <Flag className="w-4 h-4" />
                    Report
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="local" className="space-y-4 mt-4">
            {insights.filter(insight => insight.region === 'Local').map((insight) => (
              <div key={insight.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-2">{insight.title}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{insight.category}</Badge>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {insight.region}
                      </Badge>
                      <Badge variant="outline">{insight.accuracy}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                    <p className="text-xs text-gray-500">{insight.timestamp}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => toggleSave(insight.id)}
                    className="flex items-center gap-1"
                  >
                    <Bookmark className={`w-4 h-4 ${savedInsights.includes(insight.id) ? 'fill-current' : ''}`} />
                    {savedInsights.includes(insight.id) ? 'Saved' : 'Save'}
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <Share className="w-4 h-4" />
                    Share
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1 text-red-600">
                    <Flag className="w-4 h-4" />
                    Report
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="global" className="space-y-4 mt-4">
            {insights.filter(insight => insight.region === 'Global').map((insight) => (
              <div key={insight.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-2">{insight.title}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{insight.category}</Badge>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        {insight.region}
                      </Badge>
                      <Badge variant="outline">{insight.accuracy}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                    <p className="text-xs text-gray-500">{insight.timestamp}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => toggleSave(insight.id)}
                    className="flex items-center gap-1"
                  >
                    <Bookmark className={`w-4 h-4 ${savedInsights.includes(insight.id) ? 'fill-current' : ''}`} />
                    {savedInsights.includes(insight.id) ? 'Saved' : 'Save'}
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <Share className="w-4 h-4" />
                    Share
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1 text-red-600">
                    <Flag className="w-4 h-4" />
                    Report
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="custom" className="space-y-4 mt-4">
            <div className="text-center py-8">
              <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Custom Insights</h3>
              <p className="text-gray-600 mb-4">Set up custom filters to get personalized insights</p>
              <Button>Configure Custom Feed</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default InsightsFeed;
