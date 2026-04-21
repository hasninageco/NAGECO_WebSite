import { PrismaClient } from "@prisma/client";

function readEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function createClient(url) {
  return new PrismaClient({
    datasources: {
      db: { url }
    },
    log: ["warn", "error"]
  });
}

function mapRequiredUserId(rawUserId, targetUserIds, fallbackUserId) {
  if (rawUserId && targetUserIds.has(rawUserId)) {
    return rawUserId;
  }
  return fallbackUserId;
}

function mapOptionalUserId(rawUserId, targetUserIds) {
  if (!rawUserId) {
    return null;
  }
  return targetUserIds.has(rawUserId) ? rawUserId : null;
}

async function resolveFallbackUserId(target) {
  const preferredEmail =
    process.env.FALLBACK_USER_EMAIL?.trim().toLowerCase() ||
    process.env.ADMIN_EMAIL?.trim().toLowerCase() ||
    null;

  if (preferredEmail) {
    const byEmail = await target.user.findUnique({
      where: { email: preferredEmail },
      select: { id: true, email: true }
    });

    if (byEmail) {
      console.log(`[sync-no-users] Using fallback user by email: ${byEmail.email}`);
      return byEmail.id;
    }
  }

  const firstAdmin = await target.user.findFirst({
    where: { role: "ADMIN" },
    orderBy: { createdAt: "asc" },
    select: { id: true, email: true }
  });

  if (firstAdmin) {
    console.log(`[sync-no-users] Using first ADMIN fallback user: ${firstAdmin.email}`);
    return firstAdmin.id;
  }

  const firstUser = await target.user.findFirst({
    orderBy: { createdAt: "asc" },
    select: { id: true, email: true }
  });

  if (firstUser) {
    console.log(`[sync-no-users] Using first user fallback: ${firstUser.email}`);
    return firstUser.id;
  }

  throw new Error(
    "Target database has no users. Create at least one user first, then rerun sync."
  );
}

async function syncSiteSettings(source, target) {
  const rows = await source.siteSettings.findMany();
  for (const row of rows) {
    await target.siteSettings.upsert({
      where: { id: row.id },
      create: {
        id: row.id,
        brandName: row.brandName,
        brandNameAr: row.brandNameAr,
        tagline: row.tagline,
        taglineAr: row.taglineAr,
        phones: row.phones,
        emails: row.emails,
        address: row.address,
        addressAr: row.addressAr,
        whatsapp: row.whatsapp,
        mapEmbedUrl: row.mapEmbedUrl,
        socialLinksJson: row.socialLinksJson,
        defaultSeoTitle: row.defaultSeoTitle,
        defaultSeoTitleAr: row.defaultSeoTitleAr,
        defaultSeoDescription: row.defaultSeoDescription,
        defaultSeoDescriptionAr: row.defaultSeoDescriptionAr,
        defaultOgImage: row.defaultOgImage,
        updatedAt: row.updatedAt,
        createdById: row.createdById,
        updatedById: row.updatedById
      },
      update: {
        brandName: row.brandName,
        brandNameAr: row.brandNameAr,
        tagline: row.tagline,
        taglineAr: row.taglineAr,
        phones: row.phones,
        emails: row.emails,
        address: row.address,
        addressAr: row.addressAr,
        whatsapp: row.whatsapp,
        mapEmbedUrl: row.mapEmbedUrl,
        socialLinksJson: row.socialLinksJson,
        defaultSeoTitle: row.defaultSeoTitle,
        defaultSeoTitleAr: row.defaultSeoTitleAr,
        defaultSeoDescription: row.defaultSeoDescription,
        defaultSeoDescriptionAr: row.defaultSeoDescriptionAr,
        defaultOgImage: row.defaultOgImage,
        updatedAt: row.updatedAt,
        createdById: row.createdById,
        updatedById: row.updatedById
      }
    });
  }
  return rows.length;
}

async function syncPageContent(source, target) {
  const rows = await source.pageContent.findMany();
  for (const row of rows) {
    await target.pageContent.upsert({
      where: { key: row.key },
      create: {
        id: row.id,
        key: row.key,
        sectionsJson: row.sectionsJson,
        seoTitle: row.seoTitle,
        seoDescription: row.seoDescription,
        updatedAt: row.updatedAt,
        createdById: row.createdById,
        updatedById: row.updatedById
      },
      update: {
        sectionsJson: row.sectionsJson,
        seoTitle: row.seoTitle,
        seoDescription: row.seoDescription,
        updatedAt: row.updatedAt,
        createdById: row.createdById,
        updatedById: row.updatedById
      }
    });
  }
  return rows.length;
}

async function syncMedia(source, target, targetUserIds, fallbackUserId) {
  const rows = await source.media.findMany();
  for (const row of rows) {
    const uploadedById = mapRequiredUserId(row.uploadedById, targetUserIds, fallbackUserId);
    await target.media.upsert({
      where: { id: row.id },
      create: {
        id: row.id,
        fileName: row.fileName,
        url: row.url,
        mimeType: row.mimeType,
        size: row.size,
        createdAt: row.createdAt,
        uploadedById
      },
      update: {
        fileName: row.fileName,
        url: row.url,
        mimeType: row.mimeType,
        size: row.size,
        createdAt: row.createdAt,
        uploadedById
      }
    });
  }
  return rows.length;
}

async function syncPosts(source, target, targetUserIds, fallbackUserId) {
  const rows = await source.post.findMany();
  for (const row of rows) {
    const authorId = mapRequiredUserId(row.authorId, targetUserIds, fallbackUserId);
    const createdById = mapOptionalUserId(row.createdById, targetUserIds);
    const updatedById = mapOptionalUserId(row.updatedById, targetUserIds);

    await target.post.upsert({
      where: { slug: row.slug },
      create: {
        id: row.id,
        title: row.title,
        titleAr: row.titleAr,
        slug: row.slug,
        excerpt: row.excerpt,
        excerptAr: row.excerptAr,
        contentHtml: row.contentHtml,
        contentHtmlAr: row.contentHtmlAr,
        coverImageUrl: row.coverImageUrl,
        status: row.status,
        publishedAt: row.publishedAt,
        tags: row.tags,
        seoTitle: row.seoTitle,
        seoTitleAr: row.seoTitleAr,
        seoDescription: row.seoDescription,
        seoDescriptionAr: row.seoDescriptionAr,
        ogImageUrl: row.ogImageUrl,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        authorId,
        createdById,
        updatedById
      },
      update: {
        title: row.title,
        titleAr: row.titleAr,
        excerpt: row.excerpt,
        excerptAr: row.excerptAr,
        contentHtml: row.contentHtml,
        contentHtmlAr: row.contentHtmlAr,
        coverImageUrl: row.coverImageUrl,
        status: row.status,
        publishedAt: row.publishedAt,
        tags: row.tags,
        seoTitle: row.seoTitle,
        seoTitleAr: row.seoTitleAr,
        seoDescription: row.seoDescription,
        seoDescriptionAr: row.seoDescriptionAr,
        ogImageUrl: row.ogImageUrl,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        authorId,
        createdById,
        updatedById
      }
    });
  }
  return rows.length;
}

async function syncProjects(source, target, targetUserIds, fallbackUserId) {
  const rows = await source.project.findMany();
  for (const row of rows) {
    const createdById = mapOptionalUserId(row.createdById, targetUserIds) ?? fallbackUserId;
    const updatedById = mapOptionalUserId(row.updatedById, targetUserIds);

    await target.project.upsert({
      where: { slug: row.slug },
      create: {
        id: row.id,
        title: row.title,
        titleAr: row.titleAr,
        slug: row.slug,
        summary: row.summary,
        summaryAr: row.summaryAr,
        challenge: row.challenge,
        challengeAr: row.challengeAr,
        approach: row.approach,
        approachAr: row.approachAr,
        methods: row.methods,
        methodsAr: row.methodsAr,
        deliverables: row.deliverables,
        deliverablesAr: row.deliverablesAr,
        outcome: row.outcome,
        outcomeAr: row.outcomeAr,
        year: row.year,
        country: row.country,
        countryAr: row.countryAr,
        industry: row.industry,
        industryAr: row.industryAr,
        mapX: row.mapX,
        mapY: row.mapY,
        coverImageUrl: row.coverImageUrl,
        gallery: row.gallery,
        status: row.status,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        createdById,
        updatedById
      },
      update: {
        title: row.title,
        titleAr: row.titleAr,
        summary: row.summary,
        summaryAr: row.summaryAr,
        challenge: row.challenge,
        challengeAr: row.challengeAr,
        approach: row.approach,
        approachAr: row.approachAr,
        methods: row.methods,
        methodsAr: row.methodsAr,
        deliverables: row.deliverables,
        deliverablesAr: row.deliverablesAr,
        outcome: row.outcome,
        outcomeAr: row.outcomeAr,
        year: row.year,
        country: row.country,
        countryAr: row.countryAr,
        industry: row.industry,
        industryAr: row.industryAr,
        mapX: row.mapX,
        mapY: row.mapY,
        coverImageUrl: row.coverImageUrl,
        gallery: row.gallery,
        status: row.status,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        createdById,
        updatedById
      }
    });
  }
  return rows.length;
}

async function syncTenders(source, target, targetUserIds, fallbackUserId) {
  const rows = await source.tender.findMany();
  for (const row of rows) {
    const createdById = mapOptionalUserId(row.createdById, targetUserIds) ?? fallbackUserId;
    const updatedById = mapOptionalUserId(row.updatedById, targetUserIds);

    await target.tender.upsert({
      where: { slug: row.slug },
      create: {
        id: row.id,
        title: row.title,
        titleAr: row.titleAr,
        slug: row.slug,
        summary: row.summary,
        summaryAr: row.summaryAr,
        imageUrls: row.imageUrls,
        documentUrls: row.documentUrls,
        status: row.status,
        publishedAt: row.publishedAt,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        createdById,
        updatedById
      },
      update: {
        title: row.title,
        titleAr: row.titleAr,
        summary: row.summary,
        summaryAr: row.summaryAr,
        imageUrls: row.imageUrls,
        documentUrls: row.documentUrls,
        status: row.status,
        publishedAt: row.publishedAt,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        createdById,
        updatedById
      }
    });
  }
  return rows.length;
}

async function main() {
  const sourceUrl = readEnv("SOURCE_DATABASE_URL");
  const targetUrl = readEnv("TARGET_DATABASE_URL");

  if (sourceUrl === targetUrl && process.env.ALLOW_SAME_DATABASE !== "1") {
    throw new Error(
      "SOURCE_DATABASE_URL and TARGET_DATABASE_URL are the same. Set ALLOW_SAME_DATABASE=1 to override."
    );
  }

  const source = createClient(sourceUrl);
  const target = createClient(targetUrl);

  try {
    console.log("[sync-no-users] Starting data sync (User table will not be modified)");

    const targetUsers = await target.user.findMany({
      select: { id: true }
    });
    const targetUserIds = new Set(targetUsers.map((user) => user.id));
    const fallbackUserId = await resolveFallbackUserId(target);

    const counters = {
      siteSettings: await syncSiteSettings(source, target),
      pageContent: await syncPageContent(source, target),
      media: await syncMedia(source, target, targetUserIds, fallbackUserId),
      posts: await syncPosts(source, target, targetUserIds, fallbackUserId),
      projects: await syncProjects(source, target, targetUserIds, fallbackUserId),
      tenders: await syncTenders(source, target, targetUserIds, fallbackUserId)
    };

    console.log("[sync-no-users] Done");
    console.log(`[sync-no-users] SiteSettings: ${counters.siteSettings}`);
    console.log(`[sync-no-users] PageContent: ${counters.pageContent}`);
    console.log(`[sync-no-users] Media: ${counters.media}`);
    console.log(`[sync-no-users] Posts: ${counters.posts}`);
    console.log(`[sync-no-users] Projects: ${counters.projects}`);
    console.log(`[sync-no-users] Tenders: ${counters.tenders}`);
  } finally {
    await Promise.allSettled([source.$disconnect(), target.$disconnect()]);
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[sync-no-users] Failed: ${message}`);
  process.exit(1);
});
