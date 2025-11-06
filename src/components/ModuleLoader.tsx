import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Zap, Brain, Shield, FileText, TrendingUp, MessageSquare } from 'lucide-react';
import { fetchUserModules, ModuleInfo } from '@/lib/moduleRegistry';
import { useToast } from '@/hooks/use-toast';

interface ModuleLoaderProps {
  onModuleClick?: (module: ModuleInfo) => void;
  category?: string;
}

const iconMap: Record<string, React.ReactNode> = {
  'message-square': <MessageSquare className="w-6 h-6" />,
  'brain': <Brain className="w-6 h-6" />,
  'shield': <Shield className="w-6 h-6" />,
  'file-text': <FileText className="w-6 h-6" />,
  'trending-up': <TrendingUp className="w-6 h-6" />,
  'zap': <Zap className="w-6 h-6" />,
};

const ModuleLoader: React.FC<ModuleLoaderProps> = ({ onModuleClick, category }) => {
  const [modules, setModules] = useState<ModuleInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadModules();
  }, []);

  const loadModules = async () => {
    setLoading(true);
    try {
      const userModules = await fetchUserModules();
      
      // Filter by category if provided
      const filtered = category 
        ? userModules.filter(m => m.category === category)
        : userModules;
      
      setModules(filtered);
      
      toast({
        title: 'Modules Loaded',
        description: `${filtered.length} module${filtered.length !== 1 ? 's' : ''} available`,
      });
    } catch (error: any) {
      console.error('Failed to load modules:', error);
      toast({
        title: 'Load Failed',
        description: error.message || 'Unable to load modules',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (modules.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No modules available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {modules.map((module) => (
        <Card 
          key={module.id}
          className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-primary"
          onClick={() => onModuleClick?.(module)}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  {iconMap[module.icon] || <Zap className="w-6 h-6" />}
                </div>
                <div>
                  <CardTitle className="text-lg">{module.displayName}</CardTitle>
                  <Badge variant="secondary" className="mt-1">{module.category}</Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">{module.description}</CardDescription>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{module.apiType === 'external' ? 'External API' : 'Internal'}</span>
              <Badge variant="outline" className="text-green-600 border-green-600">Active</Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ModuleLoader;
