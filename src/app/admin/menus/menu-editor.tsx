"use client";

import { FormEvent, useState } from "react";
import styles from "../admin.module.css";

type MenuItem = { id: string; label: string; url: string; parent_id: string | null; sort_order: number; visible: boolean };

export default function MenuEditor({ initialItems }: { initialItems: MenuItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [dragged, setDragged] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const change = (id: string, changes: Partial<MenuItem>) => setItems((current) => current.map((item) => item.id === id ? { ...item, ...changes } : item));
  const move = (source: string, target: string) => setItems((current) => { if (source === target) return current; const next = [...current], from = next.findIndex((item) => item.id === source), to = next.findIndex((item) => item.id === target); if (from < 0 || to < 0) return current; const [item] = next.splice(from, 1); next.splice(to, 0, item); return next; });
  const indent = (id: string) => setItems((current) => { const index = current.findIndex((item) => item.id === id); let parent: MenuItem | undefined; for (let i = index - 1; i >= 0; i--) if (!current[i].parent_id) { parent = current[i]; break; } return parent ? current.map((item) => item.id === id ? { ...item, parent_id: parent!.id } : item) : current; });
  const ordered = items.map((item, index) => ({ ...item, sort_order: (index + 1) * 10 }));
  const save = async () => { setStatus("Saving menu…"); const response = await fetch("/api/admin/menus", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ items: ordered }) }); const result = await response.json().catch(() => ({ error: "Invalid server response." })); if (!response.ok) { setStatus(result.error || "Menu could not be saved."); return; } setItems(ordered); setStatus("Menu saved successfully."); };
  const add = async (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setStatus("Adding item…"); const form = new FormData(event.currentTarget); const response = await fetch("/api/admin/menus", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ label: form.get("label"), url: form.get("url"), sort_order: (items.length + 1) * 10 }) }); const result = await response.json().catch(() => ({ error: "Invalid server response." })); if (!response.ok) { setStatus(result.error || "Item could not be added."); return; } setItems((current) => [...current, result.item]); event.currentTarget.reset(); setStatus("Item added. Save the menu after arranging it."); };
  const remove = async (id: string) => { if (!window.confirm("Remove this menu item? Its submenu items will become main menu items.")) return; const response = await fetch("/api/admin/menus", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); if (response.ok) setItems((current) => current.filter((item) => item.id !== id).map((item) => item.parent_id === id ? { ...item, parent_id: null } : item)); else setStatus("Menu item could not be removed."); };

  return <div className={styles.menuBuilder}>
    <aside className={styles.menuAddPanel}><h3>Add menu item</h3><form onSubmit={add}><label>Navigation label<input name="label" required /></label><label>URL<input name="url" placeholder="#section, /page, or https://…" required /></label><button className={styles.primary}>Add to menu</button></form></aside>
    <section className={styles.menuStructure}><div className={styles.menuBuilderHead}><div><strong>Menu structure</strong><span>Drag items up or down. Use “Submenu” to place an item under the nearest main item.</span></div><button className={styles.primary} type="button" onClick={save}>Save menu</button></div>
      <div className={styles.menuItems}>{items.map((item, index) => <article className={`${styles.menuItem} ${item.parent_id ? styles.menuChild : ""} ${dragged === item.id ? styles.dragging : ""}`} draggable onDragStart={() => setDragged(item.id)} onDragEnd={() => setDragged(null)} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); if (dragged) move(dragged, item.id); setDragged(null); }} key={item.id}>
        <div className={styles.menuItemHead}><span className={styles.menuDrag} aria-hidden="true">⠿</span><button type="button" className={styles.menuSummary} onClick={() => setExpanded(expanded === item.id ? null : item.id)} aria-expanded={expanded === item.id}><b>{item.label}</b><small>{item.parent_id ? "Submenu item" : "Main menu item"}</small><i>⌄</i></button><label className={styles.visibilityToggle} title={item.visible ? "Visible" : "Hidden"}><input type="checkbox" checked={item.visible} onChange={() => change(item.id, { visible: !item.visible })} /><span /><em>{item.visible ? "Visible" : "Hidden"}</em></label></div>
        {expanded === item.id && <div className={styles.menuItemBody}><label>Navigation label<input value={item.label} onChange={(event) => change(item.id, { label: event.target.value })} /></label><label>URL<input value={item.url} onChange={(event) => change(item.id, { url: event.target.value })} /></label><div className={styles.menuLevelButtons}><button type="button" disabled={!items.slice(0, index).some((candidate) => !candidate.parent_id)} onClick={() => indent(item.id)}>Make submenu</button><button type="button" disabled={!item.parent_id} onClick={() => change(item.id, { parent_id: null })}>Make main item</button></div><button className={styles.textDanger} type="button" onClick={() => remove(item.id)}>Remove</button></div>}
      </article>)}</div>
      <div className={styles.mobileMenuMoves}>{items.map((item, index) => <div key={item.id}><span className={item.parent_id ? styles.indentedLabel : ""}>{item.label}</span><button type="button" disabled={index === 0} onClick={() => move(item.id, items[index - 1]?.id)}>↑</button><button type="button" disabled={index === items.length - 1} onClick={() => move(item.id, items[index + 1]?.id)}>↓</button><button type="button" onClick={() => item.parent_id ? change(item.id, { parent_id: null }) : indent(item.id)}>{item.parent_id ? "←" : "→"}</button></div>)}</div>
      <span className={styles.menuStatus} role="status">{status}</span>
    </section>
  </div>;
}
