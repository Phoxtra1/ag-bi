
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Video, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';

const WatchDemo = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const loadVideoUrl = () => {
      console.log('WatchDemo: Loading video URL from localStorage');
      
      // Always fetch fresh data from localStorage
      const savedUrl = localStorage.getItem('adminDemoVideoUrl');
      console.log('WatchDemo: Retrieved URL:', savedUrl);
      
      if (savedUrl && savedUrl.trim()) {
        setVideoUrl(savedUrl.trim());
        setVideoError(false);
      } else {
        setVideoUrl('');
        setVideoError(false); // Not an error, just no URL configured
      }
      
      setIsLoading(false);
    };

    // Load immediately
    loadVideoUrl();

    // Listen for storage changes to update in real-time when admin changes the URL
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'adminDemoVideoUrl') {
        console.log('WatchDemo: Video URL updated via storage event:', e.newValue);
        if (e.newValue && e.newValue.trim()) {
          setVideoUrl(e.newValue.trim());
          setVideoError(false);
        } else {
          setVideoUrl('');
          setVideoError(false);
        }
      }
    };

    // Listen for storage changes from other tabs/windows
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events from same tab (when admin panel updates)
    const handleCustomUpdate = () => {
      console.log('WatchDemo: Custom update event received');
      loadVideoUrl();
    };
    
    window.addEventListener('videoUrlUpdated', handleCustomUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('videoUrlUpdated', handleCustomUpdate);
    };
  }, []);

  const processVideoUrl = (url: string) => {
    if (!url || !url.trim()) return null;
    
    console.log('Processing video URL:', url);
    
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
          url: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`,
          type: 'iframe'
        };
      }
    }
    
    // Handle Vimeo URLs
    if (url.includes('vimeo.com')) {
      const videoId = url.split('/').pop()?.split('?')[0];
      if (videoId && !isNaN(Number(videoId))) {
        return {
          url: `https://player.vimeo.com/video/${videoId}?autoplay=1`,
          type: 'iframe'
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
          url: `https://drive.google.com/uc?export=download&id=${fileId}`,
          type: 'video'
        };
      }
    }
    
    // Handle Dropbox links
    if (url.includes('dropbox.com')) {
      let processedUrl = url;
      if (url.includes('dl=0')) {
        processedUrl = url.replace('dl=0', 'dl=1');
      } else if (!url.includes('dl=1')) {
        processedUrl = url + (url.includes('?') ? '&dl=1' : '?dl=1');
      }
      return { url: processedUrl, type: 'video' };
    }
    
    // Return direct URLs as video
    return { url: url, type: 'video' };
  };

  const processedVideo = processVideoUrl(videoUrl);

  const handleVideoError = () => {
    console.error('Video failed to load:', processedVideo?.url);
    setVideoError(true);
  };

  const handleVideoLoad = () => {
    console.log('Video loaded successfully:', processedVideo?.url);
    setVideoError(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Loading demo video...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <Video className="h-16 w-16 mx-auto mb-6 text-blue-600" />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Watch Amniva in Action
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            See how our AI-powered media intelligence platform transforms raw reports 
            into actionable insights and helps you understand global information flows.
          </p>
        </div>

        {/* Video Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="overflow-hidden shadow-2xl">
            <CardContent className="p-0">
              {processedVideo && !videoError ? (
                <div className="aspect-video">
                  {processedVideo.type === 'iframe' ? (
                    <iframe
                      src={processedVideo.url}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      onError={handleVideoError}
                      onLoad={handleVideoLoad}
                    ></iframe>
                  ) : (
                    <video
                      controls
                      autoPlay
                      className="w-full h-full object-cover"
                      onError={handleVideoError}
                      onLoadedData={handleVideoLoad}
                      key={processedVideo.url}
                    >
                      <source src={processedVideo.url} type="video/mp4" />
                      <source src={processedVideo.url} type="video/mov" />
                      <source src={processedVideo.url} type="video/webm" />
                      <source src={processedVideo.url} type="video/avi" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              ) : videoError ? (
                <div className="aspect-video bg-red-50 flex items-center justify-center border-2 border-red-200">
                  <div className="text-center p-8">
                    <Video className="h-16 w-16 mx-auto mb-4 text-red-500" />
                    <h3 className="text-xl font-semibold text-red-700 mb-2">
                      Video Loading Failed
                    </h3>
                    <p className="text-red-600 mb-4">
                      The configured video URL could not be loaded. Please check the video format and URL validity.
                    </p>
                    <p className="text-sm text-red-500 bg-red-100 p-3 rounded-lg">
                      Current URL: {videoUrl}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  <div className="text-center p-8">
                    <Video className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      No Video URL Configured
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Please configure a video URL in the admin panel to display the demo video.
                    </p>
                    <p className="text-sm text-gray-400">
                      Admin: Configure video URL in Admin Panel {'>'} Integrations {'>'} Demo Video
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Features Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="text-lg">Real-time Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Watch how Amniva processes and analyzes media data in real-time, 
                providing instant insights and trend detection.
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="text-lg">Predictive Intelligence</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                See our AI algorithms in action as they predict trends and 
                identify patterns across global information flows.
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle className="text-lg">Verification Engine</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Discover how our advanced verification system combats 
                misinformation and ensures content credibility.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Media Intelligence?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of organizations already using Amniva to gain deeper 
            insights into global media trends and information flows.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
              View Pricing Plans
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WatchDemo;
