import { Link } from 'react-router-dom';
import type { PlaceMainListResDto } from '../types/place';

interface MyPlacesSectionProps {
  places: PlaceMainListResDto[];
}

export default function MyPlacesSection({ places }: MyPlacesSectionProps) {
  return (
    <section className="mypage-section">
      <div className="mypage-section-header">
        <h3 className="mypage-section-title">내가 등록한 장소</h3>
        <Link to="/register" className="mypage-cta-link">+ 등록하기</Link>
      </div>
      {places.length === 0 ? (
        <div className="empty-state">
          아직 직접 등록한 장소가 없어요.<br />나만 아는 맛집을 공유해볼까요?
        </div>
      ) : (
        <div className="horizontal-grid">
          {places.map((place) => (
            <article key={place.placeId} className="mini-card">
              <Link to={`/places/${place.placeId}`} className="mini-card-link">
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
              <Link to={`/places/${place.placeId}/edit`} className="mini-card-edit">
                수정하기
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
