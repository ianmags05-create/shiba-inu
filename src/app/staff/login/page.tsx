import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
import StaffLoginForm from "./login-form";
import styles from "../staff.module.css";
export const metadata={title:"Staff Portal | Shiba Inu Pet Shop",robots:{index:false,follow:false}};export const dynamic="force-dynamic";
export default async function Page(){const supabase=await createClient();const {data}=await supabase.auth.getUser();if(data.user)redirect("/staff");return <main className={styles.loginPage}><section className={styles.loginPanel}><div className={styles.loginBrand}><span className={styles.paw}>🐾</span><span className={styles.kicker}>Shiba Inu Pet Shop</span><h1>Staff Portal</h1><p>Sign in to manage customer agreements and daily pet hotel records.</p></div><StaffLoginForm/></section></main>}
