import { createAdminClient } from "../../../lib/supabase/admin";
import { mergeHomepageLayout } from "../../../lib/homepage-sections";

export const dynamic = "force-dynamic";
export async function GET() {
  const db=createAdminClient();
  const [contentResult,menuResult,imageResult]=await Promise.all([
    db.from("site_content").select("content_key,value").eq("published",true).order("sort_order"),
    db.from("menu_items").select("label,url").eq("visible",true).order("sort_order"),
    db.from("media_assets").select("slot_key,public_url,alt_text").not("slot_key","is",null)
  ]);
  const contentRows=contentResult.data||[];
  const layout=mergeHomepageLayout(contentRows.find(x=>x.content_key==="homepage.layout")?.value);
  const content=Object.fromEntries(contentRows.filter(x=>x.content_key!=="homepage.layout").map(x=>[x.content_key,x.value]));
  const images=Object.fromEntries((imageResult.data||[]).map(x=>[x.slot_key,{url:x.public_url,alt:x.alt_text}]));
  return Response.json({content,menu:menuResult.data||[],images,layout},{headers:{"Cache-Control":"no-store"}});
}
