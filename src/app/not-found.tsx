import { createAdminClient } from "../lib/supabase/admin";
import Link from "next/link";
import { pageFromRows } from "../lib/site-pages";
import styles from "./not-found.module.css";

export default async function NotFound() {
  const { data = [] } = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SECRET_KEY
    ? await createAdminClient().from("site_content").select("content_key,value,published,updated_at").like("content_key", "page.404.%").eq("published", true)
    : { data: [] };
  const page = pageFromRows("404", data || []);
  return <main className={styles.page}><div><span>404</span><h1>{page?.title || "Page not found"}</h1><section dangerouslySetInnerHTML={{ __html: page?.content || "<p>Sorry, the page you are looking for does not exist.</p>" }} /><Link href="/">Return to homepage</Link></div></main>;
}
