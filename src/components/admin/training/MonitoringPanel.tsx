import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  BarChart3,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Filter,
  Download
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as trainingService from '@/lib/training/trainingService';

interface EngineLog {
  id: string;
  engine_type: string;
  endpoint: string;
  mode_used: 'internal' | 'external' | 'merge';
  confidence_score: number;
  processing_time_ms: number;
  timestamp: string;
  success: boolean;
  request_id: string;
  error_message?: string;
  user_feedback?: 'positive' | 'negative';
}

interface PerformanceMetrics {
  engine: string;
  total_requests: number;
  success_rate: number;
  avg_confidence: number;
  avg_response_time: number;
  internal_usage: number;
  external_usage: number;
  merge_usage: number;
}

export const MonitoringPanel: React.FC = () => {
  const { toast } = useToast();
  const [logs, setLogs] = useState<EngineLog[]>([]);
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([]);
  const [selectedEngine, setSelectedEngine] = useState<string>('all');
  const [selectedMode, setSelectedMode] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('24h');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [selectedEngine, selectedMode, timeRange]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [logsData, metricsData] = await Promise.all([
        trainingService.getEngineLogs({
          engine: selectedEngine !== 'all' ? selectedEngine : undefined,
          mode: selectedMode !== 'all' ? selectedMode : undefined,
          timeRange
        }),
        trainingService.getPerformanceMetrics(timeRange)
      ]);

      setLogs(logsData.map(doc => ({
        id: doc.$id,
        engine_type: doc.engine_type,
        endpoint: doc.endpoint || `/amniva/${doc.engine_type}`,
        mode_used: doc.mode_used,
        confidence_score: doc.confidence_score,
        processing_time_ms: doc.processing_time_ms,
        timestamp: doc.timestamp,
        success: doc.success,
        request_id: doc.request_id,
        error_message: doc.error_message,
        user_feedback: doc.user_feedback
      })));
      setMetrics(metricsData);
    } catch (error) {
      toast({
        title: "Failed to fetch data",
        description: "Unable to load monitoring data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const submitFeedback = async (logId: string, feedback: 'positive' | 'negative') => {
    try {
      await trainingService.submitUserFeedback(logId, feedback);
      
      setLogs(logs.map(log => 
        log.id === logId ? { ...log, user_feedback: feedback } : log
      ));

      toast({
        title: "Feedback Submitted",
        description: "Your feedback will help improve the model."
      });
    } catch (error) {
      toast({
        title: "Feedback Failed",
        description: "Unable to submit feedback",
        variant: "destructive"
      });
    }
  };

  const exportLogs = async () => {
    try {
      const exportData = await trainingService.exportLogs({
        engine: selectedEngine !== 'all' ? selectedEngine : undefined,
        mode: selectedMode !== 'all' ? selectedMode : undefined,
        timeRange
      });

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `engine-logs-${timeRange}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Complete",
        description: "Logs have been exported successfully."
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Unable to export logs",
        variant: "destructive"
      });
    }
  };

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'internal': return 'bg-blue-100 text-blue-800';
      case 'external': return 'bg-green-100 text-green-800';
      case 'merge': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  // Initialize with mock data for demonstration
  useEffect(() => {
    setMetrics([
      {
        engine: 'verify',
        total_requests: 1247,
        success_rate: 0.94,
        avg_confidence: 0.87,
        avg_response_time: 245,
        internal_usage: 0.65,
        external_usage: 0.35,
        merge_usage: 0.0
      },
      {
        engine: 'prediction',
        total_requests: 892,
        success_rate: 0.91,
        avg_confidence: 0.79,
        avg_response_time: 312,
        internal_usage: 0.80,
        external_usage: 0.10,
        merge_usage: 0.10
      },
      {
        engine: 'trending',
        total_requests: 2156,
        success_rate: 0.96,
        avg_confidence: 0.83,
        avg_response_time: 189,
        internal_usage: 0.90,
        external_usage: 0.10,
        merge_usage: 0.0
      }
    ]);

    setLogs(Array.from({ length: 20 }, (_, i) => ({
      id: `log-${i}`,
      engine_type: ['verify', 'prediction', 'trending'][i % 3],
      endpoint: `/amniva/${['verify', 'predict', 'trending'][i % 3]}`,
      mode_used: ['internal', 'external', 'merge'][i % 3] as any,
      confidence_score: Math.random() * 0.4 + 0.6,
      processing_time_ms: Math.floor(Math.random() * 400 + 100),
      timestamp: new Date(Date.now() - i * 5 * 60 * 1000).toISOString(),
      success: Math.random() > 0.1,
      request_id: `req-${Date.now()}-${i}`,
      error_message: Math.random() > 0.9 ? 'Connection timeout' : undefined
    })));
  }, []);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Monitoring Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <Select value={selectedEngine} onValueChange={setSelectedEngine}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Engines</SelectItem>
                  <SelectItem value="verify">Verify</SelectItem>
                  <SelectItem value="report">Report</SelectItem>
                  <SelectItem value="prediction">Prediction</SelectItem>
                  <SelectItem value="trending">Trending</SelectItem>
                  <SelectItem value="dipa-ai">Dipa</SelectItem>
                  <SelectItem value="api-engine">API Engine</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={selectedMode} onValueChange={setSelectedMode}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Modes</SelectItem>
                  <SelectItem value="internal">Internal Only</SelectItem>
                  <SelectItem value="external">External Only</SelectItem>
                  <SelectItem value="merge">Merge Mode</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">Last Hour</SelectItem>
                  <SelectItem value="24h">Last 24 Hours</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={fetchData} disabled={loading}>
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
              <Button variant="outline" onClick={exportLogs}>
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Performance Overview
          </CardTitle>
          <CardDescription>
            Engine performance metrics for the selected time period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {metrics.map((metric) => (
              <Card key={metric.engine} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-lg mb-3">{metric.engine.toUpperCase()}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Requests:</span>
                      <span className="font-semibold">{metric.total_requests.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Success Rate:</span>
                      <span className="font-semibold text-green-600">
                        {(metric.success_rate * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Avg Confidence:</span>
                      <span className={`font-semibold ${getConfidenceColor(metric.avg_confidence)}`}>
                        {(metric.avg_confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Response Time:</span>
                      <span className="font-semibold">{formatDuration(metric.avg_response_time)}</span>
                    </div>
                    <div className="mt-3 pt-2 border-t">
                      <div className="text-xs text-gray-500 space-y-1">
                        <div>Internal: {(metric.internal_usage * 100).toFixed(0)}%</div>
                        <div>External: {(metric.external_usage * 100).toFixed(0)}%</div>
                        {metric.merge_usage > 0 && (
                          <div>Merge: {(metric.merge_usage * 100).toFixed(0)}%</div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Recent Activity Logs
          </CardTitle>
          <CardDescription>
            Real-time engine request logs with feedback capability
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Engine</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Response Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Feedback</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-sm">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{log.engine_type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getModeColor(log.mode_used)}>
                        {log.mode_used}
                      </Badge>
                    </TableCell>
                    <TableCell className={getConfidenceColor(log.confidence_score)}>
                      {(log.confidence_score * 100).toFixed(1)}%
                    </TableCell>
                    <TableCell>{formatDuration(log.processing_time_ms)}</TableCell>
                    <TableCell>
                      {log.success ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                      )}
                    </TableCell>
                    <TableCell>
                      {log.user_feedback ? (
                        <Badge variant={log.user_feedback === 'positive' ? 'default' : 'destructive'}>
                          {log.user_feedback}
                        </Badge>
                      ) : (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => submitFeedback(log.id, 'positive')}
                          >
                            <TrendingUp className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => submitFeedback(log.id, 'negative')}
                          >
                            <TrendingDown className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};