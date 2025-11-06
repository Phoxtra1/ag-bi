import { useState } from 'react';
import { executeModule, ModuleResponse } from '@/lib/moduleRegistry';
import { useToast } from '@/hooks/use-toast';

interface UseModuleExecutionOptions {
  onSuccess?: (result: ModuleResponse) => void;
  onError?: (error: Error) => void;
}

export function useModuleExecution(options?: UseModuleExecutionOptions) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<ModuleResponse | null>(null);
  const { toast } = useToast();

  const execute = async <T = any>(moduleName: string, input: any): Promise<ModuleResponse<T> | null> => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await executeModule<T>(moduleName, input);
      
      setResult(response);
      
      toast({
        title: 'Module Executed',
        description: `${moduleName} completed successfully in ${response.processing_time_ms}ms`,
      });

      options?.onSuccess?.(response);
      
      return response;
    } catch (err: any) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      
      toast({
        title: 'Execution Failed',
        description: error.message || `Failed to execute ${moduleName}`,
        variant: 'destructive',
      });

      options?.onError?.(error);
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    execute,
    loading,
    error,
    result,
  };
}
