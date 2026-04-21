import { PostStatus } from "@prisma/client";
import { DatabaseConnectionNotice } from "@/components/admin/DatabaseConnectionNotice";
import { withDbFallback } from "@/lib/db-fallback";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const fallbackCards = [
    { label: "Published posts", value: 0 },
    { label: "Draft posts", value: 0 },
    { label: "Projects", value: 0 },
    { label: "Last update", value: "N/A" }
  ];
  const { data: cards, databaseConnectionError } = await withDbFallback(async () => {
    const [publishedPosts, draftPosts, projects, lastPost] = await Promise.all([
      prisma.post.count({ where: { status: PostStatus.PUBLISHED } }),
      prisma.post.count({ where: { status: PostStatus.DRAFT } }),
      prisma.project.count(),
      prisma.post.findFirst({ orderBy: { updatedAt: "desc" }, select: { updatedAt: true } })
    ]);

    return [
      { label: "Published posts", value: publishedPosts },
      { label: "Draft posts", value: draftPosts },
      { label: "Projects", value: projects },
      { label: "Last update", value: lastPost?.updatedAt.toLocaleString() ?? "N/A" }
    ];
  }, fallbackCards);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {databaseConnectionError ? <DatabaseConnectionNotice /> : null}
      <div className="grid gap-4 md:grid-cols-4">
        {cards.map((card) => (
          <article key={card.label} className="card">
            <div className="text-sm text-slate-500">{card.label}</div>
            <div className="mt-2 text-xl font-semibold">{card.value}</div>
          </article>
        ))}
      </div>
    </div>
  );
}