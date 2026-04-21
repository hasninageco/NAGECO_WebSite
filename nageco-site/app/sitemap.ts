import type { MetadataRoute } from "next";
import { getPublishedPostSitemapEntries, getPublishedProjectSitemapEntries } from "@/lib/public-data";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  const [posts, projects] = await Promise.all([
    getPublishedPostSitemapEntries(),
    getPublishedProjectSitemapEntries()
  ]);

  const staticRoutes = ["", "/about", "/about/organizational-structure", "/about/hive-chart", "/gallery", "/services", "/capabilities", "/industries", "/career", "/partner", "/crew", "/projects", "/hse", "/news", "/contact", "/privacy", "/terms"]
    .map((path) => ({
      url: `${base}${path}`,
      lastModified: new Date()
    }));

  return [
    ...staticRoutes,
    ...posts.map((post) => ({ url: `${base}/news/${post.slug}`, lastModified: post.updatedAt })),
    ...projects.map((project) => ({ url: `${base}/projects/${project.slug}`, lastModified: project.updatedAt }))
  ];
}