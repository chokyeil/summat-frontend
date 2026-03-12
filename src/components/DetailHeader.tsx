import { useNavigate } from 'react-router-dom';

interface DetailHeaderProps {
  likeCount: number;
  liked?: boolean;
  onLike?: () => void;
  placeId?: string;
  isOwner?: boolean;
}

export default function DetailHeader({ likeCount, liked, onLike, placeId, isOwner }: DetailHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="detail-header">
      <button
        type="button"
        className="btn-icon"
        onClick={() => navigate(-1)}
        aria-label="뒤로가기"
      >
        ←
      </button>
      <div className="detail-header-actions">
        {isOwner && placeId && (
          <button
            type="button"
            className="btn-icon"
            onClick={() => navigate(`/places/${placeId}/edit`)}
            aria-label="수정하기"
          >
            ✏️
          </button>
        )}
        <button
          type="button"
          className="btn-icon"
          onClick={onLike}
          aria-label={`좋아요 ${likeCount}`}
        >
          {liked ? '❤️' : '🤍'} {likeCount}
        </button>
      </div>
    </div>
  );
}
