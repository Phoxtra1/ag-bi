import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useModuleExecution } from '@/hooks/useModuleExecution';
import { ModuleInfo } from '@/lib/moduleRegistry';
import { Loader2, Send, CheckCircle } from 'lucide-react';

interface UniversalModuleInterfaceProps {
  module: ModuleInfo;
  onClose?: () => void;
}

const UniversalModuleInterface: React.FC<UniversalModuleInterfaceProps> = ({ module, onClose }) => {
  const [input, setInput] = useState<any>({});
  const { execute, loading, result } = useModuleExecution();

  const handleInputChange = (field: string, value: any) => {
    setInput((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    await execute(module.name, input);
  };

  const renderInputFields = () => {
    // Dynamic input rendering based on module's input format
    if (!module.inputFormat || typeof module.inputFormat !== 'object') {
      return (
        <div>
          <Label htmlFor="generic-input">Input</Label>
          <Textarea
            id="generic-input"
            placeholder="Enter your input here..."
            value={input.content || ''}
            onChange={(e) => handleInputChange('content', e.target.value)}
            rows={4}
          />
        </div>
      );
    }

    const fields = Object.entries(module.inputFormat);
    
    return fields.map(([fieldName, fieldConfig]: [string, any]) => {
      const isRequired = fieldConfig.required || false;
      const fieldType = fieldConfig.type || 'string';

      if (fieldType === 'text' || fieldType === 'string') {
        if (fieldConfig.multiline) {
          return (
            <div key={fieldName}>
              <Label htmlFor={fieldName}>
                {fieldConfig.label || fieldName}
                {isRequired && <span className="text-red-500">*</span>}
              </Label>
              <Textarea
                id={fieldName}
                placeholder={fieldConfig.placeholder}
                value={input[fieldName] || ''}
                onChange={(e) => handleInputChange(fieldName, e.target.value)}
                rows={4}
              />
            </div>
          );
        }
        return (
          <div key={fieldName}>
            <Label htmlFor={fieldName}>
              {fieldConfig.label || fieldName}
              {isRequired && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={fieldName}
              type="text"
              placeholder={fieldConfig.placeholder}
              value={input[fieldName] || ''}
              onChange={(e) => handleInputChange(fieldName, e.target.value)}
            />
          </div>
        );
      }

      return null;
    });
  };

  const renderOutput = () => {
    if (!result) return null;

    return (
      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <h4 className="font-semibold text-green-900">Result</h4>
          <Badge variant="outline" className="ml-auto">
            {result.processing_time_ms}ms
          </Badge>
        </div>
        <pre className="text-sm bg-white p-3 rounded border overflow-auto max-h-96">
          {JSON.stringify(result.data, null, 2)}
        </pre>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{module.displayName}</CardTitle>
            <CardDescription>{module.description}</CardDescription>
          </div>
          <Badge>{module.category}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {renderInputFields()}

        <div className="flex gap-2 pt-4">
          <Button 
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Execute {module.displayName}
              </>
            )}
          </Button>
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          )}
        </div>

        {renderOutput()}
      </CardContent>
    </Card>
  );
};

export default UniversalModuleInterface;
