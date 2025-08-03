import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  UserPlus, 
  UserMinus, 
  Building, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Activity,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

interface DashboardOverviewProps {
  stats: {
    totalUsers: number;
    individualUsers: number;
    organizationUsers: number;
    newSignupsToday: number;
    weeklyGrowth: number;
    monthlyGrowth: number;
    closedAccountsToday: number;
    closedAccountsWeekly: number;
    activeApiSubscriptions: number;
    currentEarnings: {
      daily: number;
      weekly: number;
      monthly: number;
      yearly: number;
    };
  };
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ stats }) => {
  const [chartData, setChartData] = useState({
    userGrowthData: [
      { month: 'Jan', users: 85, signups: 15 },
      { month: 'Feb', users: 92, signups: 18 },
      { month: 'Mar', users: 101, signups: 22 },
      { month: 'Apr', users: 108, signups: 19 },
      { month: 'May', users: 115, signups: 24 },
      { month: 'Jun', users: stats.totalUsers, signups: stats.newSignupsToday }
    ],
    subscriptionData: [
      { name: 'Free', value: 85, color: '#94A3B8' },
      { name: 'Pro', value: 28, color: '#3B82F6' },
      { name: 'Elite', value: 8, color: '#8B5CF6' },
      { name: 'Institutional', value: 4, color: '#F59E0B' }
    ],
    revenueData: [
      { day: 'Mon', revenue: 124 },
      { day: 'Tue', revenue: 108 },
      { day: 'Wed', revenue: 142 },
      { day: 'Thu', revenue: 156 },
      { day: 'Fri', revenue: 139 },
      { day: 'Sat', revenue: 118 },
      { day: 'Sun', revenue: Math.round(stats.currentEarnings.daily) }
    ]
  });

  // Update chart data dynamically
  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(prev => ({
        ...prev,
        userGrowthData: prev.userGrowthData.map((item, index) => 
          index === prev.userGrowthData.length - 1 
            ? { ...item, users: stats.totalUsers, signups: stats.newSignupsToday }
            : item
        ),
        subscriptionData: prev.subscriptionData.map(tier => ({
          ...tier,
          value: tier.name === 'Free' 
            ? Math.round(stats.totalUsers * 0.68) // 68% free users
            : tier.name === 'Pro'
            ? Math.round(stats.totalUsers * 0.23) // 23% pro users
            : tier.name === 'Elite'
            ? Math.round(stats.totalUsers * 0.06) // 6% elite users
            : Math.round(stats.totalUsers * 0.03) // 3% institutional
        })),
        revenueData: prev.revenueData.map((item, index) =>
          index === prev.revenueData.length - 1
            ? { ...item, revenue: Math.round(stats.currentEarnings.daily) }
            : item
        )
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [stats]);

  return (
    <div className="space-y-6">
      {/* Key Performance Indicators - Updated with Euros */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Users size={16} />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalUsers}</div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                <TrendingUp size={12} className="mr-1" />
                +{stats.weeklyGrowth} this week
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <UserPlus size={16} />
              New Signups Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.newSignupsToday}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-gray-500">Monthly: +{stats.monthlyGrowth}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Building size={16} />
              API Subscriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.activeApiSubscriptions}</div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                <Activity size={12} className="mr-1" />
                Active Organizations
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <DollarSign size={16} />
              Daily Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">€{stats.currentEarnings.daily.toFixed(2)}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-gray-500">Monthly: €{stats.currentEarnings.monthly.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>User Growth Trend</CardTitle>
            <CardDescription>Monthly user acquisition and total users</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData.userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="users" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                <Line type="monotone" dataKey="signups" stroke="#10B981" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Subscription Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription Distribution</CardTitle>
            <CardDescription>Users by subscription tier</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData.subscriptionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {chartData.subscriptionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart - Updated with Euros */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Revenue Trend</CardTitle>
          <CardDescription>Daily revenue for the current week (€)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip formatter={(value) => [`€${value}`, 'Revenue']} />
              <Bar dataKey="revenue" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="text-green-500" size={20} />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>API Status</span>
                <Badge className="bg-green-100 text-green-700">Online</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Database</span>
                <Badge className="bg-green-100 text-green-700">Healthy</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Prediction Engine</span>
                <Badge className="bg-green-100 text-green-700">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="text-amber-500" size={20} />
              Alerts & Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm text-gray-600">New API requests: 3</div>
              <div className="text-sm text-gray-600">Payment issues: 1</div>
              <div className="text-sm text-gray-600">Content flags: 0</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <UserMinus className="text-red-500" size={20} />
              Account Closures
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Today</span>
                <span className="font-semibold text-red-600">{stats.closedAccountsToday}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">This Week</span>
                <span className="font-semibold text-red-600">{stats.closedAccountsWeekly}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
