import { createAdminClient } from "../../../lib/supabase/admin";
import { requireAdmin } from "../../../lib/admin-auth";
import AdminShell from "../admin-shell";
import MenuEditor from "./menu-editor";
import styles from "../admin.module.css";

export const dynamic = "force-dynamic";

export default async function MenusPage() {
  const user = await requireAdmin();
  const { data = [] } = await createAdminClient().from("menu_items").select("id,label,url,parent_id,sort_order,visible").order("sort_order");
  return <AdminShell title="Navigation Menus" email={user.email} active="/admin/menus">
    <div className={styles.notice}><strong>Build your main menu.</strong><span>Drag items to reorder, indent them as submenus, and expand an item to change its settings.</span></div>
    <MenuEditor initialItems={data || []} />
  </AdminShell>;
}
