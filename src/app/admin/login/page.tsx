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
        <div className={styles.brand}><span className={styles.paw}>🐾</span><span className={styles.eyebrow}>Shiba Inu Pet Shop</span><h1 id="admin-login-title">Admin Portal</h1><p>Sign in to manage website content, navigation, images, and staff access.</p></div>
        <LoginForm configured={configured} />
        <p className={styles.security}>Protected by encrypted HTTPS sessions. Your password is never stored in this website&apos;s code.</p>
      </section>
    </main>
  );
}
