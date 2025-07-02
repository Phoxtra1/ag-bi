
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Video, AlertCircle, ExternalLink } from 'lucide-react';
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
  const [errorMessage, setErrorMessage] = useState('');

  const processVideoUrl = (url: string): string => {
    if (!url) return '';
    
    console.log('Processing URL:', url);
    
    // Handle Google Drive links - convert to direct download
    if (url.includes('drive.google.com')) {
      let fileId = '';
      
      // Extract file ID from various Google Drive URL formats
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
        // Use Google Drive's direct download endpoint
        const directUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
        console.log('Converted Google Drive to direct URL:', directUrl);
        return directUrl;
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
      console.log('Processed Dropbox URL:', processedDropboxUrl);
      return processedDropboxUrl;
    }
    
    // Handle OneDrive links
    if (url.includes('onedrive.live.com') || url.includes('1drv.ms')) {
      // Convert OneDrive sharing link to direct download
      if (url.includes('?')) {
        const directUrl = url.replace('?', '/download?');
        console.log('Processed OneDrive URL:', directUrl);
        return directUrl;
      }
    }
    
    // Return direct URLs as-is
    console.log('Using direct URL:', url);
    return url;
  };

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setVideoError(false);
      setErrorMessage('');
      
      const savedUrl = localStorage.getItem('adminDemoVideoUrl') || '';
      console.log('Loading video URL from localStorage:', savedUrl);
      
      if (!savedUrl) {
        setIsLoading(false);
        setVideoError(true);
        setErrorMessage('No video URL configured');
        return;
      }
      
      setVideoUrl(savedUrl);
      const processed = processVideoUrl(savedUrl);
      setProcessedUrl(processed);
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleVideoError = (e: any) => {
    console.error('Video failed to load:', processedUrl, e);
    setVideoError(true);
    setErrorMessage('Video failed to load. The file may be private, the link may be incorrect, or the video format may not be supported.');
  };

  const handleVideoLoad = () => {
    console.log('Video loaded successfully:', processedUrl);
    setVideoError(false);
    setErrorMessage('');
  };

  const handleVideoCanPlay = () => {
    console.log('Video can play:', processedUrl);
    setVideoError(false);
    setErrorMessage('');
  };

  const openVideoInNewTab = () => {
    if (processedUrl) {
      window.open(processedUrl, '_blank');
    }
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
            <div className="space-y-4">
              <div className="aspect-video rounded-lg overflow-hidden bg-black">
                <video
                  controls
                  preload="metadata"
                  className="w-full h-full object-contain"
                  onError={handleVideoError}
                  onLoadedData={handleVideoLoad}
                  onCanPlay={handleVideoCanPlay}
                  crossOrigin="anonymous"
                  key={processedUrl}
                >
                  <source src={processedUrl} type="video/mp4" />
                  <source src={processedUrl} type="video/mov" />
                  <source src={processedUrl} type="video/webm" />
                  <source src={processedUrl} type="video/avi" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="flex justify-center">
                <Button 
                  variant="outline" 
                  onClick={openVideoInNewTab}
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open in New Tab
                </Button>
              </div>
            </div>
          ) : videoError ? (
            <div className="aspect-video bg-red-50 rounded-lg flex items-center justify-center border-2 border-red-200">
              <div className="text-center p-8">
                <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-500" />
                <h3 className="text-xl font-semibold text-red-700 mb-2">
                  Video Loading Failed
                </h3>
                <p className="text-red-600 mb-4">
                  {errorMessage}
                </p>
                <div className="text-sm text-red-500 bg-red-100 p-3 rounded-lg text-left mb-4">
                  <p className="font-medium mb-2">Troubleshooting:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Ensure the Google Drive file is set to "Anyone with the link can view"</li>
                    <li>For Dropbox, make sure the sharing link is public</li>
                    <li>Try uploading the video to a direct hosting service</li>
                    <li>Check if the video file format is supported (MP4, MOV, WEBM)</li>
                  </ul>
                  <p className="mt-2 font-medium">Current URL: {processedUrl}</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={openVideoInNewTab}
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Try Opening Direct Link
                </Button>
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
