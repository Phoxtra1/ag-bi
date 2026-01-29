
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, ArrowRight, Loader2, RefreshCw, TrendingUp, Shield, BarChart3 } from 'lucide-react';

const WatchDemo = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [processedUrl, setProcessedUrl] = useState('');
  const [videoType, setVideoType] = useState<'youtube' | 'vimeo' | 'direct' | 'unsupported'>('direct');

  const detectVideoType = (url: string): { processedUrl: string; type: 'youtube' | 'vimeo' | 'direct' | 'unsupported' } => {
    if (!url) return { processedUrl: '', type: 'unsupported' };
    
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
    
    if (url.includes('vimeo.com')) {
      const videoId = url.split('/').pop()?.split('?')[0];
      if (videoId && !isNaN(Number(videoId))) {
        return { 
          processedUrl: `https://player.vimeo.com/video/${videoId}?controls=1`, 
          type: 'vimeo' 
        };
      }
    }
    
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
    const savedUrl = localStorage.getItem('adminDemoVideoUrl');
    
    if (savedUrl && savedUrl.trim()) {
      const cleanUrl = savedUrl.trim();
      setVideoUrl(cleanUrl);
      
      const { processedUrl, type } = detectVideoType(cleanUrl);
      setProcessedUrl(processedUrl);
      setVideoType(type);
      setVideoError(false);
    } else {
      setVideoUrl('');
      setProcessedUrl('');
      setVideoError(false);
    }
    
    setIsLoading(false);
  };

  useEffect(() => {
    loadVideoUrl();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'adminDemoVideoUrl') {
        loadVideoUrl();
      }
    };

    const handleCustomUpdate = () => {
      loadVideoUrl();
    };

    const handleFocus = () => {
      loadVideoUrl();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('videoUrlUpdated', handleCustomUpdate);
    window.addEventListener('focus', handleFocus);

    const interval = setInterval(() => {
      loadVideoUrl();
    }, 15000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('videoUrlUpdated', handleCustomUpdate);
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, []);

  const handleVideoError = () => {
    setVideoError(true);
  };

  const handleVideoLoad = () => {
    setVideoError(false);
  };

  const refreshVideo = () => {
    setIsLoading(true);
    loadVideoUrl();
  };

  const renderVideoPlayer = () => {
    if (videoError) {
      return (
        <div className="aspect-video bg-muted flex items-center justify-center rounded-lg">
          <div className="text-center p-8">
            <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-foreground text-lg font-medium">Video unavailable</p>
            <p className="text-muted-foreground text-sm mt-2">The video could not be loaded</p>
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
          width="100%"
          height="500"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          onError={handleVideoError}
          onLoad={handleVideoLoad}
          className="w-full h-full rounded-lg"
          title="Amniva Platform Demo"
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
          Your browser does not support the video tag.
        </video>
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading demo...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <Video className="h-16 w-16 mx-auto mb-6 text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            See Amniva in Action
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover how our AI-powered business intelligence platform transforms raw data 
            into actionable insights for smarter investment and strategic decisions.
          </p>
        </div>

        {/* Video Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="overflow-hidden shadow-2xl">
            <CardContent className="p-0">
              {processedUrl ? (
                <div className="aspect-video relative">
                  {renderVideoPlayer()}
                  <div className="absolute top-4 right-4">
                    <Button onClick={refreshVideo} variant="outline" size="sm">
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <div className="text-center p-8">
                    <Video className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      Demo video coming soon
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      A walkthrough of Amniva's business intelligence features will be available here.
                    </p>
                    <Button onClick={refreshVideo} variant="outline">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Check for Video
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Features Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Market Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Watch how Amniva analyzes market data in real-time, 
                providing verified trends and actionable business signals.
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Predictive Forecasting
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                See our AI algorithms forecast market trends and 
                identify investment opportunities before they emerge.
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-600" />
                Data Verification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Discover how our verification engine validates 
                business data against credible financial sources.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Ready to Transform Your Business Intelligence?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join enterprises already using Amniva to gain deeper 
            insights into market trends and make data-driven decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline">
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
