import { createAdminClient } from "../../../lib/supabase/admin";
import { requireStaff } from "../../../lib/staff-auth";
import { saveCareLog } from "../actions";
import StaffShell from "../staff-shell";
import styles from "../staff.module.css";

export const dynamic = "force-dynamic";
export default async function CarePage() {
  const { profile } = await requireStaff();
  const db = createAdminClient();
  const [{ data: stayResult }, { data: logResult }] = await Promise.all([
    db.from("pet_stays").select("id,pet_name,owner_name,room").eq("status", "checked_in").order("pet_name"),
    db.from("care_logs").select("*,pet_stays(pet_name,room)").order("completed_at", { ascending: false }).limit(100),
  ]);
  const stays = stayResult || [];
  const logs = logResult || [];
  const name = profile.full_name || profile.email || "Staff";
  return <StaffShell title="Daily care logs" name={name} active="/staff/care">
    <section className={styles.card}><h2>Record care activity</h2><p className={styles.hint}>Time-stamped updates create a clear handover record for every checked-in pet.</p>
      <form action={saveCareLog} className={styles.form}>
        <label>Pet<select name="stay_id" required><option value="">Select a checked-in pet</option>{stays.map((stay) => <option value={stay.id} key={stay.id}>{stay.pet_name} — {stay.room || stay.owner_name}</option>)}</select></label>
        <label>Activity<select name="care_type"><option value="feeding">Feeding</option><option value="water">Water</option><option value="walk">Walk or exercise</option><option value="medication">Medication</option><option value="cleaning">Room or litter cleaning</option><option value="health_check">Health check</option><option value="update">Owner update</option><option value="other">Other</option></select></label>
        <label>Date and time<input name="completed_at" type="datetime-local" /></label>
        <label className={styles.wide}>Notes<textarea name="notes" placeholder="Amount eaten, medication dose, mood, behavior, or anything the next shift should know" /></label>
        <button>Save care log</button>
      </form>
    </section>
    <h2 className={styles.sectionTitle}>Recent activity</h2>
    <div className={styles.list}>{logs.length ? logs.map((log) => <article className={styles.record} key={log.id}><div className={styles.recordTop}><div><h3>{log.pet_stays?.pet_name || "Pet"}</h3><p>{log.notes || "No additional notes"}</p></div><span className={styles.status}>{log.care_type.replace("_", " ")}</span></div><div className={styles.meta}><span>{new Date(log.completed_at).toLocaleString()}</span><span>{log.pet_stays?.room || ""}</span></div></article>) : <p className={styles.empty}>No care activity recorded yet.</p>}</div>
  </StaffShell>;
}
