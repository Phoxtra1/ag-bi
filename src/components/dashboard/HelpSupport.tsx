
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Phone, Mail, Clock, HelpCircle, BookOpen, Video, Users, Search, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const HelpSupport = () => {
  const { toast } = useToast();

  const handleStartLiveChat = () => {
    // Dispatch custom event to open the Odeneho chatbot
    window.dispatchEvent(new CustomEvent('openChatbot'));
    
    toast({
      title: "Odeneho AI Assistant",
      description: "Chat with our AI assistant for instant help and support.",
    });
  };

  const handleCallSupport = () => {
    window.open('tel:+233200348349', '_self');
  };

  const handleEmailSupport = () => {
    window.open('mailto:support@amniva.com', '_self');
  };

  const supportOptions = [
    {
      title: "Live Chat with Odeneho",
      description: "Get instant help from our AI assistant - available 24/7",
      icon: MessageCircle,
      action: handleStartLiveChat,
      badge: "Instant",
      color: "bg-green-50 border-green-200 hover:bg-green-100"
    },
    {
      title: "Phone Support",
      description: "Speak directly with our support team",
      icon: Phone,
      action: handleCallSupport,
      badge: "9AM-6PM GMT",
      color: "bg-blue-50 border-blue-200 hover:bg-blue-100"
    },
    {
      title: "Email Support",
      description: "Send us a detailed message - we'll respond within 24 hours",
      icon: Mail,
      action: handleEmailSupport,
      badge: "24h Response",
      color: "bg-purple-50 border-purple-200 hover:bg-purple-100"
    }
  ];

  const quickHelp = [
    {
      title: "Getting Started Guide",
      description: "Learn the basics of using Amniva's platform",
      icon: BookOpen,
      category: "Beginner"
    },
    {
      title: "API Documentation",
      description: "Complete guide to integrating our API",
      icon: FileText,
      category: "Developer"
    },
    {
      title: "Video Tutorials",
      description: "Watch step-by-step video guides",
      icon: Video,
      category: "Tutorial"
    },
    {
      title: "Community Forum",
      description: "Connect with other users and experts",
      icon: Users,
      category: "Community"
    }
  ];

  const faq = [
    {
      question: "How does Amniva's fact-checking work?",
      answer: "Our AI analyzes content against multiple verified sources in real-time, providing credibility scores and source verification."
    },
    {
      question: "Can I integrate Amniva with my existing workflow?",
      answer: "Yes, we provide comprehensive APIs and webhooks for seamless integration with your current tools and platforms."
    },
    {
      question: "What types of media can Amniva analyze?",
      answer: "We support text, images, videos, and audio content across multiple languages and formats."
    },
    {
      question: "Is there a free trial available?",
      answer: "Yes, we offer a 14-day free trial with full access to our core features. No credit card required."
    }
  ];

  return (
    <div className="space-y-8">
      {/* Contact Support Options */}
      <div className="grid md:grid-cols-3 gap-6">
        {supportOptions.map((option, index) => {
          const IconComponent = option.icon;
          return (
            <Card key={index} className={`cursor-pointer transition-all duration-200 ${option.color}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <IconComponent className="w-6 h-6 text-gray-700" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {option.badge}
                  </Badge>
                </div>
                <h3 className="font-semibold text-lg mb-2">{option.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{option.description}</p>
                <Button 
                  onClick={option.action}
                  className="w-full"
                  variant="default"
                >
                  {option.title === "Live Chat with Odeneho" ? "Start Live Chat" : 
                   option.title === "Phone Support" ? "Call Now" : "Send Email"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Help Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            Quick Help Resources
          </CardTitle>
          <CardDescription>
            Find answers to common questions and learn how to use Amniva effectively
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {quickHelp.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <IconComponent className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900">{item.title}</h4>
                      <Badge variant="outline" className="text-xs">{item.category}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Frequently Asked Questions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Frequently Asked Questions
          </CardTitle>
          <CardDescription>
            Common questions and answers about Amniva's services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {faq.map((item, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                <h4 className="font-medium text-gray-900 mb-2">{item.question}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Business Hours */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Support Hours</h4>
                <p className="text-sm text-gray-600">Monday - Friday, 9:00 AM - 6:00 PM GMT</p>
              </div>
            </div>
            <div className="text-right">
              <Badge className="bg-green-100 text-green-800 border-green-200">
                Currently Online
              </Badge>
              <p className="text-xs text-gray-500 mt-1">
                Odeneho AI is available 24/7
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpSupport;
