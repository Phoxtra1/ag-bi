
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Activity, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCurrentUser } from '@/lib/auth';

const WelcomeSection = () => {
  const [user, setUser] = useState<any>(null);
  const [userApiCalls, setUserApiCalls] = useState(0);
  const [subscriptionDays, setSubscriptionDays] = useState(23);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    fetchUser();

    // Simulate countdown for subscription days
    const interval = setInterval(() => {
      setSubscriptionDays(prev => {
        if (prev > 0) {
          return prev - 1;
        }
        return 0;
      });
    }, 86400000); // Update every 24 hours

    return () => clearInterval(interval);
  }, []);

  const userName = user?.name || 'User';

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Akwaaba {userName}!</h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your Amniva account today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tools</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Predictions Made</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              +12% from last week
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My API Calls</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userApiCalls}</div>
            <p className="text-xs text-muted-foreground">
              {userApiCalls === 0 ? 'No API calls made yet' : 'Total calls made'}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscription</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground">
              {subscriptionDays > 0 ? `Renews in ${subscriptionDays} days` : 'Expired'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WelcomeSection;
