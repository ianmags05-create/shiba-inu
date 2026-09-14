export type SitePage = {
  slug: string;
  title: string;
  content: string;
  metaDescription: string;
  published: boolean;
  updatedAt?: string;
};

type ContentRecord = { content_key: string; value: string; published: boolean; updated_at?: string };

export const builtInPages = [
  { slug: "privacy-policy", title: "Privacy Policy", description: "Explain how customer and enquiry data is collected and used." },
  { slug: "404", title: "Page Not Found", description: "The message visitors see when a page does not exist." },
] as const;

export function pageFromRows(slug: string, rows: ContentRecord[]): SitePage | null {
  const prefix = `page.${slug}.`;
  const values = new Map(rows.filter((row) => row.content_key.startsWith(prefix)).map((row) => [row.content_key.slice(prefix.length), row]));
  const title = values.get("title");
  if (!title) return null;
  return {
    slug,
    title: title.value,
    content: values.get("content")?.value || "",
    metaDescription: values.get("meta_description")?.value || "",
    published: title.published,
    updatedAt: title.updated_at,
  };
}

export function pageSlugs(rows: ContentRecord[]) {
  return [...new Set(rows.map((row) => row.content_key.match(/^page\.([^.]+)\.title$/)?.[1]).filter((slug): slug is string => Boolean(slug)))];
}
