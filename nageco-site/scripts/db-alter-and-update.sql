BEGIN;

-- PostgreSQL 9.2 compatible schema patch + data backfill

-- 1) Ensure enum types exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Role') THEN
    CREATE TYPE "Role" AS ENUM ('ADMIN', 'EDITOR', 'VIEWER');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'PostStatus') THEN
    CREATE TYPE "PostStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ProjectStatus') THEN
    CREATE TYPE "ProjectStatus" AS ENUM ('DRAFT', 'PUBLISHED');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'TenderStatus') THEN
    CREATE TYPE "TenderStatus" AS ENUM ('DRAFT', 'PUBLISHED');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'PageKey') THEN
    CREATE TYPE "PageKey" AS ENUM (
      'HOME',
      'ABOUT',
      'SERVICES',
      'HSE',
      'CAPABILITIES',
      'INDUSTRIES',
      'CAREER',
      'PARTNER',
      'CREW',
      'CONTACT',
      'NEWS',
      'TERMS',
      'PRIVACY'
    );
  END IF;
END $$;

-- 2) Ensure base tables exist (minimal shape)
CREATE TABLE IF NOT EXISTS public."User" (
  "id" TEXT PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS public."Post" (
  "id" TEXT PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS public."Project" (
  "id" TEXT PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS public."Tender" (
  "id" TEXT PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS public."PageContent" (
  "id" TEXT PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS public."SiteSettings" (
  "id" TEXT PRIMARY KEY DEFAULT 'singleton'
);

CREATE TABLE IF NOT EXISTS public."Media" (
  "id" TEXT PRIMARY KEY
);

-- 3) Add missing columns (PG 9.2 style)
DO $$
BEGIN
  -- User
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='User' AND column_name='name') THEN
    EXECUTE 'ALTER TABLE public."User" ADD COLUMN "name" TEXT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='User' AND column_name='email') THEN
    EXECUTE 'ALTER TABLE public."User" ADD COLUMN "email" TEXT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='User' AND column_name='passwordHash') THEN
    EXECUTE 'ALTER TABLE public."User" ADD COLUMN "passwordHash" TEXT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='User' AND column_name='role') THEN
    EXECUTE 'ALTER TABLE public."User" ADD COLUMN "role" "Role" DEFAULT ''VIEWER''';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='User' AND column_name='createdAt') THEN
    EXECUTE 'ALTER TABLE public."User" ADD COLUMN "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='User' AND column_name='updatedAt') THEN
    EXECUTE 'ALTER TABLE public."User" ADD COLUMN "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP';
  END IF;

  -- Post
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Post' AND column_name='title') THEN
    EXECUTE 'ALTER TABLE public."Post" ADD COLUMN "title" TEXT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Post' AND column_name='titleAr') THEN
    EXECUTE 'ALTER TABLE public."Post" ADD COLUMN "titleAr" TEXT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Post' AND column_name='slug') THEN
    EXECUTE 'ALTER TABLE public."Post" ADD COLUMN "slug" TEXT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Post' AND column_name='excerpt') THEN
    EXECUTE 'ALTER TABLE public."Post" ADD COLUMN "excerpt" TEXT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Post' AND column_name='excerptAr') THEN
    EXECUTE 'ALTER TABLE public."Post" ADD COLUMN "excerptAr" TEXT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Post' AND column_name='contentHtml') THEN
    EXECUTE 'ALTER TABLE public."Post" ADD COLUMN "contentHtml" TEXT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Post' AND column_name='contentHtmlAr') THEN
    EXECUTE 'ALTER TABLE public."Post" ADD COLUMN "contentHtmlAr" TEXT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Post' AND column_name='coverImageUrl') THEN
    EXECUTE 'ALTER TABLE public."Post" ADD COLUMN "coverImageUrl" TEXT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Post' AND column_name='status') THEN
    EXECUTE 'ALTER TABLE public."Post" ADD COLUMN "status" "PostStatus" DEFAULT ''DRAFT''';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Post' AND column_name='publishedAt') THEN
    EXECUTE 'ALTER TABLE public."Post" ADD COLUMN "publishedAt" TIMESTAMP(3)';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Post' AND column_name='tags') THEN
    EXECUTE 'ALTER TABLE public."Post" ADD COLUMN "tags" TEXT[] DEFAULT ARRAY[]::TEXT[]';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Post' AND column_name='seoTitle') THEN
    EXECUTE 'ALTER TABLE public."Post" ADD COLUMN "seoTitle" TEXT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Post' AND column_name='seoTitleAr') THEN
    EXECUTE 'ALTER TABLE public."Post" ADD COLUMN "seoTitleAr" TEXT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Post' AND column_name='seoDescription') THEN
    EXECUTE 'ALTER TABLE public."Post" ADD COLUMN "seoDescription" TEXT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Post' AND column_name='seoDescriptionAr') THEN
    EXECUTE 'ALTER TABLE public."Post" ADD COLUMN "seoDescriptionAr" TEXT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Post' AND column_name='ogImageUrl') THEN
    EXECUTE 'ALTER TABLE public."Post" ADD COLUMN "ogImageUrl" TEXT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Post' AND column_name='createdAt') THEN
    EXECUTE 'ALTER TABLE public."Post" ADD COLUMN "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Post' AND column_name='updatedAt') THEN
    EXECUTE 'ALTER TABLE public."Post" ADD COLUMN "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Post' AND column_name='authorId') THEN
    EXECUTE 'ALTER TABLE public."Post" ADD COLUMN "authorId" TEXT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Post' AND column_name='createdById') THEN
    EXECUTE 'ALTER TABLE public."Post" ADD COLUMN "createdById" TEXT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Post' AND column_name='updatedById') THEN
    EXECUTE 'ALTER TABLE public."Post" ADD COLUMN "updatedById" TEXT';
  END IF;

  -- Project
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Project' AND column_name='title') THEN
    EXECUTE 'ALTER TABLE public."Project" ADD COLUMN "title" TEXT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Project' AND column_name='titleAr') THEN
    EXECUTE 'ALTER TABLE public."Project" ADD COLUMN "titleAr" TEXT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Project' AND column_name='slug') THEN
    EXECUTE 'ALTER TABLE public."Project" ADD COLUMN "slug" TEXT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Project' AND column_name='summary') THEN
    EXECUTE 'ALTER TABLE public."Project" ADD COLUMN "summary" TEXT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Project' AND column_name='summaryAr') THEN
    EXECUTE 'ALTER TABLE public."Project" ADD COLUMN "summaryAr" TEXT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Project' AND column_name='challenge') THEN
    EXECUTE 'ALTER TABLE public."Project" ADD COLUMN "challenge" TEXT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Project' AND column_name='challengeAr') THEN
    EXECUTE 'ALTER TABLE public."Project" ADD COLUMN "challengeAr" TEXT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Project' AND column_name='approach') THEN
    EXECUTE 'ALTER TABLE public."Project" ADD COLUMN "approach" TEXT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Project' AND column_name='approachAr') THEN
    EXECUTE 'ALTER TABLE public."Project" ADD COLUMN "approachAr" TEXT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Project' AND column_name='methods') THEN
    EXECUTE 'ALTER TABLE public."Project" ADD COLUMN "methods" TEXT[] DEFAULT ARRAY[]::TEXT[]';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Project' AND column_name='methodsAr') THEN
    EXECUTE 'ALTER TABLE public."Project" ADD COLUMN "methodsAr" TEXT[] DEFAULT ARRAY[]::TEXT[]';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Project' AND column_name='deliverables') THEN
    EXECUTE 'ALTER TABLE public."Project" ADD COLUMN "deliverables" TEXT[] DEFAULT ARRAY[]::TEXT[]';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Project' AND column_name='deliverablesAr') THEN
    EXECUTE 'ALTER TABLE public."Project" ADD COLUMN "deliverablesAr" TEXT[] DEFAULT ARRAY[]::TEXT[]';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Project' AND column_name='outcome') THEN
    EXECUTE 'ALTER TABLE public."Project" ADD COLUMN "outcome" TEXT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Project' AND column_name='outcomeAr') THEN
    EXECUTE 'ALTER TABLE public."Project" ADD COLUMN "outcomeAr" TEXT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Project' AND column_name='year') THEN
    EXECUTE 'ALTER TABLE public."Project" ADD COLUMN "year" INTEGER';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Project' AND column_name='country') THEN
    EXECUTE 'ALTER TABLE public."Project" ADD COLUMN "country" TEXT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Project' AND column_name='countryAr') THEN
    EXECUTE 'ALTER TABLE public."Project" ADD COLUMN "countryAr" TEXT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Project' AND column_name='industry') THEN
    EXECUTE 'ALTER TABLE public."Project" ADD COLUMN "industry" TEXT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Project' AND column_name='industryAr') THEN
    EXECUTE 'ALTER TABLE public."Project" ADD COLUMN "industryAr" TEXT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Project' AND column_name='mapX') THEN
    EXECUTE 'ALTER TABLE public."Project" ADD COLUMN "mapX" DOUBLE PRECISION';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Project' AND column_name='mapY') THEN
    EXECUTE 'ALTER TABLE public."Project" ADD COLUMN "mapY" DOUBLE PRECISION';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Project' AND column_name='coverImageUrl') THEN
    EXECUTE 'ALTER TABLE public."Project" ADD COLUMN "coverImageUrl" TEXT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Project' AND column_name='gallery') THEN
    EXECUTE 'ALTER TABLE public."Project" ADD COLUMN "gallery" TEXT[] DEFAULT ARRAY[]::TEXT[]';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Project' AND column_name='status') THEN
    EXECUTE 'ALTER TABLE public."Project" ADD COLUMN "status" "ProjectStatus" DEFAULT ''DRAFT''';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Project' AND column_name='createdAt') THEN
    EXECUTE 'ALTER TABLE public."Project" ADD COLUMN "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Project' AND column_name='updatedAt') THEN
    EXECUTE 'ALTER TABLE public."Project" ADD COLUMN "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Project' AND column_name='createdById') THEN
    EXECUTE 'ALTER TABLE public."Project" ADD COLUMN "createdById" TEXT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Project' AND column_name='updatedById') THEN
    EXECUTE 'ALTER TABLE public."Project" ADD COLUMN "updatedById" TEXT';
  END IF;

  -- Tender
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Tender' AND column_name='title') THEN
    EXECUTE 'ALTER TABLE public."Tender" ADD COLUMN "title" TEXT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Tender' AND column_name='titleAr') THEN
    EXECUTE 'ALTER TABLE public."Tender" ADD COLUMN "titleAr" TEXT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Tender' AND column_name='slug') THEN
    EXECUTE 'ALTER TABLE public."Tender" ADD COLUMN "slug" TEXT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Tender' AND column_name='summary') THEN
    EXECUTE 'ALTER TABLE public."Tender" ADD COLUMN "summary" TEXT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Tender' AND column_name='summaryAr') THEN
    EXECUTE 'ALTER TABLE public."Tender" ADD COLUMN "summaryAr" TEXT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Tender' AND column_name='imageUrls') THEN
    EXECUTE 'ALTER TABLE public."Tender" ADD COLUMN "imageUrls" TEXT[] DEFAULT ARRAY[]::TEXT[]';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Tender' AND column_name='documentUrls') THEN
    EXECUTE 'ALTER TABLE public."Tender" ADD COLUMN "documentUrls" TEXT[] DEFAULT ARRAY[]::TEXT[]';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Tender' AND column_name='status') THEN
    EXECUTE 'ALTER TABLE public."Tender" ADD COLUMN "status" "TenderStatus" DEFAULT ''DRAFT''';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Tender' AND column_name='publishedAt') THEN
    EXECUTE 'ALTER TABLE public."Tender" ADD COLUMN "publishedAt" TIMESTAMP(3)';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Tender' AND column_name='createdAt') THEN
    EXECUTE 'ALTER TABLE public."Tender" ADD COLUMN "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Tender' AND column_name='updatedAt') THEN
    EXECUTE 'ALTER TABLE public."Tender" ADD COLUMN "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Tender' AND column_name='createdById') THEN
    EXECUTE 'ALTER TABLE public."Tender" ADD COLUMN "createdById" TEXT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Tender' AND column_name='updatedById') THEN
    EXECUTE 'ALTER TABLE public."Tender" ADD COLUMN "updatedById" TEXT';
  END IF;

  -- PageContent
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='PageContent' AND column_name='key') THEN
    EXECUTE 'ALTER TABLE public."PageContent" ADD COLUMN "key" "PageKey"';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='PageContent' AND column_name='sectionsJson') THEN
    EXECUTE 'ALTER TABLE public."PageContent" ADD COLUMN "sectionsJson" JSON';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='PageContent' AND column_name='seoTitle') THEN
    EXECUTE 'ALTER TABLE public."PageContent" ADD COLUMN "seoTitle" TEXT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='PageContent' AND column_name='seoDescription') THEN
    EXECUTE 'ALTER TABLE public."PageContent" ADD COLUMN "seoDescription" TEXT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='PageContent' AND column_name='updatedAt') THEN
    EXECUTE 'ALTER TABLE public."PageContent" ADD COLUMN "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='PageContent' AND column_name='createdById') THEN
    EXECUTE 'ALTER TABLE public."PageContent" ADD COLUMN "createdById" TEXT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='PageContent' AND column_name='updatedById') THEN
    EXECUTE 'ALTER TABLE public."PageContent" ADD COLUMN "updatedById" TEXT';
  END IF;

  -- SiteSettings
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='SiteSettings' AND column_name='brandName') THEN
    EXECUTE 'ALTER TABLE public."SiteSettings" ADD COLUMN "brandName" TEXT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='SiteSettings' AND column_name='brandNameAr') THEN
    EXECUTE 'ALTER TABLE public."SiteSettings" ADD COLUMN "brandNameAr" TEXT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='SiteSettings' AND column_name='tagline') THEN
    EXECUTE 'ALTER TABLE public."SiteSettings" ADD COLUMN "tagline" TEXT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='SiteSettings' AND column_name='taglineAr') THEN
    EXECUTE 'ALTER TABLE public."SiteSettings" ADD COLUMN "taglineAr" TEXT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='SiteSettings' AND column_name='phones') THEN
    EXECUTE 'ALTER TABLE public."SiteSettings" ADD COLUMN "phones" TEXT[] DEFAULT ARRAY[]::TEXT[]';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='SiteSettings' AND column_name='emails') THEN
    EXECUTE 'ALTER TABLE public."SiteSettings" ADD COLUMN "emails" TEXT[] DEFAULT ARRAY[]::TEXT[]';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='SiteSettings' AND column_name='address') THEN
    EXECUTE 'ALTER TABLE public."SiteSettings" ADD COLUMN "address" TEXT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='SiteSettings' AND column_name='addressAr') THEN
    EXECUTE 'ALTER TABLE public."SiteSettings" ADD COLUMN "addressAr" TEXT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='SiteSettings' AND column_name='whatsapp') THEN
    EXECUTE 'ALTER TABLE public."SiteSettings" ADD COLUMN "whatsapp" TEXT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='SiteSettings' AND column_name='mapEmbedUrl') THEN
    EXECUTE 'ALTER TABLE public."SiteSettings" ADD COLUMN "mapEmbedUrl" TEXT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='SiteSettings' AND column_name='socialLinksJson') THEN
    EXECUTE 'ALTER TABLE public."SiteSettings" ADD COLUMN "socialLinksJson" JSON';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='SiteSettings' AND column_name='defaultSeoTitle') THEN
    EXECUTE 'ALTER TABLE public."SiteSettings" ADD COLUMN "defaultSeoTitle" TEXT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='SiteSettings' AND column_name='defaultSeoTitleAr') THEN
    EXECUTE 'ALTER TABLE public."SiteSettings" ADD COLUMN "defaultSeoTitleAr" TEXT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='SiteSettings' AND column_name='defaultSeoDescription') THEN
    EXECUTE 'ALTER TABLE public."SiteSettings" ADD COLUMN "defaultSeoDescription" TEXT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='SiteSettings' AND column_name='defaultSeoDescriptionAr') THEN
    EXECUTE 'ALTER TABLE public."SiteSettings" ADD COLUMN "defaultSeoDescriptionAr" TEXT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='SiteSettings' AND column_name='defaultOgImage') THEN
    EXECUTE 'ALTER TABLE public."SiteSettings" ADD COLUMN "defaultOgImage" TEXT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='SiteSettings' AND column_name='updatedAt') THEN
    EXECUTE 'ALTER TABLE public."SiteSettings" ADD COLUMN "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='SiteSettings' AND column_name='createdById') THEN
    EXECUTE 'ALTER TABLE public."SiteSettings" ADD COLUMN "createdById" TEXT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='SiteSettings' AND column_name='updatedById') THEN
    EXECUTE 'ALTER TABLE public."SiteSettings" ADD COLUMN "updatedById" TEXT';
  END IF;

  -- Media
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Media' AND column_name='fileName') THEN
    EXECUTE 'ALTER TABLE public."Media" ADD COLUMN "fileName" TEXT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Media' AND column_name='url') THEN
    EXECUTE 'ALTER TABLE public."Media" ADD COLUMN "url" TEXT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Media' AND column_name='mimeType') THEN
    EXECUTE 'ALTER TABLE public."Media" ADD COLUMN "mimeType" TEXT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Media' AND column_name='size') THEN
    EXECUTE 'ALTER TABLE public."Media" ADD COLUMN "size" INTEGER';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Media' AND column_name='createdAt') THEN
    EXECUTE 'ALTER TABLE public."Media" ADD COLUMN "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Media' AND column_name='uploadedById') THEN
    EXECUTE 'ALTER TABLE public."Media" ADD COLUMN "uploadedById" TEXT';
  END IF;
END $$;

-- 4) Backfill new language columns from existing base columns
UPDATE public."SiteSettings"
SET
  "brandNameAr" = COALESCE("brandNameAr", "brandName"),
  "taglineAr" = COALESCE("taglineAr", "tagline"),
  "addressAr" = COALESCE("addressAr", "address"),
  "defaultSeoTitleAr" = COALESCE("defaultSeoTitleAr", "defaultSeoTitle"),
  "defaultSeoDescriptionAr" = COALESCE("defaultSeoDescriptionAr", "defaultSeoDescription");

UPDATE public."Post"
SET
  "titleAr" = COALESCE("titleAr", "title"),
  "excerptAr" = COALESCE("excerptAr", "excerpt"),
  "contentHtmlAr" = COALESCE("contentHtmlAr", "contentHtml"),
  "seoTitleAr" = COALESCE("seoTitleAr", "seoTitle"),
  "seoDescriptionAr" = COALESCE("seoDescriptionAr", "seoDescription"),
  "tags" = COALESCE("tags", ARRAY[]::TEXT[]),
  "status" = COALESCE("status", 'DRAFT');

UPDATE public."Project"
SET
  "titleAr" = COALESCE("titleAr", "title"),
  "summaryAr" = COALESCE("summaryAr", "summary"),
  "challengeAr" = COALESCE("challengeAr", "challenge"),
  "approachAr" = COALESCE("approachAr", "approach"),
  "outcomeAr" = COALESCE("outcomeAr", "outcome"),
  "countryAr" = COALESCE("countryAr", "country"),
  "industryAr" = COALESCE("industryAr", "industry"),
  "methodsAr" = COALESCE("methodsAr", "methods", ARRAY[]::TEXT[]),
  "deliverablesAr" = COALESCE("deliverablesAr", "deliverables", ARRAY[]::TEXT[]),
  "gallery" = COALESCE("gallery", ARRAY[]::TEXT[]),
  "status" = COALESCE("status", 'DRAFT');

UPDATE public."Tender"
SET
  "titleAr" = COALESCE("titleAr", "title"),
  "summaryAr" = COALESCE("summaryAr", "summary"),
  "imageUrls" = COALESCE("imageUrls", ARRAY[]::TEXT[]),
  "documentUrls" = COALESCE("documentUrls", ARRAY[]::TEXT[]),
  "status" = COALESCE("status", 'DRAFT');

-- 5) Ensure singleton settings row exists (PG 9.2 compatible)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public."SiteSettings" WHERE "id" = 'singleton') THEN
    INSERT INTO public."SiteSettings" (
      "id",
      "brandName",
      "tagline",
      "phones",
      "emails",
      "socialLinksJson",
      "updatedAt"
    )
    VALUES (
      'singleton',
      'NAGECO',
      'Geophysical exploration and subsurface intelligence',
      ARRAY[]::TEXT[],
      ARRAY[]::TEXT[],
      '{}'::JSON,
      NOW()
    );
  END IF;
END $$;

COMMIT;
