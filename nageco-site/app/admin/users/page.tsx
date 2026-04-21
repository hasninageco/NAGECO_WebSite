import { redirect } from "next/navigation";
import { UsersManager } from "@/components/admin/UsersManager";
import { DatabaseConnectionNotice } from "@/components/admin/DatabaseConnectionNotice";
import { getCurrentUser } from "@/lib/auth";
import { withDbFallback } from "@/lib/db-fallback";
import { prisma } from "@/lib/prisma";

export default async function AdminUsersPage() {
  const user = await getCurrentUser();
  if (user?.role !== "ADMIN") {
    redirect("/admin");
  }

  const { data: users, databaseConnectionError } = await withDbFallback(
    () =>
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, email: true, role: true }
      }),
    []
  );

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Users</h1>
      {databaseConnectionError ? <DatabaseConnectionNotice /> : null}
      <UsersManager initialUsers={users} />
    </div>
  );
}