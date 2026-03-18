/**
 * imageUrl이 상대경로(/uploads/... 등)이면 VITE_IMAGE_BASE_URL과 합쳐 절대 URL로 반환.
 * VITE_IMAGE_BASE_URL 미설정 시 VITE_API_BASE_URL로 fallback.
 * 이미 절대 URL이거나 blob URL이면 그대로 반환.
 */
export function resolveImageUrl(url: string | null | undefined): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:')) {
    return url;
  }
  const base =
    (import.meta.env.VITE_IMAGE_BASE_URL as string) ||
    (import.meta.env.VITE_API_BASE_URL as string) ||
    '';
  return `${base}${url}`;
}
