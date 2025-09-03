import { databases, storage, functions, DATABASE_ID } from '@/lib/database';
import { ENGINE_COLLECTIONS, ENGINE_BUCKETS } from '@/lib/appwriteEngines';
import { ID } from 'appwrite';

// Dataset Management
export interface UploadDatasetRequest {
  file: File;
  engine: string;
}

export interface UploadDatasetResponse {
  datasetId: string;
  fileId: string;
  rows?: number;
  columns?: number;
  schema?: {
    columns: string[];
    types: Record<string, string>;
  };
}

export const uploadDataset = async (file: File, engine: string): Promise<UploadDatasetResponse> => {
  try {
    // Upload file to Appwrite Storage
    const fileUpload = await storage.createFile(
      ENGINE_BUCKETS.TRAINING_DATA,
      ID.unique(),
      file
    );

    // Process file to extract schema and metadata
    const schema = await analyzeDatasetSchema(file);

    // Store dataset metadata in database
    const datasetDoc = await databases.createDocument(
      DATABASE_ID,
      'training-datasets',
      ID.unique(),
      {
        name: file.name,
        engine_type: engine,
        file_id: fileUpload.$id,
        file_size: file.size,
        uploaded_at: new Date().toISOString(),
        status: 'uploaded',
        schema: JSON.stringify(schema),
        rows: schema.rows,
        columns: schema.columns?.length || 0
      }
    );

    return {
      datasetId: datasetDoc.$id,
      fileId: fileUpload.$id,
      rows: schema.rows,
      columns: schema.columns?.length || 0,
      schema: schema
    };
  } catch (error) {
    console.error('Dataset upload failed:', error);
    throw new Error('Failed to upload dataset');
  }
};

export const validateDataset = async (datasetId: string) => {
  try {
    // Retrieve dataset metadata
    const dataset = await databases.getDocument(
      DATABASE_ID,
      'training-datasets',
      datasetId
    );

    // Download file for validation
    const fileContent = await storage.getFileView(
      ENGINE_BUCKETS.TRAINING_DATA,
      dataset.file_id
    );

    // Perform validation logic
    const validation = await performDatasetValidation(fileContent, dataset.engine_type);

    // Update dataset status
    await databases.updateDocument(
      DATABASE_ID,
      'training-datasets',
      datasetId,
      {
        status: validation.isValid ? 'validated' : 'error',
        validation_errors: validation.errors ? JSON.stringify(validation.errors) : null,
        validated_at: new Date().toISOString()
      }
    );

    return {
      isValid: validation.isValid,
      message: validation.message,
      schema: validation.schema
    };
  } catch (error) {
    console.error('Dataset validation failed:', error);
    throw new Error('Failed to validate dataset');
  }
};

export const deleteDataset = async (datasetId: string) => {
  try {
    // Get dataset info
    const dataset = await databases.getDocument(
      DATABASE_ID,
      'training-datasets',
      datasetId
    );

    // Delete file from storage
    await storage.deleteFile(
      ENGINE_BUCKETS.TRAINING_DATA,
      dataset.file_id
    );

    // Delete dataset record
    await databases.deleteDocument(
      DATABASE_ID,
      'training-datasets',
      datasetId
    );
  } catch (error) {
    console.error('Dataset deletion failed:', error);
    throw new Error('Failed to delete dataset');
  }
};

// Training Management
export interface StartTrainingRequest {
  engine: string;
  datasetId: string;
  hyperparameters: {
    epochs: number;
    batch_size: number;
    learning_rate: number;
    train_val_split: number;
  };
  additionalConfig?: Record<string, any>;
}

export const startTraining = async (request: StartTrainingRequest): Promise<string> => {
  try {
    // Create training job record
    const trainingJob = await databases.createDocument(
      DATABASE_ID,
      ENGINE_COLLECTIONS.TRAINING_JOBS,
      ID.unique(),
      {
        engine_type: request.engine,
        dataset_id: request.datasetId,
        status: 'pending',
        hyperparameters: JSON.stringify(request.hyperparameters),
        additional_config: request.additionalConfig ? JSON.stringify(request.additionalConfig) : null,
        started_at: new Date().toISOString(),
        created_by: 'admin' // TODO: Get from auth context
      }
    );

    // Trigger training function
    const functionResponse = await functions.createExecution(
      'start-training',
      JSON.stringify({
        jobId: trainingJob.$id,
        engine: request.engine,
        datasetId: request.datasetId,
        hyperparameters: request.hyperparameters
      })
    );

    return trainingJob.$id;
  } catch (error) {
    console.error('Training start failed:', error);
    throw new Error('Failed to start training');
  }
};

export const stopTraining = async (jobId: string) => {
  try {
    // Update job status
    await databases.updateDocument(
      DATABASE_ID,
      ENGINE_COLLECTIONS.TRAINING_JOBS,
      jobId,
      {
        status: 'stopped',
        stopped_at: new Date().toISOString()
      }
    );

    // Trigger stop training function
    await functions.createExecution(
      'stop-training',
      JSON.stringify({ jobId })
    );
  } catch (error) {
    console.error('Training stop failed:', error);
    throw new Error('Failed to stop training');
  }
};

export const resumeTraining = async (jobId: string) => {
  try {
    // Update job status
    await databases.updateDocument(
      DATABASE_ID,
      ENGINE_COLLECTIONS.TRAINING_JOBS,
      jobId,
      {
        status: 'running',
        resumed_at: new Date().toISOString()
      }
    );

    // Trigger resume training function
    await functions.createExecution(
      'resume-training',
      JSON.stringify({ jobId })
    );
  } catch (error) {
    console.error('Training resume failed:', error);
    throw new Error('Failed to resume training');
  }
};

// Model Management
export const deployModel = async (modelId: string) => {
  try {
    // Update model status to production
    await databases.updateDocument(
      DATABASE_ID,
      ENGINE_COLLECTIONS.MODELS,
      modelId,
      {
        deployment_status: 'active',
        deployed_at: new Date().toISOString()
      }
    );

    // Trigger model deployment function
    await functions.createExecution(
      'deploy-model',
      JSON.stringify({ modelId })
    );
  } catch (error) {
    console.error('Model deployment failed:', error);
    throw new Error('Failed to deploy model');
  }
};

export const archiveModel = async (modelId: string) => {
  try {
    await databases.updateDocument(
      DATABASE_ID,
      ENGINE_COLLECTIONS.MODELS,
      modelId,
      {
        deployment_status: 'inactive',
        archived_at: new Date().toISOString()
      }
    );
  } catch (error) {
    console.error('Model archive failed:', error);
    throw new Error('Failed to archive model');
  }
};

export const getModelDownloadUrl = async (modelId: string): Promise<string> => {
  try {
    // Get model metadata
    const model = await databases.getDocument(
      DATABASE_ID,
      ENGINE_COLLECTIONS.MODELS,
      modelId
    );

    // Generate download URL
    const downloadUrl = storage.getFileDownload(
      ENGINE_BUCKETS.MODEL_ARTIFACTS,
      model.file_id
    );

    return downloadUrl;
  } catch (error) {
    console.error('Model download URL generation failed:', error);
    throw new Error('Failed to generate download URL');
  }
};

// Monitoring
export const getEngineLogs = async (filters?: {
  engine?: string;
  mode?: string;
  timeRange?: string;
}) => {
  try {
    // Build query filters
    const queries = [];
    
    if (filters?.engine) {
      queries.push(`engine_type.equal("${filters.engine}")`);
    }
    
    if (filters?.mode) {
      queries.push(`mode_used.equal("${filters.mode}")`);
    }

    if (filters?.timeRange) {
      const timeAgo = getTimeAgoTimestamp(filters.timeRange);
      queries.push(`timestamp.greaterThan("${timeAgo}")`);
    }

    const response = await databases.listDocuments(
      DATABASE_ID,
      ENGINE_COLLECTIONS.LOGS,
      queries
    );

    return response.documents;
  } catch (error) {
    console.error('Failed to fetch engine logs:', error);
    throw new Error('Failed to fetch logs');
  }
};

export const getPerformanceMetrics = async (timeRange: string) => {
  try {
    // This would typically call an analytics function
    const response = await functions.createExecution(
      'get-performance-metrics',
      JSON.stringify({ timeRange })
    );

    return JSON.parse(response.responseBody);
  } catch (error) {
    console.error('Failed to fetch performance metrics:', error);
    throw new Error('Failed to fetch metrics');
  }
};

export const submitUserFeedback = async (logId: string, feedback: 'positive' | 'negative') => {
  try {
    await databases.createDocument(
      DATABASE_ID,
      ENGINE_COLLECTIONS.FEEDBACK,
      ID.unique(),
      {
        log_id: logId,
        feedback_type: feedback,
        submitted_at: new Date().toISOString(),
        submitted_by: 'admin' // TODO: Get from auth context
      }
    );
  } catch (error) {
    console.error('Failed to submit feedback:', error);
    throw new Error('Failed to submit feedback');
  }
};

export const exportLogs = async (filters?: {
  engine?: string;
  mode?: string;
  timeRange?: string;
}) => {
  try {
    const logs = await getEngineLogs(filters);
    return logs;
  } catch (error) {
    console.error('Failed to export logs:', error);
    throw new Error('Failed to export logs');
  }
};

// Helper Functions
const analyzeDatasetSchema = async (file: File) => {
  // This is a simplified schema analysis
  // In production, this would parse the file and analyze its structure
  return new Promise<any>((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        let schema: any = { rows: 0, columns: [] };

        if (file.name.endsWith('.csv')) {
          const lines = content.split('\n').filter(line => line.trim());
          const headers = lines[0]?.split(',').map(h => h.trim().replace(/"/g, ''));
          
          schema = {
            rows: lines.length - 1,
            columns: headers || [],
            types: headers?.reduce((acc, col) => ({ ...acc, [col]: 'text' }), {}) || {}
          };
        } else if (file.name.endsWith('.json')) {
          const data = JSON.parse(content);
          if (Array.isArray(data) && data.length > 0) {
            schema = {
              rows: data.length,
              columns: Object.keys(data[0]),
              types: Object.keys(data[0]).reduce((acc, col) => ({ 
                ...acc, 
                [col]: typeof data[0][col] 
              }), {})
            };
          }
        }

        resolve(schema);
      } catch (error) {
        resolve({ rows: 0, columns: [], types: {} });
      }
    };
    reader.readAsText(file);
  });
};

const performDatasetValidation = async (fileContent: any, engineType: string) => {
  // This would contain engine-specific validation logic
  return {
    isValid: true,
    message: 'Dataset validation passed',
    schema: null,
    errors: []
  };
};

const getTimeAgoTimestamp = (timeRange: string): string => {
  const now = new Date();
  const timeMap: Record<string, number> = {
    '1h': 60 * 60 * 1000,
    '24h': 24 * 60 * 60 * 1000,
    '7d': 7 * 24 * 60 * 60 * 1000,
    '30d': 30 * 24 * 60 * 60 * 1000
  };
  
  const ms = timeMap[timeRange] || timeMap['24h'];
  return new Date(now.getTime() - ms).toISOString();
};