import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const cors={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, apikey, content-type, x-client-info","Access-Control-Allow-Methods":"POST, OPTIONS"};
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...cors,"Content-Type":"application/json"}});
Deno.serve(async(req)=>{
 if(req.method==="OPTIONS")return new Response("ok",{headers:cors});
 if(req.method!=="POST")return json({error:"Method not allowed"},405);
 try{
  const url=Deno.env.get("SUPABASE_URL")!,anon=Deno.env.get("SUPABASE_ANON_KEY")!,auth=req.headers.get("Authorization")||"";
  if(!auth.startsWith("Bearer "))return json({error:"Sign in to prepare a request brief."},401);
  const client=createClient(url,anon,{global:{headers:{Authorization:auth}},auth:{persistSession:false,autoRefreshToken:false}});
  const {data:{user},error}=await client.auth.getUser();if(error||!user)return json({error:"Your session is invalid."},401);
  const key=Deno.env.get("LOVABLE_API_KEY");if(!key)return json({error:"AI Gateway is not configured. Add LOVABLE_API_KEY."},503);
  const input=await req.json();const details=String(input.request_details||"").trim();
  if(details.length<20)return json({error:"Describe the support you need in at least 20 characters."},400);
  const prompt=`Create a concise, practical service-intake brief from the customer's request. Do not perform the research itself and do not invent facts. Return JSON only with: title, objective, scope, information_needed (string), assumptions_or_gaps (string), next_steps (array of 3-5 strings). Use neutral language, distinguish customer-provided facts from unknowns, and make next steps actionable. Service area: ${String(input.category||"")}. Request type: ${String(input.request_type||"not specified")}. Short description: ${String(input.request_summary||"not supplied")}. Customer description: ${details}`;
  const response=await fetch("https://ai.gateway.lovable.dev/v1/chat/completions",{method:"POST",headers:{"Authorization":`Bearer ${key}`,"Content-Type":"application/json"},body:JSON.stringify({model:"google/gemini-2.5-flash",temperature:0.2,response_format:{type:"json_object"},messages:[{role:"system",content:"You are an information-service intake analyst. Never expose chain of thought. Output valid JSON only."},{role:"user",content:prompt}]})});
  const data=await response.json().catch(()=>({}));if(!response.ok)return json({error:data.error?.message||"AI Gateway could not prepare the brief."},response.status===429||response.status===402?response.status:502);
  const raw=data.choices?.[0]?.message?.content;const brief=typeof raw==="string"?JSON.parse(raw):raw;
  if(!brief?.objective||!Array.isArray(brief.next_steps))return json({error:"AI Gateway returned an incomplete brief. Try again."},502);
  return json(brief);
 }catch(e){return json({error:e instanceof Error?e.message:"Could not prepare the request brief."},500);}
});