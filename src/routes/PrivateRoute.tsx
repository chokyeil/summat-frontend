import { Navigate, Outlet, useLocation } from 'react-router-dom';

/** 로그인 여부만 확인. 토큰 없으면 /login?next={현재경로}로 이동. */
export default function PrivateRoute() {
  const token = localStorage.getItem('accessToken');
  const location = useLocation();
  if (!token) return <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} replace />;
  return <Outlet />;
}
