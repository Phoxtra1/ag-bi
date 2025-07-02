
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Video, X } from 'lucide-react';

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VideoPlayerModal = ({ isOpen, onClose }: VideoPlayerModalProps) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      // Fetch the video URL from localStorage
      const savedUrl = localStorage.getItem('adminDemoVideoUrl') || '';
      setVideoUrl(savedUrl);
      setIsLoading(false);
    }
  }, [isOpen]);

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
          ) : videoUrl ? (
            <div className="aspect-video rounded-lg overflow-hidden bg-black">
              <video
                controls
                autoPlay
                className="w-full h-full object-cover"
                poster="/placeholder.svg"
              >
                <source src={videoUrl} type="video/mp4" />
                <source src={videoUrl} type="video/mov" />
                Your browser does not support the video tag.
              </video>
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
