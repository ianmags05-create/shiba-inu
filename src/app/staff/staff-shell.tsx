import Link from "next/link";
import { staffLogout } from "./actions";
import styles from "./staff.module.css";

const items = [["Dashboard & Records", "/staff", "◉"], ["New Agreement", "/staff/agreement", "▤"], ["New Daily Checklist", "/staff/checklist", "▧"]];

export default function StaffShell({ name, active, children }: { name: string; active: string; children: React.ReactNode }) {
  return <main className={styles.portalPage}><div className={styles.shell}>
    <header className={styles.head}><div><span className={styles.kicker}>Shiba Inu Pet Shop</span><h1>Staff Records Portal</h1></div><div className={styles.user}>{name} · <form action={staffLogout}><button>Log out</button></form></div></header>
    <div className={styles.dashboardLayout}><aside className={styles.sidebar}><div className={styles.sideLabel}>Workspace</div><nav className={styles.sideNav} aria-label="Staff portal navigation">
      {items.map(([label, url, icon]) => <Link className={active === url ? styles.active : ""} href={url} key={url}><span className={styles.icon}>{icon}</span><span>{label}</span></Link>)}
    </nav><div className={styles.sideBottom}><form action={staffLogout}><button><span>↪</span><span>Log Out</span></button></form></div></aside>
    <section className={styles.dashboardMain}>{children}</section></div>
  </div></main>;
}
