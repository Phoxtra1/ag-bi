
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { 
  Key, 
  Settings, 
  Activity, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  Plus
} from 'lucide-react';

const ApiManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock API data
  const apiRequests = [
    {
      id: 1,
      organization: 'TechNews Corp',
      apiKey: 'ak_live_****8392',
      status: 'Active',
      requestsToday: 2847,
      monthlyLimit: 100000,
      lastUsed: '2 minutes ago',
      tier: 'Institutional'
    },
    {
      id: 2,
      organization: 'Research Institute',
      apiKey: 'ak_live_****1247',
      status: 'Active',
      requestsToday: 1523,
      monthlyLimit: 50000,
      lastUsed: '1 hour ago',
      tier: 'Elite'
    },
    {
      id: 3,
      organization: 'Global Media Ltd',
      apiKey: 'ak_live_****9876',
      status: 'Suspended',
      requestsToday: 0,
      monthlyLimit: 75000,
      lastUsed: '3 days ago',
      tier: 'Elite'
    }
  ];

  const pendingRequests = [
    {
      id: 1,
      organization: 'Climate Analytics Co',
      email: 'admin@climateanalytics.org',
      requestDate: '2024-01-20',
      documents: 'Verified',
      tier: 'Institutional'
    },
    {
      id: 2,
      organization: 'News Aggregator Inc',
      email: 'api@newsagg.com',
      requestDate: '2024-01-19',
      documents: 'Pending Review',
      tier: 'Elite'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-700';
      case 'Suspended':
        return 'bg-red-100 text-red-700';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getTierBadge = (tier: string) => {
    const colors = {
      Elite: 'bg-purple-100 text-purple-700',
      Institutional: 'bg-amber-100 text-amber-700'
    };
    return colors[tier as keyof typeof colors];
  };

  return (
    <div className="space-y-6">
      {/* API Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active API Keys</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Key className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Requests</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Requests Today</p>
                <p className="text-2xl font-bold">8,472</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rate Limit Violations</p>
                <p className="text-2xl font-bold">2</p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending API Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Pending API Access Requests</CardTitle>
          <CardDescription>Organizations waiting for API approval</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Request Date</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.organization}</TableCell>
                  <TableCell>{request.email}</TableCell>
                  <TableCell>{request.requestDate}</TableCell>
                  <TableCell>
                    <Badge variant={request.documents === 'Verified' ? 'default' : 'secondary'}>
                      {request.documents}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getTierBadge(request.tier)}>
                      {request.tier}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Active API Keys Management */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Active API Keys</CardTitle>
              <CardDescription>Manage organization API access and usage</CardDescription>
            </div>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              Generate New Key
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search organizations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization</TableHead>
                <TableHead>API Key</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Usage Today</TableHead>
                <TableHead>Monthly Limit</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiRequests.map((api) => (
                <TableRow key={api.id}>
                  <TableCell className="font-medium">{api.organization}</TableCell>
                  <TableCell className="font-mono text-sm">{api.apiKey}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(api.status)}>
                      {api.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{api.requestsToday.toLocaleString()}</TableCell>
                  <TableCell>{api.monthlyLimit.toLocaleString()}</TableCell>
                  <TableCell className="text-sm text-gray-500">{api.lastUsed}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className={api.status === 'Active' ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                      >
                        {api.status === 'Active' ? 'Suspend' : 'Activate'}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiManagement;
