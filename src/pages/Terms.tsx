
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, ExternalLink, Scale, Users } from 'lucide-react';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <Scale className="h-16 w-16 mx-auto mb-6 text-blue-600" />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Understanding your rights and responsibilities when using our media intelligence 
            platform and technology services.
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Agreement Overview</h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="mb-6">
              Welcome to Amniva, the AI-powered media intelligence platform. By accessing or using 
              our services, you agree to be bound by these Terms of Service and all applicable 
              laws and regulations.
            </p>
            <p className="mb-6">
              These terms govern your use of our platform, including but not limited to:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Media intelligence and analytics tools</li>
              <li>Misinformation detection systems</li>
              <li>Trend analysis and prediction services</li>
              <li>API access and data integration</li>
              <li>User-generated content and submissions</li>
            </ul>
            <p className="mb-6">
              We reserve the right to modify these terms at any time. Continued use of our services 
              constitutes acceptance of any changes.
            </p>
          </div>
        </div>

        {/* Key Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-12 w-12 mb-4 text-blue-600" />
              <CardTitle>User Responsibilities</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base space-y-3">
                <p>As a user of our platform, you agree to:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Provide accurate and truthful information</li>
                  <li>Use services for lawful purposes only</li>
                  <li>Respect intellectual property rights</li>
                  <li>Maintain the security of your account</li>
                  <li>Report any misuse or security issues</li>
                </ul>
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <FileText className="h-12 w-12 mb-4 text-green-600" />
              <CardTitle>Platform Usage Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base space-y-3">
                <p>Our platform may be used for:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Media monitoring and analysis</li>
                  <li>Research and educational purposes</li>
                  <li>Business intelligence gathering</li>
                  <li>Fact-checking and verification</li>
                  <li>Trend analysis and reporting</li>
                </ul>
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Content Ownership */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Intellectual Property & Content Rights
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-purple-900 mb-4">Your Content</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You retain ownership of any content you submit to our platform. By submitting 
                  content, you grant us a license to use, process, and analyze it for the purpose 
                  of providing our services.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  You are responsible for ensuring you have the right to submit any content and 
                  that it doesn't infringe on third-party rights.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-purple-900 mb-4">Our Platform</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Amniva and all related technologies, algorithms, and methodologies are proprietary 
                  to Amnewsworld. Users may not copy, modify, or distribute our platform without 
                  explicit permission.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Generated insights and analysis remain your property, while the underlying 
                  technology and processes remain ours.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Amnewsworld Reference */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Comprehensive Terms Framework
          </h2>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Amniva operates as part of the broader Amnewsworld ecosystem, which includes our 
              news portal, web radio, streaming platform, and various media technology services. 
              Our terms of service are designed to provide comprehensive coverage across all platforms.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              These terms cover user responsibilities, platform usage rules, intellectual property 
              rights, and content ownership as they apply to Amnewsworld's complete suite of media 
              and technology services.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              For the complete terms of service, including detailed sections on liability, 
              dispute resolution, and governing law, please refer to our comprehensive legal 
              documentation.
            </p>
            <a 
              href="https://www.amnewsworld.com/privacy-policy/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex"
            >
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <ExternalLink className="mr-2 h-5 w-5" />
                View Complete Terms of Service
              </Button>
            </a>
          </div>
        </div>

        {/* Service Levels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Service Availability</h3>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                We strive for 99.9% uptime but cannot guarantee uninterrupted service. 
                Scheduled maintenance will be announced in advance.
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Data Accuracy</h3>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                While we use advanced AI for analysis, users should verify critical information 
                independently. We provide intelligence, not absolute truth.
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Account Security</h3>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Users are responsible for maintaining account security. We recommend strong 
                passwords and regular security reviews.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Contact and Support */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Questions About Terms?
          </h2>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              We believe in transparency and are always available to clarify any aspect of our 
              terms of service or answer questions about your rights and responsibilities.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              If you have concerns about compliance, need clarification on usage rights, or 
              want to discuss enterprise agreements, our legal and support teams are here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Contact Legal Team
              </Button>
              <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                Get Support
              </Button>
            </div>
          </div>
        </div>

        {/* Acceptance */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Agreement & Acceptance
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            By using Amniva, you acknowledge that you have read, understood, and agree to be 
            bound by these terms of service and our privacy policy.
          </p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            Return to Platform
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
