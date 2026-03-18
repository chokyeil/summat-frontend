import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { isTokenValid } from './utils/jwt'

// ─── 앱 초기 진입 / 새로고침 시 만료 토큰 정리 ─────────────────────────────
// React가 렌더되기 전에 동기적으로 실행되므로
// Header, PrivateRoute 등 모든 컴포넌트가 이미 정리된 localStorage를 본다.
//
// - 유효 토큰: 그대로 유지
// - 만료 토큰: 즉시 제거 + auth_expired 플래그 기록
//   → public 페이지: Header가 비로그인 상태로 렌더됨 (현재 페이지 유지)
//   → protected 페이지: PrivateRoute/AdminRouteGuard가 플래그를 확인 후
//     /login?expired=1&next=현재경로 로 이동
const _bootToken = localStorage.getItem('accessToken');
if (_bootToken && !isTokenValid(_bootToken)) {
  localStorage.removeItem('accessToken');
  sessionStorage.setItem('auth_expired', '1');
}
// ─────────────────────────────────────────────────────────────────────────────

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
