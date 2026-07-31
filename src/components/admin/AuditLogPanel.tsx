import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  Shield,
  LogIn,
  LogOut,
  Settings,
  UserPlus,
  UserMinus,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { databases, DATABASE_ID } from '@/lib/database';
import { Query } from 'appwrite';

export interface AuditLogEntry {
  $id: string;
  $createdAt: string;
  action_type: string;
  action_category: 'auth' | 'role' | 'config' | 'content' | 'system' | 'api';
  user_id: string;
  user_email: string;
  target_id?: string;
  target_type?: string;
  details: string;
  ip_address?: string;
  user_agent?: string;
  status: 'success' | 'failed' | 'warning';
}

const AUDIT_LOGS_COLLECTION = 'audit_logs';

const actionIcons: Record<string, React.ReactNode> = {
  login: <LogIn className="h-4 w-4" />,
  logout: <LogOut className="h-4 w-4" />,
  role_change: <Shield className="h-4 w-4" />,
  user_create: <UserPlus className="h-4 w-4" />,
  user_delete: <UserMinus className="h-4 w-4" />,
  config_update: <Settings className="h-4 w-4" />,
  content_edit: <Edit className="h-4 w-4" />,
  content_delete: <Trash2 className="h-4 w-4" />,
  view: <Eye className="h-4 w-4" />,
};

const categoryColors: Record<string, string> = {
  auth: 'bg-blue-100 text-blue-800',
  role: 'bg-purple-100 text-purple-800',
  config: 'bg-amber-100 text-amber-800',
  content: 'bg-green-100 text-green-800',
  system: 'bg-gray-100 text-gray-800',
  api: 'bg-cyan-100 text-cyan-800',
};

const statusIcons: Record<string, React.ReactNode> = {
  success: <CheckCircle className="h-4 w-4 text-green-500" />,
  failed: <AlertTriangle className="h-4 w-4 text-red-500" />,
  warning: <Clock className="h-4 w-4 text-amber-500" />,
};

const AuditLogPanel: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('7d');

  useEffect(() => {
    fetchLogs();
  }, [categoryFilter, statusFilter, dateRange]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const queries: any[] = [Query.orderDesc('$createdAt'), Query.limit(100)];
      
      if (categoryFilter !== 'all') {
        queries.push(Query.equal('action_category', categoryFilter));
      }
      
      if (statusFilter !== 'all') {
        queries.push(Query.equal('status', statusFilter));
      }

      // Date range filter
      const now = new Date();
      let startDate: Date;
      switch (dateRange) {
        case '24h':
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case '7d':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      }
      queries.push(Query.greaterThan('$createdAt', startDate.toISOString()));

      const response = await databases.listDocuments(
        DATABASE_ID,
        AUDIT_LOGS_COLLECTION,
        queries
      );
      
      setLogs(response.documents as unknown as AuditLogEntry[]);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      // Show demo data if collection doesn't exist
      setLogs(getDemoLogs());
    } finally {
      setLoading(false);
    }
  };

  const getDemoLogs = (): AuditLogEntry[] => [
    {
      $id: '1',
      $createdAt: new Date().toISOString(),
      action_type: 'login',
      action_category: 'auth',
      user_id: 'admin-001',
      user_email: 'admin@amniva.com',
      details: 'Admin logged in successfully',
      status: 'success'
    },
    {
      $id: '2',
      $createdAt: new Date(Date.now() - 3600000).toISOString(),
      action_type: 'role_change',
      action_category: 'role',
      user_id: 'admin-001',
      user_email: 'admin@amniva.com',
      target_id: 'user-123',
      target_type: 'user',
      details: 'Changed user role from "user" to "moderator"',
      status: 'success'
    },
    {
      $id: '3',
      $createdAt: new Date(Date.now() - 7200000).toISOString(),
      action_type: 'config_update',
      action_category: 'config',
      user_id: 'admin-001',
      user_email: 'admin@amniva.com',
      target_id: 'dipa_chatbot',
      target_type: 'engine',
      details: 'Updated Dipa temperature setting to 0.7',
      status: 'success'
    },
    {
      $id: '4',
      $createdAt: new Date(Date.now() - 10800000).toISOString(),
      action_type: 'login',
      action_category: 'auth',
      user_id: 'unknown',
      user_email: 'hacker@bad.com',
      details: 'Failed login attempt - invalid credentials',
      status: 'failed'
    },
  ];

  const filteredLogs = logs.filter(log => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      log.user_email.toLowerCase().includes(query) ||
      log.action_type.toLowerCase().includes(query) ||
      log.details.toLowerCase().includes(query)
    );
  });

  const exportLogs = () => {
    const csv = [
      ['Timestamp', 'Category', 'Action', 'User', 'Details', 'Status'].join(','),
      ...filteredLogs.map(log => [
        new Date(log.$createdAt).toISOString(),
        log.action_category,
        log.action_type,
        log.user_email,
        `"${log.details.replace(/"/g, '""')}"`,
        log.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Audit Log
            </CardTitle>
            <CardDescription>
              Track all admin actions including logins, role changes, and configuration updates
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchLogs}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={exportLogs}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[150px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="auth">Authentication</SelectItem>
              <SelectItem value="role">Role Changes</SelectItem>
              <SelectItem value="config">Configuration</SelectItem>
              <SelectItem value="content">Content</SelectItem>
              <SelectItem value="system">System</SelectItem>
              <SelectItem value="api">API</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Total Actions</div>
            <div className="text-2xl font-bold">{filteredLogs.length}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Successful</div>
            <div className="text-2xl font-bold text-green-600">
              {filteredLogs.filter(l => l.status === 'success').length}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Failed</div>
            <div className="text-2xl font-bold text-red-600">
              {filteredLogs.filter(l => l.status === 'failed').length}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Auth Events</div>
            <div className="text-2xl font-bold text-blue-600">
              {filteredLogs.filter(l => l.action_category === 'auth').length}
            </div>
          </Card>
        </div>

        {/* Logs Table */}
        <ScrollArea className="h-[500px]">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Timestamp</TableHead>
                  <TableHead className="w-[100px]">Category</TableHead>
                  <TableHead className="w-[120px]">Action</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead className="w-[80px]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No audit logs found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log) => (
                    <TableRow key={log.$id}>
                      <TableCell className="font-mono text-xs">
                        {formatDate(log.$createdAt)}
                      </TableCell>
                      <TableCell>
                        <Badge className={categoryColors[log.action_category] || 'bg-gray-100'}>
                          {log.action_category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {actionIcons[log.action_type] || <Eye className="h-4 w-4" />}
                          <span className="text-sm">{log.action_type.replace('_', ' ')}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{log.user_email}</TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[300px] truncate">
                        {log.details}
                      </TableCell>
                      <TableCell>{statusIcons[log.status]}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AuditLogPanel;
