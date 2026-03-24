const DEFAULT_SITE_URL = "https://zempar.com";

export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (url) {
    return url.replace(/\/$/, "");
  }
  return DEFAULT_SITE_URL;
}
