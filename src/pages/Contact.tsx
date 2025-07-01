
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Mail, Send, CheckCircle } from 'lucide-react';

interface ContactForm {
  fullName: string;
  email: string;
  subject: string;
  category: string;
  message: string;
}

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const form = useForm<ContactForm>();

  const onSubmit = (data: ContactForm) => {
    console.log('Contact form submitted:', data);
    // Handle form submission
    setSubmitted(true);
    form.reset();
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <Header />
        
        <main className="container mx-auto px-4 py-12 flex items-center justify-center">
          <div className="text-center max-w-2xl">
            <CheckCircle className="h-24 w-24 mx-auto mb-8 text-green-600" />
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Thanks for reaching out!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Our team will get back to you within 48 hours. We appreciate your interest 
              in Amniva and look forward to connecting with you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => setSubmitted(false)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Send Another Message
              </Button>
              <Button size="lg" variant="outline">
                Return to Platform
              </Button>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <Mail className="h-16 w-16 mx-auto mb-6 text-blue-600" />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Have questions about Amniva or Amnewsworld? We'd love to hear from you. 
            Send us a message and our team will respond within 48 hours.
          </p>
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="fullName"
                    rules={{ required: "Full name is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Full Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Your full name" 
                            {...field}
                            className="border-2 border-gray-200 focus:border-blue-500 p-3"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    rules={{ 
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Please enter a valid email"
                      }
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Email Address</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="your@email.com" 
                            {...field}
                            className="border-2 border-gray-200 focus:border-blue-500 p-3"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="subject"
                  rules={{ required: "Subject is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Subject</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="What is your message about?" 
                          {...field}
                          className="border-2 border-gray-200 focus:border-blue-500 p-3"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  rules={{ required: "Please select a category" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">What is your message about?</FormLabel>
                      <FormControl>
                        <select 
                          {...field} 
                          className="w-full p-3 border-2 border-gray-200 rounded-md focus:outline-none focus:border-blue-500 bg-white"
                        >
                          <option value="">Select a category</option>
                          <option value="amnewsworld">Amnewsworld</option>
                          <option value="amniva">Amniva</option>
                          <option value="amn-news-radio">AMN News Radio</option>
                          <option value="amnet">Amnet</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  rules={{ required: "Message is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us more about your inquiry..." 
                          rows={6}
                          {...field}
                          className="border-2 border-gray-200 focus:border-blue-500 p-3 resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full bg-[#002A5C] hover:bg-[#001A3C] text-white py-4 text-lg font-semibold"
                >
                  <Send className="mr-2 h-5 w-5" />
                  Send Message
                </Button>
              </form>
            </Form>
          </div>
        </div>

        {/* Additional Info */}
        <div className="max-w-2xl mx-auto mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Why Contact Amniva?
            </h3>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Media Intelligence</h4>
                <p className="text-gray-700 text-sm">
                  Questions about our AI-powered analytics and media intelligence tools.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Partnerships</h4>
                <p className="text-gray-700 text-sm">
                  Interested in collaborating with Amnewsworld or integrating our services.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Support</h4>
                <p className="text-gray-700 text-sm">
                  Need help with your account, billing, or technical issues.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Feedback</h4>
                <p className="text-gray-700 text-sm">
                  Share your thoughts on how we can improve our platform and services.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
