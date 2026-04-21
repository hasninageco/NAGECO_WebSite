import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getCurrentUser } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const headerList = await headers();
  const pathname = headerList.get("x-pathname") ?? "";
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const user = await getCurrentUser();
  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-white md:flex">
      <AdminSidebar isAdmin={user.role === "ADMIN"} />
      <main className="min-h-screen flex-1 bg-white p-4 md:p-6">{children}</main>
    </div>
  );
}