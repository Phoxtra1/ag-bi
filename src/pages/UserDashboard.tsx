
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import WelcomeSection from '@/components/dashboard/WelcomeSection';
import LivePredictionPanel from '@/components/dashboard/LivePredictionPanel';
import ReportsSubmissions from '@/components/dashboard/ReportsSubmissions';
import AccountManagement from '@/components/dashboard/AccountManagement';
import ApiAccessSection from '@/components/dashboard/ApiAccessSection';
import ApiAccessGuard from '@/components/auth/ApiAccessGuard';
import InsightsFeed from '@/components/dashboard/InsightsFeed';
import WeatherWidget from '@/components/dashboard/WeatherWidget';
import HelpSupport from '@/components/dashboard/HelpSupport';
import ChatbotWidget from '@/components/ChatbotWidget';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock user data - this would come from authentication context
  const userPlan = 'free'; // or 'elite' or 'institutional'
  const isOrganizationVerified = false;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WelcomeSection />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="api">API Access</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <InsightsFeed />
              </div>
              <div className="space-y-6">
                <WeatherWidget />
                <LivePredictionPanel />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="predictions" className="mt-6">
            <LivePredictionPanel />
          </TabsContent>

          <TabsContent value="reports" className="mt-6">
            <ReportsSubmissions />
          </TabsContent>

          <TabsContent value="api" className="mt-6">
            <ApiAccessGuard 
              userPlan={userPlan}
              isOrganizationVerified={isOrganizationVerified}
            >
              <ApiAccessSection />
            </ApiAccessGuard>
          </TabsContent>

          <TabsContent value="account" className="mt-6">
            <AccountManagement />
          </TabsContent>

          <TabsContent value="support" className="mt-6">
            <HelpSupport />
          </TabsContent>
        </Tabs>
      </div>

      {/* Global Chatbot Widget */}
      <ChatbotWidget />
    </div>
  );
};

export default UserDashboard;
