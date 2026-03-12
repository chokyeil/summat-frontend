import api from './index';
import type { ApiResponse } from '../types/auth';
import type { MyPlaceItemResDto, LikedPlaceResDto } from '../types/place';
import type { MeResDto, MyReplyResDto } from '../types/user';

/**
 * GET /mypage/me — 현재 로그인 사용자 정보 조회
 * Authorization: Bearer 필요. 댓글 본인 판별(reply.userId === me.id)에 사용.
 */
export async function getMe(): Promise<MeResDto> {
  const res = await api.get<ApiResponse<MeResDto>>('/mypage/me');
  return res.data.data;
}

/**
 * GET /mypage/places — 내가 등록한 장소 목록 조회
 * 최신 등록순(createdAt DESC). 페이지네이션 없음. Authorization: Bearer 필요.
 */
export async function getMyPlaces(): Promise<MyPlaceItemResDto[]> {
  const res = await api.get<ApiResponse<MyPlaceItemResDto[]>>('/mypage/places');
  return res.data.data;
}

/**
 * GET /mypage/replies — 내가 쓴 댓글/대댓글 목록 조회
 * 최신순 정렬. 페이지네이션 없음. 트리 아닌 평면 배열 직접 반환. Authorization: Bearer 필요.
 * depth: 0 → 댓글, 1 → 대댓글. deleted: true 시 content는 서버 치환 문자열.
 */
export async function getMyReplies(): Promise<MyReplyResDto[]> {
  const res = await api.get<ApiResponse<MyReplyResDto[]>>('/mypage/replies');
  return res.data.data;
}

/**
 * GET /mypage/liked-places — 좋아요한 장소 목록 조회
 * 좋아요 누른 순 정렬. 페이지네이션 없음. 배열 직접 반환. Authorization: Bearer 필요.
 * 좋아요한 장소가 삭제된 경우 자동 제외. createdAt은 장소 등록일(좋아요 날짜 아님).
 */
export async function getLikedPlaces(): Promise<LikedPlaceResDto[]> {
  const res = await api.get<ApiResponse<LikedPlaceResDto[]>>('/mypage/liked-places');
  return res.data.data;
}
