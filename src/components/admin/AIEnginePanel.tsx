import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Bot, 
  Settings, 
  Activity, 
  Database, 
  Brain,
  Zap,
  BarChart3,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Play,
  Save,
  RotateCcw,
  Upload,
  Download,
  Eye,
  TrendingUp,
  Shield
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EngineStatus {
  id: string;
  name: string;
  type: 'verify' | 'report' | 'prediction' | 'trending';
  mode: 'internal' | 'external' | 'merge';
  enabled: boolean;
  confidence_threshold: number;
  last_updated: string;
  status: 'active' | 'inactive' | 'error';
  performance_metrics: {
    requests_today: number;
    avg_confidence: number;
    success_rate: number;
    avg_response_time: number;
  };
}

const AIEnginePanel = () => {
  const { toast } = useToast();
  const [engines, setEngines] = useState<EngineStatus[]>([
    {
      id: 'verify',
      name: 'Verification Engine',
      type: 'verify',
      mode: 'external',
      enabled: false,
      confidence_threshold: 0.75,
      last_updated: new Date().toISOString(),
      status: 'inactive',
      performance_metrics: {
        requests_today: 45,
        avg_confidence: 0.82,
        success_rate: 0.94,
        avg_response_time: 245
      }
    },
    {
      id: 'prediction',
      name: 'Forecast Engine',
      type: 'prediction',
      mode: 'internal',
      enabled: true,
      confidence_threshold: 0.65,
      last_updated: new Date().toISOString(),
      status: 'active',
      performance_metrics: {
        requests_today: 78,
        avg_confidence: 0.76,
        success_rate: 0.89,
        avg_response_time: 312
      }
    },
    {
      id: 'trending',
      name: 'Business Trends Engine',
      type: 'trending',
      mode: 'merge',
      enabled: true,
      confidence_threshold: 0.60,
      last_updated: new Date().toISOString(),
      status: 'active',
      performance_metrics: {
        requests_today: 156,
        avg_confidence: 0.71,
        success_rate: 0.91,
        avg_response_time: 189
      }
    },
    {
      id: 'info',
      name: 'Insight Generation Engine',
      type: 'report',
      mode: 'external',
      enabled: false,
      confidence_threshold: 0.70,
      last_updated: new Date().toISOString(),
      status: 'inactive',
      performance_metrics: {
        requests_today: 23,
        avg_confidence: 0.79,
        success_rate: 0.87,
        avg_response_time: 276
      }
    }
  ]);

  const updateEngine = (id: string, updates: Partial<EngineStatus>) => {
    setEngines(prev => prev.map(engine => 
      engine.id === id ? { ...engine, ...updates, last_updated: new Date().toISOString() } : engine
    ));
    
    toast({
      title: "Engine Updated",
      description: `${id} engine configuration has been updated.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500/10 text-emerald-600';
      case 'inactive': return 'bg-muted text-muted-foreground';
      case 'error': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Prediction Controls</h2>
          <p className="text-muted-foreground">Configure and monitor business intelligence engines</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {engines.map(engine => (
          <Card key={engine.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{engine.name}</CardTitle>
                <Switch
                  checked={engine.enabled}
                  onCheckedChange={(enabled) => updateEngine(engine.id, { enabled, status: enabled ? 'active' : 'inactive' })}
                />
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(engine.status)}>
                  {engine.status}
                </Badge>
                <Badge variant="outline">
                  {engine.mode.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Requests Today:</span>
                  <div className="font-semibold">{engine.performance_metrics.requests_today}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Success Rate:</span>
                  <div className="font-semibold">{Math.round(engine.performance_metrics.success_rate * 100)}%</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Avg Confidence:</span>
                  <div className="font-semibold">{Math.round(engine.performance_metrics.avg_confidence * 100)}%</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Response Time:</span>
                  <div className="font-semibold">{engine.performance_metrics.avg_response_time}ms</div>
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
                    <SelectItem value="merge">Merge Both Sources</SelectItem>
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
            </CardContent>
          </Card>
        ))}
      </div>

      <Alert>
        <Brain className="w-4 h-4" />
        <AlertDescription>
          Business intelligence engines are configured and ready. Use toggles to switch between internal analysis models and external data APIs. 
          The system automatically routes requests based on your settings for verification, insights, and forecasting.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default AIEnginePanel;