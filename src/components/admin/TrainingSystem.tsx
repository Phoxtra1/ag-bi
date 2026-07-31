import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload,
  Play,
  Square,
  RotateCcw,
  Database,
  Brain,
  BarChart3,
  FileText,
  Settings,
  CheckCircle,
  AlertTriangle,
  Clock,
  Download,
  Eye,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DataIngestionPanel } from './training/DataIngestionPanel';
import { TrainingOrchestrator } from './training/TrainingOrchestrator';
import { ModelRegistry } from './training/ModelRegistry';
import { MonitoringPanel } from './training/MonitoringPanel';

export interface TrainingJob {
  id: string;
  engine: 'verify' | 'report' | 'prediction' | 'trending' | 'dipa-ai' | 'api-engine';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'stopped';
  progress: number;
  datasetId: string;
  datasetName: string;
  startedAt: string;
  completedAt?: string;
  metrics?: {
    accuracy: number;
    loss: number;
    epochs_completed: number;
    total_epochs: number;
  };
  hyperparameters: {
    epochs: number;
    batch_size: number;
    learning_rate: number;
    train_val_split: number;
  };
}

export interface ModelVersion {
  id: string;
  engine: string;
  version: string;
  status: 'candidate' | 'production' | 'archived';
  accuracy: number;
  fileId: string;
  trainingJobId: string;
  createdAt: string;
  deployedAt?: string;
  modelSizeMb: number;
}

export interface Dataset {
  id: string;
  name: string;
  engine: string;
  fileId: string;
  uploadedAt: string;
  rows: number;
  columns: number;
  fileSize: number;
  status: 'uploaded' | 'validated' | 'error';
  schema?: {
    columns: string[];
    types: Record<string, string>;
  };
}

const TrainingSystem = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('data-ingestion');
  const [trainingJobs, setTrainingJobs] = useState<TrainingJob[]>([]);
  const [models, setModels] = useState<ModelVersion[]>([]);
  const [datasets, setDatasets] = useState<Dataset[]>([]);

  // Load training jobs from localStorage and listen for updates
  useEffect(() => {
    const loadTrainingJobs = () => {
      const stored = localStorage.getItem('trainingJobs');
      if (stored) {
        const storedJobs = JSON.parse(stored);
        // Convert stored format to component format
        const convertedJobs = storedJobs.map((job: any) => ({
          id: job.id,
          engine: job.engine_type,
          status: job.status,
          progress: job.progress || 0,
          datasetId: job.dataset_id,
          datasetName: datasets.find(d => d.id === job.dataset_id)?.name || 'Unknown Dataset',
          startedAt: job.started_at,
          completedAt: job.completed_at,
          metrics: job.metrics,
          hyperparameters: job.hyperparameters
        }));
        setTrainingJobs(convertedJobs);
      } else {
        // Initialize with mock data for demonstration
        setTrainingJobs([
          {
            id: 'job-1',
            engine: 'verify',
            status: 'running',
            progress: 65,
            datasetId: 'dataset-1',
            datasetName: 'verify_training_data_v2.csv',
            startedAt: new Date().toISOString(),
            metrics: {
              accuracy: 0.87,
              loss: 0.23,
              epochs_completed: 13,
              total_epochs: 20
            },
            hyperparameters: {
              epochs: 20,
              batch_size: 32,
              learning_rate: 0.001,
              train_val_split: 0.8
            }
          },
          {
            id: 'job-2',
            engine: 'trending',
            status: 'completed',
            progress: 100,
            datasetId: 'dataset-2',
            datasetName: 'trending_analysis_data.json',
            startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            completedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            metrics: {
              accuracy: 0.91,
              loss: 0.15,
              epochs_completed: 25,
              total_epochs: 25
            },
            hyperparameters: {
              epochs: 25,
              batch_size: 64,
              learning_rate: 0.0005,
              train_val_split: 0.85
            }
          }
        ]);
      }
    };

    const handleTrainingJobUpdate = () => {
      loadTrainingJobs();
    };

    loadTrainingJobs();
    window.addEventListener('trainingJobUpdated', handleTrainingJobUpdate);

    return () => {
      window.removeEventListener('trainingJobUpdated', handleTrainingJobUpdate);
    };
  }, [datasets]);

  // Initialize models and datasets
  useEffect(() => {
    setModels([
      {
        id: 'model-1',
        engine: 'verify',
        version: 'v2.1.0',
        status: 'production',
        accuracy: 0.89,
        fileId: 'model-verify-v210',
        trainingJobId: 'job-prev-1',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        deployedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        modelSizeMb: 45.2
      },
      {
        id: 'model-2',
        engine: 'trending',
        version: 'v1.8.3',
        status: 'candidate',
        accuracy: 0.91,
        fileId: 'model-trending-v183',
        trainingJobId: 'job-2',
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        modelSizeMb: 67.8
      }
    ]);

    setDatasets([
      {
        id: 'dataset-1',
        name: 'verify_training_data_v2.csv',
        engine: 'verify',
        fileId: 'file-verify-dataset-1',
        uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        rows: 12450,
        columns: 8,
        fileSize: 2.3,
        status: 'validated',
        schema: {
          columns: ['content', 'source', 'authenticity_label', 'confidence', 'timestamp', 'category', 'evidence', 'metadata'],
          types: {
            'content': 'text',
            'source': 'text',
            'authenticity_label': 'boolean',
            'confidence': 'float',
            'timestamp': 'datetime',
            'category': 'text',
            'evidence': 'text',
            'metadata': 'json'
          }
        }
      },
      {
        id: 'dataset-2',
        name: 'trending_analysis_data.json',
        engine: 'trending',
        fileId: 'file-trending-dataset-1',
        uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        rows: 8934,
        columns: 12,
        fileSize: 4.7,
        status: 'validated'
      }
    ]);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI Training System</h2>
          <p className="text-gray-600">Train, validate, version, and deploy internal AI models</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            {trainingJobs.filter(j => j.status === 'running').length} Active Jobs
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700">
            {models.filter(m => m.status === 'production').length} Production Models
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="data-ingestion" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Data Ingestion
          </TabsTrigger>
          <TabsTrigger value="training" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Training
          </TabsTrigger>
          <TabsTrigger value="models" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Model Registry
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Monitoring
          </TabsTrigger>
        </TabsList>

        <TabsContent value="data-ingestion">
          <DataIngestionPanel 
            datasets={datasets}
            onDatasetUpdate={(updatedDatasets) => setDatasets(updatedDatasets)}
          />
        </TabsContent>

        <TabsContent value="training">
          <TrainingOrchestrator
            trainingJobs={trainingJobs}
            datasets={datasets}
            onJobUpdate={(updatedJobs) => setTrainingJobs(updatedJobs)}
          />
        </TabsContent>

        <TabsContent value="models">
          <ModelRegistry
            models={models}
            trainingJobs={trainingJobs}
            onModelUpdate={(updatedModels) => setModels(updatedModels)}
          />
        </TabsContent>

        <TabsContent value="monitoring">
          <MonitoringPanel />
        </TabsContent>
      </Tabs>

      <Alert>
        <Settings className="w-4 h-4" />
        <AlertDescription>
          Training system is connected to Appwrite backend. All models are versioned and deployment respects engine toggle states.
          Service modules are designed for easy Python porting.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default TrainingSystem;