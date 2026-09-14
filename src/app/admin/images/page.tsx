import { createAdminClient } from "../../../lib/supabase/admin";
import { requireAdmin } from "../../../lib/admin-auth";
import { imageSlots } from "../../../lib/image-slots";
import AdminShell from "../admin-shell";
import { deleteImage, updateImage, uploadImage } from "../crud-actions";
import styles from "../admin.module.css";

export const dynamic = "force-dynamic";
function SlotSelect({ value = "" }: { value?: string }) {
  return <select name="slot_key" defaultValue={value}><option value="">Media library only</option>{imageSlots.map(([key, label]) => <option value={key} key={key}>{label}</option>)}</select>;
}
export default async function ImagesPage() {
  const user = await requireAdmin();
  const { data: result } = await createAdminClient().from("media_assets").select("*").order("created_at", { ascending: false });
  const data = result || [];
  return <AdminShell title="Homepage Images" email={user.email} active="/admin/images">
    <div className={styles.notice}><strong>{imageSlots.length} homepage positions are connected.</strong><span>Choose a named position while uploading; the public image changes automatically.</span></div>
    <section className={styles.formCard}><form action={uploadImage}><label>Name<input name="name" /></label><label>Display position<SlotSelect /></label><label className={styles.wide}>Alternative text<input name="alt_text" required /></label><label className={styles.wide}>Image (maximum 5 MB)<input name="file" type="file" accept="image/jpeg,image/png,image/webp,image/gif" required /></label><button>Upload and publish image</button></form></section>
    <div className={styles.mediaGrid}>{data.map((item) => <article className={styles.row} key={item.id}><img className={styles.thumb} src={item.public_url} alt={item.alt_text} /><form action={updateImage}><input type="hidden" name="id" value={item.id} /><label>Name<input name="name" defaultValue={item.name} /></label><label>Display position<SlotSelect value={item.slot_key || ""} /></label><label className={styles.wide}>Alternative text<input name="alt_text" defaultValue={item.alt_text} /></label><button>Save placement</button><button className={styles.danger} formAction={deleteImage}>Delete image</button></form></article>)}</div>
  </AdminShell>;
}
