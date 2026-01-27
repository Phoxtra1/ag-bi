
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const Pricing = () => {
  const freePlan = {
    name: 'Free Plan',
    price: '€0',
    period: '/month',
    description: 'Get started with core access to business trends, basic verification previews, and platform exploration at no cost.',
    whyUpgrade: 'Great for evaluation, but limited access to full analysis tools and forecasting features.',
    icon: '🟢',
    features: [
      'Business trends overview',
      'Basic verification features',
      'Platform exploration',
      'Limited API access',
      'Community access'
    ],
    buttonText: 'Get Started Free',
    popular: false,
    color: 'border-border'
  };

  const whyPayReasons = [
    'Access real-time verified data and AI-powered analysis',
    'Use prediction tools for market forecasting and risk assessment',
    'Unlock interactive dashboards with full submission and insight features',
    'Get early alerts for market movements, opportunities, or risks',
    'Support an independent platform dedicated to data integrity and innovation'
  ];

  // Add Stripe script to document head
  React.useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/pricing-table.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Choose the Right Plan for You
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Whether you're an individual analyst, a research team, or an institution—
            Amniva empowers you with business intelligence tools that matter.
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
                  <div className="text-3xl font-bold text-foreground mt-4">
                    {freePlan.price}
                    <span className="text-lg font-normal text-muted-foreground">{freePlan.period}</span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {freePlan.description}
                  </CardDescription>
                  
                  <p className="text-sm text-muted-foreground italic">
                    {freePlan.whyUpgrade}
                  </p>
                  
                  <div className="space-y-2">
                    {freePlan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Link to="/login" className="w-full">
                    <Button className="w-full" variant="outline">
                      {freePlan.buttonText}
                    </Button>
                  </Link>
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
          <div className="bg-card rounded-2xl shadow-lg p-8 md:p-12 border">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
              Why Choose a Paid Plan?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {whyPayReasons.map((reason, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="text-center bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 md:p-12 text-primary-foreground">
          <h2 className="text-3xl font-bold mb-4">
            Your insight matters. Upgrade your plan today and unlock full intelligence capabilities.
          </h2>
          <p className="text-primary-foreground/80 mb-6 text-lg">
            Need help choosing a plan? Contact us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" className="bg-background text-primary hover:bg-background/90">
                Contact Support
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                View All Features
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
