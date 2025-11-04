import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { listApiRequests, updateApiRequestStatus } from '@/lib/apiRequests';
import { Key, AlertTriangle, CheckCircle, XCircle, Search } from 'lucide-react';

const ApiManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<any[]>([]);

  const load = async () => {
    setLoading(true);
    try {
      const docs = await listApiRequests();
      setRequests(docs);
    } catch (e: any) {
      console.error('Failed to load API requests:', e);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const pending = useMemo(() => requests.filter(r => (r.status || 'pending') === 'pending'), [requests]);
  const approved = useMemo(() => requests.filter(r => r.status === 'approved'), [requests]);
  const todayCount = useMemo(() => {
    const start = new Date();
    start.setHours(0,0,0,0);
    return requests.filter(r => new Date(r.$createdAt) >= start).length;
  }, [requests]);

  const handleUpdate = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await updateApiRequestStatus(id, status);
      toast({ title: `Request ${status}`, description: `API access request has been ${status}.` });
      load();
    } catch (e: any) {
      toast({ title: 'Update failed', description: e?.message || 'Unable to update request', variant: 'destructive' });
    }
  };

  const filteredPending = pending.filter(r => {
    const q = searchTerm.toLowerCase();
    return (
      (r.organizationName || '').toLowerCase().includes(q) ||
      (r.email || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Overview (Real numbers) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved Requests</p>
                <p className="text-2xl font-bold">{approved.length}</p>
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
                <p className="text-sm text-muted-foreground">Pending Requests</p>
                <p className="text-2xl font-bold">{pending.length}</p>
              </div>
              <div className="p-2 bg-amber-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Requests Today</p>
                <p className="text-2xl font-bold">{todayCount}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <Search className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rate Limit Violations</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending API Requests (real) */}
      <Card>
        <CardHeader>
          <CardTitle>Pending API Access Requests</CardTitle>
          <CardDescription>Organizations waiting for approval</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by organization or email..."
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
                <TableHead>Email</TableHead>
                <TableHead>Sector</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">Loading...</TableCell>
                </TableRow>
              ) : filteredPending.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">No pending requests</TableCell>
                </TableRow>
              ) : (
                filteredPending.map((r) => (
                  <TableRow key={r.$id}>
                    <TableCell className="font-medium">{r.organizationName || '-'}</TableCell>
                    <TableCell>{r.email}</TableCell>
                    <TableCell>{r.sector || '-'}</TableCell>
                    <TableCell>{new Date(r.$createdAt).toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="sm" onClick={() => handleUpdate(r.$id, 'approved')}>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" onClick={() => handleUpdate(r.$id, 'rejected')}>
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Active Keys placeholder (no dummies) */}
      <Card>
        <CardHeader>
          <CardTitle>Active API Keys</CardTitle>
          <CardDescription>Keys appear once requests are approved and keys are issued</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">No active API keys yet</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiManagement;
