"use server";

import { createHash, randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient, isSupabaseConfigured } from "../../lib/supabase/server";
import { createAdminClient } from "../../lib/supabase/admin";
import { requireStaff } from "../../lib/staff-auth";

export type StaffLoginState = { error?: string } | undefined;
const text = (form: FormData, key: string) => String(form.get(key) || "").trim();
const agreementFields = ["customer_name","phone","email","address","pet_name","pet_type","breed","color","age","weight","special_needs","additional_notes","liability_limit","signer_name","signed_date"];
const checklistFields = ["pet_name","breed","room","checkin_date","checkin_time","checkout_date","checkout_time","special_instructions","customer_name","signer_name","signed_date"];
const dailyFields = ["date","time","morning_food","afternoon_food","evening_food","snack","fresh_water","vitamins","potty_time","room_clean","room_sanitation","staff_assisted"];

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
    return { error: "This account does not have staff portal access." };
  }
  redirect("/staff");
}

export async function staffLogout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/staff/login");
}

async function storeSignature(dataUrl: string, userId: string) {
  const match = dataUrl.match(/^data:image\/jpeg;base64,([A-Za-z0-9+/=]+)$/);
  if (!match) throw new Error("The signature image is invalid.");
  const bytes = Buffer.from(match[1], "base64");
  if (!bytes.length || bytes.length > 2 * 1024 * 1024 || bytes[0] !== 0xff || bytes[1] !== 0xd8) throw new Error("The signature must be a JPEG under 2 MB.");
  const path = `${userId}/${Date.now()}-${randomUUID()}.jpg`;
  const db = createAdminClient();
  const { error } = await db.storage.from("staff-signatures").upload(path, bytes, { contentType: "image/jpeg", upsert: false });
  if (error) throw new Error(error.message);
  return { path, hash: createHash("sha256").update(bytes).digest("hex") };
}

export async function saveRecord(form: FormData) {
  const { user } = await requireStaff();
  const type = text(form, "record_type");
  if (type !== "agreement" && type !== "checklist") throw new Error("Invalid record type.");
  const id = text(form, "record_id");
  const db = createAdminClient();
  const { data: existing } = id ? await db.from("staff_records").select("id,record_type,signature_path,signature_hash").eq("id", id).maybeSingle() : { data: null };
  if (id && (!existing || existing.record_type !== type)) throw new Error("Record not found.");
  const fields = type === "agreement" ? agreementFields : checklistFields;
  const recordData: Record<string, unknown> = Object.fromEntries(fields.map((key) => [key, text(form, key)]));
  if (!recordData.customer_name || !recordData.pet_name || !recordData.signer_name || !recordData.signed_date) throw new Error("Complete all required fields.");
  if (type === "agreement") {
    if (!recordData.phone) throw new Error("Phone number is required.");
    recordData.services = form.getAll("services").map(String).filter((v) => ["Grooming","Pet Boarding","Pet Sitting","Others"].includes(v));
  } else {
    if (!recordData.checkin_date) throw new Error("Check-in date is required.");
    recordData.daily_rows = Array.from({ length: 10 }, (_, i) => Object.fromEntries(dailyFields.map((key) => [key, text(form, `daily_${i}_${key}`)]))).filter((row) => Object.values(row).some(Boolean));
  }
  let signaturePath = existing?.signature_path || "";
  let signatureHash = existing?.signature_hash || "";
  const signatureData = text(form, "signature_data");
  if (signatureData) {
    const saved = await storeSignature(signatureData, user.id);
    signaturePath = saved.path; signatureHash = saved.hash;
  }
  if (!signaturePath) throw new Error("A customer signature is required.");
  const now = new Date().toISOString();
  const row = { record_type: type, record_status: "completed", customer_name: String(recordData.customer_name), pet_name: String(recordData.pet_name), record_data: recordData, signature_path: signaturePath, signature_hash: signatureHash, updated_by: user.id, updated_at: now };
  const result = existing
    ? await db.from("staff_records").update(row).eq("id", id).select("id").single()
    : await db.from("staff_records").insert({ ...row, created_by: user.id, created_at: now }).select("id").single();
  if (result.error) throw new Error(result.error.message);
  revalidatePath("/staff");
  redirect(`/staff/records/${result.data.id}?message=saved`);
}

export async function deleteRecord(form: FormData) {
  await requireStaff();
  const id = text(form, "record_id");
  const db = createAdminClient();
  const { data: record } = await db.from("staff_records").select("signature_path").eq("id", id).maybeSingle();
  const { error } = await db.from("staff_records").delete().eq("id", id);
  if (error) throw new Error(error.message);
  if (record?.signature_path) await db.storage.from("staff-signatures").remove([record.signature_path]);
  revalidatePath("/staff");
  redirect("/staff?message=deleted");
}
