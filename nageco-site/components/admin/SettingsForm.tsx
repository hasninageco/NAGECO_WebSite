"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { normalizeMediaUrl } from "@/lib/media-url";

type Settings = {
  brandName: string;
  brandNameAr?: string | null;
  tagline: string;
  taglineAr?: string | null;
  phones: string[];
  emails: string[];
  address?: string | null;
  addressAr?: string | null;
  whatsapp?: string | null;
  mapEmbedUrl?: string | null;
  socialLinksJson: unknown;
  defaultSeoTitle?: string | null;
  defaultSeoTitleAr?: string | null;
  defaultSeoDescription?: string | null;
  defaultSeoDescriptionAr?: string | null;
  defaultOgImage?: string | null;
};

type MediaItem = {
  id: string;
  fileName: string;
  url: string;
  mimeType: string;
};

type ImportantLinkFormItem = {
  nameAr: string;
  nameEn: string;
  url: string;
  logo: string;
};

type TeamMemberFormItem = {
  nameEn: string;
  nameAr: string;
  positionEn: string;
  positionAr: string;
  shortDefinitionEn: string;
  shortDefinitionAr: string;
  image: string;
};

function normalizeExternalUrl(raw: string) {
  const value = raw.trim();
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
}

export function SettingsForm({ initial, mediaItems }: { initial: Settings | null; mediaItems: MediaItem[] }) {
  const initialSocialLinks =
    initial?.socialLinksJson && typeof initial.socialLinksJson === "object"
      ? (initial.socialLinksJson as Record<string, unknown>)
      : {};

  const imageMediaItems = mediaItems.filter((item) => item.mimeType.startsWith("image/") && normalizeMediaUrl(item.url));

  const initialHeroImages = Array.isArray(initialSocialLinks.heroCarouselImages)
    ? initialSocialLinks.heroCarouselImages.filter((item): item is string => typeof item === "string")
    : [];

  const initialHeroCaptions = Array.isArray(initialSocialLinks.heroCarouselCaptions)
    ? initialSocialLinks.heroCarouselCaptions.filter((item): item is string => typeof item === "string")
    : [];

  const initialHeroCaptionsAr = Array.isArray(initialSocialLinks.heroCarouselCaptionsAr)
    ? initialSocialLinks.heroCarouselCaptionsAr.filter((item): item is string => typeof item === "string")
    : [];

  const initialGlobalBackgroundImages = Array.isArray(initialSocialLinks.globalBackgroundImages)
    ? initialSocialLinks.globalBackgroundImages.filter((item): item is string => typeof item === "string")
    : [];

  const initialPartnerLogos = Array.isArray(initialSocialLinks.partnerLogos)
    ? initialSocialLinks.partnerLogos.filter((item): item is string => typeof item === "string")
    : [];

  const initialCrew203Achievements = Array.isArray(initialSocialLinks.crew203Achievements)
    ? initialSocialLinks.crew203Achievements.filter((item): item is string => typeof item === "string")
    : [];

  const initialCrew206Achievements = Array.isArray(initialSocialLinks.crew206Achievements)
    ? initialSocialLinks.crew206Achievements.filter((item): item is string => typeof item === "string")
    : [];

  const initialCrew203AchievementsAr = Array.isArray(initialSocialLinks.crew203AchievementsAr)
    ? initialSocialLinks.crew203AchievementsAr.filter((item): item is string => typeof item === "string")
    : [];

  const initialCrew206AchievementsAr = Array.isArray(initialSocialLinks.crew206AchievementsAr)
    ? initialSocialLinks.crew206AchievementsAr.filter((item): item is string => typeof item === "string")
    : [];

  const initialCrew203Pictures = Array.isArray(initialSocialLinks.crew203Pictures)
    ? initialSocialLinks.crew203Pictures.filter((item): item is string => typeof item === "string")
    : [];

  const initialCrew206Pictures = Array.isArray(initialSocialLinks.crew206Pictures)
    ? initialSocialLinks.crew206Pictures.filter((item): item is string => typeof item === "string")
    : [];

  const initialImportantLinks = Array.isArray(initialSocialLinks.importantLinks)
    ? initialSocialLinks.importantLinks.flatMap((item) => {
      if (!item || typeof item !== "object") return [];

      const candidate = item as Record<string, unknown>;
      const fallbackLabel = typeof candidate.label === "string" ? candidate.label : "";
      return [{
        nameAr: typeof candidate.nameAr === "string" ? candidate.nameAr : fallbackLabel,
        nameEn: typeof candidate.nameEn === "string" ? candidate.nameEn : fallbackLabel,
        url: typeof candidate.url === "string" ? candidate.url : "",
        logo: typeof candidate.logo === "string" ? candidate.logo : ""
      }];
    })
    : [];

  const initialOurTeam = Array.isArray(initialSocialLinks.ourTeam)
    ? initialSocialLinks.ourTeam.flatMap((item) => {
      if (!item || typeof item !== "object") return [];

      const candidate = item as Record<string, unknown>;
      const fallbackName = typeof candidate.name === "string" ? candidate.name : "";
      const fallbackPosition = typeof candidate.position === "string" ? candidate.position : "";
      const fallbackShortDefinition = typeof candidate.shortDefinition === "string" ? candidate.shortDefinition : "";

      return [{
        nameEn: typeof candidate.nameEn === "string" ? candidate.nameEn : fallbackName,
        nameAr: typeof candidate.nameAr === "string" ? candidate.nameAr : fallbackName,
        positionEn: typeof candidate.positionEn === "string" ? candidate.positionEn : fallbackPosition,
        positionAr: typeof candidate.positionAr === "string" ? candidate.positionAr : fallbackPosition,
        shortDefinitionEn: typeof candidate.shortDefinitionEn === "string" ? candidate.shortDefinitionEn : fallbackShortDefinition,
        shortDefinitionAr: typeof candidate.shortDefinitionAr === "string" ? candidate.shortDefinitionAr : fallbackShortDefinition,
        image: typeof candidate.image === "string" ? candidate.image : ""
      }];
    })
    : [];


  const [form, setForm] = useState({
    brandName: initial?.brandName ?? "NAGECO",
    brandNameAr: initial?.brandNameAr ?? initial?.brandName ?? "NAGECO",
    tagline: initial?.tagline ?? "",
    taglineAr: initial?.taglineAr ?? initial?.tagline ?? "",
    phones: initial?.phones.join(",") ?? "",
    emails: initial?.emails.join(",") ?? "",
    address: initial?.address ?? "",
    addressAr: initial?.addressAr ?? initial?.address ?? "",
    whatsapp: initial?.whatsapp ?? "",
    mapEmbedUrl: initial?.mapEmbedUrl ?? "",
    socialLinksJson:
      initial?.socialLinksJson && typeof initial.socialLinksJson === "object"
        ? JSON.stringify(initial.socialLinksJson, null, 2)
        : "{}",
    heroImage1: initialHeroImages[0] ?? "",
    heroImage2: initialHeroImages[1] ?? "",
    heroImage3: initialHeroImages[2] ?? "",
    heroCaption1: initialHeroCaptions[0] ?? "NAGECO field operations",
    heroCaption2: initialHeroCaptions[1] ?? "Seismic acquisition convoy",
    heroCaption3: initialHeroCaptions[2] ?? "Exploration and energy infrastructure",
    heroCaption1Ar: initialHeroCaptionsAr[0] ?? "عمليات ناجيكو الميدانية",
    heroCaption2Ar: initialHeroCaptionsAr[1] ?? "قافلة اكتساب سيزمي",
    heroCaption3Ar: initialHeroCaptionsAr[2] ?? "الاستكشاف وبنية الطاقة",
    globalBgImage1: initialGlobalBackgroundImages[0] ?? "",
    globalBgImage2: initialGlobalBackgroundImages[1] ?? "",
    partnerLogos: initialPartnerLogos,
    crew203Definition: typeof initialSocialLinks.crew203Definition === "string" ? initialSocialLinks.crew203Definition : "",
    crew203DefinitionAr: typeof initialSocialLinks.crew203DefinitionAr === "string" ? initialSocialLinks.crew203DefinitionAr : "",
    crew203Achievements: initialCrew203Achievements.join("\n"),
    crew203AchievementsAr: initialCrew203AchievementsAr.join("\n"),
    crew203Pictures: initialCrew203Pictures,
    crew206Definition: typeof initialSocialLinks.crew206Definition === "string" ? initialSocialLinks.crew206Definition : "",
    crew206DefinitionAr: typeof initialSocialLinks.crew206DefinitionAr === "string" ? initialSocialLinks.crew206DefinitionAr : "",
    crew206Achievements: initialCrew206Achievements.join("\n"),
    crew206AchievementsAr: initialCrew206AchievementsAr.join("\n"),
    crew206Pictures: initialCrew206Pictures,
    importantLinks: initialImportantLinks,
    ourTeam: initialOurTeam,
    defaultSeoTitle: initial?.defaultSeoTitle ?? "",
    defaultSeoTitleAr: initial?.defaultSeoTitleAr ?? initial?.defaultSeoTitle ?? "",
    defaultSeoDescription: initial?.defaultSeoDescription ?? "",
    defaultSeoDescriptionAr: initial?.defaultSeoDescriptionAr ?? initial?.defaultSeoDescription ?? "",
    defaultOgImage: initial?.defaultOgImage ?? ""
  });
  const [uploadingPartnerLogo, setUploadingPartnerLogo] = useState(false);
  const [selectedOperationMediaIds, setSelectedOperationMediaIds] = useState<string[]>([]);
  const [uploadingCrew, setUploadingCrew] = useState<203 | 206 | null>(null);
  const [uploadingImportantLinkIndex, setUploadingImportantLinkIndex] = useState<number | null>(null);
  const [uploadingTeamImageIndex, setUploadingTeamImageIndex] = useState<number | null>(null);
  const [activeOperationsCrew, setActiveOperationsCrew] = useState<203 | 206>(203);

  type SettingsTab = "general" | "contact" | "hero" | "backgrounds" | "partners" | "importantLinks" | "ourTeam" | "operations" | "advanced";

  const tabs: Array<{ id: SettingsTab; label: string }> = [
    { id: "general", label: "General" },
    { id: "contact", label: "Contact" },
    { id: "hero", label: "Hero Carousel" },
    { id: "backgrounds", label: "Backgrounds" },
    { id: "partners", label: "Clients Logos" },
    { id: "importantLinks", label: "Important Links" },
    { id: "ourTeam", label: "Our Team" },
    { id: "operations", label: "Operations" },
    { id: "advanced", label: "SEO & Advanced" }
  ];

  const [activeTab, setActiveTab] = useState<SettingsTab>("general");

  function openOperationsCrew(crew: 203 | 206) {
    setActiveTab("operations");
    setActiveOperationsCrew(crew);
  }

  const payload = useMemo(() => {
    let socialLinksJson: Record<string, unknown> = {};
    try {
      socialLinksJson = JSON.parse(form.socialLinksJson);
    } catch {
      socialLinksJson = {};
    }

    const heroCarouselImages = [form.heroImage1, form.heroImage2, form.heroImage3].map((item) => item.trim()).filter(Boolean);
    const heroCarouselCaptions = [form.heroCaption1, form.heroCaption2, form.heroCaption3].map((item) => item.trim()).filter(Boolean);
    const heroCarouselCaptionsAr = [form.heroCaption1Ar, form.heroCaption2Ar, form.heroCaption3Ar].map((item) => item.trim()).filter(Boolean);
    const globalBackgroundImages = [form.globalBgImage1, form.globalBgImage2].map((item) => item.trim()).filter(Boolean);
    const partnerLogos = form.partnerLogos.map((item) => item.trim()).filter(Boolean);
    const crew203Pictures = form.crew203Pictures.map((item) => item.trim()).filter(Boolean);
    const crew206Pictures = form.crew206Pictures.map((item) => item.trim()).filter(Boolean);
    const importantLinks = form.importantLinks
      .map((item) => ({
        nameAr: item.nameAr.trim(),
        nameEn: item.nameEn.trim(),
        url: normalizeExternalUrl(item.url),
        logo: item.logo.trim(),
        label: item.nameEn.trim()
      }))
      .filter((item) => item.nameAr || item.nameEn || item.url);
    const ourTeam = form.ourTeam
      .map((item) => ({
        nameEn: item.nameEn.trim(),
        nameAr: item.nameAr.trim(),
        positionEn: item.positionEn.trim(),
        positionAr: item.positionAr.trim(),
        shortDefinitionEn: item.shortDefinitionEn.trim(),
        shortDefinitionAr: item.shortDefinitionAr.trim(),
        // Backward-compatible keys for older readers.
        name: item.nameEn.trim(),
        position: item.positionEn.trim(),
        shortDefinition: item.shortDefinitionEn.trim(),
        image: item.image.trim()
      }))
      .filter((item) => item.nameEn || item.nameAr || item.positionEn || item.positionAr || item.shortDefinitionEn || item.shortDefinitionAr || item.image);

    const parseLines = (value: string) => value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    const crew203Achievements = parseLines(form.crew203Achievements);
    const crew203AchievementsAr = parseLines(form.crew203AchievementsAr);
    const crew206Achievements = parseLines(form.crew206Achievements);
    const crew206AchievementsAr = parseLines(form.crew206AchievementsAr);

    socialLinksJson.heroCarouselImages = heroCarouselImages;
    socialLinksJson.heroCarouselCaptions = heroCarouselCaptions;
    socialLinksJson.heroCarouselCaptionsAr = heroCarouselCaptionsAr;
    socialLinksJson.globalBackgroundImages = globalBackgroundImages;
    socialLinksJson.partnerLogos = partnerLogos;
    socialLinksJson.crew203Definition = form.crew203Definition.trim();
    socialLinksJson.crew203DefinitionAr = form.crew203DefinitionAr.trim();
    socialLinksJson.crew203Achievements = crew203Achievements;
    socialLinksJson.crew203AchievementsAr = crew203AchievementsAr;
    socialLinksJson.crew203Pictures = crew203Pictures;
    socialLinksJson.crew206Definition = form.crew206Definition.trim();
    socialLinksJson.crew206DefinitionAr = form.crew206DefinitionAr.trim();
    socialLinksJson.crew206Achievements = crew206Achievements;
    socialLinksJson.crew206AchievementsAr = crew206AchievementsAr;
    socialLinksJson.crew206Pictures = crew206Pictures;
    socialLinksJson.importantLinks = importantLinks;
    socialLinksJson.ourTeam = ourTeam;

    return {
      ...form,
      phones: form.phones.split(",").map((item) => item.trim()).filter(Boolean),
      emails: form.emails.split(",").map((item) => item.trim()).filter(Boolean),
      socialLinksJson
    };
  }, [form]);

  function isValidExternalUrl(value: string) {
    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  }

  function validateImportantLinks() {
    const incompleteIndex = form.importantLinks.findIndex((item) => {
      const nameAr = item.nameAr.trim();
      const nameEn = item.nameEn.trim();
      const url = item.url.trim();
      const hasAny = Boolean(nameAr || nameEn || url);
      if (!hasAny) return false;
      return !nameAr || !nameEn || !url;
    });

    if (incompleteIndex >= 0) {
      toast.error(`Important link ${incompleteIndex + 1} needs Arabic name, English name, and URL`);
      return false;
    }

    const invalidUrlIndex = form.importantLinks.findIndex((item) => {
      const url = normalizeExternalUrl(item.url);
      return url.length > 0 && !isValidExternalUrl(url);
    });

    if (invalidUrlIndex >= 0) {
      toast.error(`Important link ${invalidUrlIndex + 1} must use a valid http:// or https:// URL`);
      return false;
    }

    return true;
  }

  function validateOurTeam() {
    const incompleteIndex = form.ourTeam.findIndex((item) => {
      const nameEn = item.nameEn.trim();
      const nameAr = item.nameAr.trim();
      const positionEn = item.positionEn.trim();
      const positionAr = item.positionAr.trim();
      const shortDefinitionEn = item.shortDefinitionEn.trim();
      const shortDefinitionAr = item.shortDefinitionAr.trim();
      const image = item.image.trim();
      const hasAny = Boolean(nameEn || nameAr || positionEn || positionAr || shortDefinitionEn || shortDefinitionAr || image);
      if (!hasAny) return false;
      return !nameEn || !nameAr || !positionEn || !positionAr || !shortDefinitionEn || !shortDefinitionAr;
    });

    if (incompleteIndex >= 0) {
      toast.error(`Team member ${incompleteIndex + 1} needs EN/AR name, position, and short definition`);
      return false;
    }

    return true;
  }

  async function save() {
    if (!validateImportantLinks()) {
      return;
    }
    if (!validateOurTeam()) {
      return;
    }

    const response = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = (await response.json().catch(() => null)) as { error?: { fieldErrors?: Record<string, string[]> } } | null;

    if (!response.ok) {
      const fieldErrors = result?.error?.fieldErrors;
      const firstMessage = fieldErrors
        ? Object.values(fieldErrors).flat().find(Boolean)
        : undefined;
      toast.error(firstMessage || "Failed to save settings");
      return;
    }
    toast.success("Settings saved");
  }

  function assignBackground(slot: 1 | 2, url: string) {
    setForm((current) => ({
      ...current,
      globalBgImage1: slot === 1 ? url : current.globalBgImage1,
      globalBgImage2: slot === 2 ? url : current.globalBgImage2
    }));
  }

  function addCrewImage(crew: 203 | 206, url: string) {
    setForm((current) => ({
      ...current,
      crew203Pictures: crew === 203 && !current.crew203Pictures.includes(url) ? [...current.crew203Pictures, url] : current.crew203Pictures,
      crew206Pictures: crew === 206 && !current.crew206Pictures.includes(url) ? [...current.crew206Pictures, url] : current.crew206Pictures
    }));
  }

  function toggleOperationMediaSelection(id: string) {
    setSelectedOperationMediaIds((current) => (
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    ));
  }

  function clearOperationMediaSelection() {
    setSelectedOperationMediaIds([]);
  }

  function addSelectedCrewImages(crew: 203 | 206) {
    setForm((current) => {
      const selectedUrls = imageMediaItems
        .filter((item) => selectedOperationMediaIds.includes(item.id))
        .map((item) => item.url);

      if (selectedUrls.length === 0) {
        return current;
      }

      if (crew === 203) {
        return {
          ...current,
          crew203Pictures: [...new Set([...current.crew203Pictures, ...selectedUrls])]
        };
      }

      return {
        ...current,
        crew206Pictures: [...new Set([...current.crew206Pictures, ...selectedUrls])]
      };
    });

    setSelectedOperationMediaIds([]);
  }

  function updateCrewImage(crew: 203 | 206, index: number, value: string) {
    setForm((current) => ({
      ...current,
      crew203Pictures: crew === 203
        ? current.crew203Pictures.map((item, currentIndex) => (currentIndex === index ? value : item))
        : current.crew203Pictures,
      crew206Pictures: crew === 206
        ? current.crew206Pictures.map((item, currentIndex) => (currentIndex === index ? value : item))
        : current.crew206Pictures
    }));
  }

  function removeCrewImage(crew: 203 | 206, index: number) {
    setForm((current) => ({
      ...current,
      crew203Pictures: crew === 203 ? current.crew203Pictures.filter((_, currentIndex) => currentIndex !== index) : current.crew203Pictures,
      crew206Pictures: crew === 206 ? current.crew206Pictures.filter((_, currentIndex) => currentIndex !== index) : current.crew206Pictures
    }));
  }

  function appendCrewImage(crew: 203 | 206) {
    setForm((current) => ({
      ...current,
      crew203Pictures: crew === 203 ? [...current.crew203Pictures, ""] : current.crew203Pictures,
      crew206Pictures: crew === 206 ? [...current.crew206Pictures, ""] : current.crew206Pictures
    }));
  }

  async function uploadCrewGallery(files: FileList | null, crew: 203 | 206) {
    if (!files || files.length === 0) return;

    setUploadingCrew(crew);
    try {
      const selectedFiles = Array.from(files);
      const uploadedUrls: string[] = [];

      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData
        });

        const uploaded = (await response.json().catch(() => null)) as { url?: string; error?: string } | null;
        if (!response.ok || !uploaded?.url) {
          toast.error(uploaded?.error || `Failed to upload ${file.name}`);
          continue;
        }

        uploadedUrls.push(uploaded.url);
      }

      if (uploadedUrls.length > 0) {
        setForm((current) => {
          if (crew === 203) {
            return {
              ...current,
              crew203Pictures: [...new Set([...current.crew203Pictures, ...uploadedUrls])]
            };
          }

          return {
            ...current,
            crew206Pictures: [...new Set([...current.crew206Pictures, ...uploadedUrls])]
          };
        });
        toast.success(`${uploadedUrls.length} image${uploadedUrls.length > 1 ? "s" : ""} uploaded to Crew ${crew} gallery`);
      }
    } finally {
      setUploadingCrew(null);
    }
  }

  function addPartnerLogo(url = "") {
    setForm((current) => ({ ...current, partnerLogos: [...current.partnerLogos, url] }));
  }

  function addImportantLink() {
    setForm((current) => ({
      ...current,
      importantLinks: [...current.importantLinks, { nameAr: "", nameEn: "", url: "", logo: "" }]
    }));
  }

  function updateImportantLink(index: number, field: keyof ImportantLinkFormItem, value: string) {
    setForm((current) => ({
      ...current,
      importantLinks: current.importantLinks.map((item, currentIndex) => (
        currentIndex === index ? { ...item, [field]: value } : item
      ))
    }));
  }

  function normalizeImportantLinkUrl(index: number) {
    setForm((current) => ({
      ...current,
      importantLinks: current.importantLinks.map((item, currentIndex) => {
        if (currentIndex !== index) return item;
        return { ...item, url: normalizeExternalUrl(item.url) };
      })
    }));
  }

  function removeImportantLink(index: number) {
    setForm((current) => ({
      ...current,
      importantLinks: current.importantLinks.filter((_, currentIndex) => currentIndex !== index)
    }));
  }

  function addTeamMember() {
    setForm((current) => ({
      ...current,
      ourTeam: [...current.ourTeam, {
        nameEn: "",
        nameAr: "",
        positionEn: "",
        positionAr: "",
        shortDefinitionEn: "",
        shortDefinitionAr: "",
        image: ""
      }]
    }));
  }

  function updateTeamMember(index: number, field: keyof TeamMemberFormItem, value: string) {
    setForm((current) => ({
      ...current,
      ourTeam: current.ourTeam.map((item, currentIndex) => (
        currentIndex === index ? { ...item, [field]: value } : item
      ))
    }));
  }

  function removeTeamMember(index: number) {
    setForm((current) => ({
      ...current,
      ourTeam: current.ourTeam.filter((_, currentIndex) => currentIndex !== index)
    }));
  }

  function removePartnerLogo(index: number) {
    setForm((current) => ({
      ...current,
      partnerLogos: current.partnerLogos.filter((_, currentIndex) => currentIndex !== index)
    }));
  }

  async function uploadPartnerLogo(files: FileList | null) {
    if (!files || files.length === 0) return;

    setUploadingPartnerLogo(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => formData.append("files", file));

      const response = await fetch("/api/admin/partner-logos/upload", {
        method: "POST",
        body: formData
      });

      const result = (await response.json().catch(() => null)) as { urls?: string[]; url?: string; error?: string } | null;

      const uploadedUrls = result?.urls?.length ? result.urls : result?.url ? [result.url] : [];

      if (!response.ok || uploadedUrls.length === 0) {
        toast.error(result?.error || "Failed to upload client logo");
        return;
      }

      setForm((current) => ({
        ...current,
        partnerLogos: [...current.partnerLogos, ...uploadedUrls]
      }));
      toast.success(uploadedUrls.length === 1 ? "Client logo uploaded" : `${uploadedUrls.length} client logos uploaded`);
    } finally {
      setUploadingPartnerLogo(false);
    }
  }

  async function uploadImportantLinkLogo(files: FileList | null, index: number) {
    if (!files || files.length === 0) return;

    const file = files[0];
    setUploadingImportantLinkIndex(index);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });

      const result = (await response.json().catch(() => null)) as { url?: string; error?: string } | null;

      if (!response.ok || !result?.url) {
        toast.error(result?.error || "Failed to upload link logo");
        return;
      }

      setForm((current) => ({
        ...current,
        importantLinks: current.importantLinks.map((item, currentIndex) => (
          currentIndex === index ? { ...item, logo: result.url! } : item
        ))
      }));
      toast.success("Logo imported");
    } finally {
      setUploadingImportantLinkIndex(null);
    }
  }

  async function uploadTeamImage(files: FileList | null, index: number) {
    if (!files || files.length === 0) return;

    const file = files[0];
    setUploadingTeamImageIndex(index);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });

      const result = (await response.json().catch(() => null)) as { url?: string; error?: string } | null;

      if (!response.ok || !result?.url) {
        toast.error(result?.error || "Failed to upload team image");
        return;
      }

      setForm((current) => ({
        ...current,
        ourTeam: current.ourTeam.map((item, currentIndex) => (
          currentIndex === index ? { ...item, image: result.url! } : item
        ))
      }));
      toast.success("Team image imported");
    } finally {
      setUploadingTeamImageIndex(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button type="button" className="btn-primary" onClick={save}>
          Save Settings
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="rounded-[1.2rem] border border-brand-700/10 bg-white/70 p-2.5 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)]">
          <div className="grid gap-1.5 lg:max-h-[calc(100vh-8rem)] lg:overflow-auto lg:pr-1">
            {tabs.map((tab) => {
              if (tab.id !== "operations") {
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`rounded-lg px-3 py-2 text-left text-sm font-semibold transition-colors ${
                      activeTab === tab.id ? "bg-brand-700 text-white" : "text-slate-700 hover:bg-brand-700/8"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              }

              return (
                <div key={tab.id} className="space-y-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm font-semibold transition-colors ${
                      activeTab === tab.id ? "bg-brand-700 text-white" : "text-slate-700 hover:bg-brand-700/8"
                    }`}
                  >
                    {tab.label}
                  </button>

                  {activeTab === "operations" && (
                    <div className="ml-2 grid gap-1 border-l border-brand-700/20 pl-2">
                      <button
                        type="button"
                        onClick={() => openOperationsCrew(203)}
                        className={`rounded-md px-2.5 py-1.5 text-left text-xs font-semibold transition-colors ${
                          activeOperationsCrew === 203 ? "bg-brand-700/10 text-brand-700" : "text-slate-700 hover:bg-brand-700/8"
                        }`}
                      >
                        Crew 203
                      </button>
                      <button
                        type="button"
                        onClick={() => openOperationsCrew(206)}
                        className={`rounded-md px-2.5 py-1.5 text-left text-xs font-semibold transition-colors ${
                          activeOperationsCrew === 206 ? "bg-brand-700/10 text-brand-700" : "text-slate-700 hover:bg-brand-700/8"
                        }`}
                      >
                        Crew 206
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-3 border-t border-brand-700/10 pt-3 lg:sticky lg:bottom-0 lg:bg-white/90 lg:backdrop-blur-sm">
            <button type="button" className="btn-primary w-full" onClick={save}>
              Save Settings
            </button>
          </div>
        </aside>

        <section className="space-y-4 rounded-[1.2rem] border border-brand-700/10 bg-white/75 p-4 md:p-5">
          {activeTab === "general" && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <input className="input" placeholder="Brand name (English)" value={form.brandName} onChange={(event) => setForm((current) => ({ ...current, brandName: event.target.value }))} />
                <input className="input" placeholder="Brand name (Arabic)" dir="rtl" value={form.brandNameAr} onChange={(event) => setForm((current) => ({ ...current, brandNameAr: event.target.value }))} />
                <input className="input" placeholder="Tagline (English)" value={form.tagline} onChange={(event) => setForm((current) => ({ ...current, tagline: event.target.value }))} />
                <input className="input" placeholder="Tagline (Arabic)" dir="rtl" value={form.taglineAr} onChange={(event) => setForm((current) => ({ ...current, taglineAr: event.target.value }))} />
              </div>
            </div>
          )}

          {activeTab === "contact" && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <input className="input" placeholder="Phones (comma separated)" value={form.phones} onChange={(event) => setForm((current) => ({ ...current, phones: event.target.value }))} />
                <input className="input" placeholder="Emails (comma separated)" value={form.emails} onChange={(event) => setForm((current) => ({ ...current, emails: event.target.value }))} />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <input className="input" placeholder="Address (English)" value={form.address} onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))} />
                <input className="input" placeholder="Address (Arabic)" dir="rtl" value={form.addressAr} onChange={(event) => setForm((current) => ({ ...current, addressAr: event.target.value }))} />
                <input className="input" placeholder="WhatsApp" value={form.whatsapp} onChange={(event) => setForm((current) => ({ ...current, whatsapp: event.target.value }))} />
              </div>
              <input className="input" placeholder="Map Embed URL" value={form.mapEmbedUrl} onChange={(event) => setForm((current) => ({ ...current, mapEmbedUrl: event.target.value }))} />
            </div>
          )}

          {activeTab === "hero" && (
            <div className="space-y-2">
              <p className="text-sm font-semibold">Hero Carousel Images (from Media URLs)</p>
              <div className="grid gap-3 md:grid-cols-3">
                <input className="input" placeholder="Image 1 URL (/uploads/...)" value={form.heroImage1} onChange={(event) => setForm((current) => ({ ...current, heroImage1: event.target.value }))} />
                <input className="input" placeholder="Image 1 caption (EN)" value={form.heroCaption1} onChange={(event) => setForm((current) => ({ ...current, heroCaption1: event.target.value }))} />
                <input className="input" placeholder="Image 1 caption (AR)" dir="rtl" value={form.heroCaption1Ar} onChange={(event) => setForm((current) => ({ ...current, heroCaption1Ar: event.target.value }))} />
                <input className="input" placeholder="Image 2 URL (/uploads/...)" value={form.heroImage2} onChange={(event) => setForm((current) => ({ ...current, heroImage2: event.target.value }))} />
                <input className="input" placeholder="Image 2 caption (EN)" value={form.heroCaption2} onChange={(event) => setForm((current) => ({ ...current, heroCaption2: event.target.value }))} />
                <input className="input" placeholder="Image 2 caption (AR)" dir="rtl" value={form.heroCaption2Ar} onChange={(event) => setForm((current) => ({ ...current, heroCaption2Ar: event.target.value }))} />
                <input className="input" placeholder="Image 3 URL (/uploads/...)" value={form.heroImage3} onChange={(event) => setForm((current) => ({ ...current, heroImage3: event.target.value }))} />
                <input className="input" placeholder="Image 3 caption (EN)" value={form.heroCaption3} onChange={(event) => setForm((current) => ({ ...current, heroCaption3: event.target.value }))} />
                <input className="input" placeholder="Image 3 caption (AR)" dir="rtl" value={form.heroCaption3Ar} onChange={(event) => setForm((current) => ({ ...current, heroCaption3Ar: event.target.value }))} />
              </div>
            </div>
          )}

          {activeTab === "backgrounds" && (
            <div className="space-y-2">
              <p className="text-sm font-semibold">Global Animated Background Images (from Media URLs)</p>
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  className="input"
                  placeholder="Background Image 1 URL (/uploads/...)"
                  value={form.globalBgImage1}
                  onChange={(event) => setForm((current) => ({ ...current, globalBgImage1: event.target.value }))}
                />
                <input
                  className="input"
                  placeholder="Background Image 2 URL (/uploads/...)"
                  value={form.globalBgImage2}
                  onChange={(event) => setForm((current) => ({ ...current, globalBgImage2: event.target.value }))}
                />
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                {[form.globalBgImage1, form.globalBgImage2].map((value, index) => {
                  const preview = normalizeMediaUrl(value);

                  return (
                    <div key={index} className="card space-y-3 p-4">
                      <div className="text-sm font-semibold text-black">Background {index + 1}</div>
                      <div className="relative overflow-hidden rounded-[1rem] border border-brand-700/10 bg-slate-100/80">
                        {preview ? (
                          <div className="relative aspect-[16/8] w-full">
                            <Image src={preview} alt={`Background ${index + 1}`} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
                          </div>
                        ) : (
                          <div className="flex aspect-[16/8] items-center justify-center text-sm font-semibold text-black/45">No image selected</div>
                        )}
                      </div>
                      <div className="break-all text-xs text-black/55">{value || "No URL selected"}</div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-3 rounded-[1.5rem] border border-brand-700/10 bg-white/65 p-4">
                <div>
                  <p className="text-sm font-semibold text-black">Choose from Media Library</p>
                  <p className="text-xs text-black/55">Click any image below to assign it directly as Background 1 or Background 2.</p>
                </div>

                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {imageMediaItems.map((item) => {
                    const mediaSrc = normalizeMediaUrl(item.url);
                    if (!mediaSrc) return null;

                    return (
                      <article key={item.id} className="overflow-hidden rounded-[1.2rem] border border-brand-700/10 bg-white/80 p-3 shadow-[0_18px_40px_-30px_rgba(15,39,71,0.25)]">
                        <div className="relative overflow-hidden rounded-[1rem] bg-slate-100">
                          <div className="relative aspect-[16/10] w-full">
                            <Image src={mediaSrc} alt={item.fileName} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                          </div>
                        </div>
                        <div className="mt-3 line-clamp-2 text-sm font-medium text-black">{item.fileName}</div>
                        <div className="mt-3 flex gap-2">
                          <button type="button" className="btn-secondary" onClick={() => assignBackground(1, item.url)}>
                            Set as BG 1
                          </button>
                          <button type="button" className="btn-secondary" onClick={() => assignBackground(2, item.url)}>
                            Set as BG 2
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === "partners" && (
            <div className="space-y-3 rounded-[1.5rem] border border-brand-700/10 bg-white/65 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-black">Clients Logos</p>
                  <p className="text-xs text-black/55">These logos are managed separately from Media and displayed in a hexagonal grid on the Partner page.</p>
                </div>
                <button type="button" className="btn-secondary" onClick={() => addPartnerLogo()}>
                  Add Logo
                </button>
              </div>

              <div className="rounded-xl border border-brand-700/10 bg-white/80 p-3">
                <label className="text-xs font-semibold uppercase tracking-[0.08em] text-black/60">Upload Client Logo</label>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="block w-full max-w-md cursor-pointer rounded-lg border border-brand-700/12 bg-white px-3 py-2 text-sm"
                    onChange={(event) => {
                      void uploadPartnerLogo(event.target.files);
                      event.currentTarget.value = "";
                    }}
                    disabled={uploadingPartnerLogo}
                  />
                  <span className="text-xs font-medium text-black/55">{uploadingPartnerLogo ? "Uploading..." : "Choose one or multiple PNG/JPG/SVG files up to 5MB each"}</span>
                </div>
              </div>

              {form.partnerLogos.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-white/70 px-4 py-3 text-sm text-slate-500">No logos added yet.</div>
              ) : (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(170px,170px))] justify-start gap-3">
                  {form.partnerLogos.map((logo, index) => (
                    <div key={`partner-logo-${index}`} className="space-y-2 rounded-xl border border-brand-700/10 bg-white/80 p-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-black/65">Logo {index + 1}</span>
                        <button
                          type="button"
                          className="ml-auto rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs font-semibold text-red-700"
                          onClick={() => removePartnerLogo(index)}
                        >
                          Remove
                        </button>
                      </div>
                      <div className="relative overflow-hidden rounded-lg border border-brand-700/10 bg-slate-100/80">
                        {normalizeMediaUrl(logo) ? (
                          <div className="relative h-[96px] w-full">
                            <Image src={normalizeMediaUrl(logo)!} alt={`Partner logo ${index + 1}`} fill className="object-contain p-5" sizes="170px" />
                          </div>
                        ) : (
                          <div className="flex h-[96px] items-center justify-center text-xs font-medium text-black/40">No preview</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {activeTab === "importantLinks" && (
            <div className="space-y-3 rounded-[1.5rem] border border-brand-700/10 bg-white/65 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-black">Important Links</p>
                  <p className="text-xs text-black/55">Add ministries, public institutions, companies, or portals to show in the public footer.</p>
                </div>
                <button type="button" className="btn-secondary" onClick={addImportantLink}>
                  Add Link
                </button>
              </div>

              {form.importantLinks.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-white/70 px-4 py-3 text-sm text-slate-500">
                  No important links added yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {form.importantLinks.map((item, index) => (
                    <div key={`important-link-${index}`} className="rounded-xl border border-brand-700/10 bg-white/80 p-4">
                      <div className="mb-3 flex items-center gap-3">
                        <span className="text-sm font-semibold text-black/70">Link {index + 1}</span>
                        <button
                          type="button"
                          className="ml-auto rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs font-semibold text-red-700"
                          onClick={() => removeImportantLink(index)}
                        >
                          Remove
                        </button>
                      </div>

                      <div className="grid gap-3 md:grid-cols-2">
                        <input
                          className="input"
                          placeholder="Arabic name (e.g. بوابة الحكومة الليبية)"
                          value={item.nameAr}
                          onChange={(event) => updateImportantLink(index, "nameAr", event.target.value)}
                        />
                        <input
                          className="input"
                          placeholder="English name (e.g. Libyan Government Portal)"
                          value={item.nameEn}
                          onChange={(event) => updateImportantLink(index, "nameEn", event.target.value)}
                        />
                      </div>

                      <div className="mt-3">
                        <input
                          className="input"
                          placeholder="https://example.gov.ly"
                          value={item.url}
                          onChange={(event) => updateImportantLink(index, "url", event.target.value)}
                          onBlur={() => normalizeImportantLinkUrl(index)}
                        />
                      </div>
                      <div className="mt-3 grid gap-3 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
                        <input
                          className="input"
                          placeholder="Logo URL (/uploads/... or https://...)"
                          value={item.logo}
                          onChange={(event) => updateImportantLink(index, "logo", event.target.value)}
                        />
                        <div className="flex items-center gap-3 rounded-xl border border-brand-700/10 bg-white/75 px-3 py-2">
                          <label className="btn-secondary cursor-pointer whitespace-nowrap text-xs">
                            {uploadingImportantLinkIndex === index ? "Importing..." : "Import Logo"}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(event) => {
                                void uploadImportantLinkLogo(event.currentTarget.files, index);
                                event.currentTarget.value = "";
                              }}
                              disabled={uploadingImportantLinkIndex !== null}
                            />
                          </label>
                          <span className="text-xs font-semibold text-black/55">Preview</span>
                          {normalizeMediaUrl(item.logo) ? (
                            <Image
                              src={normalizeMediaUrl(item.logo)!}
                              alt={`${item.nameEn || item.nameAr || "Related link"} logo`}
                              width={24}
                              height={24}
                              className="h-6 w-6 rounded object-contain"
                            />
                          ) : (
                            <span className="text-xs text-black/45">No logo</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "ourTeam" && (
            <div className="space-y-3 rounded-[1.5rem] border border-brand-700/10 bg-white/65 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-black">Our Team</p>
                  <p className="text-xs text-black/55">Manage team members shown on the public Our Team page.</p>
                </div>
                <button type="button" className="btn-secondary" onClick={addTeamMember}>
                  Add Member
                </button>
              </div>

              {form.ourTeam.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-white/70 px-4 py-3 text-sm text-slate-500">
                  No team members added yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {form.ourTeam.map((member, index) => (
                    <div key={`team-member-${index}`} className="rounded-xl border border-brand-700/10 bg-white/80 p-4">
                      <div className="mb-3 flex items-center gap-3">
                        <span className="text-sm font-semibold text-black/70">Member {index + 1}</span>
                        <button
                          type="button"
                          className="ml-auto rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs font-semibold text-red-700"
                          onClick={() => removeTeamMember(index)}
                        >
                          Remove
                        </button>
                      </div>

                      <div className="grid gap-3 md:grid-cols-2">
                        <input
                          className="input"
                          placeholder="Name (English)"
                          value={member.nameEn}
                          onChange={(event) => updateTeamMember(index, "nameEn", event.target.value)}
                        />
                        <input
                          className="input"
                          placeholder="Name (Arabic)"
                          dir="rtl"
                          value={member.nameAr}
                          onChange={(event) => updateTeamMember(index, "nameAr", event.target.value)}
                        />
                        <input
                          className="input"
                          placeholder="Position (English)"
                          value={member.positionEn}
                          onChange={(event) => updateTeamMember(index, "positionEn", event.target.value)}
                        />
                        <input
                          className="input"
                          placeholder="Position (Arabic)"
                          dir="rtl"
                          value={member.positionAr}
                          onChange={(event) => updateTeamMember(index, "positionAr", event.target.value)}
                        />
                      </div>

                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        <textarea
                          className="input min-h-20"
                          placeholder="Short definition (English)"
                          value={member.shortDefinitionEn}
                          onChange={(event) => updateTeamMember(index, "shortDefinitionEn", event.target.value)}
                        />
                        <textarea
                          className="input min-h-20"
                          placeholder="Short definition (Arabic)"
                          dir="rtl"
                          value={member.shortDefinitionAr}
                          onChange={(event) => updateTeamMember(index, "shortDefinitionAr", event.target.value)}
                        />
                      </div>

                      <div className="mt-3 grid gap-3 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
                        <input
                          className="input"
                          placeholder="Image URL (/uploads/... or https://...)"
                          value={member.image}
                          onChange={(event) => updateTeamMember(index, "image", event.target.value)}
                        />
                        <div className="flex items-center gap-3 rounded-xl border border-brand-700/10 bg-white/75 px-3 py-2">
                          <label className="btn-secondary cursor-pointer whitespace-nowrap text-xs">
                            {uploadingTeamImageIndex === index ? "Importing..." : "Import Image"}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(event) => {
                                void uploadTeamImage(event.currentTarget.files, index);
                                event.currentTarget.value = "";
                              }}
                              disabled={uploadingTeamImageIndex !== null}
                            />
                          </label>
                          <span className="text-xs font-semibold text-black/55">Preview</span>
                          {normalizeMediaUrl(member.image) ? (
                            <Image
                              src={normalizeMediaUrl(member.image)!}
                              alt={`${member.nameEn || member.nameAr || "Team member"} image`}
                              width={28}
                              height={28}
                              className="h-7 w-7 rounded object-cover"
                            />
                          ) : (
                            <span className="text-xs text-black/45">No image</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "operations" && (
            <div className="space-y-4">
              {activeOperationsCrew === 203 && (
              <div id="crew-203-settings" className="rounded-[1.4rem] border border-brand-700/10 bg-white/75 p-4 space-y-3 scroll-mt-6">
                <h3 className="text-base font-semibold text-black">Crew 203</h3>
                <div className="grid gap-3 md:grid-cols-2">
                  <textarea
                    className="input min-h-24"
                    placeholder="Crew 203 definition (English)"
                    value={form.crew203Definition}
                    onChange={(event) => setForm((current) => ({ ...current, crew203Definition: event.target.value }))}
                  />
                  <textarea
                    className="input min-h-24"
                    dir="rtl"
                    placeholder="Crew 203 definition (Arabic)"
                    value={form.crew203DefinitionAr}
                    onChange={(event) => setForm((current) => ({ ...current, crew203DefinitionAr: event.target.value }))}
                  />
                  <textarea
                    className="input min-h-24"
                    placeholder="Crew 203 achievements (EN, one per line)"
                    value={form.crew203Achievements}
                    onChange={(event) => setForm((current) => ({ ...current, crew203Achievements: event.target.value }))}
                  />
                  <textarea
                    className="input min-h-24"
                    dir="rtl"
                    placeholder="Crew 203 achievements (AR, one per line)"
                    value={form.crew203AchievementsAr}
                    onChange={(event) => setForm((current) => ({ ...current, crew203AchievementsAr: event.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-black">Crew 203 Gallery</p>
                    <button type="button" className="btn-secondary" onClick={() => appendCrewImage(203)}>Add Image URL</button>
                  </div>
                  <label className="btn-secondary inline-flex cursor-pointer">
                    {uploadingCrew === 203 ? "Uploading..." : "Browse & Upload Images"}
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => {
                        void uploadCrewGallery(event.currentTarget.files, 203);
                        event.currentTarget.value = "";
                      }}
                      disabled={uploadingCrew !== null}
                    />
                  </label>
                  {form.crew203Pictures.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-white/70 px-4 py-3 text-sm text-slate-500">No gallery images yet.</div>
                  ) : (
                    <div className="space-y-2">
                      {form.crew203Pictures.map((picture, index) => (
                        <div key={`crew203-picture-${index}`} className="flex flex-wrap items-center gap-2">
                          <input
                            className="input min-w-[260px] flex-1"
                            placeholder="Crew 203 gallery image URL (/uploads/...)"
                            value={picture}
                            onChange={(event) => updateCrewImage(203, index, event.target.value)}
                          />
                          <button type="button" className="btn-secondary" onClick={() => removeCrewImage(203, index)}>Remove</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              )}

              {activeOperationsCrew === 206 && (
              <div id="crew-206-settings" className="rounded-[1.4rem] border border-brand-700/10 bg-white/75 p-4 space-y-3 scroll-mt-6">
                <h3 className="text-base font-semibold text-black">Crew 206</h3>
                <div className="grid gap-3 md:grid-cols-2">
                  <textarea
                    className="input min-h-24"
                    placeholder="Crew 206 definition (English)"
                    value={form.crew206Definition}
                    onChange={(event) => setForm((current) => ({ ...current, crew206Definition: event.target.value }))}
                  />
                  <textarea
                    className="input min-h-24"
                    dir="rtl"
                    placeholder="Crew 206 definition (Arabic)"
                    value={form.crew206DefinitionAr}
                    onChange={(event) => setForm((current) => ({ ...current, crew206DefinitionAr: event.target.value }))}
                  />
                  <textarea
                    className="input min-h-24"
                    placeholder="Crew 206 achievements (EN, one per line)"
                    value={form.crew206Achievements}
                    onChange={(event) => setForm((current) => ({ ...current, crew206Achievements: event.target.value }))}
                  />
                  <textarea
                    className="input min-h-24"
                    dir="rtl"
                    placeholder="Crew 206 achievements (AR, one per line)"
                    value={form.crew206AchievementsAr}
                    onChange={(event) => setForm((current) => ({ ...current, crew206AchievementsAr: event.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-black">Crew 206 Gallery</p>
                    <button type="button" className="btn-secondary" onClick={() => appendCrewImage(206)}>Add Image URL</button>
                  </div>
                  <label className="btn-secondary inline-flex cursor-pointer">
                    {uploadingCrew === 206 ? "Uploading..." : "Browse & Upload Images"}
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => {
                        void uploadCrewGallery(event.currentTarget.files, 206);
                        event.currentTarget.value = "";
                      }}
                      disabled={uploadingCrew !== null}
                    />
                  </label>
                  {form.crew206Pictures.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-white/70 px-4 py-3 text-sm text-slate-500">No gallery images yet.</div>
                  ) : (
                    <div className="space-y-2">
                      {form.crew206Pictures.map((picture, index) => (
                        <div key={`crew206-picture-${index}`} className="flex flex-wrap items-center gap-2">
                          <input
                            className="input min-w-[260px] flex-1"
                            placeholder="Crew 206 gallery image URL (/uploads/...)"
                            value={picture}
                            onChange={(event) => updateCrewImage(206, index, event.target.value)}
                          />
                          <button type="button" className="btn-secondary" onClick={() => removeCrewImage(206, index)}>Remove</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              )}

              <div className="space-y-3 rounded-[1.5rem] border border-brand-700/10 bg-white/65 p-4">
                <div>
                  <p className="text-sm font-semibold text-black">Assign Pictures to Crew {activeOperationsCrew} from Media Library</p>
                  <p className="text-xs text-black/55">Select multiple images, then add them in one click.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => addSelectedCrewImages(activeOperationsCrew)}
                    disabled={selectedOperationMediaIds.length === 0}
                  >
                    Add Selected to Crew {activeOperationsCrew} Gallery ({selectedOperationMediaIds.length})
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={clearOperationMediaSelection}
                    disabled={selectedOperationMediaIds.length === 0}
                  >
                    Clear Selection
                  </button>
                </div>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {imageMediaItems.map((item) => {
                    const mediaSrc = normalizeMediaUrl(item.url);
                    if (!mediaSrc) return null;

                    const isSelected = selectedOperationMediaIds.includes(item.id);

                    return (
                      <article key={`operations-${item.id}`} className="overflow-hidden rounded-[1.2rem] border border-brand-700/10 bg-white/80 p-3 shadow-[0_18px_40px_-30px_rgba(15,39,71,0.25)]">
                        <label className="mb-2 flex cursor-pointer items-center gap-2 text-xs font-semibold text-black/70">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleOperationMediaSelection(item.id)}
                          />
                          Select image
                        </label>
                        <div className="relative overflow-hidden rounded-[1rem] bg-slate-100">
                          <div className="relative aspect-[16/10] w-full">
                            <Image src={mediaSrc} alt={item.fileName} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                          </div>
                        </div>
                        <div className="mt-3 line-clamp-2 text-sm font-medium text-black">{item.fileName}</div>
                        <div className="mt-3 grid gap-2">
                          <div className="flex flex-wrap gap-2">
                            <button type="button" className="btn-secondary" onClick={() => addCrewImage(activeOperationsCrew, item.url)}>
                              Add to Crew {activeOperationsCrew} Gallery
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === "advanced" && (
            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                <input className="input" placeholder="Default SEO title (English)" value={form.defaultSeoTitle} onChange={(event) => setForm((current) => ({ ...current, defaultSeoTitle: event.target.value }))} />
                <input className="input" dir="rtl" placeholder="Default SEO title (Arabic)" value={form.defaultSeoTitleAr} onChange={(event) => setForm((current) => ({ ...current, defaultSeoTitleAr: event.target.value }))} />
                <textarea className="input min-h-24" placeholder="Default SEO description (English)" value={form.defaultSeoDescription} onChange={(event) => setForm((current) => ({ ...current, defaultSeoDescription: event.target.value }))} />
                <textarea className="input min-h-24" dir="rtl" placeholder="Default SEO description (Arabic)" value={form.defaultSeoDescriptionAr} onChange={(event) => setForm((current) => ({ ...current, defaultSeoDescriptionAr: event.target.value }))} />
              </div>
              <textarea className="input min-h-40 font-mono text-xs" placeholder="Social links JSON" value={form.socialLinksJson} onChange={(event) => setForm((current) => ({ ...current, socialLinksJson: event.target.value }))} />
            </div>
          )}
        </section>
      </div>

      <button type="button" className="btn-primary" onClick={save}>
        Save Settings
      </button>
    </div>
  );
}
