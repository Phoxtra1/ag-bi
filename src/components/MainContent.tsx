
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, TrendingUp, FileText, Clock, Award, Users, Star, Code, HelpCircle } from 'lucide-react';

const MainContent = () => {
  const testimonials = [
    {
      quote: "Amniva helped our school identify fake articles before a seminar.",
      author: "Educator"
    },
    {
      quote: "I love the prediction alerts. Feels like the future is now.",
      author: "Journalist"
    },
    {
      quote: "The API integration saved us weeks of development time.",
      author: "Tech Lead"
    }
  ];

  const faqItems = [
    {
      question: "What is Amniva?",
      answer: "Amniva is an AI-integrated media and civic tech platform by AMN News Agency, offering tools like misinformation checking, real-time disaster alerts, and API services for developers and organizations."
    },
    {
      question: "How can I check if a piece of information is false?",
      answer: "Use our False Info Checker available on the homepage or under the Verify Claims section. Paste the link or statement, and our engine will scan it for authenticity."
    },
    {
      question: "How do I access the Amniva API?",
      answer: "You can subscribe to our API Access via the dashboard. After registration and payment, you'll be granted access to documentation and integration tools."
    },
    {
      question: "Can I listen to AMN Radio live?",
      answer: "Yes! AMN Radio is embedded on our homepage. Click the play button to listen to live broadcasts, including news and entertainment."
    },
    {
      question: "How do I report false or harmful information?",
      answer: "Visit the Report Center from the main menu. Fill the form and submit. Our moderators will review and take action."
    },
    {
      question: "Who owns Amniva?",
      answer: "Amniva is developed and managed by AMN News Agency, an innovation-focused media organization."
    },
    {
      question: "Do I need an account to use Amniva services?",
      answer: "Some services are free and open. However, API access, content publishing, and admin functions require registration and approval."
    },
    {
      question: "Is there a mobile app for Amniva?",
      answer: "Currently, Amniva is web-based, but we are working on a mobile app experience in the near future."
    },
    {
      question: "Can I contribute or become a partner?",
      answer: "Yes. Reach out to us through the Contact section in the footer. We're open to partnerships and innovation support."
    },
    {
      question: "How often is the platform updated?",
      answer: "Content is updated in real-time via the dashboard and API feeds. System improvements are rolled out weekly."
    }
  ];

  return (
    <div className="flex-1 space-y-12">
      {/* Explore Amniva Tools Section */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#1D4ED8] mb-4">Explore Amniva Tools</h2>
          <p className="text-lg text-[#374151] max-w-2xl mx-auto">
            Powerful intelligence tools designed for media professionals, educators, and organizations
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-blue-50/30 border-blue-100">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-[#F59E0B]/10 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-[#F59E0B]" />
              </div>
              <h3 className="text-xl font-semibold text-[#1D4ED8] mb-3">Misinformation Checker</h3>
              <p className="text-[#374151] mb-4 text-sm leading-relaxed">
                Identify misleading stories before they go viral. Our AI-powered system analyzes content credibility in real-time.
              </p>
              <Button className="bg-[#1D4ED8] hover:bg-[#3B82F6] text-white w-full">
                Check Misinformation
              </Button>
            </div>
          </Card>
          
          <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-orange-50/30 border-orange-100">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-[#F59E0B]/10 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="h-8 w-8 text-[#F59E0B]" />
              </div>
              <h3 className="text-xl font-semibold text-[#1D4ED8] mb-3">Crisis Prediction</h3>
              <p className="text-[#374151] mb-4 text-sm leading-relaxed">
                Detect early warnings on potential regional and global threats using advanced predictive models.
              </p>
              <Button className="bg-[#1D4ED8] hover:bg-[#3B82F6] text-white w-full">
                View Predictions
              </Button>
            </div>
          </Card>
          
          <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-green-50/30 border-green-100">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-[#F59E0B]/10 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-[#F59E0B]" />
              </div>
              <h3 className="text-xl font-semibold text-[#1D4ED8] mb-3">Reports</h3>
              <p className="text-[#374151] mb-4 text-sm leading-relaxed">
                Access intelligence-driven reports and summaries for schools, newsrooms, and analysts.
              </p>
              <Button className="bg-[#1D4ED8] hover:bg-[#3B82F6] text-white w-full">
                Read Insights
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Why Use Amniva + FAQ */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-3xl font-bold text-[#1D4ED8] mb-8 text-center lg:text-left">Why Use Amniva?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-white border border-blue-100">
                <div className="mx-auto w-12 h-12 bg-[#1D4ED8] rounded-full flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-[#1D4ED8] mb-2">Real-Time Intelligence</h3>
                <p className="text-sm text-[#374151]">Get instant updates on trending topics and emerging threats</p>
              </div>
              
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-orange-50 to-white border border-orange-100">
                <div className="mx-auto w-12 h-12 bg-[#F59E0B] rounded-full flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-[#1D4ED8] mb-2">Trustworthy AI Models</h3>
                <p className="text-sm text-[#374151]">Powered by advanced algorithms and verified data sources</p>
              </div>
              
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-white border border-green-100">
                <div className="mx-auto w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-[#1D4ED8] mb-2">Built for Media, Schools & You</h3>
                <p className="text-sm text-[#374151]">Tailored solutions for every type of organization</p>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section>
            <Card className="p-6 bg-gradient-to-br from-[#1D4ED8]/5 to-[#3B82F6]/5 border-[#1D4ED8]/20">
              <h3 className="text-2xl font-bold text-[#1D4ED8] mb-6 flex items-center gap-2">
                <HelpCircle className="h-6 w-6 text-[#F59E0B]" />
                Frequently Asked Questions (FAQ)
              </h3>
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {faqItems.map((faq, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
                    <div className="flex items-start gap-2 mb-2">
                      <span className="text-[#F59E0B] font-bold text-sm">🔸</span>
                      <h4 className="text-sm font-semibold text-[#1D4ED8]">
                        Q{index + 1}: {faq.question}
                      </h4>
                    </div>
                    <p className="text-xs text-[#374151] ml-4 leading-relaxed">
                      A: {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* User Testimonials */}
          <Card className="p-6 bg-gradient-to-br from-[#1D4ED8]/5 to-[#3B82F6]/5 border-[#1D4ED8]/20">
            <h3 className="text-xl font-semibold text-[#1D4ED8] mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-[#F59E0B]" />
              User Testimonials
            </h3>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-[#374151] mb-2 italic">
                    "{testimonial.quote}"
                  </p>
                  <p className="text-xs text-[#F59E0B] font-medium">– {testimonial.author}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* API Access Highlight */}
          <Card className="p-6 bg-gradient-to-br from-[#F59E0B]/10 to-[#D97706]/5 border-[#F59E0B]/30">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-[#F59E0B] rounded-full flex items-center justify-center mb-4">
                <Code className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-[#1D4ED8] mb-3">API Access</h3>
              <p className="text-sm text-[#374151] mb-4">
                Want to integrate verification tools into your platform?
              </p>
              <Button className="bg-[#F59E0B] hover:bg-[#D97706] text-white w-full mb-4">
                Apply for API Access
              </Button>
              
              {/* API Integration Benefits */}
              <div className="mt-4 space-y-3">
                <h4 className="text-sm font-semibold text-[#1D4ED8] mb-2">API Integration Benefits</h4>
                <div className="space-y-2 text-xs text-[#374151]">
                  <div className="flex items-start gap-2">
                    <span className="text-[#F59E0B] mt-0.5">•</span>
                    <p><strong>Seamless Data Access:</strong> Integrate Amniva's verified data directly into your platform.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#F59E0B] mt-0.5">•</span>
                    <p><strong>Customizable Widgets:</strong> Embed our widgets to enhance your user experience.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#F59E0B] mt-0.5">•</span>
                    <p><strong>Real-time Updates:</strong> Access live trending topics, misinformation checks, and prediction alerts.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#F59E0B] mt-0.5">•</span>
                    <p><strong>Scalable Solutions:</strong> Designed to handle the needs of organizations of all sizes.</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
