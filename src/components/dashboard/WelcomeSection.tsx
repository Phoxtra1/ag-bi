
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Activity, CreditCard, Target, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCurrentUser } from '@/lib/auth';

const WelcomeSection = () => {
  const [user, setUser] = useState<any>(null);
  const [userStats, setUserStats] = useState({
    apiCalls: 0,
    predictionsMade: 0,
    toolsActive: 4,
    subscriptionStatus: 'inactive',
    subscriptionDays: 0
  });

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    fetchUser();

    // Load user stats from localStorage
    loadUserStats();

    // Simulate live updates for predictions if user is active
    const interval = setInterval(() => {
      updateUserStats();
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const loadUserStats = () => {
    try {
      // Load from localStorage or initialize defaults
      const savedStats = localStorage.getItem('userStats');
      if (savedStats) {
        const parsed = JSON.parse(savedStats);
        setUserStats(parsed);
      } else {
        // Initialize with default values
        const initialStats = {
          apiCalls: 0,
          predictionsMade: 0,
          toolsActive: 4,
          subscriptionStatus: 'inactive',
          subscriptionDays: 0
        };
        localStorage.setItem('userStats', JSON.stringify(initialStats));
        setUserStats(initialStats);
      }
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const updateUserStats = () => {
    setUserStats(prev => {
      // Simulate occasional activity for demonstration
      const shouldUpdate = Math.random() < 0.3; // 30% chance
      if (shouldUpdate) {
        const updated = {
          ...prev,
          // Occasionally increment predictions made
          predictionsMade: Math.random() < 0.1 ? prev.predictionsMade + 1 : prev.predictionsMade,
          // Decrement subscription days if active
          subscriptionDays: prev.subscriptionStatus === 'active' && prev.subscriptionDays > 0 
            ? prev.subscriptionDays - 1 
            : prev.subscriptionDays
        };
        
        // Update subscription status based on days remaining
        if (updated.subscriptionDays <= 0 && updated.subscriptionStatus === 'active') {
          updated.subscriptionStatus = 'inactive';
        }
        
        localStorage.setItem('userStats', JSON.stringify(updated));
        return updated;
      }
      return prev;
    });
  };

  // Function to increment API calls (called from other components)
  const incrementApiCall = () => {
    setUserStats(prev => {
      const updated = { ...prev, apiCalls: prev.apiCalls + 1 };
      localStorage.setItem('userStats', JSON.stringify(updated));
      return updated;
    });
  };

  // Function to add prediction (called when user makes predictions)
  const addPrediction = () => {
    setUserStats(prev => {
      const updated = { ...prev, predictionsMade: prev.predictionsMade + 1 };
      localStorage.setItem('userStats', JSON.stringify(updated));
      return updated;
    });
  };

  // Make functions available globally for other components
  useEffect(() => {
    (window as any).userStatsActions = { incrementApiCall, addPrediction };
  }, []);

  const userName = user?.name || 'User';

  const getSubscriptionDisplay = () => {
    if (userStats.subscriptionStatus === 'active') {
      return {
        status: 'Active',
        detail: userStats.subscriptionDays > 0 
          ? `Renews in ${userStats.subscriptionDays} days` 
          : 'Expired',
        color: userStats.subscriptionDays > 0 ? 'text-green-600' : 'text-red-600'
      };
    }
    return {
      status: 'Inactive',
      detail: 'Upgrade to activate',
      color: 'text-gray-600'
    };
  };

  const subscriptionInfo = getSubscriptionDisplay();

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
            <div className="text-2xl font-bold">{userStats.toolsActive}</div>
            <p className="text-xs text-muted-foreground">
              Available in your plan
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Predictions Made</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.predictionsMade}</div>
            <p className="text-xs text-muted-foreground">
              {userStats.predictionsMade === 0 
                ? 'Start making predictions' 
                : userStats.predictionsMade === 1 
                ? 'Great start!' 
                : 'Keep it up!'
              }
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My API Calls</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.apiCalls}</div>
            <p className="text-xs text-muted-foreground">
              {userStats.apiCalls === 0 ? 'No API calls made yet' : 'Total calls made'}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscription</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${subscriptionInfo.color}`}>
              {subscriptionInfo.status}
            </div>
            <p className="text-xs text-muted-foreground">
              {subscriptionInfo.detail}
            </p>
            {userStats.subscriptionStatus === 'inactive' && (
              <Button asChild size="sm" className="mt-2">
                <Link to="/pricing">Upgrade Plan</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upgrade notices for inactive features */}
      {userStats.subscriptionStatus === 'inactive' && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <div className="flex-1">
                <h3 className="font-medium text-orange-900">Upgrade Required</h3>
                <p className="text-sm text-orange-700">
                  Some features require an active subscription. Upgrade your plan to unlock full functionality.
                </p>
              </div>
              <Button asChild variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-100">
                <Link to="/pricing">View Plans</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WelcomeSection;
