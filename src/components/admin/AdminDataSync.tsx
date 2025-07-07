
import React, { useEffect } from 'react';
import { realTimeSync, initializeStorageSync } from '@/lib/realTimeSync';
import { newsFeedEngine, videoProcessingEngine } from '@/lib/dynamicContentEngines';

const AdminDataSync: React.FC = () => {
  useEffect(() => {
    let cleanup: (() => void) | undefined;

    try {
      // Initialize storage synchronization
      cleanup = initializeStorageSync();
      
      // Setup admin data change handlers
      const handleAdminVideoChange = (url: string) => {
        console.log('Admin video URL changed:', url);
        videoProcessingEngine.updateVideoUrl(url);
      };

      const handleAdminNewsChange = (feeds: any[]) => {
        console.log('Admin news feeds changed:', feeds);
        newsFeedEngine.updateFeeds(feeds);
      };

      // Subscribe to admin changes
      const unsubscribeVideo = realTimeSync.subscribe('videoUrl', handleAdminVideoChange);
      const unsubscribeNews = realTimeSync.subscribe('newsFeeds', handleAdminNewsChange);

      // Cleanup function
      return () => {
        try {
          unsubscribeVideo();
          unsubscribeNews();
          if (cleanup) cleanup();
          realTimeSync.cleanup();
          newsFeedEngine.cleanup();
        } catch (error) {
          console.error('Error during AdminDataSync cleanup:', error);
        }
      };
    } catch (error) {
      console.error('Error initializing AdminDataSync:', error);
      return () => {
        if (cleanup) cleanup();
      };
    }
  }, []);

  return null; // This is a utility component with no UI
};

export default AdminDataSync;
