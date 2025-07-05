
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
  Building2, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye,
  Download,
  FileText,
  MessageSquare,
  BarChart3,
  Filter,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ApiAccessRequest {
  id: string;
  fullName: string;
  email: string;
  organizationName: string;
  sector: 'Academic' | 'Media' | 'Government' | 'Research' | 'Civil' | 'Other';
  intendedUse: string;
  verificationDocument?: {
    name: string;
    type: string;
    url: string;
  };
  submissionDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'more-info-needed';
  adminNotes?: string;
}

const ApiAccessRequests = () => {
  const [requests, setRequests] = useState<ApiAccessRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ApiAccessRequest | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [adminNotes, setAdminNotes] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    try {
      const stored = localStorage.getItem('apiAccessRequests');
      if (stored) {
        setRequests(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load API access requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateRequestStatus = (id: string, newStatus: ApiAccessRequest['status'], notes?: string) => {
    const updated = requests.map(req => 
      req.id === id ? { ...req, status: newStatus, adminNotes: notes || req.adminNotes } : req
    );
    setRequests(updated);
    localStorage.setItem('apiAccessRequests', JSON.stringify(updated));
    
    toast({
      title: `Request ${newStatus}`,
      description: `API access request has been ${newStatus}.`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-700">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700">Rejected</Badge>;
      case 'more-info-needed':
        return <Badge className="bg-orange-100 text-orange-700">More Info Needed</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>;
    }
  };

  const getSectorIcon = (sector: string) => {
    return <Building2 size={16} className="text-blue-600" />;
  };

  const exportToCSV = () => {
    const headers = ['Full Name', 'Email', 'Organization', 'Sector', 'Status', 'Submission Date'];
    const csvContent = [
      headers.join(','),
      ...requests.map(req => [
        req.fullName,
        req.email,
        req.organizationName,
        req.sector,
        req.status,
        new Date(req.submissionDate).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'api-access-requests.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export successful",
      description: "API access requests exported to CSV.",
    });
  };

  const filteredRequests = requests.filter(req => {
    if (activeTab === 'all') return true;
    return req.status === activeTab;
  });

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
    moreInfoNeeded: requests.filter(r => r.status === 'more-info-needed').length
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <div className="grid grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">More Info</p>
                <p className="text-2xl font-bold text-orange-600">{stats.moreInfoNeeded}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-6 h-6 text-blue-600" />
                API Access Requests
                {stats.pending > 0 && (
                  <Badge className="bg-red-500 text-white ml-2">{stats.pending}</Badge>
                )}
              </CardTitle>
              <CardDescription>
                Manage institutional API access requests and approvals
              </CardDescription>
            </div>
            <Button onClick={exportToCSV} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
              <TabsTrigger value="approved">Approved ({stats.approved})</TabsTrigger>
              <TabsTrigger value="rejected">Rejected ({stats.rejected})</TabsTrigger>
              <TabsTrigger value="more-info-needed">More Info ({stats.moreInfoNeeded})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {filteredRequests.length === 0 ? (
                <div className="text-center py-8">
                  <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">No API access requests found</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Organization</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Sector</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{request.organizationName}</p>
                            <p className="text-sm text-gray-500">{request.fullName}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">{request.email}</p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getSectorIcon(request.sector)}
                            <span>{request.sector}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Clock size={12} />
                            {new Date(request.submissionDate).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(request.status)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedRequest(request);
                                    setAdminNotes(request.adminNotes || '');
                                  }}
                                >
                                  <Eye size={14} />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>API Access Request Details</DialogTitle>
                                  <DialogDescription>
                                    Review and manage this API access request
                                  </DialogDescription>
                                </DialogHeader>
                                
                                {selectedRequest && (
                                  <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                          Full Name
                                        </label>
                                        <p className="text-sm bg-gray-50 p-2 rounded">{selectedRequest.fullName}</p>
                                      </div>
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                          Email
                                        </label>
                                        <p className="text-sm bg-gray-50 p-2 rounded">{selectedRequest.email}</p>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                          Organization
                                        </label>
                                        <p className="text-sm bg-gray-50 p-2 rounded">{selectedRequest.organizationName}</p>
                                      </div>
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                          Sector
                                        </label>
                                        <p className="text-sm bg-gray-50 p-2 rounded">{selectedRequest.sector}</p>
                                      </div>
                                    </div>

                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Intended Use of API
                                      </label>
                                      <p className="text-sm bg-gray-50 p-3 rounded whitespace-pre-wrap">{selectedRequest.intendedUse}</p>
                                    </div>

                                    {selectedRequest.verificationDocument && (
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                          Verification Document
                                        </label>
                                        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                          <FileText size={16} />
                                          <span className="text-sm">{selectedRequest.verificationDocument.name}</span>
                                          <Button size="sm" variant="outline">
                                            <Download size={12} className="mr-1" />
                                            Download
                                          </Button>
                                        </div>
                                      </div>
                                    )}

                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Admin Notes (Internal)
                                      </label>
                                      <Textarea
                                        value={adminNotes}
                                        onChange={(e) => setAdminNotes(e.target.value)}
                                        placeholder="Add internal notes about this request..."
                                        rows={3}
                                      />
                                    </div>

                                    <div className="flex gap-2 pt-4 border-t">
                                      {selectedRequest.status === 'pending' && (
                                        <>
                                          <Button
                                            onClick={() => {
                                              updateRequestStatus(selectedRequest.id, 'approved', adminNotes);
                                              setSelectedRequest(null);
                                            }}
                                            className="bg-green-600 hover:bg-green-700"
                                          >
                                            <CheckCircle size={16} className="mr-2" />
                                            Approve
                                          </Button>
                                          <Button
                                            onClick={() => {
                                              updateRequestStatus(selectedRequest.id, 'rejected', adminNotes);
                                              setSelectedRequest(null);
                                            }}
                                            variant="destructive"
                                          >
                                            <XCircle size={16} className="mr-2" />
                                            Reject
                                          </Button>
                                          <Button
                                            onClick={() => {
                                              updateRequestStatus(selectedRequest.id, 'more-info-needed', adminNotes);
                                              setSelectedRequest(null);
                                            }}
                                            variant="outline"
                                          >
                                            <MessageSquare size={16} className="mr-2" />
                                            Request More Info
                                          </Button>
                                        </>
                                      )}
                                      <Button
                                        onClick={() => {
                                          updateRequestStatus(selectedRequest.id, selectedRequest.status, adminNotes);
                                          setSelectedRequest(null);
                                        }}
                                        variant="outline"
                                      >
                                        Save Notes
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiAccessRequests;
