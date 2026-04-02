import { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { MyPlaceItemResDto } from '../types/place';
import { resolveImageUrl, PLACEHOLDER_IMAGE } from '../utils/imageUrl';
import { redirectToLogin } from '../utils/auth';

interface MyPlacesSectionProps {
  places: MyPlaceItemResDto[];
  onDelete?: (placeId: number) => void;
}

const SCROLL_STEP = 192; // 카드 폭(160~180px) + gap(12px) 기준

export default function MyPlacesSection({ places, onDelete }: MyPlacesSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollRight(el.scrollWidth > el.clientWidth);
  }, [places]);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  }

  function handleScrollLeft() {
    scrollRef.current?.scrollBy({ left: -SCROLL_STEP, behavior: 'smooth' });
  }

  function handleScrollRight() {
    scrollRef.current?.scrollBy({ left: SCROLL_STEP, behavior: 'smooth' });
  }

  return (
    <section className="mypage-section">
      <div className="mypage-section-header">
        <h3 className="mypage-section-title">내가 등록한 장소</h3>
        <div className="my-places-header-right">
          {places.length > 0 && (
            <div className="my-places-nav">
              <button
                type="button"
                className="mp-nav-btn"
                onClick={handleScrollLeft}
                disabled={!canScrollLeft}
                aria-label="이전 카드"
              >
                ‹
              </button>
              <button
                type="button"
                className="mp-nav-btn"
                onClick={handleScrollRight}
                disabled={!canScrollRight}
                aria-label="다음 카드"
              >
                ›
              </button>
            </div>
          )}
          <button
            type="button"
            className="mypage-cta-link"
            onClick={() => { if (!redirectToLogin()) return; navigate('/register'); }}
          >
            + 등록하기
          </button>
        </div>
      </div>
      {places.length === 0 ? (
        <div className="empty-state">
          아직 직접 등록한 장소가 없어요.<br />나만 아는 맛집을 공유해볼까요?
        </div>
      ) : (
        <div className="my-places-scroll-wrapper" ref={scrollRef} onScroll={handleScroll}>
          <div className="horizontal-grid">
            {places.map((place) => (
              <article key={place.placeId} className="mini-card">
                <Link to={`/places/${place.placeId}`} className="mini-card-link">
                  <img
                    src={resolveImageUrl(place.imageUrl) || PLACEHOLDER_IMAGE}
                    alt={place.placeName}
                    className="mini-card-img"
                    onError={(e) => {
                      const img = e.currentTarget;
                      if (img.dataset.fallbackApplied === 'true') return;
                      img.dataset.fallbackApplied = 'true';
                      img.src = PLACEHOLDER_IMAGE;
                    }}
                  />
                  <div className="mini-card-info">
                    <div className="mini-card-title">{place.placeName}</div>
                    <div className="mini-card-meta">{place.category}</div>
                  </div>
                </Link>
                <div className="mini-card-actions">
                  <button
                    type="button"
                    className="mini-card-edit"
                    onClick={() => { if (!redirectToLogin()) return; navigate(`/places/${place.placeId}/edit`); }}
                  >
                    수정하기
                  </button>
                  {onDelete && (
                    <button type="button" className="mini-card-delete" onClick={() => onDelete(place.placeId)}>
                      삭제하기
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
