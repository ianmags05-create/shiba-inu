"use client";

import { useActionState } from "react";
import { login } from "../actions";
import styles from "./login.module.css";

export default function LoginForm({ configured }: { configured: boolean }) {
  const [state, action, pending] = useActionState(login, undefined);
  return (
    <form action={action} className={styles.form}>
      <label htmlFor="email">Email address</label>
      <input id="email" type="email" name="email" autoComplete="username" required />
      <label htmlFor="password">Password</label>
      <input id="password" type="password" name="password" autoComplete="current-password" minLength={8} required />
      {state?.error && <p className={styles.error} role="alert">{state.error}</p>}
      <button type="submit" disabled={pending || !configured}>{pending ? "Signing in…" : "Sign in securely"}</button>
      {!configured && <p className={styles.setup}>Connect Supabase in Hostinger to enable sign-in.</p>}
    </form>
  );
}
