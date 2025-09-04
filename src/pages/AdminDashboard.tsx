
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Settings, 
  BarChart3, 
  Shield, 
  DollarSign, 
  Activity,
  Bell,
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  Plus,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Zap,
  Database,
  Mail,
  FileText,
  Inbox,
  Building,
  Rss,
  Bot // added
} from 'lucide-react';
import DashboardOverview from '@/components/admin/DashboardOverview';
import UserManagement from '@/components/admin/UserManagement';
import SystemSettings from '@/components/admin/SystemSettings';
import FinancialReports from '@/components/admin/FinancialReports';
import SystemStatus from '@/components/admin/SystemStatus';
import AdminInvitation from '@/components/admin/AdminInvitation';
import ApiManagement from '@/components/admin/ApiManagement';
import ContentOversight from '@/components/admin/ContentOversight';
import ContentSubmissions from '@/components/admin/ContentSubmissions';
import ContactInbox from '@/components/admin/ContactInbox';
import ApiAccessRequests from '@/components/admin/ApiAccessRequests';
import CustomFeedManager from '@/components/dashboard/CustomFeedManager';
import ConfigureOdenehoAI from '@/components/admin/ConfigureOdenehoAI'; // added
import AIEnginePanel from '@/components/admin/AIEnginePanel';
import TrainingSystem from '@/components/admin/TrainingSystem';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState({
    contactUnread: 0,
    contentPending: 0,
    apiRequests: 0,
    systemAlerts: 0
  });

  // Real-time stats for dashboard - Updated to match expected interface
  const [realTimeStats, setRealTimeStats] = useState({
    totalUsers: 1847,
    individualUsers: 1620,
    organizationUsers: 227,
    newSignupsToday: 23,
    weeklyGrowth: 45,
    monthlyGrowth: 187,
    closedAccountsToday: 2,
    closedAccountsWeekly: 8,
    activeApiSubscriptions: 34,
    currentEarnings: {
      daily: 142.50,
      weekly: 998.75,
      monthly: 4250.00,
      yearly: 51000.00
    }
  });

  useEffect(() => {
    // Load notification counts
    const loadNotifications = () => {
      try {
        // Contact messages
        const contacts = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
        const unreadContacts = contacts.filter((msg: any) => msg.status === 'new').length;
        
        // Content submissions
        const content = JSON.parse(localStorage.getItem('contentSubmissions') || '[]');
        const pendingContent = content.filter((sub: any) => sub.status === 'pending').length;
        
        // API requests (mock data)
        const pendingApiRequests = 3;
        
        setNotifications({
          contactUnread: unreadContacts,
          contentPending: pendingContent,
          apiRequests: pendingApiRequests,
          systemAlerts: 0
        });
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    };

    loadNotifications();
    
    // Listen for updates
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'contactSubmissions' || e.key === 'contentSubmissions') {
        loadNotifications();
      }
    };
    
    const handleCustomUpdate = () => {
      loadNotifications();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('contactUpdated', handleCustomUpdate);
    window.addEventListener('contentUpdated', handleCustomUpdate);
    
    // Refresh notifications every 10 seconds
    const interval = setInterval(loadNotifications, 10000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('contactUpdated', handleCustomUpdate);
      window.removeEventListener('contentUpdated', handleCustomUpdate);
      clearInterval(interval);
    };
  }, []);

  // Realistic, smoothed real-time data updates with persistence
  useEffect(() => {
    // Load persisted values first
    try {
      const saved = localStorage.getItem('adminRealTimeStats');
      if (saved) setRealTimeStats(JSON.parse(saved));
    } catch {}

    const interval = setInterval(() => {
      setRealTimeStats(prev => {
        const next = {
          ...prev,
          newSignupsToday: Math.max(0, prev.newSignupsToday + (Math.random() < 0.6 ? 1 : 0)),
          totalUsers: prev.totalUsers + (Math.random() < 0.7 ? 1 : 0),
          individualUsers: prev.individualUsers + (Math.random() < 0.65 ? 1 : 0),
          organizationUsers: prev.organizationUsers + (Math.random() < 0.35 ? 1 : 0),
          currentEarnings: {
            ...prev.currentEarnings,
            // small drift +/- up to 2
            daily: Math.max(0, parseFloat((prev.currentEarnings.daily + (Math.random() * 4 - 2)).toFixed(2)))
          }
        };
        localStorage.setItem('adminRealTimeStats', JSON.stringify(next));
        return next;
      });
    }, 30000); // update every 30s

    return () => clearInterval(interval);
  }, []);


  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'admins', label: 'Admin Management', icon: Shield },
    { id: 'api-requests', label: 'API Requests', icon: Building },
    { id: 'feed-sources', label: 'Feed Sources', icon: Rss },
    { id: 'content-inbox', label: 'Content Inbox', icon: FileText, badge: notifications.contentPending },
    { id: 'contact-inbox', label: 'Contact Inbox', icon: Mail, badge: notifications.contactUnread },
    { id: 'financials', label: 'Financials', icon: DollarSign },
    { id: 'api-management', label: 'API Management', icon: Database },
    { id: 'content-oversight', label: 'Content Oversight', icon: Eye },
    { id: 'system-status', label: 'System Status', icon: Activity },
    { id: 'ai-engines', label: 'AI Engine Management', icon: Zap },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const totalNotifications = Object.values(notifications).reduce((sum, count) => sum + count, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              </div>
              {totalNotifications > 0 && (
                <Badge className="bg-red-500 text-white">
                  {totalNotifications} alerts
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>System Healthy</span>
                </div>
                <span>•</span>
                <span>{realTimeStats.newSignupsToday} new signups today</span>
              </div>
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
                {totalNotifications > 0 && (
                  <Badge className="ml-2 bg-red-500 text-white text-xs">
                    {totalNotifications}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
            <Card>
              <CardContent className="p-0">
                <nav className="space-y-1 p-4">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          isActive
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="h-5 w-5" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && item.badge > 0 && (
                          <Badge className="bg-red-500 text-white text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {activeTab === 'overview' && <DashboardOverview stats={realTimeStats} />}
            {activeTab === 'users' && <UserManagement />}
            {activeTab === 'admins' && <AdminInvitation />}
            {activeTab === 'api-requests' && <ApiAccessRequests />}
            {activeTab === 'feed-sources' && <CustomFeedManager />}
            {activeTab === 'content-inbox' && <ContentSubmissions />}
            {activeTab === 'contact-inbox' && <ContactInbox />}
            {activeTab === 'financials' && <FinancialReports stats={realTimeStats} />}
            {activeTab === 'api-management' && <ApiManagement />}
            {activeTab === 'content-oversight' && <ContentOversight />}
            {activeTab === 'system-status' && <SystemStatus />}
            {activeTab === 'ai-engines' && (
              <div className="space-y-6">
                <AIEnginePanel />
                <TrainingSystem />
              </div>
            )}
            {activeTab === 'settings' && <SystemSettings />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
