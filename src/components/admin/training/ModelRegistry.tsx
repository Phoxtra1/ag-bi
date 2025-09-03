import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Database,
  Download,
  Archive,
  Rocket,
  CheckCircle,
  Clock,
  AlertTriangle,
  BarChart3,
  Settings,
  Star
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ModelVersion, TrainingJob } from '../TrainingSystem';
import * as trainingService from '@/lib/training/trainingService';

interface ModelRegistryProps {
  models: ModelVersion[];
  trainingJobs: TrainingJob[];
  onModelUpdate: (models: ModelVersion[]) => void;
}

export const ModelRegistry: React.FC<ModelRegistryProps> = ({
  models,
  trainingJobs,
  onModelUpdate
}) => {
  const { toast } = useToast();
  const [selectedModel, setSelectedModel] = useState<ModelVersion | null>(null);

  const deployModel = async (modelId: string) => {
    try {
      await trainingService.deployModel(modelId);
      
      onModelUpdate(models.map(model => 
        model.id === modelId 
          ? { ...model, status: 'production', deployedAt: new Date().toISOString() }
          : { ...model, status: model.status === 'production' ? 'candidate' : model.status }
      ));

      toast({
        title: "Model Deployed",
        description: "Model is now in production and handling requests."
      });
    } catch (error) {
      toast({
        title: "Deployment Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    }
  };

  const archiveModel = async (modelId: string) => {
    try {
      await trainingService.archiveModel(modelId);
      
      onModelUpdate(models.map(model => 
        model.id === modelId ? { ...model, status: 'archived' } : model
      ));

      toast({
        title: "Model Archived",
        description: "Model has been archived and is no longer active."
      });
    } catch (error) {
      toast({
        title: "Archive Failed",
        description: "Failed to archive model",
        variant: "destructive"
      });
    }
  };

  const downloadModel = async (modelId: string) => {
    try {
      const downloadUrl = await trainingService.getModelDownloadUrl(modelId);
      
      // Create a temporary link to trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `model-${modelId}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Download Started",
        description: "Model download has been initiated."
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download model",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'production': return 'bg-green-100 text-green-800';
      case 'candidate': return 'bg-blue-100 text-blue-800';
      case 'archived': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'production': return <CheckCircle className="w-4 h-4" />;
      case 'candidate': return <Clock className="w-4 h-4" />;
      case 'archived': return <Archive className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const formatFileSize = (sizeMb: number) => {
    if (sizeMb < 1) {
      return `${(sizeMb * 1024).toFixed(1)} KB`;
    }
    return `${sizeMb.toFixed(1)} MB`;
  };

  const getTrainingJob = (jobId: string) => {
    return trainingJobs.find(job => job.id === jobId);
  };

  const getModelsByEngine = () => {
    const grouped = models.reduce((acc, model) => {
      if (!acc[model.engine]) acc[model.engine] = [];
      acc[model.engine].push(model);
      return acc;
    }, {} as Record<string, ModelVersion[]>);

    // Sort models within each engine by creation date (newest first)
    Object.keys(grouped).forEach(engine => {
      grouped[engine].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    });

    return grouped;
  };

  return (
    <div className="space-y-6">
      {/* Model Overview */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Rocket className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{models.filter(m => m.status === 'production').length}</p>
                <p className="text-sm text-gray-600">Production Models</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{models.filter(m => m.status === 'candidate').length}</p>
                <p className="text-sm text-gray-600">Candidate Models</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">
                  {models.length > 0 ? (models.reduce((sum, m) => sum + m.accuracy, 0) / models.length * 100).toFixed(1) : 0}%
                </p>
                <p className="text-sm text-gray-600">Avg Accuracy</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Models by Engine */}
      {Object.entries(getModelsByEngine()).map(([engine, engineModels]) => (
        <Card key={engine}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              {engine.toUpperCase()} Engine Models
            </CardTitle>
            <CardDescription>
              Manage models for the {engine} engine
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Version</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Accuracy</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Deployed</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {engineModels.map((model) => (
                    <TableRow key={model.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {model.status === 'production' && <Star className="w-4 h-4 text-yellow-500" />}
                          {model.version}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(model.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(model.status)}
                            {model.status}
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell>{(model.accuracy * 100).toFixed(1)}%</TableCell>
                      <TableCell>{formatFileSize(model.modelSizeMb)}</TableCell>
                      <TableCell>{new Date(model.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {model.deployedAt ? new Date(model.deployedAt).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" onClick={() => setSelectedModel(model)}>
                                <BarChart3 className="w-3 h-3" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Model Details</DialogTitle>
                                <DialogDescription>
                                  Detailed information for {model.engine} v{model.version}
                                </DialogDescription>
                              </DialogHeader>
                              {selectedModel && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Engine</Label>
                                      <p className="text-sm">{selectedModel.engine}</p>
                                    </div>
                                    <div>
                                      <Label>Version</Label>
                                      <p className="text-sm">{selectedModel.version}</p>
                                    </div>
                                    <div>
                                      <Label>Accuracy</Label>
                                      <p className="text-sm">{(selectedModel.accuracy * 100).toFixed(2)}%</p>
                                    </div>
                                    <div>
                                      <Label>Model Size</Label>
                                      <p className="text-sm">{formatFileSize(selectedModel.modelSizeMb)}</p>
                                    </div>
                                  </div>
                                  
                                  {getTrainingJob(selectedModel.trainingJobId) && (
                                    <div>
                                      <Label>Training Metrics</Label>
                                      <div className="mt-2 p-3 bg-gray-50 rounded">
                                        {getTrainingJob(selectedModel.trainingJobId)?.metrics && (
                                          <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div>Loss: {getTrainingJob(selectedModel.trainingJobId)?.metrics?.loss.toFixed(3)}</div>
                                            <div>Epochs: {getTrainingJob(selectedModel.trainingJobId)?.metrics?.epochs_completed}</div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          
                          <Button size="sm" variant="outline" onClick={() => downloadModel(model.id)}>
                            <Download className="w-3 h-3" />
                          </Button>
                          
                          {model.status === 'candidate' && (
                            <Button size="sm" onClick={() => deployModel(model.id)}>
                              <Rocket className="w-3 h-3" />
                            </Button>
                          )}
                          
                          {model.status !== 'production' && (
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => archiveModel(model.id)}
                            >
                              <Archive className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      ))}

      {models.length === 0 && (
        <Alert>
          <Database className="w-4 h-4" />
          <AlertDescription>
            No models found. Complete a training job to see models here.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};