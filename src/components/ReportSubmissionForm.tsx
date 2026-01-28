import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { createReportSubmission } from '@/lib/reports';
import { account } from '@/lib/appwrite';
import { FileText, Send, Loader2 } from 'lucide-react';

const ReportSubmissionForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Other' as 'Environment' | 'Political' | 'Weather' | 'Business' | 'Disaster' | 'Other',
    content: '',
    location: '',
    tags: '',
    file: null as File | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Validation Error",
        description: "Title and content are required.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Get current user
      const user = await account.get();
      
      // Allow all users to submit for testing (no payment restrictions)
      const userPlan = 'Free' as 'Free' | 'Pro' | 'Elite' | 'Institutional';
      
      await createReportSubmission({
        title: formData.title,
        category: formData.category,
        content: formData.content,
        location: formData.location,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
        userId: user.$id,
        userEmail: user.email,
        userName: user.name || user.email,
        userPlan,
        status: 'pending'
      });

      toast({
        title: "Submission Successful",
        description: "Your report has been submitted successfully. Our team will review and analyze it soon.",
      });

      // Reset form
      setFormData({
        title: '',
        category: 'Other',
        content: '',
        location: '',
        tags: '',
        file: null,
      });
    } catch (error: any) {
      console.error('Error submitting report:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Submit Data for Insight Generation
        </CardTitle>
        <CardDescription>
          Submit your data, research, or documents for AI-powered analysis and expert review
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Submission Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Q3 Market Performance Analysis"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Analysis Category *</Label>
            <Select value={formData.category} onValueChange={(value: any) => setFormData(prev => ({ ...prev, category: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Business">Market Analysis</SelectItem>
                <SelectItem value="Environment">Industry Research</SelectItem>
                <SelectItem value="Political">Economic Policy</SelectItem>
                <SelectItem value="Weather">Risk Assessment</SelectItem>
                <SelectItem value="Disaster">Competitive Intelligence</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Data & Analysis Details *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Provide detailed data, research findings, market observations, or business intelligence..."
              rows={6}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Region/Market (Optional)</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="e.g., West Africa, EMEA, Global"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (Optional)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="e.g., finance, investment, risk"
              />
              <p className="text-xs text-muted-foreground">Separate tags with commas</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Upload Supporting File (Optional)</Label>
            <Input
              id="file"
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setFormData(prev => ({ ...prev, file }));
              }}
              accept=".txt,.csv,.pdf,.jpg,.jpeg,.png,.mp4,.mp3"
              className="cursor-pointer"
            />
            <p className="text-xs text-muted-foreground">
              Accepted formats: Text, CSV, PDF, Images (JPG, PNG), Video (MP4), Audio (MP3)
            </p>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit for Analysis
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReportSubmissionForm;
