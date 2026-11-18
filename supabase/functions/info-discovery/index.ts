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
   {"name":"AgroClimate | Adesua | Inventra | SikaSem | DataLens","reason":"...","url":""}
 ],
 "price":number,
 "currency":"GHS"
}
Do NOT recommend Amineva Suite. It is the company's productivity workspace and is accessed separately from the Amineva Global homepage; it is not a recommendation within Info Discovery. You may recommend the following existing Amineva products only when the user's actual information need is materially related to what that product does: AgroClimate for agriculture, farming, crops, livestock, farm operations and agricultural climate/risk; Adesua for education, learning and career development/exploration; Inventra for inventory, stock and sales operations; SikaSem for mobile money, microfinance, savings, loans and financial operations; DataLens for IT support and web application maintenance. The AI must decide relevance from the complete meaning of the user's search, not from hardcoded keyword rules. Do not recommend a product just because a related word appears in an unrelated question. If none of these products genuinely addresses the need, return an empty recommendations array and simply complete the information report.
Do not invent facts, citations, source URLs, or claim verification that was not performed. Clearly distinguish established information from uncertain or unavailable evidence. The full document should be useful across any industry, not limited to predefined categories. Set a modest pay-as-you-go price appropriate to the scope and length; never require a subscription.
`;


const SENSITIVE_INFO_PROMPT = `
SPECIAL MODE: SENSITIVE INFO.
Act as a careful public-interest and organizational intelligence researcher. Investigate difficult-to-find information that is lawful to access and appropriate to disclose. Prioritize publicly disclosed corporate and institutional ownership, leadership and affiliations; procurement, tenders, contract awards and public expenditure; regulatory notices, sanctions, court judgments, litigation and official investigations; documented governance, compliance and conflict-of-interest concerns; underreported public reports and historical records; and evidence-supported connections among organizations, official acts, contracts and events.
Prefer official registries, courts, regulators, procurement portals, audited filings, parliamentary records and reputable journalism. Cite source titles, publishers, dates and URLs only when genuinely available. Never invent sources, links, quotes, allegations, ownership links or findings. If live records cannot be accessed or a claim cannot be verified, say so clearly and specify which records would be needed. Separate confirmed facts, credible reporting, allegations, inference and unknowns. Include dates and jurisdiction.
Do not expose, infer or facilitate access to private home addresses, personal contact details, credentials, private financial or medical records, personal identifiers, confidential documents, non-public personal data or protected information. Do not profile private individuals. Discuss public officials only in relation to documented official conduct and public duties. Do not present unproven allegations as facts or generate defamatory conclusions.
Structure the report using Discover; Analyze and assess; Verify; Organize and connect; Present the outcome. Include scope, findings and evidence, supported entity relationships, risk indicators, confidence and verification status, gaps requiring further investigation, sources, limitations and balanced conclusions. Explain what is not known as carefully as what is known.
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
      const discoveryMode = input.mode === "sensitive" ? "sensitive" : "general";
      if (question.length < 2) return json({ error: "Enter what you want to discover." }, 400);
      const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${lovableKey}` },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          temperature: 0.2,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: discoveryMode === "sensitive" ? SYSTEM_PROMPT + "\n\n" + SENSITIVE_INFO_PROMPT : SYSTEM_PROMPT },
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

      const productUrls: Record<string, string> = {
        AgroClimate: Deno.env.get("AGROCLIMATE_URL") || "",
        Adesua: Deno.env.get("ADESUA_URL") || "",
        Inventra: Deno.env.get("INVENTRA_URL") || "",
        SikaSem: Deno.env.get("SIKASEM_URL") || "",
        DataLens: Deno.env.get("DATALENS_URL") || "",
      };
      const recommendations = (Array.isArray(generated.recommendations) ? generated.recommendations : [])
        .filter((p: any) => Object.prototype.hasOwnProperty.call(productUrls, p?.name))
        .map((p: any) => ({ name: p.name, reason: String(p.reason || ""), url: productUrls[p.name] }));

      const record = {
        user_id: user.id,
        question,
        context: null,
        discovery_mode: discoveryMode,
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
      return json({ run_id: saved.id, title: record.title, preview: record.preview, recommendations, price: record.price, currency: record.currency, discovery_mode: discoveryMode });
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
