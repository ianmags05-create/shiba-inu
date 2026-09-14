"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient, isSupabaseConfigured } from "../../lib/supabase/server";
import { createAdminClient } from "../../lib/supabase/admin";
import { requireStaff } from "../../lib/staff-auth";

export type StaffLoginState = { error?: string } | undefined;
const text = (form: FormData, key: string) => String(form.get(key) || "").trim();

export async function staffLogin(_state: StaffLoginState, form: FormData): Promise<StaffLoginState> {
  if (!isSupabaseConfigured()) return { error: "The database connection is not configured." };
  const parsed = z.object({ email: z.string().trim().email(), password: z.string().min(8).max(128) }).safeParse({ email: form.get("email"), password: form.get("password") });
  if (!parsed.success) return { error: "Enter a valid email and password." };
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error || !data.user) return { error: "The email or password is incorrect." };
  const { data: profile } = await createAdminClient().from("app_users").select("active").eq("id", data.user.id).maybeSingle();
  if (!profile?.active && !(process.env.ADMIN_EMAILS || "").toLowerCase().split(",").includes(parsed.data.email.toLowerCase())) {
    await supabase.auth.signOut();
    return { error: "This account does not have active staff access." };
  }
  redirect("/staff");
}

export async function staffLogout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/staff/login");
}

export async function saveStay(form: FormData) {
  const { user } = await requireStaff();
  const id = text(form, "id");
  const row = {
    owner_name: text(form, "owner_name"), owner_mobile: text(form, "owner_mobile"), owner_email: text(form, "owner_email") || null,
    pet_name: text(form, "pet_name"), pet_type: text(form, "pet_type"), breed: text(form, "breed") || null,
    check_in_at: text(form, "check_in_at"), check_out_at: text(form, "check_out_at"), room: text(form, "room") || null,
    feeding_notes: text(form, "feeding_notes") || null, medication_notes: text(form, "medication_notes") || null,
    emergency_contact: text(form, "emergency_contact") || null, vaccination_verified: form.get("vaccination_verified") === "on",
    status: text(form, "status") || "reserved", updated_at: new Date().toISOString(), created_by: user.id,
  };
  if (!row.owner_name || !row.owner_mobile || !row.pet_name || !row.check_in_at || !row.check_out_at) throw new Error("Complete all required stay fields.");
  const db = createAdminClient();
  const { error } = id ? await db.from("pet_stays").update(row).eq("id", id) : await db.from("pet_stays").insert(row);
  if (error) throw new Error(error.message);
  revalidatePath("/staff"); revalidatePath("/staff/stays");
}

export async function saveCareLog(form: FormData) {
  const { user } = await requireStaff();
  const row = { stay_id: text(form, "stay_id"), care_type: text(form, "care_type"), notes: text(form, "notes"), completed_at: text(form, "completed_at") || new Date().toISOString(), created_by: user.id };
  if (!row.stay_id || !row.care_type) throw new Error("Choose a pet and care activity.");
  const { error } = await createAdminClient().from("care_logs").insert(row);
  if (error) throw new Error(error.message);
  revalidatePath("/staff"); revalidatePath("/staff/care");
}

export async function saveGroomingJob(form: FormData) {
  const { user } = await requireStaff();
  const id = text(form, "id");
  const row = { owner_name: text(form, "owner_name"), owner_mobile: text(form, "owner_mobile"), pet_name: text(form, "pet_name"), pet_type: text(form, "pet_type"), service: text(form, "service"), appointment_at: text(form, "appointment_at"), status: text(form, "status") || "scheduled", notes: text(form, "notes") || null, updated_at: new Date().toISOString(), created_by: user.id };
  if (!row.owner_name || !row.owner_mobile || !row.pet_name || !row.service || !row.appointment_at) throw new Error("Complete all required grooming fields.");
  const db = createAdminClient();
  const { error } = id ? await db.from("grooming_jobs").update(row).eq("id", id) : await db.from("grooming_jobs").insert(row);
  if (error) throw new Error(error.message);
  revalidatePath("/staff"); revalidatePath("/staff/grooming");
}

export async function updateEnquiry(form: FormData) {
  await requireStaff();
  const { error } = await createAdminClient().from("customer_enquiries").update({ status: text(form, "status"), staff_notes: text(form, "staff_notes"), updated_at: new Date().toISOString() }).eq("id", text(form, "id"));
  if (error) throw new Error(error.message);
  revalidatePath("/staff"); revalidatePath("/staff/enquiries");
}
