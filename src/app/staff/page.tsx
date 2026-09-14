import { createAdminClient } from "../../lib/supabase/admin";
import { requireStaff } from "../../lib/staff-auth";
import RecordsTable from "./records-table";
import StaffShell from "./staff-shell";
import styles from "./staff.module.css";

export const dynamic = "force-dynamic";
export default async function StaffDashboard({ searchParams }: { searchParams: Promise<{ record_search?:string; record_type?:string; message?:string }> }) {
  const { profile } = await requireStaff(); const params = await searchParams; const db = createAdminClient();
  let query = db.from("staff_records").select("id,record_type,customer_name,pet_name,updated_at,updated_by").order("updated_at",{ascending:false}).limit(500);
  if (params.record_type === "agreement" || params.record_type === "checklist") query = query.eq("record_type", params.record_type);
  if (params.record_search?.trim()) { const q = params.record_search.trim().replace(/[%_,()]/g, ""); query = /^\d+$/.test(q) ? query.eq("id",q) : query.or(`customer_name.ilike.%${q}%,pet_name.ilike.%${q}%`); }
  const { data: records, error } = await query; if (error) throw new Error(error.message);
  const userIds = [...new Set((records || []).map(r=>r.updated_by).filter(Boolean))];
  const { data: users } = userIds.length ? await db.from("app_users").select("id,full_name,email").in("id",userIds) : {data:[]};
  const names = Object.fromEntries((users || []).map(u=>[u.id,u.full_name || u.email || "Unknown"]));
  const name = profile.full_name || profile.email || "Staff";
  return <StaffShell name={name} active="/staff">{params.message === "deleted" && <div className={styles.notice}>Record deleted.</div>}
    <section className={styles.card}><div className={styles.title}><div><span className={styles.kicker}>Records</span><h2>Customer &amp; Pet Records</h2></div><span className={styles.badge}>{records?.length || 0} shown</span></div>
      <form className={styles.filters}><input type="search" name="record_search" defaultValue={params.record_search} placeholder="Search customer, pet, or ID"/><select name="record_type" defaultValue={params.record_type || ""}><option value="">All form types</option><option value="agreement">Agreements</option><option value="checklist">Daily Checklists</option></select><button className={styles.btn}>Filter</button></form>
      <RecordsTable records={(records || []).map(r=>({...r,staff:names[r.updated_by] || "Unknown"}))}/>
    </section></StaffShell>;
}
