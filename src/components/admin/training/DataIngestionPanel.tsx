import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Upload,
  FileText,
  Database,
  CheckCircle,
  AlertTriangle,
  Eye,
  Trash2,
  Download
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dataset } from '../TrainingSystem';
import * as trainingService from '@/lib/training/trainingService';

interface DataIngestionPanelProps {
  datasets: Dataset[];
  onDatasetUpdate: (datasets: Dataset[]) => void;
}

export const DataIngestionPanel: React.FC<DataIngestionPanelProps> = ({ 
  datasets, 
  onDatasetUpdate 
}) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedEngine, setSelectedEngine] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [previewDataset, setPreviewDataset] = useState<Dataset | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedEngine) {
      toast({
        title: "Upload Error",
        description: "Please select a file and engine type.",
        variant: "destructive"
      });
      return;
    }

    if (!file.name.match(/\.(csv|json|txt)$/)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a CSV, JSON, or TXT file.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    try {
      // Simulate file upload for demo purposes
      const datasetId = `dataset-${Date.now()}`;
      
      // Analyze file content
      const content = await readFileContent(file);
      const schema = analyzeFileSchema(file, content);
      
      const newDataset: Dataset = {
        id: datasetId,
        name: file.name,
        engine: selectedEngine,
        fileId: `file-${datasetId}`,
        uploadedAt: new Date().toISOString(),
        rows: schema.rows,
        columns: schema.columns?.length || 0,
        fileSize: file.size / (1024 * 1024), // Convert to MB
        status: 'uploaded',
        schema: schema
      };

      onDatasetUpdate([...datasets, newDataset]);
      
      toast({
        title: "Upload Successful",
        description: `${file.name} uploaded and ready for validation.`
      });

      // Reset form
      setSelectedEngine('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  // Helper functions for file processing
  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string || '');
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const analyzeFileSchema = (file: File, content: string) => {
    try {
      if (file.name.endsWith('.csv')) {
        const lines = content.split('\n').filter(line => line.trim());
        const headers = lines[0]?.split(',').map(h => h.trim().replace(/"/g, ''));
        
        return {
          rows: lines.length - 1,
          columns: headers || [],
          types: headers?.reduce((acc, col) => ({ ...acc, [col]: 'text' }), {}) || {}
        };
      } else if (file.name.endsWith('.json')) {
        const data = JSON.parse(content);
        if (Array.isArray(data) && data.length > 0) {
          return {
            rows: data.length,
            columns: Object.keys(data[0]),
            types: Object.keys(data[0]).reduce((acc, col) => ({ 
              ...acc, 
              [col]: typeof data[0][col] 
            }), {})
          };
        }
      }
      
      return { rows: 0, columns: [], types: {} };
    } catch (error) {
      return { rows: 0, columns: [], types: {} };
    }
  };

  const validateDataset = async (datasetId: string) => {
    try {
      // Simulate validation for demo purposes
      const isValid = Math.random() > 0.1; // 90% success rate
      
      onDatasetUpdate(datasets.map(d => 
        d.id === datasetId 
          ? { ...d, status: isValid ? 'validated' : 'error' }
          : d
      ));

      toast({
        title: isValid ? "Validation Successful" : "Validation Failed",
        description: isValid ? "Dataset structure is valid for training" : "Dataset has validation errors",
        variant: isValid ? "default" : "destructive"
      });
    } catch (error) {
      toast({
        title: "Validation Error",
        description: "Failed to validate dataset",
        variant: "destructive"
      });
    }
  };

  const deleteDataset = async (datasetId: string) => {
    try {
      // Simulate deletion for demo purposes
      onDatasetUpdate(datasets.filter(d => d.id !== datasetId));
      
      toast({
        title: "Dataset Deleted",
        description: "Dataset removed successfully"
      });
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete dataset",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'validated': return 'bg-green-100 text-green-800';
      case 'uploaded': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const formatFileSize = (sizeMb: number) => {
    if (sizeMb < 1) {
      return `${(sizeMb * 1024).toFixed(1)} KB`;
    }
    return `${sizeMb.toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Training Data
          </CardTitle>
          <CardDescription>
            Upload datasets for training AI engines. Supported formats: CSV, JSON, TXT
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Engine Type</Label>
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
              <Label>Dataset File</Label>
              <Input
                ref={fileInputRef}
                type="file"
                accept=".csv,.json,.txt"
                onChange={handleFileUpload}
                disabled={uploading || !selectedEngine}
              />
            </div>
          </div>
          {uploading && (
            <Alert>
              <Upload className="w-4 h-4" />
              <AlertDescription>Uploading and processing dataset...</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Datasets Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Uploaded Datasets
          </CardTitle>
          <CardDescription>
            Manage and validate training datasets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Engine</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Rows</TableHead>
                  <TableHead>Columns</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {datasets.map((dataset) => (
                  <TableRow key={dataset.id}>
                    <TableCell className="font-medium">{dataset.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{dataset.engine}</Badge>
                    </TableCell>
                    <TableCell>{formatFileSize(dataset.fileSize)}</TableCell>
                    <TableCell>{dataset.rows.toLocaleString()}</TableCell>
                    <TableCell>{dataset.columns}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(dataset.status)}>
                        {dataset.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(dataset.uploadedAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setPreviewDataset(dataset)}
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                        {dataset.status === 'uploaded' && (
                          <Button
                            size="sm"
                            onClick={() => validateDataset(dataset.id)}
                          >
                            <CheckCircle className="w-3 h-3" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteDataset(dataset.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Dataset Preview Modal */}
      {previewDataset && (
        <Card>
          <CardHeader>
            <CardTitle>Dataset Preview: {previewDataset.name}</CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setPreviewDataset(null)}
            >
              Close
            </Button>
          </CardHeader>
          <CardContent>
            {previewDataset.schema ? (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Schema</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {previewDataset.schema.columns.map((col, idx) => (
                      <div key={idx} className="flex justify-between p-2 bg-gray-50 rounded">
                        <span className="font-medium">{col}</span>
                        <span className="text-sm text-gray-600">
                          {previewDataset.schema?.types[col] || 'unknown'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Alert>
                <AlertTriangle className="w-4 h-4" />
                <AlertDescription>
                  Schema not available. Please validate the dataset first.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};