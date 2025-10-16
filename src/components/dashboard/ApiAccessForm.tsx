import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Building, Send } from 'lucide-react';

const ApiAccessForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    organizationName: '',
    organizationEmail: '',
    website: '',
    country: '',
    sector: '',
    useCase: '',
    document: null as File | null,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Here you would submit to Appwrite
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Application Submitted",
        description: "Your API access request has been submitted for review. You'll be notified once approved.",
      });

      // Reset form
      setFormData({
        organizationName: '',
        organizationEmail: '',
        website: '',
        country: '',
        sector: '',
        useCase: '',
        document: null,
      });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="w-6 h-6" />
          API Access Application
        </CardTitle>
        <CardDescription>
          Apply for institutional API access to Amniva's platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="organizationName">Organization Name *</Label>
              <Input
                id="organizationName"
                value={formData.organizationName}
                onChange={(e) => setFormData(prev => ({ ...prev, organizationName: e.target.value }))}
                required
                placeholder="Enter your organization name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="organizationEmail">Professional Email *</Label>
              <Input
                id="organizationEmail"
                type="email"
                value={formData.organizationEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, organizationEmail: e.target.value }))}
                required
                placeholder="contact@organization.com"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="website">Website *</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                required
                placeholder="https://www.organization.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                required
                placeholder="Enter your country"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sector">Sector *</Label>
            <select
              id="sector"
              value={formData.sector}
              onChange={(e) => setFormData(prev => ({ ...prev, sector: e.target.value }))}
              required
              className="w-full p-2 border border-input rounded-md bg-background"
            >
              <option value="">Select your sector</option>
              <option value="media">Media & Broadcasting</option>
              <option value="government">Government Agency</option>
              <option value="academic">Academic & Research</option>
              <option value="civic">Civic Institution</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="useCase">Intended Use Case *</Label>
            <Textarea
              id="useCase"
              value={formData.useCase}
              onChange={(e) => setFormData(prev => ({ ...prev, useCase: e.target.value }))}
              required
              rows={4}
              placeholder="Describe how you plan to use Amniva's API services..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="document">Verification Document *</Label>
            <Input
              id="document"
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setFormData(prev => ({ ...prev, document: file }));
              }}
              accept=".pdf,.doc,.docx"
              required
            />
            <p className="text-sm text-muted-foreground">
              Upload Certificate of Incorporation, Academic License, or Media License
            </p>
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={submitting}>
            <Send className="w-4 h-4 mr-2" />
            {submitting ? 'Submitting...' : 'Submit API Access Request'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ApiAccessForm;
