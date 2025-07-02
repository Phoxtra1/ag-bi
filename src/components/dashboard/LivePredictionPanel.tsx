
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  AlertTriangle, 
  CheckCircle,
  Globe,
  Users,
  Zap
} from 'lucide-react';

const LivePredictionPanel = () => {
  const [liveMetrics, setLiveMetrics] = useState({
    totalPredictions: 15420,
    accuracyRate: 89.7,
    activeSources: 2847,
    globalReach: 180,
    trendsDetected: 23,
    riskLevel: 'Medium',
    lastUpdate: new Date()
  });

  const [isLive, setIsLive] = useState(true);

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (isLive) {
        setLiveMetrics(prev => ({
          ...prev,
          totalPredictions: prev.totalPredictions + Math.floor(Math.random() * 5) + 1,
          accuracyRate: Math.round((89.5 + Math.random() * 2) * 10) / 10,
          activeSources: prev.activeSources + Math.floor(Math.random() * 10) - 5,
          trendsDetected: prev.trendsDetected + (Math.random() > 0.8 ? 1 : 0),
          lastUpdate: new Date()
        }));
      }
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [isLive]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Live Prediction Metrics
            </CardTitle>
            <CardDescription>
              Real-time intelligence and prediction analytics
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <Badge variant={isLive ? "default" : "secondary"}>
              {isLive ? "LIVE" : "PAUSED"}
            </Badge>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsLive(!isLive)}
            >
              {isLive ? "Pause" : "Resume"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Live Status Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-600" />
              <span className="text-blue-800 font-medium">System Status: Active</span>
            </div>
            <span className="text-blue-600 text-sm">
              Last updated: {formatTime(liveMetrics.lastUpdate)}
            </span>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Total Predictions</span>
            </div>
            <div className="text-2xl font-bold text-blue-900">
              {liveMetrics.totalPredictions.toLocaleString()}
            </div>
            <div className="text-xs text-blue-600 mt-1">
              +{Math.floor(Math.random() * 50) + 10} today
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">Accuracy Rate</span>
            </div>
            <div className="text-2xl font-bold text-green-900">
              {liveMetrics.accuracyRate}%
            </div>
            <div className="text-xs text-green-600 mt-1">
              {Math.random() > 0.5 ? '+' : ''}0.{Math.floor(Math.random() * 9)}% today
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">Active Sources</span>
            </div>
            <div className="text-2xl font-bold text-purple-900">
              {liveMetrics.activeSources.toLocaleString()}
            </div>
            <div className="text-xs text-purple-600 mt-1">
              Monitoring now
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-800">Global Reach</span>
            </div>
            <div className="text-2xl font-bold text-orange-900">
              {liveMetrics.globalReach}
            </div>
            <div className="text-xs text-orange-600 mt-1">
              Countries covered
            </div>
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900">Current Risk Assessment</h4>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <div>
                <div className="font-medium">Misinformation Risk Level</div>
                <div className="text-sm text-gray-600">Based on current trends and patterns</div>
              </div>
            </div>
            <Badge className={getRiskColor(liveMetrics.riskLevel)}>
              {liveMetrics.riskLevel}
            </Badge>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900">Recent Activity</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <div className="flex-1">
                <div className="text-sm font-medium">Climate report verified</div>
                <div className="text-xs text-gray-600">{Math.floor(Math.random() * 5) + 1} minutes ago</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <div className="flex-1">
                <div className="text-sm font-medium">New trend detected: Political coverage spike</div>
                <div className="text-xs text-gray-600">{Math.floor(Math.random() * 15) + 5} minutes ago</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <div className="flex-1">
                <div className="text-sm font-medium">Suspicious content flagged for review</div>
                <div className="text-xs text-gray-600">{Math.floor(Math.random() * 30) + 10} minutes ago</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t">
          <Button variant="outline" size="sm" className="flex-1">
            View Detailed Analytics
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            Export Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LivePredictionPanel;
