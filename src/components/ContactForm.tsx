import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Send, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { handleContactSubmission } from '@/lib/apiHandlers';
import ReCAPTCHA from 'react-google-recaptcha';

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

const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

const ContactForm = ({ onSuccess, className = "" }: ContactFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const form = useForm<ContactFormData>();
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    try {
      // ✅ Execute invisible reCAPTCHA
      const token = await recaptchaRef.current?.executeAsync();
      recaptchaRef.current?.reset();

      if (!token) {
        toast({ title: "CAPTCHA Failed", description: "Please verify you're human.", variant: "destructive" });
        setIsSubmitting(false);
        return;
      }

      // ✅ Verify token through your Appwrite Function
      const verifyResponse = await fetch("https://cloud.appwrite.io/v1/functions/verifyCaptcha/executions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Appwrite-Project": import.meta.env.VITE_APPWRITE_PROJECT_ID,
        },
        body: JSON.stringify({ token }),
      });

      const verifyResult = await verifyResponse.json();
      const verification = verifyResult?.response ? JSON.parse(verifyResult.response) : {};

      if (!verification.success) {
        toast({ title: "Verification Failed", description: "CAPTCHA verification unsuccessful.", variant: "destructive" });
        setIsSubmitting(false);
        return;
      }

      // ✅ Submit contact data after CAPTCHA passes
      const result = await handleContactSubmission(data);
      if (!result.success) throw new Error(result.error || 'Submission failed');

      setIsSubmitted(true);
      form.reset();
      toast({ title: 'Message Sent Successfully!', description: "We'll get back to you within 48 hours." });
      onSuccess && setTimeout(onSuccess, 1200);

    } catch (error: any) {
      console.error('Contact form submission error:', error);
      toast({ title: 'Submission Failed', description: error?.message || 'Please try again later.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className={`text-center p-8 ${className}`}>
        <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-600" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
        <p className="text-gray-600">Thank you for contacting us. We'll respond within 48 hours.</p>
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
                    <option value="amnewsworld">Amnewsworld</option>
                    <option value="amniva">Amniva</option>
                    <option value="amn-news-radio">AMN News Radio</option>
                    <option value="amnet">Amnet</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Support</option>
                    <option value="partnership">Partnership</option>
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

          {/* ✅ Invisible reCAPTCHA widget */}
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={SITE_KEY}
            size="invisible"
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
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                Send Message
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ContactForm;
