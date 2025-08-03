
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  Clock, 
  ExternalLink, 
  Settings,
  BarChart3,
  Globe,
  Zap,
  Target
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const InsightsFeed = () => {
  const [insights, setInsights] = useState([
    {
      id: 1,
      title: "AI Market Surge Predicted",
      description: "Machine learning adoption is expected to grow by 42% in the next quarter based on current trends.",
      category: "Technology",
      timestamp: "2 hours ago",
      confidence: 87,
      source: "Market Analysis"
    },
    {
      id: 2,
      title: "Climate Impact Assessment",
      description: "New environmental data suggests significant weather pattern changes affecting agricultural predictions.",
      category: "Environment",
      timestamp: "4 hours ago",
      confidence: 92,
      source: "Weather Data"
    },
    {
      id: 3,
      title: "Economic Forecast Update",
      description: "Financial markets showing volatility patterns that could indicate upcoming opportunities.",
      category: "Finance",
      timestamp: "6 hours ago",
      confidence: 78,
      source: "Financial Analysis"
    }
  ]);

  const [customFeedSettings, setCustomFeedSettings] = useState({
    categories: ['Technology', 'Finance', 'Environment'],
    updateFrequency: 'hourly',
    confidenceThreshold: 80,
    sources: ['Market Analysis', 'Weather Data', 'Financial Analysis']
  });

  const [recentActivity, setRecentActivity] = useState([
    { action: "Prediction submitted", time: "10 minutes ago", type: "prediction" },
    { action: "API call made", time: "25 minutes ago", type: "api" },
    { action: "Report generated", time: "1 hour ago", type: "report" },
    { action: "Profile updated", time: "2 hours ago", type: "profile" }
  ]);

  const { toast } = useToast();

  // Simulate live updates for insights
  useEffect(() => {
    const interval = setInterval(() => {
      setInsights(prev => prev.map(insight => ({
        ...insight,
        confidence: Math.max(60, Math.min(95, insight.confidence + Math.floor(Math.random() * 6) - 3)),
        timestamp: updateTimestamp(insight.timestamp)
      })));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Simulate live recent activity updates
  useEffect(() => {
    const activities = [
      { action: "New prediction analyzed", type: "prediction" },
      { action: "Data sync completed", type: "api" },
      { action: "Alert notification sent", type: "notification" },
      { action: "System health check", type: "system" },
      { action: "User interaction logged", type: "activity" }
    ];

    const interval = setInterval(() => {
      const randomActivity = activities[Math.floor(Math.random() * activities.length)];
      setRecentActivity(prev => [
        { ...randomActivity, time: "Just now" },
        ...prev.slice(0, 3).map(item => ({ ...item, time: incrementTime(item.time) }))
      ]);
    }, 45000); // Update every 45 seconds

    return () => clearInterval(interval);
  }, []);

  const updateTimestamp = (timestamp: string) => {
    const match = timestamp.match(/(\d+)\s+(\w+)\s+ago/);
    if (match) {
      let [, num, unit] = match;
      let minutes = parseInt(num);
      if (unit.includes('hour')) minutes *= 60;
      minutes += Math.floor(Math.random() * 10) + 5;
      
      if (minutes >= 60) {
        const hours = Math.floor(minutes / 60);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
      }
      return `${minutes} minutes ago`;
    }
    return timestamp;
  };

  const incrementTime = (time: string) => {
    if (time === "Just now") return "2 minutes ago";
    const match = time.match(/(\d+)\s+(\w+)\s+ago/);
    if (match) {
      let [, num, unit] = match;
      let value = parseInt(num) + Math.floor(Math.random() * 5) + 1;
      return `${value} ${unit} ago`;
    }
    return time;
  };

  const handleConfigureFeed = () => {
    // Save settings to localStorage
    localStorage.setItem('customFeedSettings', JSON.stringify(customFeedSettings));
    toast({
      title: "Feed Configured",
      description: "Your custom feed settings have been saved successfully.",
    });
  };

  const handleViewAnalytics = () => {
    // Navigate to analytics with real data
    toast({
      title: "Loading Analytics",
      description: "Preparing your detailed analytics dashboard...",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-500" />
              Live Insights Feed
            </CardTitle>
            <CardDescription>Real-time predictions and market intelligence</CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Configure Custom Feed
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Configure Your Custom Feed</DialogTitle>
                <DialogDescription>
                  Customize what insights and predictions you want to see
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="categories">Categories</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {['Technology', 'Finance', 'Environment', 'Healthcare', 'Politics'].map(category => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={category}
                          checked={customFeedSettings.categories.includes(category)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setCustomFeedSettings(prev => ({
                                ...prev,
                                categories: [...prev.categories, category]
                              }));
                            } else {
                              setCustomFeedSettings(prev => ({
                                ...prev,
                                categories: prev.categories.filter(c => c !== category)
                              }));
                            }
                          }}
                        />
                        <Label htmlFor={category} className="text-sm">{category}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="frequency">Update Frequency</Label>
                  <Select value={customFeedSettings.updateFrequency} onValueChange={(value) => 
                    setCustomFeedSettings(prev => ({ ...prev, updateFrequency: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Real-time</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="threshold">Minimum Confidence Threshold</Label>
                  <Input
                    type="number"
                    value={customFeedSettings.confidenceThreshold}
                    onChange={(e) => setCustomFeedSettings(prev => ({
                      ...prev,
                      confidenceThreshold: parseInt(e.target.value)
                    }))}
                    min="50"
                    max="100"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <DialogTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogTrigger>
                <DialogTrigger asChild>
                  <Button onClick={handleConfigureFeed}>Save Settings</Button>
                </DialogTrigger>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.map((insight) => (
              <div key={insight.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{insight.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <Badge variant="secondary">{insight.category}</Badge>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {insight.timestamp}
                      </span>
                      <span className="text-xs text-gray-500">Source: {insight.source}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-600">{insight.confidence}%</div>
                      <div className="text-xs text-gray-500">Confidence</div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded border-l-2 border-l-blue-500 bg-blue-50">
                  <span className="text-sm font-medium">{activity.action}</span>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-amber-500" />
              Analytics Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Data Points Analyzed</span>
                <span className="font-semibold">1,247</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Prediction Accuracy</span>
                <span className="font-semibold text-green-600">94.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Insights</span>
                <span className="font-semibold">23</span>
              </div>
              <Button 
                className="w-full mt-4" 
                variant="outline"
                onClick={handleViewAnalytics}
                asChild
              >
                <Link to="/trending">View Detailed Analytics</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InsightsFeed;
