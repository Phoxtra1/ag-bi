import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TrendingUp } from 'lucide-react';
import PredictionRequestForm from './PredictionRequestForm';

interface PredictionRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PredictionRequestDialog = ({ open, onOpenChange }: PredictionRequestDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Request Prediction
          </DialogTitle>
          <DialogDescription>
            Submit data or information for AI-powered predictive analysis
          </DialogDescription>
        </DialogHeader>
        <PredictionRequestForm onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default PredictionRequestDialog;
