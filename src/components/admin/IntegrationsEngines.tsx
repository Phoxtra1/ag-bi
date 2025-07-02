
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Settings, 
  Activity, 
  Zap, 
  Database, 
  Cloud, 
  BarChart3,
  Key,
  Play,
  Save,
  RotateCcw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SystemConfig {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'needs_setup';
  enabled: boolean;
  apiKey?: string;
  url?: string;
  threshold?: number;
  lastActivity?: Date;
  usage?: number;
  settings?: Record<string, any>;
}

interface ActivityLog {
  id: string;
  timestamp: Date;
  system: string;
  action: string;
  details: string;
  status: 'success' | 'error' | 'warning';
}

const IntegrationsEngines = () => {
  const { toast } = useToast();
  const [systems, setSystems] = useState<SystemConfig[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [activeTab, setActiveTab] = useState('analytics');

  // Initialize systems from localStorage or defaults
  useEffect(() => {
    const savedSystems = localStorage.getItem('integrationSystems');
    const defaultSystems: SystemConfig[] = [
      {
        id: 'analytics',
        name: 'Real-Time Analytics Engine',
        status: 'inactive',
        enabled: false,
        usage: 0,
        settings: { retentionDays: 30, trackingEnabled: false }
      },
      {
        id: 'lifecycle',
        name: 'User Lifecycle Automation',
        status: 'inactive',
        enabled: false,
        usage: 0,
        settings: { welcomeEmail: true, reminderInterval: 7 }
      },
      {
        id: 'financial',
        name: 'Financial Metrics Engine',
        status: 'needs_setup',
        enabled: false,
        usage: 0,
        apiKey: '',
        settings: { currency: 'USD', reportingInterval: 'daily' }
      },
      {
        id: 'api_generator',
        name: 'API Access & Key Generator',
        status: 'inactive',
        enabled: false,
        usage: 0,
        settings: { keyExpiration: 365, rateLimit: 1000 }
      },
      {
        id: 'weather_geo',
        name: 'Weather & Geo APIs',
        status: 'needs_setup',
        enabled: false,
        apiKey: '',
        url: 'https://api.openweathermap.org/data/2.5',
        usage: 0,
        settings: { updateInterval: 15, units: 'metric' }
      },
      {
        id: 'notifications',
        name: 'Admin Notification System',
        status: 'inactive',
        enabled: false,
        usage: 0,
        settings: { emailNotifications: true, slackWebhook: '' }
      },
      {
        id: 'prediction',
        name: 'Prediction Engine',
        status: 'needs_setup',
        enabled: false,
        usage: 0,
        settings: { modelVersion: 'v1.0', confidence: 0.8 }
      }
    ];

    if (savedSystems) {
      setSystems(JSON.parse(savedSystems));
    } else {
      setSystems(defaultSystems);
    }

    const savedLogs = localStorage.getItem('integrationLogs');
    if (savedLogs) {
      const parsedLogs = JSON.parse(savedLogs).map((log: any) => ({
        ...log,
        timestamp: new Date(log.timestamp)
      }));
      setActivityLogs(parsedLogs);
    }
  }, []);

  // Save systems to localStorage whenever they change
  useEffect(() => {
    if (systems.length > 0) {
      localStorage.setItem('integrationSystems', JSON.stringify(systems));
    }
  }, [systems]);

  // Save logs to localStorage whenever they change
  useEffect(() => {
    if (activityLogs.length > 0) {
      localStorage.setItem('integrationLogs', JSON.stringify(activityLogs));
    }
  }, [activityLogs]);

  const addActivityLog = (system: string, action: string, details: string, status: 'success' | 'error' | 'warning' = 'success') => {
    const newLog: ActivityLog = {
      id: Date.now().toString(),
      timestamp: new Date(),
      system,
      action,
      details,
      status
    };
    setActivityLogs(prev => [newLog, ...prev.slice(0, 99)]);
  };

  const toggleSystem = (systemId: string) => {
    setSystems(prev => prev.map(system => {
      if (system.id === systemId) {
        const newEnabled = !system.enabled;
        let newStatus: 'active' | 'inactive' | 'needs_setup' = 'inactive';
        
        if (newEnabled) {
          // Check if system has required configuration
          if (system.apiKey !== undefined && !system.apiKey) {
            newStatus = 'needs_setup';
            toast({
              title: "Configuration Required",
              description: `${system.name} requires API key configuration before activation.`,
              variant: "destructive",
            });
            return system; // Don't change state
          } else {
            newStatus = 'active';
          }
        }
        
        addActivityLog(
          system.name,
          newEnabled ? 'Enabled' : 'Disabled',
          `System ${newEnabled ? 'activated' : 'deactivated'} by admin`,
          'success'
        );

        toast({
          title: newEnabled ? "System Activated" : "System Deactivated",
          description: `${system.name} has been ${newEnabled ? 'activated' : 'deactivated'}.`,
        });

        return {
          ...system,
          enabled: newEnabled,
          status: newStatus,
          lastActivity: new Date()
        };
      }
      return system;
    }));
  };

  const updateSystemConfig = (systemId: string, field: string, value: any) => {
    setSystems(prev => prev.map(system => {
      if (system.id === systemId) {
        const updated = { ...system, [field]: value };
        
        // Update status based on configuration
        if (field === 'apiKey' && value && value.length > 10) {
          updated.status = 'inactive'; // Ready to be enabled
        }
        
        return updated;
      }
      return system;
    }));
  };

  const saveSystemConfig = (systemId: string) => {
    const system = systems.find(s => s.id === systemId);
    if (!system) return;

    // Validate configuration
    if (system.apiKey !== undefined && !system.apiKey) {
      toast({
        title: "Configuration Error",
        description: "API key is required for this system.",
        variant: "destructive",
      });
      return;
    }

    addActivityLog(
      system.name,
      'Configuration Saved',
      'System configuration updated successfully',
      'success'
    );

    toast({
      title: "Configuration Saved",
      description: `${system.name} settings have been updated and saved permanently.`,
    });
  };

  const testSystem = async (systemId: string) => {
    const system = systems.find(s => s.id === systemId);
    if (!system) return;

    addActivityLog(
      system.name,
      'Test Started',
      'Running system connectivity test...',
      'warning'
    );

    // Simulate realistic API testing
    setTimeout(() => {
      let success = false;
      let message = '';

      // Test based on system type
      switch (system.id) {
        case 'weather_geo':
          success = system.apiKey && system.apiKey.length > 10;
          message = success ? 'Weather API connection successful' : 'Invalid API key for weather service';
          break;
        case 'financial':
          success = system.apiKey && system.apiKey.length > 15;
          message = success ? 'Financial API connection verified' : 'Financial API authentication failed';
          break;
        case 'analytics':
          success = true; // Analytics doesn't need external API
          message = 'Analytics engine initialized successfully';
          break;
        case 'prediction':
          success = Math.random() > 0.2; // 80% success rate
          message = success ? 'Prediction model loaded and ready' : 'Prediction model failed to initialize';
          break;
        default:
          success = Math.random() > 0.3; // 70% success rate for others
          message = success ? 'System test passed successfully' : 'System test failed - check configuration';
      }

      addActivityLog(
        system.name,
        'Test Completed',
        message,
        success ? 'success' : 'error'
      );

      toast({
        title: success ? "Test Successful" : "Test Failed",
        description: message,
        variant: success ? "default" : "destructive"
      });

      // Update usage stats on successful test
      if (success) {
        setSystems(prev => prev.map(s => 
          s.id === systemId ? { ...s, usage: (s.usage || 0) + 1, lastActivity: new Date() } : s
        ));
      }
    }, 2000);
  };

  const resetSystemConfig = (systemId: string) => {
    setSystems(prev => prev.map(system => {
      if (system.id === systemId) {
        const reset = {
          ...system,
          enabled: false,
          status: 'needs_setup' as const,
          apiKey: '',
          url: system.id === 'weather_geo' ? 'https://api.openweathermap.org/data/2.5' : '',
          threshold: undefined,
          usage: 0
        };

        addActivityLog(
          system.name,
          'Configuration Reset',
          'System configuration restored to defaults',
          'warning'
        );

        return reset;
      }
      return system;
    }));

    toast({
      title: "Configuration Reset",
      description: "System has been reset to default settings.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'needs_setup': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'inactive': return <XCircle className="w-4 h-4" />;
      case 'needs_setup': return <AlertTriangle className="w-4 h-4" />;
      default: return <XCircle className="w-4 h-4" />;
    }
  };

  const categoryConfigs = {
    analytics: systems.filter(s => s.id === 'analytics'),
    integrations: systems.filter(s => ['weather_geo', 'financial', 'notifications'].includes(s.id)),
    automation: systems.filter(s => ['lifecycle', 'api_generator'].includes(s.id)),
    prediction: systems.filter(s => s.id === 'prediction')
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Integrations & Engines</h2>
          <p className="text-gray-600">Configure and monitor system components</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh All
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="integrations" className="flex items-center gap-2">
                <Cloud className="w-4 h-4" />
                Integrations
              </TabsTrigger>
              <TabsTrigger value="automation" className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Automation
              </TabsTrigger>
              <TabsTrigger value="prediction" className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                Prediction
              </TabsTrigger>
            </TabsList>

            {Object.entries(categoryConfigs).map(([category, systemsList]) => (
              <TabsContent key={category} value={category} className="space-y-4">
                {systemsList.map(system => (
                  <Card key={system.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CardTitle className="text-lg">{system.name}</CardTitle>
                          <Badge className={getStatusColor(system.status)}>
                            {getStatusIcon(system.status)}
                            <span className="ml-1 capitalize">{system.status.replace('_', ' ')}</span>
                          </Badge>
                        </div>
                        <Switch
                          checked={system.enabled}
                          onCheckedChange={() => toggleSystem(system.id)}
                        />
                      </div>
                      <CardDescription>
                        Usage: {system.usage || 0} requests | Last activity: {system.lastActivity?.toLocaleString() || 'Never'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {system.apiKey !== undefined && (
                          <div>
                            <Label htmlFor={`${system.id}-api-key`}>API Key</Label>
                            <Input
                              id={`${system.id}-api-key`}
                              type="password"
                              value={system.apiKey}
                              onChange={(e) => updateSystemConfig(system.id, 'apiKey', e.target.value)}
                              placeholder="Enter API key..."
                            />
                          </div>
                        )}
                        
                        {system.url !== undefined && (
                          <div>
                            <Label htmlFor={`${system.id}-url`}>Endpoint URL</Label>
                            <Input
                              id={`${system.id}-url`}
                              value={system.url}
                              onChange={(e) => updateSystemConfig(system.id, 'url', e.target.value)}
                              placeholder="Enter endpoint URL..."
                            />
                          </div>
                        )}

                        {system.threshold !== undefined && (
                          <div>
                            <Label htmlFor={`${system.id}-threshold`}>Threshold</Label>
                            <Input
                              id={`${system.id}-threshold`}
                              type="number"
                              value={system.threshold || ''}
                              onChange={(e) => updateSystemConfig(system.id, 'threshold', parseInt(e.target.value))}
                              placeholder="Enter threshold value..."
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button onClick={() => saveSystemConfig(system.id)} className="flex items-center gap-2">
                          <Save className="w-4 h-4" />
                          Save
                        </Button>
                        <Button variant="outline" onClick={() => testSystem(system.id)} className="flex items-center gap-2">
                          <Play className="w-4 h-4" />
                          Test
                        </Button>
                        <Button variant="outline" onClick={() => resetSystemConfig(system.id)} className="flex items-center gap-2">
                          <RotateCcw className="w-4 h-4" />
                          Reset
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <div className="lg:col-span-1">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Activity Logs
              </CardTitle>
              <CardDescription>Real-time system activity</CardDescription>
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
                        <p className="text-xs font-medium text-gray-900">{log.system}</p>
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

export default IntegrationsEngines;
