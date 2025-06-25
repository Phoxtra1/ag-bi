
import React, { useState } from 'react';
import { 
  BarChart3, 
  Bell, 
  Settings, 
  LogOut, 
  User,
  Home,
  TrendingUp,
  Shield,
  Cloud,
  FileText,
  Key,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import WelcomeSection from '@/components/dashboard/WelcomeSection';
import PredictionPanel from '@/components/dashboard/PredictionPanel';
import InsightsFeed from '@/components/dashboard/InsightsFeed';
import ApiAccessSection from '@/components/dashboard/ApiAccessSection';
import WeatherWidget from '@/components/dashboard/WeatherWidget';
import ReportsSubmissions from '@/components/dashboard/ReportsSubmissions';
import AccountManagement from '@/components/dashboard/AccountManagement';
import HelpSupport from '@/components/dashboard/HelpSupport';

const UserDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  
  // Simulate authentication check (will be replaced with real auth later)
  const isAuthenticated = false; // Set to false to show login requirement
  
  // Show login requirement screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <img 
                src="/lovable-uploads/ea0bb535-fc7d-44f0-80e1-abd03b1a3317.png" 
                alt="Amniva Logo" 
                className="h-8 w-8"
              />
              <h2 className="text-2xl font-bold text-blue-800">Amniva™</h2>
            </div>
            <CardTitle className="flex items-center gap-2 justify-center">
              <Lock className="h-5 w-5 text-blue-600" />
              Access Required
            </CardTitle>
            <CardDescription>
              Please sign in to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-gray-600 mb-6">
              <p>You need to be logged in to access the Amniva dashboard and its features.</p>
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700" disabled>
              Sign In (Coming Soon)
            </Button>
            <Button variant="outline" className="w-full" disabled>
              Create Account (Coming Soon)
            </Button>
            <div className="text-center">
              <Button variant="ghost" onClick={() => window.location.href = '/'}>
                ← Back to Homepage
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const menuItems = [
    { id: 'overview', title: 'Dashboard', icon: Home },
    { id: 'predictions', title: 'Predictions', icon: TrendingUp },
    { id: 'insights', title: 'Insights Feed', icon: BarChart3 },
    { id: 'api-access', title: 'API Access', icon: Key },
    { id: 'reports', title: 'Reports', icon: FileText },
    { id: 'account', title: 'Account', icon: User },
    { id: 'help', title: 'Help & Support', icon: Shield },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <WelcomeSection />
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <PredictionPanel />
                <InsightsFeed />
              </div>
              <div className="space-y-6">
                <WeatherWidget />
                <ReportsSubmissions />
              </div>
            </div>
          </div>
        );
      case 'predictions':
        return <PredictionPanel />;
      case 'insights':
        return <InsightsFeed />;
      case 'api-access':
        return <ApiAccessSection />;
      case 'reports':
        return <ReportsSubmissions />;
      case 'account':
        return <AccountManagement />;
      case 'help':
        return <HelpSupport />;
      default:
        return <WelcomeSection />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50 to-white">
        <Sidebar className="border-r border-blue-200">
          <SidebarContent>
            <div className="p-6 border-b border-blue-200">
              <div className="flex items-center gap-3">
                <img 
                  src="/lovable-uploads/ea0bb535-fc7d-44f0-80e1-abd03b1a3317.png" 
                  alt="Amniva Logo" 
                  className="h-8 w-8"
                />
                <h2 className="text-xl font-bold text-blue-800">Amniva™</h2>
              </div>
            </div>
            
            <SidebarGroup className="px-4 py-6">
              <SidebarGroupLabel className="text-gray-600 text-sm font-medium mb-4">
                MAIN MENU
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-2">
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => setActiveSection(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                          activeSection === item.id 
                            ? 'bg-blue-100 text-blue-800 font-medium' 
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <div className="mt-auto p-4 border-t border-blue-200">
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start gap-3 text-gray-600">
                  <Settings className="w-5 h-5" />
                  Settings
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-3 text-gray-600">
                  <Bell className="w-5 h-5" />
                  Notifications
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-3 text-red-600">
                  <LogOut className="w-5 h-5" />
                  Logout
                </Button>
              </div>
            </div>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <SidebarTrigger className="lg:hidden" />
              <div className="flex items-center gap-4 ml-auto">
                <Button variant="ghost" size="icon">
                  <Bell className="w-5 h-5" />
                </Button>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">John Doe</span>
                </div>
              </div>
            </div>
            
            {renderContent()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default UserDashboard;
