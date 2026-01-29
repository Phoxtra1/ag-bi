import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Building2, 
  Shield, 
  Code, 
  Database, 
  CheckCircle, 
  Globe, 
  Users, 
  BookOpen,
  Mail,
  MessageCircle,
  FileText,
  TrendingUp,
  BarChart3,
  LineChart
} from 'lucide-react';

const ApiOrganizations = () => {
  const features = [
    { icon: <TrendingUp className="w-6 h-6" />, title: 'Market Intelligence', description: 'Real-time access to verified market data and business trends' },
    { icon: <BarChart3 className="w-6 h-6" />, title: 'Predictive Analytics', description: 'AI-powered economic forecasting and risk assessment capabilities' },
    { icon: <Shield className="w-6 h-6" />, title: 'Data Verification', description: 'Cross-referenced business data validation and credibility scoring' },
    { icon: <LineChart className="w-6 h-6" />, title: 'Investment Signals', description: 'Automated trend detection and investment opportunity alerts' }
  ];

  const organizationTypes = [
    { icon: <Building2 className="w-8 h-8" />, title: 'Financial Institutions', description: 'Banks, investment firms, and asset managers' },
    { icon: <Shield className="w-8 h-8" />, title: 'Enterprise Organizations', description: 'Corporate strategy and risk management teams' },
    { icon: <BookOpen className="w-8 h-8" />, title: 'Research & Analytics', description: 'Market research firms and economic think tanks' },
    { icon: <Users className="w-8 h-8" />, title: 'Consulting Firms', description: 'Management and financial advisory services' }
  ];

  const apiEndpoints = [
    { method: 'GET', endpoint: '/v1/trends', description: 'Retrieve current market trends and business signals' },
    { method: 'GET', endpoint: '/v1/forecast', description: 'Access economic predictions for specific sectors/regions' },
    { method: 'GET', endpoint: '/v1/verify', description: 'Validate business data and get credibility scores' },
    { method: 'GET', endpoint: '/v1/risk', description: 'Real-time risk assessment and market volatility data' },
    { method: 'POST', endpoint: '/v1/analyze', description: 'Submit data for comprehensive analysis and insights' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Enterprise API Access
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto mb-8">
            Integrate Amniva's business intelligence, market forecasting, and data verification capabilities directly into your enterprise systems.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => window.location.href = '/login'}
            >
              Apply for API Access
            </Button>
            <Button size="lg" variant="outline">
              View Documentation
            </Button>
          </div>
        </div>

        {/* Who Is This For Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Who Is This For?</h2>
          <p className="text-center text-muted-foreground mb-8">Enterprise organizations requiring institutional-grade business intelligence.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {organizationTypes.map((type, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center text-primary mb-2">
                    {type.icon}
                  </div>
                  <CardTitle className="text-lg">{type.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{type.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* What You'll Get Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">What You'll Get</h2>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="text-primary">{feature.icon}</div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-center text-primary">Enterprise API Includes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Full API access under Institutional Plan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Secure, encrypted endpoints</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Real-time usage analytics dashboard</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Up to 10,000 requests/minute</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Dedicated technical support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Custom integration assistance</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* API Documentation */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Developer Documentation</h2>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-6 h-6" />
                API Endpoints Overview
              </CardTitle>
              <CardDescription>
                Once approved, you'll have access to these secure endpoints with your API key.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apiEndpoints.map((endpoint, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        endpoint.method === 'GET' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                      }`}>
                        {endpoint.method}
                      </span>
                      <code className="font-mono text-sm">{endpoint.endpoint}</code>
                    </div>
                    <span className="text-sm text-muted-foreground">{endpoint.description}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-gray-900 rounded-lg text-white">
                <h4 className="font-semibold mb-2">Example Request:</h4>
                <code className="text-sm">
                  GET /v1/forecast?region=Europe&sector=Technology<br/>
                  Authorization: Bearer YOUR_API_KEY<br/>
                  Content-Type: application/json
                </code>
              </div>

              <div className="mt-6 grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Key Resources:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Authentication Guide</li>
                    <li>• Available Endpoints</li>
                    <li>• Rate Limits & Quotas</li>
                    <li>• Response Formats</li>
                    <li>• SDKs (Python, JavaScript)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Developer Support:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Code Examples</li>
                    <li>• Error Handling</li>
                    <li>• Best Practices</li>
                    <li>• Integration Patterns</li>
                    <li>• Changelog Updates</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security & Support */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-6 h-6" />
                Security & Compliance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>GDPR & SOC 2 Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>API Key Rotation & Encryption</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Anomaly Detection & Auto-suspension</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>End-to-end SSL/TLS Encryption</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-6 h-6" />
                Enterprise Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                <span>Priority Support for Enterprise Clients</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                <span>Comprehensive API Documentation</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span>Dedicated Account Manager</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span>99.9% Uptime SLA Guarantee</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ApiOrganizations;
