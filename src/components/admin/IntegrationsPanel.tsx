import React, { useState } from 'react';
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
  Upload, 
  Users, 
  BarChart3,
  CheckCircle,
  AlertCircle,
  Settings,
  Key,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const IntegrationsPanel = () => {
  const { toast } = useToast();
  
  // Odeneho Chat Bot State
  const [chatBotEnabled, setChatBotEnabled] = useState(true);
  const [chatBotTraining, setChatBotTraining] = useState(false);
  const [chatbaseApiKey, setChatbaseApiKey] = useState('');
  const [savedChatbaseApiKey, setSavedChatbaseApiKey] = useState('');
  
  // Brevo Newsletter State
  const [brevoEnabled, setBrevoEnabled] = useState(true);
  const [subscriberCount, setSubscriberCount] = useState(1247);
  const [brevoApiKey, setBrevoApiKey] = useState('');
  const [savedBrevoApiKey, setSavedBrevoApiKey] = useState('');
  
  // Demo Video State
  const [demoVideoUrl, setDemoVideoUrl] = useState('');
  const [savedVideoUrl, setSavedVideoUrl] = useState('');

  // Load saved video URL from localStorage on component mount
  React.useEffect(() => {
    const savedUrl = localStorage.getItem('adminDemoVideoUrl') || '';
    setSavedVideoUrl(savedUrl);
    const savedChatbaseKey = localStorage.getItem('chatbaseApiKey') || '';
    setSavedChatbaseApiKey(savedChatbaseKey);
    const savedBrevoKey = localStorage.getItem('brevoApiKey') || '';
    setSavedBrevoApiKey(savedBrevoKey);
  }, []);

  const handleChatBotToggle = (enabled: boolean) => {
    setChatBotEnabled(enabled);
    toast({
      title: enabled ? "Chat Bot Enabled" : "Chat Bot Disabled",
      description: `Odeneho chat bot has been ${enabled ? 'activated' : 'deactivated'}.`,
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setChatBotTraining(true);
      // Simulate training process
      setTimeout(() => {
        setChatBotTraining(false);
        toast({
          title: "Training Complete",
          description: "Odeneho has been successfully retrained with new data.",
        });
      }, 3000);
    }
  };

  const handleChatbaseApiKeySave = () => {
    if (!chatbaseApiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid API key.",
        variant: "destructive",
      });
      return;
    }

    setSavedChatbaseApiKey(chatbaseApiKey);
    localStorage.setItem('chatbaseApiKey', chatbaseApiKey);
    toast({
      title: "API Key Saved",
      description: "Chatbase API key has been saved successfully.",
    });
  };

  const handleBrevoToggle = (enabled: boolean) => {
    setBrevoEnabled(enabled);
    toast({
      title: enabled ? "Brevo Newsletter Enabled" : "Brevo Newsletter Disabled",
      description: `Newsletter engine has been ${enabled ? 'activated' : 'deactivated'}.`,
    });
  };

  const handleBrevoApiKeySave = () => {
    if (!brevoApiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid API key.",
        variant: "destructive",
      });
      return;
    }

    setSavedBrevoApiKey(brevoApiKey);
    localStorage.setItem('brevoApiKey', brevoApiKey);
    toast({
      title: "API Key Saved",
      description: "Brevo API key has been saved successfully.",
    });
  };

  const handleVideoSave = () => {
    if (!demoVideoUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid video URL.",
        variant: "destructive",
      });
      return;
    }

    // Only warn about clearly unsupported formats
    if (demoVideoUrl.includes('youtu.be') || demoVideoUrl.includes('youtube.com/watch') || demoVideoUrl.includes('vimeo.com/')) {
      toast({
        title: "Unsupported Video Format",
        description: "YouTube and Vimeo links are not supported. Please use direct video file URLs or Google Drive/Dropbox links.",
        variant: "destructive",
      });
      return;
    }

    setSavedVideoUrl(demoVideoUrl);
    localStorage.setItem('adminDemoVideoUrl', demoVideoUrl);
    toast({
      title: "Video Link Updated Successfully",
      description: "The demo video has been updated and will be displayed on the public page.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Integration Dashboard</h2>
        <p className="text-gray-600">Manage your platform integrations and external services</p>
      </div>

      <Tabs defaultValue="chatbot" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chatbot" className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Odeneho Chat Bot
          </TabsTrigger>
          <TabsTrigger value="newsletter" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Brevo Newsletter
          </TabsTrigger>
          <TabsTrigger value="demo-video" className="flex items-center gap-2">
            <Video className="w-4 h-4" />
            Demo Video
          </TabsTrigger>
        </TabsList>

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
                    AI-powered support bot for 24/7 customer assistance
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={chatBotEnabled ? "default" : "secondary"}>
                    {chatBotEnabled ? "Active" : "Inactive"}
                  </Badge>
                  <Switch
                    checked={chatBotEnabled}
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
                    {chatBotEnabled ? "Online" : "Offline"}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">Active Chats</span>
                  </div>
                  <p className="text-lg font-semibold text-green-600">23</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium">Daily Queries</span>
                  </div>
                  <p className="text-lg font-semibold text-purple-600">156</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">API Configuration</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="chatbase-api-key">Chatbase API Key</Label>
                    <p className="text-sm text-gray-600 mb-2">
                      Enter your Chatbase API key to power the Odeneho chat bot
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Input
                        id="chatbase-api-key"
                        type="password"
                        placeholder="Enter your Chatbase API key"
                        value={chatbaseApiKey}
                        onChange={(e) => setChatbaseApiKey(e.target.value)}
                      />
                      <Button onClick={handleChatbaseApiKeySave}>
                        <Key className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                    </div>
                    {savedChatbaseApiKey && (
                      <p className="text-sm text-green-600 mt-1">✓ Chatbase API key configured</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Training & Configuration</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="training-file">Upload Training Data</Label>
                    <div className="mt-2">
                      <Input
                        id="training-file"
                        type="file"
                        accept=".txt,.csv,.json"
                        onChange={handleFileUpload}
                        disabled={chatBotTraining}
                      />
                      {chatBotTraining && (
                        <div className="flex items-center gap-2 mt-2 text-sm text-blue-600">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                          Training in progress...
                        </div>
                      )}
                    </div>
                  </div>
                  <Button variant="outline" disabled={chatBotTraining}>
                    <Settings className="w-4 h-4 mr-2" />
                    Configure Bot Settings
                  </Button>
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
                  <Badge variant={brevoEnabled ? "default" : "secondary"}>
                    {brevoEnabled ? "Active" : "Inactive"}
                  </Badge>
                  <Switch
                    checked={brevoEnabled}
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
                    {subscriberCount.toLocaleString()}
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">Campaigns Sent</span>
                  </div>
                  <p className="text-lg font-semibold text-blue-600">47</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium">Open Rate</span>
                  </div>
                  <p className="text-lg font-semibold text-purple-600">68.5%</p>
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
                        value={brevoApiKey}
                        onChange={(e) => setBrevoApiKey(e.target.value)}
                      />
                      <Button onClick={handleBrevoApiKeySave}>
                        <Key className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                    </div>
                    {savedBrevoApiKey && (
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

        <TabsContent value="demo-video">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5 text-red-600" />
                Demo Video Management
              </CardTitle>
              <CardDescription>
                Manage the demo video displayed on the public Watch Demo page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="video-url">Video URL</Label>
                  <p className="text-sm text-gray-600 mb-2">
                    Enter a direct link to your video file (MP4, MOV, WEBM)
                  </p>
                  <Input
                    id="video-url"
                    type="url"
                    placeholder="https://example.com/your-demo-video.mp4"
                    value={demoVideoUrl}
                    onChange={(e) => setDemoVideoUrl(e.target.value)}
                  />
                </div>
                
                <Button onClick={handleVideoSave} className="w-full">
                  <Video className="w-4 h-4 mr-2" />
                  Save Video Link
                </Button>
              </div>

              {savedVideoUrl && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Current Demo Video</h3>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Currently configured URL:</p>
                    <p className="font-mono text-sm break-all">{savedVideoUrl}</p>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900">Video URL Requirements</p>
                    <div className="text-sm text-blue-700 mt-2 space-y-2">
                      <div>
                        <p className="font-medium text-green-700">✅ Supported:</p>
                        <ul className="list-disc list-inside ml-2">
                          <li>Direct video files (.mp4, .mov, .webm)</li>
                          <li>Direct download links from file hosting</li>
                          <li>CDN video URLs</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-red-700">❌ Not supported:</p>
                        <ul className="list-disc list-inside ml-2">
                          <li>Google Drive sharing links</li>
                          <li>YouTube links</li>
                          <li>Vimeo links</li>
                          <li>Private/password-protected videos</li>
                        </ul>
                      </div>
                      <div className="mt-3 p-2 bg-yellow-100 rounded text-yellow-800">
                        <p className="text-xs">
                          <strong>Tip:</strong> For Google Drive, use "Get link" → "Anyone with the link can view" → 
                          modify the URL format to direct download, or better yet, host your video on a proper video hosting service.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntegrationsPanel;
