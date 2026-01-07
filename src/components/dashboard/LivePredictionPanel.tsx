import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Activity, 
  AlertTriangle, 
  CheckCircle,
  Globe,
  Users,
  Sparkles,
  Clock
} from 'lucide-react';
import { getPredictions, getUserPredictions } from '@/lib/prediction';
import { getCurrentUser } from '@/lib/auth';
import { PredictionSubmissionModal } from './PredictionSubmissionModal';
import { Models } from 'appwrite';

const LivePredictionPanel = () => {
  const [userPredictions, setUserPredictions] = useState<Models.Document[]>([]);
  const [allPredictions, setAllPredictions] = useState<Models.Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [metrics, setMetrics] = useState({
    totalPredictions: 0,
    accuracyRate: 92.3,
    activeSources: 2847,
    globalReach: 180,
  });

  useEffect(() => {
    loadPredictions();
  }, []);

  const loadPredictions = async () => {
    setLoading(true);
    try {
      const user = await getCurrentUser();
      const allData = await getPredictions();
      setAllPredictions(allData.documents);
      setMetrics(prev => ({
        ...prev,
        totalPredictions: allData.total
      }));

      if (user) {
        const userData = await getUserPredictions(user.email);
        setUserPredictions(userData.documents);
      }
    } catch (error) {
      console.error('Error loading predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': return CheckCircle;
      case 'processing': return Activity;
      case 'pending': return Clock;
      default: return AlertTriangle;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffMins > 0) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Live Prediction Metrics
          </CardTitle>
          <CardDescription>
            Real-time intelligence and prediction analytics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Activity className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Total Predictions</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-900">
                    {metrics.totalPredictions.toLocaleString()}
                  </div>
                  <div className="text-xs text-blue-600 mt-1">
                    Global platform
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Accuracy Rate</span>
                  </div>
                  <div className="text-2xl font-bold text-green-900">
                    {metrics.accuracyRate}%
                  </div>
                  <div className="text-xs text-green-600 mt-1">
                    AI-powered analysis
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-800">Active Sources</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-900">
                    {metrics.activeSources.toLocaleString()}
                  </div>
                  <div className="text-xs text-purple-600 mt-1">
                    Data points monitored
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium text-orange-800">Global Reach</span>
                  </div>
                  <div className="text-2xl font-bold text-orange-900">
                    {metrics.globalReach}
                  </div>
                  <div className="text-xs text-orange-600 mt-1">
                    Countries covered
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="space-y-3">
                <h4 className="font-semibold">Recent Activity</h4>
                {userPredictions.length === 0 ? (
                  <div className="text-center py-8 bg-muted/50 rounded-lg">
                    <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-muted-foreground">No Activities</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Submit your first prediction request to see activity here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {userPredictions.slice(0, 5).map((prediction) => {
                      const StatusIcon = getStatusIcon(prediction.status);
                      return (
                        <div 
                          key={prediction.$id} 
                          className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border"
                        >
                          <StatusIcon className="w-4 h-4 text-primary" />
                          <div className="flex-1">
                            <div className="text-sm font-medium">
                              {prediction.category} - {prediction.status}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formatTimeAgo(prediction.submittedAt)}
                            </div>
                          </div>
                          <Badge className={getStatusColor(prediction.status)}>
                            {prediction.status}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => loadPredictions()}
                >
                  Refresh Data
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <PredictionSubmissionModal 
        open={showSubmitModal}
        onOpenChange={setShowSubmitModal}
        onSuccess={loadPredictions}
      />
    </>
  );
};

export default LivePredictionPanel;
