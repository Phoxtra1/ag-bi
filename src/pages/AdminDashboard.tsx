import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Activity, 
  Settings, 
  Shield, 
  Bell,
  BarChart3,
  PieChart,
  LineChart,
  UserPlus,
  UserMinus,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import DashboardOverview from '@/components/admin/DashboardOverview';
import UserManagement from '@/components/admin/UserManagement';
import FinancialReports from '@/components/admin/FinancialReports';
import ApiManagement from '@/components/admin/ApiManagement';
import SystemSettings from '@/components/admin/SystemSettings';
import ContentOversight from '@/components/admin/ContentOversight';
import AdminInvitation from '@/components/admin/AdminInvitation';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock real-time data - in production, this would come from your backend
  const realTimeStats = {
    totalUsers: 12547,
    individualUsers: 11892,
    organizationUsers: 655,
    newSignupsToday: 47,
    weeklyGrowth: 312,
    monthlyGrowth: 1240,
    closedAccountsToday: 3,
    closedAccountsWeekly: 18,
    activeApiSubscriptions: 89,
    currentEarnings: {
      daily: 2847.50,
      weekly: 18632.75,
      monthly: 76543.20,
      yearly: 892150.00
    }
  };

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'admins', label: 'Admin Management', icon: Shield },
    { id: 'financials', label: 'Financials', icon: DollarSign },
    { id: 'api', label: 'API Access', icon: Settings },
    { id: 'content', label: 'Content', icon: Shield },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-white shadow-lg h-screen sticky top-0">
          <div className="p-6 border-b">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#1D4ED8] rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#1D4ED8]">Admin Panel</h1>
                <p className="text-sm text-gray-500">Amnova™ Control</p>
              </div>
            </div>
          </div>
          
          <nav className="p-4">
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === item.id
                        ? 'bg-[#1D4ED8] text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={20} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Quick Stats in Sidebar */}
          <div className="p-4 border-t mt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Live Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Users</span>
                <span className="font-semibold text-green-600">{realTimeStats.totalUsers.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">New Today</span>
                <Badge variant="secondary">+{realTimeStats.newSignupsToday}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">API Active</span>
                <span className="font-semibold text-blue-600">{realTimeStats.activeApiSubscriptions}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {navigationItems.find(item => item.id === activeTab)?.label} Dashboard
            </h1>
            <p className="text-gray-600">
              Real-time platform management and insights
            </p>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && <DashboardOverview stats={realTimeStats} />}
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'admins' && <AdminInvitation />}
          {activeTab === 'financials' && <FinancialReports stats={realTimeStats} />}
          {activeTab === 'api' && <ApiManagement />}
          {activeTab === 'content' && <ContentOversight />}
          {activeTab === 'settings' && <SystemSettings />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
