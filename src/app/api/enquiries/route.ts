import { z } from "zod";
import { createAdminClient } from "../../../lib/supabase/admin";

const enquirySchema = z.object({
  name: z.string().trim().min(2).max(100),
  mobile: z.string().trim().min(7).max(30),
  email: z.union([z.literal(""), z.string().trim().email().max(200)]),
  message: z.string().trim().min(3).max(2000),
  website: z.string().max(0),
});

const attempts = new Map<string, { count: number; reset: number }>();

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const current = attempts.get(ip);
  if (current && current.reset > now && current.count >= 5) return Response.json({ error: "Please wait before sending another message." }, { status: 429 });
  attempts.set(ip, !current || current.reset <= now ? { count: 1, reset: now + 15 * 60_000 } : { ...current, count: current.count + 1 });

  let body: unknown;
  try { body = await request.json(); } catch { return Response.json({ error: "Invalid request." }, { status: 400 }); }
  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: "Please check the required fields." }, { status: 400 });

  const row = { name: parsed.data.name, mobile: parsed.data.mobile, email: parsed.data.email || null, message: parsed.data.message };
  const { error } = await createAdminClient().from("customer_enquiries").insert(row);
  if (error) return Response.json({ error: "We could not send your message. Please call us instead." }, { status: 500 });
  return Response.json({ ok: true }, { status: 201 });
}
