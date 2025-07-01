
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Mail, CheckCircle, Newspaper, TrendingUp, Globe } from 'lucide-react';

interface NewsletterForm {
  email: string;
  consent: boolean;
}

const Newsletter = () => {
  const [subscribed, setSubscribed] = useState(false);
  const form = useForm<NewsletterForm>();

  const onSubmit = (data: NewsletterForm) => {
    console.log('Newsletter subscription:', data);
    // Handle Brevo integration here
    setSubscribed(true);
    form.reset();
  };

  if (subscribed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <Header />
        
        <main className="container mx-auto px-4 py-12 flex items-center justify-center">
          <div className="text-center max-w-2xl">
            <CheckCircle className="h-24 w-24 mx-auto mb-8 text-green-600" />
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              You're in!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Expect valuable content soon. We'll keep you updated on the latest in media, 
              innovation, technology, business, politics, and more from Amniva and Amnewsworld.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => setSubscribed(false)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Subscribe Another Email
              </Button>
              <Button size="lg" variant="outline">
                Explore Amniva Platform
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
          <Newspaper className="h-16 w-16 mx-auto mb-6 text-blue-600" />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Stay Informed with Amniva
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Get updates from the frontlines of media, innovation, and tech, business, 
            politics, and more. Join thousands of professionals who trust our insights.
          </p>
        </div>

        {/* Newsletter Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Market Insights</h3>
            <p className="text-gray-600">
              Weekly analysis of media trends, technology developments, and market movements 
              that impact your industry.
            </p>
          </div>
          <div className="text-center">
            <Globe className="h-12 w-12 mx-auto mb-4 text-green-600" />
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Global Perspective</h3>
            <p className="text-gray-600">
              International news updates, geopolitical analysis, and cross-border business 
              developments from our global network.
            </p>
          </div>
          <div className="text-center">
            <Mail className="h-12 w-12 mx-auto mb-4 text-purple-600" />
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Exclusive Content</h3>
            <p className="text-gray-600">
              Early access to Amniva features, behind-the-scenes insights from Amnewsworld, 
              and exclusive interviews with industry leaders.
            </p>
          </div>
        </div>

        {/* Subscription Form */}
        <div className="max-w-xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Subscribe to Our Newsletter
              </h2>
              <p className="text-gray-600">
                Join our community of informed professionals and stay ahead of the curve.
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                          placeholder="Enter your email address" 
                          {...field}
                          className="border-2 border-gray-200 focus:border-blue-500 p-4 text-lg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="consent"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm text-gray-700">
                          I agree to receive emails from Amniva and its brands, including 
                          Amnewsworld, AMN News Radio, and Amnet.
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full bg-[#002A5C] hover:bg-[#001A3C] text-white py-4 text-lg font-semibold"
                >
                  <Mail className="mr-2 h-5 w-5" />
                  Subscribe Now
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Powered by Brevo • Unsubscribe anytime • Privacy protected
              </p>
            </div>
          </div>
        </div>

        {/* Newsletter Preview */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
              What to Expect in Your Inbox
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Weekly Digest</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Top media intelligence insights</li>
                  <li>• Technology and AI developments</li>
                  <li>• Global business and political updates</li>
                  <li>• Environmental and sustainability news</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Exclusive Features</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Early access to new platform features</li>
                  <li>• Industry expert interviews</li>
                  <li>• Behind-the-scenes content</li>
                  <li>• Special offers and beta invitations</li>
                </ul>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <p className="text-gray-600 mb-4">
                Join over 10,000+ professionals who trust our insights
              </p>
              <div className="flex justify-center space-x-4 text-sm text-gray-500">
                <span>✓ No spam, ever</span>
                <span>✓ Unsubscribe anytime</span>
                <span>✓ Privacy first</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Newsletter;
