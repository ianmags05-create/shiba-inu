import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
import StaffLoginForm from "./login-form";
import styles from "../../admin/login/login.module.css";

export const metadata = { title: "Staff Login | Shiba Inu Pet Shop" };
export const dynamic = "force-dynamic";

export default async function StaffLoginPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (data.user) redirect("/staff");
  return <main className={styles.shell}><section className={styles.card}>
    <div className={styles.brand}><img src="/uploads/shiba-inu-logo.jpg" alt="Shiba Inu Pet Shop" /><div><strong>Shiba Inu</strong><span>Staff Portal</span></div></div>
    <div className={styles.copy}><p className={styles.eyebrow}>Team access</p><h1>Welcome back</h1><p>Sign in to manage stays, daily care, grooming appointments and customer enquiries.</p></div>
    <StaffLoginForm />
    <p className={styles.security}>Private staff area protected by encrypted sessions and role-based access.</p>
  </section></main>;
}
