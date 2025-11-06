import { databases, functions } from './appwrite';
import { DATABASE_ID } from './database';

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
}

export interface ModuleResponse<T = any> {
  success: boolean;
  module: string;
  data: T;
  processing_time_ms: number;
  timestamp: string;
}

/**
 * Fetch all available modules for the current user
 */
export async function fetchUserModules(): Promise<ModuleInfo[]> {
  try {
    const response = await functions.createExecution(
      'fetchUserComponents',
      JSON.stringify({}),
      false
    );

    if (response.responseStatusCode !== 200) {
      throw new Error('Failed to fetch user modules');
    }

    const result = JSON.parse(response.responseBody);
    return result.modules || [];
  } catch (error) {
    console.error('Error fetching user modules:', error);
    throw error;
  }
}

/**
 * Execute a module with given input
 */
export async function executeModule<T = any>(
  moduleName: string,
  input: any
): Promise<ModuleResponse<T>> {
  try {
    const response = await functions.createExecution(
      'executeModule',
      JSON.stringify({ module: moduleName, input }),
      false
    );

    if (response.responseStatusCode !== 200) {
      const errorBody = JSON.parse(response.responseBody);
      throw new Error(errorBody.error || 'Module execution failed');
    }

    const result = JSON.parse(response.responseBody);
    return result;
  } catch (error) {
    console.error(`Error executing module ${moduleName}:`, error);
    throw error;
  }
}

/**
 * Get module configuration from registry
 */
export async function getModuleConfig(moduleName: string): Promise<any> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      'component_registry',
      [
        `equal("name", "${moduleName}")`,
        `equal("enabled", true)`
      ]
    );

    if (response.documents.length === 0) {
      throw new Error('Module not found');
    }

    return response.documents[0];
  } catch (error) {
    console.error(`Error fetching config for ${moduleName}:`, error);
    throw error;
  }
}

/**
 * Execute Odeneho AI chatbot
 */
export async function executeOdeneho(message: string): Promise<ModuleResponse> {
  return executeModule('odeneho_chatbot', { message });
}

/**
 * Execute Prediction engine
 */
export async function executePrediction(data: {
  context: string;
  timeframe?: string;
  category?: string;
}): Promise<ModuleResponse> {
  return executeModule('prediction', data);
}

/**
 * Execute Verify engine
 */
export async function executeVerify(content: {
  text: string;
  sources?: string[];
  metadata?: any;
}): Promise<ModuleResponse> {
  return executeModule('verify', content);
}

/**
 * Execute Report engine
 */
export async function executeReport(data: {
  contentId: string;
  metrics?: string[];
}): Promise<ModuleResponse> {
  return executeModule('report', data);
}

/**
 * Execute Trending engine
 */
export async function executeTrending(filters?: {
  category?: string;
  region?: string;
  timeRange?: string;
}): Promise<ModuleResponse> {
  return executeModule('trending', filters || {});
}
