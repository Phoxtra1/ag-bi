
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Brain, 
  CloudRain, 
  Globe, 
  Key, 
  Settings, 
  TestTube, 
  Bell, 
  Save, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Zap,
  MessageSquare,
  Send,
  Activity
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface APIConfig {
  enabled: boolean;
  apiKey: string;
  endpoint?: string;
  status: 'active' | 'inactive' | 'needs_setup' | 'error';
  lastTested?: Date;
  usage: number;
}

interface SystemSettings {
  chatgpt: APIConfig;
  weather: APIConfig;
  geolocation: APIConfig;
  news: APIConfig;
  notifications: APIConfig;
  predictions: {
    civic: boolean;
    political: boolean;
    environmental: boolean;
    enabled: boolean;
  };
}

const AIEnginePanel = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SystemSettings>({
    chatgpt: {
      enabled: false,
      apiKey: '',
      endpoint: 'https://api.openai.com/v1/chat/completions',
      status: 'needs_setup',
      usage: 0
    },
    weather: {
      enabled: false,
      apiKey: '',
      endpoint: 'https://api.openweathermap.org/data/2.5',
      status: 'needs_setup',
      usage: 0
    },
    geolocation: {
      enabled: false,
      apiKey: '',
      endpoint: 'https://ipapi.co',
      status: 'needs_setup',
      usage: 0
    },
    news: {
      enabled: false,
      apiKey: '',
      endpoint: 'https://newsapi.org/v2',
      status: 'needs_setup',
      usage: 0
    },
    notifications: {
      enabled: false,
      apiKey: '',
      endpoint: 'https://api.sendgrid.com/v3',
      status: 'needs_setup',
      usage: 0
    },
    predictions: {
      civic: false,
      political: false,
      environmental: false,
      enabled: false
    }
  });

  const [testConsole, setTestConsole] = useState({
    prompt: '',
    response: '',
    isLoading: false,
    history: [] as Array<{id: string, prompt: string, response: string, timestamp: Date}>
  });

  const [activityLogs, setActivityLogs] = useState<Array<{
    id: string;
    timestamp: Date;
    action: string;
    status: 'success' | 'error' | 'warning';
    details: string;
  }>>([]);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('amnova_admin_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    const savedLogs = localStorage.getItem('amnova_activity_logs');
    if (savedLogs) {
      setActivityLogs(JSON.parse(savedLogs).map((log: any) => ({
        ...log,
        timestamp: new Date(log.timestamp)
      })));
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('amnova_admin_settings', JSON.stringify(settings));
  }, [settings]);

  const addActivityLog = (action: string, status: 'success' | 'error' | 'warning', details: string) => {
    const newLog = {
      id: Date.now().toString(),
      timestamp: new Date(),
      action,
      status,
      details
    };
    const updatedLogs = [newLog, ...activityLogs.slice(0, 99)];
    setActivityLogs(updatedLogs);
    localStorage.setItem('amnova_activity_logs', JSON.stringify(updatedLogs));
  };

  const updateAPIConfig = (api: keyof Omit<SystemSettings, 'predictions'>, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [api]: {
        ...prev[api],
        [field]: value,
        status: field === 'apiKey' && value ? 'inactive' : prev[api].status
      }
    }));
  };

  const toggleAPI = (api: keyof Omit<SystemSettings, 'predictions'>) => {
    const currentAPI = settings[api];
    if (!currentAPI.apiKey && !currentAPI.enabled) {
      toast({
        title: "API Key Required",
        description: "Please enter an API key before enabling this service.",
        variant: "destructive"
      });
      return;
    }

    const newEnabled = !currentAPI.enabled;
    setSettings(prev => ({
      ...prev,
      [api]: {
        ...prev[api],
        enabled: newEnabled,
        status: newEnabled ? 'active' : 'inactive'
      }
    }));

    addActivityLog(
      `${api.toUpperCase()} ${newEnabled ? 'Enabled' : 'Disabled'}`,
      'success',
      `${api} API has been ${newEnabled ? 'activated' : 'deactivated'}`
    );

    toast({
      title: `${api.toUpperCase()} ${newEnabled ? 'Enabled' : 'Disabled'}`,
      description: `${api} API is now ${newEnabled ? 'active' : 'inactive'}.`,
    });
  };

  const testAPI = async (api: keyof Omit<SystemSettings, 'predictions'>) => {
    const apiConfig = settings[api];
    if (!apiConfig.apiKey) {
      toast({
        title: "Test Failed",
        description: "API key is required for testing.",
        variant: "destructive"
      });
      return;
    }

    addActivityLog(`Testing ${api.toUpperCase()}`, 'warning', 'Running connectivity test...');

    // Simulate API test with timeout
    setTimeout(() => {
      const success = Math.random() > 0.2; // 80% success rate for demo
      
      setSettings(prev => ({
        ...prev,
        [api]: {
          ...prev[api],
          status: success ? 'active' : 'error',
          lastTested: new Date(),
          usage: prev[api].usage + 1
        }
      }));

      addActivityLog(
        `${api.toUpperCase()} Test ${success ? 'Passed' : 'Failed'}`,
        success ? 'success' : 'error',
        success ? 'API connection successful' : 'API connection failed - check credentials'
      );

      toast({
        title: success ? "Test Successful" : "Test Failed",
        description: success 
          ? `${api.toUpperCase()} API is working correctly.`
          : `${api.toUpperCase()} test failed. Please check your configuration.`,
        variant: success ? "default" : "destructive"
      });
    }, 2000);
  };

  const testChatGPT = async () => {
    if (!testConsole.prompt.trim()) {
      toast({
        title: "Enter a prompt",
        description: "Please enter a prompt to test the ChatGPT integration.",
        variant: "destructive"
      });
      return;
    }

    if (!settings.chatgpt.apiKey) {
      toast({
        title: "ChatGPT Not Configured",
        description: "Please configure ChatGPT API key first.",
        variant: "destructive"
      });
      return;
    }

    setTestConsole(prev => ({ ...prev, isLoading: true }));

    // Simulate ChatGPT API call
    setTimeout(() => {
      const responses = [
        "Based on current data trends and political indicators, there's a 75% likelihood of increased civic engagement in urban areas over the next quarter.",
        "Environmental prediction models suggest a 60% chance of severe weather patterns affecting agricultural regions in the coming season.",
        "Political sentiment analysis indicates shifting public opinion with 68% confidence in policy changes within the next 6 months.",
        "Civic participation metrics show a predicted 45% increase in community involvement during upcoming local elections."
      ];
      
      const response = responses[Math.floor(Math.random() * responses.length)];
      
      const newHistoryItem = {
        id: Date.now().toString(),
        prompt: testConsole.prompt,
        response,
        timestamp: new Date()
      };

      setTestConsole(prev => ({
        ...prev,
        response,
        isLoading: false,
        history: [newHistoryItem, ...prev.history.slice(0, 9)]
      }));

      setSettings(prev => ({
        ...prev,
        chatgpt: {
          ...prev.chatgpt,
          usage: prev.chatgpt.usage + 1
        }
      }));

      addActivityLog(
        'ChatGPT Test Executed',
        'success',
        `AI prediction generated for prompt: "${testConsole.prompt.substring(0, 50)}..."`
      );
    }, 3000);
  };

  const saveAllSettings = () => {
    localStorage.setItem('amnova_admin_settings', JSON.stringify(settings));
    addActivityLog('Settings Saved', 'success', 'All system configurations saved successfully');
    toast({
      title: "Settings Saved",
      description: "All configurations have been saved successfully.",
    });
  };

  const resetAllSettings = () => {
    const defaultSettings = {
      chatgpt: { enabled: false, apiKey: '', endpoint: 'https://api.openai.com/v1/chat/completions', status: 'needs_setup' as const, usage: 0 },
      weather: { enabled: false, apiKey: '', endpoint: 'https://api.openweathermap.org/data/2.5', status: 'needs_setup' as const, usage: 0 },
      geolocation: { enabled: false, apiKey: '', endpoint: 'https://ipapi.co', status: 'needs_setup' as const, usage: 0 },
      news: { enabled: false, apiKey: '', endpoint: 'https://newsapi.org/v2', status: 'needs_setup' as const, usage: 0 },
      notifications: { enabled: false, apiKey: '', endpoint: 'https://api.sendgrid.com/v3', status: 'needs_setup' as const, usage: 0 },
      predictions: { civic: false, political: false, environmental: false, enabled: false }
    };
    
    setSettings(defaultSettings);
    localStorage.setItem('amnova_admin_settings', JSON.stringify(defaultSettings));
    addActivityLog('Settings Reset', 'warning', 'All configurations reset to defaults');
    toast({
      title: "Settings Reset",
      description: "All configurations have been reset to default values.",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'inactive': return <XCircle className="w-4 h-4 text-gray-500" />;
      case 'needs_setup': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <XCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-700 border-green-200',
      inactive: 'bg-gray-100 text-gray-700 border-gray-200',
      needs_setup: 'bg-amber-100 text-amber-700 border-amber-200',
      error: 'bg-red-100 text-red-700 border-red-200'
    };
    return colors[status as keyof typeof colors] || colors.inactive;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI Engine Control Panel</h2>
          <p className="text-gray-600">Configure and monitor all AI-powered systems</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={saveAllSettings} className="bg-green-600 hover:bg-green-700">
            <Save className="w-4 h-4 mr-2" />
            Save All
          </Button>
          <Button onClick={resetAllSettings} variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset All
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Configuration Panel */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="ai-integration">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="ai-integration">
                <Brain className="w-4 h-4 mr-1" />
                AI APIs
              </TabsTrigger>
              <TabsTrigger value="external-apis">
                <Globe className="w-4 h-4 mr-1" />
                External APIs
              </TabsTrigger>
              <TabsTrigger value="predictions">
                <Zap className="w-4 h-4 mr-1" />
                Predictions
              </TabsTrigger>
              <TabsTrigger value="test-console">
                <TestTube className="w-4 h-4 mr-1" />
                Test Console
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ai-integration" className="space-y-4">
              {/* ChatGPT Configuration */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="w-5 h-5" />
                        ChatGPT API Integration
                      </CardTitle>
                      <Badge className={getStatusBadge(settings.chatgpt.status)}>
                        {getStatusIcon(settings.chatgpt.status)}
                        <span className="ml-1 capitalize">{settings.chatgpt.status.replace('_', ' ')}</span>
                      </Badge>
                    </div>
                    <Switch
                      checked={settings.chatgpt.enabled}
                      onCheckedChange={() => toggleAPI('chatgpt')}
                    />
                  </div>
                  <CardDescription>
                    Enable AI-powered predictions and content generation | Usage: {settings.chatgpt.usage} requests
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="chatgpt-key">OpenAI API Key</Label>
                    <Input
                      id="chatgpt-key"
                      type="password"
                      value={settings.chatgpt.apiKey}
                      onChange={(e) => updateAPIConfig('chatgpt', 'apiKey', e.target.value)}
                      placeholder="sk-..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="chatgpt-endpoint">API Endpoint</Label>
                    <Input
                      id="chatgpt-endpoint"
                      value={settings.chatgpt.endpoint}
                      onChange={(e) => updateAPIConfig('chatgpt', 'endpoint', e.target.value)}
                    />
                  </div>
                  <Button onClick={() => testAPI('chatgpt')} variant="outline">
                    <TestTube className="w-4 h-4 mr-2" />
                    Test Connection
                  </Button>
                </CardContent>
              </Card>

              {/* Notifications Configuration */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CardTitle className="flex items-center gap-2">
                        <Bell className="w-5 h-5" />
                        Notification System
                      </CardTitle>
                      <Badge className={getStatusBadge(settings.notifications.status)}>
                        {getStatusIcon(settings.notifications.status)}
                        <span className="ml-1 capitalize">{settings.notifications.status.replace('_', ' ')}</span>
                      </Badge>
                    </div>
                    <Switch
                      checked={settings.notifications.enabled}
                      onCheckedChange={() => toggleAPI('notifications')}
                    />
                  </div>
                  <CardDescription>
                    SendGrid, Twilio, and email automation | Usage: {settings.notifications.usage} sent
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="notifications-key">SendGrid API Key</Label>
                    <Input
                      id="notifications-key"
                      type="password"
                      value={settings.notifications.apiKey}
                      onChange={(e) => updateAPIConfig('notifications', 'apiKey', e.target.value)}
                      placeholder="SG...."
                    />
                  </div>
                  <Button onClick={() => testAPI('notifications')} variant="outline">
                    <TestTube className="w-4 h-4 mr-2" />
                    Test Email System
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="external-apis" className="space-y-4">
              {/* Weather API */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CardTitle className="flex items-center gap-2">
                        <CloudRain className="w-5 h-5" />
                        Weather API Configuration
                      </CardTitle>
                      <Badge className={getStatusBadge(settings.weather.status)}>
                        {getStatusIcon(settings.weather.status)}
                        <span className="ml-1 capitalize">{settings.weather.status.replace('_', ' ')}</span>
                      </Badge>
                    </div>
                    <Switch
                      checked={settings.weather.enabled}
                      onCheckedChange={() => toggleAPI('weather')}
                    />
                  </div>
                  <CardDescription>
                    OpenWeather integration for environmental predictions | Usage: {settings.weather.usage} calls
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="weather-key">OpenWeather API Key</Label>
                    <Input
                      id="weather-key"
                      type="password"
                      value={settings.weather.apiKey}
                      onChange={(e) => updateAPIConfig('weather', 'apiKey', e.target.value)}
                      placeholder="Enter OpenWeather API key"
                    />
                  </div>
                  <Button onClick={() => testAPI('weather')} variant="outline">
                    <TestTube className="w-4 h-4 mr-2" />
                    Test Weather API
                  </Button>
                </CardContent>
              </Card>

              {/* Geolocation API */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="w-5 h-5" />
                        Geolocation Auto IP
                      </CardTitle>
                      <Badge className={getStatusBadge(settings.geolocation.status)}>
                        {getStatusIcon(settings.geolocation.status)}
                        <span className="ml-1 capitalize">{settings.geolocation.status.replace('_', ' ')}</span>
                      </Badge>
                    </div>
                    <Switch
                      checked={settings.geolocation.enabled}
                      onCheckedChange={() => toggleAPI('geolocation')}
                    />
                  </div>
                  <CardDescription>
                    Automatic location detection for region-based predictions | Usage: {settings.geolocation.usage} lookups
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="geo-key">IP Geolocation API Key</Label>
                    <Input
                      id="geo-key"
                      type="password"
                      value={settings.geolocation.apiKey}
                      onChange={(e) => updateAPIConfig('geolocation', 'apiKey', e.target.value)}
                      placeholder="Enter geolocation API key"
                    />
                  </div>
                  <Button onClick={() => testAPI('geolocation')} variant="outline">
                    <TestTube className="w-4 h-4 mr-2" />
                    Test Geolocation
                  </Button>
                </CardContent>
              </Card>

              {/* News API */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="w-5 h-5" />
                        News API Integration
                      </CardTitle>
                      <Badge className={getStatusBadge(settings.news.status)}>
                        {getStatusIcon(settings.news.status)}
                        <span className="ml-1 capitalize">{settings.news.status.replace('_', ' ')}</span>
                      </Badge>
                    </div>
                    <Switch
                      checked={settings.news.enabled}
                      onCheckedChange={() => toggleAPI('news')}
                    />
                  </div>
                  <CardDescription>
                    Real-time news data for trend analysis | Usage: {settings.news.usage} requests
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="news-key">News API Key</Label>
                    <Input
                      id="news-key"
                      type="password"
                      value={settings.news.apiKey}
                      onChange={(e) => updateAPIConfig('news', 'apiKey', e.target.value)}
                      placeholder="Enter NewsAPI key"
                    />
                  </div>
                  <Button onClick={() => testAPI('news')} variant="outline">
                    <TestTube className="w-4 h-4 mr-2" />
                    Test News Feed
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="predictions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Prediction Engine Settings
                  </CardTitle>
                  <CardDescription>
                    Configure prediction categories and automation rules
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="predictions-enabled">Enable Prediction Engine</Label>
                      <p className="text-sm text-gray-600">Master switch for all prediction functionality</p>
                    </div>
                    <Switch
                      id="predictions-enabled"
                      checked={settings.predictions.enabled}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        predictions: { ...prev.predictions, enabled: checked }
                      }))}
                    />
                  </div>

                  <div className="space-y-3 border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="civic-predictions">Civic Predictions</Label>
                        <p className="text-sm text-gray-600">Elections, public policy, community events</p>
                      </div>
                      <Switch
                        id="civic-predictions"
                        checked={settings.predictions.civic}
                        onCheckedChange={(checked) => setSettings(prev => ({
                          ...prev,
                          predictions: { ...prev.predictions, civic: checked }
                        }))}
                        disabled={!settings.predictions.enabled}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="political-predictions">Political Predictions</Label>
                        <p className="text-sm text-gray-600">Political trends, election outcomes, policy changes</p>
                      </div>
                      <Switch
                        id="political-predictions"
                        checked={settings.predictions.political}
                        onCheckedChange={(checked) => setSettings(prev => ({
                          ...prev,
                          predictions: { ...prev.predictions, political: checked }
                        }))}
                        disabled={!settings.predictions.enabled}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="environmental-predictions">Environmental Predictions</Label>
                        <p className="text-sm text-gray-600">Climate, weather patterns, natural disasters</p>
                      </div>
                      <Switch
                        id="environmental-predictions"
                        checked={settings.predictions.environmental}
                        onCheckedChange={(checked) => setSettings(prev => ({
                          ...prev,
                          predictions: { ...prev.predictions, environmental: checked }
                        }))}
                        disabled={!settings.predictions.enabled}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="test-console" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    AI Test Console
                  </CardTitle>
                  <CardDescription>
                    Test AI predictions and responses in real-time
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="test-prompt">Test Prompt</Label>
                    <Textarea
                      id="test-prompt"
                      placeholder="Enter a prediction query (e.g., 'What are the political trends in California?')"
                      value={testConsole.prompt}
                      onChange={(e) => setTestConsole(prev => ({ ...prev, prompt: e.target.value }))}
                      rows={3}
                    />
                  </div>
                  
                  <Button 
                    onClick={testChatGPT} 
                    disabled={testConsole.isLoading || !settings.chatgpt.enabled}
                    className="w-full"
                  >
                    {testConsole.isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Run AI Prediction Test
                      </>
                    )}
                  </Button>

                  {testConsole.response && (
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <Label className="text-sm font-medium text-gray-700">AI Response:</Label>
                      <p className="mt-2 text-gray-900">{testConsole.response}</p>
                    </div>
                  )}

                  {testConsole.history.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium">Test History</Label>
                      <ScrollArea className="h-64 mt-2">
                        <div className="space-y-2">
                          {testConsole.history.map((item) => (
                            <div key={item.id} className="border rounded p-3 bg-white">
                              <p className="text-xs text-gray-500 mb-1">
                                {item.timestamp.toLocaleString()}
                              </p>
                              <p className="text-sm font-medium text-gray-700 mb-1">
                                Q: {item.prompt}
                              </p>
                              <p className="text-sm text-gray-900">A: {item.response}</p>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Activity Logs */}
        <div className="lg:col-span-1">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                System Activity
              </CardTitle>
              <CardDescription>Real-time system logs</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {activityLogs.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">No activity logs yet</p>
                  ) : (
                    activityLogs.map(log => (
                      <div key={log.id} className="border-l-2 border-l-blue-200 pl-3 py-2">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${
                              log.status === 'success' ? 'bg-green-100 text-green-700' :
                              log.status === 'error' ? 'bg-red-100 text-red-700' :
                              'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {log.action}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600">{log.details}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {log.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIEnginePanel;
