import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isAdmin, isTokenValid } from '../utils/jwt';

/**
 * 관리자 전용 라우트 가드
 * - 토큰 없음 → /login?next={현재경로}
 *   - auth_expired 플래그가 있으면 /login?expired=1&next=... (앱 부팅 시 만료 토큰 정리 후)
 * - 토큰 있으나 만료 → 토큰 제거 후 /login?expired=1&next={현재경로}
 * - 토큰 있으나 ROLE_ADMIN 없음 → /places
 * 보안 주의: UI 접근 제어 전용. 실제 권한 검증은 서버(403)에서 최종 수행.
 */
export default function AdminRouteGuard() {
  const token = localStorage.getItem('accessToken');
  const location = useLocation();
  const next = encodeURIComponent(location.pathname);

  if (!token) {
    const wasExpired = sessionStorage.getItem('auth_expired') === '1';
    if (wasExpired) {
      sessionStorage.removeItem('auth_expired');
      return <Navigate to={`/login?expired=1&next=${next}`} replace />;
    }
    return <Navigate to={`/login?next=${next}`} replace />;
  }

  if (!isTokenValid(token)) {
    localStorage.removeItem('accessToken');
    return <Navigate to={`/login?expired=1&next=${next}`} replace />;
  }

  if (!isAdmin(token)) return <Navigate to="/places" replace />;

  return <Outlet />;
}
