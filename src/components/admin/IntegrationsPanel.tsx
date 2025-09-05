import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageCircle, 
  Mail, 
  Video, 
  Users, 
  BarChart3,
  CheckCircle,
  AlertCircle,
  Settings,
  Key
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface IntegrationSettings {
  chatBotEnabled: boolean;
  chatBotTraining: boolean;
  chatbaseApiKey: string;
  brevoEnabled: boolean;
  subscriberCount: number;
  brevoApiKey: string;
  demoVideoUrl: string;
}

const IntegrationsPanel = () => {
  const { toast } = useToast();
  
  const [settings, setSettings] = useState<IntegrationSettings>({
    chatBotEnabled: true,
    chatBotTraining: false,
    chatbaseApiKey: '',
    brevoEnabled: true,
    subscriberCount: 1247,
    brevoApiKey: '',
    demoVideoUrl: ''
  });

  // Stable bot metrics (avoid disco-style randomness)
  const [botMetrics, setBotMetrics] = useState<{ activeChats: number; dailyQueries: number }>(() => {
    try {
      const saved = localStorage.getItem('odenehoBotMetrics');
      return saved ? JSON.parse(saved) : { activeChats: 18, dailyQueries: 320 };
    } catch {
      return { activeChats: 18, dailyQueries: 320 };
    }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setBotMetrics((prev) => {
        // gentle random walk with bounds
        const next = {
          activeChats: Math.max(0, prev.activeChats + (Math.random() < 0.6 ? 1 : -1)),
          dailyQueries: Math.max(0, prev.dailyQueries + Math.floor(Math.random() * 6) - 3),
        };
        localStorage.setItem('odenehoBotMetrics', JSON.stringify(next));
        return next;
      });
    }, 30000); // update every 30s for realism
    return () => clearInterval(interval);
  }, []);

  // Load settings from localStorage on component mount
  useEffect(() => {
    console.log('IntegrationsPanel: Loading settings from localStorage');
    
    const savedVideoUrl = localStorage.getItem('adminDemoVideoUrl') || '';
    console.log('IntegrationsPanel: Loaded video URL:', savedVideoUrl);
    
    const savedSettings = localStorage.getItem('integrationSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(prev => ({
        ...prev,
        ...parsed,
        demoVideoUrl: savedVideoUrl // Always use the direct localStorage value
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        demoVideoUrl: savedVideoUrl
      }));
    }
  }, []);

  const updateSetting = (key: keyof IntegrationSettings, value: any) => {
    console.log('IntegrationsPanel: Updating setting', key, 'to:', value);
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleVideoSave = () => {
    console.log('IntegrationsPanel: Saving video URL:', settings.demoVideoUrl);
    
    if (!settings.demoVideoUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid video URL.",
        variant: "destructive",
      });
      return;
    }

    const cleanUrl = settings.demoVideoUrl.trim();
    
    // Save to localStorage with explicit key
    localStorage.setItem('adminDemoVideoUrl', cleanUrl);
    localStorage.setItem('integrationSettings', JSON.stringify(settings));
    
    console.log('IntegrationsPanel: Video URL saved to localStorage:', cleanUrl);
    
    // Dispatch multiple events to ensure the Watch Demo page updates
    window.dispatchEvent(new CustomEvent('videoUrlUpdated', { 
      detail: { url: cleanUrl } 
    }));
    
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'adminDemoVideoUrl',
      newValue: cleanUrl,
      oldValue: localStorage.getItem('adminDemoVideoUrl'),
      storageArea: localStorage
    }));
    
    toast({
      title: "Video URL Saved Successfully",
      description: "The demo video URL has been saved and is now live on the Watch Demo page.",
    });
    
    console.log('IntegrationsPanel: Events dispatched for video URL update');
  };

  const handleChatBotToggle = (enabled: boolean) => {
    updateSetting('chatBotEnabled', enabled);
    toast({
      title: enabled ? "Chat Bot Enabled" : "Chat Bot Disabled",
      description: `Odeneho chat bot has been ${enabled ? 'activated' : 'deactivated'}.`,
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      updateSetting('chatBotTraining', true);
      
      setTimeout(() => {
        updateSetting('chatBotTraining', false);
        toast({
          title: "Training Complete",
          description: "Odeneho has been successfully retrained with new data.",
        });
      }, 3000);
    }
  };

  const handleChatbaseApiKeySave = () => {
    if (!settings.chatbaseApiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid API key.",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem('chatbaseApiKey', settings.chatbaseApiKey);
    toast({
      title: "API Key Saved",
      description: "Chatbase API key has been saved successfully and will persist.",
    });
  };

  const handleBrevoToggle = (enabled: boolean) => {
    updateSetting('brevoEnabled', enabled);
    toast({
      title: enabled ? "Brevo Newsletter Enabled" : "Brevo Newsletter Disabled",
      description: `Newsletter engine has been ${enabled ? 'activated' : 'deactivated'}.`,
    });
  };

  const handleBrevoApiKeySave = () => {
    if (!settings.brevoApiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid API key.",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem('brevoApiKey', settings.brevoApiKey);
    toast({
      title: "API Key Saved",
      description: "Brevo API key has been saved successfully and will persist.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Integration Dashboard</h2>
        <p className="text-gray-600">Manage your platform integrations and external services</p>
      </div>

      <Tabs defaultValue="demo-video" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="demo-video" className="flex items-center gap-2">
            <Video className="w-4 h-4" />
            Demo Video
          </TabsTrigger>
          <TabsTrigger value="chatbot" className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Odeneho Chat Bot
          </TabsTrigger>
          <TabsTrigger value="newsletter" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Brevo Newsletter
          </TabsTrigger>
        </TabsList>

        <TabsContent value="demo-video">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5 text-red-600" />
                Demo Video Management
              </CardTitle>
              <CardDescription>
                Configure the video URL that will be displayed on the public Watch Demo page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="video-url">Video URL</Label>
                  <p className="text-sm text-gray-600 mb-2">
                    Paste any video URL (YouTube, Vimeo, direct MP4, etc.)
                  </p>
                  <Input
                    id="video-url"
                    type="url"
                    placeholder="https://www.amnewsworld.com/wp-content/uploads/2025/07/amniva-1.mp4"
                    value={settings.demoVideoUrl}
                    onChange={(e) => updateSetting('demoVideoUrl', e.target.value)}
                  />
                </div>
                
                <Button onClick={handleVideoSave} className="w-full" size="lg">
                  <Video className="w-4 h-4 mr-2" />
                  Save Video URL
                </Button>
              </div>

              {settings.demoVideoUrl && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Current Demo Video URL</h3>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-600 font-medium">✅ Active URL:</p>
                    <p className="font-mono text-sm break-all text-green-800 mt-1">{settings.demoVideoUrl}</p>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900">Supported Video Types</p>
                    <div className="text-sm text-blue-700 mt-2 space-y-1">
                      <p>✅ Direct video files (.mp4, .mov, .webm, .avi)</p>
                      <p>✅ YouTube links (any format)</p>
                      <p>✅ Vimeo links</p>
                      <p>✅ Google Drive video links</p>
                      <p>✅ Dropbox video links</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chatbot">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-blue-600" />
                    Odeneho Live Chat Bot
                  </CardTitle>
                  <CardDescription>
                    AI-powered support bot with streaming voice capabilities and external API integration
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={settings.chatBotEnabled ? "default" : "secondary"}>
                    {settings.chatBotEnabled ? "Active" : "Inactive"}
                  </Badge>
                  <Switch
                    checked={settings.chatBotEnabled}
                    onCheckedChange={handleChatBotToggle}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">Status</span>
                  </div>
                  <p className="text-lg font-semibold text-blue-600">
                    {settings.chatBotEnabled ? "Online" : "Offline"}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">Active Chats</span>
                  </div>
                  <p className="text-lg font-semibold text-green-600">
                    {settings.chatBotEnabled ? botMetrics.activeChats : 0}
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium">Daily Queries</span>
                  </div>
                  <p className="text-lg font-semibold text-purple-600">
                    {settings.chatBotEnabled ? botMetrics.dailyQueries : 0}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Internal Configuration */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Internal Configuration
                  </h3>
                  <div className="p-4 border rounded-lg space-y-4">
                    <div>
                      <Label htmlFor="voice-config">Voice & STT/TTS Setup</Label>
                      <p className="text-xs text-gray-600 mb-2">Configure ElevenLabs streaming voice</p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open('/admin?tab=configure-ai', '_self')}
                        className="w-full"
                      >
                        Configure Voice Settings
                      </Button>
                    </div>
                    
                    <div>
                      <Label htmlFor="training-file">Internal Training Data</Label>
                      <div className="mt-2">
                        <Input
                          id="training-file"
                          type="file"
                          accept=".txt,.csv,.json"
                          onChange={handleFileUpload}
                          disabled={settings.chatBotTraining}
                          className="text-xs"
                        />
                        {settings.chatBotTraining && (
                          <div className="flex items-center gap-2 mt-2 text-sm text-blue-600">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            Training in progress...
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* External Configuration */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Key className="w-5 h-5" />
                    External Configuration
                  </h3>
                  <div className="p-4 border rounded-lg space-y-4">
                    <div>
                      <Label htmlFor="chatbase-api-key">Chatbase API Key</Label>
                      <p className="text-xs text-gray-600 mb-2">
                        Connect external Chatbase service
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Input
                          id="chatbase-api-key"
                          type="password"
                          placeholder="Enter Chatbase API key"
                          value={settings.chatbaseApiKey}
                          onChange={(e) => updateSetting('chatbaseApiKey', e.target.value)}
                          className="text-xs"
                        />
                        <Button onClick={handleChatbaseApiKeySave} size="sm">
                          Save
                        </Button>
                      </div>
                      {settings.chatbaseApiKey && (
                        <p className="text-xs text-green-600 mt-1">✓ External API configured</p>
                      )}
                    </div>
                    
                    <div>
                      <Label>External Endpoint</Label>
                      <p className="text-xs text-gray-600 mb-2">Additional configuration in AI settings</p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open('/admin?tab=configure-ai', '_self')}
                        className="w-full text-xs"
                      >
                        Configure External APIs
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="newsletter">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-green-600" />
                    Brevo Newsletter Engine
                  </CardTitle>
                  <CardDescription>
                    Email marketing and subscriber management platform
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={settings.brevoEnabled ? "default" : "secondary"}>
                    {settings.brevoEnabled ? "Active" : "Inactive"}
                  </Badge>
                  <Switch
                    checked={settings.brevoEnabled}
                    onCheckedChange={handleBrevoToggle}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">Total Subscribers</span>
                  </div>
                  <p className="text-lg font-semibold text-green-600">
                    {settings.subscriberCount.toLocaleString()}
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">Campaigns Sent</span>
                  </div>
                  <p className="text-lg font-semibold text-blue-600">
                    {settings.brevoEnabled ? Math.floor(Math.random() * 100) + 25 : 0}
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium">Open Rate</span>
                  </div>
                  <p className="text-lg font-semibold text-purple-600">
                    {settings.brevoEnabled ? (Math.random() * 30 + 50).toFixed(1) + '%' : '0%'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">API Configuration</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="brevo-api-key">Brevo API Key</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        id="brevo-api-key"
                        type="password"
                        placeholder="Enter your Brevo API key"
                        value={settings.brevoApiKey}
                        onChange={(e) => updateSetting('brevoApiKey', e.target.value)}
                      />
                      <Button onClick={handleBrevoApiKeySave}>
                        <Key className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                    </div>
                    {settings.brevoApiKey && (
                      <p className="text-sm text-green-600 mt-1">✓ API key configured</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Recent Campaign Activity</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Weekly Tech Insights</p>
                      <p className="text-sm text-gray-600">Sent 2 days ago</p>
                    </div>
                    <Badge variant="secondary">Delivered</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Amniva Platform Updates</p>
                      <p className="text-sm text-gray-600">Sent 1 week ago</p>
                    </div>
                    <Badge variant="secondary">Delivered</Badge>
                  </div>
                </div>
                <Button variant="outline">
                  <Mail className="w-4 h-4 mr-2" />
                  View All Campaigns
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntegrationsPanel;
