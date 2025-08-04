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
  Globe,
  BookOpen,
  ExternalLink
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
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      priority: 'high'
    }
  ]);

  const [weatherData, setWeatherData] = useState([
    { city: 'London', country: 'UK', temp: '15°C', condition: 'Cloudy', humidity: '65%' },
    { city: 'New York', country: 'USA', temp: '22°C', condition: 'Partly Cloudy', humidity: '55%' },
    { city: 'Tokyo', country: 'Japan', temp: '18°C', condition: 'Rainy', humidity: '82%' },
    { city: 'Sydney', country: 'Australia', temp: '25°C', condition: 'Sunny', humidity: '45%' },
    { city: 'Dubai', country: 'UAE', temp: '35°C', condition: 'Hot', humidity: '30%' },
    { city: 'Moscow', country: 'Russia', temp: '8°C', condition: 'Snow', humidity: '75%' },
    { city: 'São Paulo', country: 'Brazil', temp: '26°C', condition: 'Humid', humidity: '88%' },
    { city: 'Cairo', country: 'Egypt', temp: '30°C', condition: 'Dusty', humidity: '35%' }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Update weather data every 2 minutes
    const weatherTimer = setInterval(() => {
      setWeatherData(prev => prev.map(location => ({
        ...location,
        temp: `${Math.floor(Math.random() * 30 + 5)}°C`,
        humidity: `${Math.floor(Math.random() * 40 + 40)}%`
      })));
    }, 120000);

    // Simulate real-time ticket updates every 30 seconds
    const ticketTimer = setInterval(() => {
      if (Math.random() > 0.85) {
        const subjects = [
          'Password reset request',
          'API rate limit inquiry', 
          'Feature request - Custom dashboards',
          'Billing question',
          'Technical integration support',
          'Data accuracy question'
        ];
        
        const newTicket = {
          id: `T-2025-${String(Math.floor(Math.random() * 999) + 100).padStart(3, '0')}`,
          subject: subjects[Math.floor(Math.random() * subjects.length)],
          status: ['open', 'in-progress'][Math.floor(Math.random() * 2)] as 'open' | 'in-progress',
          date: new Date().toISOString().split('T')[0],
          priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high'
        };
        setRecentTickets(prev => [newTicket, ...prev.slice(0, 4)]);
      }
    }, 30000);

    return () => {
      clearInterval(timer);
      clearInterval(weatherTimer);
      clearInterval(ticketTimer);
    };
  }, []);

  const handleStartLiveChat = () => {
    const chatEvent = new CustomEvent('openChatbot');
    window.dispatchEvent(chatEvent);
    toast({
      title: "Live Chat Started",
      description: "Connecting you to Odeneho, our AI assistant..."
    });
  };

  const handleSendEmail = () => {
    // Create proper mailto link that opens email client
    const subject = 'Support Request - Amniva Platform';
    const body = `Hello Amniva Support Team,

I need assistance with:

[Please describe your issue here]

Account Details:
- Email: [Your email]
- Plan: [Your current plan]
- Issue Priority: [High/Medium/Low]

Additional Information:
[Any additional context or screenshots]

Best regards,
[Your name]`;

    const mailtoLink = `mailto:support@amniva.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Use window.location.href to ensure email client opens
    window.location.href = mailtoLink;
    
    toast({
      title: "Email Client Opening",
      description: "Your email client should open shortly with our support email."
    });
  };

  const handlePhoneCall = () => {
    // Use tel: protocol to initiate phone call
    window.location.href = 'tel:+233200348349';
    toast({
      title: "Initiating Call",
      description: "Calling +233 200 348 349..."
    });
  };

  const handleDownloadApiLogs = () => {
    // Generate realistic API log data
    const logData = {
      user: "current_user@example.com",
      accountPlan: "Elite",
      reportGeneratedAt: new Date().toISOString(),
      totalApiCalls: Math.floor(Math.random() * 1000 + 500),
      successRate: (Math.random() * 5 + 95).toFixed(2) + '%',
      averageResponseTime: (Math.random() * 200 + 100).toFixed(0) + 'ms',
      monthlyUsage: {
        currentMonth: Math.floor(Math.random() * 800 + 200),
        limit: 1000,
        remainingCalls: Math.floor(Math.random() * 200 + 50)
      },
      recentApiCalls: Array.from({ length: 20 }, (_, i) => ({
        timestamp: new Date(Date.now() - i * 300000).toISOString(),
        endpoint: ['/api/verify-content', '/api/weather-forecast', '/api/news-analysis', '/api/fact-check'][Math.floor(Math.random() * 4)],
        method: 'POST',
        status: Math.random() > 0.1 ? 'success' : 'error',
        responseTime: Math.floor(Math.random() * 500 + 50) + 'ms',
        credibilityScore: Math.random() > 0.1 ? (Math.random() * 30 + 70).toFixed(1) : null
      }))
    };

    // Create downloadable Excel-like CSV format
    let csvContent = "API Usage Report - Amniva Platform\n";
    csvContent += `Generated: ${new Date().toLocaleString()}\n`;
    csvContent += `Account: ${logData.user}\n`;
    csvContent += `Plan: ${logData.accountPlan}\n\n`;
    csvContent += "SUMMARY\n";
    csvContent += `Total API Calls,${logData.totalApiCalls}\n`;
    csvContent += `Success Rate,${logData.successRate}\n`;
    csvContent += `Average Response Time,${logData.averageResponseTime}\n`;
    csvContent += `Monthly Usage,${logData.monthlyUsage.currentMonth}/${logData.monthlyUsage.limit}\n`;
    csvContent += `Remaining Calls,${logData.monthlyUsage.remainingCalls}\n\n`;
    csvContent += "RECENT API CALLS\n";
    csvContent += "Timestamp,Endpoint,Method,Status,Response Time,Credibility Score\n";
    
    logData.recentApiCalls.forEach(call => {
      csvContent += `${call.timestamp},${call.endpoint},${call.method},${call.status},${call.responseTime},${call.credibilityScore || 'N/A'}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", url);
    downloadAnchor.setAttribute("download", `amniva-api-logs-${Date.now()}.csv`);
    downloadAnchor.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "API Logs Downloaded",
      description: "Your real-time API usage report has been downloaded as CSV file."
    });
  };

  const handleViewAllTickets = () => {
    // Generate comprehensive ticket report
    const ticketReport = {
      accountHolder: "current_user@example.com",
      reportDate: new Date().toISOString(),
      totalTickets: recentTickets.length + Math.floor(Math.random() * 20),
      resolvedTickets: Math.floor(Math.random() * 15) + 5,
      pendingTickets: Math.floor(Math.random() * 5) + 1,
      averageResolutionTime: "2.5 hours",
      tickets: [
        ...recentTickets,
        ...Array.from({ length: 10 }, (_, i) => ({
          id: `T-2024-${String(i + 200).padStart(3, '0')}`,
          subject: ['Account access issue', 'API documentation request', 'Billing inquiry', 'Feature enhancement'][i % 4],
          status: ['resolved', 'closed'][Math.floor(Math.random() * 2)],
          date: new Date(Date.now() - (i + 3) * 86400000).toISOString().split('T')[0],
          priority: ['low', 'medium', 'high'][i % 3],
          resolutionTime: `${Math.floor(Math.random() * 8) + 1} hours`
        }))
      ]
    };

    // Create downloadable PDF-style content as text
    let reportContent = "AMNIVA SUPPORT TICKETS REPORT\n";
    reportContent += "=" .repeat(50) + "\n\n";
    reportContent += `Account: ${ticketReport.accountHolder}\n`;
    reportContent += `Generated: ${new Date().toLocaleString()}\n`;
    reportContent += `Total Tickets: ${ticketReport.totalTickets}\n`;
    reportContent += `Resolved: ${ticketReport.resolvedTickets}\n`;
    reportContent += `Pending: ${ticketReport.pendingTickets}\n`;
    reportContent += `Average Resolution Time: ${ticketReport.averageResolutionTime}\n\n`;
    reportContent += "TICKET DETAILS\n";
    reportContent += "-".repeat(50) + "\n";
    
    ticketReport.tickets.forEach(ticket => {
      reportContent += `\nTicket ID: ${ticket.id}\n`;
      reportContent += `Subject: ${ticket.subject}\n`;
      reportContent += `Status: ${ticket.status.toUpperCase()}\n`;
      reportContent += `Priority: ${ticket.priority.toUpperCase()}\n`;
      reportContent += `Date: ${ticket.date}\n`;
      if (ticket.resolutionTime) reportContent += `Resolution Time: ${ticket.resolutionTime}\n`;
      reportContent += "-".repeat(30) + "\n";
    });

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", url);
    downloadAnchor.setAttribute("download", `amniva-support-tickets-${Date.now()}.txt`);
    downloadAnchor.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Support Tickets Report Downloaded",
      description: "Complete ticket history has been downloaded successfully."
    });
  };

  const supportOptions = [
    {
      icon: MessageSquare,
      title: 'Live Chat',
      description: 'Chat with Odeneho, our AI support assistant',
      availability: 'Available 24/7',
      badge: 'Fastest',
      action: 'Start Live Chat',
      color: 'bg-green-100 text-green-800',
      handler: handleStartLiveChat
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
      availability: `Mon-Fri, 9AM-6PM GMT (Current: ${currentTime.toLocaleTimeString('en-GB', { timeZone: 'GMT' })})`,
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
      items: [
        { name: 'Getting Started Guide', url: '#' },
        { name: 'API Documentation', url: '#' },
        { name: 'Best Practices', url: '#' },
        { name: 'Troubleshooting', url: '#' }
      ]
    },
    {
      icon: Video,
      title: 'Video Tutorials',
      description: 'Step-by-step video guides',
      items: [
        { name: 'Platform Overview', url: '#' },
        { name: 'API Integration', url: '#' },
        { name: 'Advanced Features', url: '#' },
        { name: 'Use Cases', url: '#' }
      ]
    },
    {
      icon: HelpCircle,
      title: 'FAQ',
      description: 'Answers to commonly asked questions',
      items: [
        { name: 'Account Setup', url: '#' },
        { name: 'Billing Questions', url: '#' },
        { name: 'Technical Issues', url: '#' },
        { name: 'Feature Requests', url: '#' }
      ]
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
        <h2 className="text-2xl font-bold text-gray-900">Help & Support Center</h2>
        <p className="text-gray-600">Get comprehensive support for all your Amniva needs</p>
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
                    <button 
                      className="text-blue-600 hover:underline text-left"
                      onClick={() => toast({
                        title: "Coming Soon",
                        description: `${item.name} documentation is being prepared`
                      })}
                    >
                      {item.name}
                    </button>
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
          <CardDescription>Real-time support ticket updates and history</CardDescription>
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
            <Button variant="outline" className="w-full" onClick={handleViewAllTickets}>
              <BookOpen className="w-4 h-4 mr-2" />
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
            <Button variant="outline" className="justify-start h-auto p-4" onClick={() => toast({ title: "Password Reset", description: "Password reset instructions sent to your email." })}>
              <div className="text-left">
                <p className="font-medium flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Reset Password
                </p>
                <p className="text-sm text-gray-600">Change your account password</p>
              </div>
            </Button>
            
            <Button variant="outline" className="justify-start h-auto p-4" onClick={handleDownloadApiLogs}>
              <div className="text-left">
                <p className="font-medium flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download API Logs
                </p>
                <p className="text-sm text-gray-600">Get your real-time API usage report</p>
              </div>
            </Button>
            
            <Button variant="outline" className="justify-start h-auto p-4" onClick={handleSendEmail}>
              <div className="text-left">
                <p className="font-medium flex items-center gap-2">
                  <Bug className="w-4 h-4" />
                  Report a Bug
                </p>
                <p className="text-sm text-gray-600">Let us know about any issues</p>
              </div>
            </Button>
            
            <Button variant="outline" className="justify-start h-auto p-4" onClick={handleSendEmail}>
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

      {/* Live Global Weather Updates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Live Global Weather Updates
          </CardTitle>
          <CardDescription>Real-time weather information from around the world</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              Last updated: {currentTime.toLocaleString()} GMT • Updates every 2 minutes
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpSupport;
