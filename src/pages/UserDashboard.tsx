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
import { Button } from '@/components/ui/button';
import { logoutUser } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Keep "Live Insights" strictly tied to admin-configured sources
  useEffect(() => {
    const checkFeeds = () => {
      try {
        const feeds = JSON.parse(localStorage.getItem('customFeedSources') || '[]');
        setHasFeeds(Array.isArray(feeds) && feeds.length > 0);
      } catch {
        setHasFeeds(false);
      }
    };

    checkFeeds();

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'customFeedSources' || e.key === 'adminNewsFeeds') {
        checkFeeds();
      }
    };
    window.addEventListener('storage', onStorage);

    const unsubscribeNews = realTimeSync.subscribe('newsFeeds', () => {
      checkFeeds();
    });

    return () => {
      window.removeEventListener('storage', onStorage);
      unsubscribeNews();
    };
  }, []);

  // Capture user geolocation once for better weather accuracy (non-blocking)
  useEffect(() => {
    if (!navigator?.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        try {
          const coords = { lat: pos.coords.latitude, lon: pos.coords.longitude, ts: Date.now() };
          localStorage.setItem('userLocation', JSON.stringify(coords));
          // Broadcast for any listeners that use live location
          realTimeSync.triggerUpdate('userLocation', coords as any);
        } catch {}
      },
      () => {
        // Silently ignore denials; widget can use its own fallback
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 5 * 60 * 1000 }
    );
  }, []);

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
    </div>
  );
};

export default UserDashboard;
