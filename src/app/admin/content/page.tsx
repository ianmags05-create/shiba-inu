import { createAdminClient } from "../../../lib/supabase/admin";
import { requireAdmin } from "../../../lib/admin-auth";
import { siteContentDefaults } from "../../../lib/site-content-defaults";
import AdminShell from "../admin-shell";
import { deleteContent, saveContent } from "../crud-actions";
import styles from "../admin.module.css";

export const dynamic = "force-dynamic";

type ContentRow = (typeof siteContentDefaults)[number] & { id?: string; published: boolean };

export default async function ContentPage() {
  const user = await requireAdmin();
  const { data = [] } = await createAdminClient().from("site_content").select("*").order("sort_order");
  const saved = new Map((data || []).map((row) => [row.content_key, row]));
  const registered = siteContentDefaults.map((item) => ({ ...item, published: true, ...saved.get(item.content_key) })) as ContentRow[];
  const custom = (data || []).filter((row) => !siteContentDefaults.some((item) => item.content_key === row.content_key)) as ContentRow[];
  const rows = [...registered, ...custom];
  const sections = [...new Set(rows.map((row) => row.section))];

  return <AdminShell title="Website Content" email={user.email} active="/admin/content">
    <div className={styles.notice}><strong>Homepage connected.</strong><span>Every field below is mapped to the public page. Saving a default field creates it automatically.</span></div>
    <div className={styles.toolbar}><p>Edit headings, descriptions, prices and contact details by section.</p></div>
    {sections.map((section) => <section className={styles.contentSection} key={section}>
      <h2>{section}</h2>
      <div className={styles.grid}>{rows.filter((item) => item.section === section).map((item) => <article className={styles.row} key={item.content_key}>
        <form action={saveContent}>
          {item.id && <input type="hidden" name="id" value={item.id} />}
          <input type="hidden" name="content_key" value={item.content_key} />
          <input type="hidden" name="section" value={item.section} />
          <input type="hidden" name="content_type" value={item.content_type} />
          <input type="hidden" name="sort_order" value={item.sort_order} />
          <input type="hidden" name="published" value="on" />
          <label className={styles.wide}>{item.label}
            {item.content_type === "textarea"
              ? <textarea name="value" defaultValue={item.value} required />
              : <input name="value" type={item.content_type === "phone" ? "tel" : item.content_type} defaultValue={item.value} required />}
          </label>
          <input type="hidden" name="label" value={item.label} />
          <button>Save {item.label.toLowerCase()}</button>
          {item.id && !siteContentDefaults.some((known) => known.content_key === item.content_key) && <button className={styles.danger} formAction={deleteContent}>Delete custom field</button>}
        </form>
      </article>)}</div>
    </section>)}
    <details className={styles.advanced}>
      <summary>Add an advanced custom content field</summary>
      <section className={styles.formCard}><form action={saveContent}>
        <label>Key<input name="content_key" placeholder="section.field" required /></label>
        <label>Label<input name="label" required /></label>
        <label>Section<input name="section" defaultValue="General" /></label>
        <label>Type<select name="content_type"><option>text</option><option>textarea</option><option>url</option><option>phone</option><option>email</option></select></label>
        <label className={styles.wide}>Value<textarea name="value" /></label>
        <label>Order<input name="sort_order" type="number" defaultValue="1200" /></label>
        <label className={styles.check}><input name="published" type="checkbox" defaultChecked />Published</label>
        <button>Add custom field</button>
      </form></section>
    </details>
  </AdminShell>;
}
