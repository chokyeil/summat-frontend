import type { MeResDto } from '../types/user';

interface ProfileCardProps {
  profile: MeResDto;
  onLogout: () => void;
}

export default function ProfileCard({ profile, onLogout }: ProfileCardProps) {
  return (
    <section className="profile-card">
      <div className="profile-avatar" aria-hidden="true">👤</div>
      <div className="profile-info">
        <h2 className="profile-nickname">{profile.nickName}</h2>
        <p className="profile-email">{profile.userId}</p>
      </div>
      <button type="button" className="btn-logout" onClick={onLogout}>
        로그아웃
      </button>
    </section>
  );
}
