import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { createPrediction, type PredictionData } from '@/lib/prediction';
import { getCurrentUser } from '@/lib/auth';
import { AlertCircle, Sparkles } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PredictionSubmissionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

type FormData = {
  category: 'Environment' | 'Political Climate' | 'Weather' | 'Business Forecast' | 'Disaster';
  description: string;
};

export const PredictionSubmissionModal = ({ open, onOpenChange, onSuccess }: PredictionSubmissionModalProps) => {
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const [hasPaidPlan, setHasPaidPlan] = useState(false); // TODO: Connect to actual payment plan check
  const { toast } = useToast();
  const category = watch('category');

  const onSubmit = async (data: FormData) => {
    if (!hasPaidPlan) {
      toast({
        title: "Upgrade Required",
        description: "Please upgrade to a paid plan to submit predictions.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const user = await getCurrentUser();
      if (!user) {
        throw new Error('Please login to submit predictions');
      }

      const predictionData: PredictionData = {
        name: user.name,
        email: user.email,
        category: data.category,
        description: data.description,
        userId: user.$id,
        status: 'pending'
      };

      await createPrediction(predictionData);
      
      toast({
        title: "Prediction Submitted",
        description: "Your prediction request has been submitted. You'll receive a response via email within 24-48 hours."
      });
      
      reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit prediction. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Submit Prediction Request
          </DialogTitle>
          <DialogDescription>
            Get AI-powered insights and predictions for your specific needs. Responses delivered via email.
          </DialogDescription>
        </DialogHeader>

        {!hasPaidPlan && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Prediction services are available for paid plan subscribers only. 
              <Button variant="link" className="px-1 h-auto">Upgrade Now</Button>
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="category">Prediction Category *</Label>
            <Select 
              onValueChange={(value) => setValue('category', value as FormData['category'])}
              disabled={!hasPaidPlan}
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
            <Label htmlFor="description">Prediction Details *</Label>
            <Textarea
              id="description"
              {...register('description', { 
                required: 'Please provide details for your prediction request',
                minLength: { value: 50, message: 'Please provide at least 50 characters' }
              })}
              placeholder={getCategoryPlaceholder(category)}
              rows={8}
              disabled={!hasPaidPlan}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Provide detailed information about what you'd like us to predict or analyze.
            </p>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <h4 className="font-medium text-sm">What to Expect:</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>AI-powered analysis using advanced prediction models</li>
              <li>Detailed insights and actionable recommendations</li>
              <li>Response delivered to your email within 24-48 hours</li>
              <li>Follow-up support for clarifications</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !hasPaidPlan} 
              className="flex-1"
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

function getCategoryPlaceholder(category?: string): string {
  switch (category) {
    case 'Environment':
      return 'Describe the environmental trend or pattern you want us to analyze (e.g., climate patterns, deforestation trends, pollution levels)...';
    case 'Political Climate':
      return 'Describe the political scenario you want us to analyze (e.g., election outcomes, policy impacts, regional stability)...';
    case 'Weather':
      return 'Specify the weather pattern or forecast you need (e.g., seasonal predictions, extreme weather events, agricultural planning)...';
    case 'Business Forecast':
      return 'Describe the business trend or market you want us to analyze (e.g., market trends, industry forecasts, economic indicators)...';
    case 'Disaster':
      return 'Describe the disaster scenario you want us to assess (e.g., risk assessment, preparedness planning, impact analysis)...';
    default:
      return 'Provide detailed information about your prediction request...';
  }
}