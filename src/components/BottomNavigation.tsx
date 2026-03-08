import { Link, useLocation } from 'react-router-dom';

// TODO: 각 경로 구현 시 to 값 교체
const NAV_ITEMS = [
  { icon: '🏠', label: '홈', to: '/places' },
  { icon: '🔍', label: '검색', to: '/search' },
  { icon: '➕', label: '등록', to: '/register' },
  { icon: '🧡', label: '찜', to: '/likes' },
  { icon: '👤', label: '마이', to: '/mypage' },
] as const;

export default function BottomNavigation() {
  const { pathname } = useLocation();

  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.label}
          to={item.to}
          className={`nav-item${pathname === item.to ? ' active' : ''}`}
        >
          <span className="nav-icon">{item.icon}</span>
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
