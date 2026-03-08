import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isAdmin } from '../utils/jwt';

/**
 * 관리자 전용 라우트 가드
 * - 토큰 없음 → /login?next={현재경로}
 * - 토큰 있으나 ROLE_ADMIN 없음 → /places
 * 보안 주의: UI 접근 제어 전용. 실제 권한 검증은 서버(403)에서 최종 수행.
 */
export default function AdminRouteGuard() {
  const token = localStorage.getItem('accessToken');
  const location = useLocation();

  if (!token) {
    const next = encodeURIComponent(location.pathname);
    return <Navigate to={`/login?next=${next}`} replace />;
  }

  if (!isAdmin(token)) return <Navigate to="/places" replace />;

  return <Outlet />;
}
