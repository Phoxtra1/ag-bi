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
import { Button } from '@/components/ui/button';
import { logoutUser } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={async () => { await logoutUser(); navigate('/'); }}>
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
        <WelcomeSection />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
            <TabsTrigger value="verify">Verify</TabsTrigger>
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="community">Amniva Society</TabsTrigger>
            <TabsTrigger value="api">API Access</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left column: Live Feed + Trending News */}
              <div className="lg:col-span-2 space-y-6">
                <InsightsFeed />
                <TrendingNews />
              </div>
              {/* Right column: Weather + Prediction Metrics - aligned with left */}
              <div className="space-y-6 flex flex-col">
                <WeatherWidget />
                <LivePredictionPanel />
              </div>
            </div>
          </TabsContent>


          <TabsContent value="predictions" className="mt-6">
            <LivePredictionPanel />
          </TabsContent>

          <TabsContent value="verify" className="mt-6">
            <Tabs defaultValue="tracking" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="tracking">My Submissions</TabsTrigger>
                <TabsTrigger value="request">Request Deep Analysis</TabsTrigger>
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
