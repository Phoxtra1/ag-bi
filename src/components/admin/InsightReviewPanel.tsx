import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getPendingInsights, getAllReports, updateInsightReview } from '@/lib/reports';
import { account } from '@/lib/appwrite';
import { useToast } from '@/hooks/use-toast';
import { 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Filter,
  Lightbulb,
  FileText,
  Send,
  TrendingUp
} from 'lucide-react';
import { Models } from 'appwrite';

const InsightReviewPanel = () => {
  const { toast } = useToast();
  const [pendingInsights, setPendingInsights] = useState<Models.Document[]>([]);
  const [allReports, setAllReports] = useState<Models.Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInsight, setSelectedInsight] = useState<Models.Document | null>(null);
  const [reviewData, setReviewData] = useState({
    enhancedSummary: '',
    enhancedObservations: '',
    enhancedActions: '',
    feedback: '',
    verified: true
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [insights, reports] = await Promise.all([
        getPendingInsights(),
        getAllReports()
      ]);
      
      setPendingInsights(insights.documents);
      setAllReports(reports.documents);
    } catch (error: any) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load insights. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async () => {
    if (!selectedInsight) return;

    try {
      const user = await account.get();
      
      await updateInsightReview(selectedInsight.$id, {
        humanReviewedBy: user.email,
        humanEnhancedSummary: reviewData.enhancedSummary,
        humanEnhancedObservations: reviewData.enhancedObservations 
          ? reviewData.enhancedObservations.split('\n').filter(s => s.trim())
          : [],
        humanEnhancedActions: reviewData.enhancedActions
          ? reviewData.enhancedActions.split('\n').filter(s => s.trim())
          : [],
        humanVerified: reviewData.verified,
        humanFeedback: reviewData.feedback,
        status: 'verified'
      });

      toast({
        title: "Review Submitted",
        description: `Insight has been ${reviewData.verified ? 'verified' : 'reviewed'} and will be delivered to the user.`,
      });

      setSelectedInsight(null);
      setReviewData({
        enhancedSummary: '',
        enhancedObservations: '',
        enhancedActions: '',
        feedback: '',
        verified: true
      });
      
      loadData();
    } catch (error: any) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getReport = (reportId: string) => {
    return allReports.find(r => r.$id === reportId);
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
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold">{pendingInsights.length}</p>
              </div>
              <Clock className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Reports</p>
                <p className="text-2xl font-bold">{allReports.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Elite Users</p>
                <p className="text-2xl font-bold">
                  {pendingInsights.filter(i => i.userPlan === 'Elite' || i.userPlan === 'Institutional').length}
                </p>
              </div>
              <Lightbulb className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Insights Queue */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Pending Insights Review Queue
          </CardTitle>
          <CardDescription>
            Review AI-generated insights before delivery to users
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingInsights.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <p>All insights reviewed! No pending items.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingInsights.map((insight) => {
                const report = getReport(insight.reportId);
                
                return (
                  <div key={insight.$id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{report?.title || 'Unknown Report'}</h4>
                        <p className="text-sm text-muted-foreground">
                          User: {insight.userEmail} • Category: {report?.category}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Submitted: {new Date(insight.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {getPlanBadge(insight.userPlan)}
                        <Badge className="bg-amber-100 text-amber-700">
                          <Clock className="w-3 h-3 mr-1" />
                          Pending Review
                        </Badge>
                      </div>
                    </div>

                    {/* AI Analysis Preview */}
                    <div className="bg-gray-50 rounded p-3 mb-3 space-y-2">
                      <p className="text-sm font-medium flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        AI Analysis Summary
                      </p>
                      <p className="text-sm text-muted-foreground">{insight.aiSummary}</p>
                      {insight.aiConfidence && (
                        <p className="text-xs text-muted-foreground">
                          AI Confidence: {Math.round(insight.aiConfidence * 100)}%
                        </p>
                      )}
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm" 
                          onClick={() => {
                            setSelectedInsight(insight);
                            setReviewData({
                              enhancedSummary: insight.aiSummary || '',
                              enhancedObservations: insight.aiKeyObservations?.join('\n') || '',
                              enhancedActions: insight.aiRecommendedActions?.join('\n') || '',
                              feedback: '',
                              verified: true
                            });
                          }}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Review & Approve
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Review Insight</DialogTitle>
                          <DialogDescription>
                            Enhance and verify the AI-generated insight before delivery
                          </DialogDescription>
                        </DialogHeader>
                        
                        {selectedInsight && (
                          <div className="space-y-4">
                            {/* Original Report */}
                            <div className="border rounded p-3 bg-gray-50">
                              <h4 className="font-semibold mb-2">Original Report</h4>
                              <p className="text-sm text-muted-foreground">{report?.content}</p>
                            </div>

                            {/* AI Analysis */}
                            <div className="border rounded p-3 bg-blue-50">
                              <h4 className="font-semibold mb-2">AI Analysis</h4>
                              <p className="text-sm mb-2"><strong>Summary:</strong> {selectedInsight.aiSummary}</p>
                              {selectedInsight.aiKeyObservations && (
                                <div className="mb-2">
                                  <strong className="text-sm">Key Observations:</strong>
                                  <ul className="list-disc list-inside text-sm mt-1">
                                    {selectedInsight.aiKeyObservations.map((obs: string, idx: number) => (
                                      <li key={idx}>{obs}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {selectedInsight.aiRecommendedActions && (
                                <div>
                                  <strong className="text-sm">Recommended Actions:</strong>
                                  <ul className="list-disc list-inside text-sm mt-1">
                                    {selectedInsight.aiRecommendedActions.map((action: string, idx: number) => (
                                      <li key={idx}>{action}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>

                            {/* Enhanced Review Form */}
                            <div className="space-y-4">
                              <div>
                                <Label>Enhanced Summary</Label>
                                <Textarea
                                  value={reviewData.enhancedSummary}
                                  onChange={(e) => setReviewData(prev => ({ ...prev, enhancedSummary: e.target.value }))}
                                  rows={4}
                                  placeholder="Enhance or refine the AI summary..."
                                />
                              </div>

                              <div>
                                <Label>Enhanced Observations (one per line)</Label>
                                <Textarea
                                  value={reviewData.enhancedObservations}
                                  onChange={(e) => setReviewData(prev => ({ ...prev, enhancedObservations: e.target.value }))}
                                  rows={4}
                                  placeholder="Add or refine observations..."
                                />
                              </div>

                              <div>
                                <Label>Enhanced Actions (one per line)</Label>
                                <Textarea
                                  value={reviewData.enhancedActions}
                                  onChange={(e) => setReviewData(prev => ({ ...prev, enhancedActions: e.target.value }))}
                                  rows={4}
                                  placeholder="Add or refine recommended actions..."
                                />
                              </div>

                              <div>
                                <Label>Internal Feedback (optional)</Label>
                                <Textarea
                                  value={reviewData.feedback}
                                  onChange={(e) => setReviewData(prev => ({ ...prev, feedback: e.target.value }))}
                                  rows={2}
                                  placeholder="Internal notes about this review..."
                                />
                              </div>

                              <div className="flex items-center gap-2">
                                <Label>Verification Status:</Label>
                                <Select 
                                  value={reviewData.verified ? 'verified' : 'reviewed'}
                                  onValueChange={(val) => setReviewData(prev => ({ ...prev, verified: val === 'verified' }))}
                                >
                                  <SelectTrigger className="w-48">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="verified">Verified ✓</SelectItem>
                                    <SelectItem value="reviewed">Reviewed (No Verification)</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="flex gap-2">
                                <Button onClick={handleReviewSubmit} className="flex-1">
                                  <Send className="w-4 h-4 mr-2" />
                                  Submit Review & Deliver
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InsightReviewPanel;
