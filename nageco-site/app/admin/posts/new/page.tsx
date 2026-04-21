import { redirect } from "next/navigation";
import { PostForm } from "@/components/admin/PostForm";
import { getCurrentUser } from "@/lib/auth";

export default async function NewPostPage() {
  const user = await getCurrentUser();
  if (user?.role === "VIEWER") {
    redirect("/admin/posts");
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">New Post</h1>
      <PostForm />
    </div>
  );
}