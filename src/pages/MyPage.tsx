import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { MeResDto, MyReplyResDto } from '../types/user';
import type { LikedPlaceResDto, MyPlaceItemResDto } from '../types/place';
import type { ApiResponse } from '../types/auth';
import { getMe, getMyPlaces, getMyReplies, getLikedPlaces } from '../api/mypage';
import { deletePlace } from '../api/places';
import ProfileCard from '../components/ProfileCard';
import SavedPlacesSection from '../components/SavedPlacesSection';
import MyPlacesSection from '../components/MyPlacesSection';
import MyCommentsSection from '../components/MyCommentsSection';

export default function MyPage() {
  // 프로필 / 찜한 장소 / 내가 쓴 댓글 — 단일 useEffect로 묶어 처리
  const [profile, setProfile] = useState<MeResDto | null>(null);
  const [likedPlaces, setLikedPlaces] = useState<LikedPlaceResDto[]>([]);
  const [myReplies, setMyReplies] = useState<MyReplyResDto[]>([]);
  const [sectionsLoading, setSectionsLoading] = useState(true);
  const [sectionsError, setSectionsError] = useState<string | null>(null);

  // 내가 등록한 장소 — 삭제 기능이 연결되어 있어 독립 상태 유지
  const [myPlaces, setMyPlaces] = useState<MyPlaceItemResDto[]>([]);
  const [myPlacesLoading, setMyPlacesLoading] = useState(true);
  const [myPlacesError, setMyPlacesError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    // 프로필 + 찜한 장소 + 내가 쓴 댓글 병렬 조회
    Promise.all([getMe(), getLikedPlaces(), getMyReplies()])
      .then(([profileData, likedPlacesData, repliesData]) => {
        setProfile(profileData);
        setLikedPlaces(likedPlacesData);
        setMyReplies(repliesData);
      })
      .catch((err) => {
        if (axios.isAxiosError(err)) {
          const data = err.response?.data as Record<string, unknown> | undefined;
          setSectionsError(
            typeof data?.message === 'string' ? data.message : '데이터를 불러오지 못했습니다.'
          );
        } else {
          setSectionsError('데이터를 불러오지 못했습니다.');
        }
      })
      .finally(() => setSectionsLoading(false));

    // 내가 등록한 장소 — 독립 조회 (삭제 기능 연결)
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
        {sectionsLoading ? (
          <p className="status-message">로딩 중...</p>
        ) : sectionsError ? (
          <p className="status-message" role="alert">{sectionsError}</p>
        ) : (
          <>
            {profile && <ProfileCard profile={profile} onLogout={handleLogout} />}
            <SavedPlacesSection places={likedPlaces} />
          </>
        )}
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
        {!sectionsLoading && !sectionsError && (
          <MyCommentsSection comments={myReplies} />
        )}
      </main>
    </>
  );
}
