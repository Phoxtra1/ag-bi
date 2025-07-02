
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
    
    // Handle Google Drive links
    if (url.includes('drive.google.com')) {
      const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (fileIdMatch) {
        return `https://drive.google.com/uc?export=download&id=${fileIdMatch[1]}`;
      }
    }
    
    // Handle YouTube links
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      console.log('YouTube videos cannot be embedded directly in video tags. Please use a direct video file URL.');
      return '';
    }
    
    // Handle Vimeo links
    if (url.includes('vimeo.com')) {
      console.log('Vimeo videos cannot be embedded directly in video tags. Please use a direct video file URL.');
      return '';
    }
    
    // Return direct URLs as-is
    return url;
  };

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setVideoError(false);
      const savedUrl = localStorage.getItem('adminDemoVideoUrl') || '';
      setVideoUrl(savedUrl);
      const processed = processVideoUrl(savedUrl);
      setProcessedUrl(processed);
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleVideoError = () => {
    console.log('Video failed to load:', processedUrl);
    setVideoError(true);
  };

  const handleVideoLoad = () => {
    console.log('Video loaded successfully:', processedUrl);
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
            This demo shows how our innovation platform transforms media and tech.
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
                className="w-full h-full object-cover"
                onError={handleVideoError}
                onLoadedData={handleVideoLoad}
              >
                <source src={processedUrl} type="video/mp4" />
                <source src={processedUrl} type="video/mov" />
                <source src={processedUrl} type="video/webm" />
                Your browser does not support the video tag.
              </video>
            </div>
          ) : videoError ? (
            <div className="aspect-video bg-red-50 rounded-lg flex items-center justify-center border-2 border-red-200">
              <div className="text-center p-8">
                <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-500" />
                <h3 className="text-xl font-semibold text-red-700 mb-2">
                  ❌ Video cannot be played
                </h3>
                <p className="text-red-600 mb-4">
                  The video URL provided cannot be played directly.
                </p>
                <div className="text-sm text-red-500 bg-red-100 p-3 rounded-lg">
                  <p className="font-medium mb-1">Supported formats:</p>
                  <ul className="text-left list-disc list-inside space-y-1">
                    <li>Direct video files (.mp4, .mov, .webm)</li>
                    <li>Direct download links</li>
                  </ul>
                  <p className="mt-2 font-medium">Not supported:</p>
                  <ul className="text-left list-disc list-inside space-y-1">
                    <li>Google Drive sharing links</li>
                    <li>YouTube links</li>
                    <li>Vimeo links</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center p-8">
                <Video className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  🚫 Demo video currently unavailable
                </h3>
                <p className="text-gray-500">
                  Please check back later.
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
