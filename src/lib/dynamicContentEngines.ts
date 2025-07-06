
import { realTimeSync } from './realTimeSync';

// News Feed Engine
export class NewsFeedEngine {
  private feeds: any[] = [];
  private updateInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.loadFeeds();
    this.startAutoRefresh();
  }

  private loadFeeds() {
    const savedFeeds = localStorage.getItem('adminNewsFeeds');
    if (savedFeeds) {
      this.feeds = JSON.parse(savedFeeds);
    }
  }

  async fetchNewsFromFeeds(): Promise<any[]> {
    const allNews: any[] = [];

    for (const feed of this.feeds) {
      try {
        if (feed.type === 'rss') {
          const rssNews = await this.fetchRSSFeed(feed.url);
          allNews.push(...rssNews);
        } else if (feed.type === 'api') {
          const apiNews = await this.fetchAPIFeed(feed.url, feed.apiKey);
          allNews.push(...apiNews);
        }
      } catch (error) {
        console.error(`Error fetching from ${feed.url}:`, error);
      }
    }

    return this.sortNewsByDate(allNews);
  }

  private async fetchRSSFeed(url: string): Promise<any[]> {
    try {
      // Use RSS to JSON service for CORS handling
      const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      const data = await response.json();
      
      if (data.status === 'ok' && data.items) {
        return data.items.map((item: any) => ({
          id: item.guid || item.link,
          title: item.title,
          url: item.link,
          image: this.extractImageFromContent(item.content || item.description),
          timestamp: item.pubDate,
          source: 'RSS'
        }));
      }
    } catch (error) {
      console.error('RSS fetch error:', error);
    }
    return [];
  }

  private async fetchAPIFeed(url: string, apiKey?: string): Promise<any[]> {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };
      
      if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }

      const response = await fetch(url, { headers });
      const data = await response.json();
      
      // Generic API response handling - adapt based on API structure
      const articles = data.articles || data.data || data.items || [];
      
      return articles.map((item: any, index: number) => ({
        id: item.id || item.url || `api-${index}`,
        title: item.title || item.headline,
        url: item.url || item.link,
        image: item.image || item.urlToImage || item.thumbnail,
        timestamp: item.publishedAt || item.published || item.date,
        source: 'API'
      }));
    } catch (error) {
      console.error('API fetch error:', error);
    }
    return [];
  }

  private extractImageFromContent(content: string): string {
    if (!content) return '';
    
    const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
    return imgMatch ? imgMatch[1] : '';
  }

  private sortNewsByDate(news: any[]): any[] {
    return news.sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return dateB - dateA; // Most recent first
    });
  }

  private startAutoRefresh() {
    this.updateInterval = setInterval(() => {
      this.loadFeeds();
    }, 60000); // Check for feed updates every minute
  }

  updateFeeds(newFeeds: any[]) {
    this.feeds = newFeeds;
    localStorage.setItem('adminNewsFeeds', JSON.stringify(newFeeds));
    realTimeSync.triggerUpdate('newsFeeds', newFeeds);
  }

  cleanup() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }
}

// Video Processing Engine
export class VideoProcessingEngine {
  private currentVideoUrl: string = '';

  constructor() {
    this.loadVideoUrl();
  }

  private loadVideoUrl() {
    this.currentVideoUrl = localStorage.getItem('adminDemoVideoUrl') || '';
  }

  processVideoUrl(url: string): { processedUrl: string; type: string; isValid: boolean } {
    if (!url) return { processedUrl: '', type: 'none', isValid: false };

    // YouTube processing
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = this.extractYouTubeId(url);
      if (videoId) {
        return {
          processedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&controls=1`,
          type: 'youtube',
          isValid: true
        };
      }
    }

    // Vimeo processing
    if (url.includes('vimeo.com')) {
      const videoId = this.extractVimeoId(url);
      if (videoId) {
        return {
          processedUrl: `https://player.vimeo.com/video/${videoId}?controls=1`,
          type: 'vimeo',
          isValid: true
        };
      }
    }

    // Google Drive processing
    if (url.includes('drive.google.com')) {
      const fileId = this.extractGoogleDriveId(url);
      if (fileId) {
        return {
          processedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
          type: 'googledrive',
          isValid: true
        };
      }
    }

    // Dropbox processing
    if (url.includes('dropbox.com')) {
      const processedUrl = url.replace('dl=0', 'dl=1').replace('?dl=0', '?dl=1');
      return {
        processedUrl,
        type: 'dropbox',
        isValid: true
      };
    }

    // Direct video URL
    const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv'];
    const hasVideoExtension = videoExtensions.some(ext => 
      url.toLowerCase().includes(ext.toLowerCase())
    );

    if (hasVideoExtension || url.startsWith('http')) {
      return {
        processedUrl: url,
        type: 'direct',
        isValid: true
      };
    }

    return { processedUrl: url, type: 'unknown', isValid: false };
  }

  private extractYouTubeId(url: string): string {
    const patterns = [
      /youtu\.be\/([^?&]+)/,
      /youtube\.com\/watch\?v=([^&]+)/,
      /youtube\.com\/embed\/([^?&]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return '';
  }

  private extractVimeoId(url: string): string {
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match ? match[1] : '';
  }

  private extractGoogleDriveId(url: string): string {
    const patterns = [
      /\/file\/d\/([a-zA-Z0-9-_]+)/,
      /id=([a-zA-Z0-9-_]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return '';
  }

  updateVideoUrl(url: string) {
    this.currentVideoUrl = url;
    localStorage.setItem('adminDemoVideoUrl', url);
    
    // Trigger video update event
    realTimeSync.triggerUpdate('videoUrl', url);
    
    // Dispatch custom event for immediate updates
    window.dispatchEvent(new CustomEvent('videoUrlUpdated', { detail: url }));
  }

  getCurrentVideoUrl(): string {
    return this.currentVideoUrl;
  }
}

// Link Validation Engine
export class LinkValidationEngine {
  async validateUrl(url: string): Promise<{ isValid: boolean; type: string; error?: string }> {
    if (!url) {
      return { isValid: false, type: 'empty', error: 'URL is empty' };
    }

    try {
      // Basic URL format validation
      new URL(url);
      
      // Check if it's a supported video platform
      if (this.isVideoUrl(url)) {
        return { isValid: true, type: 'video' };
      }
      
      // Check if it's an RSS feed
      if (url.includes('rss') || url.includes('feed')) {
        return { isValid: true, type: 'rss' };
      }
      
      // Check if it's an API endpoint
      if (url.includes('api')) {
        return { isValid: true, type: 'api' };
      }
      
      return { isValid: true, type: 'general' };
      
    } catch (error) {
      return { isValid: false, type: 'invalid', error: 'Invalid URL format' };
    }
  }

  private isVideoUrl(url: string): boolean {
    const videoSources = ['youtube.com', 'youtu.be', 'vimeo.com', 'drive.google.com', 'dropbox.com'];
    const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv'];
    
    return videoSources.some(source => url.includes(source)) ||
           videoExtensions.some(ext => url.toLowerCase().includes(ext));
  }
}

// Initialize engines
export const newsFeedEngine = new NewsFeedEngine();
export const videoProcessingEngine = new VideoProcessingEngine();
export const linkValidationEngine = new LinkValidationEngine();
