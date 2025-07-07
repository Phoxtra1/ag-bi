
import React from 'react';
import { databases } from './appwrite';
import { DATABASE_ID } from './database';

// Event system for real-time updates
class RealTimeSyncManager {
  private eventListeners: Map<string, Set<(data: any) => void>> = new Map();
  private pollingIntervals: Map<string, NodeJS.Timeout> = new Map();

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
      listeners.forEach(callback => callback(data));
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
  // Listen for storage changes across tabs
  window.addEventListener('storage', (e) => {
    if (e.key?.startsWith('adminUpdate_')) {
      const eventType = e.key.replace('adminUpdate_', '');
      const data = realTimeSync['getAdminData'](eventType);
      realTimeSync.triggerUpdate(eventType, data);
    }
  });

  // Listen for custom events
  window.addEventListener('adminDataChanged', (e: any) => {
    const { eventType, data } = e.detail;
    realTimeSync.triggerUpdate(eventType, data);
  });
};
