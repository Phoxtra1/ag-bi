import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Shield, TrendingUp, AlertTriangle, BarChart3, Globe, Users, Zap } from 'lucide-react';

const MainContent = () => {
  const features = [
    {
      title: "Misinformation Detection",
      description: "Real-time verification of news, claims, and viral content using AI-powered fact-checking.",
      icon: <Shield className="h-6 w-6 text-blue-600" />,
      buttonText: "Verify Info Now"
    },
    {
      title: "Crisis Prediction",
      description: "Early warning system for natural disasters, political instability, and economic shifts.",
      icon: <AlertTriangle className="h-6 w-6 text-red-600" />,
      buttonText: "View Predictions"
    },
    {
      title: "Trending Analysis",
      description: "Track real-time verified trends and emerging stories from trusted sources.",
      icon: <TrendingUp className="h-6 w-6 text-green-600" />,
      buttonText: "Explore Trends"
    },
    {
      title: "Data Insights",
      description: "Comprehensive reports and analytics for organizations and decision-makers.",
      icon: <BarChart3 className="h-6 w-6 text-purple-600" />,
      buttonText: "View Reports"
    }
  ];

  const useCases = [
    {
      title: "Media Organizations",
      description: "Verify sources, detect misinformation, and access real-time trend analysis.",
      icon: <Globe className="h-5 w-5" />,
      price: "Custom pricing"
    },
    {
      title: "Government Agencies",
      description: "Early warning systems for crisis management and public safety.",
      icon: <Shield className="h-5 w-5" />,
      price: "Enterprise"
    },
    {
      title: "Research Institutions",
      description: "Access to comprehensive data sets and predictive analytics.",
      icon: <Users className="h-5 w-5" />,
      price: "Academic rates"
    }
  ];

  return (
    <div className="flex-1 space-y-12">
      {/* Main Features Grid */}
      <section>
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Core Features</h2>
          <p className="text-lg text-gray-600">
            Leverage AI-powered intelligence to make informed decisions
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  {feature.icon}
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </div>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-blue-600 hover:bg-blue-700" disabled>
                  {feature.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Use Cases Section */}
      <section>
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Who We Serve</h2>
          <p className="text-lg text-gray-600">
            Tailored solutions for different organizational needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {useCases.map((useCase, index) => (
            <Card key={index} className="text-center hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  {useCase.icon}
                </div>
                <CardTitle className="text-lg">{useCase.title}</CardTitle>
                <CardDescription>{useCase.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="mb-4">
                  {useCase.price}
                </Badge>
                <Link to="/api-organizations">
                  <Button variant="outline" className="w-full">
                    Learn More
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Quick Access</h2>
          <p className="text-lg text-gray-600">
            Jump straight to the tools you need
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/verify">
            <Button variant="outline" className="w-full h-16 text-left flex items-center gap-3">
              <Shield className="h-5 w-5" />
              <span>Verify Information</span>
            </Button>
          </Link>
          <Link to="/predictions">
            <Button variant="outline" className="w-full h-16 text-left flex items-center gap-3">
              <AlertTriangle className="h-5 w-5" />
              <span>Crisis Predictions</span>
            </Button>
          </Link>
          <Link to="/trending">
            <Button variant="outline" className="w-full h-16 text-left flex items-center gap-3">
              <TrendingUp className="h-5 w-5" />
              <span>Trending Alerts</span>
            </Button>
          </Link>
          <Link to="/reports">
            <Button variant="outline" className="w-full h-16 text-left flex items-center gap-3">
              <BarChart3 className="h-5 w-5" />
              <span>Data Reports</span>
            </Button>
          </Link>
        </div>
      </section>

      {/* API Integration Section */}
      <section>
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Zap className="h-8 w-8 text-purple-600" />
            </div>
            <CardTitle className="text-2xl text-purple-900">API for Organizations</CardTitle>
            <CardDescription className="text-purple-700 text-lg">
              Integrate Amniva's intelligence directly into your systems
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-white rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-2">Real-time Verification</h4>
                <p className="text-sm text-gray-600">Instant fact-checking API</p>
              </div>
              <div className="p-4 bg-white rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-2">Trend Analysis</h4>
                <p className="text-sm text-gray-600">Emerging story detection</p>
              </div>
              <div className="p-4 bg-white rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-2">Prediction Models</h4>
                <p className="text-sm text-gray-600">Crisis forecasting engine</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/api-organizations">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  Explore API Documentation
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
                  View Pricing Plans
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Call to Action */}
      <section className="text-center py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Join organizations worldwide that trust Amniva for accurate, real-time intelligence.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/dashboard">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              Access Dashboard
            </Button>
          </Link>
          <Link to="/verify">
            <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
              Try Verification Tool
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default MainContent;
