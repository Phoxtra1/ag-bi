
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NewsletterSubscriptionProps {
  className?: string;
  placeholder?: string;
  buttonText?: string;
}

const NewsletterSubscription = ({ 
  className = "", 
  placeholder = "Enter your email address",
  buttonText = "Subscribe"
}: NewsletterSubscriptionProps) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Store subscription in localStorage
      const existingSubscribers = JSON.parse(localStorage.getItem('newsletterSubscribers') || '[]');
      const newSubscriber = {
        email,
        timestamp: new Date().toISOString(),
        source: 'newsletter_form',
        id: Date.now().toString()
      };
      
      if (!existingSubscribers.find((sub: any) => sub.email === email)) {
        existingSubscribers.push(newSubscriber);
        localStorage.setItem('newsletterSubscribers', JSON.stringify(existingSubscribers));
      }

      // Simulate API call to Brevo
      const brevoApiKey = localStorage.getItem('brevoApiKey');
      if (brevoApiKey) {
        console.log('Brevo subscription attempt for:', email);
        // In production, this would make actual API call to Brevo
      }

      setIsSubscribed(true);
      setEmail('');
      
      toast({
        title: "Successfully Subscribed!",
        description: "You'll receive our latest insights and updates.",
      });
      
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: "Subscription Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <div className={`flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg ${className}`}>
        <CheckCircle className="w-5 h-5 text-green-600" />
        <span className="text-green-700 font-medium">Successfully subscribed!</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
      <Input
        type="email"
        placeholder={placeholder}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1"
        required
      />
      <Button 
        type="submit" 
        disabled={isLoading}
        className="bg-blue-600 hover:bg-blue-700"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <Mail className="w-4 h-4 mr-2" />
            {buttonText}
          </>
        )}
      </Button>
    </form>
  );
};

export default NewsletterSubscription;
