"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./staff.module.css";

export default function SignaturePad({ existingUrl }: { existingUrl?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [data, setData] = useState("");
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.lineWidth = 3; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.strokeStyle = "#071f3a";
    let drawing = false;
    const point = (event: PointerEvent) => { const rect = canvas.getBoundingClientRect(); return { x: (event.clientX - rect.left) * canvas.width / rect.width, y: (event.clientY - rect.top) * canvas.height / rect.height }; };
    const down = (event: PointerEvent) => { event.preventDefault(); drawing = true; canvas.setPointerCapture(event.pointerId); const p = point(event); ctx.beginPath(); ctx.moveTo(p.x, p.y); };
    const move = (event: PointerEvent) => { if (!drawing) return; event.preventDefault(); const p = point(event); ctx.lineTo(p.x, p.y); ctx.stroke(); };
    const up = () => { if (!drawing) return; drawing = false; setData(canvas.toDataURL("image/jpeg", .9)); };
    canvas.addEventListener("pointerdown", down); canvas.addEventListener("pointermove", move); canvas.addEventListener("pointerup", up); canvas.addEventListener("pointercancel", up);
    return () => { canvas.removeEventListener("pointerdown", down); canvas.removeEventListener("pointermove", move); canvas.removeEventListener("pointerup", up); canvas.removeEventListener("pointercancel", up); };
  }, []);
  const clear = () => { const canvas = canvasRef.current; const ctx = canvas?.getContext("2d"); if (canvas && ctx) { ctx.clearRect(0,0,canvas.width,canvas.height); ctx.fillStyle="#fff"; ctx.fillRect(0,0,canvas.width,canvas.height); setData(""); } };
  return <div><h3>Customer Signature</h3>{existingUrl && <><p>Current signature:</p><img className={styles.existingSignature} src={existingUrl} alt="Stored signature" /></>}
    <canvas ref={canvasRef} className={styles.signaturePad} width="700" height="220" aria-label="Signature pad" /><input type="hidden" name="signature_data" value={data} />
    <div className={styles.signTools}><button type="button" className={styles.btn} onClick={clear}>Clear Signature</button><span>Sign using a finger, stylus, or mouse.</span></div>
  </div>;
}
