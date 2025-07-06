
import React, { useState, useEffect } from 'react';
import { videoProcessingEngine } from '@/lib/dynamicContentEngines';
import useRealTimeData from '@/hooks/useRealTimeData';
import { Video } from 'lucide-react';

const RealTimeVideoPlayer: React.FC = () => {
  const { data: videoUrl } = useRealTimeData<string>('videoUrl', '');
  const [processedVideo, setProcessedVideo] = useState<{
    processedUrl: string;
    type: string;
    isValid: boolean;
  }>({ processedUrl: '', type: '', isValid: false });
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    if (videoUrl) {
      const processed = videoProcessingEngine.processVideoUrl(videoUrl);
      setProcessedVideo(processed);
      setVideoError(false);
      console.log('Video processed in real-time:', processed);
    }
  }, [videoUrl]);

  const handleVideoError = () => {
    setVideoError(true);
    console.error('Video failed to load:', processedVideo.processedUrl);
  };

  const handleVideoLoad = () => {
    setVideoError(false);
    console.log('Video loaded successfully');
  };

  if (!processedVideo.isValid) {
    return (
      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center p-8">
          <Video className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No demo video configured
          </h3>
          <p className="text-gray-500">
            Set a video URL in the Admin Panel to display the demo video here.
          </p>
        </div>
      </div>
    );
  }

  if (videoError) {
    return (
      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center p-8">
          <Video className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 text-lg font-medium">Video unavailable</p>
          <p className="text-gray-500 text-sm mt-2">The video could not be loaded</p>
        </div>
      </div>
    );
  }

  if (processedVideo.type === 'youtube' || processedVideo.type === 'vimeo') {
    return (
      <iframe
        src={processedVideo.processedUrl}
        className="w-full aspect-video rounded-lg"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        onError={handleVideoError}
        onLoad={handleVideoLoad}
        title="Demo Video"
        key={processedVideo.processedUrl}
      />
    );
  } else {
    return (
      <video
        controls
        preload="metadata"
        className="w-full aspect-video rounded-lg object-contain bg-black"
        onError={handleVideoError}
        onLoadedData={handleVideoLoad}
        onCanPlay={handleVideoLoad}
        controlsList="nodownload"
        key={processedVideo.processedUrl}
      >
        <source src={processedVideo.processedUrl} type="video/mp4" />
        <source src={processedVideo.processedUrl} type="video/webm" />
        <source src={processedVideo.processedUrl} type="video/mov" />
        Your browser does not support the video tag.
      </video>
    );
  }
};

export default RealTimeVideoPlayer;
