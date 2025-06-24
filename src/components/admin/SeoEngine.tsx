
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Search, 
  Globe, 
  FileText, 
  Settings, 
  CheckCircle, 
  AlertTriangle,
  ExternalLink,
  Zap,
  BarChart3,
  Edit,
  Save,
  RefreshCw
} from 'lucide-react';

const SeoEngine = () => {
  const [activeTab, setActiveTab] = useState('metadata');
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date().toISOString());

  // Mock SEO data - in production, this would come from your backend
  const [seoData, setSeoData] = useState({
    metadata: {
      homeTitle: 'Amniva™ - Know Better. Act Smarter | AI-Powered Media Intelligence Platform',
      homeDescription: 'Amniva helps track real-time verified trends, flag misinformation, predict economic and environmental developments, and provide smart action suggestions.',
      canonicalUrl: 'https://www.amniva.io',
      ogImage: '/lovable-uploads/ea0bb535-fc7d-44f0-80e1-abd03b1a3317.png',
      twitterHandle: '@amniva'
    },
    structuredData: {
      organization: true,
      newsArticle: true,
      breadcrumbs: true
    },
    sitemap: {
      autoGenerate: true,
      lastGenerated: '2025-01-15T10:30:00Z',
      totalUrls: 47
    },
    robots: {
      content: `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /dashboard/
Disallow: /login/
Disallow: /register/

Sitemap: https://www.amniva.io/sitemap.xml`
    },
    indexing: {
      googleLastPing: '2025-01-15T09:15:00Z',
      bingLastPing: '2025-01-15T09:15:00Z',
      indexNowEnabled: true,
      indexNowKey: 'amniva-key-12345'
    },
    stats: {
      indexedUrls: 42,
      avgPosition: 8.3,
      totalClicks: 1547,
      totalImpressions: 15420,
      missingMetaTags: 3
    }
  });

  const handleGenerateMetadata = async () => {
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
      setLastUpdated(new Date().toISOString());
    }, 2000);
  };

  const handleSave = () => {
    console.log('Saving SEO settings:', seoData);
    // In production, save to backend
  };

  const handlePingSearchEngines = async () => {
    setIsGenerating(true);
    // Simulate pinging search engines
    setTimeout(() => {
      setSeoData(prev => ({
        ...prev,
        indexing: {
          ...prev.indexing,
          googleLastPing: new Date().toISOString(),
          bingLastPing: new Date().toISOString()
        }
      }));
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* SEO Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Search size={16} />
              Indexed URLs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{seoData.stats.indexedUrls}</div>
            <div className="text-sm text-gray-500">of {seoData.sitemap.totalUrls} total</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <BarChart3 size={16} />
              Avg Position
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{seoData.stats.avgPosition}</div>
            <div className="text-sm text-gray-500">Google Search</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Globe size={16} />
              Total Clicks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{seoData.stats.totalClicks.toLocaleString()}</div>
            <div className="text-sm text-gray-500">Last 30 days</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <AlertTriangle size={16} />
              Issues Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{seoData.stats.missingMetaTags}</div>
            <div className="text-sm text-gray-500">Missing meta tags</div>
          </CardContent>
        </Card>
      </div>

      {/* Main SEO Management Interface */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">SEO Engine Control Panel</CardTitle>
              <CardDescription>Manage all SEO aspects of the Amniva platform</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={handlePingSearchEngines} disabled={isGenerating}>
                <Zap size={16} className="mr-2" />
                {isGenerating ? 'Pinging...' : 'Ping Search Engines'}
              </Button>
              <Button onClick={handleSave}>
                <Save size={16} className="mr-2" />
                Save All Changes
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="metadata">Meta Data</TabsTrigger>
              <TabsTrigger value="structured">Structured Data</TabsTrigger>
              <TabsTrigger value="sitemap">Sitemap</TabsTrigger>
              <TabsTrigger value="robots">Robots.txt</TabsTrigger>
              <TabsTrigger value="indexing">Indexing</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Meta Data Manager */}
            <TabsContent value="metadata" className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Page Meta Data</h3>
                  <Button onClick={handleGenerateMetadata} disabled={isGenerating}>
                    <RefreshCw size={16} className="mr-2" />
                    {isGenerating ? 'Generating...' : 'Auto Generate'}
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="homeTitle">Home Page Title</Label>
                      <Input
                        id="homeTitle"
                        value={seoData.metadata.homeTitle}
                        onChange={(e) => setSeoData(prev => ({
                          ...prev,
                          metadata: { ...prev.metadata, homeTitle: e.target.value }
                        }))}
                        className="mt-1"
                      />
                      <p className="text-xs text-gray-500 mt-1">Recommended: 50-60 characters</p>
                    </div>

                    <div>
                      <Label htmlFor="homeDescription">Home Page Description</Label>
                      <Textarea
                        id="homeDescription"
                        value={seoData.metadata.homeDescription}
                        onChange={(e) => setSeoData(prev => ({
                          ...prev,
                          metadata: { ...prev.metadata, homeDescription: e.target.value }
                        }))}
                        className="mt-1"
                        rows={3}
                      />
                      <p className="text-xs text-gray-500 mt-1">Recommended: 150-160 characters</p>
                    </div>

                    <div>
                      <Label htmlFor="canonicalUrl">Canonical URL</Label>
                      <Input
                        id="canonicalUrl"
                        value={seoData.metadata.canonicalUrl}
                        onChange={(e) => setSeoData(prev => ({
                          ...prev,
                          metadata: { ...prev.metadata, canonicalUrl: e.target.value }
                        }))}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="ogImage">OpenGraph Image URL</Label>
                      <Input
                        id="ogImage"
                        value={seoData.metadata.ogImage}
                        onChange={(e) => setSeoData(prev => ({
                          ...prev,
                          metadata: { ...prev.metadata, ogImage: e.target.value }
                        }))}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="twitterHandle">Twitter Handle</Label>
                      <Input
                        id="twitterHandle"
                        value={seoData.metadata.twitterHandle}
                        onChange={(e) => setSeoData(prev => ({
                          ...prev,
                          metadata: { ...prev.metadata, twitterHandle: e.target.value }
                        }))}
                        className="mt-1"
                      />
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Preview</h4>
                      <div className="space-y-2 text-sm">
                        <div className="text-blue-600 font-medium truncate">{seoData.metadata.homeTitle}</div>
                        <div className="text-green-600 text-xs">{seoData.metadata.canonicalUrl}</div>
                        <div className="text-gray-600 text-xs line-clamp-2">{seoData.metadata.homeDescription}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Structured Data Generator */}
            <TabsContent value="structured" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Schema.org Structured Data</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Organization Schema</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="orgSchema">Enable Organization Schema</Label>
                        <Switch
                          id="orgSchema"
                          checked={seoData.structuredData.organization}
                          onCheckedChange={(checked) => setSeoData(prev => ({
                            ...prev,
                            structuredData: { ...prev.structuredData, organization: checked }
                          }))}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Adds Amniva organization details</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">News Article Schema</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="newsSchema">Enable News Article Schema</Label>
                        <Switch
                          id="newsSchema"
                          checked={seoData.structuredData.newsArticle}
                          onCheckedChange={(checked) => setSeoData(prev => ({
                            ...prev,
                            structuredData: { ...prev.structuredData, newsArticle: checked }
                          }))}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">For news and article pages</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Breadcrumb Schema</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="breadcrumbSchema">Enable Breadcrumb Schema</Label>
                        <Switch
                          id="breadcrumbSchema"
                          checked={seoData.structuredData.breadcrumbs}
                          onCheckedChange={(checked) => setSeoData(prev => ({
                            ...prev,
                            structuredData: { ...prev.structuredData, breadcrumbs: checked }
                          }))}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Navigation breadcrumbs</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Sitemap Generator */}
            <TabsContent value="sitemap" className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Dynamic Sitemap Management</h3>
                  <Button variant="outline">
                    <ExternalLink size={16} className="mr-2" />
                    View Sitemap
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Sitemap Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="autoSitemap">Auto-generate Sitemap</Label>
                        <Switch
                          id="autoSitemap"
                          checked={seoData.sitemap.autoGenerate}
                          onCheckedChange={(checked) => setSeoData(prev => ({
                            ...prev,
                            sitemap: { ...prev.sitemap, autoGenerate: checked }
                          }))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Total URLs:</span>
                          <Badge variant="secondary">{seoData.sitemap.totalUrls}</Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Last Generated:</span>
                          <span className="text-gray-500">
                            {new Date(seoData.sitemap.lastGenerated).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Included Pages</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle size={14} className="text-green-500" />
                          <span>Homepage (/)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle size={14} className="text-green-500" />
                          <span>Verify Info (/verify)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle size={14} className="text-green-500" />
                          <span>Trending (/trending)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle size={14} className="text-green-500" />
                          <span>Predictions (/predictions)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle size={14} className="text-green-500" />
                          <span>API Documentation (/api-organizations)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle size={14} className="text-green-500" />
                          <span>Pricing (/pricing)</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Robots.txt Editor */}
            <TabsContent value="robots" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Robots.txt Configuration</h3>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Current Robots.txt</CardTitle>
                    <CardDescription>Configure search engine crawling rules</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={seoData.robots.content}
                      onChange={(e) => setSeoData(prev => ({
                        ...prev,
                        robots: { ...prev.robots, content: e.target.value }
                      }))}
                      rows={10}
                      className="font-mono text-sm"
                    />
                    <div className="mt-4 flex justify-between items-center">
                      <p className="text-xs text-gray-500">
                        Accessible at: https://www.amniva.io/robots.txt
                      </p>
                      <Button variant="outline" size="sm">
                        <ExternalLink size={14} className="mr-2" />
                        Preview
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Indexing & Pinging */}
            <TabsContent value="indexing" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Search Engine Indexing</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Search Engine Pinging</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Google Last Ping:</span>
                          <span className="text-xs text-gray-500">
                            {new Date(seoData.indexing.googleLastPing).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Bing Last Ping:</span>
                          <span className="text-xs text-gray-500">
                            {new Date(seoData.indexing.bingLastPing).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <Separator />
                      <Button onClick={handlePingSearchEngines} disabled={isGenerating} className="w-full">
                        <Zap size={16} className="mr-2" />
                        {isGenerating ? 'Pinging...' : 'Ping Now'}
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">IndexNow Integration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="indexNow">Enable IndexNow</Label>
                        <Switch
                          id="indexNow"
                          checked={seoData.indexing.indexNowEnabled}
                          onCheckedChange={(checked) => setSeoData(prev => ({
                            ...prev,
                            indexing: { ...prev.indexing, indexNowEnabled: checked }
                          }))}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="indexNowKey">IndexNow API Key</Label>
                        <Input
                          id="indexNowKey"
                          value={seoData.indexing.indexNowKey}
                          onChange={(e) => setSeoData(prev => ({
                            ...prev,
                            indexing: { ...prev.indexing, indexNowKey: e.target.value }
                          }))}
                          className="mt-1"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* SEO Analytics */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">SEO Performance Analytics</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Search Performance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Total Impressions:</span>
                        <Badge variant="secondary">{seoData.stats.totalImpressions.toLocaleString()}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Total Clicks:</span>
                        <Badge variant="secondary">{seoData.stats.totalClicks.toLocaleString()}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Average CTR:</span>
                        <Badge variant="secondary">
                          {((seoData.stats.totalClicks / seoData.stats.totalImpressions) * 100).toFixed(1)}%
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Content Issues</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle size={14} className="text-amber-500" />
                        <span className="text-sm">{seoData.stats.missingMetaTags} Missing Meta Tags</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle size={14} className="text-green-500" />
                        <span className="text-sm">All Images Have Alt Text</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle size={14} className="text-green-500" />
                        <span className="text-sm">SSL Certificate Valid</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Top Performing Content</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="text-xs space-y-1">
                        <div className="flex justify-between">
                          <span>Homepage</span>
                          <span className="text-blue-600">847 clicks</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Verify Info</span>
                          <span className="text-blue-600">312 clicks</span>
                        </div>
                        <div className="flex justify-between">
                          <span>API Docs</span>
                          <span className="text-blue-600">256 clicks</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SeoEngine;
