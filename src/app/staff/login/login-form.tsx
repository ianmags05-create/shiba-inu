"use client";
import Link from "next/link";
import { useActionState } from "react";
import { staffLogin } from "../actions";
import styles from "../staff.module.css";
export default function StaffLoginForm(){const [state,action,pending]=useActionState(staffLogin,undefined);return <form action={action} className={styles.loginForm}><label><span>Username or Email</span><input name="email" type="email" autoComplete="username" required autoFocus/></label><label><span>Password</span><input name="password" type="password" autoComplete="current-password" minLength={8} required/></label><label className={styles.remember}><input type="checkbox" name="rememberme" value="1"/> Keep me signed in on this device</label>{state?.error&&<div className={`${styles.notice} ${styles.error}`} role="alert">{state.error}</div>}<button className={`${styles.btn} ${styles.primary} ${styles.loginButton}`} disabled={pending}>{pending?"Signing in…":"Sign In to Staff Portal"}</button><Link className={styles.forgot} href="/admin/forgot-password">Forgot password?</Link></form>}
