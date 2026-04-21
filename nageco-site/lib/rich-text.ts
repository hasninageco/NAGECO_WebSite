import sanitizeHtml from "sanitize-html";

type RichTextProfile = "title" | "inline" | "block";

const brandLogoMarkupByProfile: Record<RichTextProfile, string> = {
  title:
    '<img src="/nageco-logo.svg" alt="NAGECO Logo" width="160" height="54" style="display:inline-block;height:0.92em;width:auto;vertical-align:-0.08em;object-fit:contain;" />',
  inline:
    '<img src="/nageco-logo.svg" alt="NAGECO Logo" width="146" height="50" style="display:inline-block;height:0.88em;width:auto;vertical-align:-0.08em;object-fit:contain;" />',
  block:
    '<img src="/nageco-logo.svg" alt="NAGECO Logo" width="146" height="50" style="display:inline-block;height:0.88em;width:auto;vertical-align:-0.08em;object-fit:contain;" />'
};

const sharedOptions = {
  allowedAttributes: {
    a: ["href", "target", "rel", "title"],
    span: ["class"]
  },
  allowedSchemes: ["http", "https", "mailto", "tel"]
};

function normalizeRichTextInput(value: string, profile: RichTextProfile) {
  const normalizedValue = value.replace(/\r\n?/g, "\n");
  if (/[<][a-z/!][^>]*>/i.test(normalizedValue)) {
    return normalizedValue;
  }
  if (profile === "block") {
    return normalizedValue
      .split(/\n{2,}/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean)
      .map((paragraph) => `<p>${paragraph.replace(/\n/g, "<br />")}</p>`)
      .join("");
  }
  return normalizedValue.replace(/\n/g, "<br />");
}




export function sanitizeRichText(value: string | null | undefined, profile: RichTextProfile = "block") {
  const source = value?.trim() ?? "";

  if (!source) return "";

  const normalizedSource = normalizeRichTextInput(source, profile);

  let sanitized = "";

  if (profile === "title") {
    sanitized = sanitizeHtml(normalizedSource, {
      ...sharedOptions,
      allowedTags: ["br", "strong", "b", "em", "i", "span"]
    });
  } else if (profile === "inline") {
    sanitized = sanitizeHtml(normalizedSource, {
      ...sharedOptions,
      allowedTags: ["br", "strong", "b", "em", "i", "u", "span", "a"]
    });
  } else {
    sanitized = sanitizeHtml(normalizedSource, {
      ...sharedOptions,
      allowedTags: ["p", "br", "strong", "b", "em", "i", "u", "ul", "ol", "li", "h2", "h3", "h4", "a", "blockquote", "span"]
    });
  }

  return sanitized.replace(/\bNAGECO\b/g, brandLogoMarkupByProfile[profile]);
}