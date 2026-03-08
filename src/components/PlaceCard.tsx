import { Link } from 'react-router-dom';
import type { PlaceListItemResDto } from '../types/place';
import { PLACE_TAGS } from '../constants/placeTags';
import { resolveImageUrl } from '../utils/imageUrl';

const tagLabelMap = Object.fromEntries(PLACE_TAGS.map((t) => [t.code, t.label]));

interface PlaceCardProps {
  place: PlaceListItemResDto;
}

export default function PlaceCard({ place }: PlaceCardProps) {
  const imgSrc = resolveImageUrl(place.imageUrl);

  return (
    <article className="card">
      <Link to={`/places/${place.placeId}`}>
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={place.placeName}
            className="card-img"
          />
        ) : (
          <div className="card-img card-img--empty" aria-hidden="true" />
        )}
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
            <span>❤️ {place.likeCount}</span>
            <span>👁 {place.viewCount}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
