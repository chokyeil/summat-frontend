import { Link } from 'react-router-dom';
import type { PlaceMainListResDto } from '../types/place';

interface SavedPlacesSectionProps {
  places: PlaceMainListResDto[];
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
          {places.map((place) => (
            <Link key={place.placeId} to={`/places/${place.placeId}`} className="mini-card">
              {place.placeImageUrl ? (
                <img src={place.placeImageUrl} alt={place.placeName} className="mini-card-img" />
              ) : (
                <div className="mini-card-img mini-card-img--empty" aria-hidden="true" />
              )}
              <div className="mini-card-info">
                <div className="mini-card-title">{place.placeName}</div>
                <div className="mini-card-meta">{place.placeType}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
