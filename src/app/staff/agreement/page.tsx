import { requireStaff } from "../../../lib/staff-auth";
import { AgreementForm } from "../record-form";
import StaffShell from "../staff-shell";
export const dynamic="force-dynamic";
export default async function Page(){const {profile}=await requireStaff();return <StaffShell name={profile.full_name||profile.email||"Staff"} active="/staff/agreement"><AgreementForm data={{signed_date:new Date().toISOString().slice(0,10)}}/></StaffShell>}
