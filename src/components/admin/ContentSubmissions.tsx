import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Video, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { listContentSubmissions, updateContentSubmissionStatus, deleteContentSubmission } from '@/lib/contentSubmissions';

interface ContentSubmission {
  id: string;
  title: string;
  link?: string;
  type: 'article' | 'video' | 'message' | 'other';
  content?: string;
  submissionTime: string;
  status: 'pending' | 'approved' | 'rejected';
  submitterName: string;
  submitterEmail: string;
}

const ContentSubmissions = () => {
  const [submissions, setSubmissions] = useState<ContentSubmission[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    setIsLoading(true);
    try {
      const docs: any[] = await listContentSubmissions();
      const mapped = docs.map((d) => ({
        id: d.$id,
        title: d.title,
        link: d.link || '',
        type: d.type,
        content: d.content || '',
        submissionTime: d.submissionTime || d.$createdAt,
        status: d.status || 'pending',
        submitterName: d.submitterName,
        submitterEmail: d.submitterEmail,
      })) as ContentSubmission[];
      setSubmissions(mapped);
    } catch (e) {
      console.error('Failed to load submissions:', e);
      setSubmissions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSubmissionStatus = async (id: string, newStatus: 'approved' | 'rejected') => {
    try {
      await updateContentSubmissionStatus(id, newStatus);
      await loadSubmissions();
      toast({ title: `Submission ${newStatus}`, description: `Content has been ${newStatus} successfully.` });
    } catch (e) {
      toast({ title: 'Failed to update', variant: 'destructive' });
    }
  };

  const deleteSubmission = async (id: string) => {
    try {
      await deleteContentSubmission(id);
      await loadSubmissions();
      toast({ title: 'Submission deleted', description: 'Content submission has been removed.' });
    } catch (e) {
      toast({ title: 'Failed to delete', variant: 'destructive' });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-700">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article':
        return <FileText size={16} className="text-blue-600" />;
      case 'video':
        return <Video size={16} className="text-purple-600" />;
      case 'message':
        return <MessageSquare size={16} className="text-green-600" />;
      default:
        return <FileText size={16} className="text-gray-600" />;
    }
  };

  const filteredSubmissions = submissions.filter(sub => {
    if (activeTab === 'all') return true;
    return sub.status === activeTab;
  });

  const pendingCount = submissions.filter(sub => sub.status === 'pending').length;

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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            Content Inbox
            {pendingCount > 0 && (
              <Badge className="bg-red-500 text-white ml-2">{pendingCount}</Badge>
            )}
          </CardTitle>
          <CardDescription>
            Manage user-submitted content including articles, videos, and messages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All ({submissions.length})</TabsTrigger>
              <TabsTrigger value="pending">
                Pending ({submissions.filter(s => s.status === 'pending').length})
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved ({submissions.filter(s => s.status === 'approved').length})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected ({submissions.filter(s => s.status === 'rejected').length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {filteredSubmissions.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">No submissions found</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Submitter</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubmissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTypeIcon(submission.type)}
                            <span className="capitalize">{submission.type}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{submission.title}</p>
                            {submission.link && (
                              <a 
                                href={submission.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                              >
                                View Link <ExternalLink size={12} />
                              </a>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{submission.submitterName}</p>
                            <p className="text-sm text-gray-500">{submission.submitterEmail}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Clock size={12} />
                            {new Date(submission.submissionTime).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(submission.status)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {submission.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateSubmissionStatus(submission.id, 'approved')}
                                  className="text-green-600 hover:bg-green-50"
                                >
                                  <CheckCircle size={14} />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateSubmissionStatus(submission.id, 'rejected')}
                                  className="text-red-600 hover:bg-red-50"
                                >
                                  <XCircle size={14} />
                                </Button>
                              </>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteSubmission(submission.id)}
                              className="text-red-600 hover:bg-red-50"
                            >
                              <Trash2 size={14} />
                            </Button>
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

export default ContentSubmissions;
