
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { createPrediction, type PredictionData } from '@/lib/prediction';

const PredictionForm = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<PredictionData>();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const onSubmit = async (data: PredictionData) => {
    setLoading(true);
    try {
      await createPrediction(data);
      
      toast({
        title: "Success",
        description: "Prediction submitted successfully!"
      });
      
      reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit prediction. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>Submit a Prediction</CardTitle>
            <CardDescription>
              Share your insights and predictions with our community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  {...register('name', { required: 'Name is required' })}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
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
                <Label htmlFor="title">Title (Optional)</Label>
                <Input
                  id="title"
                  {...register('title')}
                  placeholder="Brief title for your prediction"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prompt">Prediction</Label>
                <Textarea
                  id="prompt"
                  {...register('prompt', { required: 'Prediction is required' })}
                  placeholder="Describe your prediction in detail..."
                  rows={4}
                />
                {errors.prompt && (
                  <p className="text-sm text-red-600">{errors.prompt.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Additional Details (Optional)</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Any additional context or supporting information..."
                  rows={3}
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Submitting...' : 'Submit Prediction'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PredictionForm;
