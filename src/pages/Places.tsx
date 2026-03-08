import { useEffect, useState } from 'react';
import type { PlaceListItemResDto } from '../types/place';
import type { PlaceTagCode } from '../constants/placeTags';
import type { CategoryCode } from '../constants/categories';
import type { RegionCode } from '../constants/regions';
import { CATEGORIES } from '../constants/categories';
import { getPlaceList } from '../api/places';
import SearchBar from '../components/SearchBar';
import CategoryTabs from '../components/CategoryTabs';
import RegionFilterChips from '../components/RegionFilterChips';
import TagFilterChips from '../components/TagFilterChips';
import PlaceCardList from '../components/PlaceCardList';

export default function Places() {
  const [places, setPlaces] = useState<PlaceListItemResDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI 필터 상태 — API 연동 전 로컬 상태만 관리
  // 실제 서버 필터링 구현 시 api/places.ts의 searchPlaces()와 연결
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryCode>(CATEGORIES[0].code);
  const [activeRegion, setActiveRegion] = useState<RegionCode>('all');
  const [selectedTags, setSelectedTags] = useState<PlaceTagCode[]>([]);

  useEffect(() => {
    getPlaceList()
      .then((data) => setPlaces(data.placeList))
      .catch(() => setError('장소 목록을 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  }, []);

  function handleTagToggle(code: PlaceTagCode) {
    setSelectedTags((prev) =>
      prev.includes(code) ? prev.filter((t) => t !== code) : [...prev, code]
    );
  }

  // 현재 미사용 상태값 — 서버 연동 시 useEffect 의존성에 추가 예정
  void searchQuery;
  void activeCategory;
  void activeRegion;

  function renderList() {
    if (loading) return <p className="status-message">로딩 중...</p>;
    if (error) return <p className="status-message" role="alert">{error}</p>;
    if (places.length === 0) return <p className="status-message">등록된 장소가 없습니다.</p>;
    return <PlaceCardList places={places} />;
  }

  return (
    <main className="container places-page">
      <SearchBar value={searchQuery} onChange={setSearchQuery} />
      <CategoryTabs active={activeCategory} onSelect={setActiveCategory} />
      <RegionFilterChips active={activeRegion} onSelect={setActiveRegion} />
      <TagFilterChips selected={selectedTags} onToggle={handleTagToggle} />
      {renderList()}
    </main>
  );
}
