import { notFound } from "next/navigation";
import { createAdminClient } from "../../../../lib/supabase/admin";
import { requireAdmin } from "../../../../lib/admin-auth";
import { builtInPages, pageFromRows } from "../../../../lib/site-pages";
import AdminShell from "../../admin-shell";
import PageEditor from "../page-editor";

export const dynamic = "force-dynamic";

export default async function EditPage({ params }: { params: Promise<{ slug: string }> }) {
  const user = await requireAdmin();
  const { slug } = await params;
  const { data = [] } = await createAdminClient().from("site_content").select("content_key,value,published,updated_at").like("content_key", `page.${slug}.%`);
  const preset = builtInPages.find((page) => page.slug === slug);
  const page = pageFromRows(slug, data || []) || (preset ? { slug, title: preset.title, content: "", metaDescription: "", published: false } : null);
  if (!page) notFound();
  return <AdminShell title={`Edit: ${page.title}`} email={user.email} active="/admin/pages"><PageEditor page={page} lockedSlug={Boolean(preset)} /></AdminShell>;
}
