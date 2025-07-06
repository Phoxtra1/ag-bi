
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { createApiRequest, type ApiRequestData } from '@/lib/apiRequests';
import { uploadDocument } from '@/lib/uploadDocument';

const ApiRequestForm = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ApiRequestData>();
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const onSubmit = async (data: ApiRequestData) => {
    setLoading(true);
    try {
      let verificationDocumentId = '';
      
      if (selectedFile) {
        const uploadResult = await uploadDocument(selectedFile);
        verificationDocumentId = uploadResult.fileId;
      }

      await createApiRequest({
        ...data,
        verificationDocument: verificationDocumentId
      });

      toast({
        title: "Success",
        description: "API access request submitted successfully!"
      });
      
      reset();
      setSelectedFile(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit API access request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>API Access Request</CardTitle>
            <CardDescription>
              Request access to our API for your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  {...register('fullName', { required: 'Full name is required' })}
                />
                {errors.fullName && (
                  <p className="text-sm text-red-600">{errors.fullName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="organizationName">Organization Name</Label>
                <Input
                  id="organizationName"
                  {...register('organizationName', { required: 'Organization name is required' })}
                />
                {errors.organizationName && (
                  <p className="text-sm text-red-600">{errors.organizationName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sector">Sector</Label>
                <Select {...register('sector', { required: 'Sector is required' })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your sector" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Academic">Academic</SelectItem>
                    <SelectItem value="Media">Media</SelectItem>
                    <SelectItem value="Government">Government</SelectItem>
                    <SelectItem value="Research">Research</SelectItem>
                    <SelectItem value="Civil">Civil</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.sector && (
                  <p className="text-sm text-red-600">{errors.sector.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="intendedUse">Intended Use</Label>
                <Textarea
                  id="intendedUse"
                  {...register('intendedUse', { required: 'Intended use is required' })}
                  placeholder="Describe how you plan to use our API..."
                />
                {errors.intendedUse && (
                  <p className="text-sm text-red-600">{errors.intendedUse.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="verificationDocument">Verification Document (Optional)</Label>
                <Input
                  id="verificationDocument"
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                />
                {selectedFile && (
                  <p className="text-sm text-gray-600">Selected: {selectedFile.name}</p>
                )}
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Submitting...' : 'Submit Request'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApiRequestForm;
