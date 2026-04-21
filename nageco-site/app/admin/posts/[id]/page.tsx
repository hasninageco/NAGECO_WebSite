import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { DatabaseConnectionNotice } from "@/components/admin/DatabaseConnectionNotice";
import { PostForm } from "@/components/admin/PostForm";
import { getCurrentUser } from "@/lib/auth";
import { withDbFallback } from "@/lib/db-fallback";
import { prisma } from "@/lib/prisma";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (user?.role === "VIEWER") {
    redirect("/admin/posts");
  }

  const { data: post, databaseConnectionError } = await withDbFallback(
    () => prisma.post.findUnique({ where: { id } }),
    null
  );

  if (databaseConnectionError) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Edit Post</h1>
        <DatabaseConnectionNotice />
        <Link href="/admin/posts" className="text-sm font-semibold text-brand-700 hover:underline">
          Back to posts
        </Link>
      </div>
    );
  }

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Edit Post</h1>
      <PostForm initial={post} />
    </div>
  );
}