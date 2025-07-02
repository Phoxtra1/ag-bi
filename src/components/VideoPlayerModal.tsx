
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Video, AlertCircle } from 'lucide-react';

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VideoPlayerModal = ({ isOpen, onClose }: VideoPlayerModalProps) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [processedUrl, setProcessedUrl] = useState('');

  const processVideoUrl = (url: string): string => {
    if (!url) return '';
    
    console.log('Original URL:', url);
    
    // Handle Google Drive links - convert to direct download
    if (url.includes('drive.google.com')) {
      let fileId = '';
      
      // Handle different Google Drive URL formats
      if (url.includes('/file/d/')) {
        const match = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
        if (match) fileId = match[1];
      } else if (url.includes('id=')) {
        const match = url.match(/id=([a-zA-Z0-9-_]+)/);
        if (match) fileId = match[1];
      } else if (url.includes('/d/')) {
        const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
        if (match) fileId = match[1];
      }
      
      if (fileId) {
        const directUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
        console.log('Converted Google Drive URL:', directUrl);
        return directUrl;
      }
    }
    
    // Handle Dropbox links
    if (url.includes('dropbox.com') && !url.includes('dl=1')) {
      const dropboxUrl = url.replace('dl=0', 'dl=1').replace('?dl=0', '?dl=1');
      if (!dropboxUrl.includes('dl=1')) {
        return dropboxUrl + (dropboxUrl.includes('?') ? '&dl=1' : '?dl=1');
      }
      return dropboxUrl;
    }
    
    // Return direct URLs as-is
    console.log('Using direct URL:', url);
    return url;
  };

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setVideoError(false);
      const savedUrl = localStorage.getItem('adminDemoVideoUrl') || '';
      console.log('Saved URL from localStorage:', savedUrl);
      setVideoUrl(savedUrl);
      const processed = processVideoUrl(savedUrl);
      setProcessedUrl(processed);
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleVideoError = (e: any) => {
    console.error('Video failed to load:', processedUrl, e);
    setVideoError(true);
  };

  const handleVideoLoad = () => {
    console.log('Video loaded successfully:', processedUrl);
    setVideoError(false);
  };

  const handleVideoCanPlay = () => {
    console.log('Video can play:', processedUrl);
    setVideoError(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-auto p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Video className="w-6 h-6 text-blue-600" />
            Watch How Amniva Works
          </DialogTitle>
          <p className="text-gray-600">
            See our Real-time Media Intelligence Tool in action.
          </p>
        </DialogHeader>
        
        <div className="px-6 pb-6">
          {isLoading ? (
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : processedUrl && !videoError ? (
            <div className="aspect-video rounded-lg overflow-hidden bg-black">
              <video
                controls
                autoPlay
                preload="metadata"
                className="w-full h-full object-cover"
                onError={handleVideoError}
                onLoadedData={handleVideoLoad}
                onCanPlay={handleVideoCanPlay}
                crossOrigin="anonymous"
              >
                <source src={processedUrl} type="video/mp4" />
                <source src={processedUrl} type="video/mov" />
                <source src={processedUrl} type="video/webm" />
                <source src={processedUrl} type="video/avi" />
                Your browser does not support the video tag.
              </video>
            </div>
          ) : videoError ? (
            <div className="aspect-video bg-red-50 rounded-lg flex items-center justify-center border-2 border-red-200">
              <div className="text-center p-8">
                <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-500" />
                <h3 className="text-xl font-semibold text-red-700 mb-2">
                  Video Loading Failed
                </h3>
                <p className="text-red-600 mb-4">
                  The video could not be loaded. This might be due to:
                </p>
                <div className="text-sm text-red-500 bg-red-100 p-3 rounded-lg text-left">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Incorrect sharing permissions on Google Drive</li>
                    <li>Video file is private or restricted</li>
                    <li>Network connectivity issues</li>
                    <li>Unsupported video format</li>
                  </ul>
                  <p className="mt-2 font-medium">Current URL: {processedUrl}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center p-8">
                <Video className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No Demo Video Available
                </h3>
                <p className="text-gray-500">
                  Please configure a video URL in the admin panel.
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPlayerModal;
