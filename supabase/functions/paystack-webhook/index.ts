import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
Deno.serve(async(req)=>{
 const secret=Deno.env.get("PAYSTACK_SECRET_KEY")||"",raw=await req.text(),signature=req.headers.get("x-paystack-signature")||"";
 const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(secret),{name:"HMAC",hash:"SHA-512"},false,["sign"]);
 const mac=await crypto.subtle.sign("HMAC",key,new TextEncoder().encode(raw));
 const expected=[...new Uint8Array(mac)].map(x=>x.toString(16).padStart(2,"0")).join("");
 if(!secret||signature!==expected)return new Response("Invalid signature",{status:401});
 const event=JSON.parse(raw);if(event.event!=="charge.success")return new Response("Ignored");
 const data=event.data;if(data.status!=="success")return new Response("Payment not successful",{status:400});
 const supabase=createClient(Deno.env.get("SUPABASE_URL")!,Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
 const {data:a,error}=await supabase.from("appointments").select("id").eq("payment_reference",data.reference).single();
 if(error||!a)return new Response("Appointment not found",{status:404});
 const {error:updateError}=await supabase.from("appointments").update({payment_status:"paid",status:"confirmed",updated_at:new Date().toISOString()}).eq("id",a.id);
 if(updateError)return new Response("Could not confirm payment",{status:500});
 const siteUrl=Deno.env.get("SUPABASE_URL")!;
 const serviceKey=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
 const {data:appointment}=await supabase.from("appointments").select("id,email").eq("id",a.id).single();
 if(appointment){
  try{await fetch(siteUrl+"/functions/v1/appointment-notifications",{method:"POST",headers:{"Authorization":"Bearer "+serviceKey,"Content-Type":"application/json"},body:JSON.stringify({action:"confirmation",appointment_id:appointment.id,email:appointment.email})});}catch(error){console.error("Paid appointment confirmation email failed",error);}
 }
 return new Response("OK");
});