import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "../../lib/supabase/admin";
import { pageFromRows } from "../../lib/site-pages";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

async function getPage(slug: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) return null;
  const { data = [] } = await createAdminClient().from("site_content").select("content_key,value,published,updated_at").like("content_key", `page.${slug}.%`).eq("published", true);
  return pageFromRows(slug, data || []);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const page = await getPage(slug);
  if (!page) return { robots: { index: false, follow: false } };
  const description = page.metaDescription || `${page.title} from Shiba Inu Pet Shop & Hotel in Buhangin, Davao City.`;
  return {
    title: page.title,
    description,
    alternates: { canonical: `/${page.slug}` },
    openGraph: { title: page.title, description, url: `/${page.slug}` },
  };
}

export default async function PublicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug === "404") notFound();
  const page = await getPage(slug); if (!page) notFound();
  return <main className={styles.page}><header><Link href="/">Shiba Inu Pet Shop</Link><Link href="/">Back to home</Link></header><article><h1>{page.title}</h1><div className={styles.body} dangerouslySetInnerHTML={{ __html: page.content }} /></article></main>;
}
