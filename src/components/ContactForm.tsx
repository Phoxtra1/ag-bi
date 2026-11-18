import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Send, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { handleContactSubmission } from '@/lib/apiHandlers';

interface ContactFormData {
  fullName: string;
  email: string;
  subject: string;
  category: string;
  message: string;
}

interface ContactFormProps {
  onSuccess?: () => void;
  className?: string;
}


const ContactForm = ({ onSuccess, className = "" }: ContactFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const form = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const result = await handleContactSubmission(data);
      if (!result.success) throw new Error(result.error || "Request submission failed");
      setIsSubmitted(true);
      form.reset();
      toast({ title: "Request received", description: "Your InfoService request has been saved for assessment." });
      onSuccess && setTimeout(onSuccess, 1200);
    } catch (error: any) {
      toast({ title: "Submission failed", description: error?.message || "Please sign in and try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className={`text-center p-8 ${className}`}>
        <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-600" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Request Received!</h3>
        <p className="text-gray-600">Thank you. Your InfoService request has been saved for assessment.</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="fullName"
              rules={{ required: "Full name is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Please enter a valid email"
                }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="your@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="subject"
            rules={{ required: "Subject is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <FormControl>
                  <Input placeholder="What is your message about?" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            rules={{ required: "Please select a category" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Select a category</option>
                    <option value="career_education">Career and Education</option>
                    <option value="business_information">Business Information</option>
                    <option value="contracts_commitments">Contracts and Commitments</option>
                    <option value="travel_relocation">Travel and Relocation</option>
                    <option value="info_report_verification">Info and Report Verification</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            rules={{ required: "Message is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us more about your inquiry..."
                    rows={6}
                    {...field}
                    className="resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            size="lg"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                Submit Service Request
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ContactForm;
