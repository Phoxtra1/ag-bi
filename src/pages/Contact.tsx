
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import { Mail } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <Mail className="h-16 w-16 mx-auto mb-6 text-blue-600" />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Have questions about Amniva or Amnewsworld? We'd love to hear from you. 
            Send us a message and our team will respond within 48 hours.
          </p>
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <ContactForm />
          </div>
        </div>

        {/* Additional Info */}
        <div className="max-w-2xl mx-auto mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Why Contact Amniva?
            </h3>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Media Intelligence</h4>
                <p className="text-gray-700 text-sm">
                  Questions about our AI-powered analytics and media intelligence tools.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Partnerships</h4>
                <p className="text-gray-700 text-sm">
                  Interested in collaborating with Amnewsworld or integrating our services.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Support</h4>
                <p className="text-gray-700 text-sm">
                  Need help with your account, billing, or technical issues.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Feedback</h4>
                <p className="text-gray-700 text-sm">
                  Share your thoughts on how we can improve our platform and services.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
