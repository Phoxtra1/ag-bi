
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  HelpCircle, 
  MessageCircle, 
  FileText, 
  Mail, 
  Phone, 
  ExternalLink,
  Search,
  Book,
  Users
} from 'lucide-react';

const HelpSupport = () => {
  const faqItems = [
    {
      question: 'How do I upgrade my subscription plan?',
      answer: 'You can upgrade your plan from the Account Management section or contact our support team.'
    },
    {
      question: 'How accurate are the predictions?',
      answer: 'Our AI models achieve 85-95% accuracy depending on the prediction type and data quality.'
    },
    {
      question: 'Can I export my prediction data?',
      answer: 'Yes, Pro and Elite users can export data in PDF, CSV, and JSON formats.'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Help & Support</h2>
        <p className="text-gray-600">Get help with your Amnova account and features</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Quick Support
            </CardTitle>
            <CardDescription>
              Get immediate help with common questions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <MessageCircle className="w-4 h-4 mr-2" />
              Live Chat Support
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Mail className="w-4 h-4 mr-2" />
              Email Support
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Phone className="w-4 h-4 mr-2" />
              Schedule a Call
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Community Forum
            </Button>
          </CardContent>
        </Card>

        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Contact Support
            </CardTitle>
            <CardDescription>
              Send us a message and we'll get back to you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <Input placeholder="Brief description of your issue" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <Textarea 
                placeholder="Describe your issue in detail..."
                rows={4}
              />
            </div>
            <Button className="w-full">Send Message</Button>
          </CardContent>
        </Card>

        {/* Documentation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="w-5 h-5" />
              Documentation
            </CardTitle>
            <CardDescription>
              Comprehensive guides and API documentation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              User Guide
              <ExternalLink className="w-4 h-4 ml-auto" />
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              API Documentation
              <ExternalLink className="w-4 h-4 ml-auto" />
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Video Tutorials
              <ExternalLink className="w-4 h-4 ml-auto" />
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Best Practices
              <ExternalLink className="w-4 h-4 ml-auto" />
            </Button>
          </CardContent>
        </Card>

        {/* Search Knowledge Base */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search Knowledge Base
            </CardTitle>
            <CardDescription>
              Find answers to common questions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input placeholder="Search for help..." className="flex-1" />
              <Button>
                <Search className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-600">
              Try searching for: "API setup", "billing issues", "prediction accuracy"
            </p>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {faqItems.map((faq, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">{faq.question}</h4>
                <p className="text-sm text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Button variant="outline" className="w-full">
              View All FAQs
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Support Hours */}
      <Card>
        <CardHeader>
          <CardTitle>Support Hours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Live Chat & Email</h4>
              <p className="text-sm text-gray-600">Monday - Friday: 9 AM - 6 PM EST</p>
              <p className="text-sm text-gray-600">Saturday: 10 AM - 4 PM EST</p>
              <p className="text-sm text-gray-600">Sunday: Closed</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Phone Support</h4>
              <p className="text-sm text-gray-600">Monday - Friday: 9 AM - 5 PM EST</p>
              <p className="text-sm text-gray-600">Emergency Support: 24/7</p>
              <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpSupport;
