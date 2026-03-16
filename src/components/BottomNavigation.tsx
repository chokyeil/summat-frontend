import { Link, useLocation, useNavigate } from 'react-router-dom';
import { redirectToLogin } from '../utils/auth';

// TODO: 각 경로 구현 시 to 값 교체
const NAV_ITEMS = [
  { icon: '🏠', label: '홈', to: '/places' },
  { icon: '🔍', label: '검색', to: '/search' },
  { icon: '➕', label: '등록', to: '/register' },
  { icon: '🧡', label: '찜', to: '/likes' },
  { icon: '👤', label: '마이', to: '/mypage' },
] as const;

// 인증이 필요한 경로 — 클릭 시 redirectToLogin() 선처리
const PROTECTED_PATHS: ReadonlySet<string> = new Set(['/register', '/mypage']);

export default function BottomNavigation() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  function handleProtectedNav(to: string) {
    if (!redirectToLogin()) return;
    navigate(to);
  }

  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.to;
        if (PROTECTED_PATHS.has(item.to)) {
          return (
            <button
              key={item.label}
              type="button"
              className={`nav-item${isActive ? ' active' : ''}`}
              onClick={() => handleProtectedNav(item.to)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        }
        return (
          <Link
            key={item.label}
            to={item.to}
            className={`nav-item${isActive ? ' active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
