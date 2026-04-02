import { Link } from 'react-router-dom';
import type { PlaceListItemResDto } from '../types/place';
import { PLACE_TAGS } from '../constants/placeTags';
import { resolveImageUrl, PLACEHOLDER_IMAGE } from '../utils/imageUrl';

const tagLabelMap = Object.fromEntries(PLACE_TAGS.map((t) => [t.code, t.label]));

interface PlaceCardProps {
  place: PlaceListItemResDto;
  onLike?: () => void;
}

export default function PlaceCard({ place, onLike }: PlaceCardProps) {
  const imgSrc = resolveImageUrl(place.imageUrl) || PLACEHOLDER_IMAGE;

  function handleLikeClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    onLike?.();
  }

  return (
    <article className="card">
      <Link to={`/places/${place.placeId}`}>
        <img
          src={imgSrc}
          alt={place.placeName}
          className="card-img"
          onError={(e) => {
            const img = e.currentTarget;
            if (img.dataset.fallbackApplied === 'true') return;
            img.dataset.fallbackApplied = 'true';
            img.src = PLACEHOLDER_IMAGE;
          }}
        />
        <div className="card-body">
          <div className="card-meta">{place.category}</div>
          <h3 className="card-title">{place.placeName}</h3>
          <p className="card-desc">{place.summary}</p>
          <div className="card-tags">
            {place.tags.map((code) => (
              <span key={code} className="card-tag">
                #{tagLabelMap[code] ?? code}
              </span>
            ))}
          </div>
          <div className="card-footer">
            <button
              type="button"
              className="card-like-btn"
              onClick={handleLikeClick}
              aria-label={`좋아요 ${place.likeCount}`}
            >
              {place.liked ? '❤️' : '🤍'} {place.likeCount}
            </button>
            <span>👁 {place.viewCount}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
