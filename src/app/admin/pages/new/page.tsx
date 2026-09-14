import { requireAdmin } from "../../../../lib/admin-auth";
import AdminShell from "../../admin-shell";
import PageEditor from "../page-editor";

export default async function NewPage() {
  const user = await requireAdmin();
  return <AdminShell title="Add New Page" email={user.email} active="/admin/pages"><PageEditor page={{ slug: "", title: "", content: "", metaDescription: "", published: false }} /></AdminShell>;
}
