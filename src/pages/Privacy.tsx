
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, ExternalLink, FileText } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <Shield className="h-16 w-16 mx-auto mb-6 text-blue-600" />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Your privacy and data security are fundamental to our mission. Learn how we protect 
            your information across our media and technology platforms.
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Commitment to Privacy</h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="mb-6">
              At Amniva, we recognize that privacy is a fundamental right. As a media intelligence 
              platform that processes vast amounts of information, we are committed to maintaining 
              the highest standards of data protection and transparency.
            </p>
            <p className="mb-6">
              This privacy policy outlines how we collect, use, protect, and manage your personal 
              information across our media and technology services. We believe in being completely 
              transparent about our data practices.
            </p>
            <p className="mb-6">
              Our approach to privacy is built on the principles of:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Minimal data collection - we only collect what's necessary</li>
              <li>Transparent processing - you know exactly how your data is used</li>
              <li>User control - you have full control over your information</li>
              <li>Security first - your data is protected with industry-leading security</li>
              <li>Compliance - we adhere to all applicable privacy regulations</li>
            </ul>
          </div>
        </div>

        {/* Key Areas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <FileText className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <CardTitle>Data Collection</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                We collect only the information necessary to provide our media intelligence 
                services and improve your experience on our platform.
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Shield className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <CardTitle>Data Protection</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Your information is secured using enterprise-grade encryption, secure storage, 
                and regular security audits to prevent unauthorized access.
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <ExternalLink className="h-12 w-12 mx-auto mb-4 text-purple-600" />
              <CardTitle>Third-Party Sharing</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                We do not sell your personal data. Information is shared only with your 
                consent or as required by law to provide our services.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Amnewsworld Reference */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Comprehensive Privacy Framework
          </h2>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              As part of the Amnewsworld ecosystem, Amniva operates under a comprehensive privacy 
              framework that covers all aspects of our media and technology operations. This includes 
              our news portal, web radio, streaming platform, and AI-powered intelligence tools.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              For detailed information about our complete privacy practices, data handling procedures, 
              and your rights as a user, please refer to our comprehensive privacy policy hosted on 
              our main platform.
            </p>
            <a 
              href="https://www.amnewsworld.com/privacy-policy/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex"
            >
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <ExternalLink className="mr-2 h-5 w-5" />
                View Complete Privacy Policy
              </Button>
            </a>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Privacy Questions?</h2>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              We're committed to transparency and are always available to answer any questions 
              about our privacy practices or how your data is handled.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-left">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Your Rights Include:</h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• Access to your personal data</li>
                  <li>• Correction of inaccurate information</li>
                  <li>• Deletion of your data</li>
                  <li>• Data portability</li>
                  <li>• Withdrawal of consent</li>
                </ul>
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Contact Options:</h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• Email our privacy team</li>
                  <li>• Use our contact form</li>
                  <li>• Submit a data request</li>
                  <li>• Schedule a consultation</li>
                  <li>• File a privacy concern</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Privacy-First Innovation
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience the future of media intelligence with confidence, knowing your privacy 
            is protected every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Contact Privacy Team
            </Button>
            <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
              Return to Platform
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;
