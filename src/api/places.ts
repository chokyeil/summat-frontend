import axios from 'axios';
import api from './index';
import type { ApiResponse } from '../types/auth';
import type {
  PlaceListResDto,
  PlaceDetailResDto,
  PlaceListPageResDto,
  PlacesDetailResDto,
  ReplyResDto,
} from '../types/place';
import type { PlaceTagCode } from '../constants/placeTags';
import { mockPlaceList, mockPlaceDetail } from '../mocks/places';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

/** axios 네트워크 에러(CORS 포함) 여부 확인. 서버 응답이 있는 4xx/5xx는 해당 안 됨. */
function isNetworkError(err: unknown): boolean {
  return axios.isAxiosError(err) && !err.response;
}

// ============================================================
// 백엔드 연동 API 함수 — 백엔드 규격 엔드포인트 + 타입 사용
// ============================================================

/**
 * GET /places/search 파라미터 (확정)
 * 목록 조회 / 검색 / 필터를 모두 이 엔드포인트로 처리.
 * 'all' 또는 빈 값은 해당 파라미터를 생략하여 전체 조회.
 */
export interface PlaceSearchParams {
  q?: string;           // 검색어
  categories?: string;  // 카테고리 (백엔드 파라미터명: categories)
  regions?: string;     // 지역 (백엔드 파라미터명: regions)
  tags?: string[];      // 태그 — 반복 key 방식 (tags=wifi&tags=quiet)
  page?: number;
  size?: number;
}

/**
 * GET /places/search — 장소 목록/검색/필터 통합 조회
 * 초기 진입, 검색어, 카테고리, 지역, 태그 필터 모두 이 함수로 처리.
 * TODO: tags 필터는 백엔드 반영 완료 후 동작 확인 필요 (현재 전송 구조만 맞춤)
 */
export async function getPlaceList(params?: PlaceSearchParams): Promise<PlaceListResDto> {
  const qp = new URLSearchParams();
  if (params?.q) qp.append('q', params.q);
  if (params?.categories && params.categories !== 'all') qp.append('categories', params.categories);
  if (params?.regions && params.regions !== 'all') qp.append('regions', params.regions);
  // TODO: 백엔드 tags 필터 반영 완료 전까지 전송 구조만 유지 (현재 필터링 미동작)
  params?.tags?.forEach((tag) => qp.append('tags', tag));
  if (params?.page !== undefined) qp.append('page', String(params.page));
  if (params?.size !== undefined) qp.append('size', String(params.size));
  const res = await api.get<ApiResponse<PlaceListResDto>>('/places/search', { params: qp });
  return res.data.data;
}

/**
 * GET /places/detail/{placeId} — 장소 상세 조회
 * TODO: VITE_USE_MOCK 시 PlaceDetailResDto mock 데이터 추가 필요 (화면 연동 시)
 */
export async function getPlaceDetailById(placeId: number): Promise<PlaceDetailResDto> {
  const res = await api.get<ApiResponse<PlaceDetailResDto>>(`/places/detail/${placeId}`);
  return res.data.data;
}

/**
 * POST /places/add — 장소 등록 (FormData)
 * FRONTEND_RULES §7: 파일 업로드는 FormData 사용, Content-Type은 axios 자동 설정
 * 등록 성공 시 data 없음 — message만 사용. Authorization: Bearer 필요.
 */
export async function createPlace(formData: FormData): Promise<void> {
  await api.post<ApiResponse>('/places/add', formData);
}

/**
 * PUT /places/update/{placeId} — 장소 수정 (FormData)
 * FRONTEND_RULES §7: 파일 업로드는 FormData 사용, Content-Type은 axios 자동 설정
 * 수정 성공 시 data 없음 — message만 사용. Authorization: Bearer 필요.
 * image를 append하지 않으면 기존 이미지 유지 (백엔드 정책).
 */
export async function updatePlace(placeId: number, formData: FormData): Promise<void> {
  await api.put<ApiResponse>(`/places/update/${placeId}`, formData);
}

/**
 * GET /reply/{placeId} — 장소 댓글 목록 조회
 * 인증 불필요. 루트 댓글(depth=0) 배열 반환, 각 댓글 내 replies로 대댓글 포함.
 * replies 필드는 null 가능 — ReplyResDto.replies: ReplyResDto[] | null
 */
export async function getReplies(placeId: number): Promise<ReplyResDto[]> {
  const res = await api.get<ApiResponse<ReplyResDto[]>>(`/reply/${placeId}`);
  return res.data.data;
}

// ============================================================
// mock 기반 API 함수 — 기존 화면 컴포넌트에서 사용 중
// TODO: 화면 API 연동 시 위 백엔드 연동 함수로 순차 교체 후 삭제
// ============================================================

/**
 * @deprecated 화면 연동 시 getPlaceList()로 교체
 * TODO: 실제 엔드포인트 경로 확인 필요
 */
export async function getPlaces(page = 0): Promise<PlaceListPageResDto> {
  if (USE_MOCK) return mockPlaceList;
  try {
    const res = await api.get<ApiResponse<PlaceListPageResDto>>('/api/places', { params: { page } });
    return res.data.data;
  } catch (err) {
    if (isNetworkError(err)) return mockPlaceList;
    throw err;
  }
}

/**
 * @deprecated mock 전용 — Places.tsx는 getPlaceList()로 교체 완료
 * 엔드포인트 /places/search 확정. 타입/구조는 위 getPlaceList() 참고.
 */
export async function searchPlaces(tags: PlaceTagCode[], page = 0): Promise<PlaceListPageResDto> {
  if (USE_MOCK) return mockPlaceList;
  try {
    const params = new URLSearchParams();
    params.append('page', String(page));
    tags.forEach((tag) => params.append('tags', tag));
    const res = await api.get<ApiResponse<PlaceListPageResDto>>('/api/places/search', { params });
    return res.data.data;
  } catch (err) {
    if (isNetworkError(err)) return mockPlaceList;
    throw err;
  }
}

/**
 * @deprecated 화면 연동 시 getPlaceDetailById()로 교체
 * TODO: 실제 엔드포인트 경로 확인 필요
 */
export async function getPlaceDetail(placeId: number): Promise<PlacesDetailResDto> {
  if (USE_MOCK) return mockPlaceDetail;
  try {
    const res = await api.get<ApiResponse<PlacesDetailResDto>>(`/api/places/${placeId}`);
    return res.data.data;
  } catch (err) {
    if (isNetworkError(err)) return mockPlaceDetail;
    throw err;
  }
}

