import Link from "next/link";
import { staffLogout } from "./actions";
import styles from "./staff.module.css";

const items = [["Dashboard", "/staff"], ["Pet stays", "/staff/stays"], ["Care logs", "/staff/care"], ["Grooming", "/staff/grooming"], ["Enquiries", "/staff/enquiries"]];

export default function StaffShell({ title, name, active, children }: { title: string; name: string; active: string; children: React.ReactNode }) {
  return <main className={styles.layout}><aside className={styles.sidebar}>
    <div className={styles.portalBrand}><img src="/uploads/shiba-inu-logo.jpg" alt="" /><div><strong>Shiba Inu</strong><span>Staff Portal</span></div></div>
    <nav>{items.map(([label, url]) => <Link className={active === url ? styles.active : ""} href={url} key={url}>{label}</Link>)}</nav>
    <form action={staffLogout}><button>Sign out</button></form>
  </aside><section className={styles.main}>
    <header><div><p>Staff operations</p><h1>{title}</h1></div><span className={styles.avatar}>{name.slice(0, 1).toUpperCase()}</span></header>
    {children}
  </section></main>;
}
