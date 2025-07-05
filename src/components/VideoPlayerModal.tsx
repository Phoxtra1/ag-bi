
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Video, ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VideoPlayerModal = ({ isOpen, onClose }: VideoPlayerModalProps) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [processedUrl, setProcessedUrl] = useState('');
  const [videoType, setVideoType] = useState<'youtube' | 'vimeo' | 'direct' | 'unsupported'>('direct');

  const detectVideoType = (url: string): { processedUrl: string; type: 'youtube' | 'vimeo' | 'direct' | 'unsupported' } => {
    if (!url) return { processedUrl: '', type: 'unsupported' };
    
    console.log('VideoPlayerModal: Detecting video type for URL:', url);
    
    // Handle YouTube URLs
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let videoId = '';
      
      if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
      } else if (url.includes('watch?v=')) {
        videoId = url.split('watch?v=')[1].split('&')[0];
      } else if (url.includes('embed/')) {
        videoId = url.split('embed/')[1].split('?')[0];
      }
      
      if (videoId) {
        return { 
          processedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&controls=1`, 
          type: 'youtube' 
        };
      }
    }
    
    // Handle Vimeo URLs
    if (url.includes('vimeo.com')) {
      const videoId = url.split('/').pop()?.split('?')[0];
      if (videoId && !isNaN(Number(videoId))) {
        return { 
          processedUrl: `https://player.vimeo.com/video/${videoId}?controls=1`, 
          type: 'vimeo' 
        };
      }
    }
    
    // Handle Google Drive links
    if (url.includes('drive.google.com')) {
      let fileId = '';
      
      if (url.includes('/file/d/')) {
        const match = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
        if (match) fileId = match[1];
      } else if (url.includes('id=')) {
        const match = url.match(/id=([a-zA-Z0-9-_]+)/);
        if (match) fileId = match[1];
      }
      
      if (fileId) {
        return { 
          processedUrl: `https://drive.google.com/uc?export=download&id=${fileId}`, 
          type: 'direct' 
        };
      }
    }
    
    // Handle Dropbox links
    if (url.includes('dropbox.com')) {
      let processedDropboxUrl = url;
      if (url.includes('dl=0')) {
        processedDropboxUrl = url.replace('dl=0', 'dl=1');
      } else if (!url.includes('dl=1')) {
        processedDropboxUrl = url + (url.includes('?') ? '&dl=1' : '?dl=1');
      }
      return { processedUrl: processedDropboxUrl, type: 'direct' };
    }
    
    // Check if it's a direct video file
    const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.flv', '.wmv'];
    const hasVideoExtension = videoExtensions.some(ext => 
      url.toLowerCase().includes(ext.toLowerCase())
    );
    
    if (hasVideoExtension || url.startsWith('http')) {
      return { processedUrl: url, type: 'direct' };
    }
    
    return { processedUrl: url, type: 'direct' };
  };

  const loadVideoUrl = () => {
    console.log('VideoPlayerModal: Loading video URL from localStorage');
    
    const savedUrl = localStorage.getItem('adminDemoVideoUrl');
    console.log('VideoPlayerModal: Retrieved video URL:', savedUrl);
    
    if (!savedUrl || !savedUrl.trim()) {
      console.log('VideoPlayerModal: No video URL found');
      setVideoUrl('');
      setProcessedUrl('');
      setVideoError(false);
      setIsLoading(false);
      return;
    }
    
    const cleanUrl = savedUrl.trim();
    setVideoUrl(cleanUrl);
    
    const { processedUrl, type } = detectVideoType(cleanUrl);
    setProcessedUrl(processedUrl);
    setVideoType(type);
    setVideoError(false);
    setIsLoading(false);
    
    console.log('VideoPlayerModal: Video processed:', { processedUrl, type });
  };

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      loadVideoUrl();

      // Listen for storage changes
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'adminDemoVideoUrl') {
          console.log('VideoPlayerModal: Storage change detected, reloading video');
          loadVideoUrl();
        }
      };

      // Listen for custom events
      const handleCustomUpdate = () => {
        console.log('VideoPlayerModal: Custom event detected, reloading video');
        loadVideoUrl();
      };

      // Listen for focus events (when returning to tab)
      const handleFocus = () => {
        console.log('VideoPlayerModal: Window focused, checking for video updates');
        loadVideoUrl();
      };

      window.addEventListener('storage', handleStorageChange);
      window.addEventListener('videoUrlUpdated', handleCustomUpdate);
      window.addEventListener('focus', handleFocus);

      // Poll for updates every 10 seconds when modal is open
      const interval = setInterval(() => {
        console.log('VideoPlayerModal: Polling for video URL updates');
        loadVideoUrl();
      }, 10000);

      return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('videoUrlUpdated', handleCustomUpdate);
        window.removeEventListener('focus', handleFocus);
        clearInterval(interval);
      };
    }
  }, [isOpen]);

  const handleVideoError = () => {
    console.error('VideoPlayerModal: Video failed to load:', processedUrl);
    setVideoError(true);
  };

  const handleVideoLoad = () => {
    console.log('VideoPlayerModal: Video loaded successfully');
    setVideoError(false);
  };

  const refreshVideo = () => {
    console.log('VideoPlayerModal: Manual refresh triggered');
    setIsLoading(true);
    loadVideoUrl();
  };

  const openVideoInNewTab = () => {
    if (processedUrl) {
      window.open(videoType === 'youtube' || videoType === 'vimeo' ? videoUrl : processedUrl, '_blank');
    }
  };

  const renderVideoPlayer = () => {
    if (videoError) {
      return (
        <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center p-8">
            <Video className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 text-lg font-medium">Video unavailable</p>
            <p className="text-gray-500 text-sm mt-2">The video could not be loaded</p>
            <Button onClick={refreshVideo} variant="outline" size="sm" className="mt-4">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      );
    }

    if (videoType === 'youtube' || videoType === 'vimeo') {
      return (
        <iframe
          src={processedUrl}
          className="w-full h-full rounded-lg"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          onError={handleVideoError}
          onLoad={handleVideoLoad}
          title="Demo Video"
          key={processedUrl}
        />
      );
    } else {
      return (
        <video
          controls
          preload="metadata"
          className="w-full h-full rounded-lg object-contain bg-black"
          onError={handleVideoError}
          onLoadedData={handleVideoLoad}
          onCanPlay={handleVideoLoad}
          controlsList="nodownload"
          key={processedUrl}
        >
          <source src={processedUrl} type="video/mp4" />
          <source src={processedUrl} type="video/webm" />
          <source src={processedUrl} type="video/mov" />
          <source src={processedUrl} type="video/avi" />
          Your browser does not support the video tag.
        </video>
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-full max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                <Video className="w-6 h-6 text-blue-600" />
                Watch How Amniva Works
              </DialogTitle>
              <p className="text-gray-600">
                See our Real-time Media Intelligence Tool in action.
              </p>
            </div>
            <Button onClick={refreshVideo} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </DialogHeader>
        
        <div className="px-6 pb-6">
          {isLoading ? (
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading video...</p>
              </div>
            </div>
          ) : processedUrl ? (
            <div className="space-y-4">
              <div className="aspect-video rounded-lg overflow-hidden bg-black">
                {renderVideoPlayer()}
              </div>
              {processedUrl && !videoError && (
                <div className="flex justify-center gap-2">
                  <Button 
                    variant="outline" 
                    onClick={openVideoInNewTab}
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open in New Tab
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={refreshVideo}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Refresh Video
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center p-8">
                <Video className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No demo video configured
                </h3>
                <p className="text-gray-500 mb-4">
                  Set a video URL in the Admin Panel to display the demo video here.
                </p>
                <p className="text-sm text-gray-400 mb-4">
                  Admin: Go to Admin Panel → Settings → Integrations → Demo Video
                </p>
                <Button onClick={refreshVideo} variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Check Again
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPlayerModal;
