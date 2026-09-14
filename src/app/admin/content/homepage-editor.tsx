"use client";

/* eslint-disable @next/next/no-img-element -- CMS thumbnails may use administrator-provided Supabase URLs. */

import { useEffect, useRef, useState, useTransition } from "react";
import type { HomepageLayoutItem, HomepageSection } from "../../../lib/homepage-sections";
import { saveContent, saveHomepageLayout } from "../crud-actions";
import styles from "../admin.module.css";

type ContentRow = {
  id?: string;
  content_key: string;
  label: string;
  section: string;
  value: string;
  content_type: "text" | "textarea" | "url" | "phone" | "email";
  sort_order: number;
  published: boolean;
};

type EditorSection = HomepageSection & { fields: ContentRow[]; previewImage: string };

export default function HomepageEditor({ sections, initialLayout }: { sections: EditorSection[]; initialLayout: HomepageLayoutItem[] }) {
  const sectionMap = new Map(sections.map((section) => [section.key, section]));
  const [layout, setLayout] = useState(initialLayout);
  const [expanded, setExpanded] = useState<string | null>(initialLayout[0]?.key || null);
  const [dragged, setDragged] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();
  const iframe = useRef<HTMLIFrameElement>(null);

  const sendPreview = (next: HomepageLayoutItem[], focus?: string) => {
    iframe.current?.contentWindow?.postMessage({ type: "homepage-layout-preview", layout: next, focus }, window.location.origin);
  };

  useEffect(() => {
    const timer = window.setTimeout(() => sendPreview(layout), 250);
    return () => window.clearTimeout(timer);
  }, [layout]);

  const move = (source: string, target: string) => {
    if (source === target) return;
    setLayout((current) => {
      const next = [...current];
      const from = next.findIndex((item) => item.key === source);
      const to = next.findIndex((item) => item.key === target);
      if (from < 0 || to < 0) return current;
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      setSaved(false);
      return next;
    });
  };

  const toggleVisible = (key: string) => {
    setLayout((current) => current.map((item) => item.key === key ? { ...item, visible: !item.visible } : item));
    setSaved(false);
  };

  const saveLayout = () => startTransition(async () => {
    await saveHomepageLayout(layout);
    setSaved(true);
  });

  return <div className={styles.visualEditor}>
    <div className={styles.sectionEditorColumn}>
      <div className={styles.editorToolbar}>
        <div><strong>Homepage sections</strong><span>Drag to reorder. Open a section to edit its content.</span></div>
        <button type="button" onClick={saveLayout} disabled={pending}>{pending ? "Saving…" : saved ? "Saved" : "Save layout"}</button>
      </div>
      <div className={styles.sectionList}>
        {layout.map((layoutItem, index) => {
          const section = sectionMap.get(layoutItem.key);
          if (!section) return null;
          const isOpen = expanded === section.key;
          return <article
            className={`${styles.sectionCard} ${dragged === section.key ? styles.dragging : ""} ${!layoutItem.visible ? styles.sectionHidden : ""}`}
            key={section.key}
            onDragOver={(event) => { event.preventDefault(); event.dataTransfer.dropEffect = "move"; }}
            onDrop={(event) => { event.preventDefault(); if (dragged) move(dragged, section.key); setDragged(null); }}
          >
            <div className={styles.sectionCardHead}>
              <button className={styles.dragHandle} type="button" draggable title="Drag section" aria-label={`Drag ${section.label}`} onDragStart={(event) => { setDragged(section.key); event.dataTransfer.effectAllowed = "move"; }} onDragEnd={() => setDragged(null)}>⠿</button>
              <img src={section.previewImage} alt="" />
              <button className={styles.sectionSummary} type="button" aria-expanded={isOpen} onClick={() => { setExpanded(isOpen ? null : section.key); sendPreview(layout, section.key); }}>
                <span><b>{index + 1}. {section.label}</b><small>{section.description}</small></span><i aria-hidden="true">⌄</i>
              </button>
              <label className={styles.visibilityToggle} title={layoutItem.visible ? "Visible on homepage" : "Hidden from homepage"}>
                <input type="checkbox" checked={layoutItem.visible} onChange={() => toggleVisible(section.key)} />
                <span aria-hidden="true" />
                <em>{layoutItem.visible ? "Visible" : "Hidden"}</em>
              </label>
            </div>
            {isOpen && <div className={styles.sectionCardBody}>
              {section.fields.length ? <div className={styles.sectionFields}>{section.fields.map((item) => <form action={saveContent} className={styles.inlineField} key={item.content_key}>
                {item.id && <input type="hidden" name="id" value={item.id} />}
                <input type="hidden" name="content_key" value={item.content_key} />
                <input type="hidden" name="section" value={item.section} />
                <input type="hidden" name="content_type" value={item.content_type} />
                <input type="hidden" name="sort_order" value={item.sort_order} />
                <input type="hidden" name="published" value="on" />
                <input type="hidden" name="label" value={item.label} />
                <label>{item.label}{item.content_type === "textarea"
                  ? <textarea name="value" defaultValue={item.value} required />
                  : <input name="value" type={item.content_type === "phone" ? "tel" : item.content_type} defaultValue={item.value} required />}</label>
                <button type="submit">Save</button>
              </form>)}</div> : <p className={styles.muted}>This section currently uses fixed design copy. Its position and visibility can still be changed.</p>}
              <button className={styles.previewJump} type="button" onClick={() => sendPreview(layout, section.key)}>Show this section in preview</button>
            </div>}
          </article>;
        })}
      </div>
      <p className={styles.dragHelp}>Tip: on touch devices, use the arrow controls below.</p>
      <div className={styles.mobileOrderControls}>{layout.map((item, index) => {
        const section = sectionMap.get(item.key);
        return section && <div key={item.key}><span>{section.label}</span><button type="button" disabled={index === 0} onClick={() => move(item.key, layout[index - 1]?.key)}>↑</button><button type="button" disabled={index === layout.length - 1} onClick={() => move(item.key, layout[index + 1]?.key)}>↓</button></div>;
      })}</div>
    </div>
    <aside className={styles.livePreview}>
      <div><strong>Live homepage preview</strong><a href="/" target="_blank" rel="noreferrer">Open full page ↗</a></div>
      <iframe ref={iframe} src="/?cms-preview=1" title="Live homepage preview" onLoad={() => sendPreview(layout)} />
    </aside>
  </div>;
}
