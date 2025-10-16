import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Clock, CheckCircle, Eye, Download, TrendingUp, AlertCircle } from 'lucide-react';
import { account } from '@/lib/appwrite';
import { useToast } from '@/hooks/use-toast';

interface VerificationSubmission {
  id: string;
  claimDescription: string;
  contentType: string;
  status: 'pending' | 'ai_processed' | 'verified' | 'delivered';
  submittedAt: string;
  aiConfidence?: number;
  aiSummary?: string;
  humanVerified?: boolean;
  userPlan: 'Pro' | 'Elite' | 'Institutional';
}

const VerifyTracking = () => {
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<VerificationSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [userPlan, setUserPlan] = useState<'Pro' | 'Elite' | 'Institutional'>('Pro');

  useEffect(() => {
    loadVerifications();
  }, []);

  const loadVerifications = async () => {
    try {
      const user = await account.get();
      // Mock data - replace with actual Appwrite query
      const mockSubmissions: VerificationSubmission[] = [
        {
          id: '1',
          claimDescription: 'Climate change data verification request',
          contentType: 'text',
          status: 'verified',
          submittedAt: new Date(Date.now() - 86400000).toISOString(),
          aiConfidence: 0.92,
          aiSummary: 'The claim is supported by multiple credible sources.',
          humanVerified: true,
          userPlan: 'Elite'
        },
        {
          id: '2',
          claimDescription: 'Political statement fact-check',
          contentType: 'url',
          status: 'ai_processed',
          submittedAt: new Date(Date.now() - 172800000).toISOString(),
          aiConfidence: 0.78,
          aiSummary: 'Partially accurate. Some context missing.',
          humanVerified: false,
          userPlan: 'Pro'
        }
      ];
      setSubmissions(mockSubmissions);
      setUserPlan('Elite'); // Mock user plan
    } catch (error) {
      console.error('Error loading verifications:', error);
      toast({
        title: "Error",
        description: "Failed to load verification data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { color: string; icon: any; label: string }> = {
      pending: { color: 'bg-gray-100 text-gray-700', icon: Clock, label: 'Pending' },
      ai_processed: { color: 'bg-blue-100 text-blue-700', icon: TrendingUp, label: 'AI Analyzed' },
      verified: { color: 'bg-green-100 text-green-700', icon: CheckCircle, label: 'Verified' },
      delivered: { color: 'bg-green-100 text-green-700', icon: CheckCircle, label: 'Delivered' }
    };
    const cfg = config[status] || config.pending;
    const Icon = cfg.icon;
    return (
      <Badge className={cfg.color}>
        <Icon className="w-3 h-3 mr-1" />
        {cfg.label}
      </Badge>
    );
  };

  const handleRequestDeepAnalysis = (submissionId: string) => {
    if (userPlan === 'Pro') {
      toast({
        title: "Upgrade Required",
        description: "Deep Analysis is available for Elite and Institutional plans.",
      });
    } else {
      toast({
        title: "Request Submitted",
        description: "Your deep analysis request has been submitted.",
      });
    }
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
      {/* Hero Section */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-none">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-600" />
            <div>
              <CardTitle className="text-2xl">Your Verification Journey</CardTitle>
              <CardDescription className="text-gray-700">
                Track your submissions from information to verification
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 italic">
            "Here's what you've shared, and where truth meets clarity."
          </p>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Submissions</p>
                <p className="text-2xl font-bold">{submissions.length}</p>
              </div>
              <Shield className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Verified Claims</p>
                <p className="text-2xl font-bold">
                  {submissions.filter(s => s.status === 'verified').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">
                  {submissions.filter(s => s.status === 'pending' || s.status === 'ai_processed').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Your Verification Submissions</h3>
        {submissions.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Shield className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-muted-foreground">
                No verification submissions yet. Submit a claim to get started!
              </p>
            </CardContent>
          </Card>
        ) : (
          submissions.map((submission) => (
            <Card key={submission.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{submission.claimDescription}</CardTitle>
                    <CardDescription className="mt-1">
                      Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  {getStatusBadge(submission.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* AI Summary for Pro users */}
                {submission.aiSummary && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4" />
                      Basic AI Verification
                    </h4>
                    <p className="text-sm text-gray-700">{submission.aiSummary}</p>
                    {submission.aiConfidence && (
                      <p className="text-xs text-gray-600 mt-2">
                        Confidence: {Math.round(submission.aiConfidence * 100)}%
                      </p>
                    )}
                  </div>
                )}

                {/* Human Verification for Elite/Institutional */}
                {submission.humanVerified && (
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-semibold flex items-center gap-2 mb-2 text-green-800">
                      <CheckCircle className="w-4 h-4" />
                      Expert Verified
                    </h4>
                    <p className="text-sm text-green-700">
                      This claim has been reviewed and verified by our expert team.
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 flex-wrap">
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export PDF
                  </Button>
                  
                  {/* Elite Feature */}
                  {userPlan === 'Elite' && submission.status === 'ai_processed' && (
                    <Button 
                      size="sm" 
                      onClick={() => handleRequestDeepAnalysis(submission.id)}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Request Deep Analysis
                    </Button>
                  )}

                  {/* Institutional Feature */}
                  {userPlan === 'Institutional' && (
                    <Button size="sm" variant="outline">
                      Share or Export
                    </Button>
                  )}
                </div>

                {/* Upsell for Pro Users */}
                {userPlan === 'Pro' && submission.status === 'ai_processed' && (
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-sm text-amber-800">
                      <AlertCircle className="w-4 h-4 inline mr-1" />
                      You've unlocked AI Insight. Want to see the human-verified version with richer interpretation?
                      <Button variant="link" className="text-amber-900 underline ml-1">
                        Upgrade to Elite
                      </Button>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default VerifyTracking;
