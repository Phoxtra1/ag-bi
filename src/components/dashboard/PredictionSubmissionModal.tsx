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
  const hasPaidPlan = true; // Temporarily allow submissions without upgrade
  const { toast } = useToast();
  const category = watch('category');

  const onSubmit = async (data: FormData) => {
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
            Request Forecast Analysis
          </DialogTitle>
          <DialogDescription>
            Get AI-powered market forecasts and business predictions. Responses delivered via email.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="category">Forecast Category *</Label>
            <Select 
              onValueChange={(value) => setValue('category', value as FormData['category'])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Business Forecast">Market Forecast</SelectItem>
                <SelectItem value="Environment">Industry Trends</SelectItem>
                <SelectItem value="Political Climate">Economic Policy</SelectItem>
                <SelectItem value="Weather">Risk Scenarios</SelectItem>
                <SelectItem value="Disaster">Crisis Assessment</SelectItem>
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-destructive">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Forecast Details *</Label>
            <Textarea
              id="description"
              {...register('description', { 
                required: 'Please provide details for your forecast request',
                minLength: { value: 50, message: 'Please provide at least 50 characters' }
              })}
              placeholder={getCategoryPlaceholder(category)}
              rows={8}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Provide detailed information about the market, trend, or scenario you'd like us to forecast.
            </p>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <h4 className="font-medium text-sm">Forecast Outlook:</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>AI-powered analysis using advanced forecasting models</li>
              <li>Data-driven insights and actionable recommendations</li>
              <li>Forecast delivered to your email within 24-48 hours</li>
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
              disabled={loading} 
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
      return 'Describe the industry trend or sector you want us to analyze (e.g., fintech growth, manufacturing shifts, supply chain dynamics)...';
    case 'Political Climate':
      return 'Describe the economic policy scenario you want us to analyze (e.g., regulatory impacts, fiscal policy changes, trade agreements)...';
    case 'Weather':
      return 'Specify the risk scenario you need assessed (e.g., market volatility, currency fluctuation, commodity price risk)...';
    case 'Business Forecast':
      return 'Describe the market or business trend you want us to forecast (e.g., market growth, competitive landscape, economic indicators)...';
    case 'Disaster':
      return 'Describe the crisis scenario you want us to assess (e.g., market crash, supply chain disruption, liquidity crisis)...';
    default:
      return 'Provide detailed information about your forecast request...';
  }
}