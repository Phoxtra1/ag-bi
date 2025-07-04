
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Video, AlertCircle, ExternalLink, Play } from 'lucide-react';
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
  const [videoType, setVideoType] = useState<'youtube' | 'vimeo' | 'direct' | 'unsupported'>('direct');

  const processVideoUrl = (url: string): { processedUrl: string; type: 'youtube' | 'vimeo' | 'direct' | 'unsupported' } => {
    if (!url) return { processedUrl: '', type: 'unsupported' };
    
    console.log('Processing URL:', url);
    
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
          processedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`, 
          type: 'youtube' 
        };
      }
    }
    
    // Handle Vimeo URLs
    if (url.includes('vimeo.com')) {
      const videoId = url.split('/').pop()?.split('?')[0];
      if (videoId && !isNaN(Number(videoId))) {
        return { 
          processedUrl: `https://player.vimeo.com/video/${videoId}?autoplay=1`, 
          type: 'vimeo' 
        };
      }
    }
    
    // Handle Google Drive links - convert to direct download
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
    
    // Handle OneDrive links
    if (url.includes('onedrive.live.com') || url.includes('1drv.ms')) {
      if (url.includes('?')) {
        const directUrl = url.replace('?', '/download?');
        return { processedUrl: directUrl, type: 'direct' };
      }
    }
    
    // Return direct URLs as-is
    return { processedUrl: url, type: 'direct' };
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
        setErrorMessage('No video URL configured in Admin Panel');
        return;
      }
      
      setVideoUrl(savedUrl);
      const { processedUrl, type } = processVideoUrl(savedUrl);
      setProcessedUrl(processedUrl);
      setVideoType(type);
      setIsLoading(false);
      
      console.log('Video processed:', { processedUrl, type });
    }
  }, [isOpen]);

  const handleVideoError = (e: any) => {
    console.error('Video failed to load:', processedUrl, e);
    setVideoError(true);
    setErrorMessage('Video failed to load. Please check the URL or try a different format.');
  };

  const handleVideoLoad = () => {
    console.log('Video loaded successfully:', processedUrl);
    setVideoError(false);
    setErrorMessage('');
  };

  const openVideoInNewTab = () => {
    if (processedUrl) {
      window.open(videoType === 'youtube' || videoType === 'vimeo' ? videoUrl : processedUrl, '_blank');
    }
  };

  const renderVideoPlayer = () => {
    if (videoType === 'youtube' || videoType === 'vimeo') {
      return (
        <iframe
          src={processedUrl}
          className="w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onError={handleVideoError}
          onLoad={handleVideoLoad}
        ></iframe>
      );
    } else {
      return (
        <video
          controls
          autoPlay
          preload="metadata"
          className="w-full h-full object-contain"
          onError={handleVideoError}
          onLoadedData={handleVideoLoad}
          onCanPlay={handleVideoLoad}
          crossOrigin="anonymous"
          key={processedUrl}
        >
          <source src={processedUrl} type="video/mp4" />
          <source src={processedUrl} type="video/mov" />
          <source src={processedUrl} type="video/webm" />
          <source src={processedUrl} type="video/avi" />
          Your browser does not support the video tag.
        </video>
      );
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
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading video...</p>
              </div>
            </div>
          ) : processedUrl && !videoError ? (
            <div className="space-y-4">
              <div className="aspect-video rounded-lg overflow-hidden bg-black">
                {renderVideoPlayer()}
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
                  <p className="font-medium mb-2">Current URL: {videoUrl}</p>
                  <p className="font-medium mb-2">Processed URL: {processedUrl}</p>
                  <p className="font-medium mb-2">Video Type: {videoType}</p>
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
                  Please configure a video URL in the admin panel under Integrations > Demo Video.
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
