import { redirect } from "next/navigation";
import { createClient, isAdminEmail, isSupabaseConfigured } from "../../lib/supabase/server";
import { logout } from "./actions";
import styles from "./admin.module.css";

export const metadata = { title: "Dashboard | Shiba Inu Pet Shop" };
export const dynamic = "force-dynamic";
const navigation = ["Overview", "Website Content", "Images", "Reservations", "Customers", "Documents", "Staff Users"];

export default async function AdminDashboard() {
  if (!isSupabaseConfigured()) redirect("/admin/login");
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user || !isAdminEmail(data.user.email)) redirect("/admin/login");
  const name = data.user.user_metadata?.full_name || data.user.email?.split("@")[0] || "Administrator";

  return (
    <main className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/uploads/shiba-inu-logo.jpg" alt="" />
          <div><strong>Shiba Inu</strong><span>Admin Portal</span></div>
        </div>
        <nav aria-label="Admin navigation">{navigation.map((item,index)=><a className={index===0?styles.active:""} href="#" key={item}><span>{index===0?"⌂":"•"}</span>{item}</a>)}</nav>
        <form action={logout}><button type="submit">Sign out</button></form>
      </aside>
      <section className={styles.content}>
        <header><button className={styles.menu} aria-label="Open menu">☰</button><div><p>Admin dashboard</p><h1>Welcome, {name}</h1></div><span className={styles.avatar}>{name.slice(0,1).toUpperCase()}</span></header>
        <div className={styles.notice}><strong>Your admin portal is ready.</strong><span>The next step is connecting each module to its database tables.</span></div>
        <div className={styles.stats}><article><span>Website pages</span><strong>1</strong><small>Homepage connected</small></article><article><span>Reservations</span><strong>0</strong><small>No records yet</small></article><article><span>Documents</span><strong>0</strong><small>Ready for setup</small></article></div>
        <section className={styles.panel}><div><p className={styles.kicker}>Quick actions</p><h2>What would you like to manage?</h2></div><div className={styles.actions}><button>Update homepage</button><button>Upload images</button><button>Add reservation</button><button>Create staff user</button></div></section>
      </section>
    </main>
  );
}
