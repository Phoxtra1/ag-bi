
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input'; 
import { Textarea } from '@/components/ui/textarea';
import { FileText, Download, Eye, Clock, CheckCircle, AlertCircle, Plus, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Report {
  id: number;
  title: string;
  type: string;
  status: string;
  date: string;
  size: string;
  description?: string;
}

const ReportsSubmissions = () => {
  const { toast } = useToast();
  const [reports, setReports] = useState<Report[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newReport, setNewReport] = useState({
    title: '',
    type: 'Analysis',
    description: ''
  });

  // Load reports from localStorage on component mount
  useEffect(() => {
    const savedReports = localStorage.getItem('userReports');
    if (savedReports) {
      setReports(JSON.parse(savedReports));
    } else {
      // Set default reports if none exist
      const defaultReports = [
        {
          id: 1,
          title: 'Climate Impact Analysis Q1 2024',
          type: 'Prediction Report',
          status: 'Published',
          date: '2024-01-15',
          size: '2.4 MB',
          description: 'Comprehensive analysis of climate change impacts and predictions for Q1 2024'
        },
        {
          id: 2,
          title: 'Political Stability Forecast',
          type: 'Analysis',
          status: 'Under Review',
          date: '2024-01-12',
          size: '1.8 MB',
          description: 'Political stability assessment and forecast for the next quarter'
        },
        {
          id: 3,
          title: 'Economic Indicators Summary',
          type: 'Data Submission',
          status: 'Verified',
          date: '2024-01-10',
          size: '956 KB',
          description: 'Summary of key economic indicators and their implications'
        }
      ];
      setReports(defaultReports);
      localStorage.setItem('userReports', JSON.stringify(defaultReports));
    }
  }, []);

  // Save reports to localStorage whenever reports change
  useEffect(() => {
    localStorage.setItem('userReports', JSON.stringify(reports));
  }, [reports]);

  const handleAddReport = () => {
    if (!newReport.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a report title.",
        variant: "destructive",
      });
      return;
    }

    const report: Report = {
      id: Date.now(),
      title: newReport.title,
      type: newReport.type,
      status: 'Draft',
      date: new Date().toISOString().split('T')[0],
      size: `${Math.floor(Math.random() * 3000) + 500} KB`,
      description: newReport.description
    };

    setReports(prev => [report, ...prev]);
    setNewReport({ title: '', type: 'Analysis', description: '' });
    setShowAddForm(false);

    toast({
      title: "Report Added",
      description: "Your report has been added successfully.",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'published':
      case 'verified':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'under review':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'draft':
        return <FileText className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'verified':
        return 'bg-blue-100 text-blue-800';
      case 'under review':
        return 'bg-yellow-100 text-yellow-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Reports & Submissions
            </CardTitle>
            <CardDescription>
              Access your submitted reports and predictions
            </CardDescription>
          </div>
          <Button 
            onClick={() => setShowAddForm(!showAddForm)}
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Report
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Report Form */}
        {showAddForm && (
          <div className="p-4 border rounded-lg bg-gray-50 space-y-4">
            <h4 className="font-medium">Add New Report</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Report Title</label>
                <Input
                  value={newReport.title}
                  onChange={(e) => setNewReport(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter report title"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Report Type</label>
                <select
                  value={newReport.type}
                  onChange={(e) => setNewReport(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md"
                >
                  <option value="Analysis">Analysis</option>
                  <option value="Prediction Report">Prediction Report</option>
                  <option value="Data Submission">Data Submission</option>
                  <option value="Research Paper">Research Paper</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description (Optional)</label>
              <Textarea
                value={newReport.description}
                onChange={(e) => setNewReport(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the report"
                rows={2}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddReport} size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save Report
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowAddForm(false)} 
                size="sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Reports List */}
        <div className="space-y-3">
          {reports.map((report) => (
            <div key={report.id} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">{report.title}</h4>
                  {report.description && (
                    <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                  )}
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{report.type}</Badge>
                    <Badge className={getStatusColor(report.status)}>
                      {getStatusIcon(report.status)}
                      <span className="ml-1">{report.status}</span>
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{report.date}</span>
                    <span>{report.size}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  View
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  Export PDF
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  Export CSV
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        {reports.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No reports found. Click "Add Report" to create your first report.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReportsSubmissions;
