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
        // Persist for initial loads and cross-tab sync
        try {
          localStorage.setItem('adminDemoVideoUrl', url || '');
        } catch (e) {
          console.warn('Unable to persist adminDemoVideoUrl to localStorage:', e);
        }
        videoProcessingEngine.updateVideoUrl(url);
      };

      const handleAdminNewsChange = (feeds: any[]) => {
        console.log('Admin news feeds changed:', feeds);
        // Persist to both keys used across the app so initial loads work everywhere
        try {
          localStorage.setItem('adminNewsFeeds', JSON.stringify(feeds || []));
          // NewsFeedEngine loads from "customFeedSources" for active feeds; keep them in sync
          localStorage.setItem('customFeedSources', JSON.stringify(feeds || []));
        } catch (e) {
          console.warn('Unable to persist adminNewsFeeds/customFeedSources to localStorage:', e);
        }
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
