
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  const [formData, setFormData] = useState({
    organizationName: '',
    organizationEmail: '',
    website: '',
    country: '',
    sector: '',
    useCase: '',
    document: null as File | null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, document: file }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('API Access Request:', formData);
    // Here you would typically send the data to your backend
    alert('API access request submitted! We will review and contact you within 2-3 business days.');
  };

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
            Institutional Access to Amnova's API
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
            Get real-time data, insights, and predictive intelligence via secure API endpoints designed for enterprise-grade applications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
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

        {/* Registration Form */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Registration & Verification</h2>
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>API Access Application</CardTitle>
              <CardDescription>
                Complete this form to request institutional API access. Our team will verify your organization and contact you within 2-3 business days.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Organization Name *
                    </label>
                    <Input
                      name="organizationName"
                      value={formData.organizationName}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your organization name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Organization Email *
                    </label>
                    <Input
                      type="email"
                      name="organizationEmail"
                      value={formData.organizationEmail}
                      onChange={handleInputChange}
                      required
                      placeholder="contact@organization.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website *
                    </label>
                    <Input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      required
                      placeholder="https://www.organization.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country *
                    </label>
                    <Input
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your country"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sector *
                  </label>
                  <select
                    name="sector"
                    value={formData.sector}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select your sector</option>
                    <option value="media">Media & Broadcasting</option>
                    <option value="government">Government Agency</option>
                    <option value="academic">Academic & Research</option>
                    <option value="civic">Civic Institution</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Intended Use Case *
                  </label>
                  <Textarea
                    name="useCase"
                    value={formData.useCase}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    placeholder="Describe how you plan to use Amnova's API services..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Verification Document *
                  </label>
                  <Input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Upload Certificate of Incorporation, Academic License, or Media License
                  </p>
                </div>

                <Button type="submit" size="lg" className="w-full">
                  Submit API Access Request
                </Button>
              </form>
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
                <Users className="w-5 h-5 text-blue-600" />
                <span>Dedicated Slack Channel</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span>Developer Forum Access</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span>Troubleshooting & Documentation</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-gray-700">
            <strong>Important:</strong> API Access is governed by our terms of use. Unauthorized sharing of keys or data resale is strictly prohibited. 
            All API requests are logged and monitored for compliance.
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Once approved, you'll receive dashboard access to manage your API usage, monitor requests, and access advanced organizational features.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ApiOrganizations;
