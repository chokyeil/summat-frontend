import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { PlaceDetailResDto, ReplyResDto } from '../types/place';
import { getPlaceDetailById, getReplies } from '../api/places';
import { resolveImageUrl } from '../utils/imageUrl';
import DetailHeader from '../components/DetailHeader';
import PlaceImage from '../components/PlaceImage';
import PlaceInfo from '../components/PlaceInfo';
import TagChips from '../components/TagChips';
import PlaceDescription from '../components/PlaceDescription';
import CommentList from '../components/CommentList';
import CommentInput from '../components/CommentInput';

export default function PlaceDetail() {
  const { placeId } = useParams<{ placeId: string }>();
  const [place, setPlace] = useState<PlaceDetailResDto | null>(null);
  const [replies, setReplies] = useState<ReplyResDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isLoggedIn = !!localStorage.getItem('accessToken');

  useEffect(() => {
    const id = Number(placeId);
    if (!placeId || isNaN(id)) {
      setError('잘못된 접근입니다.');
      setLoading(false);
      return;
    }
    Promise.all([getPlaceDetailById(id), getReplies(id)])
      .then(([placeData, repliesData]) => {
        setPlace(placeData);
        setReplies(repliesData);
      })
      .catch(() => setError('정보를 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  }, [placeId]);

  function handleCommentSubmit(_content: string) {
    // TODO: 댓글 작성 API 연동
    //   1. types/place.ts에 CreateReplyReqDto 확정 후 api/places.ts에 createReply() 추가
    //   2. 성공 시 getReplies(id) 재조회 또는 replies 상태에 낙관적 업데이트
    //   3. 인증 실패(401) 시 /login 이동 처리
  }

  if (loading) return <p className="status-message">로딩 중...</p>;
  if (error) return <p className="status-message" role="alert">{error}</p>;
  if (!place) return null;

  // TODO: 작성자 판별(isOwner)은 백엔드에서 authorId/userId 등 제공 시 연동
  return (
    <>
      <DetailHeader likeCount={place.likeCount} placeId={placeId} />
      <main className="detail-container">
        <div className="content-wrapper">
          <PlaceImage src={resolveImageUrl(place.imageUrl)} alt={place.placeName} />

          <section className="info-section">
            <PlaceInfo place={place} />

            <TagChips tags={place.tags} />

            <PlaceDescription text={place.description} />

            <div className="engagement-stats">
              <div className="stat-item">❤️ 좋아요 {place.likeCount}</div>
              <div className="stat-item">💬 댓글 {replies.length}</div>
            </div>

            <CommentList replies={replies} />
            <CommentInput isLoggedIn={isLoggedIn} onSubmit={handleCommentSubmit} />
          </section>
        </div>
      </main>
    </>
  );
}
