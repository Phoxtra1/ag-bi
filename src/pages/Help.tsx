
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { 
  Search, 
  Headphones, 
  User, 
  Building, 
  Mail, 
  MessageCircle, 
  Clock,
  Send
} from 'lucide-react';

interface TicketForm {
  name: string;
  email: string;
  subject: string;
  category: string;
  message: string;
}

const Help = () => {
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const form = useForm<TicketForm>();

  const categories = [
    {
      title: "Technical Support",
      description: "API issues, platform bugs, integration problems",
      icon: <Headphones className="h-8 w-8 text-blue-600" />
    },
    {
      title: "Accounts & Access",
      description: "Login issues, subscription management, billing questions",
      icon: <User className="h-8 w-8 text-green-600" />
    },
    {
      title: "Brand Requests",
      description: "Media partnerships, brand collaborations, content licensing",
      icon: <Building className="h-8 w-8 text-purple-600" />
    },
    {
      title: "Business Inquiries",
      description: "Enterprise solutions, custom integrations, partnerships",
      icon: <Mail className="h-8 w-8 text-orange-600" />
    }
  ];

  const articles = [
    "Getting Started with Amniva Platform",
    "How to Use Media Intelligence Tools",
    "Understanding Prediction Algorithms",
    "API Documentation and Setup",
    "Subscription Management Guide",
    "Data Export and Integration",
    "Troubleshooting Common Issues",
    "Account Security Best Practices"
  ];

  const onSubmit = (data: TicketForm) => {
    console.log('Ticket submitted:', data);
    // Handle form submission
    setShowTicketForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <MessageCircle className="h-16 w-16 mx-auto mb-6 text-blue-600" />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Help Center
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Your go-to space for answers, support, and live assistance. Find solutions 
            to common questions or connect with our support team for personalized help.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input 
              placeholder="Search Help Topics" 
              className="pl-12 pr-4 py-6 text-lg rounded-xl border-2 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Support Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {categories.map((category, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4">
                  {category.icon}
                </div>
                <CardTitle className="text-lg">{category.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-sm">
                  {category.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Popular Articles */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Popular Help Articles
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {articles.map((article, index) => (
              <div 
                key={index}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <p className="font-medium text-gray-900">{article}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Support Options */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Live Chat */}
          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
            <CardHeader className="text-center">
              <MessageCircle className="h-12 w-12 mx-auto mb-4" />
              <CardTitle className="text-2xl">Live Chat Support</CardTitle>
              <CardDescription className="text-blue-100">
                Chat with Odeneho, our AI support assistant, or connect with our live agents
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100"
                onClick={() => setShowChat(true)}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Start Live Chat
              </Button>
              <p className="mt-4 text-sm text-blue-100 flex items-center justify-center">
                <Clock className="mr-1 h-4 w-4" />
                Available 24/7
              </p>
            </CardContent>
          </Card>

          {/* Submit Ticket */}
          <Card className="bg-gradient-to-br from-green-600 to-green-700 text-white">
            <CardHeader className="text-center">
              <Send className="h-12 w-12 mx-auto mb-4" />
              <CardTitle className="text-2xl">Submit a Ticket</CardTitle>
              <CardDescription className="text-green-100">
                Need detailed help? Submit a support ticket and we'll get back to you
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                size="lg" 
                className="bg-white text-green-600 hover:bg-gray-100"
                onClick={() => setShowTicketForm(true)}
              >
                <Send className="mr-2 h-5 w-5" />
                Submit Ticket
              </Button>
              <p className="mt-4 text-sm text-green-100">
                Response within 24 hours
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Ticket Form Modal */}
        {showTicketForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Submit Support Ticket</h3>
                  <Button 
                    variant="ghost" 
                    onClick={() => setShowTicketForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </Button>
                </div>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="your@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <FormControl>
                            <Input placeholder="Brief description of your issue" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <FormControl>
                            <select 
                              {...field} 
                              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Select a category</option>
                              <option value="technical">Technical Support</option>
                              <option value="account">Accounts & Access</option>
                              <option value="brand">Brand Requests</option>
                              <option value="business">Business Inquiries</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Please describe your issue in detail..." 
                              rows={6}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex gap-4">
                      <Button type="submit" size="lg" className="flex-1">
                        Submit Ticket
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="lg"
                        onClick={() => setShowTicketForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        )}

        {/* Chat Widget */}
        {showChat && (
          <div className="fixed bottom-4 right-4 w-96 h-96 bg-white rounded-xl shadow-2xl border z-50">
            <div className="bg-blue-600 text-white p-4 rounded-t-xl flex justify-between items-center">
              <div>
                <h4 className="font-semibold">Amniva Support Bot</h4>
                <p className="text-sm text-blue-100">Usually replies instantly</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowChat(false)}
                className="text-white hover:bg-blue-700"
              >
                ✕
              </Button>
            </div>
            <div className="p-4 h-80 flex flex-col">
              <div className="flex-1 bg-gray-50 rounded-lg p-4 mb-4">
                <div className="bg-blue-100 rounded-lg p-3 mb-3">
                  <p className="text-sm">
                    Hi! I'm Odeneho, your Amniva support assistant. How can I help you today?
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Input placeholder="Type a message..." className="flex-1" />
                <Button size="sm">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Support Bot Info */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            24/7 AI Support Available
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            Speak directly to our Amniva Support Bot for instant answers to common questions, 
            or escalate to live agents when you need human assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => setShowChat(true)}>
              <MessageCircle className="mr-2 h-5 w-5" />
              Start Chat Now
            </Button>
            <Button size="lg" variant="outline">
              Browse Help Articles
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Help;
