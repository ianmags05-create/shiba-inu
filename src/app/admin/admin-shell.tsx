import Link from "next/link";
import { logout } from "./actions";
import styles from "./admin.module.css";

const items = [
  ["Overview", "/admin", "◉"],
  ["Pages", "/admin/pages", "▤"],
  ["Menus", "/admin/menus", "☰"],
  ["Staff Users", "/admin/users", "♙"],
  ["Staff Portal", "/staff", "↗"],
];

export default function AdminShell({ title, email, active, children }: { title:string; email?:string; active:string; children:React.ReactNode }) {
  return <main className={styles.portalPage}><div className={styles.shell}>
    <header className={styles.head}><div><span className={styles.kicker}>Shiba Inu Pet Shop</span><h1>Website Admin Portal</h1></div><div className={styles.user}>{email || "Administrator"} · <form action={logout}><button type="submit">Log out</button></form></div></header>
    <div className={styles.dashboardLayout}><aside className={styles.sidebar}><div className={styles.sideLabel}>Website Management</div><nav aria-label="Admin navigation">
      {items.map(([label,url,icon])=><Link className={active===url?styles.active:""} href={url} key={url}><span className={styles.icon}>{icon}</span><span>{label}</span></Link>)}
    </nav><div className={styles.sideBottom}><form action={logout}><button type="submit"><span>↪</span><span>Log Out</span></button></form></div></aside>
    <section className={styles.content}><div className={styles.pageTitle}><span className={styles.kicker}>Admin Portal</span><h2>{title}</h2></div>{children}</section></div>
  </div></main>;
}
