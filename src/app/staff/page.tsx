import Link from "next/link";
import { createAdminClient } from "../../lib/supabase/admin";
import { requireStaff } from "../../lib/staff-auth";
import StaffShell from "./staff-shell";
import styles from "./staff.module.css";

export const dynamic = "force-dynamic";
export default async function StaffDashboard() {
  const { profile } = await requireStaff();
  const db = createAdminClient();
  const now = new Date().toISOString();
  const lastDay = new Date(new Date().getTime() - 86400000).toISOString();
  const [stays, grooming, enquiries, logs] = await Promise.all([
    db.from("pet_stays").select("id", { count: "exact", head: true }).in("status", ["reserved", "checked_in"]),
    db.from("grooming_jobs").select("id", { count: "exact", head: true }).gte("appointment_at", now).in("status", ["scheduled", "in_progress"]),
    db.from("customer_enquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
    db.from("care_logs").select("id", { count: "exact", head: true }).gte("completed_at", lastDay),
  ]);
  const name = profile.full_name || profile.email || "Staff";
  return <StaffShell title={`Hello, ${name.split(" ")[0]}`} name={name} active="/staff">
    <div className={styles.notice}><strong>Today&apos;s workspace.</strong><span>Use the shortcuts below to record care and keep bookings up to date.</span></div>
    <div className={styles.stats}>
      <article className={styles.stat}><span>Active stays</span><strong>{stays.count || 0}</strong><small>Reserved or checked in</small></article>
      <article className={styles.stat}><span>Upcoming grooms</span><strong>{grooming.count || 0}</strong><small>Scheduled</small></article>
      <article className={styles.stat}><span>New enquiries</span><strong>{enquiries.count || 0}</strong><small>Need a reply</small></article>
      <article className={styles.stat}><span>Care updates</span><strong>{logs.count || 0}</strong><small>Last 24 hours</small></article>
    </div>
    <div className={styles.actions}><Link href="/staff/stays">Add or update a pet stay</Link><Link href="/staff/care">Record feeding, medicine or care</Link><Link href="/staff/grooming">Manage grooming appointments</Link><Link href="/staff/enquiries">Reply to customer enquiries</Link></div>
  </StaffShell>;
}
