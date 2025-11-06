import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ModuleRequest {
  module: string;
  input: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Verify user session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { module, input }: ModuleRequest = await req.json();
    
    if (!module || !input) {
      return new Response(JSON.stringify({ error: 'Missing module or input' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`[executeModule] User ${user.id} calling module: ${module}`);

    // Fetch module configuration from component_registry
    const { data: registryData, error: registryError } = await supabase
      .from('component_registry')
      .select('*')
      .eq('name', module)
      .eq('enabled', true)
      .single();

    if (registryError || !registryData) {
      console.error('[executeModule] Module not found or disabled:', module);
      return new Response(JSON.stringify({ error: 'Module not found or disabled' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check user permissions
    const userRole = user.user_metadata?.role || 'user';
    const requiredPermissions = registryData.permissions || [];
    
    if (requiredPermissions.length > 0 && !requiredPermissions.includes(userRole)) {
      return new Response(JSON.stringify({ error: 'Insufficient permissions' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const startTime = Date.now();
    let result: any;
    let success = true;
    let errorMessage = '';

    try {
      // Route to appropriate engine based on api_type
      if (registryData.api_type === 'external' && registryData.external_api_url) {
        // Call external API
        const externalResponse = await fetch(registryData.external_api_url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': registryData.external_api_key ? `Bearer ${registryData.external_api_key}` : '',
          },
          body: JSON.stringify(input),
        });

        if (!externalResponse.ok) {
          throw new Error(`External API error: ${externalResponse.status}`);
        }

        result = await externalResponse.json();
      } else {
        // Call internal Appwrite function
        const functionResponse = await supabase.functions.invoke(registryData.endpoint, {
          body: input,
        });

        if (functionResponse.error) {
          throw functionResponse.error;
        }

        result = functionResponse.data;
      }
    } catch (error: any) {
      success = false;
      errorMessage = error.message || 'Unknown error';
      console.error(`[executeModule] Error executing ${module}:`, error);
    }

    const processingTime = Date.now() - startTime;

    // Log interaction
    await supabase.from('interaction_logs').insert({
      user_id: user.id,
      module_name: module,
      request_type: 'execute',
      success,
      error_message: errorMessage || null,
      processing_time_ms: processingTime,
      timestamp: new Date().toISOString(),
      metadata: { input_size: JSON.stringify(input).length },
    });

    if (!success) {
      return new Response(JSON.stringify({ error: errorMessage }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      module,
      data: result,
      processing_time_ms: processingTime,
      timestamp: new Date().toISOString(),
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('[executeModule] Fatal error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
