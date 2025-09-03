import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { 
  Play,
  Square,
  RotateCcw,
  Brain,
  Settings,
  Clock,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TrainingJob, Dataset } from '../TrainingSystem';
import * as trainingService from '@/lib/training/trainingService';

interface TrainingOrchestratorProps {
  trainingJobs: TrainingJob[];
  datasets: Dataset[];
  onJobUpdate: (jobs: TrainingJob[]) => void;
}

export const TrainingOrchestrator: React.FC<TrainingOrchestratorProps> = ({
  trainingJobs,
  datasets,
  onJobUpdate
}) => {
  const { toast } = useToast();
  const [selectedEngine, setSelectedEngine] = useState<string>('');
  const [selectedDataset, setSelectedDataset] = useState<string>('');
  const [hyperparameters, setHyperparameters] = useState({
    epochs: 20,
    batch_size: 32,
    learning_rate: 0.001,
    train_val_split: 0.8
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const startTraining = async () => {
    if (!selectedEngine || !selectedDataset) {
      toast({
        title: "Configuration Error",
        description: "Please select an engine and dataset.",
        variant: "destructive"
      });
      return;
    }

    const dataset = datasets.find(d => d.id === selectedDataset);
    if (!dataset) return;

    try {
      const jobId = await trainingService.startTraining({
        engine: selectedEngine as any,
        datasetId: selectedDataset,
        hyperparameters
      });

      const newJob: TrainingJob = {
        id: jobId,
        engine: selectedEngine as any,
        status: 'pending',
        progress: 0,
        datasetId: selectedDataset,
        datasetName: dataset.name,
        startedAt: new Date().toISOString(),
        hyperparameters
      };

      onJobUpdate([...trainingJobs, newJob]);

      toast({
        title: "Training Started",
        description: `Training job ${jobId} initiated for ${selectedEngine} engine.`
      });

      // Reset form
      setSelectedEngine('');
      setSelectedDataset('');
    } catch (error) {
      toast({
        title: "Training Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    }
  };

  const stopTraining = async (jobId: string) => {
    try {
      await trainingService.stopTraining(jobId);
      
      onJobUpdate(trainingJobs.map(job => 
        job.id === jobId ? { ...job, status: 'stopped' } : job
      ));

      toast({
        title: "Training Stopped",
        description: `Training job ${jobId} has been stopped.`
      });
    } catch (error) {
      toast({
        title: "Stop Failed",
        description: "Failed to stop training job",
        variant: "destructive"
      });
    }
  };

  const resumeTraining = async (jobId: string) => {
    try {
      await trainingService.resumeTraining(jobId);
      
      onJobUpdate(trainingJobs.map(job => 
        job.id === jobId ? { ...job, status: 'running' } : job
      ));

      toast({
        title: "Training Resumed",
        description: `Training job ${jobId} has been resumed.`
      });
    } catch (error) {
      toast({
        title: "Resume Failed",
        description: "Failed to resume training job",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'stopped': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getAvailableDatasets = () => {
    return datasets.filter(d => 
      d.status === 'validated' && 
      (selectedEngine === '' || d.engine === selectedEngine)
    );
  };

  const formatDuration = (startTime: string, endTime?: string) => {
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : new Date();
    const duration = Math.floor((end.getTime() - start.getTime()) / 1000 / 60);
    return `${duration}m`;
  };

  return (
    <div className="space-y-6">
      {/* Training Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Start New Training
          </CardTitle>
          <CardDescription>
            Configure and start training for AI engines
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Engine</Label>
              <Select value={selectedEngine} onValueChange={setSelectedEngine}>
                <SelectTrigger>
                  <SelectValue placeholder="Select engine..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="verify">Verify Engine</SelectItem>
                  <SelectItem value="report">Report Engine</SelectItem>
                  <SelectItem value="prediction">Prediction Engine</SelectItem>
                  <SelectItem value="trending">Trending Engine</SelectItem>
                  <SelectItem value="odeneho-ai">Odeneho AI</SelectItem>
                  <SelectItem value="api-engine">API Engine</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Dataset</Label>
              <Select value={selectedDataset} onValueChange={setSelectedDataset}>
                <SelectTrigger>
                  <SelectValue placeholder="Select dataset..." />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableDatasets().map(dataset => (
                    <SelectItem key={dataset.id} value={dataset.id}>
                      {dataset.name} ({dataset.rows.toLocaleString()} rows)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Basic Hyperparameters */}
          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label>Epochs</Label>
              <Input
                type="number"
                value={hyperparameters.epochs}
                onChange={(e) => setHyperparameters({
                  ...hyperparameters,
                  epochs: parseInt(e.target.value)
                })}
                min="1"
                max="1000"
              />
            </div>
            <div>
              <Label>Batch Size</Label>
              <Input
                type="number"
                value={hyperparameters.batch_size}
                onChange={(e) => setHyperparameters({
                  ...hyperparameters,
                  batch_size: parseInt(e.target.value)
                })}
                min="1"
                max="512"
              />
            </div>
            <div>
              <Label>Learning Rate</Label>
              <Input
                type="number"
                step="0.0001"
                value={hyperparameters.learning_rate}
                onChange={(e) => setHyperparameters({
                  ...hyperparameters,
                  learning_rate: parseFloat(e.target.value)
                })}
                min="0.0001"
                max="0.1"
              />
            </div>
            <div>
              <Label>Train/Val Split</Label>
              <Input
                type="number"
                step="0.1"
                value={hyperparameters.train_val_split}
                onChange={(e) => setHyperparameters({
                  ...hyperparameters,
                  train_val_split: parseFloat(e.target.value)
                })}
                min="0.1"
                max="0.9"
              />
            </div>
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <Settings className="w-4 h-4 mr-2" />
              {showAdvanced ? 'Hide' : 'Show'} Advanced Options
            </Button>
            <Button 
              onClick={startTraining}
              disabled={!selectedEngine || !selectedDataset}
            >
              <Play className="w-4 h-4 mr-2" />
              Start Training
            </Button>
          </div>

          {showAdvanced && (
            <Card className="bg-gray-50">
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div>
                    <Label>Additional Configuration (JSON)</Label>
                    <Textarea
                      placeholder='{"optimizer": "adam", "dropout": 0.2, "regularization": "l2"}'
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Active Training Jobs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Training Jobs
          </CardTitle>
          <CardDescription>
            Monitor and manage active training jobs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {trainingJobs.map((job) => (
                <Card key={job.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-lg">{job.engine.toUpperCase()} Engine</h4>
                        <p className="text-sm text-gray-600">{job.datasetName}</p>
                        <p className="text-xs text-gray-500">Job ID: {job.id}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(job.status)}>
                          {job.status}
                        </Badge>
                        {job.status === 'running' && (
                          <Button size="sm" variant="outline" onClick={() => stopTraining(job.id)}>
                            <Square className="w-3 h-3" />
                          </Button>
                        )}
                        {job.status === 'stopped' && (
                          <Button size="sm" onClick={() => resumeTraining(job.id)}>
                            <RotateCcw className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>

                    {job.status === 'running' && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{job.progress}%</span>
                        </div>
                        <Progress value={job.progress} className="h-2" />
                      </div>
                    )}

                    {job.metrics && (
                      <div className="mt-3 grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Accuracy:</span>
                          <div className="font-semibold">{(job.metrics.accuracy * 100).toFixed(1)}%</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Loss:</span>
                          <div className="font-semibold">{job.metrics.loss.toFixed(3)}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Epochs:</span>
                          <div className="font-semibold">
                            {job.metrics.epochs_completed}/{job.metrics.total_epochs}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">Duration:</span>
                          <div className="font-semibold">
                            {formatDuration(job.startedAt, job.completedAt)}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mt-3 flex justify-between text-xs text-gray-500">
                      <span>Started: {new Date(job.startedAt).toLocaleString()}</span>
                      {job.completedAt && (
                        <span>Completed: {new Date(job.completedAt).toLocaleString()}</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              {trainingJobs.length === 0 && (
                <Alert>
                  <Clock className="w-4 h-4" />
                  <AlertDescription>
                    No training jobs found. Start a new training job to see it here.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};