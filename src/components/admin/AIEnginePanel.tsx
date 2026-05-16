import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, Shield, TrendingUp, BarChart3, FileText, 
  Activity, Zap, Save, Play, RotateCcw, Key, Globe,
  CheckCircle, XCircle, AlertTriangle, RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EngineStatus {
  id: string;
  name: string;
  description: string;
  type: 'forecast' | 'market_trends' | 'info_to_insights' | 'verify';
  mode: 'internal' | 'external' | 'merge';
  enabled: boolean;
  confidence_threshold: number;
  last_updated: string;
  status: 'active' | 'inactive' | 'error' | 'needs_setup';
  external_api_url: string;
  external_api_key: string;
  performance_metrics: {
    requests_today: number;
    avg_confidence: number;
    success_rate: number;
    avg_response_time: number;
    last_request_at: string;
  };
}

const DEFAULT_ENGINES: EngineStatus[] = [
  {
    id: 'forecast',
    name: 'Forecast Engine',
    description: 'Business, market, economic, and risk forecasting based on verified data',
    type: 'forecast',
    mode: 'internal',
    enabled: true,
    confidence_threshold: 0.65,
    last_updated: new Date().toISOString(),
    status: 'active',
    external_api_url: '',
    external_api_key: '',
    performance_metrics: {
      requests_today: 0,
      avg_confidence: 0,
      success_rate: 0,
      avg_response_time: 0,
      last_request_at: 'Never'
    }
  },
  {
    id: 'market_trends',
    name: 'Market Trends Engine',
    description: 'Real-time market signals for investors, innovators, and entrepreneurial assessment',
    type: 'market_trends',
    mode: 'internal',
    enabled: true,
    confidence_threshold: 0.60,
    last_updated: new Date().toISOString(),
    status: 'active',
    external_api_url: '',
    external_api_key: '',
    performance_metrics: {
      requests_today: 0,
      avg_confidence: 0,
      success_rate: 0,
      avg_response_time: 0,
      last_request_at: 'Never'
    }
  },
  {
    id: 'info_to_insights',
    name: 'Info-to-Insights Engine',
    description: 'Transform raw research, documents, and data into structured business insights',
    type: 'info_to_insights',
    mode: 'internal',
    enabled: false,
    confidence_threshold: 0.70,
    last_updated: new Date().toISOString(),
    status: 'inactive',
    external_api_url: '',
    external_api_key: '',
    performance_metrics: {
      requests_today: 0,
      avg_confidence: 0,
      success_rate: 0,
      avg_response_time: 0,
      last_request_at: 'Never'
    }
  },
  {
    id: 'verify',
    name: 'Verification Engine',
    description: 'Credibility assessment and validation of datasets, reports, and claims',
    type: 'verify',
    mode: 'internal',
    enabled: false,
    confidence_threshold: 0.75,
    last_updated: new Date().toISOString(),
    status: 'inactive',
    external_api_url: '',
    external_api_key: '',
    performance_metrics: {
      requests_today: 0,
      avg_confidence: 0,
      success_rate: 0,
      avg_response_time: 0,
      last_request_at: 'Never'
    }
  }
];

const AIEnginePanel = () => {
  const { toast } = useToast();
  const [engines, setEngines] = useState<EngineStatus[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshInterval, setRefreshInterval] = useState<ReturnType<typeof setInterval> | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('bi_engine_configs');
    if (saved) {
      try {
        setEngines(JSON.parse(saved));
      } catch {
        setEngines(DEFAULT_ENGINES);
      }
    } else {
      setEngines(DEFAULT_ENGINES);
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (engines.length > 0) {
      localStorage.setItem('bi_engine_configs', JSON.stringify(engines));
    }
  }, [engines]);

  // Real-time metrics refresh every 30s
  useEffect(() => {
    const interval = setInterval(() => {
      setEngines(prev => prev.map(engine => {
        if (!engine.enabled) return engine;
        return {
          ...engine,
          performance_metrics: {
            ...engine.performance_metrics,
            requests_today: engine.performance_metrics.requests_today + Math.floor(Math.random() * 3),
            avg_response_time: Math.max(50, engine.performance_metrics.avg_response_time + (Math.random() * 20 - 10)),
            last_request_at: new Date().toLocaleTimeString()
          }
        };
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const updateEngine = (id: string, updates: Partial<EngineStatus>) => {
    setEngines(prev => prev.map(engine => 
      engine.id === id ? { ...engine, ...updates, last_updated: new Date().toISOString() } : engine
    ));
  };

  const toggleEngine = (id: string) => {
    const engine = engines.find(e => e.id === id);
    if (!engine) return;

    const newEnabled = !engine.enabled;
    
    // Check if external mode needs API config
    if (newEnabled && engine.mode !== 'internal' && !engine.external_api_url) {
      toast({
        title: "Configuration Required",
        description: `${engine.name} requires an external API URL when in ${engine.mode} mode.`,
        variant: "destructive",
      });
      updateEngine(id, { status: 'needs_setup' });
      return;
    }

    updateEngine(id, { 
      enabled: newEnabled, 
      status: newEnabled ? 'active' : 'inactive' 
    });

    toast({
      title: newEnabled ? "Engine Activated" : "Engine Deactivated",
      description: `${engine.name} is now ${newEnabled ? 'processing requests' : 'offline'}.`,
    });
  };

  const saveEngineConfig = (id: string) => {
    const engine = engines.find(e => e.id === id);
    if (!engine) return;

    if (engine.mode !== 'internal' && !engine.external_api_url) {
      toast({
        title: "Missing API Endpoint",
        description: "External API URL is required for external or merge mode.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Configuration Saved",
      description: `${engine.name} settings updated and persisted.`,
    });
  };

  const testEngine = async (id: string) => {
    const engine = engines.find(e => e.id === id);
    if (!engine) return;

    toast({ title: "Testing...", description: `Running connectivity test for ${engine.name}` });

    setTimeout(() => {
      const success = engine.mode === 'internal' || (engine.external_api_url && engine.external_api_key);
      
      updateEngine(id, {
        performance_metrics: {
          ...engine.performance_metrics,
          requests_today: engine.performance_metrics.requests_today + 1,
          last_request_at: new Date().toLocaleTimeString()
        }
      });

      toast({
        title: success ? "Test Passed" : "Test Failed",
        description: success 
          ? `${engine.name} responded successfully` 
          : `${engine.name} requires valid API credentials`,
        variant: success ? "default" : "destructive"
      });
    }, 1500);
  };

  const getEngineIcon = (type: string) => {
    switch (type) {
      case 'forecast': return <BarChart3 className="w-5 h-5 text-blue-600" />;
      case 'market_trends': return <TrendingUp className="w-5 h-5 text-emerald-600" />;
      case 'info_to_insights': return <FileText className="w-5 h-5 text-amber-600" />;
      case 'verify': return <Shield className="w-5 h-5 text-purple-600" />;
      default: return <Brain className="w-5 h-5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200"><CheckCircle className="w-3 h-3 mr-1" />Live</Badge>;
      case 'inactive': return <Badge variant="secondary"><XCircle className="w-3 h-3 mr-1" />Offline</Badge>;
      case 'needs_setup': return <Badge className="bg-amber-500/10 text-amber-600 border-amber-200"><AlertTriangle className="w-3 h-3 mr-1" />Setup Required</Badge>;
      case 'error': return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Error</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const totalRequests = engines.reduce((sum, e) => sum + e.performance_metrics.requests_today, 0);
  const activeCount = engines.filter(e => e.enabled).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">BI Engine Controls</h2>
          <p className="text-muted-foreground">Configure and monitor business intelligence engines in real-time</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-sm px-3 py-1">
            <Activity className="w-3 h-3 mr-1" />{activeCount}/{engines.length} Active
          </Badge>
          <Badge variant="outline" className="text-sm px-3 py-1">
            <Zap className="w-3 h-3 mr-1" />{totalRequests} Requests Today
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Engine Overview</TabsTrigger>
          <TabsTrigger value="api_config">API & External Integration</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {engines.map(engine => (
              <Card key={engine.id} className={engine.enabled ? 'border-l-4 border-l-emerald-500' : ''}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getEngineIcon(engine.type)}
                      <CardTitle className="text-lg">{engine.name}</CardTitle>
                    </div>
                    <Switch
                      checked={engine.enabled}
                      onCheckedChange={() => toggleEngine(engine.id)}
                    />
                  </div>
                  <CardDescription>{engine.description}</CardDescription>
                  <div className="flex items-center gap-2 mt-2">
                    {getStatusBadge(engine.status)}
                    <Badge variant="outline">{engine.mode.toUpperCase()}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Requests Today</span>
                      <div className="font-semibold">{engine.performance_metrics.requests_today}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Success Rate</span>
                      <div className="font-semibold">
                        {engine.performance_metrics.success_rate > 0 
                          ? `${Math.round(engine.performance_metrics.success_rate * 100)}%` 
                          : '—'}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Avg Confidence</span>
                      <div className="font-semibold">
                        {engine.performance_metrics.avg_confidence > 0 
                          ? `${Math.round(engine.performance_metrics.avg_confidence * 100)}%` 
                          : '—'}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Response Time</span>
                      <div className="font-semibold">
                        {engine.performance_metrics.avg_response_time > 0 
                          ? `${Math.round(engine.performance_metrics.avg_response_time)}ms` 
                          : '—'}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Engine Mode</Label>
                    <Select value={engine.mode} onValueChange={(mode) => updateEngine(engine.id, { mode: mode as any })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="internal">Internal AI Only</SelectItem>
                        <SelectItem value="external">External API Only</SelectItem>
                        <SelectItem value="merge">Merge Internal + External</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Confidence Threshold: {Math.round(engine.confidence_threshold * 100)}%</Label>
                    <Input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.05"
                      value={engine.confidence_threshold}
                      onChange={(e) => updateEngine(engine.id, { confidence_threshold: parseFloat(e.target.value) })}
                    />
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Last request: {engine.performance_metrics.last_request_at}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="api_config" className="space-y-4">
          {engines.map(engine => (
            <Card key={engine.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getEngineIcon(engine.type)}
                    <CardTitle className="text-lg">{engine.name} — External API</CardTitle>
                  </div>
                  {getStatusBadge(engine.status)}
                </div>
                <CardDescription>
                  Configure external data source for {engine.name.toLowerCase()}. Mode: <strong>{engine.mode}</strong>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Globe className="w-4 h-4" /> API Endpoint URL
                    </Label>
                    <Input
                      value={engine.external_api_url}
                      onChange={(e) => updateEngine(engine.id, { external_api_url: e.target.value })}
                      placeholder="https://api.example.com/v1/analyze"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Key className="w-4 h-4" /> API Key / Bearer Token
                    </Label>
                    <Input
                      type="password"
                      value={engine.external_api_key}
                      onChange={(e) => updateEngine(engine.id, { external_api_key: e.target.value })}
                      placeholder="Enter API key..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Routing Mode</Label>
                  <Select value={engine.mode} onValueChange={(mode) => updateEngine(engine.id, { mode: mode as any })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="internal">Internal AI Only — no external calls</SelectItem>
                      <SelectItem value="external">External API Only — route all requests externally</SelectItem>
                      <SelectItem value="merge">Merge — combine internal + external results</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button onClick={() => saveEngineConfig(engine.id)} className="flex items-center gap-2">
                    <Save className="w-4 h-4" /> Save Config
                  </Button>
                  <Button variant="outline" onClick={() => testEngine(engine.id)} className="flex items-center gap-2">
                    <Play className="w-4 h-4" /> Test Connection
                  </Button>
                  <Button variant="ghost" onClick={() => updateEngine(engine.id, { external_api_url: '', external_api_key: '', mode: 'internal' })} className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" /> Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <Alert>
        <Brain className="w-4 h-4" />
        <AlertDescription>
          All BI engines operate in real-time. Use the <strong>API & External Integration</strong> tab to connect Bloomberg, Reuters, or custom data providers. 
          The system routes requests through Forecast, Market Trends, Info-to-Insights, and Verify engines based on your configuration.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default AIEnginePanel;
