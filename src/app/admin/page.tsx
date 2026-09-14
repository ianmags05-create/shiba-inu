import Link from "next/link";
import { requireAdmin } from "../../lib/admin-auth";
import AdminShell from "./admin-shell";
import styles from "./admin.module.css";

export const metadata = { title: "Dashboard | Shiba Inu Pet Shop" };
export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const user = await requireAdmin();
  const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "Administrator";
  return <AdminShell title={`Welcome, ${name}`} email={user.email} active="/admin">
    <div className={styles.notice}><strong>Your website controls are ready.</strong><span>Published changes appear on the homepage automatically.</span></div>
    <div className={styles.stats}><article><span>Website pages</span><strong>1</strong><small>Homepage connected</small></article><article><span>Content areas</span><strong>12</strong><small>Editable fields</small></article><article><span>Access</span><strong>Secure</strong><small>Admin only</small></article></div>
    <section className={styles.panel}><div><p className={styles.kicker}>Quick actions</p><h2>What would you like to manage?</h2></div><div className={styles.actions}><Link href="/admin/content">Update homepage</Link><Link href="/admin/images">Upload images</Link><Link href="/admin/menus">Edit navigation</Link><Link href="/admin/users">Manage staff users</Link></div></section>
  </AdminShell>;
}
