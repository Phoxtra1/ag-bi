import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import WelcomeSection from '@/components/dashboard/WelcomeSection';
import LivePredictionPanel from '@/components/dashboard/LivePredictionPanel';
import AccountManagement from '@/components/dashboard/AccountManagement';
import ApiAccessSection from '@/components/dashboard/ApiAccessSection';
import InsightsFeed from '@/components/dashboard/InsightsFeed';
import VerifyTracking from '@/components/dashboard/VerifyTracking';
import RequestDeepAnalysisForm from '@/components/dashboard/RequestDeepAnalysisForm';
import UserInsightsDashboard from '@/components/UserInsightsDashboard';
import WeatherWidget from '@/components/dashboard/WeatherWidget';
import HelpSupport from '@/components/dashboard/HelpSupport';
import CommunityFeed from '@/components/community/CommunityFeed';
import TrendingNews from '@/components/dashboard/TrendingNews';
import ExecutiveOverview from '@/components/dashboard/ExecutiveOverview';
import BusinessIntelligenceModule from '@/components/dashboard/BusinessIntelligenceModule';
import PredictionRequestDialog from '@/components/dashboard/PredictionRequestDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { logoutUser } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import { LogOut, TrendingUp } from 'lucide-react';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [predictionDialogOpen, setPredictionDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={async () => { await logoutUser(); navigate('/'); }}>
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
        <WelcomeSection />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
          <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10">
            <TabsTrigger value="overview">Executive</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="predictions">Prediction</TabsTrigger>
            <TabsTrigger value="verify">Verify</TabsTrigger>
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="community">Society</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
            <TabsTrigger value="signals">Signals</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <ExecutiveOverview />
          </TabsContent>

          <TabsContent value="business" className="mt-6">
            <BusinessIntelligenceModule />
          </TabsContent>

          <TabsContent value="signals" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <InsightsFeed />
                <TrendingNews />
              </div>
              <div className="space-y-6 flex flex-col">
                <WeatherWidget />
                <LivePredictionPanel />
              </div>
            </div>
          </TabsContent>


          <TabsContent value="predictions" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left column: Prediction Results Area */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Predictions</CardTitle>
                    <CardDescription>
                      Your forecast analysis results will appear here once processed by our engines.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 text-muted-foreground">
                      <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="mb-2">No prediction results yet</p>
                      <p className="text-sm">Submit a prediction request to receive AI-powered forecasting</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              {/* Right column: Live Metrics + Request CTA */}
              <div className="space-y-6">
                <LivePredictionPanel />
                <Card>
                  <CardContent className="pt-6">
                    <Button 
                      onClick={() => setPredictionDialogOpen(true)} 
                      className="w-full"
                      size="lg"
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Run Prediction
                    </Button>
                    <p className="text-xs text-muted-foreground text-center mt-3">
                      Submit data for AI-powered forecast analysis
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
            <PredictionRequestDialog 
              open={predictionDialogOpen} 
              onOpenChange={setPredictionDialogOpen} 
            />
          </TabsContent>

          <TabsContent value="verify" className="mt-6">
            <Tabs defaultValue="tracking" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="tracking">My Submissions</TabsTrigger>
                <TabsTrigger value="request">Submit for Verification</TabsTrigger>
              </TabsList>
              <TabsContent value="tracking">
                <VerifyTracking />
              </TabsContent>
              <TabsContent value="request">
                <RequestDeepAnalysisForm />
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="info" className="mt-6">
            <UserInsightsDashboard />
          </TabsContent>

          <TabsContent value="community" className="mt-6">
            <CommunityFeed />
          </TabsContent>

          <TabsContent value="api" className="mt-6">
            <ApiAccessSection />
          </TabsContent>

          <TabsContent value="account" className="mt-6">
            <AccountManagement />
          </TabsContent>

          <TabsContent value="support" className="mt-6">
            <HelpSupport />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserDashboard;
