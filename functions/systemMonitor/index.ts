import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface HealthCheckResult {
  module: string;
  status: 'active' | 'delayed' | 'offline';
  responseTime: number;
  lastCheck: string;
  error?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    console.log('[systemMonitor] Starting health checks...');

    // Fetch all enabled components
    const { data: components, error: componentsError } = await supabase
      .from('component_registry')
      .select('*')
      .eq('enabled', true);

    if (componentsError) {
      throw componentsError;
    }

    const healthResults: HealthCheckResult[] = [];
    const timestamp = new Date().toISOString();

    // Check each component
    for (const component of components) {
      const startTime = Date.now();
      let status: 'active' | 'delayed' | 'offline' = 'offline';
      let error = '';

      try {
        if (component.api_type === 'external' && component.external_api_url) {
          // Check external API
          const response = await fetch(component.external_api_url, {
            method: 'GET',
            headers: {
              'Authorization': component.external_api_key ? `Bearer ${component.external_api_key}` : '',
            },
            signal: AbortSignal.timeout(10000), // 10s timeout
          });

          const responseTime = Date.now() - startTime;

          if (response.ok) {
            status = responseTime < 2000 ? 'active' : 'delayed';
          } else {
            status = 'offline';
            error = `HTTP ${response.status}`;
          }
        } else {
          // Check internal function (ping test)
          const response = await supabase.functions.invoke(component.endpoint, {
            body: { health_check: true },
          });

          const responseTime = Date.now() - startTime;

          if (!response.error) {
            status = responseTime < 2000 ? 'active' : 'delayed';
          } else {
            status = 'offline';
            error = response.error.message;
          }
        }
      } catch (err: any) {
        status = 'offline';
        error = err.message || 'Connection timeout';
      }

      const responseTime = Date.now() - startTime;

      healthResults.push({
        module: component.name,
        status,
        responseTime,
        lastCheck: timestamp,
        error: error || undefined,
      });

      // Update api_health table
      await supabase.from('api_health').upsert({
        module_name: component.name,
        status,
        response_time_ms: responseTime,
        last_check: timestamp,
        error_message: error || null,
        endpoint: component.api_type === 'external' ? component.external_api_url : component.endpoint,
      }, { onConflict: 'module_name' });
    }

    // Calculate overall system health metrics
    const totalModules = healthResults.length;
    const activeModules = healthResults.filter(r => r.status === 'active').length;
    const offlineModules = healthResults.filter(r => r.status === 'offline').length;
    const avgResponseTime = healthResults.reduce((sum, r) => sum + r.responseTime, 0) / totalModules;

    // Store system health metrics
    await supabase.from('system_health').insert({
      timestamp,
      total_modules: totalModules,
      active_modules: activeModules,
      offline_modules: offlineModules,
      avg_response_time_ms: avgResponseTime,
      health_score: (activeModules / totalModules) * 100,
      details: healthResults,
    });

    console.log('[systemMonitor] Health check complete:', {
      totalModules,
      activeModules,
      offlineModules,
    });

    // Alert on critical failures (more than 50% offline)
    if (offlineModules > totalModules / 2) {
      console.error('[systemMonitor] CRITICAL: More than 50% of modules are offline!');
      // TODO: Send admin notification
    }

    return new Response(JSON.stringify({
      success: true,
      timestamp,
      summary: {
        totalModules,
        activeModules,
        offlineModules,
        avgResponseTime,
        healthScore: (activeModules / totalModules) * 100,
      },
      details: healthResults,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('[systemMonitor] Fatal error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
