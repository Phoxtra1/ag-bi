import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    console.log(`[fetchUserComponents] Fetching components for user: ${user.id}`);

    // Get user role to determine available modules
    const userRole = user.user_metadata?.role || 'user';

    // Fetch all enabled components that user has access to
    const { data: components, error: componentsError } = await supabase
      .from('component_registry')
      .select('*')
      .eq('enabled', true)
      .order('display_order', { ascending: true });

    if (componentsError) {
      throw componentsError;
    }

    // Filter components based on user permissions
    const accessibleComponents = components.filter(component => {
      const requiredPermissions = component.permissions || [];
      return requiredPermissions.length === 0 || requiredPermissions.includes(userRole);
    });

    // Transform to frontend-friendly format
    const modules = accessibleComponents.map(comp => ({
      id: comp.id,
      name: comp.name,
      displayName: comp.display_name,
      description: comp.description,
      category: comp.category,
      icon: comp.icon,
      endpoint: comp.endpoint,
      inputFormat: comp.input_format,
      outputFormat: comp.output_format,
      apiType: comp.api_type,
      enabled: comp.enabled,
    }));

    return new Response(JSON.stringify({
      success: true,
      modules,
      userRole,
      timestamp: new Date().toISOString(),
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('[fetchUserComponents] Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
