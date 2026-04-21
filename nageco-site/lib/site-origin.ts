export function getSiteOriginFromHeaders(headerList: Headers) {
  const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configuredOrigin) {
    return configuredOrigin.replace(/\/+$/, "");
  }

  const forwardedProto = headerList.get("x-forwarded-proto");
  const forwardedHost = headerList.get("x-forwarded-host");
  const host = forwardedHost ?? headerList.get("host") ?? "localhost:3000";
  const protocol = forwardedProto ?? (process.env.NODE_ENV === "development" ? "http" : "https");

  return `${protocol}://${host}`.replace(/\/+$/, "");
}
