
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Radio, Play, BarChart3, ExternalLink } from 'lucide-react';

const Amnewsworld = () => {
  const platforms = [
    {
      title: "News Portal",
      description: "Comprehensive global news coverage with verified reporting and real-time updates.",
      icon: <Globe className="h-8 w-8 text-blue-600" />
    },
    {
      title: "Web Radio",
      description: "Live streaming radio with news bulletins, discussions, and diverse programming.",
      icon: <Radio className="h-8 w-8 text-green-600" />
    },
    {
      title: "Streaming Platform",
      description: "On-demand content including documentaries, interviews, and live broadcasts.",
      icon: <Play className="h-8 w-8 text-purple-600" />
    },
    {
      title: "Amniva Intelligence",
      description: "AI-powered media intelligence tools for broadcast and content analytics.",
      icon: <BarChart3 className="h-8 w-8 text-orange-600" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-blue-600">Amnewsworld</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
            A pioneering global media startup revolutionizing how the world consumes and understands news. 
            We combine traditional journalism with cutting-edge technology to deliver credible, timely, 
            and diverse news content across multiple platforms.
          </p>
          
          <div className="bg-blue-50 rounded-2xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              To democratize access to verified information and empower global audiences with the tools 
              they need to stay informed, engaged, and connected to the world around them. Through our 
              integrated ecosystem of news portal, web radio, streaming platform, and AI-powered 
              intelligence tools, we're building the future of media consumption.
            </p>
          </div>
        </div>

        {/* Platforms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {platforms.map((platform, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4">
                  {platform.icon}
                </div>
                <CardTitle className="text-xl">{platform.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base">
                  {platform.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Why Choose Amnewsworld */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Why Choose Amnewsworld?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Credible Reporting</h3>
              <p className="text-gray-700">
                Every story is verified through our rigorous fact-checking process and AI-powered 
                verification systems, ensuring you receive only accurate information.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Global Perspective</h3>
              <p className="text-gray-700">
                Our diverse team of international correspondents and local reporters brings you 
                stories from every corner of the world with authentic, on-ground insights.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Innovation-Driven</h3>
              <p className="text-gray-700">
                We leverage cutting-edge technology including AI, machine learning, and advanced 
                analytics to enhance storytelling and combat misinformation.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Experience the Future of News
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Join millions of readers worldwide who trust Amnewsworld for their daily news consumption. 
            Discover stories that matter, insights that inspire, and perspectives that broaden your understanding.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://www.amnewsworld.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex"
            >
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <ExternalLink className="mr-2 h-5 w-5" />
                Explore Amnewsworld Portal
              </Button>
            </a>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Learn About Our Services
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Amnewsworld;
