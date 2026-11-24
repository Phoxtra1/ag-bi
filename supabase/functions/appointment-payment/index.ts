import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const cors={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS"};
Deno.serve(async(req)=>{
 if(req.method==="OPTIONS")return new Response("ok",{headers:cors});
 try{
  const {appointment_id}=await req.json();
  const supabase=createClient(Deno.env.get("SUPABASE_URL")!,Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const {data:a,error}=await supabase.from("appointments").select("*").eq("id",appointment_id).single();
  if(error||!a)throw new Error("Appointment not found.");
  if(a.booking_type!=="consultation"||Number(a.amount)<=0)throw new Error("Payment is not required for this appointment.");
  if(a.payment_status==="paid")throw new Error("This appointment has already been paid.");
  const secret=Deno.env.get("PAYSTACK_SECRET_KEY");if(!secret)throw new Error("Paystack is not configured. Please contact Amineva Global.");
  const reference="AGIS-"+a.id.replaceAll("-","").toUpperCase()+"-"+crypto.randomUUID().slice(0,8);
  const siteUrl=Deno.env.get("SITE_URL");
  const callbackUrl=Deno.env.get("PAYSTACK_CALLBACK_URL")||(siteUrl?siteUrl.replace(/\\/$/,"")+"/booking?payment=return":undefined);
  const response=await fetch("https://api.paystack.co/transaction/initialize",{method:"POST",headers:{"Authorization":"Bearer "+secret,"Content-Type":"application/json"},body:JSON.stringify({email:a.email,amount:Math.round(Number(a.amount)*100),currency:"USD",reference,callback_url:callbackUrl,metadata:{appointment_id:a.id,booking_type:a.booking_type,duration_minutes:a.duration_minutes}})});
  const payload=await response.json();if(!response.ok||!payload.status)throw new Error(payload.message||"Could not initialize Paystack payment.");
  const {error:updateError}=await supabase.from("appointments").update({payment_reference:reference,payment_status:"pending"}).eq("id",a.id);if(updateError)throw updateError;
  return new Response(JSON.stringify({checkout_url:payload.data.authorization_url,reference}),{headers:{...cors,"Content-Type":"application/json"}});
 }catch(e){return new Response(JSON.stringify({error:e.message||"Payment initialization failed."}),{status:400,headers:{...cors,"Content-Type":"application/json"}});}
});