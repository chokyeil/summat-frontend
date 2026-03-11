import api from './index';
import type { ApiResponse } from '../types/auth';
import type { MyPlaceItemResDto } from '../types/place';

/**
 * GET /mypage/places — 내가 등록한 장소 목록 조회
 * 최신 등록순(createdAt DESC). 페이지네이션 없음. Authorization: Bearer 필요.
 */
export async function getMyPlaces(): Promise<MyPlaceItemResDto[]> {
  const res = await api.get<ApiResponse<MyPlaceItemResDto[]>>('/mypage/places');
  return res.data.data;
}
