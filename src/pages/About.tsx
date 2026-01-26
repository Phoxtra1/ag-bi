import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, TrendingUp, Zap, Target, Heart, Globe } from 'lucide-react';

const About = () => {
  const coreValues = [
    {
      title: "Accuracy First",
      description: "We prioritize truth and verification above all else, ensuring every insight is backed by credible data.",
      icon: <Shield className="h-6 w-6 text-amber-600" />
    },
    {
      title: "Innovation-Driven",
      description: "We continuously push the boundaries of what's possible in business intelligence and AI analytics.",
      icon: <Zap className="h-6 w-6 text-amber-600" />
    },
    {
      title: "Global Impact",
      description: "Our mission extends beyond borders, serving businesses and institutions worldwide.",
      icon: <Globe className="h-6 w-6 text-green-600" />
    },
    {
      title: "Purpose-Driven",
      description: "As a bootstrapped company, we remain focused on our mission rather than external pressures.",
      icon: <Heart className="h-6 w-6 text-red-600" />
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            About <span className="text-amber-500">Amniva</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            A business intelligence platform that transforms raw data into actionable insights. 
            Verify information, predict trends, and understand the bigger picture behind your data.
          </p>
        </div>

        <div className="bg-gradient-to-r from-[#0a1628] to-[#0f2847] rounded-2xl p-8 md:p-12 text-white mb-16">
          <div className="text-center">
            <Target className="h-12 w-12 mx-auto mb-6 text-amber-400" />
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-xl leading-relaxed max-w-4xl mx-auto text-slate-300">
              To empower organizations with verified intelligence for data-driven decision making. 
              We transform complex information into clear, actionable insights that drive business success.
            </p>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">What We Do</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-amber-500" />
                <CardTitle>Business Intelligence</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Advanced AI algorithms analyze market patterns, detect emerging trends, 
                  and provide predictive insights for better decision-making.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="h-12 w-12 mx-auto mb-4 text-green-600" />
                <CardTitle>Data Verification</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Real-time verification systems that validate claims and ensure 
                  accurate, trustworthy data for your organization.
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
                  Forecast business, economic, and market developments using sophisticated 
                  machine learning models and comprehensive data analysis.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="bg-card rounded-2xl shadow-lg p-8 md:p-12 mb-16 border">
          <h2 className="text-3xl font-bold text-foreground text-center mb-8">Our Venture</h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Amniva is the flagship business intelligence platform developed by <strong>Amineva Global</strong>. 
              This represents our commitment to revolutionizing how organizations process, verify, and 
              understand data in the digital age.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Through our integrated ecosystem of verification, insight generation, and predictive analytics, 
              we've created a comprehensive approach to business intelligence that empowers informed decision-making.
            </p>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">Our Core Values</h2>
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
                  <CardDescription className="text-base">{value.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">Join Us in Shaping the Future</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Whether you're a business, researcher, or institution seeking reliable intelligence, 
            Amniva provides the tools you need to stay ahead.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-slate-900">
              Get Started with Amniva
            </Button>
            <Button size="lg" variant="outline">
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