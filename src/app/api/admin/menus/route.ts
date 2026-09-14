import { NextRequest } from "next/server";
import { z } from "zod";
import { requireAdmin } from "../../../../lib/admin-auth";
import { createAdminClient } from "../../../../lib/supabase/admin";

const urlPattern = /^(#|\/|https:\/\/)/;
const itemSchema = z.object({ id: z.string().uuid(), label: z.string().trim().min(1).max(80), url: z.string().trim().max(500).refine((url) => urlPattern.test(url), "Use a section, page, or HTTPS URL."), parent_id: z.string().uuid().nullable(), sort_order: z.number().int(), visible: z.boolean() });

export async function POST(request: NextRequest) {
  await requireAdmin(); const body = await request.json(), label = String(body.label || "").trim(), url = String(body.url || "").trim();
  if (!label || !urlPattern.test(url)) return Response.json({ error: "Enter a label and a valid section, page, or HTTPS URL." }, { status: 400 });
  const { data, error } = await createAdminClient().from("menu_items").insert({ label, url, parent_id: null, sort_order: Number(body.sort_order || 0), visible: true, updated_at: new Date().toISOString() }).select("id,label,url,parent_id,sort_order,visible").single();
  return error ? Response.json({ error: error.message }, { status: 500 }) : Response.json({ item: data });
}

export async function PUT(request: NextRequest) {
  await requireAdmin(); const parsed = z.object({ items: z.array(itemSchema).max(100) }).safeParse(await request.json());
  if (!parsed.success) return Response.json({ error: parsed.error.issues[0]?.message || "Invalid menu." }, { status: 400 });
  const ids = new Set(parsed.data.items.map((item) => item.id));
  if (parsed.data.items.some((item) => item.parent_id && (!ids.has(item.parent_id) || parsed.data.items.find((parent) => parent.id === item.parent_id)?.parent_id))) return Response.json({ error: "Submenus can only be nested one level deep." }, { status: 400 });
  const db = createAdminClient(), now = new Date().toISOString();
  for (const item of parsed.data.items) { const { error } = await db.from("menu_items").update({ label: item.label, url: item.url, parent_id: item.parent_id, sort_order: item.sort_order, visible: item.visible, updated_at: now }).eq("id", item.id); if (error) return Response.json({ error: error.message }, { status: 500 }); }
  return Response.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  await requireAdmin(); const id = z.string().uuid().safeParse((await request.json()).id);
  if (!id.success) return Response.json({ error: "Invalid menu item." }, { status: 400 });
  const db = createAdminClient(); const { error: childError } = await db.from("menu_items").update({ parent_id: null }).eq("parent_id", id.data);
  if (childError) return Response.json({ error: childError.message }, { status: 500 });
  const { error } = await db.from("menu_items").delete().eq("id", id.data);
  return error ? Response.json({ error: error.message }, { status: 500 }) : Response.json({ ok: true });
}
