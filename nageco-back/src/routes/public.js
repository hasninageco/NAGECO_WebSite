const express = require("express");

const router = express.Router();
const pageKeys = new Set([
  "HOME",
  "ABOUT",
  "SERVICES",
  "HSE",
  "CAPABILITIES",
  "INDUSTRIES",
  "CAREER",
  "PARTNER",
  "CREW",
  "CONTACT",
  "NEWS",
  "TERMS",
  "PRIVACY"
]);

function getPrismaClient() {
  try {
    return require("../lib/prisma");
  } catch (_error) {
    return null;
  }
}

function resolvePrismaOrServiceUnavailable(res) {
  const prisma = getPrismaClient();
  if (!prisma) {
    res.status(503).json({
      ok: false,
      error: "Database client unavailable"
    });
    return null;
  }

  return prisma;
}

router.get("/site-settings", async (_req, res, next) => {
  try {
    const prisma = resolvePrismaOrServiceUnavailable(res);
    if (!prisma) return;

    const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
    res.json(settings);
  } catch (error) {
    next(error);
  }
});

router.get("/page/:key", async (req, res, next) => {
  try {
    const prisma = resolvePrismaOrServiceUnavailable(res);
    if (!prisma) return;

    const key = typeof req.params.key === "string" ? req.params.key.trim().toUpperCase() : "";
    if (!pageKeys.has(key)) {
      return res.status(400).json({
        ok: false,
        error: "Invalid page key"
      });
    }

    const page = await prisma.pageContent.findUnique({ where: { key } });
    return res.json(page);
  } catch (error) {
    return next(error);
  }
});

router.get("/posts/latest-headline", async (_req, res, next) => {
  try {
    const prisma = resolvePrismaOrServiceUnavailable(res);
    if (!prisma) return;

    const post = await prisma.post.findFirst({
      where: { status: "PUBLISHED" },
      orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
      select: {
        title: true,
        titleAr: true,
        slug: true
      }
    });

    res.json(post);
  } catch (error) {
    next(error);
  }
});

router.get("/posts/sitemap", async (_req, res, next) => {
  try {
    const prisma = resolvePrismaOrServiceUnavailable(res);
    if (!prisma) return;

    const posts = await prisma.post.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" }
    });

    res.json(posts);
  } catch (error) {
    next(error);
  }
});

router.get("/posts/:slug", async (req, res, next) => {
  try {
    const prisma = resolvePrismaOrServiceUnavailable(res);
    if (!prisma) return;

    const slug = typeof req.params.slug === "string" ? req.params.slug.trim() : "";
    if (!slug) {
      return res.status(400).json({
        ok: false,
        error: "Slug is required"
      });
    }

    const post = await prisma.post.findUnique({ where: { slug } });
    if (!post || post.status !== "PUBLISHED") {
      return res.status(404).json({
        ok: false,
        error: "Post not found"
      });
    }

    return res.json(post);
  } catch (error) {
    return next(error);
  }
});

router.get("/posts", async (_req, res, next) => {
  try {
    const prisma = resolvePrismaOrServiceUnavailable(res);
    if (!prisma) return;

    const posts = await prisma.post.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" }
    });

    res.json(posts);
  } catch (error) {
    next(error);
  }
});

router.get("/projects/sitemap", async (_req, res, next) => {
  try {
    const prisma = resolvePrismaOrServiceUnavailable(res);
    if (!prisma) return;

    const projects = await prisma.project.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" }
    });

    res.json(projects);
  } catch (error) {
    next(error);
  }
});

router.get("/projects/:slug", async (req, res, next) => {
  try {
    const prisma = resolvePrismaOrServiceUnavailable(res);
    if (!prisma) return;

    const slug = typeof req.params.slug === "string" ? req.params.slug.trim() : "";
    if (!slug) {
      return res.status(400).json({
        ok: false,
        error: "Slug is required"
      });
    }

    const project = await prisma.project.findUnique({ where: { slug } });
    if (!project || project.status !== "PUBLISHED") {
      return res.status(404).json({
        ok: false,
        error: "Project not found"
      });
    }

    return res.json(project);
  } catch (error) {
    return next(error);
  }
});

router.get("/projects", async (_req, res, next) => {
  try {
    const prisma = resolvePrismaOrServiceUnavailable(res);
    if (!prisma) return;

    const projects = await prisma.project.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { updatedAt: "desc" }
    });

    res.json(projects);
  } catch (error) {
    next(error);
  }
});

router.get("/tenders", async (_req, res, next) => {
  try {
    const prisma = resolvePrismaOrServiceUnavailable(res);
    if (!prisma) return;

    const tenders = await prisma.tender.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }]
    });

    res.json(tenders);
  } catch (error) {
    next(error);
  }
});

module.exports = router;