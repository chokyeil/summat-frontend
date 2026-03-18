import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isTokenValid } from '../utils/jwt';

/**
 * 로그인 여부 + 토큰 유효성 확인.
 * - 토큰 없음: /login?next={현재경로}로 이동
 *   - auth_expired 플래그가 있으면 /login?expired=1&next=... (앱 부팅 시 만료 토큰 정리 후)
 * - 토큰 있으나 만료: 토큰 제거 후 /login?expired=1&next={현재경로}로 이동
 */
export default function PrivateRoute() {
  const token = localStorage.getItem('accessToken');
  const location = useLocation();
  const next = encodeURIComponent(location.pathname);

  if (!token) {
    // main.tsx 부팅 시 만료 토큰이 제거된 경우: expired=1 파라미터 포함
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

  return <Outlet />;
}
