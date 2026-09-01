const INSTAGRAM_URL_PATTERN = /instagram\.com\/(reel|p|tv)\/([A-Za-z0-9_-]+)/;

export function extractInstagramCode(url: string): string | null {
  if (!url) return null;
  const match = url.match(INSTAGRAM_URL_PATTERN);
  return match ? match[2] : null;
}

export function isValidInstagramTestimonialUrl(url: string): boolean {
  return extractInstagramCode(url) !== null;
}

export function instagramEmbedUrl(url: string): string {
  const match = url.match(INSTAGRAM_URL_PATTERN);
  if (!match) return "";
  const [, segment, code] = match;
  return `https://www.instagram.com/${segment}/${code}/embed/`;
}

export function instagramPostUrl(url: string): string {
  const match = url.match(INSTAGRAM_URL_PATTERN);
  if (!match) return "";
  const [full] = match;
  return `https://www.${full}`;
}

export function testimonialVideoAspect(aspect?: string): string {
  if (aspect === "9:16") return "9/16";
  return "16/9";
}

export const TESTIMONIAL_TYPE_LABELS: Record<string, string> = {
  written: "Written",
  instagram: "Instagram Video",
  uploaded: "Uploaded Video",
};