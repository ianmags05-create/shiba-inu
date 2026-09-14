import Link from "next/link";
import { createAdminClient } from "../../../lib/supabase/admin";
import { requireAdmin } from "../../../lib/admin-auth";
import { builtInPages, pageFromRows, pageSlugs } from "../../../lib/site-pages";
import AdminShell from "../admin-shell";
import styles from "../admin.module.css";

export const dynamic = "force-dynamic";

export default async function PagesPage() {
  const user = await requireAdmin();
  const { data = [] } = await createAdminClient().from("site_content").select("content_key,value,published,updated_at").like("content_key", "page.%");
  const customSlugs = pageSlugs(data || []).filter((slug) => !builtInPages.some((page) => page.slug === slug));
  const pages = [...builtInPages.map((page) => pageFromRows(page.slug, data || []) || { ...page, content: "", metaDescription: "", published: false }), ...customSlugs.map((slug) => pageFromRows(slug, data || [])!).filter(Boolean)];

  return <AdminShell title="Pages" email={user.email} active="/admin/pages">
    <div className={styles.notice}><strong>Manage website pages.</strong><span>Edit the homepage visually or create and publish standard pages.</span></div>
    <div className={styles.pageActions}><Link className={styles.primary} href="/admin/pages/new">Add new page</Link></div>
    <div className={styles.pagesTable}>
      <div className={styles.pageRow}><div><strong>Homepage</strong><span>Front page · Visual section editor</span></div><span className={styles.statusPublished}>Published</span><Link href="/admin/content">Edit homepage</Link></div>
      {pages.map((page) => <div className={styles.pageRow} key={page.slug}>
        <div><strong>{page.title}</strong><span>/{page.slug === "404" ? "Page not found" : page.slug}</span></div>
        <span className={page.published ? styles.statusPublished : styles.statusDraft}>{page.published ? "Published" : "Draft"}</span>
        <Link href={`/admin/pages/${page.slug}`}>Edit page</Link>
      </div>)}
    </div>
  </AdminShell>;
}
