// TODO: 백엔드 placeRegion 실제 값 확인 후 code 조정 필요
export const REGIONS = [
  { code: 'all', label: '전체' },
  { code: '서울', label: '서울' },
  { code: '경기', label: '경기' },
  { code: '인천', label: '인천' },
  { code: '부산', label: '부산' },
  { code: '제주', label: '제주' },
  { code: '강원', label: '강원' },
  { code: '대구', label: '대구' },
  { code: '광주', label: '광주' },
] as const;

export type RegionCode = typeof REGIONS[number]['code'];
