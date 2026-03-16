/**
 * 지역 필터 옵션 — MVP 광역 단위만 제공
 * "전국"은 목록 첫 번째 값 (API 전송 시 생략 = 전체 조회)
 */
export const REGION_OPTIONS = [
  '전국',
  '서울',
  '경기',
  '인천',
  '부산',
  '대구',
  '광주',
  '대전',
  '울산',
  '세종',
  '강원',
  '충북',
  '충남',
  '전북',
  '전남',
  '경북',
  '경남',
  '제주',
] as const;

export type RegionCode = typeof REGION_OPTIONS[number];

/**
 * 장소 등록/수정(PlaceForm) 전용 — "전국" 제외한 실제 선택 지역 목록
 * RegionFilterChips(목록 필터)에는 REGION_OPTIONS 직접 사용
 */
export const REGIONS = [
  { code: '서울', label: '서울' },
  { code: '경기', label: '경기' },
  { code: '인천', label: '인천' },
  { code: '부산', label: '부산' },
  { code: '대구', label: '대구' },
  { code: '광주', label: '광주' },
  { code: '대전', label: '대전' },
  { code: '울산', label: '울산' },
  { code: '세종', label: '세종' },
  { code: '강원', label: '강원' },
  { code: '충북', label: '충북' },
  { code: '충남', label: '충남' },
  { code: '전북', label: '전북' },
  { code: '전남', label: '전남' },
  { code: '경북', label: '경북' },
  { code: '경남', label: '경남' },
  { code: '제주', label: '제주' },
] as const;
