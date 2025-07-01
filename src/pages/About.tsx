
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, TrendingUp, Zap, Target, Heart, Globe, ExternalLink } from 'lucide-react';

const About = () => {
  const coreValues = [
    {
      title: "Accuracy First",
      description: "We prioritize truth and verification above all else, ensuring every insight is backed by credible data.",
      icon: <Shield className="h-6 w-6 text-blue-600" />
    },
    {
      title: "Innovation-Driven",
      description: "We continuously push the boundaries of what's possible in media intelligence and AI analytics.",
      icon: <Zap className="h-6 w-6 text-yellow-600" />
    },
    {
      title: "Global Impact",
      description: "Our mission extends beyond borders, serving communities and organizations worldwide.",
      icon: <Globe className="h-6 w-6 text-green-600" />
    },
    {
      title: "Purpose-Driven",
      description: "As a bootstrapped company, we remain focused on our mission rather than external pressures.",
      icon: <Heart className="h-6 w-6 text-red-600" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            About <span className="text-blue-600">Amniva</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Where AI-powered analytics transform raw reports into actionable insights. Discover trends, 
            verify patterns, and understand the bigger picture behind global information flows.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white mb-16">
          <div className="text-center">
            <Target className="h-12 w-12 mx-auto mb-6 text-yellow-400" />
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-xl leading-relaxed max-w-4xl mx-auto">
              To transform media technology through artificial intelligence, environmental monitoring, 
              and general broadcasting innovation. We empower organizations and individuals with the 
              intelligence they need to make informed decisions in an increasingly complex information landscape.
            </p>
          </div>
        </div>

        {/* What We Do */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">What We Do</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                <CardTitle>Media Intelligence</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Advanced AI algorithms analyze global media patterns, detect emerging trends, 
                  and provide predictive insights for better decision-making.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="h-12 w-12 mx-auto mb-4 text-green-600" />
                <CardTitle>Misinformation Detection</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Real-time verification systems that combat false information and promote 
                  accurate, trustworthy content across digital platforms.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Zap className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                <CardTitle>Predictive Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Forecast environmental, economic, and social developments using sophisticated 
                  machine learning models and comprehensive data analysis.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Our Venture */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Our Venture</h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Amniva is the flagship media intelligence tool developed by <strong>Amnewsworld</strong>, 
              a pioneering media technology company. This groundbreaking invention represents our commitment 
              to revolutionizing how information is processed, verified, and understood in the digital age.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Through Amnewsworld's comprehensive ecosystem of news portal, web radio, and streaming platform, 
              we've created an integrated approach to media consumption and intelligence gathering. Amniva 
              serves as the analytical backbone, providing the predictions and misinformation detection 
              capabilities that set our platform apart.
            </p>
            <div className="text-center">
              <a 
                href="https://www.amnewsworld.com/amn-news-agency/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex"
              >
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <ExternalLink className="mr-2 h-5 w-5" />
                  Learn More About Amnewsworld
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {coreValues.map((value, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    {value.icon}
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Vision & Goals */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Our Vision & Goals</h2>
          <div className="max-w-4xl mx-auto space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-purple-900 mb-3">Long-term Vision</h3>
              <p className="text-gray-700 leading-relaxed">
                To become the world's most trusted source of media intelligence, empowering individuals, 
                organizations, and governments with the insights they need to navigate an increasingly 
                complex information ecosystem. We envision a future where misinformation is obsolete 
                and decision-making is powered by verified, actionable intelligence.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-purple-900 mb-3">Immediate Goals</h3>
              <p className="text-gray-700 leading-relaxed">
                Our focus remains on expanding our AI capabilities, enhancing prediction accuracy, 
                and building stronger partnerships with media organizations worldwide. As a bootstrapped, 
                purpose-driven company, we prioritize sustainable growth that aligns with our mission 
                to democratize access to verified information.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Join Us in Shaping the Future
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Whether you're a media professional, researcher, or organization seeking reliable intelligence, 
            Amniva provides the tools you need to stay ahead of the curve.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Get Started with Amniva
            </Button>
            <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
              Contact Our Team
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
