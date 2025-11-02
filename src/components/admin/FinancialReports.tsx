import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  TrendingUp, 
  Download, 
  CreditCard,
  PieChart,
  BarChart3
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

interface FinancialReportsProps {
  stats: {
    currentEarnings: {
      daily: number;
      weekly: number;
      monthly: number;
      yearly: number;
    };
  };
}

const FinancialReports: React.FC<FinancialReportsProps> = ({ stats }) => {
  const [dynamicData, setDynamicData] = useState({
    subscriptionData: [
      { tier: 'Free', revenue: 0, users: 1 },
      { tier: 'Pro', revenue: 0, users: 0 },
      { tier: 'Elite', revenue: 0, users: 0 },
      { tier: 'Institutional', revenue: 0, users: 0 }
    ],
    monthlyRevenue: [
      { month: 'Jan', revenue: 0 },
      { month: 'Feb', revenue: 0 },
      { month: 'Mar', revenue: 0 },
      { month: 'Apr', revenue: 0 },
      { month: 'May', revenue: 0 },
      { month: 'Jun', revenue: 0 }
    ]
  });

  // Real data only - no dynamic updates for dummy data
  useEffect(() => {
    // TODO: Fetch real subscription and revenue data from database
    // For now, data is static and reflects actual state (1 free user, no revenue)
  }, []);

  const pieColors = ['#94A3B8', '#3B82F6', '#8B5CF6', '#F59E0B'];

  return (
    <div className="space-y-6">
      {/* Revenue Overview Cards - Updated with Euros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <DollarSign size={16} />
              Daily Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">€{stats.currentEarnings.daily.toFixed(2)}</div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                <TrendingUp size={12} className="mr-1" />
                +8.2%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Weekly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">€{stats.currentEarnings.weekly.toFixed(2)}</div>
            <div className="text-sm text-gray-500">7-day total</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">€{stats.currentEarnings.monthly.toFixed(2)}</div>
            <div className="text-sm text-gray-500">Current month</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Yearly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">€{stats.currentEarnings.yearly.toFixed(2)}</div>
            <div className="text-sm text-gray-500">YTD performance</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 size={20} />
              Monthly Revenue Trend
            </CardTitle>
            <CardDescription>Revenue performance over the last 6 months (€)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dynamicData.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`€${value}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue by Subscription Tier */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart size={20} />
              Revenue by Tier
            </CardTitle>
            <CardDescription>Subscription tier breakdown (€)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={dynamicData.subscriptionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="revenue"
                  label={({ tier, revenue }) => `${tier}: €${revenue}`}
                >
                  {dynamicData.subscriptionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`€${value}`, 'Revenue']} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Export Financial Reports</CardTitle>
          <CardDescription>Download detailed financial data for analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Download size={16} />
              Export PDF
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download size={16} />
              Export CSV
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download size={16} />
              Export Excel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payment Integration Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard size={20} />
            Payment Integration
          </CardTitle>
          <CardDescription>Stripe integration and payment processing status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Stripe Connection</span>
              <Badge className="bg-green-100 text-green-700">Connected</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Webhook Status</span>
              <Badge className="bg-green-100 text-green-700">Active</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Last Sync</span>
              <span className="text-sm text-gray-500">2 minutes ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialReports;
