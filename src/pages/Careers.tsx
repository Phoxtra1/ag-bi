
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Globe, Code, Lightbulb, Heart, ExternalLink, BarChart3, Shield } from 'lucide-react';

const Careers = () => {
  const departments = [
    {
      title: "Data Science & Analytics",
      description: "Data scientists, analysts, and ML engineers who transform raw data into actionable business intelligence.",
      icon: <BarChart3 className="h-8 w-8 text-primary" />
    },
    {
      title: "Technology & Engineering",
      description: "Developers, AI specialists, and engineers building the future of business intelligence infrastructure.",
      icon: <Code className="h-8 w-8 text-primary" />
    },
    {
      title: "Research & Verification",
      description: "Researchers, analysts, and verification specialists who ensure data accuracy and insight reliability.",
      icon: <Shield className="h-8 w-8 text-primary" />
    },
    {
      title: "Operations & Strategy",
      description: "Business development, client success, operations, and strategic planning professionals.",
      icon: <Globe className="h-8 w-8 text-primary" />
    }
  ];

  const benefits = [
    "Remote-friendly work environment",
    "Flexible working hours across time zones",
    "Professional development opportunities",
    "Collaborative and innovative culture",
    "Direct impact on business intelligence industry",
    "Competitive compensation packages",
    "Health and wellness support",
    "Continuing education support"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Join Our <span className="text-primary">Mission</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8">
            Are you passionate about data, technology, and making a real difference in how organizations 
            make decisions? Join our dynamic team of innovators, analysts, and technologists 
            who are reshaping the future of business intelligence.
          </p>
          
          <div className="bg-muted rounded-2xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Why Work With Us?</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              At Amniva, you're not just taking a job – you're joining a purpose-driven 
              mission to transform how businesses verify information, generate insights, and 
              forecast outcomes. Every team member plays a crucial role in 
              building the next generation of intelligence technology.
            </p>
          </div>
        </div>

        {/* Departments */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Opportunities Across Departments
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {departments.map((dept, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4">
                    {dept.icon}
                  </div>
                  <CardTitle className="text-xl">{dept.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-base">
                    {dept.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Culture & Values */}
        <div className="bg-card rounded-2xl shadow-lg p-8 md:p-12 mb-16 border">
          <h2 className="text-3xl font-bold text-foreground text-center mb-8">Our Culture & Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Heart className="h-12 w-12 mx-auto mb-4 text-accent" />
              <h3 className="text-xl font-semibold text-foreground mb-4">Inclusive & Diverse</h3>
              <p className="text-muted-foreground">
                We celebrate diverse perspectives and create an environment where everyone can 
                contribute their unique talents and viewpoints.
              </p>
            </div>
            <div className="text-center">
              <Globe className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold text-foreground mb-4">Remote-Friendly</h3>
              <p className="text-muted-foreground">
                Work from anywhere in the world. Our distributed team collaborates seamlessly 
                across time zones and continents.
              </p>
            </div>
            <div className="text-center">
              <Lightbulb className="h-12 w-12 mx-auto mb-4 text-accent" />
              <h3 className="text-xl font-semibold text-foreground mb-4">Innovation-Driven</h3>
              <p className="text-muted-foreground">
                We encourage experimentation, learning from failures, and pushing the boundaries 
                of what's possible in business intelligence.
              </p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">Benefits & Perks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                <span className="text-muted-foreground">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Application Process */}
        <div className="bg-muted rounded-2xl p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-8">How to Apply</h2>
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Specific Positions</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Check our current job openings below and apply directly for positions that match 
                  your skills and interests. Each listing includes detailed requirements and 
                  application instructions.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Open Applications</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Don't see the perfect role? We welcome expressions of interest from passionate 
                  individuals who want to contribute to our mission, even if there isn't a 
                  current opening that fits.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Current Openings Placeholder */}
        <div className="bg-card rounded-2xl shadow-lg p-8 md:p-12 mb-16 border">
          <h2 className="text-3xl font-bold text-foreground text-center mb-8">Current Openings</h2>
          <div className="text-center text-muted-foreground">
            <p className="text-lg mb-6">
              We're always looking for talented individuals to join our team. 
              Current job listings will be posted here as positions become available.
            </p>
            <p className="text-sm">
              In the meantime, feel free to send us your resume and a note about how you'd like to contribute.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 md:p-12 text-primary-foreground">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Make an Impact?
          </h2>
          <p className="text-primary-foreground/80 mb-8 text-lg">
            Join us in building the future of business intelligence and data-driven decision making.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://amineva.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex"
            >
              <Button size="lg" className="bg-background text-primary hover:bg-background/90">
                <ExternalLink className="mr-2 h-5 w-5" />
                Learn More About Amineva Global
              </Button>
            </a>
            <a href="mailto:careers@amniva.io">
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Send Application
              </Button>
            </a>
          </div>
          <p className="text-primary-foreground/60 text-sm mt-6">
            For all career inquiries, please contact careers@amniva.io
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Careers;
