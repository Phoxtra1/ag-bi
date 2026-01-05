import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ENGINE_CONFIG, EngineType } from '@/lib/appwriteEngines';
import { fetchEngineConfig, upsertEngineConfig } from '@/lib/engineSettings';
import { Shield, Save, LinkIcon, KeyRound } from 'lucide-react';

interface EngineLocalState {
  $id?: string;
  enabled: boolean;
  mode: 'internal' | 'external' | 'merge';
  confidence_threshold: number;
  external_api_url: string;
  external_api_key: string;
  loading: boolean;
  dirty: boolean;
}

const ENGINES: EngineType[] = ['prediction', 'verify', 'report', 'trending'];

const EngineExternalAPIs: React.FC = () => {
  const { toast } = useToast();
  const [states, setStates] = useState<Record<EngineType, EngineLocalState>>({
    prediction: { enabled: false, mode: 'internal', confidence_threshold: ENGINE_CONFIG.prediction.default_confidence_threshold, external_api_url: ENGINE_CONFIG.prediction.external_api_url, external_api_key: '', loading: true, dirty: false },
    verify: { enabled: false, mode: 'internal', confidence_threshold: ENGINE_CONFIG.verify.default_confidence_threshold, external_api_url: ENGINE_CONFIG.verify.external_api_url, external_api_key: '', loading: true, dirty: false },
    report: { enabled: false, mode: 'internal', confidence_threshold: ENGINE_CONFIG.report.default_confidence_threshold, external_api_url: ENGINE_CONFIG.report.external_api_url, external_api_key: '', loading: true, dirty: false },
    trending: { enabled: false, mode: 'internal', confidence_threshold: ENGINE_CONFIG.trending.default_confidence_threshold, external_api_url: ENGINE_CONFIG.trending.external_api_url, external_api_key: '', loading: true, dirty: false },
  });

  useEffect(() => {
    let mounted = true;
    Promise.all(ENGINES.map(async (engine) => {
      try {
        const cfg = await fetchEngineConfig(engine);
        if (mounted && cfg) {
          setStates(prev => ({
            ...prev,
            [engine]: {
              $id: cfg.$id,
              enabled: cfg.enabled,
              mode: cfg.mode,
              confidence_threshold: cfg.confidence_threshold,
              external_api_url: cfg.external_api_url || (ENGINE_CONFIG as any)[engine].external_api_url,
              external_api_key: cfg.external_api_key || '',
              loading: false,
              dirty: false,
            }
          }));
        } else if (mounted) {
          // Fallback to localStorage if backend config not found
          const ls = localStorage.getItem(`engine-config-${engine}`);
          if (ls) {
            const parsed = JSON.parse(ls);
            setStates(prev => ({
              ...prev,
              [engine]: { ...prev[engine], ...parsed, loading: false, dirty: false }
            }));
          } else {
            // No config yet, use defaults
            setStates(prev => ({
              ...prev,
              [engine]: { ...prev[engine], loading: false }
            }));
          }
        }
      } catch (e) {
        if (mounted) {
          // Fallback to any locally saved state
          const ls = localStorage.getItem(`engine-config-${engine}`);
          if (ls) {
            const parsed = JSON.parse(ls);
            setStates(prev => ({ ...prev, [engine]: { ...prev[engine], ...parsed, loading: false, dirty: false } }));
          } else {
            setStates(prev => ({ ...prev, [engine]: { ...prev[engine], loading: false } }));
          }
        }
      }
    })).catch(() => {});
    return () => { mounted = false; };
  }, []);

  const update = (engine: EngineType, patch: Partial<EngineLocalState>) => {
    setStates(prev => ({
      ...prev,
      [engine]: { ...prev[engine], ...patch, dirty: true }
    }));
  };

  const save = async (engine: EngineType) => {
    const s = states[engine];
    try {
      await upsertEngineConfig(engine, {
        enabled: s.enabled,
        mode: s.mode,
        confidence_threshold: s.confidence_threshold,
        external_api_url: s.external_api_url,
        external_api_key: s.external_api_key,
      });
      // Persist a local shadow copy as a safety net
      localStorage.setItem(`engine-config-${engine}`, JSON.stringify({
        enabled: s.enabled,
        mode: s.mode,
        confidence_threshold: s.confidence_threshold,
        external_api_url: s.external_api_url,
        external_api_key: s.external_api_key,
      }));
      update(engine, { dirty: false });
      toast({ title: 'Saved', description: `${ENGINE_CONFIG[engine].name} configuration saved.` });
    } catch (e: any) {
      toast({ title: 'Save failed', description: e?.message || 'Unable to save configuration', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold">Engine External API Configuration</h3>
        <p className="text-muted-foreground">Connect Prediction, Verify and Report engines to external APIs. Settings are saved to the backend and persist across sessions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ENGINES.map((engine) => {
          const cfg = ENGINE_CONFIG[engine];
          const st = states[engine];
          return (
            <Card key={engine}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  {cfg.name}
                </CardTitle>
                <CardDescription>{cfg.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {st?.loading ? (
                  <p className="text-sm text-muted-foreground">Loading...</p>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Enabled</Label>
                        <p className="text-xs text-muted-foreground">Allow requests to route through this engine</p>
                      </div>
                      <Switch checked={st.enabled} onCheckedChange={(v) => update(engine, { enabled: v })} />
                    </div>

                    <div>
                      <Label>Mode</Label>
                      <Select value={st.mode} onValueChange={(v: any) => update(engine, { mode: v })}>
                        <SelectTrigger className="mt-1"><SelectValue placeholder="Select mode" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="internal">Internal</SelectItem>
                          <SelectItem value="external">External</SelectItem>
                          <SelectItem value="merge">Merge</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor={`${engine}-url`} className="flex items-center gap-2"><LinkIcon className="w-4 h-4" /> External API URL</Label>
                      <Input id={`${engine}-url`} value={st.external_api_url} onChange={(e) => update(engine, { external_api_url: e.target.value })} placeholder={cfg.external_api_url} />
                    </div>

                    <div>
                      <Label htmlFor={`${engine}-key`} className="flex items-center gap-2"><KeyRound className="w-4 h-4" /> External API Key</Label>
                      <Input id={`${engine}-key`} type="password" value={st.external_api_key} onChange={(e) => update(engine, { external_api_key: e.target.value })} placeholder="Paste API key" />
                    </div>

                    <div>
                      <Label htmlFor={`${engine}-conf`}>Confidence threshold</Label>
                      <Input id={`${engine}-conf`} type="number" step="0.01" min={0} max={1} value={st.confidence_threshold} onChange={(e) => update(engine, { confidence_threshold: parseFloat(e.target.value) })} />
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={() => save(engine)} disabled={!st.dirty} className="flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        Save
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default EngineExternalAPIs;
