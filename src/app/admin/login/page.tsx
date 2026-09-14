import { redirect } from "next/navigation";
import { createClient, isAdminEmail, isSupabaseConfigured } from "../../../lib/supabase/server";
import LoginForm from "./login-form";
import styles from "./login.module.css";

export const metadata = { title: "Admin Login | Shiba Inu Pet Shop" };
export const dynamic = "force-dynamic";

export default async function AdminLogin() {
  const configured = isSupabaseConfigured();
  if (configured) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    if (data.user && isAdminEmail(data.user.email)) redirect("/admin");
  }

  return (
    <main className={styles.shell}>
      <section className={styles.card} aria-labelledby="admin-login-title">
        <div className={styles.brand}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/uploads/shiba-inu-logo.jpg" alt="Shiba Inu Pet Shop" />
          <div><strong>Shiba Inu</strong><span>Admin Portal</span></div>
        </div>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Authorized staff only</p>
          <h1 id="admin-login-title">Welcome back</h1>
          <p>Sign in to manage the website, reservations, customers, and documents.</p>
        </div>
        <LoginForm configured={configured} />
        <p className={styles.security}>Protected by encrypted HTTPS sessions. Your password is never stored in this website&apos;s code.</p>
      </section>
    </main>
  );
}
