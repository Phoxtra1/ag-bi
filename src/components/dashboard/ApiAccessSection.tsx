
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Key, 
  Copy, 
  RefreshCw, 
  BarChart3, 
  Shield, 
  FileText, 
  Settings,
  ExternalLink,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const ApiAccessSection = () => {
  const [apiKey, setApiKey] = useState('sk-amniva-1234567890abcdef...');
  const [isKeyVisible, setIsKeyVisible] = useState(false);

  // Mock user subscription status
  const hasInstitutionalPlan = true; // This would come from user's subscription data

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const generateNewKey = () => {
    const newKey = 'sk-amniva-' + Math.random().toString(36).substring(2, 15);
    setApiKey(newKey);
    alert('New API key generated!');
  };

  if (!hasInstitutionalPlan) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-6 h-6" />
            API Access
          </CardTitle>
          <CardDescription>
            Access Amniva's powerful API for institutional use
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">API Access Required</h3>
            <p className="text-gray-600 mb-6">
              Upgrade to an Institutional Plan to access our API and unlock advanced features for your organization.
            </p>
            <div className="space-y-3">
              <Button asChild className="w-full">
                <a href="/api-organizations">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Register Organization & Subscribe
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/pricing">View Pricing Plans</a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">API Management</h2>
          <p className="text-gray-600">Manage your API access, keys, and usage analytics</p>
        </div>
        <Badge className="bg-green-100 text-green-800">
          <CheckCircle className="w-4 h-4 mr-1" />
          Institutional Plan Active
        </Badge>
      </div>

      <Tabs defaultValue="keys" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="keys">API Keys</TabsTrigger>
          <TabsTrigger value="docs">Documentation</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
        </TabsList>
        
        <TabsContent value="keys" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                API Key Management
              </CardTitle>
              <CardDescription>
                Generate, manage, and revoke your API keys
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Active API Key
                </label>
                <div className="flex gap-2">
                  <Input
                    type={isKeyVisible ? 'text' : 'password'}
                    value={apiKey}
                    readOnly
                    className="font-mono"
                  />
                  <Button
                    variant="outline"
                    onClick={() => setIsKeyVisible(!isKeyVisible)}
                  >
                    {isKeyVisible ? 'Hide' : 'Show'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(apiKey)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Created: Jan 15, 2024 | Last used: 2 hours ago | Status: Active
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={generateNewKey} variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Generate New Key
                </Button>
                <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Revoke Key
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="docs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                API Documentation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Quick Start Guide</h3>
                  <p className="text-sm text-gray-600 mb-3">Get started with Amniva API in minutes</p>
                  <Button variant="outline" size="sm">View Guide</Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">API Reference</h3>
                  <p className="text-sm text-gray-600 mb-3">Complete API endpoint documentation</p>
                  <Button variant="outline" size="sm">View Reference</Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Code Examples</h3>
                  <p className="text-sm text-gray-600 mb-3">Sample code in Python, JavaScript, and more</p>
                  <Button variant="outline" size="sm">View Examples</Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">SDKs & Libraries</h3>
                  <p className="text-sm text-gray-600 mb-3">Download official client libraries</p>
                  <Button variant="outline" size="sm">Download SDKs</Button>
                </div>
              </div>
              
              <div className="bg-gray-900 text-white p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Example Request:</h4>
                <code className="text-sm">
                  curl -X GET "https://api.amniva.com/v1/predictions" \<br/>
                  &nbsp;&nbsp;-H "Authorization: Bearer {apiKey}" \<br/>
                  &nbsp;&nbsp;-H "Content-Type: application/json"
                </code>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total API Calls</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12,847</div>
                <p className="text-xs text-muted-foreground">+15% from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Quota Used</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">68%</div>
                <p className="text-xs text-muted-foreground">3,200 / 10,000 calls</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">99.2%</div>
                <p className="text-xs text-muted-foreground">Excellent performance</p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Usage Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-gray-500">
                <BarChart3 className="w-16 h-16 mr-4" />
                <span>Usage analytics chart would be displayed here</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">IP Whitelisting</h4>
                    <p className="text-sm text-gray-600">Restrict API access to specific IP addresses</p>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-600">Add extra security to your account</p>
                  </div>
                  <Button variant="outline" size="sm">Enable</Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Activity Logs</h4>
                    <p className="text-sm text-gray-600">Monitor API access and usage patterns</p>
                  </div>
                  <Button variant="outline" size="sm">View Logs</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="support" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Developer Support</CardTitle>
              <CardDescription>
                Get help with integration and troubleshooting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start h-auto p-4">
                  <div className="text-left">
                    <h4 className="font-medium">Contact Support</h4>
                    <p className="text-sm text-gray-600">Get help from our technical team</p>
                  </div>
                </Button>
                
                <Button variant="outline" className="justify-start h-auto p-4">
                  <div className="text-left">
                    <h4 className="font-medium">Developer Community</h4>
                    <p className="text-sm text-gray-600">Join our Slack workspace</p>
                  </div>
                </Button>
                
                <Button variant="outline" className="justify-start h-auto p-4">
                  <div className="text-left">
                    <h4 className="font-medium">Report Bug</h4>
                    <p className="text-sm text-gray-600">Found an issue? Let us know</p>
                  </div>
                </Button>
                
                <Button variant="outline" className="justify-start h-auto p-4">
                  <div className="text-left">
                    <h4 className="font-medium">Feature Request</h4>
                    <p className="text-sm text-gray-600">Suggest new API features</p>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApiAccessSection;
