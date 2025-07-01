
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Globe, Code, Lightbulb, Heart, ExternalLink } from 'lucide-react';

const Careers = () => {
  const departments = [
    {
      title: "Media & Journalism",
      description: "Content creators, editors, fact-checkers, and media analysts passionate about truth and storytelling.",
      icon: <Users className="h-8 w-8 text-blue-600" />
    },
    {
      title: "Technology & Engineering",
      description: "Developers, AI specialists, data scientists, and engineers building the future of media intelligence.",
      icon: <Code className="h-8 w-8 text-green-600" />
    },
    {
      title: "Research & Analytics",
      description: "Researchers, analysts, and strategists who transform data into actionable insights.",
      icon: <Lightbulb className="h-8 w-8 text-purple-600" />
    },
    {
      title: "Operations & Strategy",
      description: "Business development, marketing, operations, and strategic planning professionals.",
      icon: <Globe className="h-8 w-8 text-orange-600" />
    }
  ];

  const benefits = [
    "Remote-friendly work environment",
    "Flexible working hours across time zones",
    "Professional development opportunities",
    "Collaborative and innovative culture",
    "Direct impact on global media landscape",
    "Competitive compensation packages",
    "Health and wellness support",
    "Continuing education support"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Join Our <span className="text-blue-600">Mission</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
            Are you passionate about media, technology, and making a real difference in how the world 
            consumes information? Join our dynamic team of innovators, journalists, and technologists 
            who are reshaping the future of media intelligence.
          </p>
          
          <div className="bg-blue-50 rounded-2xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Work With Us?</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              At Amniva and Amnewsworld, you're not just taking a job – you're joining a purpose-driven 
              mission to combat misinformation, democratize access to verified information, and build 
              the next generation of media technology. Every team member plays a crucial role in 
              creating a more informed world.
            </p>
          </div>
        </div>

        {/* Departments */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
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
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Our Culture & Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Heart className="h-12 w-12 mx-auto mb-4 text-red-600" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Inclusive & Diverse</h3>
              <p className="text-gray-700">
                We celebrate diverse perspectives and create an environment where everyone can 
                contribute their unique talents and viewpoints.
              </p>
            </div>
            <div className="text-center">
              <Globe className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Remote-Friendly</h3>
              <p className="text-gray-700">
                Work from anywhere in the world. Our distributed team collaborates seamlessly 
                across time zones and continents.
              </p>
            </div>
            <div className="text-center">
              <Lightbulb className="h-12 w-12 mx-auto mb-4 text-yellow-600" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Innovation-Driven</h3>
              <p className="text-gray-700">
                We encourage experimentation, learning from failures, and pushing the boundaries 
                of what's possible in media technology.
              </p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Benefits & Perks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Application Process */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">How to Apply</h2>
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-purple-900 mb-3">Specific Positions</h3>
                <p className="text-gray-700 leading-relaxed">
                  Check our current job openings below and apply directly for positions that match 
                  your skills and interests. Each listing includes detailed requirements and 
                  application instructions.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-purple-900 mb-3">Open Applications</h3>
                <p className="text-gray-700 leading-relaxed">
                  Don't see the perfect role? We welcome expressions of interest from passionate 
                  individuals who want to contribute to our mission, even if there isn't a 
                  current opening that fits.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Current Openings Placeholder */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Current Openings</h2>
          <div className="text-center text-gray-600">
            <p className="text-lg mb-6">
              We're always looking for talented individuals to join our team. 
              Current job listings will be posted here as positions become available.
            </p>
            <p className="text-sm text-gray-500">
              In the meantime, feel free to send us your resume and a note about how you'd like to contribute.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Make an Impact?
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Join us in building the future of media intelligence and creating a more informed world.
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
                Learn More About Amnewsworld
              </Button>
            </a>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Send Application
            </Button>
          </div>
          <p className="text-blue-200 text-sm mt-6">
            For all career inquiries, please contact our HR team or visit our main website for more information.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Careers;
