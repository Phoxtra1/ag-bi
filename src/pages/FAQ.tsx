
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
import { Link } from 'react-router-dom';

const FAQ = () => {
  const faqs = [
    {
      question: "What is Amniva and how does it work?",
      answer: "Amniva is a business intelligence platform that transforms data into actionable insights. We verify information, generate structured analysis, and provide market forecasting to help organizations make informed decisions. Our AI engines process submitted data against verified sources to deliver credibility assessments, trend analysis, and predictive insights."
    },
    {
      question: "What are Amniva's core capabilities?",
      answer: "Amniva offers four core capabilities: Verify (credibility assessment and cross-checking of datasets, reports, and claims), Info (transforming raw data into structured insights and summaries), Prediction (business, market, and risk forecasting based on verified data), and Business Trends (aggregated signals focused on markets, trade, investment, and risk environments)."
    },
    {
      question: "How does the Verify feature work?",
      answer: "Submit your data, reports, or claims through the Verify tab. Our AI cross-references multiple sources, analyzes patterns, and returns a credibility score with evidence summary, confidence level, and risk factors. Results can be reviewed by human experts for Elite and Institutional plans."
    },
    {
      question: "What makes Amniva's predictions reliable?",
      answer: "Our Prediction engine analyzes historical data, current market conditions, and verified inputs to model scenarios and forecast outcomes. We provide confidence scores with each prediction and continuously refine our models based on accuracy tracking."
    },
    {
      question: "What pricing plans are available?",
      answer: "We offer four tiers: Free (basic features), Pro (full AI analysis, priority processing), Elite (AI + human expert review, dedicated support), and Institutional (custom solutions, aggregated reports). Visit our Pricing page for detailed comparisons."
    },
    {
      question: "Can I integrate Amniva with my existing systems?",
      answer: "Yes. Amniva provides comprehensive API access for Pro, Elite, and Institutional plans. Our APIs allow you to integrate verification, insight generation, and forecasting capabilities into your existing workflows. Detailed documentation and developer support are included."
    },
    {
      question: "What types of data can Amniva process?",
      answer: "Amniva processes documents, datasets, research reports, claims, and structured information. We focus on business, market, trade, investment, and risk-related data from credible sources."
    },
    {
      question: "How can I get support?",
      answer: "Access the Support tab in your dashboard for FAQs, documentation, and contact options. Use our Dipa assistant for instant guidance, or email support@amniva.io. Pro and Elite members receive priority response."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <HelpCircle className="h-16 w-16 mx-auto mb-6 text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Find answers to common questions about Amniva's business intelligence platform 
            and our verification, insight, and forecasting capabilities.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto mb-16">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`} 
                className="bg-card rounded-lg shadow-md border"
              >
                <AccordionTrigger className="px-6 py-4 text-left hover:no-underline hover:bg-muted">
                  <span className="text-lg font-semibold text-foreground">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Help Footer */}
        <div className="bg-card rounded-2xl shadow-lg p-8 text-center border">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Still need help?
          </h2>
          <p className="text-muted-foreground mb-6">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              <MessageCircle className="mr-2 h-5 w-5" />
              Chat with Dipa
            </Button>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
