import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isTokenValid } from '../utils/jwt';

/** 로그인 여부 + 토큰 유효성 확인.
 * - 토큰 없음: /login?next={현재경로}로 이동
 * - 토큰 있으나 만료: 토큰 제거 후 /login?expired=1&next={현재경로}로 이동
 */
export default function PrivateRoute() {
  const token = localStorage.getItem('accessToken');
  const location = useLocation();
  const next = encodeURIComponent(location.pathname);

  if (!token) {
    return <Navigate to={`/login?next=${next}`} replace />;
  }

  if (!isTokenValid(token)) {
    localStorage.removeItem('accessToken');
    return <Navigate to={`/login?expired=1&next=${next}`} replace />;
  }

  return <Outlet />;
}
