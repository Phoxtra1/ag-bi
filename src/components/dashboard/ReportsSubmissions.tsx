
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Eye, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const ReportsSubmissions = () => {
  const reports = [
    {
      id: 1,
      title: 'Climate Impact Analysis Q1 2024',
      type: 'Prediction Report',
      status: 'Published',
      date: '2024-01-15',
      size: '2.4 MB'
    },
    {
      id: 2,
      title: 'Political Stability Forecast',
      type: 'Analysis',
      status: 'Under Review',
      date: '2024-01-12',
      size: '1.8 MB'
    },
    {
      id: 3,
      title: 'Economic Indicators Summary',
      type: 'Data Submission',
      status: 'Verified',
      date: '2024-01-10',
      size: '956 KB'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'published':
      case 'verified':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'under review':
        return <Clock className="w-4 h-4 text-yellow-500" />;
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
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Reports & Submissions
        </CardTitle>
        <CardDescription>
          Access your submitted reports and predictions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {reports.map((report) => (
            <div key={report.id} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">{report.title}</h4>
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
        
        <div className="mt-4 pt-4 border-t">
          <Button className="w-full">
            <FileText className="w-4 h-4 mr-2" />
            Submit New Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportsSubmissions;
