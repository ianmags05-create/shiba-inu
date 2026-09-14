import { redirect } from "next/navigation";
import { createClient, isAdminEmail } from "./supabase/server";
import { createAdminClient } from "./supabase/admin";

export async function requireStaff() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/staff/login");

  const { data: profile } = await createAdminClient()
    .from("app_users")
    .select("id,email,full_name,role,active")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!isAdminEmail(data.user.email) && (!profile || !profile.active)) {
    await supabase.auth.signOut();
    redirect("/staff/login?error=access");
  }

  return {
    user: data.user,
    profile: profile || { id: data.user.id, email: data.user.email, full_name: "Owner", role: "admin", active: true },
  };
}
