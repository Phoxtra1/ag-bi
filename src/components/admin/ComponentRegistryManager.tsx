import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  Save, 
  Trash2, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Settings2,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { databases, DATABASE_ID } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';
import { saveWithConfirmation, validateEndpoint, updateAPIHealth } from '@/lib/realTimeSync';

interface ComponentModule {
  $id?: string;
  name: string;
  display_name: string;
  description: string;
  category: string;
  icon: string;
  endpoint: string;
  external_endpoint?: string;
  external_api_key?: string;
  input_format: string;
  output_format: string;
  api_type: 'internal' | 'external';
  enabled: boolean;
  permissions: string[];
  display_order: number;
}

const COLLECTION_ID = 'component_registry';

const defaultModule: ComponentModule = {
  name: '',
  display_name: '',
  description: '',
  category: 'general',
  icon: 'Zap',
  endpoint: '',
  external_endpoint: '',
  external_api_key: '',
  input_format: '{}',
  output_format: '{}',
  api_type: 'internal',
  enabled: true,
  permissions: [],
  display_order: 0
};

const ComponentRegistryManager: React.FC = () => {
  const { toast } = useToast();
  const [modules, setModules] = useState<ComponentModule[]>([]);
  const [selectedModule, setSelectedModule] = useState<ComponentModule | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState<string | null>(null);

  useEffect(() => {
    loadModules();
  }, []);

  const loadModules = async () => {
    setLoading(true);
    try {
      const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
        Query.orderAsc('display_order')
      ]);
      
      setModules(response.documents as unknown as ComponentModule[]);
    } catch (error: any) {
      console.error('Failed to load modules:', error);
      // Initialize with default modules if collection doesn't exist
      setModules(getDefaultModules());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultModules = (): ComponentModule[] => [
    {
      name: 'odeneho_chatbot',
      display_name: 'Odeneho AI',
      description: 'Intelligent AI assistant for media insights',
      category: 'ai',
      icon: 'Bot',
      endpoint: 'amniva-odeneho-engine',
      api_type: 'internal',
      enabled: true,
      permissions: [],
      display_order: 1,
      input_format: '{"message": "string"}',
      output_format: '{"responseText": "string", "metadata": "object"}'
    },
    {
      name: 'prediction',
      display_name: 'Prediction Engine',
      description: 'AI-powered predictive analytics',
      category: 'analysis',
      icon: 'TrendingUp',
      endpoint: 'amniva-prediction-engine',
      api_type: 'internal',
      enabled: true,
      permissions: [],
      display_order: 2,
      input_format: '{"context": "string", "timeframe": "string", "category": "string"}',
      output_format: '{"prediction_text": "string", "confidence_score": "number"}'
    },
    {
      name: 'verify',
      display_name: 'Verify Engine',
      description: 'Fact-checking and content verification',
      category: 'analysis',
      icon: 'Shield',
      endpoint: 'amniva-verify-engine',
      api_type: 'internal',
      enabled: true,
      permissions: [],
      display_order: 3,
      input_format: '{"text": "string", "sources": "array"}',
      output_format: '{"verdict": "string", "confidence_score": "number"}'
    },
    {
      name: 'report',
      display_name: 'Report Engine',
      description: 'Comprehensive insight reports',
      category: 'reporting',
      icon: 'FileText',
      endpoint: 'amniva-report-engine',
      api_type: 'internal',
      enabled: true,
      permissions: [],
      display_order: 4,
      input_format: '{"contentId": "string", "metrics": "array"}',
      output_format: '{"summary": "string", "metrics": "object", "insights": "array"}'
    },
    {
      name: 'trending',
      display_name: 'Trending Engine',
      description: 'Real-time trend analysis',
      category: 'analysis',
      icon: 'Activity',
      endpoint: 'amniva-trending-engine',
      api_type: 'internal',
      enabled: true,
      permissions: [],
      display_order: 5,
      input_format: '{"category": "string", "region": "string", "timeRange": "string"}',
      output_format: '{"trending": "array", "emerging": "array"}'
    }
  ];

  const saveModule = async (module: ComponentModule) => {
    setSaving(true);
    try {
      const dataToSave = {
        name: module.name,
        display_name: module.display_name,
        description: module.description,
        category: module.category,
        icon: module.icon,
        endpoint: module.endpoint,
        external_endpoint: module.external_endpoint || '',
        external_api_key: module.external_api_key || '',
        input_format: module.input_format,
        output_format: module.output_format,
        api_type: module.api_type,
        enabled: module.enabled,
        permissions: module.permissions,
        display_order: module.display_order
      };

      const result = await saveWithConfirmation(COLLECTION_ID, dataToSave, module.$id);

      if (result.success) {
        toast({
          title: 'Module Saved',
          description: `${module.display_name} configuration saved successfully.`
        });
        loadModules();
        setSelectedModule(null);
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        title: 'Save Failed',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const deleteModule = async (moduleId: string) => {
    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, moduleId);
      toast({
        title: 'Module Deleted',
        description: 'Module removed from registry.'
      });
      loadModules();
    } catch (error: any) {
      toast({
        title: 'Delete Failed',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const testEndpoint = async (module: ComponentModule) => {
    setTesting(module.name);
    try {
      const endpoint = module.api_type === 'external' && module.external_endpoint
        ? module.external_endpoint
        : `https://nyc.cloud.appwrite.io/v1/functions/${module.endpoint}`;

      const result = await validateEndpoint(endpoint, module.external_api_key);
      
      await updateAPIHealth(
        module.name,
        result.reachable ? 'active' : 'offline',
        result.responseTime,
        endpoint,
        result.error
      );

      toast({
        title: result.reachable ? 'Connection Successful' : 'Connection Failed',
        description: result.reachable 
          ? `${module.display_name} responded in ${result.responseTime}ms`
          : result.error,
        variant: result.reachable ? 'default' : 'destructive'
      });
    } catch (error: any) {
      toast({
        title: 'Test Failed',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setTesting(null);
    }
  };

  const initializeDefaultModules = async () => {
    setLoading(true);
    try {
      const defaults = getDefaultModules();
      for (const module of defaults) {
        await saveWithConfirmation(COLLECTION_ID, module);
      }
      toast({
        title: 'Modules Initialized',
        description: 'Default engine modules have been created.'
      });
      loadModules();
    } catch (error: any) {
      toast({
        title: 'Initialization Failed',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings2 className="w-5 h-5" />
                Component Registry
              </CardTitle>
              <CardDescription>
                Manage engine modules, endpoints, and API configurations
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={loadModules}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              {modules.length === 0 && (
                <Button onClick={initializeDefaultModules}>
                  <Zap className="w-4 h-4 mr-2" />
                  Initialize Defaults
                </Button>
              )}
              <Button onClick={() => setSelectedModule({ ...defaultModule })}>
                <Plus className="w-4 h-4 mr-2" />
                Add Module
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {modules.map((module) => (
              <div
                key={module.$id || module.name}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    module.enabled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium">{module.display_name}</h4>
                    <p className="text-sm text-muted-foreground">{module.description}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant={module.api_type === 'internal' ? 'default' : 'secondary'}>
                        {module.api_type}
                      </Badge>
                      <Badge variant={module.enabled ? 'default' : 'outline'}>
                        {module.enabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                      <Badge variant="outline">{module.category}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => testEndpoint(module)}
                    disabled={testing === module.name}
                  >
                    {testing === module.name ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                    Test
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedModule(module)}
                  >
                    Edit
                  </Button>
                  {module.$id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteModule(module.$id!)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      {selectedModule && (
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedModule.$id ? 'Edit Module' : 'Add New Module'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Module Name (unique)</Label>
                <Input
                  value={selectedModule.name}
                  onChange={(e) => setSelectedModule({ ...selectedModule, name: e.target.value })}
                  placeholder="e.g., prediction"
                />
              </div>
              <div>
                <Label>Display Name</Label>
                <Input
                  value={selectedModule.display_name}
                  onChange={(e) => setSelectedModule({ ...selectedModule, display_name: e.target.value })}
                  placeholder="e.g., Prediction Engine"
                />
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={selectedModule.description}
                onChange={(e) => setSelectedModule({ ...selectedModule, description: e.target.value })}
                placeholder="Brief description of the module"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Category</Label>
                <Select
                  value={selectedModule.category}
                  onValueChange={(v) => setSelectedModule({ ...selectedModule, category: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ai">AI</SelectItem>
                    <SelectItem value="analysis">Analysis</SelectItem>
                    <SelectItem value="reporting">Reporting</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>API Type</Label>
                <Select
                  value={selectedModule.api_type}
                  onValueChange={(v: 'internal' | 'external') => setSelectedModule({ ...selectedModule, api_type: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="internal">Internal</SelectItem>
                    <SelectItem value="external">External</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Display Order</Label>
                <Input
                  type="number"
                  value={selectedModule.display_order}
                  onChange={(e) => setSelectedModule({ ...selectedModule, display_order: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div>
              <Label>Internal Function Endpoint</Label>
              <Input
                value={selectedModule.endpoint}
                onChange={(e) => setSelectedModule({ ...selectedModule, endpoint: e.target.value })}
                placeholder="e.g., amniva-prediction-engine"
              />
            </div>

            {selectedModule.api_type === 'external' && (
              <div className="space-y-4 p-4 border rounded-lg bg-accent/20">
                <h4 className="font-medium">External API Configuration</h4>
                <div>
                  <Label>External API URL</Label>
                  <Input
                    value={selectedModule.external_endpoint || ''}
                    onChange={(e) => setSelectedModule({ ...selectedModule, external_endpoint: e.target.value })}
                    placeholder="https://api.example.com/endpoint"
                  />
                </div>
                <div>
                  <Label>API Key</Label>
                  <Input
                    type="password"
                    value={selectedModule.external_api_key || ''}
                    onChange={(e) => setSelectedModule({ ...selectedModule, external_api_key: e.target.value })}
                    placeholder="Enter API key"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Input Format (JSON)</Label>
                <Textarea
                  value={selectedModule.input_format}
                  onChange={(e) => setSelectedModule({ ...selectedModule, input_format: e.target.value })}
                  className="font-mono text-sm"
                />
              </div>
              <div>
                <Label>Output Format (JSON)</Label>
                <Textarea
                  value={selectedModule.output_format}
                  onChange={(e) => setSelectedModule({ ...selectedModule, output_format: e.target.value })}
                  className="font-mono text-sm"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Switch
                checked={selectedModule.enabled}
                onCheckedChange={(checked) => setSelectedModule({ ...selectedModule, enabled: checked })}
              />
              <Label>Module Enabled</Label>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedModule(null)}>
                Cancel
              </Button>
              <Button onClick={() => saveModule(selectedModule)} disabled={saving}>
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Module
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ComponentRegistryManager;
