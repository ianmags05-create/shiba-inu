"use client";

import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { SitePage } from "../../../lib/site-pages";
import styles from "../admin.module.css";

export default function PageEditor({ page, lockedSlug = false }: { page: SitePage; lockedSlug?: boolean }) {
  const router = useRouter();
  const editor = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState("");
  const run = (command: string, value?: string) => { document.execCommand(command, false, value); editor.current?.focus(); };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setStatus("Saving…");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/pages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ originalSlug: page.slug, slug: form.get("slug"), title: form.get("title"), metaDescription: form.get("meta_description"), content: editor.current?.innerHTML || "", published: form.get("published") === "on" }) });
    const result = await response.json().catch(() => ({ error: "Invalid server response." }));
    if (!response.ok) { setStatus(result.error || "Page could not be saved."); return; }
    setStatus("Saved successfully."); router.push(`/admin/pages/${result.slug}`); router.refresh();
  };
  const remove = async () => {
    if (!window.confirm("Delete this page permanently?")) return;
    const response = await fetch("/api/admin/pages", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug: page.slug }) });
    if (response.ok) { router.push("/admin/pages"); router.refresh(); } else setStatus("Page could not be deleted.");
  };

  return <form className={styles.pageEditor} onSubmit={submit}>
    <div className={styles.pageEditorMain}>
      <label>Page title<input name="title" defaultValue={page.title} placeholder="Add title" required /></label>
      <label>URL slug<div className={styles.slugField}><span>/</span><input name="slug" defaultValue={page.slug} readOnly={lockedSlug} placeholder="page-name" required /></div></label>
      <div><span className={styles.fieldLabel}>Page content</span><div className={styles.richToolbar} role="toolbar" aria-label="Text formatting">
        <button type="button" onClick={() => run("formatBlock", "h2")}>Heading</button><button type="button" onClick={() => run("bold")}><b>Bold</b></button><button type="button" onClick={() => run("italic")}><i>Italic</i></button><button type="button" onClick={() => run("insertUnorderedList")}>List</button><button type="button" onClick={() => run("createLink", window.prompt("Link URL") || "")}>Link</button>
      </div><div className={styles.richEditor} ref={editor} contentEditable suppressContentEditableWarning dangerouslySetInnerHTML={{ __html: page.content }} /></div>
      <label>SEO meta description<textarea name="meta_description" defaultValue={page.metaDescription} maxLength={160} placeholder="A short description for search results." /></label>
    </div>
    <aside className={styles.publishCard}><h3>Publish</h3><label className={styles.check}><input name="published" type="checkbox" defaultChecked={page.published} />Visible to visitors</label><button type="submit" className={styles.primary}>Save page</button><span role="status">{status}</span>{page.slug && !lockedSlug && <button className={styles.textDanger} type="button" onClick={remove}>Delete page</button>}</aside>
  </form>;
}
