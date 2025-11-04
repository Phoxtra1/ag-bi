import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { databases } from '@/lib/appwrite';
import { DATABASE_ID, CONTENT_SUBMISSIONS_COLLECTION_ID } from '@/lib/database';
import { Search, FileText, AlertTriangle, Flag } from 'lucide-react';

const ContentOversight = () => {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState<any[]>([]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await databases.listDocuments(DATABASE_ID, CONTENT_SUBMISSIONS_COLLECTION_ID);
      setItems(res.documents);
    } catch (e) {
      console.error('Failed to load content:', e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const stats = useMemo(() => {
    const total = items.length;
    const pending = items.filter(i => (i.status || 'pending') === 'pending').length;
    const flagged = items.filter(i => Boolean(i.flagged) || (i.flags || 0) > 0).length;
    return { total, pending, flagged };
  }, [items]);

  const filtered = items.filter(i => {
    const q = searchTerm.toLowerCase();
    return (
      (i.title || '').toLowerCase().includes(q) ||
      (i.submittedBy || i.email || '').toLowerCase().includes(q)
    );
  });

  const StatusBadge = ({ status }: { status: string }) => {
    const s = (status || 'pending').toLowerCase();
    if (s === 'approved' || s === 'published') return <Badge className="bg-green-100 text-green-700">Approved</Badge>;
    if (s === 'flagged') return <Badge className="bg-red-100 text-red-700">Flagged</Badge>;
    if (s === 'under review') return <Badge className="bg-amber-100 text-amber-700">Under Review</Badge>;
    return <Badge className="bg-amber-100 text-amber-700">Pending</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Stats (real) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Content</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg"><FileText className="w-6 h-6 text-primary" /></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
              <div className="p-2 bg-amber-100 rounded-lg"><AlertTriangle className="w-6 h-6 text-amber-600" /></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Flagged</p>
                <p className="text-2xl font-bold">{stats.flagged}</p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg"><Flag className="w-6 h-6 text-red-600" /></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Content Management</CardTitle>
          <CardDescription>Review and moderate user submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">Loading...</TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">No submissions yet</TableCell>
                </TableRow>
              ) : (
                filtered.slice(0, 25).map((i) => (
                  <TableRow key={i.$id}>
                    <TableCell className="font-medium">{i.title || 'Untitled'}</TableCell>
                    <TableCell>{i.submittedBy || i.email || '-'}</TableCell>
                    <TableCell><StatusBadge status={i.status} /></TableCell>
                    <TableCell>{new Date(i.$createdAt).toLocaleString()}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentOversight;
