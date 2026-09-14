import Link from "next/link";
import { logout } from "./actions";
import styles from "./admin.module.css";

const items = [["Overview","/admin"],["Website Content","/admin/content"],["Menus","/admin/menus"],["Images","/admin/images"],["Staff Users","/admin/users"]];

export default function AdminShell({ title, email, active, children }: { title:string; email?:string; active:string; children:React.ReactNode }) {
  return <main className={styles.layout}><aside className={styles.sidebar}>
    <div className={styles.brand}><img src="/uploads/shiba-inu-logo.jpg" alt="" /><div><strong>Shiba Inu</strong><span>Admin Portal</span></div></div>
    <nav aria-label="Admin navigation">{items.map(([label,url])=><Link className={active===url?styles.active:""} href={url} key={url}><span>•</span>{label}</Link>)}</nav>
    <form action={logout}><button type="submit">Sign out</button></form>
  </aside><section className={styles.content}>
    <header><div><p>Admin portal</p><h1>{title}</h1></div><span className={styles.avatar}>{(email||"A").slice(0,1).toUpperCase()}</span></header>
    {children}
  </section></main>;
}
