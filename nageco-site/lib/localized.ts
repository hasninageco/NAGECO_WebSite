import type { SiteLocale } from "@/lib/site-locale";

function clean(value: string | null | undefined) {
  const normalized = value?.trim() ?? "";
  return normalized.length > 0 ? normalized : null;
}

export function pickLocalizedText(
  locale: SiteLocale,
  englishValue: string | null | undefined,
  arabicValue: string | null | undefined,
  fallback = ""
) {
  const english = clean(englishValue);
  const arabic = clean(arabicValue);

  if (locale === "ar") {
    return arabic ?? english ?? fallback;
  }

  return english ?? arabic ?? fallback;
}

export function pickLocalizedList(
  locale: SiteLocale,
  englishValues: string[] | null | undefined,
  arabicValues: string[] | null | undefined
) {
  const normalize = (items: string[] | null | undefined) =>
    (items ?? []).map((item) => item.trim()).filter(Boolean);

  const english = normalize(englishValues);
  const arabic = normalize(arabicValues);

  if (locale === "ar") {
    return arabic.length > 0 ? arabic : english;
  }

  return english.length > 0 ? english : arabic;
}
