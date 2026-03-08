// TODO: 백엔드 placeType 실제 값과 매핑 확인 필요
export const CATEGORIES = [
  { code: '카페', label: '카페' },
  { code: '빵집', label: '빵집' },
  { code: '음식점', label: '음식점' },
] as const;

export type CategoryCode = typeof CATEGORIES[number]['code'];
