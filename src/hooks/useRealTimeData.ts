
import { useState, useEffect, useCallback } from 'react';
import { realTimeSync } from '@/lib/realTimeSync';

export const useRealTimeData = <T>(eventType: string, initialData?: T) => {
  const [data, setData] = useState<T | null>(initialData || null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleUpdate = useCallback((newData: T) => {
    setData(newData);
    setError(null);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    const unsubscribe = realTimeSync.subscribe(eventType, (newData: T) => {
      if (isMounted) {
        handleUpdate(newData);
      }
    });
    
    // Load initial data only once
    const loadInitialData = () => {
      if (!isMounted) return;
      
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
        
        if (savedData && isMounted) {
          setData(savedData as T);
        }
        if (isMounted) {
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load initial data');
          setIsLoading(false);
        }
      }
    };

    loadInitialData();
    
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [eventType, initialData]); // Remove handleUpdate from dependencies to prevent infinite loop

  const updateData = useCallback((newData: T) => {
    realTimeSync.triggerUpdate(eventType, newData);
  }, [eventType]);

  return { data, isLoading, error, updateData };
};

export default useRealTimeData;
