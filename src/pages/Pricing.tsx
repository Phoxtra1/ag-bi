
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Star, Building, Users } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
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
    },
    {
      name: 'Pro Plan',
      price: 'CAD $15',
      period: '/month',
      description: 'Ideal for professionals and researchers who want deeper civic data, AI-assisted prediction tools, and customized alerts.',
      benefits: 'Unlock advanced prediction dashboards, priority news access, weather insights, and submission tools.',
      icon: '🔵',
      features: [
        'Advanced trend filtering',
        'AI-assisted prediction tools',
        'Early event alerts',
        'Real-time weather forecasting',
        'Political forecasting',
        'Personalized insight feeds',
        'Deeper reporting tools'
      ],
      buttonText: 'Subscribe Now',
      popular: true,
      color: 'border-blue-500'
    },
    {
      name: 'Elite Plan',
      price: 'CAD $39',
      period: '/month',
      description: 'Designed for advanced users, civic advocates, or media strategists who need forecasting, insight automation, and detailed reports.',
      benefits: 'Get full access to the AI prediction engine, verified trend archives, custom topics, and performance analytics.',
      icon: '🟣',
      features: [
        'Full AI prediction engine access',
        'Verified trend archives',
        'Real-time civic data',
        'Audience insight tools',
        'Smart dashboards',
        'Higher submission limits',
        'Exclusive civic reports',
        'Performance analytics'
      ],
      buttonText: 'Subscribe Now',
      popular: false,
      color: 'border-purple-500'
    },
    {
      name: 'Institutional Plan',
      price: 'CAD $299',
      period: '/month',
      description: 'Best for organizations, media houses, universities, think tanks, or government departments.',
      benefits: 'Multi-user access, full API integration, institutional dashboards, report generation, and strategic collaboration tools.',
      icon: '🟠',
      features: [
        'Multi-user support',
        'Full API access',
        'Advanced data reporting',
        'Strategic civic forecasting',
        'Team collaboration tools',
        'Institutional dashboards',
        'Custom integrations',
        'Priority support'
      ],
      buttonText: 'Contact Sales',
      popular: false,
      color: 'border-orange-500'
    }
  ];

  const whyPayReasons = [
    'Gain real-time access to verified, AI-filtered trends',
    'Use prediction tools that forecast political shifts, weather, and social behavior',
    'Unlock interactive dashboards with submission, feedback, and civic participation features',
    'Get early alerts for upcoming events, opportunities, or risks',
    'Support an independent platform dedicated to civic truth and innovation'
  ];

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

        {/* Plan Descriptions */}
        <div className="mb-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.color} ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      Most Popular
                    </span>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className="text-3xl mb-2">{plan.icon}</div>
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold text-gray-900 mt-4">
                    {plan.price}
                    <span className="text-lg font-normal text-gray-600">{plan.period}</span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {plan.description}
                  </CardDescription>
                  
                  {plan.benefits && (
                    <p className="text-sm text-blue-600 font-medium">
                      {plan.benefits}
                    </p>
                  )}
                  
                  {plan.whyUpgrade && (
                    <p className="text-sm text-gray-500 italic">
                      {plan.whyUpgrade}
                    </p>
                  )}
                  
                  <div className="space-y-2">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {plan.buttonText}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* Stripe Pricing Table Placeholder */}
        <div className="mb-16">
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <div className="text-gray-500">
              <div className="text-lg font-medium mb-2">Stripe Pricing Table Integration</div>
              <p className="text-sm">The Stripe pricing table will be embedded here for seamless payment processing.</p>
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
