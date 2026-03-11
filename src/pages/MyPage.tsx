import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { UserProfileDto, MyCommentDto } from '../types/user';
import type { PlaceMainListResDto } from '../types/place';
import type { MyPlaceItemResDto } from '../types/place';
import type { ApiResponse } from '../types/auth';
import { mockUserProfile, mockSavedPlaces, mockMyComments } from '../mocks/user';
import { getMyPlaces } from '../api/mypage';
import { deletePlace } from '../api/places';
import ProfileCard from '../components/ProfileCard';
import SavedPlacesSection from '../components/SavedPlacesSection';
import MyPlacesSection from '../components/MyPlacesSection';
import MyCommentsSection from '../components/MyCommentsSection';

export default function MyPage() {
  // TODO: 실제 API 연동 시 useEffect + getMyProfile(), getSavedPlaces(), getMyComments() 교체
  const [profile] = useState<UserProfileDto>(mockUserProfile);
  const [savedPlaces] = useState<PlaceMainListResDto[]>(mockSavedPlaces);
  const [myComments] = useState<MyCommentDto[]>(mockMyComments);

  const [myPlaces, setMyPlaces] = useState<MyPlaceItemResDto[]>([]);
  const [myPlacesLoading, setMyPlacesLoading] = useState(true);
  const [myPlacesError, setMyPlacesError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    getMyPlaces()
      .then(setMyPlaces)
      .catch(() => setMyPlacesError('내가 등록한 장소를 불러오지 못했습니다.'))
      .finally(() => setMyPlacesLoading(false));
  }, []);

  function handleLogout() {
    localStorage.removeItem('accessToken');
    navigate('/login', { replace: true });
  }

  async function handleDeleteMyPlace(placeId: number) {
    if (!confirm('정말 삭제하시겠어요?')) return;
    setDeleteError(null);
    try {
      await deletePlace(placeId);
      setMyPlaces((prev) => prev.filter((p) => p.placeId !== placeId));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 403) {
          setDeleteError('권한이 없습니다.');
        } else {
          const apiMessage = (err.response?.data as ApiResponse | undefined)?.message;
          setDeleteError(apiMessage ?? '삭제에 실패했습니다.');
        }
      } else {
        setDeleteError('삭제에 실패했습니다.');
      }
    }
  }

  return (
    <>
      <div className="mypage-header">
        <h1>마이페이지</h1>
      </div>
      <main className="mypage-container">
        <ProfileCard profile={profile} onLogout={handleLogout} />
        <SavedPlacesSection places={savedPlaces} />
        {myPlacesLoading ? (
          <p className="status-message">로딩 중...</p>
        ) : myPlacesError ? (
          <p className="status-message" role="alert">{myPlacesError}</p>
        ) : (
          <>
            {deleteError && <p className="status-message" role="alert">{deleteError}</p>}
            <MyPlacesSection places={myPlaces} onDelete={handleDeleteMyPlace} />
          </>
        )}
        <MyCommentsSection comments={myComments} />
      </main>
    </>
  );
}
