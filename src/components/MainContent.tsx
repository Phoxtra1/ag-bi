import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Shield, TrendingUp, FileText, BarChart3, Building2, Briefcase, Users, Zap } from 'lucide-react';

const MainContent = () => {
  const features = [
    {
      title: "Verify",
      description: "Cross-check and validate datasets, reports, claims, and submitted information with credibility assessment.",
      icon: <Shield className="h-6 w-6 text-green-600" />,
      buttonText: "Submit for Verification"
    },
    {
      title: "Info",
      description: "Transform existing data and research into structured insights, summaries, and interpretations.",
      icon: <FileText className="h-6 w-6 text-blue-600" />,
      buttonText: "Generate Insight"
    },
    {
      title: "Prediction",
      description: "Business, market, economic, and risk forecasting based on verified data and trend analysis.",
      icon: <TrendingUp className="h-6 w-6 text-amber-600" />,
      buttonText: "Run Prediction"
    },
    {
      title: "Business Trends",
      description: "Track real-time business, market, trade, and investment trends from verified sources.",
      icon: <BarChart3 className="h-6 w-6 text-purple-600" />,
      buttonText: "View Trends"
    }
  ];

  const useCases = [
    {
      title: "Financial Institutions",
      description: "Risk assessment, market forecasting, and data validation for informed decisions.",
      icon: <Building2 className="h-5 w-5" />,
      price: "Enterprise"
    },
    {
      title: "Corporate Strategy",
      description: "Business intelligence, trend analysis, and competitive insights.",
      icon: <Briefcase className="h-5 w-5" />,
      price: "Custom pricing"
    },
    {
      title: "Research Institutions",
      description: "Data verification, structured insights, and predictive analytics.",
      icon: <Users className="h-5 w-5" />,
      price: "Institutional rates"
    }
  ];

  return (
    <div className="flex-1 space-y-12">
      {/* Main Features Grid */}
      <section>
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">Core Capabilities</h2>
          <p className="text-lg text-muted-foreground">
            Transform data into actionable intelligence with our comprehensive platform
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow border-border">
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
                <Button className="w-full bg-primary hover:bg-primary/90" disabled>
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
          <h2 className="text-3xl font-bold text-foreground mb-4">Who We Serve</h2>
          <p className="text-lg text-muted-foreground">
            Intelligence solutions for business and institutional needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {useCases.map((useCase, index) => (
            <Card key={index} className="text-center hover:shadow-md transition-shadow border-border">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center mb-4">
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
      <section className="bg-gradient-to-r from-slate-50 to-amber-50 dark:from-slate-900 dark:to-amber-950/20 rounded-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">Quick Access</h2>
          <p className="text-lg text-muted-foreground">
            Jump straight to the tools you need
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/verify">
            <Button variant="outline" className="w-full h-16 text-left flex items-center gap-3">
              <Shield className="h-5 w-5" />
              <span>Verify Data</span>
            </Button>
          </Link>
          <Link to="/reports">
            <Button variant="outline" className="w-full h-16 text-left flex items-center gap-3">
              <FileText className="h-5 w-5" />
              <span>Generate Insight</span>
            </Button>
          </Link>
          <Link to="/predictions">
            <Button variant="outline" className="w-full h-16 text-left flex items-center gap-3">
              <TrendingUp className="h-5 w-5" />
              <span>Run Prediction</span>
            </Button>
          </Link>
          <Link to="/trending">
            <Button variant="outline" className="w-full h-16 text-left flex items-center gap-3">
              <BarChart3 className="h-5 w-5" />
              <span>View Trends</span>
            </Button>
          </Link>
        </div>
      </section>

      {/* API Integration Section */}
      <section>
        <Card className="bg-gradient-to-r from-slate-50 to-amber-50 dark:from-slate-900 dark:to-amber-950/20 border-amber-200 dark:border-amber-800">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-4">
              <Zap className="h-8 w-8 text-amber-600" />
            </div>
            <CardTitle className="text-2xl">API for Organizations</CardTitle>
            <CardDescription className="text-lg">
              Integrate Amniva's intelligence directly into your systems
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-white dark:bg-slate-800 rounded-lg">
                <h4 className="font-semibold mb-2">Verification API</h4>
                <p className="text-sm text-muted-foreground">Instant data validation</p>
              </div>
              <div className="p-4 bg-white dark:bg-slate-800 rounded-lg">
                <h4 className="font-semibold mb-2">Trend Analysis</h4>
                <p className="text-sm text-muted-foreground">Market intelligence feeds</p>
              </div>
              <div className="p-4 bg-white dark:bg-slate-800 rounded-lg">
                <h4 className="font-semibold mb-2">Prediction Models</h4>
                <p className="text-sm text-muted-foreground">Forecasting engine access</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/api-organizations">
                <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900">
                  Explore API Documentation
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="outline">
                  View Pricing Plans
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Call to Action */}
      <section className="text-center py-12">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join organizations worldwide that trust Amniva for verified intelligence and data-driven insights.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/verify">
            <Button size="lg" variant="outline">
              Submit for Verification
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default MainContent;