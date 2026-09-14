import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminEmail, createClient } from "../../../../lib/supabase/server";
import { createAdminClient } from "../../../../lib/supabase/admin";

const contentSchema = z.object({
  id: z.string().uuid().optional(),
  content_key: z.string().trim().min(1),
  label: z.string().trim().min(1),
  section: z.string().trim().min(1),
  value: z.string(),
  content_type: z.enum(["text", "textarea", "url", "phone", "email"]),
  sort_order: z.number().int(),
  published: z.boolean(),
});

export async function POST(request: Request) {
  try {
    const auth = await createClient();
    const { data: { user } } = await auth.auth.getUser();
    if (!user || !isAdminEmail(user.email)) {
      return NextResponse.json({ error: "Your admin session has expired. Please sign in again." }, { status: 401 });
    }

    const parsed = contentSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "The content field is incomplete or invalid." }, { status: 400 });
    }

    const { id, ...content } = parsed.data;
    const row = { ...content, updated_at: new Date().toISOString() };
    const db = createAdminClient();
    const { data: updated, error: updateError } = id
      ? await db.from("site_content").update(row).eq("id", id).select("id")
      : await db.from("site_content").update(row).eq("content_key", row.content_key).select("id");

    if (updateError) throw updateError;
    if (!updated?.length) {
      const { error: insertError } = await db.from("site_content").insert(row);
      if (insertError) throw insertError;
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const details = error && typeof error === "object" ? error as Record<string, unknown> : {};
    const parts = [details.message, details.details, details.hint]
      .filter((value): value is string => typeof value === "string" && value.length > 0);
    const code = typeof details.code === "string" ? ` (${details.code})` : "";
    const message = error instanceof Error ? error.message : parts.join(" — ") || "The content could not be saved.";
    console.error("Content API save failed:", error);
    return NextResponse.json({ error: `${message}${code}` }, { status: 500 });
  }
}
