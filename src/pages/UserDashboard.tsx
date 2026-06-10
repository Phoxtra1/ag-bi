import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import WelcomeSection from '@/components/dashboard/WelcomeSection';
import LivePredictionPanel from '@/components/dashboard/LivePredictionPanel';
import AccountManagement from '@/components/dashboard/AccountManagement';
import ApiAccessSection from '@/components/dashboard/ApiAccessSection';
import InsightsFeed from '@/components/dashboard/InsightsFeed';
import VerifyTracking from '@/components/dashboard/VerifyTracking';
import RequestDeepAnalysisForm from '@/components/dashboard/RequestDeepAnalysisForm';

import WeatherWidget from '@/components/dashboard/WeatherWidget';
import HelpSupport from '@/components/dashboard/HelpSupport';
import CommunityFeed from '@/components/community/CommunityFeed';
import TrendingNews from '@/components/dashboard/TrendingNews';
import ExecutiveOverview from '@/components/dashboard/ExecutiveOverview';
import BusinessIntelligenceModule from '@/components/dashboard/BusinessIntelligenceModule';
import MarketIntelligenceModule from '@/components/dashboard/MarketIntelligenceModule';
import CompetitorIntelligenceModule from '@/components/dashboard/CompetitorIntelligenceModule';
import OpportunityIntelligenceModule from '@/components/dashboard/OpportunityIntelligenceModule';
import BuyerSellerIntelligenceModule from '@/components/dashboard/BuyerSellerIntelligenceModule';
import PredictionRequestDialog from '@/components/dashboard/PredictionRequestDialog';
import WalkthroughDialog, { hasSeenWalkthrough, resetWalkthrough } from '@/components/intelligence/WalkthroughDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { logoutUser } from '@/lib/auth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LogOut, TrendingUp, HelpCircle } from 'lucide-react';

const VALID_TABS = ['overview','business','market','competitor','opportunity','trade','predictions','verify','signals','community','api','account','support'];

const UserDashboard = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(VALID_TABS.includes(initialTab ?? '') ? (initialTab as string) : 'overview');
  const [predictionDialogOpen, setPredictionDialogOpen] = useState(false);
  const [walkthroughOpen, setWalkthroughOpen] = useState(false);

  useEffect(() => {
    if (!hasSeenWalkthrough()) {
      const t = setTimeout(() => setWalkthroughOpen(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    const t = searchParams.get('tab');
    if (t && VALID_TABS.includes(t) && t !== activeTab) setActiveTab(t);
  }, [searchParams]);

  const handleTabChange = (v: string) => {
    setActiveTab(v);
    const next = new URLSearchParams(searchParams);
    next.set('tab', v);
    setSearchParams(next, { replace: true });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => { resetWalkthrough(); setWalkthroughOpen(true); }}>
            <HelpCircle className="w-4 h-4 mr-2" /> Walkthrough
          </Button>
          <Button variant="outline" size="sm" onClick={async () => { await logoutUser(); navigate('/'); }}>
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
        <WelcomeSection />

        <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-8">
          <TabsList className="flex w-full flex-wrap h-auto">
            <TabsTrigger value="overview">Executive</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="market">Market</TabsTrigger>
            <TabsTrigger value="competitor">Competitor</TabsTrigger>
            <TabsTrigger value="opportunity">Opportunity</TabsTrigger>
            <TabsTrigger value="trade">Buyer/Seller</TabsTrigger>
            <TabsTrigger value="predictions">Prediction</TabsTrigger>
            <TabsTrigger value="verify">Verify</TabsTrigger>
            <TabsTrigger value="signals">Signals</TabsTrigger>
            <TabsTrigger value="community">Society</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <ExecutiveOverview />
          </TabsContent>

          <TabsContent value="business" className="mt-6">
            <BusinessIntelligenceModule />
          </TabsContent>

          <TabsContent value="market" className="mt-6">
            <MarketIntelligenceModule />
          </TabsContent>

          <TabsContent value="competitor" className="mt-6">
            <CompetitorIntelligenceModule />
          </TabsContent>

          <TabsContent value="opportunity" className="mt-6">
            <OpportunityIntelligenceModule />
          </TabsContent>

          <TabsContent value="trade" className="mt-6">
            <BuyerSellerIntelligenceModule />
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

      <WalkthroughDialog
        open={walkthroughOpen}
        onOpenChange={setWalkthroughOpen}
        onJumpToBusiness={() => handleTabChange('business')}
      />
    </div>
  );
};

export default UserDashboard;
