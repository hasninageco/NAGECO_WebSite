import type { SiteLocale } from "@/lib/site-locale";

export const pageKeys = ["HOME", "ABOUT", "SERVICES", "HSE", "CAPABILITIES", "INDUSTRIES", "CAREER", "PARTNER", "CREW", "CONTACT", "NEWS", "TERMS", "PRIVACY"] as const;

export type EditablePageKey = (typeof pageKeys)[number];

export type PageFieldName =
  | "heroTitle"
  | "heroSubtitle"
  | "ctaLabel"
  | "title"
  | "body"
  | "subtitle"
  | "phones"
  | "emails"
  | "address"
  | "whatsapp"
  | "heroImageUrl"
  | "featureImageUrl"
  | "galleryImageUrls"
  | "panelImageUrl";

export type PageFieldDefinition = {
  name: PageFieldName;
  label: string;
  type: "input" | "textarea" | "media";
  rows?: number;
  placeholder?: string;
};

type LocaleSectionsMap = Record<SiteLocale, Record<string, string>>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function getSectionsSourceForLocale(sectionsJson: unknown, locale: SiteLocale): Record<string, unknown> {
  if (!isRecord(sectionsJson)) {
    return {};
  }

  const localizedSource = sectionsJson[locale];
  if (isRecord(localizedSource)) {
    return localizedSource;
  }

  const hasLocalizedShape = isRecord(sectionsJson.en) || isRecord(sectionsJson.ar);
  if (hasLocalizedShape) {
    return {};
  }

  return sectionsJson;
}

function normalizeSectionsForKey(key: EditablePageKey, source: Record<string, unknown>): Record<string, string> {
  return pageFieldDefinitions[key].reduce<Record<string, string>>((acc, field) => {
    const value = source[field.name];
    acc[field.name] = typeof value === "string" ? value : "";
    return acc;
  }, {});
}

export const pageFieldDefinitions: Record<EditablePageKey, readonly PageFieldDefinition[]> = {
  HOME: [
    {
      name: "heroTitle",
      label: "Hero title",
      type: "textarea",
      rows: 3,
      placeholder: "Subsurface intelligence built for confident field decisions."
    },
    {
      name: "heroSubtitle",
      label: "Hero subtitle",
      type: "textarea",
      rows: 7,
      placeholder: "Write a short introduction. HTML مثل <strong>, <br>, <a> مسموح."
    },
    {
      name: "ctaLabel",
      label: "CTA label",
      type: "input",
      placeholder: "Contact Our Team"
    }
  ],
  ABOUT: [
    { name: "title", label: "Page title", type: "input", placeholder: "About" },
    {
      name: "body",
      label: "Body",
      type: "textarea",
      rows: 10,
      placeholder: "HTML مثل <p>, <strong>, <ul>, <li>, <a> مسموح."
    }
  ],
  SERVICES: [
    { name: "title", label: "Page title", type: "input", placeholder: "Services" },
    {
      name: "body",
      label: "Body",
      type: "textarea",
      rows: 8,
      placeholder: "HTML مثل <p>, <strong>, <ul>, <li>, <a> مسموح."
    },
    {
      name: "heroImageUrl",
      label: "Hero image URL",
      type: "media",
      placeholder: "/uploads/your-image.jpg"
    },
    {
      name: "featureImageUrl",
      label: "Feature image URL",
      type: "media",
      placeholder: "/uploads/your-image.jpg"
    }
  ],
  HSE: [
    { name: "title", label: "Page title", type: "input", placeholder: "Health, Safety & Environment" },
    {
      name: "subtitle",
      label: "Subtitle",
      type: "textarea",
      rows: 4,
      placeholder: "Short HSE message shown under the page title."
    },
    {
      name: "body",
      label: "Body",
      type: "textarea",
      rows: 8,
      placeholder: "HTML مثل <p>, <strong>, <ul>, <li>, <a> مسموح."
    },
    {
      name: "heroImageUrl",
      label: "Hero image URL",
      type: "media",
      placeholder: "/uploads/your-hse-hero.jpg"
    },
    {
      name: "featureImageUrl",
      label: "Feature image URL",
      type: "media",
      placeholder: "/uploads/your-hse-feature.jpg"
    },
    {
      name: "panelImageUrl",
      label: "Left panel image URL",
      type: "media",
      placeholder: "/uploads/your-hse-panel.jpg"
    },
    {
      name: "galleryImageUrls",
      label: "Gallery image URLs (comma separated)",
      type: "textarea",
      rows: 4,
      placeholder: "/uploads/hse-1.jpg, /uploads/hse-2.jpg, /uploads/hse-3.jpg"
    }
  ],
  CAPABILITIES: [
    { name: "title", label: "Page title", type: "input", placeholder: "Capabilities" },
    {
      name: "body",
      label: "Body",
      type: "textarea",
      rows: 8,
      placeholder: "HTML مثل <p>, <strong>, <ul>, <li>, <a> مسموح."
    }
  ],
  INDUSTRIES: [
    { name: "title", label: "Page title", type: "input", placeholder: "Industries" },
    {
      name: "body",
      label: "Body",
      type: "textarea",
      rows: 8,
      placeholder: "HTML مثل <p>, <strong>, <ul>, <li>, <a> مسموح."
    },
    {
      name: "heroImageUrl",
      label: "Hero image URL",
      type: "media",
      placeholder: "/uploads/your-image.jpg"
    },
    {
      name: "featureImageUrl",
      label: "Feature image URL",
      type: "media",
      placeholder: "/uploads/your-image.jpg"
    }
  ],
  CAREER: [
    { name: "title", label: "Page title", type: "input", placeholder: "Career" },
    {
      name: "body",
      label: "Body",
      type: "textarea",
      rows: 8,
      placeholder: "HTML مثل <p>, <strong>, <ul>, <li>, <a> مسموح."
    }
  ],
  PARTNER: [
    { name: "title", label: "Page title", type: "input", placeholder: "Clients" },
    {
      name: "body",
      label: "Body",
      type: "textarea",
      rows: 8,
      placeholder: "HTML مثل <p>, <strong>, <ul>, <li>, <a> مسموح."
    }
  ],
  CREW: [
    { name: "title", label: "Page title", type: "input", placeholder: "Crew" },
    {
      name: "body",
      label: "Body",
      type: "textarea",
      rows: 8,
      placeholder: "HTML مثل <p>, <strong>, <ul>, <li>, <a> مسموح."
    }
  ],
  CONTACT: [
    { name: "title", label: "Page title", type: "input", placeholder: "Contact" },
    {
      name: "subtitle",
      label: "Subtitle",
      type: "textarea",
      rows: 6,
      placeholder: "Get in touch with our technical and commercial teams. HTML inline مسموح."
    },
    {
      name: "phones",
      label: "Phones",
      type: "textarea",
      rows: 3,
      placeholder: "+218 91 000 0000 | +218 92 000 0000"
    },
    {
      name: "emails",
      label: "Emails",
      type: "textarea",
      rows: 3,
      placeholder: "info@nageco.com | support@nageco.com"
    },
    {
      name: "address",
      label: "Address",
      type: "textarea",
      rows: 3,
      placeholder: "Libya"
    },
    {
      name: "whatsapp",
      label: "WhatsApp",
      type: "input",
      placeholder: "+218 91 000 0000"
    }
  ],
  NEWS: [
    { name: "title", label: "Page title", type: "input", placeholder: "Latest News" },
    {
      name: "subtitle",
      label: "Subtitle",
      type: "textarea",
      rows: 6,
      placeholder: "Short intro text shown above news list."
    }
  ],
  TERMS: [
    { name: "title", label: "Page title", type: "input", placeholder: "Terms of Use" },
    {
      name: "body",
      label: "Body",
      type: "textarea",
      rows: 10,
      placeholder: "HTML مثل <p>, <strong>, <ul>, <li>, <a> مسموح."
    }
  ],
  PRIVACY: [
    { name: "title", label: "Page title", type: "input", placeholder: "Privacy Policy" },
    {
      name: "body",
      label: "Body",
      type: "textarea",
      rows: 10,
      placeholder: "HTML مثل <p>, <strong>, <ul>, <li>, <a> مسموح."
    }
  ]
};

export function getPageSectionsInput(
  key: EditablePageKey,
  sectionsJson: unknown,
  locale: SiteLocale = "en"
): Record<string, string> {
  const source = getSectionsSourceForLocale(sectionsJson, locale);
  return normalizeSectionsForKey(key, source);
}

export function getPageSectionsByLocale(key: EditablePageKey, sectionsJson: unknown): LocaleSectionsMap {
  return {
    en: getPageSectionsInput(key, sectionsJson, "en"),
    ar: getPageSectionsInput(key, sectionsJson, "ar")
  };
}

export function buildLocalizedPageSectionsJson(
  key: EditablePageKey,
  sectionsByLocale: LocaleSectionsMap
): Record<SiteLocale, Record<string, string>> {
  return {
    en: normalizeSectionsForKey(key, sectionsByLocale.en),
    ar: normalizeSectionsForKey(key, sectionsByLocale.ar)
  };
}
