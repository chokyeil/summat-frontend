import type { UserProfileDto, MyCommentDto } from '../types/user';
import type { PlaceMainListResDto } from '../types/place';

const MOCK_MY_PLACES_KEY = 'summat_mock_my_places';

export function getMockMyPlaces(): PlaceMainListResDto[] {
  try {
    const raw = localStorage.getItem(MOCK_MY_PLACES_KEY);
    const stored: PlaceMainListResDto[] = raw ? (JSON.parse(raw) as PlaceMainListResDto[]) : [];
    return [...stored, ...mockMyPlaces];
  } catch {
    return [...mockMyPlaces];
  }
}

export function addMockMyPlace(place: PlaceMainListResDto): void {
  try {
    const raw = localStorage.getItem(MOCK_MY_PLACES_KEY);
    const stored: PlaceMainListResDto[] = raw ? (JSON.parse(raw) as PlaceMainListResDto[]) : [];
    stored.unshift(place);
    localStorage.setItem(MOCK_MY_PLACES_KEY, JSON.stringify(stored));
  } catch {
    // localStorage 쓰기 실패 시 무시
  }
}

// TODO: 실제 API 연동 시 제거 — JWT sub 또는 /api/me 응답의 userId로 교체
export const MOCK_CURRENT_USER_ID = 1;

export const mockUserProfile: UserProfileDto = {
  nickname: '숨맛탐험가',
  email: 'explorer@summat.com',
  bio: '숨맛에서 나만의 장소를 기록해보세요. 빵집 투어를 좋아합니다. 🥐',
};

export const mockSavedPlaces: PlaceMainListResDto[] = [
  {
    placeId: 1,
    placeName: '브루클린 카페',
    placeLotAddress: '서울 성동구',
    placeRoadAddress: '서울 성동구 성수이로',
    placeType: '카페',
    placeImageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=300&q=80',
    oneLineDesc: '성수동 감성 카페',
    tags: [],
    likeCount: 24,
    viewCount: 120,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    placeId: 2,
    placeName: '할머니 손맛 수제비',
    placeLotAddress: '서울 마포구',
    placeRoadAddress: '서울 마포구 망원동',
    placeType: '음식점',
    placeImageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=300&q=80',
    oneLineDesc: '정성 가득한 수제비',
    tags: [],
    likeCount: 18,
    viewCount: 88,
    createdAt: '2024-01-02T00:00:00Z',
  },
  {
    placeId: 3,
    placeName: '베이커리 결',
    placeLotAddress: '서울 성동구',
    placeRoadAddress: '서울 성동구 성수이로',
    placeType: '빵집',
    placeImageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=300&q=80',
    oneLineDesc: '매일 아침 구워나오는 빵',
    tags: [],
    likeCount: 31,
    viewCount: 156,
    createdAt: '2024-01-03T00:00:00Z',
  },
];

// 내가 등록한 장소 mock — mockMyComments의 장소명과 연결
export const mockMyPlaces: PlaceMainListResDto[] = [
  {
    placeId: 4,
    placeName: '바다 앞 작은 집',
    placeLotAddress: '제주특별자치도 제주시 애월읍',
    placeRoadAddress: '제주특별자치도 제주시 애월해안로 132',
    placeType: '카페',
    placeImageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=300&q=80',
    oneLineDesc: '파도 소리를 들으며 마시는 아인슈페너 한 잔.',
    tags: [],
    likeCount: 456,
    viewCount: 3210,
    createdAt: '2024-02-10T14:00:00Z',
  },
  {
    placeId: 7,
    placeName: '진짜 화덕 피자',
    placeLotAddress: '대구광역시 중구 삼덕동2가',
    placeRoadAddress: '대구광역시 중구 동성로 25',
    placeType: '음식점',
    placeImageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=300&q=80',
    oneLineDesc: '참나무 장작으로 구워낸 쫄깃한 도우의 정석.',
    tags: [],
    likeCount: 154,
    viewCount: 870,
    createdAt: '2024-02-25T12:00:00Z',
  },
];

export const mockMyComments: MyCommentDto[] = [
  { id: 1, placeName: '브루클린 카페', content: '여기 라떼가 정말 고소해요! 또 가고 싶네요.' },
  { id: 2, placeName: '진짜 화덕 피자', content: '도우가 쫄깃해서 끝까지 다 먹게 되더라구요.' },
  { id: 3, placeName: '바다 앞 작은 집', content: '뷰가 미쳤어요.. 인생샷 남기기 최고입니다.' },
];
