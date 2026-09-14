"use client";

import { useActionState } from "react";
import { staffLogin } from "../actions";
import styles from "../../admin/login/login.module.css";

export default function StaffLoginForm() {
  const [state, action, pending] = useActionState(staffLogin, undefined);
  return <form action={action} className={styles.form}>
    <label htmlFor="staff-email">Email address</label>
    <input id="staff-email" name="email" type="email" autoComplete="username" required />
    <label htmlFor="staff-password">Password</label>
    <input id="staff-password" name="password" type="password" autoComplete="current-password" minLength={8} required />
    {state?.error && <p className={styles.error} role="alert">{state.error}</p>}
    <button disabled={pending}>{pending ? "Signing in…" : "Sign in to staff portal"}</button>
  </form>;
}
