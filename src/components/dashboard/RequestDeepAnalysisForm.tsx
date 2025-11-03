import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { databases, storage } from '@/lib/appwrite';
import { DATABASE_ID, REPORTS_COLLECTION_ID, CONTENT_BUCKET_ID } from '@/lib/database';
import { getCurrentUser } from '@/lib/auth';
import { Upload, FileText, AlertCircle } from 'lucide-react';

const RequestDeepAnalysisForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    topic: '',
    contentType: 'text',
    description: '',
    urgency: 'normal',
    additionalNotes: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const user = await getCurrentUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to submit a deep analysis request.",
          variant: "destructive"
        });
        return;
      }

      let uploadedFileId = '';
      if (file) {
        const uploadedFile = await storage.createFile(
          CONTENT_BUCKET_ID,
          'unique()',
          file
        );
        uploadedFileId = uploadedFile.$id;
      }

      await databases.createDocument(
        DATABASE_ID,
        REPORTS_COLLECTION_ID,
        'unique()',
        {
          type: 'deep_analysis_request',
          topic: formData.topic,
          contentType: formData.contentType,
          description: formData.description,
          urgency: formData.urgency,
          additionalNotes: formData.additionalNotes,
          fileId: uploadedFileId,
          submittedBy: user.email,
          submitterName: user.name || user.email,
          status: 'pending',
          submittedAt: new Date().toISOString()
        }
      );

      toast({
        title: "Request Submitted",
        description: "Your deep analysis request has been submitted successfully. Our team will review it shortly."
      });

      // Reset form
      setFormData({
        topic: '',
        contentType: 'text',
        description: '',
        urgency: 'normal',
        additionalNotes: ''
      });
      setFile(null);
    } catch (error) {
      console.error('Error submitting request:', error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit your request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Request Deep Analysis
        </CardTitle>
        <CardDescription>
          Submit a request for comprehensive expert analysis of claims, content, or information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="topic">Topic/Claim *</Label>
            <Input
              id="topic"
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              placeholder="Enter the topic or claim you want analyzed"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contentType">Content Type *</Label>
            <Select
              value={formData.contentType}
              onValueChange={(value) => setFormData({ ...formData, contentType: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text/Article</SelectItem>
                <SelectItem value="url">URL/Link</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
                <SelectItem value="document">Document</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide detailed context about what you want analyzed and why"
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="urgency">Urgency Level</Label>
            <Select
              value={formData.urgency}
              onValueChange={(value) => setFormData({ ...formData, urgency: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low - Standard Processing</SelectItem>
                <SelectItem value="normal">Normal - Within 48 hours</SelectItem>
                <SelectItem value="high">High - Within 24 hours</SelectItem>
                <SelectItem value="urgent">Urgent - Priority Review</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Upload Supporting Evidence (Optional)</Label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <input
                type="file"
                id="file"
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.mp4,.mp3"
              />
              <label htmlFor="file" className="cursor-pointer">
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">
                  {file ? file.name : 'Click to upload or drag and drop'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PDF, DOC, Images, Video, or Audio (max 50MB)
                </p>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalNotes">Additional Notes</Label>
            <Textarea
              id="additionalNotes"
              value={formData.additionalNotes}
              onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
              placeholder="Any additional information that might help with the analysis"
              rows={3}
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">What happens next?</p>
                <ul className="list-disc list-inside space-y-1 text-blue-700">
                  <li>Our expert team will review your submission</li>
                  <li>You'll receive a comprehensive analysis report</li>
                  <li>Reports include source verification and credibility assessment</li>
                  <li>Track your request status in the Verify tab</li>
                </ul>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Analysis Request'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RequestDeepAnalysisForm;
