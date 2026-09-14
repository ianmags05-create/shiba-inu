import { createAdminClient } from "../../../lib/supabase/admin";
import { requireStaff } from "../../../lib/staff-auth";
import { saveGroomingJob } from "../actions";
import StaffShell from "../staff-shell";
import styles from "../staff.module.css";

export const dynamic = "force-dynamic";
export default async function GroomingPage() {
  const { profile } = await requireStaff();
  const { data: result } = await createAdminClient().from("grooming_jobs").select("*").order("appointment_at", { ascending: false }).limit(100);
  const data = result || [];
  const name = profile.full_name || profile.email || "Staff";
  return <StaffShell title="Grooming appointments" name={name} active="/staff/grooming">
    <section className={styles.card}><h2>New grooming appointment</h2><GroomingForm /></section>
    <h2 className={styles.sectionTitle}>Appointments</h2>
    <div className={styles.list}>{data.length ? data.map((job) => <article className={styles.record} key={job.id}><div className={styles.recordTop}><div><h3>{job.pet_name} — {job.service}</h3><p>{job.owner_name} · {job.owner_mobile}</p></div><span className={styles.status}>{job.status.replace("_", " ")}</span></div><div className={styles.meta}><span>{new Date(job.appointment_at).toLocaleString()}</span><span>{job.pet_type}</span></div><details><summary>Edit appointment</summary><GroomingForm job={job} /></details></article>) : <p className={styles.empty}>No grooming appointments yet.</p>}</div>
  </StaffShell>;
}

function GroomingForm({ job }: { job?: Record<string, string | null> }) {
  return <form action={saveGroomingJob} className={styles.form}>
    {job?.id && <input type="hidden" name="id" value={job.id} />}
    <label>Owner name<input name="owner_name" defaultValue={job?.owner_name || ""} required /></label>
    <label>Mobile number<input name="owner_mobile" type="tel" defaultValue={job?.owner_mobile || ""} required /></label>
    <label>Pet name<input name="pet_name" defaultValue={job?.pet_name || ""} required /></label>
    <label>Pet type<select name="pet_type" defaultValue={job?.pet_type || "dog"}><option value="dog">Dog</option><option value="cat">Cat</option><option value="other">Other</option></select></label>
    <label>Service<input name="service" placeholder="Premium wash, haircut, nail trim…" defaultValue={job?.service || ""} required /></label>
    <label>Appointment<input name="appointment_at" type="datetime-local" defaultValue={job?.appointment_at ? new Date(job.appointment_at).toISOString().slice(0,16) : ""} required /></label>
    <label>Status<select name="status" defaultValue={job?.status || "scheduled"}><option value="scheduled">Scheduled</option><option value="confirmed">Confirmed</option><option value="in_progress">In progress</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select></label>
    <label className={styles.wide}>Notes<textarea name="notes" defaultValue={job?.notes || ""} /></label>
    <button>{job?.id ? "Save appointment" : "Add appointment"}</button>
  </form>;
}
