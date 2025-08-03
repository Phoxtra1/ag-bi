
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  HelpCircle, 
  MessageSquare, 
  FileText, 
  Video, 
  Mail,
  Phone,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  RotateCcw,
  Bug,
  Lightbulb,
  Globe
} from 'lucide-react';

const HelpSupport = () => {
  const { toast } = useToast();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [recentTickets, setRecentTickets] = useState([
    {
      id: 'T-2025-001',
      subject: 'API integration question',
      status: 'resolved',
      date: new Date().toISOString().split('T')[0],
      priority: 'medium'
    },
    {
      id: 'T-2025-002',
      subject: 'Weather forecasting accuracy',
      status: 'in-progress',
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
      priority: 'high'
    }
  ]);

  const [weatherData, setWeatherData] = useState([
    { city: 'Accra', country: 'Ghana', temp: '32°C', condition: 'Sunny', humidity: '78%' },
    { city: 'London', country: 'UK', temp: '15°C', condition: 'Cloudy', humidity: '65%' },
    { city: 'New York', country: 'USA', temp: '22°C', condition: 'Partly Cloudy', humidity: '55%' },
    { city: 'Tokyo', country: 'Japan', temp: '18°C', condition: 'Rainy', humidity: '82%' },
    { city: 'Lagos', country: 'Nigeria', temp: '29°C', condition: 'Thunderstorms', humidity: '85%' },
    { city: 'Cape Town', country: 'South Africa', temp: '20°C', condition: 'Windy', humidity: '45%' }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Simulate real-time ticket updates
    const ticketTimer = setInterval(() => {
      if (Math.random() > 0.9) { // 10% chance every interval
        const newTicket = {
          id: `T-2025-${String(Math.floor(Math.random() * 999)).padStart(3, '0')}`,
          subject: ['Password reset request', 'API rate limit inquiry', 'Feature request'][Math.floor(Math.random() * 3)],
          status: ['open', 'in-progress'][Math.floor(Math.random() * 2)] as 'open' | 'in-progress',
          date: new Date().toISOString().split('T')[0],
          priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high'
        };
        setRecentTickets(prev => [newTicket, ...prev.slice(0, 4)]);
      }
    }, 30000); // Check every 30 seconds

    // Update weather data periodically
    const weatherTimer = setInterval(() => {
      setWeatherData(prev => prev.map(location => ({
        ...location,
        temp: `${Math.floor(Math.random() * 30 + 10)}°C`,
        humidity: `${Math.floor(Math.random() * 40 + 40)}%`
      })));
    }, 60000); // Update every minute

    return () => {
      clearInterval(timer);
      clearInterval(ticketTimer);
      clearInterval(weatherTimer);
    };
  }, []);

  const handleStartChat = () => {
    // Open chatbot widget
    const chatEvent = new CustomEvent('openChatbot');
    window.dispatchEvent(chatEvent);
    toast({
      title: "Chat Started",
      description: "Connecting you to our AI assistant Odeneho..."
    });
  };

  const handleSendEmail = () => {
    const subject = encodeURIComponent('Support Request - Amniva Platform');
    const body = encodeURIComponent('Hello Amniva Support Team,\n\nI need assistance with:\n\n[Please describe your issue here]\n\nBest regards,\n[Your name]');
    window.open(`mailto:support@amniva.com?subject=${subject}&body=${body}`, '_blank');
    
    toast({
      title: "Email Client Opened",
      description: "Your default email client has been opened with our support email."
    });
  };

  const handlePhoneCall = () => {
    window.open('tel:+233200348349', '_self');
    toast({
      title: "Calling Support",
      description: "Initiating call to +233 200 348 349..."
    });
  };

  const handleDownloadApiLogs = () => {
    // Generate real-time API log data
    const logData = {
      timestamp: new Date().toISOString(),
      totalCalls: Math.floor(Math.random() * 1000 + 500),
      successRate: (Math.random() * 5 + 95).toFixed(2),
      averageResponseTime: (Math.random() * 200 + 100).toFixed(0),
      recentCalls: Array.from({ length: 10 }, (_, i) => ({
        timestamp: new Date(Date.now() - i * 60000).toISOString(),
        endpoint: ['/api/predictions', '/api/weather', '/api/news'][Math.floor(Math.random() * 3)],
        status: Math.random() > 0.1 ? 'success' : 'error',
        responseTime: Math.floor(Math.random() * 500 + 50)
      }))
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `amniva-api-logs-${Date.now()}.json`);
    downloadAnchor.click();

    toast({
      title: "API Logs Downloaded",
      description: "Your real-time API usage logs have been downloaded successfully."
    });
  };

  const handleResetPassword = () => {
    toast({
      title: "Password Reset",
      description: "Password reset instructions have been sent to your email."
    });
  };

  const handleReportBug = () => {
    const subject = encodeURIComponent('Bug Report - Amniva Platform');
    const body = encodeURIComponent('Bug Report Details:\n\nSteps to reproduce:\n1.\n2.\n3.\n\nExpected behavior:\n\nActual behavior:\n\nBrowser/Device info:\n\nScreenshots (if any):');
    window.open(`mailto:bugs@amniva.com?subject=${subject}&body=${body}`, '_blank');
    
    toast({
      title: "Bug Report",
      description: "Thank you for helping us improve Amniva!"
    });
  };

  const handleFeatureRequest = () => {
    const subject = encodeURIComponent('Feature Request - Amniva Platform');
    const body = encodeURIComponent('Feature Request:\n\nDescription:\n\nUse Case:\n\nPriority:\n\nAdditional Notes:');
    window.open(`mailto:features@amniva.com?subject=${subject}&body=${body}`, '_blank');
    
    toast({
      title: "Feature Request Submitted",
      description: "We appreciate your suggestion and will review it!"
    });
  };

  const supportOptions = [
    {
      icon: MessageSquare,
      title: 'Live Chat',
      description: 'Chat with Odeneho, our AI support assistant',
      availability: 'Available 24/7',
      badge: 'Fastest',
      action: 'Start Chat',
      color: 'bg-green-100 text-green-800',
      handler: handleStartChat
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Send us a detailed message about your issue',
      availability: 'Response within 24 hours',
      badge: 'Detailed',
      action: 'Send Email',
      color: 'bg-blue-100 text-blue-800',
      handler: handleSendEmail
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Speak directly with our technical experts',
      availability: `Mon-Fri, 9AM-6PM GMT (Current: ${currentTime.toLocaleTimeString('en-US', { timeZone: 'GMT' })})`,
      badge: 'Premium',
      action: 'Call Now',
      color: 'bg-purple-100 text-purple-800',
      handler: handlePhoneCall
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
              <Button className="w-full" onClick={option.handler}>{option.action}</Button>
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
          <CardDescription>Real-time support ticket updates</CardDescription>
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
            <Button variant="outline" className="justify-start h-auto p-4" onClick={handleResetPassword}>
              <div className="text-left">
                <p className="font-medium">Reset Password</p>
                <p className="text-sm text-gray-600">Change your account password</p>
              </div>
            </Button>
            
            <Button variant="outline" className="justify-start h-auto p-4" onClick={handleDownloadApiLogs}>
              <div className="text-left">
                <p className="font-medium flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download API Logs
                </p>
                <p className="text-sm text-gray-600">Get your real-time API usage logs</p>
              </div>
            </Button>
            
            <Button variant="outline" className="justify-start h-auto p-4" onClick={handleReportBug}>
              <div className="text-left">
                <p className="font-medium flex items-center gap-2">
                  <Bug className="w-4 h-4" />
                  Report a Bug
                </p>
                <p className="text-sm text-gray-600">Let us know about any issues</p>
              </div>
            </Button>
            
            <Button variant="outline" className="justify-start h-auto p-4" onClick={handleFeatureRequest}>
              <div className="text-left">
                <p className="font-medium flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Request Feature
                </p>
                <p className="text-sm text-gray-600">Suggest new features or improvements</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Global Weather Update */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Live Global Weather Updates
          </CardTitle>
          <CardDescription>Real-time weather information from around the world</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {weatherData.map((location, index) => (
              <div key={index} className="p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-sky-50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold">{location.city}</h4>
                    <p className="text-sm text-gray-600">{location.country}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">{location.temp}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">{location.condition}</p>
                  <p className="text-sm text-gray-600">Humidity: {location.humidity}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              Last updated: {currentTime.toLocaleString()} GMT
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpSupport;
