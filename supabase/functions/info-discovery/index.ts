import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

const SYSTEM_PROMPT = `
You are the private research and information-discovery engine for Info Solutions by Amineva Global.
The customer enters a question on a universal, cross-industry search page. Do the research and reasoning silently; do not behave like a chatbot and do not expose internal chain-of-thought.
Prepare a structured, useful information document organized under these five pillars:
1. Discover
2. Analyze and assess
3. Verify
4. Organize and connect
5. Present the outcome
Apply all seven capabilities across those pillars: discover, analyze, verify, assess, organize, connect, and produce an outcome.
The customer must initially receive ONLY a brief summary and a short overview. The complete document belongs in full_report and must not be included in preview.
Return valid JSON only with this shape:
{
 "title":"...",
 "summary":"A brief summary, normally 1-3 sentences.",
 "overview":"A concise overview of what the full document will contain and the main direction of the findings.",
 "full_report":{"content":"Complete document with clearly labeled sections for the five pillars, detailed findings, source references/URLs where available, limitations and conclusion."},
 "recommendations":[
   {"name":"Amineva Suite","reason":"...","url":""},
   {"name":"AgroClimate","reason":"...","url":""}
 ],
 "price":number,
 "currency":"GHS"
}
Only recommend Amineva Suite when the question indicates a need that its business workspace/apps can address. Recommend AgroClimate ONLY when the actual subject materially concerns agriculture, farming, crops, livestock, farm operations, agricultural weather, climate impacts on agriculture, or agricultural risk. Do not recommend any other Amineva product. Do not recommend AgroClimate merely because the question mentions weather or climate in an unrelated context. If no product is genuinely relevant, return an empty recommendations array.
Do not invent facts, citations, source URLs, or claim verification that was not performed. Clearly distinguish established information from uncertain or unavailable evidence. The full document should be useful across any industry, not limited to predefined categories. Set a modest pay-as-you-go price appropriate to the scope and length; never require a subscription.
`;

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

  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const admin = serviceRoleKey ? createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } }) : null;
  const lovableKey = Deno.env.get("LOVABLE_API_KEY");
  if (!lovableKey) return json({ error: "Lovable AI is not connected to this Cloud project yet." }, 503);
  if (!admin) return json({ error: "Secure report storage is not configured." }, 503);

  try {
    const input = await req.json();
    if (input.action === "discover") {
      const question = String(input.question || "").trim();
      if (question.length < 2) return json({ error: "Enter what you want to discover." }, 400);
      const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${lovableKey}` },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          temperature: 0.2,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: question }
          ]
        }),
      });
      const aiData = await aiResponse.json().catch(() => ({}));
      if (!aiResponse.ok) return json({ error: aiData.error?.message || "Lovable AI could not complete this discovery." }, aiResponse.status === 429 || aiResponse.status === 402 ? aiResponse.status : 502);
      const raw = aiData.choices?.[0]?.message?.content;
      let generated: any;
      try { generated = typeof raw === "string" ? JSON.parse(raw) : raw; }
      catch { return json({ error: "The AI returned an unreadable report. Please try again." }, 502); }
      if (!generated || !generated.full_report) return json({ error: "The AI did not return a complete document. Please try again." }, 502);

      const allowedNames = new Set(["Amineva Suite", "AgroClimate"]);
      const recommendations = (Array.isArray(generated.recommendations) ? generated.recommendations : [])
        .filter((p: any) => allowedNames.has(p?.name))
        .map((p: any) => ({ name: p.name, reason: String(p.reason || ""), url: p.name === "Amineva Suite" ? (Deno.env.get("AMINEVA_SUITE_URL") || "") : (Deno.env.get("AGROCLIMATE_URL") || "") }));

      const record = {
        user_id: user.id,
        question,
        context: null,
        title: String(generated.title || "Information discovery"),
        preview: { summary: String(generated.summary || ""), overview: String(generated.overview || "") },
        recommendations,
        price: Number.isFinite(Number(generated.price)) ? Number(generated.price) : null,
        currency: String(generated.currency || "GHS"),
        payment_status: "preview",
      };
      const { data: saved, error: saveError } = await supabase.from("discovery_runs").insert(record).select("id").single();
      if (saveError) return json({ error: "The discovery completed but could not be saved: " + saveError.message }, 500);
      const { error: privateSaveError } = await admin.from("discovery_report_private").insert({ discovery_run_id: saved.id, user_id: user.id, full_report: generated.full_report });
      if (privateSaveError) {
        await supabase.from("discovery_runs").delete().eq("id", saved.id).eq("user_id", user.id);
        return json({ error: "The full document could not be stored securely: " + privateSaveError.message }, 500);
      }
      return json({ run_id: saved.id, title: record.title, preview: record.preview, recommendations, price: record.price, currency: record.currency });
    }

    if (input.action === "unlock") {
      const runId = String(input.run_id || "");
      if (!runId) return json({ error: "A discovery reference is required." }, 400);
      const { data: run, error } = await supabase.from("discovery_runs").select("id,user_id,payment_status,price,currency").eq("id", runId).eq("user_id", user.id).single();
      if (error || !run) return json({ error: "Discovery report not found." }, 404);
      if (run.payment_status !== "paid") return json({ message: "Payment checkout is not connected yet." }, 409);
      const { data: report, error: reportError } = await admin.from("discovery_report_private").select("full_report").eq("discovery_run_id", run.id).eq("user_id", user.id).single();
      if (reportError || !report?.full_report) return json({ error: "The paid document could not be retrieved." }, 404);
      return json({ run_id: run.id, full_access: true, report: report.full_report });
    }
    return json({ error: "Unsupported discovery action." }, 400);
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Unexpected discovery error." }, 500);
  }
});
