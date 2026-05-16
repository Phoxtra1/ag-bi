import React from 'react';
import { databases, DATABASE_ID } from './appwrite';
import { ID, Query } from 'appwrite';

// ==========================================
// SYNC OPERATIONS & PERSISTENCE
// ==========================================

export interface SyncOperation {
  id: string;
  collection: string;
  documentId?: string;
  data: any;
  operation: 'create' | 'update' | 'delete';
  status: 'pending' | 'success' | 'failed';
  timestamp: string;
  retryCount: number;
  error?: string;
}

/**
 * Save with confirmation - ensures data is persisted before UI update
 */
export async function saveWithConfirmation<T>(
  collection: string,
  data: T,
  documentId?: string
): Promise<{ success: boolean; documentId?: string; error?: string }> {
  try {
    let result;
    
    if (documentId) {
      result = await databases.updateDocument(DATABASE_ID, collection, documentId, data as any);
    } else {
      result = await databases.createDocument(DATABASE_ID, collection, ID.unique(), data as any);
    }

    return {
      success: true,
      documentId: result.$id
    };
  } catch (error: any) {
    console.error('[Sync] Save failed:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Validate API endpoint reachability
 */
export async function validateEndpoint(
  endpoint: string,
  apiKey?: string
): Promise<{ reachable: boolean; responseTime: number; error?: string }> {
  const startTime = Date.now();
  
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(endpoint, {
      method: 'HEAD',
      headers,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    return {
      reachable: response.ok || response.status === 405 || response.status === 204,
      responseTime: Date.now() - startTime
    };
  } catch (error: any) {
    return {
      reachable: false,
      responseTime: Date.now() - startTime,
      error: error.name === 'AbortError' ? 'Request timed out' : error.message
    };
  }
}

/**
 * Store API health status in Appwrite
 */
export async function updateAPIHealth(
  moduleName: string,
  status: 'active' | 'delayed' | 'offline',
  responseTime: number,
  endpoint: string,
  error?: string
): Promise<boolean> {
  const API_HEALTH_COLLECTION = 'api_health';
  
  try {
    const existing = await databases.listDocuments(DATABASE_ID, API_HEALTH_COLLECTION, [
      Query.equal('module_name', moduleName)
    ]);

    const healthData = {
      module_name: moduleName,
      status,
      response_time_ms: responseTime,
      endpoint,
      last_check: new Date().toISOString(),
      error_message: error || ''
    };

    if (existing.documents.length > 0) {
      await databases.updateDocument(
        DATABASE_ID,
        API_HEALTH_COLLECTION,
        existing.documents[0].$id,
        healthData
      );
    } else {
      await databases.createDocument(
        DATABASE_ID,
        API_HEALTH_COLLECTION,
        ID.unique(),
        healthData
      );
    }

    return true;
  } catch (err) {
    console.error('[Sync] Failed to update API health:', err);
    return false;
  }
}

// ==========================================
// REAL-TIME EVENT SYSTEM
// ==========================================

// Event system for real-time updates
class RealTimeSyncManager {
  private eventListeners: Map<string, Set<(data: any) => void>> = new Map();
  private pollingIntervals: Map<string, ReturnType<typeof setInterval>> = new Map();
  private isInitialized = false;

  // Subscribe to real-time updates
  subscribe(eventType: string, callback: (data: any) => void) {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, new Set());
    }
    this.eventListeners.get(eventType)!.add(callback);

    // Start polling for this event type if not already started
    this.startPolling(eventType);

    // Return unsubscribe function
    return () => {
      const listeners = this.eventListeners.get(eventType);
      if (listeners) {
        listeners.delete(callback);
        if (listeners.size === 0) {
          this.stopPolling(eventType);
        }
      }
    };
  }

  // Emit events to all subscribers
  private emit(eventType: string, data: any) {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${eventType}:`, error);
        }
      });
    }
  }

  // Start polling for specific data changes
  private startPolling(eventType: string) {
    if (this.pollingIntervals.has(eventType)) return;

    const interval = setInterval(async () => {
      try {
        await this.checkForUpdates(eventType);
      } catch (error) {
        console.error(`Polling error for ${eventType}:`, error);
      }
    }, 3000); // Poll every 3 seconds

    this.pollingIntervals.set(eventType, interval);
  }

  // Stop polling for specific event type
  private stopPolling(eventType: string) {
    const interval = this.pollingIntervals.get(eventType);
    if (interval) {
      clearInterval(interval);
      this.pollingIntervals.delete(eventType);
    }
  }

  // Check for updates based on event type
  private async checkForUpdates(eventType: string) {
    const lastUpdate = localStorage.getItem(`lastUpdate_${eventType}`) || '0';
    const currentTime = Date.now().toString();

    // Check localStorage for admin changes
    const adminData = this.getAdminData(eventType);
    const lastAdminUpdate = localStorage.getItem(`adminUpdate_${eventType}`) || '0';

    if (lastAdminUpdate > lastUpdate) {
      this.emit(eventType, adminData);
      localStorage.setItem(`lastUpdate_${eventType}`, currentTime);
    }
  }

  // Get admin data based on event type
  private getAdminData(eventType: string) {
    try {
      switch (eventType) {
        case 'videoUrl':
          return localStorage.getItem('adminDemoVideoUrl') || '';
        case 'newsFeeds':
          return JSON.parse(localStorage.getItem('adminNewsFeeds') || '[]');
        case 'integrations':
          return JSON.parse(localStorage.getItem('adminIntegrations') || '{}');
        case 'aiEngines':
          return JSON.parse(localStorage.getItem('adminAIEngines') || '{}');
        default:
          return null;
      }
    } catch (error) {
      console.error(`Error getting admin data for ${eventType}:`, error);
      return null;
    }
  }

  // Trigger update for specific event type
  triggerUpdate(eventType: string, data: any) {
    const currentTime = Date.now().toString();
    localStorage.setItem(`adminUpdate_${eventType}`, currentTime);
    
    // Also emit immediately for instant updates
    this.emit(eventType, data);
  }

  // Cleanup all polling intervals
  cleanup() {
    this.pollingIntervals.forEach((interval) => {
      clearInterval(interval);
    });
    this.pollingIntervals.clear();
    this.eventListeners.clear();
  }
}

// Singleton instance
export const realTimeSync = new RealTimeSyncManager();

// Custom hooks for easy component integration
export const useRealTimeSync = (eventType: string, callback: (data: any) => void) => {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    const unsubscribe = realTimeSync.subscribe(eventType, (newData) => {
      setData(newData);
      callback(newData);
    });

    return unsubscribe;
  }, [eventType, callback]);

  return data;
};

// Storage change listeners
export const initializeStorageSync = () => {
  // Prevent multiple initializations
  if (typeof window === 'undefined') return;

  // Listen for storage changes across tabs
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key?.startsWith('adminUpdate_')) {
      const eventType = e.key.replace('adminUpdate_', '');
      const data = realTimeSync['getAdminData'](eventType);
      realTimeSync.triggerUpdate(eventType, data);
    }
  };

  // Listen for custom events
  const handleCustomEvent = (e: CustomEvent) => {
    const { eventType, data } = e.detail;
    realTimeSync.triggerUpdate(eventType, data);
  };

  window.addEventListener('storage', handleStorageChange);
  window.addEventListener('adminDataChanged', handleCustomEvent as EventListener);

  // Return cleanup function
  return () => {
    window.removeEventListener('storage', handleStorageChange);
    window.removeEventListener('adminDataChanged', handleCustomEvent as EventListener);
  };
};
