import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "../../lib/supabase/admin";
import { pageFromRows } from "../../lib/site-pages";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

async function getPage(slug: string) {
  const { data = [] } = await createAdminClient().from("site_content").select("content_key,value,published,updated_at").like("content_key", `page.${slug}.%`).eq("published", true);
  return pageFromRows(slug, data || []);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const page = await getPage(slug);
  return page ? { title: `${page.title} | Shiba Inu Pet Shop`, description: page.metaDescription } : {};
}

export default async function PublicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug === "404") notFound();
  const page = await getPage(slug); if (!page) notFound();
  return <main className={styles.page}><header><Link href="/">Shiba Inu Pet Shop</Link><Link href="/">Back to home</Link></header><article><h1>{page.title}</h1><div className={styles.body} dangerouslySetInnerHTML={{ __html: page.content }} /></article></main>;
}
