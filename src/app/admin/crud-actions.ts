"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "../../lib/supabase/admin";
import { requireAdmin } from "../../lib/admin-auth";
import { homepageSections } from "../../lib/homepage-sections";
import { z } from "zod";

const text = (fd:FormData,key:string) => String(fd.get(key)||"").trim();
const refresh = () => { revalidatePath("/admin"); revalidatePath("/admin/content"); revalidatePath("/api/site-data"); revalidatePath("/", "page"); };

type ContentRow = {
  content_key: string;
  label: string;
  section: string;
  value: string;
  content_type: string;
  sort_order: number;
  published: boolean;
  updated_at: string;
};

async function saveContentRow(row: ContentRow) {
  const db = createAdminClient();
  const { data: existing, error: readError } = await db
    .from("site_content")
    .select("id")
    .eq("content_key", row.content_key)
    .maybeSingle();

  if (readError) throw new Error(readError.message);

  const { error } = existing
    ? await db.from("site_content").update(row).eq("id", existing.id)
    : await db.from("site_content").insert(row);

  if (error) throw new Error(error.message);
}

export async function saveContent(fd:FormData){ await requireAdmin(); const row={content_key:text(fd,"content_key"),label:text(fd,"label"),section:text(fd,"section")||"General",value:text(fd,"value"),content_type:text(fd,"content_type")||"text",sort_order:Number(fd.get("sort_order")||0),published:fd.get("published")==="on",updated_at:new Date().toISOString()}; if(!row.content_key||!row.label) return; await saveContentRow(row);refresh(); }
export async function deleteContent(fd:FormData){await requireAdmin();const {error}=await createAdminClient().from("site_content").delete().eq("id",text(fd,"id"));if(error)throw new Error(error.message);refresh();}

const homepageLayoutSchema = z.array(z.object({ key: z.string(), visible: z.boolean() }));
export async function saveHomepageLayout(input: unknown) {
  await requireAdmin();
  const parsed = homepageLayoutSchema.parse(input);
  const allowed = new Set(homepageSections.map((section) => section.key));
  if (parsed.length !== allowed.size || new Set(parsed.map((item) => item.key)).size !== allowed.size || parsed.some((item) => !allowed.has(item.key))) {
    throw new Error("The homepage layout is incomplete or invalid.");
  }
  await saveContentRow({
    content_key: "homepage.layout",
    label: "Homepage section layout",
    section: "Homepage Layout",
    value: JSON.stringify(parsed),
    content_type: "textarea",
    sort_order: -1,
    published: true,
    updated_at: new Date().toISOString(),
  });
  refresh();
}

export async function saveMenu(fd:FormData){await requireAdmin();const db=createAdminClient();const id=text(fd,"id");const row={label:text(fd,"label"),url:text(fd,"url"),sort_order:Number(fd.get("sort_order")||0),visible:fd.get("visible")==="on",updated_at:new Date().toISOString()};if(!row.label||!row.url)return;const q=id?db.from("menu_items").update(row).eq("id",id):db.from("menu_items").insert(row);const {error}=await q;if(error)throw new Error(error.message);refresh();}
export async function deleteMenu(fd:FormData){await requireAdmin();const {error}=await createAdminClient().from("menu_items").delete().eq("id",text(fd,"id"));if(error)throw new Error(error.message);refresh();}

export async function uploadImage(fd:FormData){await requireAdmin();const file=fd.get("file");if(!(file instanceof File)||file.size===0||file.size>5*1024*1024||!file.type.startsWith("image/"))throw new Error("Choose a JPG, PNG, WebP, or GIF smaller than 5 MB.");const db=createAdminClient();const ext=file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g,"")||"jpg";const path=`${new Date().getFullYear()}/${randomUUID()}.${ext}`;const {error:uploadError}=await db.storage.from("site-media").upload(path,file,{contentType:file.type,upsert:false});if(uploadError)throw new Error(uploadError.message);const {data}=db.storage.from("site-media").getPublicUrl(path);const {error}=await db.from("media_assets").insert({name:text(fd,"name")||file.name,alt_text:text(fd,"alt_text"),slot_key:text(fd,"slot_key")||null,public_url:data.publicUrl,storage_path:path});if(error){await db.storage.from("site-media").remove([path]);throw new Error(error.message);}refresh();}
export async function updateImage(fd:FormData){await requireAdmin();const db=createAdminClient();const id=text(fd,"id");const file=fd.get("file");const changes:{name:string;alt_text:string;slot_key:string|null;public_url?:string;storage_path?:string}={name:text(fd,"name"),alt_text:text(fd,"alt_text"),slot_key:text(fd,"slot_key")||null};let oldPath="";let newPath="";if(file instanceof File&&file.size>0){if(file.size>5*1024*1024||!file.type.startsWith("image/"))throw new Error("Choose a JPG, PNG, WebP, or GIF smaller than 5 MB.");const {data:current,error:readError}=await db.from("media_assets").select("storage_path").eq("id",id).single();if(readError)throw new Error(readError.message);oldPath=current.storage_path;const ext=file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g,"")||"jpg";newPath=`${new Date().getFullYear()}/${randomUUID()}.${ext}`;const {error:uploadError}=await db.storage.from("site-media").upload(newPath,file,{contentType:file.type,upsert:false});if(uploadError)throw new Error(uploadError.message);changes.storage_path=newPath;changes.public_url=db.storage.from("site-media").getPublicUrl(newPath).data.publicUrl;}const {error}=await db.from("media_assets").update(changes).eq("id",id);if(error){if(newPath)await db.storage.from("site-media").remove([newPath]);throw new Error(error.message);}if(oldPath)await db.storage.from("site-media").remove([oldPath]);refresh();}
export async function deleteImage(fd:FormData){await requireAdmin();const db=createAdminClient();const id=text(fd,"id");const {data}=await db.from("media_assets").select("storage_path").eq("id",id).single();if(data)await db.storage.from("site-media").remove([data.storage_path]);const {error}=await db.from("media_assets").delete().eq("id",id);if(error)throw new Error(error.message);refresh();}

export async function inviteUser(fd:FormData){await requireAdmin();const db=createAdminClient();const email=text(fd,"email").toLowerCase();const fullName=text(fd,"full_name");const role=text(fd,"role")||"staff";if(!email.includes("@"))return;const {data,error}=await db.auth.admin.inviteUserByEmail(email,{data:{full_name:fullName}});if(error)throw new Error(error.message);if(data.user){const {error:profileError}=await db.from("app_users").upsert({id:data.user.id,email,full_name:fullName,role,active:true});if(profileError)throw new Error(profileError.message);}revalidatePath("/admin/users");}
export async function updateUser(fd:FormData){await requireAdmin();const {error}=await createAdminClient().from("app_users").update({full_name:text(fd,"full_name"),role:text(fd,"role"),active:fd.get("active")==="on"}).eq("id",text(fd,"id"));if(error)throw new Error(error.message);revalidatePath("/admin/users");}
export async function deleteUser(fd:FormData){const current=await requireAdmin();const id=text(fd,"id");if(id===current.id)throw new Error("You cannot delete your own account.");const db=createAdminClient();const {error}=await db.auth.admin.deleteUser(id);if(error)throw new Error(error.message);revalidatePath("/admin/users");}
