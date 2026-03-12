import { Link } from 'react-router-dom';
import type { LikedPlaceResDto } from '../types/place';
import { resolveImageUrl } from '../utils/imageUrl';

interface SavedPlacesSectionProps {
  places: LikedPlaceResDto[];
}

export default function SavedPlacesSection({ places }: SavedPlacesSectionProps) {
  return (
    <section className="mypage-section">
      <div className="mypage-section-header">
        <h3 className="mypage-section-title">찜한 장소</h3>
        {places.length > 0 && (
          <Link to="/likes" className="view-all">전체보기</Link>
        )}
      </div>
      {places.length === 0 ? (
        <div className="empty-state">아직 찜한 장소가 없어요.</div>
      ) : (
        <div className="horizontal-grid">
          {places.map((place) => {
            const imgSrc = resolveImageUrl(place.imageUrl);
            return (
              <Link key={place.placeId} to={`/places/${place.placeId}`} className="mini-card">
                {imgSrc ? (
                  <img src={imgSrc} alt={place.placeName} className="mini-card-img" />
                ) : (
                  <div className="mini-card-img mini-card-img--empty" aria-hidden="true" />
                )}
                <div className="mini-card-info">
                  <div className="mini-card-title">{place.placeName}</div>
                  <div className="mini-card-meta">{place.category}</div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
