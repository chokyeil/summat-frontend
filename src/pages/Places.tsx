import axios from 'axios';
import { useEffect, useState } from 'react';
import type { PlaceListItemResDto } from '../types/place';
import type { PlaceTagCode } from '../constants/placeTags';
import type { CategoryCode } from '../constants/categories';
import type { RegionCode } from '../constants/regions';
import { CATEGORIES } from '../constants/categories';
import { getPlaceList, togglePlaceLike } from '../api/places';
import SearchBar from '../components/SearchBar';
import CategoryTabs from '../components/CategoryTabs';
import RegionFilterChips from '../components/RegionFilterChips';
import TagFilterChips from '../components/TagFilterChips';
import PlaceCardList from '../components/PlaceCardList';

export default function Places() {
  const [places, setPlaces] = useState<PlaceListItemResDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likeError, setLikeError] = useState<string | null>(null);

  // UI 필터 상태 — 변경 시 getPlaceList() 재호출 (GET /places/search)
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryCode>(CATEGORIES[0].code);
  const [activeRegion, setActiveRegion] = useState<RegionCode>('all');
  const [selectedTags, setSelectedTags] = useState<PlaceTagCode[]>([]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getPlaceList({
      q: searchQuery.trim() || undefined,
      categories: activeCategory,
      regions: activeRegion,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
    })
      .then((data) => setPlaces(data.placeList))
      .catch(() => setError('장소 목록을 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  }, [searchQuery, activeCategory, activeRegion, selectedTags]);

  function handleTagToggle(code: PlaceTagCode) {
    setSelectedTags((prev) =>
      prev.includes(code) ? prev.filter((t) => t !== code) : [...prev, code]
    );
  }

  async function handleLikeToggle(placeId: number) {
    setLikeError(null);
    try {
      const data = await togglePlaceLike(placeId);
      setPlaces((prev) =>
        prev.map((p) =>
          p.placeId === placeId ? { ...p, liked: data.liked, likeCount: data.likeCount } : p
        )
      );
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        if (status === 401) {
          setLikeError('로그인이 필요합니다.');
        } else {
          const d = err.response?.data as Record<string, unknown> | undefined;
          setLikeError(typeof d?.message === 'string' ? d.message : '좋아요 처리에 실패했습니다.');
        }
      } else {
        setLikeError('좋아요 처리에 실패했습니다.');
      }
    }
  }

  function renderList() {
    if (loading) return <p className="status-message">로딩 중...</p>;
    if (error) return <p className="status-message" role="alert">{error}</p>;
    if (places.length === 0) return <p className="status-message">등록된 장소가 없습니다.</p>;
    return <PlaceCardList places={places} onLike={handleLikeToggle} />;
  }

  return (
    <main className="container places-page">
      <SearchBar value={searchQuery} onChange={setSearchQuery} />
      <CategoryTabs active={activeCategory} onSelect={setActiveCategory} />
      <RegionFilterChips active={activeRegion} onSelect={setActiveRegion} />
      <TagFilterChips selected={selectedTags} onToggle={handleTagToggle} />
      {likeError && <p className="status-message" role="alert">{likeError}</p>}
      {renderList()}
    </main>
  );
}
