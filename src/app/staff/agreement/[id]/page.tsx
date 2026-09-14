import { requireStaff } from "../../../../lib/staff-auth";
import { getStaffRecord } from "../../../../lib/staff-records";
import { AgreementForm } from "../../record-form";
import StaffShell from "../../staff-shell";
export const dynamic="force-dynamic";
export default async function Page({params}:{params:Promise<{id:string}>}){const {profile}=await requireStaff();const {id}=await params;const r=await getStaffRecord(id);if(r.record_type!=="agreement")throw new Error("This is not an agreement record.");return <StaffShell name={profile.full_name||profile.email||"Staff"} active="/staff/agreement"><AgreementForm id={id} data={r.record_data} signatureUrl={r.signatureUrl}/></StaffShell>}
