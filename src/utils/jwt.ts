import type { JwtPayload } from '../types/auth';

/**
 * base64url → base64 변환 후 디코딩
 * JWT payload는 base64url 인코딩 사용 ('+' 대신 '-', '/' 대신 '_', padding 없음)
 */
function base64UrlDecode(str: string): string {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
  return atob(padded);
}

/**
 * accessToken의 payload를 파싱하여 반환
 * 실패(잘못된 토큰, 파싱 오류 등) 시 null 반환
 * 보안 주의: UI 제어 전용. 실제 권한 검증은 서버(403)에서 최종 수행.
 */
export function decodePayload(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payloadJson = base64UrlDecode(parts[1]);
    return JSON.parse(payloadJson) as JwtPayload;
  } catch {
    return null;
  }
}

/**
 * 토큰에서 roles 배열 추출
 * 실패 또는 roles 클레임 없으면 빈 배열 반환
 */
export function getRoles(token: string): string[] {
  const payload = decodePayload(token);
  return payload?.roles ?? [];
}

/**
 * 토큰에 ROLE_ADMIN 포함 여부 확인
 * UI 노출 제어용. 서버에서 403으로 최종 통제.
 */
export function isAdmin(token: string): boolean {
  return getRoles(token).includes('ROLE_ADMIN');
}

/**
 * accessToken 유효 여부 확인 (파싱 성공 + 미만료)
 * exp 클레임 기준으로 만료 여부 판단 (초 단위 → ms 단위 변환)
 * exp 클레임이 없으면 유효로 간주
 * UI 제어 / 사전 보호 전용 — 실제 권한은 서버에서 최종 판단
 */
export function isTokenValid(token: string): boolean {
  const payload = decodePayload(token);
  if (!payload) return false;
  if (payload.exp === undefined) return true;
  return payload.exp * 1000 > Date.now();
}
