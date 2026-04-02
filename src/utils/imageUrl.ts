/**
 * imageUrl이 상대경로(/uploads/... 등)이면 VITE_IMAGE_BASE_URL과 합쳐 절대 URL로 반환.
 * VITE_IMAGE_BASE_URL 미설정 시 VITE_API_BASE_URL로 fallback.
 * 이미 절대 URL이거나 blob URL이면 그대로 반환.
 * DB에 이미 /api/... 형태로 저장된 imageUrl이 들어와도 /api/api/... 중복 방지.
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
  // base가 이미 url 앞에 포함된 경우 중복 prefix 방지
  // 예: base='/api', url='/api/images/...' → '/api/images/...' 그대로 반환
  if (base && url.startsWith(base + '/')) return url;
  return `${base}${url}`;
}

/**
 * 이미지 로딩 실패 시 사용할 placeholder 경로.
 * VITE_IMAGE_BASE_URL(또는 VITE_API_BASE_URL) 기준으로 계산되므로 환경별로 자동 조정됨.
 */
export const PLACEHOLDER_IMAGE = resolveImageUrl('/images/placeholder/placeholder_img.png');
