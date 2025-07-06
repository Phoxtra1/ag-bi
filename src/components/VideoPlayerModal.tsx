
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Video, ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RealTimeVideoPlayer from './RealTimeVideoPlayer';
import useRealTimeData from '@/hooks/useRealTimeData';

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VideoPlayerModal = ({ isOpen, onClose }: VideoPlayerModalProps) => {
  const { data: videoUrl, isLoading } = useRealTimeData<string>('videoUrl', '');

  const openVideoInNewTab = () => {
    if (videoUrl) {
      window.open(videoUrl, '_blank');
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
            <div className="flex gap-2">
              {videoUrl && (
                <Button 
                  variant="outline" 
                  onClick={openVideoInNewTab}
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open in New Tab
                </Button>
              )}
            </div>
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
          ) : (
            <div className="space-y-4">
              <div className="aspect-video rounded-lg overflow-hidden bg-black">
                <RealTimeVideoPlayer />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPlayerModal;
