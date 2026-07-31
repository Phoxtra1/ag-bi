import { databases, functions, DATABASE_ID } from './appwrite';
import { Query } from 'appwrite';

export interface ModuleInfo {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: string;
  icon: string;
  endpoint: string;
  inputFormat: any;
  outputFormat: any;
  apiType: 'internal' | 'external';
  enabled: boolean;
  externalEndpoint?: string;
  externalApiKey?: string;
}

export interface ModuleResponse<T = any> {
  success: boolean;
  module: string;
  data: T;
  processing_time_ms: number;
  timestamp: string;
}

const COMPONENT_REGISTRY_ID = 'component_registry';

// Default modules for when database is not available
const DEFAULT_MODULES: ModuleInfo[] = [
  {
    id: 'dipa_chatbot',
    name: 'dipa_chatbot',
    displayName: 'Dipa',
    description: 'Intelligent AI assistant for business intelligence guidance',
    category: 'ai',
    icon: 'message-square',
    endpoint: 'amniva-dipa-engine',
    inputFormat: { message: { type: 'text', label: 'Message', multiline: true, placeholder: 'Ask Dipa anything...' } },
    outputFormat: { responseText: 'string', metadata: 'object' },
    apiType: 'internal',
    enabled: true
  },
  {
    id: 'prediction',
    name: 'prediction',
    displayName: 'Forecast Engine',
    description: 'Business, market, economic, and risk forecasting based on verified data',
    category: 'analysis',
    icon: 'bar-chart-3',
    endpoint: 'amniva-prediction-engine',
    inputFormat: { 
      topic: { type: 'text', label: 'Topic', placeholder: 'e.g., S&P 500 outlook, commodity prices' },
      timeframe: { type: 'text', label: 'Timeframe', placeholder: 'e.g., 30 days, Q2 2026' },
      category: { type: 'text', label: 'Category', placeholder: 'e.g., markets, trade, investment' }
    },
    outputFormat: { prediction: 'string', probability: 'number', confidence: 'number' },
    apiType: 'internal',
    enabled: true
  },
  {
    id: 'verify',
    name: 'verify',
    displayName: 'Verification Engine',
    description: 'Credibility assessment and validation of datasets, reports, and business claims',
    category: 'analysis',
    icon: 'shield',
    endpoint: 'amniva-verify-engine',
    inputFormat: { 
      content: { type: 'text', label: 'Content', multiline: true, placeholder: 'Paste dataset, report, or claim to verify...' },
      sources: { type: 'text', label: 'Reference Sources (optional)', placeholder: 'Bloomberg, WSJ, FT URLs' }
    },
    outputFormat: { is_authentic: 'boolean', authenticity_score: 'number', evidence: 'array' },
    apiType: 'internal',
    enabled: true
  },
  {
    id: 'report',
    name: 'report',
    displayName: 'Info-to-Insights Engine',
    description: 'Transform raw research, documents, and data into structured business insights',
    category: 'reporting',
    icon: 'file-text',
    endpoint: 'amniva-report-engine',
    inputFormat: { 
      content: { type: 'text', label: 'Content', multiline: true, placeholder: 'Enter raw data, research, or documents for analysis...' }
    },
    outputFormat: { primary_source: 'string', attribution_confidence: 'number', context: 'string' },
    apiType: 'internal',
    enabled: true
  },
  {
    id: 'trending',
    name: 'trending',
    displayName: 'Market Trends Engine',
    description: 'Real-time market signals for investors, innovators, and entrepreneurs',
    category: 'analysis',
    icon: 'trending-up',
    endpoint: 'amniva-trending-engine',
    inputFormat: { 
      category: { type: 'text', label: 'Sector', placeholder: 'e.g., markets, investment, trade, innovation' },
      region: { type: 'text', label: 'Region (optional)', placeholder: 'e.g., global, EMEA, APAC' }
    },
    outputFormat: { trending_topics: 'array', trend_analysis: 'object' },
    apiType: 'internal',
    enabled: true
  }
];

/**
 * Fetch all available modules for the current user
 */
export async function fetchUserModules(): Promise<ModuleInfo[]> {
  try {
    // Try to fetch from Appwrite database first
    const response = await databases.listDocuments(DATABASE_ID, COMPONENT_REGISTRY_ID, [
      Query.equal('enabled', true),
      Query.orderAsc('display_order')
    ]);

    if (response.documents.length > 0) {
      return response.documents.map((doc: any) => ({
        id: doc.$id,
        name: doc.name,
        displayName: doc.display_name,
        description: doc.description,
        category: doc.category,
        icon: doc.icon || 'zap',
        endpoint: doc.endpoint,
        inputFormat: typeof doc.input_format === 'string' ? JSON.parse(doc.input_format) : doc.input_format,
        outputFormat: typeof doc.output_format === 'string' ? JSON.parse(doc.output_format) : doc.output_format,
        apiType: doc.api_type,
        enabled: doc.enabled,
        externalEndpoint: doc.external_endpoint,
        externalApiKey: doc.external_api_key
      }));
    }

    // Return default modules if no data in database
    return DEFAULT_MODULES;
  } catch (error) {
    console.warn('Failed to fetch modules from database, using defaults:', error);
    return DEFAULT_MODULES;
  }
}

/**
 * Execute a module with given input
 */
export async function executeModule<T = any>(
  moduleName: string,
  input: any
): Promise<ModuleResponse<T>> {
  const startTime = Date.now();
  
  try {
    // Get module configuration
    const modules = await fetchUserModules();
    const module = modules.find(m => m.name === moduleName);
    
    if (!module) {
      throw new Error(`Module '${moduleName}' not found`);
    }

    let result;

    // Route to external API if configured
    if (module.apiType === 'external' && module.externalEndpoint) {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      if (module.externalApiKey) {
        headers['Authorization'] = `Bearer ${module.externalApiKey}`;
      }

      const response = await fetch(module.externalEndpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(input)
      });

      if (!response.ok) {
        throw new Error(`External API error: ${response.status}`);
      }

      result = await response.json();
    } else {
      // Execute internal Appwrite function
      const response = await functions.createExecution(
        module.endpoint,
        JSON.stringify(input),
        false
      );

      if (response.responseStatusCode !== 200) {
        const errorBody = response.responseBody ? JSON.parse(response.responseBody) : {};
        throw new Error(errorBody.error || 'Module execution failed');
      }

      result = JSON.parse(response.responseBody);
    }

    const processingTime = Date.now() - startTime;

    return {
      success: true,
      module: moduleName,
      data: result.data || result,
      processing_time_ms: result.metadata?.processing_time_ms || processingTime,
      timestamp: new Date().toISOString()
    };
  } catch (error: any) {
    console.error(`Error executing module ${moduleName}:`, error);
    throw error;
  }
}

/**
 * Get module configuration from registry
 */
export async function getModuleConfig(moduleName: string): Promise<ModuleInfo | null> {
  try {
    const modules = await fetchUserModules();
    return modules.find(m => m.name === moduleName) || null;
  } catch (error) {
    console.error(`Error fetching config for ${moduleName}:`, error);
    return null;
  }
}

/**
 * Execute Dipa chatbot
 */
export async function executeDipa(message: string): Promise<ModuleResponse> {
  return executeModule('dipa_chatbot', { message });
}

/**
 * Execute Prediction engine
 */
export async function executePrediction(data: {
  topic: string;
  timeframe?: string;
  category?: string;
}): Promise<ModuleResponse> {
  return executeModule('prediction', data);
}

/**
 * Execute Verify engine
 */
export async function executeVerify(content: {
  content: string;
  sources?: string[];
}): Promise<ModuleResponse> {
  return executeModule('verify', content);
}

/**
 * Execute Report engine
 */
export async function executeReport(data: {
  content: string;
  metadata?: any;
}): Promise<ModuleResponse> {
  return executeModule('report', data);
}

/**
 * Execute Trending engine
 */
export async function executeTrending(filters?: {
  category?: string;
  region?: string;
  time_window?: string;
}): Promise<ModuleResponse> {
  return executeModule('trending', filters || {});
}
