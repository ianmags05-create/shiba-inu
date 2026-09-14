import { redirect } from "next/navigation";
import { createClient, isAdminEmail } from "./supabase/server";

export async function requireAdmin() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user || !isAdminEmail(data.user.email)) redirect("/admin/login");
  return data.user;
}
