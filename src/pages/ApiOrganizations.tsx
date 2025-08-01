
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Users, Globe, TrendingUp, Shield, Zap } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ApiRequestForm from '@/components/ApiRequestForm';

const ApiOrganizations = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const organizations = [
    {
      name: 'Global News Network',
      type: 'Media Organization',
      members: '2,500+',
      integration: 'Full API Access',
      status: 'Active',
      description: 'International news conglomerate utilizing our real-time verification and prediction APIs.',
      logo: '🌐'
    },
    {
      name: 'TechCorp Solutions',
      type: 'Technology Company',
      members: '850+',
      integration: 'Custom Integration',
      status: 'Active',
      description: 'Leading technology firm integrating our AI-powered news analysis into their products.',
      logo: '💻'
    },
    {
      name: 'Academic Research Institute',
      type: 'Educational Institution',
      members: '1,200+',
      integration: 'Research API',
      status: 'Active',
      description: 'Research institution studying media trends and information verification patterns.',
      logo: '🎓'
    }
  ];

  const apiFeatures = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Real-time Verification',
      description: 'Instant fact-checking and source validation'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Trend Analysis',
      description: 'Predictive analytics for news trends and patterns'
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Global Coverage',
      description: 'Worldwide news sources and multilingual support'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'High Performance',
      description: '99.9% uptime with sub-second response times'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              API for Organizations
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Integrate AMNews' powerful AI-driven news analysis and verification tools into your organization's workflow.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="organizations">Organizations</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="apply">Apply for API Access</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <Building2 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">150+</div>
                    <div className="text-sm text-gray-600">Partner Organizations</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">50K+</div>
                    <div className="text-sm text-gray-600">Active API Users</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Globe className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">99.9%</div>
                    <div className="text-sm text-gray-600">Uptime Guarantee</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">1M+</div>
                    <div className="text-sm text-gray-600">API Calls/Day</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Why Choose AMNews API?</CardTitle>
                  <CardDescription>
                    Our API provides enterprise-grade news analysis and verification tools trusted by leading organizations worldwide.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {apiFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 text-blue-600">
                          {feature.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                          <p className="text-gray-600">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="organizations" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {organizations.map((org, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <div className="text-4xl">{org.logo}</div>
                        <div className="flex-1">
                          <CardTitle className="flex items-center justify-between">
                            {org.name}
                            <Badge variant={org.status === 'Active' ? 'default' : 'secondary'}>
                              {org.status}
                            </Badge>
                          </CardTitle>
                          <CardDescription>{org.type}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{org.description}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-900">Members:</span>
                          <span className="text-gray-600 ml-2">{org.members}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">Integration:</span>
                          <span className="text-gray-600 ml-2">{org.integration}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="features" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {apiFeatures.map((feature, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-3">
                        <div className="text-blue-600">{feature.icon}</div>
                        <span>{feature.title}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="apply">
              <Card>
                <CardHeader>
                  <CardTitle>Apply for API Access</CardTitle>
                  <CardDescription>
                    Submit your application to join our network of partner organizations and access our powerful API suite.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ApiRequestForm />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ApiOrganizations;
