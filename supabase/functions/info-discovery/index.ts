import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const auth = req.headers.get("Authorization") || "";
  if (!auth.startsWith("Bearer ")) return json({ error: "Sign in to use Info Discovery." }, 401);

  const supabase = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: auth } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return json({ error: "Your session is invalid. Please sign in again." }, 401);

  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");\n  const admin = serviceRoleKey ? createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } }) : null;\n  const engineUrl = Deno.env.get("INFO_DISCOVERY_ENGINE_URL");
  const engineKey = Deno.env.get("INFO_DISCOVERY_ENGINE_KEY");
  if (!engineUrl || !engineKey) {
    return json({ error: "The information research engine has not been configured yet." }, 503);
  }

  try {
    const input = await req.json();
    if (input.action === "discover") {
      const question = String(input.question || "").trim();
      if (question.length < 5) return json({ error: "Enter a more detailed question." }, 400);
      const engineResponse = await fetch(engineUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${engineKey}` },
        body: JSON.stringify({
          action: "discover",
          question,
          context: input.context || null,
          pipeline: ["discover", "analyze_and_assess", "verify", "organize_and_connect", "outcome"],\n          capabilities: ["discover", "analyze", "verify", "assess", "organize", "connect", "produce_outcome"],
          response_format: "review_and_full_report",
        }),
      });
      const engineData = await engineResponse.json().catch(() => ({}));
      if (!engineResponse.ok) return json({ error: engineData.error || "The research engine could not complete this discovery." }, 502);

      const record = {
        user_id: user.id,
        question,
        context: input.context || null,
        title: engineData.title || "Information discovery review",
        preview: engineData.preview || { summary: engineData.summary || "", sections: engineData.sections || [], key_findings: engineData.key_findings || [] },
        full_report: engineData.full_report || engineData.report || null,
        recommendations: engineData.recommendations || [],
        price: engineData.price ?? null,
        currency: engineData.currency || "GHS",
        payment_status: "preview",
      };
      const { data: saved, error: saveError } = await supabase.from("discovery_runs").insert(record).select("id").single();
      if (saveError) return json({ error: "The discovery completed but could not be saved: " + saveError.message }, 500);
      return json({
        run_id: saved.id,
        title: record.title,
        preview: record.preview,
        recommendations: record.recommendations,
        price: record.price,
        currency: record.currency,
      });
    }

    if (input.action === "unlock") {
      const runId = String(input.run_id || "");
      if (!runId) return json({ error: "A discovery reference is required." }, 400);
      const { data: run, error } = await supabase.from("discovery_runs").select("*").eq("id", runId).eq("user_id", user.id).single();
      if (error || !run) return json({ error: "Discovery report not found." }, 404);
      if (run.payment_status === "paid" && run.full_report) {
        return json({ run_id: run.id, full_access: true, report: run.full_report });
      }
      const engineResponse = await fetch(engineUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${engineKey}` },
        body: JSON.stringify({ action: "unlock", run_id: run.id, question: run.question, price: run.price, currency: run.currency, payment_status: run.payment_status }),
      });
      const engineData = await engineResponse.json().catch(() => ({}));
      if (!engineResponse.ok) return json({ error: engineData.error || "Could not start report checkout." }, 502);
      if (engineData.checkout_url) return json({ checkout_url: engineData.checkout_url, run_id: run.id });
      if (engineData.payment_status === "paid" && engineData.report) {
        if (!admin) return json({ error: "Server payment confirmation is not configured." }, 503);\n        const { error: updateError } = await admin.from("discovery_runs").update({ payment_status: "paid", payment_reference: engineData.payment_reference || null, updated_at: new Date().toISOString() }).eq("id", run.id).eq("user_id", user.id);
        if (updateError) return json({ error: "Payment was confirmed but report access could not be updated. Contact support." }, 500);
        return json({ run_id: run.id, full_access: true, report: engineData.report });
      }
      return json({ message: engineData.message || "Payment checkout is not configured yet." }, 409);
    }
    return json({ error: "Unsupported discovery action." }, 400);
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Unexpected discovery error." }, 500);
  }
});
