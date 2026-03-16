import { isTokenValid } from './jwt';

/**
 * 인증 상태 확인 후 필요 시 로그인 페이지로 이동
 * - 토큰 없음: /login?next={현재경로}
 * - 토큰 만료: 토큰 제거 후 /login?expired=1&next={현재경로}
 * @returns true: 인증 유효 (계속 진행 가능), false: 로그인 페이지로 이동 처리됨
 *
 * 이벤트 핸들러 / 액션 보호 전용
 * PrivateRoute는 React 컴포넌트 패턴(Navigate)으로 별도 처리
 */
export function redirectToLogin(): boolean {
  const token = localStorage.getItem('accessToken');
  const next = encodeURIComponent(window.location.pathname);

  if (!token) {
    window.location.replace(`/login?next=${next}`);
    return false;
  }

  if (!isTokenValid(token)) {
    localStorage.removeItem('accessToken');
    window.location.replace(`/login?expired=1&next=${next}`);
    return false;
  }

  return true;
}
