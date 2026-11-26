import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const cors={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, apikey, content-type, x-client-info","Access-Control-Allow-Methods":"POST, OPTIONS"};
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...cors,"Content-Type":"application/json"}});
const esc=(v:string)=>v.replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]!));
async function sendEmail(to:string,subject:string,html:string){
 const key=Deno.env.get("RESEND_API_KEY"),from=Deno.env.get("RESEND_FROM_EMAIL");if(!key||!from)throw new Error("Email is not configured. Set RESEND_API_KEY and RESEND_FROM_EMAIL.");
 const r=await fetch("https://api.resend.com/emails",{method:"POST",headers:{"Authorization":`Bearer ${key}`,"Content-Type":"application/json"},body:JSON.stringify({from,to:[to],subject,html})});
 const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.message||"Email delivery failed.");return d.id;
}
Deno.serve(async(req)=>{
 if(req.method==="OPTIONS")return new Response("ok",{headers:cors});
 if(req.method!=="POST")return json({error:"Method not allowed"},405);
 try{
  const serviceKey=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,url=Deno.env.get("SUPABASE_URL")!;
  const auth=req.headers.get("Authorization")||"";const input=await req.json();
  const admin=createClient(url,serviceKey,{auth:{persistSession:false,autoRefreshToken:false}});
  if(input.action==="confirmation"){
   const client=createClient(url,Deno.env.get("SUPABASE_ANON_KEY")!,{global:{headers:{Authorization:auth}}});
   const {data:{user}}=await client.auth.getUser();if(!user)return json({error:"Sign in required."},401);
   const {data:a,error}=await admin.from("appointments").select("*,appointment_slots(starts_at,ends_at)").eq("id",input.appointment_id).eq("email",String(input.email||"").toLowerCase()).single();
   if(error||!a)return json({error:"Appointment not found."},404);
   if(a.status!=="confirmed"||a.payment_status==="pending")return json({error:"Appointment is not confirmed yet."},409);
   const when=new Date(a.appointment_slots.starts_at).toLocaleString("en",{dateStyle:"full",timeStyle:"short",timeZone:"UTC"})+" UTC";
   const id=await sendEmail(a.email,"Appointment confirmed — Amineva Global",`<p>Hello ${esc(a.full_name)},</p><p>Your ${esc(a.booking_type==="consultation"?"professional consultation":"request-submission visit")} is confirmed.</p><p><b>Date and time:</b> ${esc(when)}</p><p><b>Reference:</b> ${esc(a.id)}</p><p>We look forward to meeting you.</p><p>Amineva Global · Info Solutions</p>`);
   await admin.from("appointments").update({confirmation_email_sent_at:new Date().toISOString()}).eq("id",a.id);
   return json({sent:true,email_id:id});
  }
  if(input.action==="reminders"){
   if(!serviceKey||auth!=="Bearer "+serviceKey)return json({error:"Unauthorized scheduler request."},401);
   const now=new Date(),from=new Date(now.getTime()+23*60*60*1000).toISOString(),to=new Date(now.getTime()+25*60*60*1000).toISOString();
   const {data:rows,error}=await admin.from("appointments").select("id,full_name,email,booking_type,appointment_slots(starts_at)").eq("status","confirmed").is("reminder_email_sent_at",null).gte("appointment_slots.starts_at",from).lt("appointment_slots.starts_at",to);
   if(error)throw error;let sent=0;
   for(const a of rows||[]){const when=new Date(a.appointment_slots.starts_at).toLocaleString("en",{dateStyle:"full",timeStyle:"short",timeZone:"UTC"})+" UTC";await sendEmail(a.email,"Appointment reminder — Amineva Global",`<p>Hello ${esc(a.full_name)},</p><p>This is a reminder of your appointment scheduled for approximately 24 hours from now.</p><p><b>Date and time:</b> ${esc(when)}</p><p><b>Reference:</b> ${esc(a.id)}</p><p>Amineva Global · Info Solutions</p>`);await admin.from("appointments").update({reminder_email_sent_at:new Date().toISOString()}).eq("id",a.id);sent++;}
   return json({sent});
  }
  return json({error:"Unsupported notification action."},400);
 }catch(e){return json({error:e instanceof Error?e.message:"Notification failed."},500);}
});