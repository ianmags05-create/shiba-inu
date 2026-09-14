import { NextRequest } from "next/server";
import { createAdminClient } from "../../../../lib/supabase/admin";
import { requireAdmin } from "../../../../lib/admin-auth";

const cleanSlug = (value: unknown) => String(value || "").trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
const cleanHtml = (value: unknown) => String(value || "")
  .replace(/<\/?(?:script|style|iframe|object|embed|form)[^>]*>/gi, "")
  .replace(/\son\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
  .replace(/javascript:/gi, "");

export async function POST(request: NextRequest) {
  await requireAdmin();
  const body = await request.json();
  const slug = cleanSlug(body.slug);
  const originalSlug = cleanSlug(body.originalSlug);
  const title = String(body.title || "").trim();
  if (!slug || !title || slug === "admin" || slug === "api") return Response.json({ error: "Enter a valid page title and URL slug." }, { status: 400 });
  const db = createAdminClient();
  if (originalSlug && originalSlug !== slug) {
    const { error } = await db.from("site_content").delete().like("content_key", `page.${originalSlug}.%`);
    if (error) return Response.json({ error: error.message }, { status: 500 });
  }
  const now = new Date().toISOString();
  const published = Boolean(body.published);
  const rows = [
    { content_key: `page.${slug}.title`, label: "Page title", section: `Page: ${slug}`, value: title, content_type: "text", sort_order: 1, published, updated_at: now },
    { content_key: `page.${slug}.content`, label: "Page content", section: `Page: ${slug}`, value: cleanHtml(body.content), content_type: "textarea", sort_order: 2, published, updated_at: now },
    { content_key: `page.${slug}.meta_description`, label: "Meta description", section: `Page: ${slug}`, value: String(body.metaDescription || "").trim().slice(0, 160), content_type: "textarea", sort_order: 3, published, updated_at: now },
  ];
  const { error } = await db.from("site_content").upsert(rows, { onConflict: "content_key" });
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true, slug });
}

export async function DELETE(request: NextRequest) {
  await requireAdmin();
  const slug = cleanSlug((await request.json()).slug);
  if (!slug || slug === "404" || slug === "privacy-policy") return Response.json({ error: "This built-in page cannot be deleted." }, { status: 400 });
  const { error } = await createAdminClient().from("site_content").delete().like("content_key", `page.${slug}.%`);
  return error ? Response.json({ error: error.message }, { status: 500 }) : Response.json({ ok: true });
}
