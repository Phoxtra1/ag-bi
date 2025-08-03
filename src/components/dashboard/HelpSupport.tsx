
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  HelpCircle, 
  MessageSquare, 
  FileText, 
  Video, 
  Mail,
  Phone,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const HelpSupport = () => {
  const supportOptions = [
    {
      icon: MessageSquare,
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      availability: 'Available 24/7',
      badge: 'Fastest',
      action: 'Start Chat',
      color: 'bg-green-100 text-green-800'
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Send us a detailed message about your issue',
      availability: 'Response within 24 hours',
      badge: 'Detailed',
      action: 'Send Email',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Speak directly with our technical experts',
      availability: 'Mon-Fri, 9AM-6PM UTC',
      badge: 'Premium',
      action: 'Call Now',
      color: 'bg-purple-100 text-purple-800'
    }
  ];

  const helpResources = [
    {
      icon: FileText,
      title: 'Documentation',
      description: 'Comprehensive guides and API references',
      items: ['Getting Started Guide', 'API Documentation', 'Best Practices', 'Troubleshooting']
    },
    {
      icon: Video,
      title: 'Video Tutorials',
      description: 'Step-by-step video guides',
      items: ['Platform Overview', 'API Integration', 'Advanced Features', 'Use Cases']
    },
    {
      icon: HelpCircle,
      title: 'FAQ',
      description: 'Answers to commonly asked questions',
      items: ['Account Setup', 'Billing Questions', 'Technical Issues', 'Feature Requests']
    }
  ];

  const recentTickets = [
    {
      id: 'T-2024-001',
      subject: 'API rate limit inquiry',
      status: 'resolved',
      date: '2024-01-15',
      priority: 'medium'
    },
    {
      id: 'T-2024-002',
      subject: 'Billing discrepancy',
      status: 'in-progress',
      date: '2024-01-18',
      priority: 'high'
    },
    {
      id: 'T-2024-003',
      subject: 'Feature request: Export data',
      status: 'open',
      date: '2024-01-20',
      priority: 'low'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Help & Support</h2>
        <p className="text-gray-600">Get the help you need, when you need it</p>
      </div>

      {/* Contact Support Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {supportOptions.map((option, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <option.icon className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg">{option.title}</CardTitle>
              <Badge className={option.color}>{option.badge}</Badge>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <CardDescription>{option.description}</CardDescription>
              <p className="text-sm text-gray-600">{option.availability}</p>
              <Button className="w-full">{option.action}</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Help Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {helpResources.map((resource, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <resource.icon className="w-5 h-5" />
                {resource.title}
              </CardTitle>
              <CardDescription>{resource.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {resource.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <button className="text-blue-600 hover:underline">{item}</button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Support Tickets */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Support Tickets</CardTitle>
          <CardDescription>Track your support requests and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTickets.map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  {getStatusIcon(ticket.status)}
                  <div>
                    <h4 className="font-medium">{ticket.subject}</h4>
                    <p className="text-sm text-gray-600">Ticket #{ticket.id} • {ticket.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getPriorityColor(ticket.priority)}>
                    {ticket.priority}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {ticket.status}
                  </Badge>
                  <Button variant="ghost" size="sm">View</Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <Button variant="outline" className="w-full">
              View All Tickets
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and quick fixes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="text-left">
                <p className="font-medium">Reset Password</p>
                <p className="text-sm text-gray-600">Change your account password</p>
              </div>
            </Button>
            
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="text-left">
                <p className="font-medium">Download API Logs</p>
                <p className="text-sm text-gray-600">Get your recent API usage logs</p>
              </div>
            </Button>
            
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="text-left">
                <p className="font-medium">Report a Bug</p>
                <p className="text-sm text-gray-600">Let us know about any issues</p>
              </div>
            </Button>
            
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="text-left">
                <p className="font-medium">Request Feature</p>
                <p className="text-sm text-gray-600">Suggest new features or improvements</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpSupport;
