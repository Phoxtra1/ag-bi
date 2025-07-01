
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

const Pricing = () => {
  const freePlan = {
    name: 'Free Plan',
    price: 'CAD $0',
    period: '/month',
    description: 'Get started with core access to trending insights, verified news previews, and civic snapshots — at no cost.',
    whyUpgrade: 'Great for casual users, but limited access to deeper prediction tools and reporting features.',
    icon: '🟢',
    features: [
      'Trending news previews',
      'Basic civic content',
      'Limited verification features',
      'Explore Amnova platform',
      'Basic community access'
    ],
    buttonText: 'Get Started Free',
    popular: false,
    color: 'border-gray-200'
  };

  const whyPayReasons = [
    'Gain real-time access to verified, AI-filtered trends',
    'Use prediction tools that forecast political shifts, weather, and social behavior',
    'Unlock interactive dashboards with submission, feedback, and civic participation features',
    'Get early alerts for upcoming events, opportunities, or risks',
    'Support an independent platform dedicated to civic truth and innovation'
  ];

  // Add Stripe script to document head
  React.useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/pricing-table.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Choose the Right Plan for You
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Whether you're a curious reader, an investigative journalist, a civic advocate, or an institution — 
            Amnova empowers you with tools that matter.
          </p>
        </div>

        {/* Pricing Plans Section */}
        <div className="mb-12">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Free Plan - Custom Card */}
            <div className="lg:col-span-1">
              <Card className={`relative ${freePlan.color} h-full`}>
                <CardHeader className="text-center pb-4">
                  <div className="text-3xl mb-2">{freePlan.icon}</div>
                  <CardTitle className="text-2xl font-bold">{freePlan.name}</CardTitle>
                  <div className="text-3xl font-bold text-gray-900 mt-4">
                    {freePlan.price}
                    <span className="text-lg font-normal text-gray-600">{freePlan.period}</span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {freePlan.description}
                  </CardDescription>
                  
                  <p className="text-sm text-gray-500 italic">
                    {freePlan.whyUpgrade}
                  </p>
                  
                  <div className="space-y-2">
                    {freePlan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button className="w-full" variant="outline">
                    {freePlan.buttonText}
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Stripe Pricing Table for Paid Plans */}
            <div className="lg:col-span-3">
              <div className="stripe-pricing-container">
                <stripe-pricing-table 
                  pricing-table-id="prctbl_1RePAsRoPr9Ap5vF4dX5FwF0"
                  publishable-key="pk_live_51PYzuYRoPr9Ap5vF7KyQfStpqVfA6umHYSsYhWhMgNgkAuvAfvHGaF7cp3ubCaRVmOxSKPQCsueFjxsWmmicqfr800DjAQrpDX"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Why Pay Section */}
        <div className="mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Why Choose a Paid Plan?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {whyPayReasons.map((reason, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-gray-700 leading-relaxed">{reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Your insight matters. Upgrade your plan today and be part of something transformative.
          </h2>
          <p className="text-blue-100 mb-6 text-lg">
            Need help choosing a plan? Contact us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Contact Support
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              View All Features
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
