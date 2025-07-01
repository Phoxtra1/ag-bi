
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { HelpCircle, MessageCircle } from 'lucide-react';

const FAQ = () => {
  const faqs = [
    {
      question: "What is Amniva and how does it work?",
      answer: "Amniva is an AI-powered media intelligence platform that transforms raw reports into actionable insights. We analyze global information flows, detect trends, verify patterns, and help users understand the bigger picture behind media data. Our advanced algorithms process news, social media, and broadcast content to provide real-time intelligence."
    },
    {
      question: "How is Amniva connected to Amnewsworld?",
      answer: "Amniva is the broadcast and media intelligence tool of Amnewsworld, a global media startup that operates a news portal, web radio, and streaming platform. While Amnewsworld delivers credible news content, Amniva provides the analytical intelligence layer that helps understand media trends and verify information accuracy."
    },
    {
      question: "What makes Amniva's predictions reliable?",
      answer: "Our predictions are based on sophisticated AI models that analyze multiple data sources including news patterns, social media sentiment, historical trends, and real-time information flows. We use machine learning algorithms trained on vast datasets to identify patterns and predict outcomes with high accuracy rates."
    },
    {
      question: "How does Amniva help combat misinformation?",
      answer: "Amniva uses advanced verification algorithms to cross-reference information across multiple sources, detect inconsistencies, analyze source credibility, and flag potential misinformation. Our AI models are trained to identify common misinformation patterns and provide fact-checking insights in real-time."
    },
    {
      question: "What pricing plans are available for Amniva?",
      answer: "We offer four pricing tiers: Free (basic features), Pro ($29/month), Elite ($99/month), and Institutional (custom pricing). Each plan includes different levels of access to our analytics tools, API calls, data export capabilities, and premium support features. Visit our Pricing page for detailed comparisons."
    },
    {
      question: "Can I integrate Amniva with my existing systems?",
      answer: "Yes! Amniva offers comprehensive API access for Pro, Elite, and Institutional plans. Our APIs allow you to integrate our media intelligence capabilities into your existing workflows, applications, and business systems. We provide detailed documentation and developer support."
    },
    {
      question: "What kind of data sources does Amniva analyze?",
      answer: "Amniva processes data from news websites, social media platforms, broadcast media, press releases, government sources, and other verified information channels. We focus on credible sources and use AI to filter out unreliable information while maintaining comprehensive coverage."
    },
    {
      question: "How can I get support or report issues?",
      answer: "You can reach our support team through multiple channels: use the Live Chat feature on our Help Center, submit a support ticket through our Contact form, or visit our comprehensive Help Center. Our Amniva Support Bot is available 24/7 for immediate assistance."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <HelpCircle className="h-16 w-16 mx-auto mb-6 text-blue-600" />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Find answers to common questions about Amniva, Amnewsworld, and our 
            media intelligence platform. Everything you need to get started.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto mb-16">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`} 
                className="bg-white rounded-lg shadow-md border border-gray-200"
              >
                <AccordionTrigger className="px-6 py-4 text-left hover:no-underline hover:bg-gray-50">
                  <span className="text-lg font-semibold text-gray-900">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-gray-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Help Footer */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Still need help?
          </h2>
          <p className="text-gray-600 mb-6">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <MessageCircle className="mr-2 h-5 w-5" />
              Use our Live Chat
            </Button>
            <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
              Visit Help Center
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
