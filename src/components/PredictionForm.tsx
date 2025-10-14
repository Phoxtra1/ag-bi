import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { createPrediction, type PredictionData } from '@/lib/prediction';

const PredictionForm = () => {
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<PredictionData>();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const category = watch('category');

  const onSubmit = async (data: PredictionData) => {
    setLoading(true);
    try {
      await createPrediction(data);
      
      toast({
        title: "Success",
        description: "Prediction submitted successfully! You'll receive a response via email."
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
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>Submit a Prediction Request</CardTitle>
            <CardDescription>
              Get AI-powered predictions and insights across multiple categories
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
                  <p className="text-sm text-destructive">{errors.name.message}</p>
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
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  onValueChange={(value) => setValue('category', value as PredictionData['category'])}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Environment">Environment</SelectItem>
                    <SelectItem value="Political Climate">Political Climate</SelectItem>
                    <SelectItem value="Weather">Weather</SelectItem>
                    <SelectItem value="Business Forecast">Business Forecast</SelectItem>
                    <SelectItem value="Disaster">Disaster</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-destructive">{errors.category.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Prediction Details</Label>
                <Textarea
                  id="description"
                  {...register('description', { required: 'Description is required' })}
                  placeholder="Describe what you'd like us to predict or analyze..."
                  rows={6}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Available Categories:</strong>
                </p>
                <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                  <li>• <strong>Environment:</strong> Climate patterns, deforestation, pollution trends</li>
                  <li>• <strong>Political Climate:</strong> Elections, policy impacts, regional stability</li>
                  <li>• <strong>Weather:</strong> Seasonal forecasts, extreme events, agricultural planning</li>
                  <li>• <strong>Business Forecast:</strong> Market trends, industry outlook, economic indicators</li>
                  <li>• <strong>Disaster:</strong> Risk assessment, preparedness, impact analysis</li>
                </ul>
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Submitting...' : 'Submit Prediction Request'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PredictionForm;
