
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Shield, Search, CheckCircle, Upload, AlertCircle, Building2, BarChart3, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import Header from '@/components/Header';

interface VerificationForm {
  fullName?: string;
  email: string;
  contentType: string;
  claimDescription: string;
  externalLink?: string;
  file?: FileList;
}

const VerifyInfo = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGuidelinesOpen, setIsGuidelinesOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<VerificationForm>();

  const onSubmit = async (data: VerificationForm) => {
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Submission Successful!",
        description: "Your data verification request has been submitted. Log in to track the status.",
      });
      
      reset();
      
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
      
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6 space-x-4">
            <Shield className="h-12 w-12 text-primary animate-pulse" />
            <BarChart3 className="h-12 w-12 text-green-600 animate-bounce" />
            <CheckCircle className="h-12 w-12 text-primary animate-pulse" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Verify Business Data Before You Act
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Protect your investments and decisions from unreliable data, misleading reports, and market misinformation.
            Submit any financial report, market claim, or business data for verification.
          </p>
          
          <div className="flex items-center justify-center mb-6">
            <div className="bg-card px-6 py-3 rounded-full shadow-lg flex items-center space-x-2 border">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-foreground font-medium">Verified by Amniva Intelligence Engine</span>
            </div>
          </div>
          
          <Button 
            size="lg" 
            className="px-8 py-3 text-lg"
            onClick={() => document.getElementById('submission-form')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Submit Data for Verification
          </Button>
        </div>
      </section>

      {/* Info Banner */}
      <div className="bg-primary text-primary-foreground py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm md:text-base">
            Amniva's Data Verification Service helps you validate the credibility of financial reports, market data, and business claims.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Column - Submission Form */}
          <div id="submission-form">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-foreground flex items-center">
                  <Upload className="h-6 w-6 mr-2 text-primary" />
                  Submit Data for Verification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <Label htmlFor="fullName">Full Name (Optional)</Label>
                    <Input
                      id="fullName"
                      {...register('fullName')}
                      placeholder="Enter your full name"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Business Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: 'Please enter a valid email'
                        }
                      })}
                      placeholder="your.email@company.com"
                      className="mt-1"
                    />
                    {errors.email && (
                      <p className="text-destructive text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="contentType">Type of Data to Verify *</Label>
                    <select
                      id="contentType"
                      {...register('contentType', { required: 'Please select data type' })}
                      className="mt-1 w-full rounded-md border border-input px-3 py-2 bg-background"
                    >
                      <option value="">Select data type</option>
                      <option value="financial_report">Financial Report</option>
                      <option value="market_data">Market Data</option>
                      <option value="company_claims">Company Claims</option>
                      <option value="investment_data">Investment Data</option>
                      <option value="trade_statistics">Trade Statistics</option>
                      <option value="economic_indicators">Economic Indicators</option>
                    </select>
                    {errors.contentType && (
                      <p className="text-destructive text-sm mt-1">{errors.contentType.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="claimDescription">Data Description *</Label>
                    <Textarea
                      id="claimDescription"
                      {...register('claimDescription', { required: 'Please describe the data to verify' })}
                      placeholder="Describe the business data, market claim, or financial report you want to verify..."
                      rows={4}
                      className="mt-1"
                    />
                    {errors.claimDescription && (
                      <p className="text-destructive text-sm mt-1">{errors.claimDescription.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="file">Upload Supporting Document (Optional)</Label>
                    <Input
                      id="file"
                      type="file"
                      {...register('file')}
                      accept=".pdf,.xlsx,.csv,.doc,.docx,.png,.jpg,.jpeg"
                      className="mt-1"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Accepted formats: PDF, Excel, CSV, Word, PNG, JPG
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="externalLink">Source Link (Optional)</Label>
                    <Input
                      id="externalLink"
                      type="url"
                      {...register('externalLink')}
                      placeholder="https://source-website.com/report"
                      className="mt-1"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Information Panel */}
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-foreground flex items-center">
                  <Search className="h-6 w-6 mr-2 text-green-600" />
                  How Verification Works
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 rounded-full p-2">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-muted-foreground">
                    Your submission is analyzed using AI cross-referencing against credible financial sources including Bloomberg, Reuters, Financial Times, and World Bank data.
                  </p>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-muted-foreground">
                    Results are delivered to your dashboard with confidence scores and source citations.
                  </p>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-amber-100 dark:bg-amber-900/30 rounded-full p-2">
                    <Building2 className="h-5 w-5 text-amber-600" />
                  </div>
                  <p className="text-muted-foreground">
                    Elite and Institutional plans include human expert review for high-stakes verification.
                  </p>
                </div>
                
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                  <p className="text-primary font-medium">
                    Upgrade to unlock full verification reports with detailed source analysis.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Collapsible About Section */}
            <Card className="shadow-lg">
              <Collapsible open={isAboutOpen} onOpenChange={setIsAboutOpen}>
                <CollapsibleTrigger className="w-full">
                  <CardHeader className="hover:bg-muted/50 cursor-pointer">
                    <CardTitle className="text-lg font-bold text-foreground flex items-center justify-between">
                      About Our Verification Service
                      <span className="text-sm text-muted-foreground">
                        {isAboutOpen ? '−' : '+'}
                      </span>
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      Amniva's verification service is designed for business professionals, analysts, and institutions who need to validate the accuracy of financial data, market claims, and business intelligence before making critical decisions.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mt-4">
                      We cross-reference your submissions against authoritative sources including Bloomberg, Wall Street Journal, Financial Times, Reuters, World Bank, IMF, SEC filings, and verified industry databases to provide comprehensive credibility assessments.
                    </p>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Collapsible Guidelines */}
            <Card className="shadow-lg">
              <Collapsible open={isGuidelinesOpen} onOpenChange={setIsGuidelinesOpen}>
                <CollapsibleTrigger className="w-full">
                  <CardHeader className="hover:bg-muted/50 cursor-pointer">
                    <CardTitle className="text-lg font-bold text-foreground flex items-center justify-between">
                      Guidelines & Disclaimer
                      <span className="text-sm text-muted-foreground">
                        {isGuidelinesOpen ? '−' : '+'}
                      </span>
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Guidelines for Data Verification:</h4>
                      <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                        <li><strong>Submit Complete Data:</strong> Include all relevant documents, links, and context for accurate verification.</li>
                        <li><strong>Business Use Only:</strong> This service is for legitimate business intelligence purposes.</li>
                        <li><strong>Processing Time:</strong> Most requests are processed within 24–72 hours, depending on complexity.</li>
                        <li><strong>Sign In Required:</strong> You must sign in to view your verification results.</li>
                        <li><strong>Premium Feature:</strong> Full verification reports require a paid subscription.</li>
                        <li><strong>Email Notification:</strong> You'll receive an email when your verification report is ready.</li>
                      </ol>
                    </div>
                    
                    <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400 p-4">
                      <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">Disclaimer:</h4>
                      <p className="text-sm text-amber-700 dark:text-amber-300">
                        Verification results are based on publicly available data, expert analysis, and AI-powered cross-referencing. While we strive for accuracy, Amniva does not guarantee absolute accuracy for time-sensitive or rapidly changing market data. Users should exercise professional judgment.
                      </p>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          </div>
        </div>

        {/* Bottom Message */}
        <div className="text-center mt-12 p-6 bg-muted rounded-lg">
          <p className="text-muted-foreground">
            Already submitted a verification request? 
            <a href="/login" className="text-primary hover:text-primary/80 font-medium ml-1">
              Log In
            </a> 
            {" "}to track or receive your results.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyInfo;
