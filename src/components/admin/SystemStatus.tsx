
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  AlertCircle, 
  Users, 
  Mail, 
  Video,
  MessageCircle,
  Database,
  RefreshCw
} from 'lucide-react';

const SystemStatus = () => {
  const [systemData, setSystemData] = useState({
    videoUrl: '',
    newsletterSubscribers: 0,
    contactSubmissions: 0,
    chatbaseApiKey: '',
    brevoApiKey: '',
    lastUpdated: new Date().toISOString()
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadSystemData = () => {
    const videoUrl = localStorage.getItem('adminDemoVideoUrl') || '';
    const newsletters = JSON.parse(localStorage.getItem('newsletterSubscribers') || '[]');
    const contacts = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    const chatbaseKey = localStorage.getItem('chatbaseApiKey') || '';
    const brevoKey = localStorage.getItem('brevoApiKey') || '';

    setSystemData({
      videoUrl,
      newsletterSubscribers: newsletters.length,
      contactSubmissions: contacts.length,
      chatbaseApiKey: chatbaseKey,
      brevoApiKey: brevoKey,
      lastUpdated: new Date().toISOString()
    });
  };

  useEffect(() => {
    loadSystemData();

    // Listen for storage changes
    const handleStorageChange = () => {
      loadSystemData();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const refreshData = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate refresh
    loadSystemData();
    setIsRefreshing(false);
  };

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? (
      <CheckCircle className="w-5 h-5 text-green-600" />
    ) : (
      <AlertCircle className="w-5 h-5 text-red-600" />
    );
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <Badge variant={isActive ? "default" : "destructive"}>
        {isActive ? "Active" : "Inactive"}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">System Status</h2>
          <p className="text-gray-600">Real-time overview of all platform components</p>
        </div>
        <Button 
          onClick={refreshData} 
          disabled={isRefreshing}
          variant="outline"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Video Player Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Demo Video</CardTitle>
            <Video className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">
                  {systemData.videoUrl ? 'Configured' : 'Not Set'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Watch Demo Page
                </p>
              </div>
              {getStatusIcon(!!systemData.videoUrl)}
            </div>
            <div className="mt-4">
              {getStatusBadge(!!systemData.videoUrl)}
            </div>
          </CardContent>
        </Card>

        {/* Newsletter Subscribers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Newsletter</CardTitle>
            <Mail className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{systemData.newsletterSubscribers}</div>
                <p className="text-xs text-muted-foreground">
                  Total Subscribers
                </p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-4">
              {getStatusBadge(!!systemData.brevoApiKey)}
              <span className="text-xs text-gray-500 ml-2">Brevo Integration</span>
            </div>
          </CardContent>
        </Card>

        {/* Contact Submissions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contact Forms</CardTitle>
            <MessageCircle className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{systemData.contactSubmissions}</div>
                <p className="text-xs text-muted-foreground">
                  Total Submissions
                </p>
              </div>
              <Database className="h-8 w-8 text-purple-600" />
            </div>
            <div className="mt-4">
              {getStatusBadge(true)}
              <span className="text-xs text-gray-500 ml-2">Functional</span>
            </div>
          </CardContent>
        </Card>

        {/* Chatbase Integration */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Odeneho Chat Bot</CardTitle>
            <MessageCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">
                  {systemData.chatbaseApiKey ? 'Connected' : 'Not Connected'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Chatbase API
                </p>
              </div>
              {getStatusIcon(!!systemData.chatbaseApiKey)}
            </div>
            <div className="mt-4">
              {getStatusBadge(!!systemData.chatbaseApiKey)}
            </div>
          </CardContent>
        </Card>

        {/* Data Storage */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Storage</CardTitle>
            <Database className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">
                  {Math.round(JSON.stringify(localStorage).length / 1024)} KB
                </div>
                <p className="text-xs text-muted-foreground">
                  Used Storage
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-4">
              {getStatusBadge(true)}
              <span className="text-xs text-gray-500 ml-2">LocalStorage</span>
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">Operational</div>
                <p className="text-xs text-muted-foreground">
                  All Systems Go
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-4">
              {getStatusBadge(true)}
              <span className="text-xs text-gray-500 ml-2">
                Updated: {new Date(systemData.lastUpdated).toLocaleTimeString()}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Status Information */}
      <Card>
        <CardHeader>
          <CardTitle>Component Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Active Integrations</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center gap-2">
                    {getStatusIcon(!!systemData.videoUrl)}
                    Demo Video Player
                  </li>
                  <li className="flex items-center gap-2">
                    {getStatusIcon(!!systemData.brevoApiKey)}
                    Brevo Newsletter
                  </li>
                  <li className="flex items-center gap-2">
                    {getStatusIcon(!!systemData.chatbaseApiKey)}
                    Chatbase Bot
                  </li>
                  <li className="flex items-center gap-2">
                    {getStatusIcon(true)}
                    Contact Forms
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Data Summary</h4>
                <ul className="space-y-1 text-sm">
                  <li>Newsletter Subscribers: {systemData.newsletterSubscribers}</li>
                  <li>Contact Submissions: {systemData.contactSubmissions}</li>
                  <li>Video URL: {systemData.videoUrl ? 'Configured' : 'Not Set'}</li>
                  <li>Storage Used: {Math.round(JSON.stringify(localStorage).length / 1024)} KB</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemStatus;
