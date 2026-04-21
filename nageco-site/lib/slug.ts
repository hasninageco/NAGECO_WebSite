export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function ensureUniqueSlug(
  baseSlug: string,
  exists: (slug: string) => Promise<boolean>
) {
  let slug = baseSlug;
  let index = 1;

  while (await exists(slug)) {
    index += 1;
    slug = `${baseSlug}-${index}`;
  }

  return slug;
}