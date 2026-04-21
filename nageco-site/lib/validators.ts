import { PostStatus, ProjectStatus, Role, TenderStatus } from "@prisma/client";
import { z } from "zod";

const mediaUrlSchema = z
  .string()
  .trim()
  .refine(
    (value) => {
      if (!value) return true;
      if (value.startsWith("/")) return true;

      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },
    { message: "Enter a valid URL or a local path like /uploads/file.jpg" }
  );

const externalUrlSchema = z
  .string()
  .trim()
  .refine(
    (value) => {
      try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:";
      } catch {
        return false;
      }
    },
    { message: "Enter a valid external URL starting with http:// or https://" }
  );

const importantLinkSchema = z.object({
  nameAr: z.string().trim().min(1, "Arabic name is required"),
  nameEn: z.string().trim().min(1, "English name is required"),
  url: externalUrlSchema,
  logo: mediaUrlSchema.optional(),
  label: z.string().trim().optional()
});

const ourTeamMemberSchema = z.object({
  nameEn: z.string().trim().min(1, "English team member name is required"),
  nameAr: z.string().trim().min(1, "Arabic team member name is required"),
  positionEn: z.string().trim().min(1, "English team member position is required"),
  positionAr: z.string().trim().min(1, "Arabic team member position is required"),
  shortDefinitionEn: z.string().trim().min(1, "English team member short definition is required"),
  shortDefinitionAr: z.string().trim().min(1, "Arabic team member short definition is required"),
  image: mediaUrlSchema.optional()
});

const optionalLocalizedShortText = (minLength: number, minMessage: string, maxLength: number, maxMessage: string) =>
  z
    .string()
    .trim()
    .max(maxLength, maxMessage)
    .or(z.literal(""))
    .optional()
    .refine((value) => !value || value.length === 0 || value.length >= minLength, minMessage)
    .transform((value) => (value && value.trim().length > 0 ? value.trim() : undefined));

const optionalLocalizedText = (minLength: number, minMessage: string) =>
  z
    .string()
    .trim()
    .or(z.literal(""))
    .optional()
    .refine((value) => !value || value.length === 0 || value.length >= minLength, minMessage)
    .transform((value) => (value && value.trim().length > 0 ? value.trim() : undefined));

const optionalTrimmedString = z
  .string()
  .trim()
  .or(z.literal(""))
  .optional()
  .transform((value) => (value && value.trim().length > 0 ? value.trim() : undefined));

const socialLinksSchema = z
  .object({
    importantLinks: z.array(importantLinkSchema).default([]),
    ourTeam: z.array(ourTeamMemberSchema).default([])
  })
  .catchall(z.any());

export const postSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters"),
  titleAr: optionalLocalizedShortText(3, "Arabic title must be at least 3 characters", 200, "Arabic title must be less than 200 characters"),
  slug: z.string().trim().min(3, "Slug must be at least 3 characters"),
  excerpt: z.string().trim().min(10, "Excerpt must be at least 10 characters"),
  excerptAr: optionalLocalizedText(10, "Arabic excerpt must be at least 10 characters"),
  contentHtml: z.string().trim().min(1, "Content is required"),
  contentHtmlAr: optionalLocalizedText(1, "Arabic content is required"),
  coverImageUrl: mediaUrlSchema.optional(),
  tags: z.array(z.string()).default([]),
  status: z.nativeEnum(PostStatus),
  seoTitle: optionalTrimmedString,
  seoTitleAr: optionalTrimmedString,
  seoDescription: optionalTrimmedString,
  seoDescriptionAr: optionalTrimmedString,
  ogImageUrl: mediaUrlSchema.optional()
});

export const projectSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters"),
  titleAr: optionalLocalizedShortText(3, "Arabic title must be at least 3 characters", 200, "Arabic title must be less than 200 characters"),
  slug: z.string().trim().min(3, "Slug must be at least 3 characters"),
  summary: z.string().trim().min(10, "Summary must be at least 10 characters"),
  summaryAr: optionalLocalizedText(10, "Arabic summary must be at least 10 characters"),
  challenge: optionalTrimmedString,
  challengeAr: optionalTrimmedString,
  approach: optionalTrimmedString,
  approachAr: optionalTrimmedString,
  methods: z.array(z.string()).default([]),
  methodsAr: z.array(z.string()).default([]),
  deliverables: z.array(z.string()).default([]),
  deliverablesAr: z.array(z.string()).default([]),
  outcome: optionalTrimmedString,
  outcomeAr: optionalTrimmedString,
  year: z.number().int().optional().nullable(),
  country: optionalTrimmedString,
  countryAr: optionalTrimmedString,
  industry: optionalTrimmedString,
  industryAr: optionalTrimmedString,
  mapX: z.number().min(0, "Map X must be between 0 and 100").max(100, "Map X must be between 0 and 100").optional().nullable(),
  mapY: z.number().min(0, "Map Y must be between 0 and 100").max(100, "Map Y must be between 0 and 100").optional().nullable(),
  coverImageUrl: mediaUrlSchema.optional(),
  gallery: z.array(z.string()).default([]),
  status: z.nativeEnum(ProjectStatus)
});

export const tenderSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters"),
  titleAr: optionalLocalizedShortText(3, "Arabic title must be at least 3 characters", 200, "Arabic title must be less than 200 characters"),
  slug: z.string().trim().min(3, "Slug must be at least 3 characters"),
  summary: z.string().trim().min(10, "Summary must be at least 10 characters"),
  summaryAr: optionalLocalizedText(10, "Arabic summary must be at least 10 characters"),
  imageUrls: z.array(mediaUrlSchema).default([]),
  documentUrls: z.array(mediaUrlSchema).default([]),
  status: z.nativeEnum(TenderStatus)
});

export const pageSchema = z.object({
  key: z.enum(["HOME", "ABOUT", "SERVICES", "HSE", "CAPABILITIES", "INDUSTRIES", "CAREER", "PARTNER", "CREW", "CONTACT", "NEWS", "TERMS", "PRIVACY"]),
  sectionsJson: z.record(z.any()),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional()
});

export const settingsSchema = z.object({
  brandName: z.string().min(2),
  brandNameAr: optionalLocalizedText(2, "Arabic brand name must be at least 2 characters"),
  tagline: z.string().min(2),
  taglineAr: optionalLocalizedText(2, "Arabic tagline must be at least 2 characters"),
  phones: z.array(z.string()).default([]),
  emails: z.array(z.string().email()).default([]),
  address: optionalTrimmedString,
  addressAr: optionalTrimmedString,
  whatsapp: optionalTrimmedString,
  mapEmbedUrl: optionalTrimmedString,
  socialLinksJson: socialLinksSchema.default({}),
  defaultSeoTitle: optionalTrimmedString,
  defaultSeoTitleAr: optionalTrimmedString,
  defaultSeoDescription: optionalTrimmedString,
  defaultSeoDescriptionAr: optionalTrimmedString,
  defaultOgImage: optionalTrimmedString
});

export const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.nativeEnum(Role)
});

export const updateUserSchema = z.object({
  role: z.nativeEnum(Role).optional(),
  password: z.string().min(8).optional()
});
