import type { MetadataRoute } from "next";
import { createAdminClient } from "../lib/supabase/admin";
import { pageFromRows, pageSlugs } from "../lib/site-pages";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://shibainupetshop.com";
  const entries: MetadataRoute.Sitemap = [{ url: baseUrl, changeFrequency: "weekly", priority: 1 }];
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) return entries;

  const { data = [] } = await createAdminClient()
    .from("site_content")
    .select("content_key,value,published,updated_at")
    .like("content_key", "page.%")
    .eq("published", true);

  for (const slug of pageSlugs(data || [])) {
    if (slug === "404") continue;
    const page = pageFromRows(slug, data || []);
    if (!page?.published) continue;
    entries.push({
      url: `${baseUrl}/${slug}`,
      lastModified: page.updatedAt ? new Date(page.updatedAt) : undefined,
      changeFrequency: "monthly",
      priority: slug === "privacy-policy" ? 0.3 : 0.7,
    });
  }
  return entries;
}
