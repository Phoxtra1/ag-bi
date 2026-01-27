
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsletterSubscription from '@/components/NewsletterSubscription';
import { FileText, TrendingUp, Globe, Mail } from 'lucide-react';

const Newsletter = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <FileText className="h-16 w-16 mx-auto mb-6 text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Stay Informed with Amniva
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Get updates on business intelligence, market trends, and strategic insights. 
            Join professionals who rely on verified data for informed decisions.
          </p>
        </div>

        {/* Newsletter Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold text-foreground mb-3">Market Intelligence</h3>
            <p className="text-muted-foreground">
              Weekly analysis of business trends, market movements, and economic developments 
              that impact your industry.
            </p>
          </div>
          <div className="text-center">
            <Globe className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold text-foreground mb-3">Global Perspective</h3>
            <p className="text-muted-foreground">
              International trade updates, investment signals, and cross-border business 
              developments from our global analysis.
            </p>
          </div>
          <div className="text-center">
            <Mail className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold text-foreground mb-3">Exclusive Insights</h3>
            <p className="text-muted-foreground">
              Early access to Amniva features, verified forecasts, 
              and exclusive analysis from our intelligence team.
            </p>
          </div>
        </div>

        {/* Subscription Form */}
        <div className="max-w-xl mx-auto">
          <div className="bg-card rounded-2xl shadow-lg p-8 md:p-12 border">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Subscribe to Our Intelligence Brief
              </h2>
              <p className="text-muted-foreground">
                Join our network of informed professionals and stay ahead of market developments.
              </p>
            </div>

            <NewsletterSubscription 
              className="mb-6"
              placeholder="Enter your email address"
              buttonText="Subscribe Now"
            />

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Powered by Brevo • Unsubscribe anytime • Privacy protected
              </p>
            </div>
          </div>
        </div>

        {/* Newsletter Preview */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="bg-muted rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-foreground text-center mb-8">
              What to Expect in Your Inbox
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-foreground mb-4">Weekly Intelligence Brief</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Verified market insights and analysis</li>
                  <li>• Business trend signals and forecasts</li>
                  <li>• Trade and investment developments</li>
                  <li>• Risk environment updates</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">Exclusive Access</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Early access to new platform features</li>
                  <li>• Industry analysis and reports</li>
                  <li>• Strategic insights and forecasts</li>
                  <li>• Special offers and beta invitations</li>
                </ul>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <p className="text-muted-foreground mb-4">
                Join thousands of professionals who trust our intelligence
              </p>
              <div className="flex justify-center space-x-4 text-sm text-muted-foreground">
                <span>✓ No spam, ever</span>
                <span>✓ Unsubscribe anytime</span>
                <span>✓ Privacy first</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Newsletter;
