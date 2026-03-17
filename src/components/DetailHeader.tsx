import { useNavigate } from 'react-router-dom';

interface DetailHeaderProps {
  placeId?: string;
  isOwner?: boolean;
}

export default function DetailHeader({ placeId, isOwner }: DetailHeaderProps) {
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
      </div>
    </div>
  );
}
