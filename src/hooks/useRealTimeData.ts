
import { useState, useEffect, useCallback } from 'react';
import { realTimeSync } from '@/lib/realTimeSync';

export const useRealTimeData = <T>(eventType: string, initialData?: T) => {
  const [data, setData] = useState<T | null>(initialData || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdate = useCallback((newData: T) => {
    setData(newData);
    setError(null);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    
    const unsubscribe = realTimeSync.subscribe(eventType, handleUpdate);
    
    // Load initial data
    const loadInitialData = () => {
      try {
        let savedData;
        switch (eventType) {
          case 'videoUrl':
            savedData = localStorage.getItem('adminDemoVideoUrl') || '';
            break;
          case 'newsFeeds':
            savedData = JSON.parse(localStorage.getItem('adminNewsFeeds') || '[]');
            break;
          case 'integrations':
            savedData = JSON.parse(localStorage.getItem('adminIntegrations') || '{}');
            break;
          case 'aiEngines':
            savedData = JSON.parse(localStorage.getItem('adminAIEngines') || '{}');
            break;
          default:
            savedData = initialData;
        }
        
        if (savedData) {
          setData(savedData as T);
        }
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load initial data');
        setIsLoading(false);
      }
    };

    loadInitialData();
    
    return unsubscribe;
  }, [eventType, handleUpdate, initialData]);

  const updateData = useCallback((newData: T) => {
    realTimeSync.triggerUpdate(eventType, newData);
  }, [eventType]);

  return { data, isLoading, error, updateData };
};

export default useRealTimeData;
