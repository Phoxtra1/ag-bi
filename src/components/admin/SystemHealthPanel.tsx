import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Activity, 
  CheckCircle, 
  XCircle, 
  Clock, 
  RefreshCw,
  AlertTriangle,
  TrendingUp,
  Server
} from 'lucide-react';
import { functions } from '@/lib/appwrite';

interface HealthStatus {
  module: string;
  status: 'active' | 'delayed' | 'offline';
  responseTime: number;
  lastCheck: string;
  error?: string;
}

interface SystemHealth {
  totalModules: number;
  activeModules: number;
  offlineModules: number;
  avgResponseTime: number;
  healthScore: number;
}

const SystemHealthPanel: React.FC = () => {
  const [healthData, setHealthData] = useState<HealthStatus[]>([]);
  const [summary, setSummary] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkHealth();
    
    // Auto-refresh every 2 minutes
    const interval = setInterval(() => {
      checkHealth();
    }, 120000);

    return () => clearInterval(interval);
  }, []);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const response = await functions.createExecution(
        'systemMonitor',
        JSON.stringify({}),
        false
      );

      if (response.responseStatusCode !== 200) {
        throw new Error('Health check failed');
      }

      const result = JSON.parse(response.responseBody);
      
      setHealthData(result.details || []);
      setSummary(result.summary);
      setLastUpdate(new Date());

      // Show warning if health score is low
      if (result.summary.healthScore < 70) {
        toast({
          title: 'System Health Warning',
          description: `Health score: ${result.summary.healthScore.toFixed(0)}% - Some modules may be offline`,
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Health check error:', error);
      toast({
        title: 'Health Check Failed',
        description: error.message || 'Unable to fetch system health',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'delayed':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'offline':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; className: string }> = {
      active: { variant: 'default', className: 'bg-green-100 text-green-800 border-green-200' },
      delayed: { variant: 'default', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      offline: { variant: 'default', className: 'bg-red-100 text-red-800 border-red-200' },
    };

    const config = variants[status] || variants.active;

    return (
      <Badge variant="outline" className={config.className}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const formatResponseTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Health Score</p>
                  <p className={`text-2xl font-bold ${getHealthScoreColor(summary.healthScore)}`}>
                    {summary.healthScore.toFixed(0)}%
                  </p>
                </div>
                <Activity className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Modules</p>
                  <p className="text-2xl font-bold text-green-600">
                    {summary.activeModules}/{summary.totalModules}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Offline</p>
                  <p className="text-2xl font-bold text-red-600">{summary.offlineModules}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Response</p>
                  <p className="text-2xl font-bold">{formatResponseTime(summary.avgResponseTime)}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Module Status Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5" />
                Module Health Status
              </CardTitle>
              <CardDescription>
                Real-time status of all engine modules
                {lastUpdate && ` • Last checked: ${lastUpdate.toLocaleTimeString()}`}
              </CardDescription>
            </div>
            <Button 
              onClick={checkHealth} 
              disabled={loading}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading && healthData.length === 0 ? (
            <div className="flex items-center justify-center p-8">
              <RefreshCw className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-3">
              {healthData.map((item) => (
                <Card key={item.module} className="border-l-4" style={{
                  borderLeftColor: item.status === 'active' ? '#22c55e' : item.status === 'delayed' ? '#eab308' : '#ef4444'
                }}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        {getStatusIcon(item.status)}
                        <div>
                          <h4 className="font-semibold">{item.module}</h4>
                          {item.error && (
                            <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                              <AlertTriangle className="w-3 h-3" />
                              {item.error}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Response Time</p>
                          <p className="text-sm font-medium">{formatResponseTime(item.responseTime)}</p>
                        </div>
                        {getStatusBadge(item.status)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {healthData.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Server className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No health data available</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemHealthPanel;
