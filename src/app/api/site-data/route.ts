import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export async function GET() {
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if(!url||!key)return Response.json({content:{},menu:[],images:{}},{headers:{"Cache-Control":"no-store"}});
  const db=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
  const [contentResult,menuResult,imageResult]=await Promise.all([
    db.from("site_content").select("content_key,value").eq("published",true).order("sort_order"),
    db.from("menu_items").select("label,url").eq("visible",true).order("sort_order"),
    db.from("media_assets").select("slot_key,public_url,alt_text").not("slot_key","is",null)
  ]);
  const content=Object.fromEntries((contentResult.data||[]).map(x=>[x.content_key,x.value]));
  const images=Object.fromEntries((imageResult.data||[]).map(x=>[x.slot_key,{url:x.public_url,alt:x.alt_text}]));
  return Response.json({content,menu:menuResult.data||[],images},{headers:{"Cache-Control":"public, max-age=30, stale-while-revalidate=120"}});
}
