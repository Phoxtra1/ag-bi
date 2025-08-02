
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Shield, Search, CheckCircle, Upload, AlertCircle } from 'lucide-react';
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
    
    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Submission Successful!",
        description: "Thanks for your submission. Log in or create an account to track the status.",
      });
      
      reset();
      
      // Redirect to login page after successful submission
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6 space-x-4">
            <Shield className="h-12 w-12 text-blue-600 animate-pulse" />
            <Search className="h-12 w-12 text-green-600 animate-bounce" />
            <CheckCircle className="h-12 w-12 text-blue-600 animate-pulse" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Verify Information Before You Share
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Protect yourself and your network from false claims, hoaxes, and disinformation. 
            Submit any news item, photo, or video for verification.
          </p>
          
          <div className="flex items-center justify-center mb-6">
            <div className="bg-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-gray-700 font-medium">Verified by Amniva Tool</span>
            </div>
          </div>
          
          <Button 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            onClick={() => document.getElementById('submission-form')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Submit a Claim for Verification
          </Button>
        </div>
      </section>

      {/* Info Banner */}
      <div className="bg-blue-600 text-white py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm md:text-base">
            Amniva's Fact Verification Service helps you check the credibility of any media content or claim.
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
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                  <Upload className="h-6 w-6 mr-2 text-blue-600" />
                  Submit Your Claim
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
                    <Label htmlFor="email">Email Address *</Label>
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
                      placeholder="your.email@example.com"
                      className="mt-1"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="contentType">Type of Content to Verify *</Label>
                    <select
                      id="contentType"
                      {...register('contentType', { required: 'Please select content type' })}
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 bg-white"
                    >
                      <option value="">Select content type</option>
                      <option value="text">Text</option>
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                      <option value="url">URL</option>
                      <option value="audio">Audio</option>
                    </select>
                    {errors.contentType && (
                      <p className="text-red-500 text-sm mt-1">{errors.contentType.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="claimDescription">Claim Description *</Label>
                    <Textarea
                      id="claimDescription"
                      {...register('claimDescription', { required: 'Please describe the claim' })}
                      placeholder="Describe the information you want to verify..."
                      rows={4}
                      className="mt-1"
                    />
                    {errors.claimDescription && (
                      <p className="text-red-500 text-sm mt-1">{errors.claimDescription.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="file">Upload Supporting File (Optional)</Label>
                    <Input
                      id="file"
                      type="file"
                      {...register('file')}
                      accept=".pdf,.png,.jpg,.jpeg,.mp4,.mp3"
                      className="mt-1"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Accepted formats: PDF, PNG, JPG, MP4, MP3
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="externalLink">External Link (Optional)</Label>
                    <Input
                      id="externalLink"
                      type="url"
                      {...register('externalLink')}
                      placeholder="https://example.com"
                      className="mt-1"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700"
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
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                  <Search className="h-6 w-6 mr-2 text-green-600" />
                  How the Verification Works
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 rounded-full p-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="text-gray-700">
                    Your submission will be reviewed by our team using a mix of expert analysis and AI tools.
                  </p>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 rounded-full p-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-gray-700">
                    Results will be delivered to your user dashboard.
                  </p>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-yellow-100 rounded-full p-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                  </div>
                  <p className="text-gray-700">
                    Verification results are private and only accessible to Premium users.
                  </p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-800 font-medium">
                    Upgrade after submission to receive your full verification report.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Collapsible About Section */}
            <Card className="shadow-lg">
              <Collapsible open={isAboutOpen} onOpenChange={setIsAboutOpen}>
                <CollapsibleTrigger className="w-full">
                  <CardHeader className="hover:bg-gray-50 cursor-pointer">
                    <CardTitle className="text-lg font-bold text-gray-900 flex items-center justify-between">
                      About Our Verification Service
                      <span className="text-sm text-gray-500">
                        {isAboutOpen ? '−' : '+'}
                      </span>
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">
                      At Amniva, our verification service is not limited to fact-checking breaking news or viral content. 
                      We provide a comprehensive and intelligent claim validation system that empowers individuals, 
                      researchers, and organizations to test the truth and accuracy of any information be it a trending 
                      report, a historical claim, a scientific fact, a political statement, or a widely circulated belief.
                    </p>
                    <p className="text-gray-700 leading-relaxed mt-4">
                      Whether you're investigating misinformation, tracing the origin of a cultural myth, or validating 
                      content before publication, our system provides contextual analysis, factual citations, and 
                      intelligent feedback ensuring what you share, believe, or publish is based on truth, not trends.
                    </p>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Collapsible Guidelines */}
            <Card className="shadow-lg">
              <Collapsible open={isGuidelinesOpen} onOpenChange={setIsGuidelinesOpen}>
                <CollapsibleTrigger className="w-full">
                  <CardHeader className="hover:bg-gray-50 cursor-pointer">
                    <CardTitle className="text-lg font-bold text-gray-900 flex items-center justify-between">
                      Guidelines & Disclaimer
                      <span className="text-sm text-gray-500">
                        {isGuidelinesOpen ? '−' : '+'}
                      </span>
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Guidelines for Using the Verify Information Feature:</h4>
                      <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                        <li><strong>Submit Accurate Details:</strong> Ensure the information you're submitting for verification is complete, including links, documents, or screenshots where necessary.</li>
                        <li><strong>No Fake or Harmful Submissions:</strong> Requests intended to spread falsehoods or target individuals will be rejected.</li>
                        <li><strong>Verification Timeframe:</strong> Most requests are processed within 24–72 hours, depending on complexity.</li>
                        <li><strong>Sign In Required to View Results:</strong> You must sign in or create an account to view your verification results.</li>
                        <li><strong>Paid Feature:</strong> This is a premium feature. A valid payment or subscription is required to access the final verification report.</li>
                        <li><strong>Email Notification:</strong> You will receive an email alert once your verification report is ready and accessible via your dashboard.</li>
                      </ol>
                    </div>
                    
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                      <h4 className="font-semibold text-yellow-800 mb-2">Disclaimer:</h4>
                      <p className="text-sm text-yellow-700">
                        The verification results provided by AMNIVA are based on publicly available data, expert analysis, 
                        and internal fact-checking processes. While we strive for accuracy and integrity, AMNIVA does not 
                        guarantee absolute truth in complex or evolving matters. Users are advised to exercise personal 
                        discretion in interpreting results.
                      </p>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          </div>
        </div>

        {/* Bottom Message */}
        <div className="text-center mt-12 p-6 bg-gray-100 rounded-lg">
          <p className="text-gray-700">
            Already submitted a claim? 
            <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium ml-1">
              Log In
            </a> 
            {" "}to track or receive your result.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyInfo;
