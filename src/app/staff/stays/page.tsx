import { createAdminClient } from "../../../lib/supabase/admin";
import { requireStaff } from "../../../lib/staff-auth";
import { saveStay } from "../actions";
import StaffShell from "../staff-shell";
import styles from "../staff.module.css";

export const dynamic = "force-dynamic";
export default async function StaysPage() {
  const { profile } = await requireStaff();
  const { data: result } = await createAdminClient().from("pet_stays").select("*").order("check_in_at", { ascending: false }).limit(100);
  const data = result || [];
  const name = profile.full_name || profile.email || "Staff";
  return <StaffShell title="Pet stays" name={name} active="/staff/stays">
    <section className={styles.card}><h2>New reservation or check-in</h2><p className={styles.hint}>Capture the owner, pet, schedule, safety checks and care instructions.</p><StayForm /></section>
    <h2 className={styles.sectionTitle}>Current and recent stays</h2>
    <div className={styles.list}>{data.length ? data.map((stay) => <article className={styles.record} key={stay.id}>
      <div className={styles.recordTop}><div><h3>{stay.pet_name}</h3><p>{stay.owner_name} · {stay.owner_mobile}</p></div><span className={styles.status}>{stay.status.replace("_", " ")}</span></div>
      <div className={styles.meta}><span>{new Date(stay.check_in_at).toLocaleString()} → {new Date(stay.check_out_at).toLocaleString()}</span><span>{stay.pet_type}{stay.breed ? ` · ${stay.breed}` : ""}</span><span>{stay.room || "Room not assigned"}</span></div>
      <details><summary>Edit stay</summary><StayForm stay={stay} /></details>
    </article>) : <p className={styles.empty}>No pet stays yet.</p>}</div>
  </StaffShell>;
}

function StayForm({ stay }: { stay?: Record<string, string | boolean | null> }) {
  const local = (value: unknown) => value ? new Date(String(value)).toISOString().slice(0, 16) : "";
  return <form action={saveStay} className={styles.form}>
    {stay?.id && <input type="hidden" name="id" value={String(stay.id)} />}
    <label>Owner name<input name="owner_name" defaultValue={String(stay?.owner_name || "")} required /></label>
    <label>Mobile number<input name="owner_mobile" type="tel" defaultValue={String(stay?.owner_mobile || "")} required /></label>
    <label>Email<input name="owner_email" type="email" defaultValue={String(stay?.owner_email || "")} /></label>
    <label>Emergency contact<input name="emergency_contact" defaultValue={String(stay?.emergency_contact || "")} /></label>
    <label>Pet name<input name="pet_name" defaultValue={String(stay?.pet_name || "")} required /></label>
    <label>Pet type<select name="pet_type" defaultValue={String(stay?.pet_type || "dog")}><option value="dog">Dog</option><option value="cat">Cat</option><option value="other">Other</option></select></label>
    <label>Breed<input name="breed" defaultValue={String(stay?.breed || "")} /></label>
    <label>Room<input name="room" defaultValue={String(stay?.room || "")} /></label>
    <label>Check in<input name="check_in_at" type="datetime-local" defaultValue={local(stay?.check_in_at)} required /></label>
    <label>Check out<input name="check_out_at" type="datetime-local" defaultValue={local(stay?.check_out_at)} required /></label>
    <label>Status<select name="status" defaultValue={String(stay?.status || "reserved")}><option value="reserved">Reserved</option><option value="checked_in">Checked in</option><option value="checked_out">Checked out</option><option value="cancelled">Cancelled</option></select></label>
    <label className={styles.check}><input name="vaccination_verified" type="checkbox" defaultChecked={Boolean(stay?.vaccination_verified)} />Vaccination records verified</label>
    <label className={styles.wide}>Feeding instructions<textarea name="feeding_notes" defaultValue={String(stay?.feeding_notes || "")} /></label>
    <label className={styles.wide}>Medication and special-care instructions<textarea name="medication_notes" defaultValue={String(stay?.medication_notes || "")} /></label>
    <button>{stay?.id ? "Save stay changes" : "Create reservation"}</button>
  </form>;
}
