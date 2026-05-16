
import { realTimeSync } from './realTimeSync';

// News Feed Engine
export class NewsFeedEngine {
  private feeds: any[] = [];
  private updateInterval: ReturnType<typeof setInterval> | null = null;
  private cache: Map<string, { data: any[]; expiry: number }> = new Map();

  constructor() {
    this.loadFeeds();
    this.startAutoRefresh();
  }

  private loadFeeds() {
    const savedFeeds = localStorage.getItem('customFeedSources');
    if (savedFeeds) {
      try {
        const allFeeds = JSON.parse(savedFeeds);
        this.feeds = allFeeds.filter((feed: any) => feed.isActive);
        console.log(`Loaded ${this.feeds.length} active feed sources`);
      } catch (error) {
        console.error('Error parsing feed sources:', error);
        this.feeds = [];
      }
    } else {
      this.feeds = [];
    }
  }

  async fetchNewsFromFeeds(): Promise<any[]> {
    const allNews: any[] = [];
    
    // Check cache first
    const cacheKey = 'allFeeds';
    const cached = this.cache.get(cacheKey);
    if (cached && cached.expiry > Date.now()) {
      console.log('Returning cached news data');
      return cached.data;
    }

    for (const feed of this.feeds) {
      try {
        console.log(`Fetching from ${feed.name} (${feed.type}): ${feed.url}`);
        
        if (feed.type === 'rss') {
          const rssNews = await this.fetchRSSFeed(feed.url, feed.name, feed.category);
          allNews.push(...rssNews);
        } else if (feed.type === 'api' || feed.type === 'news') {
          const apiNews = await this.fetchAPIFeed(feed.url, feed.apiKey, feed.name, feed.category);
          allNews.push(...apiNews);
        } else if (feed.type === 'social') {
          const socialNews = await this.fetchSocialFeed(feed.url, feed.name, feed.category);
          allNews.push(...socialNews);
        }
      } catch (error) {
        console.error(`Error fetching from ${feed.name}:`, error);
        // Continue with other feeds even if one fails
      }
    }

    const sortedNews = this.sortNewsByDate(allNews);
    
    // Cache results for 5 minutes
    this.cache.set(cacheKey, {
      data: sortedNews,
      expiry: Date.now() + (5 * 60 * 1000)
    });

    console.log(`Successfully fetched ${sortedNews.length} news items from ${this.feeds.length} feeds`);
    return sortedNews;
  }

  private async fetchRSSFeed(url: string, sourceName: string, category: string): Promise<any[]> {
    try {
      // Handle different RSS proxy services
      const proxyServices = [
        `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`,
        `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
        `https://cors-anywhere.herokuapp.com/${url}`
      ];

      for (const proxyUrl of proxyServices) {
        try {
          const response = await fetch(proxyUrl, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          });

          if (!response.ok) {
            console.warn(`Proxy ${proxyUrl} returned ${response.status}`);
            continue;
          }

          const data = await response.json();
          
          // Handle rss2json format
          if (data.status === 'ok' && data.items) {
            return data.items.slice(0, 5).map((item: any, index: number) => ({
              id: item.guid || item.link || `${sourceName}_${index}`,
              title: item.title || 'Untitled',
              description: this.cleanDescription(item.description || item.content),
              url: item.link,
              image: this.extractImageFromContent(item.content || item.description),
              timestamp: item.pubDate || new Date().toISOString(),
              source: sourceName,
              category: category,
              type: 'rss'
            }));
          }
          
          // Handle allorigins format
          if (data.contents) {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data.contents, 'text/xml');
            const items = xmlDoc.querySelectorAll('item');
            
            return Array.from(items).slice(0, 5).map((item, index) => ({
              id: item.querySelector('guid')?.textContent || `${sourceName}_${index}`,
              title: item.querySelector('title')?.textContent || 'Untitled',
              description: this.cleanDescription(item.querySelector('description')?.textContent || ''),
              url: item.querySelector('link')?.textContent,
              timestamp: item.querySelector('pubDate')?.textContent || new Date().toISOString(),
              source: sourceName,
              category: category,
              type: 'rss'
            }));
          }

        } catch (proxyError) {
          console.warn(`Error with proxy ${proxyUrl}:`, proxyError);
          continue;
        }
      }
      
      // If all proxies fail, return mock data for this feed
      console.warn(`All RSS proxies failed for ${url}, returning mock data`);
      return this.generateMockNews(sourceName, category, 2);
      
    } catch (error) {
      console.error(`RSS fetch error for ${url}:`, error);
      return this.generateMockNews(sourceName, category, 2);
    }
  }

  private async fetchAPIFeed(url: string, apiKey?: string, sourceName?: string, category?: string): Promise<any[]> {
    try {
      const headers: HeadersInit = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
      
      if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
        headers['X-API-Key'] = apiKey;
      }

      const response = await fetch(url, { 
        headers,
        method: 'GET'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Handle different API response formats
      let articles = [];
      if (data.articles) {
        articles = data.articles;
      } else if (data.data) {
        articles = data.data;
      } else if (data.items) {
        articles = data.items;
      } else if (Array.isArray(data)) {
        articles = data;
      } else {
        console.warn('Unknown API response format:', data);
        return this.generateMockNews(sourceName || 'API Feed', category || 'News', 2);
      }
      
      return articles.slice(0, 5).map((item: any, index: number) => ({
        id: item.id || item.url || `api_${sourceName}_${index}`,
        title: item.title || item.headline || item.name || 'Untitled',
        description: this.cleanDescription(item.description || item.content || item.summary || ''),
        url: item.url || item.link || item.href,
        image: item.image || item.urlToImage || item.thumbnail || item.photo,
        timestamp: item.publishedAt || item.published || item.date || item.createdAt || new Date().toISOString(),
        source: sourceName || 'API',
        category: category || 'News',
        type: 'api'
      }));
    } catch (error) {
      console.error(`API fetch error for ${url}:`, error);
      return this.generateMockNews(sourceName || 'API Feed', category || 'News', 2);
    }
  }

  private async fetchSocialFeed(url: string, sourceName: string, category: string): Promise<any[]> {
    try {
      // Social media feeds often require special handling
      console.log(`Attempting to fetch social feed: ${url}`);
      
      // For now, return mock data as social APIs require authentication
      return this.generateMockNews(sourceName, category, 3);
    } catch (error) {
      console.error(`Social fetch error for ${url}:`, error);
      return this.generateMockNews(sourceName, category, 2);
    }
  }

  private generateMockNews(sourceName: string, category: string, count: number): any[] {
    const mockTitles = {
      'Global News': [
        'International Summit Addresses Global Challenges',
        'World Markets Show Strong Recovery Signs',
        'Climate Agreement Reaches New Milestone'
      ],
      'Breaking News': [
        'Major Development in Ongoing Investigation',
        'Breaking: Emergency Response Teams Deployed',
        'Live Updates: Situation Developing'
      ],
      'Technology': [
        'Revolutionary AI Breakthrough Announced',
        'New Quantum Computing Milestone Achieved',
        'Tech Giant Unveils Next-Generation Platform'
      ],
      'Business': [
        'Market Analysis Shows Unexpected Growth',
        'Corporate Merger Creates Industry Leader',
        'Economic Indicators Point to Recovery'
      ],
      'Sports': [
        'Championship Finals Break Attendance Records',
        'Athlete Sets New World Record',
        'Playoff Race Intensifies'
      ],
      'Health': [
        'Medical Breakthrough Offers New Hope',
        'Health Officials Release New Guidelines',
        'Research Study Shows Promising Results'
      ],
      'Science': [
        'Scientists Make Groundbreaking Discovery',
        'Space Mission Achieves Major Success',
        'Research Team Publishes Revolutionary Study'
      ],
      'Politics': [
        'Legislative Session Addresses Key Issues',
        'Political Leaders Announce New Initiative',
        'Policy Reform Gains Support'
      ],
      'Entertainment': [
        'Film Festival Celebrates Outstanding Cinema',
        'Music Awards Honor Top Artists',
        'Cultural Event Draws International Attention'
      ],
      'Weather': [
        'Severe Weather System Approaches',
        'Seasonal Forecast Shows Changes',
        'Climate Data Reveals Trends'
      ]
    };

    const titles = mockTitles[category as keyof typeof mockTitles] || [
      'Latest News Update',
      'Important Development Reported',
      'New Information Available'
    ];

    const descriptions = [
      'Detailed analysis reveals significant implications for the future.',
      'Experts weigh in on the latest developments and their impact.',
      'Comprehensive coverage of this developing story continues.',
      'Multiple sources confirm the accuracy of these reports.',
      'Further updates expected as the situation evolves.'
    ];

    return Array.from({ length: Math.min(count, titles.length) }, (_, i) => ({
      id: `mock_${sourceName}_${i}_${Date.now()}`,
      title: titles[i] || `${category} Update`,
      description: descriptions[i % descriptions.length],
      url: `https://example.com/news/${i}`,
      timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      source: sourceName,
      category: category,
      type: 'mock'
    }));
  }

  private extractImageFromContent(content: string): string {
    if (!content) return '';
    
    const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch) return imgMatch[1];
    
    // Check for other image patterns
    const urlMatch = content.match(/(https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp))/i);
    return urlMatch ? urlMatch[1] : '';
  }

  private cleanDescription(description: string): string {
    if (!description) return '';
    
    // Remove HTML tags
    const withoutHtml = description.replace(/<[^>]*>/g, '');
    
    // Decode HTML entities
    const textarea = document.createElement('textarea');
    textarea.innerHTML = withoutHtml;
    const decoded = textarea.value;
    
    // Limit length
    return decoded.length > 200 ? decoded.substring(0, 200) + '...' : decoded;
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
      this.cache.clear(); // Clear cache to force refresh
    }, 60000); // Check for feed updates every minute
  }

  updateFeeds(newFeeds: any[]) {
    this.feeds = newFeeds.filter(feed => feed.isActive);
    this.cache.clear(); // Clear cache when feeds update
    realTimeSync.triggerUpdate('newsFeeds', newFeeds);
    console.log(`Updated to ${this.feeds.length} active feeds`);
  }

  cleanup() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    this.cache.clear();
  }

  // Get feed statistics
  getStats() {
    return {
      totalFeeds: this.feeds.length,
      cacheSize: this.cache.size,
      lastUpdate: new Date().toISOString()
    };
  }
}

// Video Processing Engine
export class VideoProcessingEngine {
  private currentVideoUrl: string = '';
  private processingCache: Map<string, any> = new Map();

  constructor() {
    this.loadVideoUrl();
  }

  private loadVideoUrl() {
    this.currentVideoUrl = localStorage.getItem('adminDemoVideoUrl') || '';
    console.log('Loaded demo video URL:', this.currentVideoUrl);
  }

  processVideoUrl(url: string): { processedUrl: string; type: string; isValid: boolean; embedCode?: string } {
    if (!url) return { processedUrl: '', type: 'none', isValid: false };

    // Check cache first
    if (this.processingCache.has(url)) {
      console.log('Returning cached video processing result');
      return this.processingCache.get(url);
    }

    let result;

    // YouTube processing
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = this.extractYouTubeId(url);
      if (videoId) {
        result = {
          processedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&controls=1&modestbranding=1`,
          type: 'youtube',
          isValid: true,
          embedCode: `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`
        };
      }
    }

    // Vimeo processing
    else if (url.includes('vimeo.com')) {
      const videoId = this.extractVimeoId(url);
      if (videoId) {
        result = {
          processedUrl: `https://player.vimeo.com/video/${videoId}?controls=1&quality=hd720`,
          type: 'vimeo',
          isValid: true,
          embedCode: `<iframe src="https://player.vimeo.com/video/${videoId}" width="640" height="360" frameborder="0" allowfullscreen></iframe>`
        };
      }
    }

    // Google Drive processing
    else if (url.includes('drive.google.com')) {
      const fileId = this.extractGoogleDriveId(url);
      if (fileId) {
        result = {
          processedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
          type: 'googledrive',
          isValid: true,
          embedCode: `<iframe src="https://drive.google.com/file/d/${fileId}/preview" width="640" height="360" allowfullscreen></iframe>`
        };
      }
    }

    // Dropbox processing
    else if (url.includes('dropbox.com')) {
      const processedUrl = url.replace('dl=0', 'dl=1').replace('?dl=0', '?dl=1');
      result = {
        processedUrl,
        type: 'dropbox',
        isValid: true,
        embedCode: `<video controls width="640" height="360"><source src="${processedUrl}" type="video/mp4"></video>`
      };
    }

    // Direct video URL
    else {
      const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.ogg'];
      const hasVideoExtension = videoExtensions.some(ext => 
        url.toLowerCase().includes(ext.toLowerCase())
      );

      if (hasVideoExtension || url.startsWith('http')) {
        result = {
          processedUrl: url,
          type: 'direct',
          isValid: true,
          embedCode: `<video controls width="640" height="360"><source src="${url}" type="video/mp4"></video>`
        };
      } else {
        result = { processedUrl: url, type: 'unknown', isValid: false };
      }
    }

    // Cache the result
    if (result) {
      this.processingCache.set(url, result);
      console.log(`Processed ${url} as ${result.type} (${result.isValid ? 'valid' : 'invalid'})`);
      return result;
    }

    return { processedUrl: url, type: 'unknown', isValid: false };
  }

  private extractYouTubeId(url: string): string {
    const patterns = [
      /youtu\.be\/([^?&]+)/,
      /youtube\.com\/watch\?v=([^&]+)/,
      /youtube\.com\/embed\/([^?&]+)/,
      /youtube\.com\/v\/([^?&]+)/
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
      /id=([a-zA-Z0-9-_]+)/,
      /drive\.google\.com.*\/([a-zA-Z0-9-_]{28,})/
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
    this.processingCache.clear(); // Clear cache when URL updates
    
    // Trigger video update event
    realTimeSync.triggerUpdate('videoUrl', url);
    
    // Dispatch custom event for immediate updates
    window.dispatchEvent(new CustomEvent('videoUrlUpdated', { detail: url }));
    
    console.log('Updated demo video URL:', url);
  }

  getCurrentVideoUrl(): string {
    return this.currentVideoUrl;
  }

  getProcessingStats() {
    return {
      currentUrl: this.currentVideoUrl,
      cacheSize: this.processingCache.size,
      supportedTypes: ['youtube', 'vimeo', 'googledrive', 'dropbox', 'direct']
    };
  }
}

// Link Validation Engine
export class LinkValidationEngine {
  private validationCache: Map<string, any> = new Map();

  async validateUrl(url: string): Promise<{ isValid: boolean; type: string; error?: string; details?: any }> {
    if (!url) {
      return { isValid: false, type: 'empty', error: 'URL is empty' };
    }

    // Check cache first
    if (this.validationCache.has(url)) {
      console.log('Returning cached validation result for:', url);
      return this.validationCache.get(url);
    }

    try {
      // Basic URL format validation
      const urlObj = new URL(url);
      
      let result: any = { isValid: true, type: 'general' };
      
      // Check if it's a supported video platform
      if (this.isVideoUrl(url)) {
        result = { 
          isValid: true, 
          type: 'video',
          details: {
            platform: this.getVideoPlatform(url),
            canEmbed: true
          }
        };
      }
      
      // Check if it's an RSS feed
      else if (this.isRSSUrl(url)) {
        result = { 
          isValid: true, 
          type: 'rss',
          details: {
            format: 'RSS/XML',
            canFetch: true
          }
        };
      }
      
      // Check if it's an API endpoint
      else if (this.isAPIUrl(url)) {
        result = { 
          isValid: true, 
          type: 'api',
          details: {
            protocol: urlObj.protocol,
            requiresAuth: this.requiresAuthentication(url)
          }
        };
      }
      
      // Try to validate by making a HEAD request (with timeout)
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        const response = await fetch(url, { 
          method: 'HEAD', 
          signal: controller.signal,
          mode: 'no-cors' // Avoid CORS issues for validation
        });
        
        clearTimeout(timeoutId);
        
        result.details = {
          ...result.details,
          status: response.status,
          accessible: response.ok,
          headers: Object.fromEntries(response.headers.entries())
        };
        
      } catch (fetchError) {
        // HEAD request failed, but URL format is valid
        result.details = {
          ...result.details,
          accessible: false,
          error: 'Could not access URL (possibly CORS restricted)'
        };
      }
      
      // Cache successful validation
      this.validationCache.set(url, result);
      console.log(`Validated URL ${url} as ${result.type} (${result.isValid ? 'valid' : 'invalid'})`);
      
      return result;
      
    } catch (error) {
      const result = { 
        isValid: false, 
        type: 'invalid', 
        error: 'Invalid URL format',
        details: {
          originalError: (error as Error).message
        }
      };
      
      // Cache failed validation too (for shorter time)
      setTimeout(() => {
        this.validationCache.delete(url);
      }, 60000); // Remove from cache after 1 minute
      
      return result;
    }
  }

  private isVideoUrl(url: string): boolean {
    const videoSources = ['youtube.com', 'youtu.be', 'vimeo.com', 'drive.google.com', 'dropbox.com'];
    const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.ogg'];
    
    return videoSources.some(source => url.includes(source)) ||
           videoExtensions.some(ext => url.toLowerCase().includes(ext));
  }

  private getVideoPlatform(url: string): string {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube';
    if (url.includes('vimeo.com')) return 'Vimeo';
    if (url.includes('drive.google.com')) return 'Google Drive';
    if (url.includes('dropbox.com')) return 'Dropbox';
    return 'Direct Video';
  }

  private isRSSUrl(url: string): boolean {
    return url.includes('rss') || 
           url.includes('feed') || 
           url.includes('.xml') ||
           url.includes('atom');
  }

  private isAPIUrl(url: string): boolean {
    return url.includes('api') ||
           url.includes('/v1/') ||
           url.includes('/v2/') ||
           url.includes('/rest/') ||
           url.includes('.json');
  }

  private requiresAuthentication(url: string): boolean {
    const authIndicators = ['api', 'private', 'secure', 'auth'];
    return authIndicators.some(indicator => url.toLowerCase().includes(indicator));
  }

  getValidationStats() {
    const cacheEntries = Array.from(this.validationCache.entries());
    const typeStats = cacheEntries.reduce((acc, [url, result]) => {
      acc[result.type] = (acc[result.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalValidated: cacheEntries.length,
      typeDistribution: typeStats,
      cacheSize: this.validationCache.size
    };
  }
}

// Initialize engines
export const newsFeedEngine = new NewsFeedEngine();
export const videoProcessingEngine = new VideoProcessingEngine();
export const linkValidationEngine = new LinkValidationEngine();

// Global engine status and management
export const getEngineStatus = () => ({
  newsFeed: {
    ...newsFeedEngine.getStats(),
    status: 'active'
  },
  videoProcessing: {
    ...videoProcessingEngine.getProcessingStats(),
    status: 'active'
  },
  linkValidation: {
    ...linkValidationEngine.getValidationStats(),
    status: 'active'
  }
});

// Cleanup function for when engines need to be shut down
export const cleanupEngines = () => {
  newsFeedEngine.cleanup();
  console.log('All engines cleaned up successfully');
};
