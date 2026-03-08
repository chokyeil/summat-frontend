import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { UserProfileDto } from '../types/user';
import type { MyCommentDto } from '../types/user';
import type { PlaceMainListResDto } from '../types/place';
import { mockUserProfile, mockSavedPlaces, mockMyComments, getMockMyPlaces } from '../mocks/user';
import ProfileCard from '../components/ProfileCard';
import SavedPlacesSection from '../components/SavedPlacesSection';
import MyPlacesSection from '../components/MyPlacesSection';
import MyCommentsSection from '../components/MyCommentsSection';

export default function MyPage() {
  // TODO: 실제 API 연동 시 useEffect + getMyProfile(), getSavedPlaces(), getMyComments() 교체
  const [profile] = useState<UserProfileDto>(mockUserProfile);
  const [savedPlaces] = useState<PlaceMainListResDto[]>(mockSavedPlaces);
  const [myPlaces] = useState<PlaceMainListResDto[]>(getMockMyPlaces);
  const [myComments] = useState<MyCommentDto[]>(mockMyComments);

  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem('accessToken');
    navigate('/login', { replace: true });
  }

  return (
    <>
      <div className="mypage-header">
        <h1>마이페이지</h1>
      </div>
      <main className="mypage-container">
        <ProfileCard profile={profile} onLogout={handleLogout} />
        <SavedPlacesSection places={savedPlaces} />
        <MyPlacesSection places={myPlaces} />
        <MyCommentsSection comments={myComments} />
      </main>
    </>
  );
}
