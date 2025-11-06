import { databases } from './appwrite';
import { DATABASE_ID } from './database';

export interface APIHealthStatus {
  module_name: string;
  status: 'active' | 'delayed' | 'offline';
  response_time_ms: number;
  last_check: string;
  error_message?: string;
  endpoint: string;
}

export interface SystemHealthMetrics {
  timestamp: string;
  total_modules: number;
  active_modules: number;
  offline_modules: number;
  avg_response_time_ms: number;
  health_score: number;
  details: any;
}

/**
 * Fetch current API health statuses
 */
export async function fetchAPIHealth(): Promise<APIHealthStatus[]> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      'api_health'
    );

    return response.documents as unknown as APIHealthStatus[];
  } catch (error) {
    console.error('Error fetching API health:', error);
    throw error;
  }
}

/**
 * Fetch system health metrics history
 */
export async function fetchSystemHealthHistory(limit: number = 50): Promise<SystemHealthMetrics[]> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      'system_health',
      [`limit(${limit})`, 'orderDesc("timestamp")']
    );

    return response.documents as unknown as SystemHealthMetrics[];
  } catch (error) {
    console.error('Error fetching system health history:', error);
    throw error;
  }
}

/**
 * Get latest system health snapshot
 */
export async function getLatestSystemHealth(): Promise<SystemHealthMetrics | null> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      'system_health',
      ['limit(1)', 'orderDesc("timestamp")']
    );

    if (response.documents.length === 0) {
      return null;
    }

    return response.documents[0] as unknown as SystemHealthMetrics;
  } catch (error) {
    console.error('Error fetching latest system health:', error);
    throw error;
  }
}

/**
 * Check if a specific module is healthy
 */
export async function isModuleHealthy(moduleName: string): Promise<boolean> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      'api_health',
      [`equal("module_name", "${moduleName}")`]
    );

    if (response.documents.length === 0) {
      return false;
    }

    const status = response.documents[0] as unknown as APIHealthStatus;
    return status.status === 'active';
  } catch (error) {
    console.error(`Error checking health for ${moduleName}:`, error);
    return false;
  }
}
