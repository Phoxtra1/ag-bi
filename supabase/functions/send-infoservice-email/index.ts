import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const cors={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS"};
Deno.serve(async(req)=>{
 if(req.method==="OPTIONS")return new Response("ok",{headers:cors});
 try{
  const auth=req.headers.get("Authorization")||"";
  const client=createClient(Deno.env.get("SUPABASE_URL")!,Deno.env.get("SUPABASE_ANON_KEY")!,{global:{headers:{Authorization:auth}}});
  const {data:{user},error:userError}=await client.auth.getUser();if(userError||!user)throw new Error("Sign in required.");
  const {data:role}=await client.from("user_roles").select("role").eq("user_id",user.id).in("role",["admin","reviewer","support"]).maybeSingle();
  if(!role)throw new Error("Staff access required.");
  const {request_id,subject,body}=await req.json();if(!request_id||!subject?.trim()||!body?.trim())throw new Error("Request, subject and message are required.");
  const admin=createClient(Deno.env.get("SUPABASE_URL")!,Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const {data:request,error}=await admin.from("infoservice_requests").select("id,email").eq("id",request_id).single();if(error||!request)throw new Error("InfoService request not found.");
  const apiKey=Deno.env.get("RESEND_API_KEY"),from=Deno.env.get("RESEND_FROM_EMAIL");if(!apiKey||!from)throw new Error("Email delivery is not configured. Add RESEND_API_KEY and RESEND_FROM_EMAIL.");
  const response=await fetch("https://api.resend.com/emails",{method:"POST",headers:{"Authorization":"Bearer "+apiKey,"Content-Type":"application/json"},body:JSON.stringify({from,to:[request.email],subject,text:body})});
  const result=await response.json();if(!response.ok)throw new Error(result.message||"Email could not be sent.");
  const {error:logError}=await admin.from("infoservice_messages").insert({request_id,recipient_email:request.email,subject,body,sent_by:user.id,provider_message_id:result.id});if(logError)throw logError;
  return new Response(JSON.stringify({sent:true,id:result.id}),{headers:{...cors,"Content-Type":"application/json"}});
 }catch(e){return new Response(JSON.stringify({error:e.message||"Email send failed."}),{status:400,headers:{...cors,"Content-Type":"application/json"}});}
});