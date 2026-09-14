import { notFound } from "next/navigation";
import { createAdminClient } from "./supabase/admin";
export async function getStaffRecord(id:string){const db=createAdminClient();const {data,error}=await db.from("staff_records").select("*").eq("id",id).maybeSingle();if(error||!data)notFound();let signatureUrl="";if(data.signature_path){const {data:signed}=await db.storage.from("staff-signatures").createSignedUrl(data.signature_path,3600);signatureUrl=signed?.signedUrl||"";}return {...data,record_data:(data.record_data||{}) as Record<string,string|string[]|Record<string,string>[]>,signatureUrl};}
