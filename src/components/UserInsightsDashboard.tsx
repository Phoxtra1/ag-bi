import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getUserReports, getUserInsights } from '@/lib/reports';
import { account } from '@/lib/appwrite';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  Lightbulb, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Download,
  Eye,
  TrendingUp
} from 'lucide-react';
import { Models } from 'appwrite';

type Doc = Models.Document & Record<string, any>;

const UserInsightsDashboard = () => {
  const { toast } = useToast();
  const [reports, setReports] = useState<Doc[]>([]);
  const [insights, setInsights] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const user = await account.get();
      setUserId(user.$id);
      
      const [reportsData, insightsData] = await Promise.all([
        getUserReports(user.$id),
        getUserInsights(user.$id)
      ]);
      
      setReports(reportsData.documents);
      setInsights(insightsData.documents);
    } catch (error: any) {
      console.error('Error loading user data:', error);
      toast({
        title: "Error",
        description: "Failed to load your data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; icon: any; label: string }> = {
      pending: { color: 'bg-gray-100 text-gray-700', icon: Clock, label: 'Pending' },
      ai_processed: { color: 'bg-blue-100 text-blue-700', icon: TrendingUp, label: 'AI Processed' },
      pending_ai: { color: 'bg-yellow-100 text-yellow-700', icon: Clock, label: 'Analyzing' },
      pending_review: { color: 'bg-amber-100 text-amber-700', icon: Eye, label: 'Under Review' },
      verified: { color: 'bg-green-100 text-green-700', icon: CheckCircle, label: 'Verified' },
      delivered: { color: 'bg-green-100 text-green-700', icon: CheckCircle, label: 'Delivered' },
      human_reviewed: { color: 'bg-green-100 text-green-700', icon: CheckCircle, label: 'Reviewed' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getPlanBadge = (plan: string) => {
    const planColors: Record<string, string> = {
      Pro: 'bg-blue-100 text-blue-700',
      Elite: 'bg-purple-100 text-purple-700',
      Institutional: 'bg-indigo-100 text-indigo-700'
    };
    
    return <Badge className={planColors[plan] || 'bg-gray-100 text-gray-700'}>{plan}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Submissions</p>
                <p className="text-2xl font-bold">{reports.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Insights Received</p>
                <p className="text-2xl font-bold">{insights.length}</p>
              </div>
              <Lightbulb className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Analysis</p>
                <p className="text-2xl font-bold">
                  {reports.filter(r => r.status === 'pending' || r.status === 'ai_processed').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Verified Insights</p>
                <p className="text-2xl font-bold">
                  {insights.filter(i => i.humanVerified).length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Reports and Insights */}
      <Tabs defaultValue="insights" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="insights">My Insights</TabsTrigger>
          <TabsTrigger value="submissions">My Submissions</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          {insights.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Lightbulb className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-muted-foreground">No insights yet. Submit your first report to receive AI-powered analysis!</p>
              </CardContent>
            </Card>
          ) : (
            insights.map((insight) => (
              <Card key={insight.$id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="w-5 h-5" />
                        Insight Analysis
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Report ID: {insight.reportId.slice(0, 8)}...
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {getStatusBadge(insight.status)}
                      {getPlanBadge(insight.userPlan)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* AI Summary */}
                  {insight.aiSummary && (
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        AI Summary
                      </h4>
                      <p className="text-sm text-muted-foreground">{insight.aiSummary}</p>
                      {insight.aiConfidence && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Confidence: {Math.round(insight.aiConfidence * 100)}%
                        </p>
                      )}
                    </div>
                  )}

                  {/* AI Key Observations */}
                  {insight.aiKeyObservations && insight.aiKeyObservations.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Key Observations</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {insight.aiKeyObservations.map((obs: string, idx: number) => (
                          <li key={idx} className="text-sm text-muted-foreground">{obs}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* AI Recommended Actions */}
                  {insight.aiRecommendedActions && insight.aiRecommendedActions.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Recommended Actions</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {insight.aiRecommendedActions.map((action: string, idx: number) => (
                          <li key={idx} className="text-sm text-muted-foreground">{action}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Human Enhanced Content (Elite/Institutional) */}
                  {insight.humanReviewed && (
                    <div className="border-t pt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <h4 className="font-semibold">Expert-Reviewed Analysis</h4>
                      </div>
                      
                      {insight.humanEnhancedSummary && (
                        <div className="mb-3">
                          <p className="text-sm text-muted-foreground">{insight.humanEnhancedSummary}</p>
                        </div>
                      )}

                      {insight.humanEnhancedObservations && insight.humanEnhancedObservations.length > 0 && (
                        <div className="mb-3">
                          <p className="text-sm font-medium mb-1">Enhanced Observations:</p>
                          <ul className="list-disc list-inside space-y-1">
                            {insight.humanEnhancedObservations.map((obs: string, idx: number) => (
                              <li key={idx} className="text-sm text-muted-foreground">{obs}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {insight.humanEnhancedActions && insight.humanEnhancedActions.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-1">Enhanced Actions:</p>
                          <ul className="list-disc list-inside space-y-1">
                            {insight.humanEnhancedActions.map((action: string, idx: number) => (
                              <li key={idx} className="text-sm text-muted-foreground">{action}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <p className="text-xs text-muted-foreground mt-2">
                        Reviewed by: {insight.humanReviewedBy} on {new Date(insight.humanReviewDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Export PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="submissions" className="space-y-4">
          {reports.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-muted-foreground">No submissions yet. Start by submitting your first report!</p>
              </CardContent>
            </Card>
          ) : (
            reports.map((report) => (
              <Card key={report.$id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{report.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {report.category} • {new Date(report.submittedAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    {getStatusBadge(report.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                    {report.content}
                  </p>
                  {report.location && (
                    <p className="text-xs text-muted-foreground mb-2">Location: {report.location}</p>
                  )}
                  {report.tags && report.tags.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {report.tags.map((tag: string, idx: number) => (
                        <Badge key={idx} variant="outline" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserInsightsDashboard;
