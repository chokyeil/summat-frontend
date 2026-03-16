import { Link, useNavigate } from 'react-router-dom';
import { isAdmin } from '../utils/jwt';
import { redirectToLogin } from '../utils/auth';

/**
 * 전역 헤더
 * - 토큰 없음: 로그인 링크
 * - 토큰 있음: 로그아웃 버튼
 * - ROLE_ADMIN: Admin 메뉴 추가 노출
 * 토큰 디코딩은 UI 제어 전용 — 실제 권한은 서버에서 최종 판단
 */
export default function Header() {
  const token = localStorage.getItem('accessToken');
  const adminUser = token ? isAdmin(token) : false;
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem('accessToken');
    navigate('/places');
  }

  function handleProtectedNav(path: string) {
    if (!redirectToLogin()) return;
    navigate(path);
  }

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/places" className="logo">숨맛</Link>
        <div className="user-menu">
          {token ? (
            <>
              {adminUser && <Link to="/admin">Admin</Link>}
              <button type="button" className="header-desktop-only" onClick={() => handleProtectedNav('/register')}>등록</button>
              <button type="button" className="header-desktop-only" onClick={() => handleProtectedNav('/mypage')}>마이페이지</button>
              <button type="button" onClick={handleLogout}>로그아웃</button>
            </>
          ) : (
            <>
              <Link to="/login">로그인</Link>
              <Link to="/signup">회원가입</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
