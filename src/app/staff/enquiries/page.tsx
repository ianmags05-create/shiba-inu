import { createAdminClient } from "../../../lib/supabase/admin";
import { requireStaff } from "../../../lib/staff-auth";
import { updateEnquiry } from "../actions";
import StaffShell from "../staff-shell";
import styles from "../staff.module.css";

export const dynamic = "force-dynamic";
export default async function EnquiriesPage() {
  const { profile } = await requireStaff();
  const { data: result } = await createAdminClient().from("customer_enquiries").select("*").order("created_at", { ascending: false }).limit(100);
  const data = result || [];
  const name = profile.full_name || profile.email || "Staff";
  return <StaffShell title="Customer enquiries" name={name} active="/staff/enquiries">
    <p className={styles.hint}>Messages submitted on the public homepage appear here automatically.</p>
    <div className={styles.list}>{data.length ? data.map((item) => <article className={styles.record} key={item.id}>
      <div className={styles.recordTop}><div><h3>{item.name}</h3><p>{item.mobile}{item.email ? ` · ${item.email}` : ""}</p></div><span className={styles.status}>{item.status}</span></div>
      <p>{item.message}</p><div className={styles.meta}><span>{new Date(item.created_at).toLocaleString()}</span></div>
      <form action={updateEnquiry} className={styles.form}><input type="hidden" name="id" value={item.id} /><label>Status<select name="status" defaultValue={item.status}><option value="new">New</option><option value="contacted">Contacted</option><option value="resolved">Resolved</option><option value="spam">Spam</option></select></label><label className={styles.wide}>Staff notes<textarea name="staff_notes" defaultValue={item.staff_notes || ""} /></label><button>Save enquiry</button></form>
    </article>) : <p className={styles.empty}>No enquiries yet.</p>}</div>
  </StaffShell>;
}
