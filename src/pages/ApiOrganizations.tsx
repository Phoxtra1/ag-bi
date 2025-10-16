import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Building, 
  Shield, 
  Code, 
  Database, 
  CheckCircle, 
  Globe, 
  Users, 
  BookOpen,
  Mail,
  MessageCircle,
  FileText
} from 'lucide-react';

const ApiOrganizations = () => {
  const features = [
    { icon: <Database className="w-6 h-6" />, title: 'Breaking News & Trends', description: 'Real-time access to verified breaking news and trending topics' },
    { icon: <Globe className="w-6 h-6" />, title: 'Predictive Intelligence', description: 'AI-powered political and climate insights with forecasting capabilities' },
    { icon: <Shield className="w-6 h-6" />, title: 'Live Disaster Reports', description: 'Real-time weather and disaster monitoring with alert systems' },
    { icon: <CheckCircle className="w-6 h-6" />, title: 'Verified Story Flags', description: 'Automated verification and trend validation for content accuracy' }
  ];

  const organizationTypes = [
    { icon: <Building className="w-8 h-8" />, title: 'Media Houses', description: 'News organizations and broadcasting companies' },
    { icon: <Shield className="w-8 h-8" />, title: 'Government Agencies', description: 'Public sector and governmental institutions' },
    { icon: <BookOpen className="w-8 h-8" />, title: 'Research Labs & Universities', description: 'Academic institutions and research facilities' },
    { icon: <Users className="w-8 h-8" />, title: 'Civic Institutions', description: 'Non-profits and civic organizations' }
  ];

  const apiEndpoints = [
    { method: 'GET', endpoint: '/v1/trends', description: 'Retrieve current trending topics and news' },
    { method: 'GET', endpoint: '/v1/predict', description: 'Access predictive insights for specific regions/sectors' },
    { method: 'GET', endpoint: '/v1/verify', description: 'Verify content authenticity and get reliability scores' },
    { method: 'GET', endpoint: '/v1/weather', description: 'Real-time weather and disaster monitoring data' },
    { method: 'POST', endpoint: '/v1/submit', description: 'Submit content for verification and analysis' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Institutional Access to Amniva's API
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
            Get real-time data, insights, and predictive intelligence via secure API endpoints designed for enterprise-grade applications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700"
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
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Who Is This For?</h2>
          <p className="text-center text-gray-600 mb-8">Verified organizations only. Individuals should use our free or pro plans.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {organizationTypes.map((type, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center text-blue-600 mb-2">
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
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">What You'll Get</h2>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="text-blue-600">{feature.icon}</div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-center text-blue-800">API Access Includes</CardTitle>
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
                    <span>API usage dashboard</span>
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
                    <span>Monthly usage analytics</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* API Documentation */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Developer Documentation</h2>
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
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        endpoint.method === 'GET' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {endpoint.method}
                      </span>
                      <code className="font-mono text-sm">{endpoint.endpoint}</code>
                    </div>
                    <span className="text-sm text-gray-600">{endpoint.description}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-gray-900 rounded-lg text-white">
                <h4 className="font-semibold mb-2">Example Request:</h4>
                <code className="text-sm">
                  GET /v1/predict?region=Europe&sector=Politics<br/>
                  Authorization: Bearer YOUR_API_KEY<br/>
                  Content-Type: application/json
                </code>
              </div>

              <div className="mt-6 grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Key Resources:</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Authentication Guide</li>
                    <li>• Available Endpoints</li>
                    <li>• Rate Limits & Usage</li>
                    <li>• Response Formats</li>
                    <li>• SDKs (Python, JavaScript)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Developer Support:</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Code Examples</li>
                    <li>• Error Handling</li>
                    <li>• Best Practices</li>
                    <li>• Troubleshooting</li>
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
                <span>GDPR & Data Compliance</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>API Key Rotation & Encryption</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Abuse Detection & Auto-suspension</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Endpoint SSL/TLS Encryption</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-6 h-6" />
                Support & Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-600" />
                <span>Live Chat for Verified Organizations</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span>Comprehensive API Documentation</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span>Dedicated Account Manager</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600" />
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
