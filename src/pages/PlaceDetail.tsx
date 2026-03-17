import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { PlaceDetailResDto, ReplyResDto } from '../types/place';
import { getPlaceDetailById, getReplies, createReply, updateReply, deleteReply, togglePlaceLike, increasePlaceView } from '../api/places';
import { getMe } from '../api/mypage';
import { resolveImageUrl } from '../utils/imageUrl';
import { isTokenValid } from '../utils/jwt';
import { redirectToLogin } from '../utils/auth';
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

  // 좋아요/조회수 상태 — 초기값은 place 로드 후 갱신, API 응답값으로 즉시 업데이트
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [viewCount, setViewCount] = useState(0);
  const [likeError, setLikeError] = useState<string | null>(null);

  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [replyingTo, setReplyingTo] = useState<{ parentId: number; nickName: string } | null>(null);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const storedToken = localStorage.getItem('accessToken');
  const isLoggedIn = storedToken !== null && isTokenValid(storedToken);

  // StrictMode 중복 호출 방지 — 이미 조회수 증가 요청을 보낸 placeId를 기억
  // React 18 StrictMode는 simulated unmount 시 ref 값을 보존하므로 2차 effect에서 차단 가능
  const viewedPlaceIdRef = useRef<number | null>(null);

  useEffect(() => {
    const id = Number(placeId);
    if (!placeId || isNaN(id)) {
      setError('잘못된 접근입니다.');
      setLoading(false);
      return;
    }

    // 장소 정보 + 댓글 로드 (조회수 증가 → 상세+댓글 순서)
    async function load() {
      // 1. 조회수 증가 — 실패해도 페이지 로드 차단 안 함
      // viewedPlaceIdRef로 중복 호출 차단: StrictMode 2차 effect 실행 시 ref 값이 유지되어 스킵됨
      let viewCountFromApi: number | null = null;
      if (viewedPlaceIdRef.current !== id) {
        viewedPlaceIdRef.current = id; // 즉시 잠금 (async 결과 대기 전에 표시해야 중복 차단 가능)
        try {
          const viewData = await increasePlaceView(id);
          viewCountFromApi = viewData.viewCount;
        } catch {
          // 실패 시 상세 API의 viewCount로 fallback
        }
      }

      // 2. 상세 + 댓글 병렬 조회
      try {
        const [placeData, repliesData] = await Promise.all([getPlaceDetailById(id), getReplies(id)]);
        setPlace(placeData);
        setReplies(repliesData);
        setLiked(placeData.liked);
        setLikeCount(placeData.likeCount);
        setViewCount(viewCountFromApi ?? placeData.viewCount);
      } catch {
        setError('정보를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    }
    load();

    // 로그인 상태인 경우 현재 사용자 id 조회 (실패해도 페이지 에러로 처리하지 않음)
    if (isLoggedIn) {
      getMe()
        .then((me) => setCurrentUserId(me.id))
        .catch(() => {});
    }
  }, [placeId]);

  /** 댓글/좋아요 도메인 에러에서 표시할 메시지 추출 (보수적 파싱) */
  function extractErrorMessage(err: unknown, fallback: string): string {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      if (status === 401) return '로그인이 필요합니다.';
      if (status === 403) return '권한이 없습니다.';
      const data = err.response?.data as Record<string, unknown> | undefined;
      if (typeof data?.message === 'string') return data.message;
    }
    return fallback;
  }

  async function handleLikeToggle() {
    if (!redirectToLogin()) return;
    const id = Number(placeId);
    setLikeError(null);
    try {
      const data = await togglePlaceLike(id);
      setLiked(data.liked);
      setLikeCount(data.likeCount);
    } catch (err) {
      setLikeError(extractErrorMessage(err, '좋아요 처리에 실패했습니다.'));
    }
  }

  async function handleCommentSubmit(content: string) {
    if (!redirectToLogin()) return;
    const id = Number(placeId);
    setCommentError(null);
    setIsSubmittingComment(true);
    try {
      await createReply(id, { content, parentId: replyingTo?.parentId ?? null });
      setReplyingTo(null);
      const updated = await getReplies(id);
      setReplies(updated);
    } catch (err) {
      setCommentError(extractErrorMessage(err, '댓글 작성에 실패했습니다.'));
    } finally {
      setIsSubmittingComment(false);
    }
  }

  async function handleUpdateReply(replyId: number, content: string) {
    if (!redirectToLogin()) return;
    const id = Number(placeId);
    setCommentError(null);
    try {
      await updateReply(replyId, { content });
      const updated = await getReplies(id);
      setReplies(updated);
    } catch (err) {
      setCommentError(extractErrorMessage(err, '댓글 수정에 실패했습니다.'));
    }
  }

  async function handleDeleteReply(replyId: number) {
    if (!redirectToLogin()) return;
    if (!confirm('정말 삭제하시겠습니까?')) return;
    const id = Number(placeId);
    setCommentError(null);
    try {
      await deleteReply(replyId);
      const updated = await getReplies(id);
      setReplies(updated);
    } catch (err) {
      setCommentError(extractErrorMessage(err, '댓글 삭제에 실패했습니다.'));
    }
  }

  function handleReply(parentId: number, nickName: string) {
    setReplyingTo({ parentId, nickName });
  }

  if (loading) return <p className="status-message">로딩 중...</p>;
  if (error) return <p className="status-message" role="alert">{error}</p>;
  if (!place) return null;

  return (
    <>
      <DetailHeader placeId={placeId} />
      <main className="detail-container">
        {/* 이미지 + 기본정보: 데스크탑에서 좌우 분할 */}
        <div className="content-wrapper">
          <PlaceImage src={resolveImageUrl(place.imageUrl)} alt={place.placeName} />

          <section className="info-section">
            <PlaceInfo place={place} />
            <TagChips tags={place.tags} />
          </section>
        </div>

        {/* 상세 설명 본문: content-wrapper 아래 전체 너비 */}
        <PlaceDescription text={place.description} />

        {/* 통계 + 댓글 */}
        <div className="detail-lower">
          <div className="engagement-stats">
            <button
              type="button"
              className="stat-item like-stat-btn"
              onClick={handleLikeToggle}
              aria-label={`좋아요 ${likeCount}`}
            >
              {liked ? '❤️' : '🤍'} 좋아요 {likeCount}
            </button>
            <div className="stat-item">💬 댓글 {replies.length}</div>
            <div className="stat-item">👁 조회 {viewCount}</div>
          </div>

          {likeError && <p className="status-message" role="alert">{likeError}</p>}
          {commentError && <p className="status-message" role="alert">{commentError}</p>}
          <CommentList
            replies={replies}
            currentUserId={currentUserId}
            onEdit={handleUpdateReply}
            onDelete={handleDeleteReply}
            onReply={handleReply}
            isLoggedIn={isLoggedIn}
          />
          <CommentInput
            isLoggedIn={isLoggedIn}
            onSubmit={handleCommentSubmit}
            replyingTo={replyingTo}
            onCancelReply={() => setReplyingTo(null)}
            isSubmitting={isSubmittingComment}
          />
        </div>
      </main>
    </>
  );
}
