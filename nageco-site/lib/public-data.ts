import type { PageContent, PageKey, Post, PrismaClient, Project, SiteSettings, Tender } from "@prisma/client";

type BackendPost = Omit<Post, "createdAt" | "updatedAt" | "publishedAt"> & {
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
};

type BackendProject = Omit<Project, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

type BackendTender = Omit<Tender, "createdAt" | "updatedAt" | "publishedAt"> & {
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
};

type BackendPageContent = Omit<PageContent, "updatedAt"> & {
  updatedAt: string;
};

type BackendSiteSettings = Omit<SiteSettings, "updatedAt"> & {
  updatedAt: string;
};

type PostSitemapEntry = {
  slug: string;
  updatedAt: Date;
};

type ProjectSitemapEntry = {
  slug: string;
  updatedAt: Date;
};

function getBackendApiOrigin() {
  const value = process.env.BACKEND_API_ORIGIN?.trim();
  if (!value) {
    return null;
  }

  return value.replace(/\/+$/, "");
}

async function fetchBackendJson<T>(path: string): Promise<T | null> {
  const backendApiOrigin = getBackendApiOrigin();
  if (!backendApiOrigin) {
    return null;
  }

  try {
    const response = await fetch(`${backendApiOrigin}${path}`, {
      cache: "no-store"
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

function toDate(value: string | Date | null | undefined) {
  if (!value) {
    return null;
  }

  return value instanceof Date ? value : new Date(value);
}

function deserializePost(post: BackendPost): Post {
  return {
    ...post,
    createdAt: toDate(post.createdAt) ?? new Date(0),
    updatedAt: toDate(post.updatedAt) ?? new Date(0),
    publishedAt: toDate(post.publishedAt)
  };
}

function deserializeProject(project: BackendProject): Project {
  return {
    ...project,
    createdAt: toDate(project.createdAt) ?? new Date(0),
    updatedAt: toDate(project.updatedAt) ?? new Date(0)
  };
}

function deserializeTender(tender: BackendTender): Tender {
  return {
    ...tender,
    createdAt: toDate(tender.createdAt) ?? new Date(0),
    updatedAt: toDate(tender.updatedAt) ?? new Date(0),
    publishedAt: toDate(tender.publishedAt)
  };
}

function deserializePageContent(page: BackendPageContent): PageContent {
  return {
    ...page,
    updatedAt: toDate(page.updatedAt) ?? new Date(0)
  };
}

function deserializeSiteSettings(settings: BackendSiteSettings): SiteSettings {
  return {
    ...settings,
    updatedAt: toDate(settings.updatedAt) ?? new Date(0)
  };
}

async function getPrismaClient(): Promise<PrismaClient | null> {
  try {
    const module = await import("@/lib/prisma");
    return module.prisma;
  } catch {
    return null;
  }
}

export async function getSiteSettings() {
  if (getBackendApiOrigin()) {
    const settings = await fetchBackendJson<BackendSiteSettings | null>("/api/public/site-settings");
    return settings ? deserializeSiteSettings(settings) : null;
  }

  try {
    const prisma = await getPrismaClient();
    if (!prisma) return null;
    return await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  } catch {
    return null;
  }
}

export async function getPageContent(key: PageKey) {
  if (getBackendApiOrigin()) {
    const page = await fetchBackendJson<BackendPageContent | null>(`/api/public/page/${key}`);
    return page ? deserializePageContent(page) : null;
  }

  try {
    const prisma = await getPrismaClient();
    if (!prisma) return null;
    return await prisma.pageContent.findUnique({ where: { key } });
  } catch {
    return null;
  }
}

export async function getPublishedPosts() {
  if (getBackendApiOrigin()) {
    const posts = await fetchBackendJson<BackendPost[]>("/api/public/posts");
    return (posts ?? []).map(deserializePost);
  }

  try {
    const prisma = await getPrismaClient();
    if (!prisma) return [];
    return await prisma.post.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" }
    });
  } catch {
    return [];
  }
}

export async function getLatestPublishedPostHeadline() {
  if (getBackendApiOrigin()) {
    const post = await fetchBackendJson<{
      title: string;
      titleAr?: string | null;
      slug: string;
    } | null>("/api/public/posts/latest-headline");

    if (!post) {
      return null;
    }

    return {
      title: post.title,
      titleAr: post.titleAr ?? null,
      slug: post.slug
    };
  }

  try {
    const prisma = await getPrismaClient();
    if (!prisma) return null;
    const post = await prisma.post.findFirst({
      where: { status: "PUBLISHED" },
      orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }]
    });

    if (!post) return null;

    const localizedPost = post as typeof post & { titleAr?: string | null };
    return {
      title: post.title,
      titleAr: localizedPost.titleAr ?? null,
      slug: post.slug
    };
  } catch {
    return null;
  }
}

export async function getPublishedProjects() {
  if (getBackendApiOrigin()) {
    const projects = await fetchBackendJson<BackendProject[]>("/api/public/projects");
    return (projects ?? []).map(deserializeProject);
  }

  try {
    const prisma = await getPrismaClient();
    if (!prisma) return [];
    return await prisma.project.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { updatedAt: "desc" }
    });
  } catch {
    return [];
  }
}

export async function getPublishedTenders() {
  if (getBackendApiOrigin()) {
    const tenders = await fetchBackendJson<BackendTender[]>("/api/public/tenders");
    return (tenders ?? []).map(deserializeTender);
  }

  try {
    const prisma = await getPrismaClient();
    if (!prisma) return [];
    return await prisma.tender.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }]
    });
  } catch {
    return [];
  }
}

export async function getPublishedPostBySlug(slug: string) {
  const cleanSlug = slug.trim();
  if (!cleanSlug) {
    return null;
  }

  if (getBackendApiOrigin()) {
    const post = await fetchBackendJson<BackendPost | null>(`/api/public/posts/${encodeURIComponent(cleanSlug)}`);
    return post ? deserializePost(post) : null;
  }

  try {
    const prisma = await getPrismaClient();
    if (!prisma) return null;
    const post = await prisma.post.findUnique({ where: { slug: cleanSlug } });
    if (!post || post.status !== "PUBLISHED") {
      return null;
    }
    return post;
  } catch {
    return null;
  }
}

export async function getPublishedProjectBySlug(slug: string) {
  const cleanSlug = slug.trim();
  if (!cleanSlug) {
    return null;
  }

  if (getBackendApiOrigin()) {
    const project = await fetchBackendJson<BackendProject | null>(`/api/public/projects/${encodeURIComponent(cleanSlug)}`);
    return project ? deserializeProject(project) : null;
  }

  try {
    const prisma = await getPrismaClient();
    if (!prisma) return null;
    const project = await prisma.project.findUnique({ where: { slug: cleanSlug } });
    if (!project || project.status !== "PUBLISHED") {
      return null;
    }
    return project;
  } catch {
    return null;
  }
}

export async function getPublishedPostSitemapEntries(): Promise<PostSitemapEntry[]> {
  if (getBackendApiOrigin()) {
    const entries = await fetchBackendJson<Array<{ slug: string; updatedAt: string }>>("/api/public/posts/sitemap");
    return (entries ?? []).map((entry) => ({
      slug: entry.slug,
      updatedAt: toDate(entry.updatedAt) ?? new Date(0)
    }));
  }

  try {
    const prisma = await getPrismaClient();
    if (!prisma) return [];
    return await prisma.post.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" }
    });
  } catch {
    return [];
  }
}

export async function getPublishedProjectSitemapEntries(): Promise<ProjectSitemapEntry[]> {
  if (getBackendApiOrigin()) {
    const entries = await fetchBackendJson<Array<{ slug: string; updatedAt: string }>>("/api/public/projects/sitemap");
    return (entries ?? []).map((entry) => ({
      slug: entry.slug,
      updatedAt: toDate(entry.updatedAt) ?? new Date(0)
    }));
  }

  try {
    const prisma = await getPrismaClient();
    if (!prisma) return [];
    return await prisma.project.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" }
    });
  } catch {
    return [];
  }
}
