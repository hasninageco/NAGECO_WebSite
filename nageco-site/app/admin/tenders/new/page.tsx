import { redirect } from "next/navigation";
import { TenderForm } from "@/components/admin/TenderForm";
import { getCurrentUser } from "@/lib/auth";

export default async function NewTenderPage() {
  const user = await getCurrentUser();
  if (user?.role === "VIEWER") {
    redirect("/admin/tenders");
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">New Tender</h1>
      <TenderForm />
    </div>
  );
}
