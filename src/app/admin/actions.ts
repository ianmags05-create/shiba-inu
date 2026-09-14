"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient, isAdminEmail, isSupabaseConfigured } from "../../lib/supabase/server";

export type LoginState = { error?: string } | undefined;

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8).max(128),
});

export async function login(_previousState: LoginState, formData: FormData): Promise<LoginState> {
  if (!isSupabaseConfigured()) return { error: "The secure database connection has not been configured yet." };
  const result = loginSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!result.success) return { error: "Enter a valid email and a password of at least 8 characters." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(result.data);
  if (error) return { error: "The email or password is incorrect." };
  if (!isAdminEmail(data.user.email)) {
    await supabase.auth.signOut();
    return { error: "This account does not have administrator access." };
  }
  redirect("/admin");
}

export async function logout() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/admin/login");
}
