import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Eye,
  Flag,
  Search,
  Filter,
  MessageSquare,
  FileText
} from 'lucide-react';

const ContentOversight = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock content data
  const contentItems = [
    {
      id: 1,
      type: 'Prediction',
      title: 'Climate Change Impact on Agriculture 2024',
      author: 'AI Engine',
      status: 'Approved',
      flagCount: 0,
      createdDate: '2024-01-20',
      lastReviewed: '2024-01-20'
    },
    {
      id: 2,
      type: 'News Analysis',
      title: 'Political Tensions Rise in Eastern Europe',
      author: 'AI Engine',
      status: 'Under Review',
      flagCount: 2,
      createdDate: '2024-01-20',
      lastReviewed: null
    },
    {
      id: 3,
      type: 'User Report',
      title: 'Misinformation about vaccine effectiveness',
      author: 'user@example.com',
      status: 'Flagged',
      flagCount: 15,
      createdDate: '2024-01-19',
      lastReviewed: null
    },
    {
      id: 4,
      type: 'Trending Topic',
      title: 'Economic Forecast Q2 2024',
      author: 'AI Engine',
      status: 'Published',
      flagCount: 1,
      createdDate: '2024-01-18',
      lastReviewed: '2024-01-19'
    }
  ];

  const flaggedContent = [
    {
      id: 1,
      content: 'Controversial political statement requiring review',
      reason: 'Potentially biased content',
      reportedBy: 'multiple users',
      severity: 'High',
      date: '2024-01-20'
    },
    {
      id: 2,
      content: 'Prediction about market crash may cause panic',
      reason: 'Alarmist language',
      reportedBy: 'user@domain.com',
      severity: 'Medium',
      date: '2024-01-19'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
      case 'Published':
        return 'bg-green-100 text-green-700';
      case 'Under Review':
        return 'bg-yellow-100 text-yellow-700';
      case 'Flagged':
        return 'bg-red-100 text-red-700';
      case 'Rejected':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'High':
        return 'bg-red-100 text-red-700';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'Low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Content Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Content</p>
                <p className="text-2xl font-bold">1,247</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold">23</p>
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
                <p className="text-sm text-gray-600">Flagged Content</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <Flag className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Auto-Approved</p>
                <p className="text-2xl font-bold">1,189</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Flagged Content Priority */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flag size={20} />
            High Priority Flagged Content
          </CardTitle>
          <CardDescription>Content requiring immediate attention</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Content Preview</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Reported By</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {flaggedContent.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="max-w-xs">
                    <p className="truncate text-sm">{item.content}</p>
                  </TableCell>
                  <TableCell>{item.reason}</TableCell>
                  <TableCell>{item.reportedBy}</TableCell>
                  <TableCell>
                    <Badge className={getSeverityBadge(item.severity)}>
                      {item.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* All Content Management */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Content Management</CardTitle>
              <CardDescription>Review and moderate all platform content</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Under Review">Under Review</SelectItem>
                <SelectItem value="Flagged">Flagged</SelectItem>
                <SelectItem value="Published">Published</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter size={16} />
              More Filters
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Flags</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contentItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Badge variant="outline">{item.type}</Badge>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="truncate font-medium">{item.title}</p>
                  </TableCell>
                  <TableCell>{item.author}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(item.status)}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {item.flagCount > 0 ? (
                      <Badge variant="destructive">{item.flagCount}</Badge>
                    ) : (
                      <span className="text-gray-400">0</span>
                    )}
                  </TableCell>
                  <TableCell>{item.createdDate}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-4 w-4" />
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

export default ContentOversight;
