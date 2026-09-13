import styles from "./staff.module.css";

export const metadata = { title: "Staff Login | Shiba Inu Pet Shop" };

export default function StaffLogin() {
  return (
    <main className={styles.shell}>
      <section className={styles.card} aria-labelledby="staff-login-title">
        <div className={styles.brand}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/uploads/shiba-inu-logo.jpg" alt="Shiba Inu Pet Shop logo" />
          <div><strong>Shiba Inu</strong><span>Staff Portal</span></div>
        </div>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Secure staff access</p>
          <h1 id="staff-login-title">Welcome back</h1>
          <p>Sign in to manage pet stays, customer records, documents and website content.</p>
        </div>
        <form className={styles.form}>
          <label>Email address<input type="email" name="email" autoComplete="username" required /></label>
          <label>Password<input type="password" name="password" autoComplete="current-password" required /></label>
          <button type="submit" disabled>Sign in</button>
          <small>Authentication will be enabled when the database environment is connected.</small>
        </form>
      </section>
    </main>
  );
}
