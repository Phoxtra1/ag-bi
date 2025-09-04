import { Client, Databases, Functions, Storage } from 'appwrite';
import { DATABASE_ID } from './database';

// Collection IDs for AI Engine System
export const ENGINE_COLLECTIONS = {
  TOGGLES: 'engine-toggles',
  LOGS: 'engine-logs', 
  TRAINING_JOBS: 'training-jobs',
  MODELS: 'ai-models-metadata',
  FEEDBACK: 'engine-feedback'
};

// Bucket IDs for AI Engine System
export const ENGINE_BUCKETS = {
  TRAINING_DATA: 'training-datasets',
  MODEL_ARTIFACTS: 'ai-model-artifacts',
  TRAINING_RESULTS: 'training-results'
};

// Function IDs for AI Engines
export const ENGINE_FUNCTIONS = {
  VERIFY: 'amniva-verify-engine',
  REPORT: 'amniva-report-engine', 
  PREDICTION: 'amniva-prediction-engine',
  TRENDING: 'amniva-trending-engine',
  ROUTER: 'amniva-engine-router'
};

// Engine Types
export type EngineType = 'verify' | 'report' | 'prediction' | 'trending';
export type EngineMode = 'internal' | 'external' | 'merge';

export interface EngineToggle {
  $id?: string;
  engineType: EngineType;
  mode: EngineMode;
  enabled: boolean;
  confidence_threshold: number;
  merge_weights?: {
    internal: number;
    external: number;
  };
  last_updated: string;
  updated_by: string;
}

export interface EngineLog {
  $id?: string;
  engine_type: EngineType;
  request_id: string;
  mode_used: EngineMode;
  confidence_score: number;
  processing_time_ms: number;
  timestamp: string;
  success: boolean;
  error_message?: string;
  metadata?: Record<string, any>;
}

export interface TrainingJob {
  $id?: string;
  engine_type: EngineType;
  job_name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  dataset_file_id: string;
  model_version: string;
  accuracy_score?: number;
  loss_value?: number;
  epochs_completed?: number;
  total_epochs: number;
  started_at: string;
  completed_at?: string;
  created_by: string;
  hyperparameters?: Record<string, any>;
}

export interface ModelMetadata {
  $id?: string;
  engine_type: EngineType;
  model_name: string;
  version: string;
  file_id: string;
  accuracy: number;
  training_job_id: string;
  deployment_status: 'active' | 'inactive' | 'testing';
  created_at: string;
  model_size_mb: number;
  training_samples: number;
  validation_accuracy?: number;
}

export interface EngineFeedback {
  $id?: string;
  engine_type: EngineType;
  request_id: string;
  user_rating: 1 | 2 | 3 | 4 | 5;
  feedback_text?: string;
  is_correct_prediction: boolean;
  actual_outcome?: string;
  submitted_at: string;
  user_id?: string;
}

// Engine Configuration
export const ENGINE_CONFIG = {
  verify: {
    name: 'Verify Engine',
    description: 'AI-powered content authenticity verification',
    default_confidence_threshold: 0.75,
    external_api_url: import.meta.env.VITE_VERIFY_API_URL || 'https://api.external-verify.com/v1/verify'
  },
  report: {
    name: 'Report Engine', 
    description: 'Attribution and source analysis engine',
    default_confidence_threshold: 0.70,
    external_api_url: import.meta.env.VITE_REPORT_API_URL || 'https://api.external-report.com/v1/analyze'
  },
  prediction: {
    name: 'Prediction Engine',
    description: 'Predictive analytics for trends and forecasts',
    default_confidence_threshold: 0.65,
    external_api_url: import.meta.env.VITE_PREDICTION_API_URL || 'https://api.external-predict.com/v1/predict'
  },
  trending: {
    name: 'Trending Engine',
    description: 'Real-time trend detection and analysis',
    default_confidence_threshold: 0.60,
    external_api_url: import.meta.env.VITE_TRENDING_API_URL || 'https://api.external-trends.com/v1/trends'
  }
};

// Engine Response Interfaces
export interface EngineResponse {
  success: boolean;
  engine_used: 'internal' | 'external' | 'merged';
  confidence: number;
  processing_time_ms: number;
  request_id: string;
  timestamp: string;
  data: any;
  metadata?: {
    model_version?: string;
    api_version?: string;
    fallback_used?: boolean;
  };
}

export interface VerifyResponse extends EngineResponse {
  data: {
    is_authentic: boolean;
    authenticity_score: number;
    evidence: string[];
    risk_factors: string[];
    sources_checked: number;
  };
}

export interface ReportResponse extends EngineResponse {
  data: {
    primary_source: string;
    attribution_confidence: number;
    mechanism: string;
    related_sources: string[];
    context: string;
    verification_status: 'verified' | 'unverified' | 'disputed';
  };
}

export interface PredictionResponse extends EngineResponse {
  data: {
    prediction: string;
    probability: number;
    forecast_horizon: string;
    key_factors: string[];
    uncertainty_range: {
      min: number;
      max: number;
    };
    historical_accuracy: number;
  };
}

export interface TrendingResponse extends EngineResponse {
  data: {
    trending_topics: Array<{
      topic: string;
      score: number;
      velocity: number;
      category: string;
      related_keywords: string[];
    }>;
    trend_analysis: {
      emerging_topics: string[];
      declining_topics: string[];
      stable_topics: string[];
    };
    geographic_data?: Record<string, number>;
  };
}