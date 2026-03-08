import type { PlaceTagCode } from '../constants/placeTags';

// ============================================================
// 백엔드 API 응답 DTO — 연동 기준 (필드명 백엔드 규격 그대로 유지)
// ============================================================

/** GET /places/list 응답 아이템 */
export interface PlaceListItemResDto {
  placeId: number;
  placeName: string;
  imageUrl: string;
  lotAddress: string;
  roadAddress: string;
  summary: string;
  category: string;
  tags: string[];
  likeCount: number;
  viewCount: number;
  createdAt: string;
}

/** GET /places/list 전체 응답 data 래퍼 (페이지네이션 구조 확정) */
export interface PlaceListResDto {
  placeList: PlaceListItemResDto[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

/** GET /places/detail/{placeId} 응답 */
export interface PlaceDetailResDto {
  placeId: number;
  placeName: string;
  imageUrl: string;
  lotAddress: string;
  roadAddress: string;
  summary: string;
  description: string;
  category: string;
  region: string;
  tags: string[];
  likeCount: number;
  viewCount: number;
  createdAt: string;
  // authorId: 현재 백엔드 응답에 포함되지 않음 — 작성자 판별 기능은 추후 별도 API 확인 필요
}

// ============================================================
// mock 전용 DTO — 기존 화면 컴포넌트에서 사용 중
// TODO: 화면 API 연동 시 위 백엔드 규격 타입으로 순차 교체 후 삭제
// ============================================================

/**
 * @deprecated mock 전용 — 화면 연동 시 PlaceListItemResDto로 교체
 *
 * 필드명 대응:
 * placeImageUrl → imageUrl
 * placeLotAddress → lotAddress
 * placeRoadAddress → roadAddress
 * oneLineDesc → summary
 * placeType → category
 */
export interface PlaceMainListResDto {
  placeId: number;
  placeName: string;
  placeLotAddress: string;
  placeRoadAddress: string;
  placeType: string;
  placeImageUrl: string;
  oneLineDesc: string;
  tags: PlaceTagCode[];
  likeCount: number;
  viewCount: number;
  createdAt: string;
}

/**
 * @deprecated mock 전용 — 화면 연동 시 PlaceListResDto로 교체
 */
export interface PlaceListPageResDto {
  placeList: PlaceMainListResDto[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

/**
 * @deprecated mock 전용 — 화면 연동 시 PlaceDetailResDto로 교체
 *
 * 필드명 대응:
 * placeImageUrl → imageUrl (추가)
 * placeLotAddress → lotAddress
 * placeRoadAddress → roadAddress
 * oneLineDesc → summary
 * placeDescription → description
 * placeType → category
 * placeRegion → region
 * (placeId, tags, createdAt 추가 예정)
 */
export interface PlacesDetailResDto {
  placeName: string;
  placeLotAddress: string;
  placeRoadAddress: string;
  oneLineDesc: string;
  placeDescription: string;
  placeType: string;
  placeRegion: string;
  likeCount: number;
  viewCount: number;
  // TODO: 백엔드 응답에 authorId 추가 시 필드명 확인
  authorId?: number;
}

// ============================================================
// 댓글 DTO — 백엔드 규격 미확정, TODO 처리
// ============================================================

/** GET /reply/{placeId} — 장소 댓글 응답 */
export interface ReplyResDto {
  id: number;
  placeId: number;
  userId: number;
  nickName: string;
  content: string;              // deleted/hidden 시 서버에서 치환된 메시지가 내려옴
  depth: number;                // 0: 댓글, 1: 대댓글
  deleted: boolean;
  hidden: boolean;
  createdAt: string;            // Instant → ISO 8601 string
  replies: ReplyResDto[] | null; // 대댓글 목록. null 가능 — 사용 측에서 replies ?? [] 처리
}

/**
 * POST ??? — 댓글 작성 요청 DTO
 * TODO: 백엔드 댓글 작성 API 규격 확정 후 구현
 *   - 엔드포인트 경로 확인
 *   - 요청 필드: content 외 필요한 필드 확인
 *   - 인증 필요 여부 (현재 isLoggedIn 기반 UI만 구현)
 *   - 대댓글 작성 시 parentId 등 필드 여부 확인 (조회 응답에는 parentId 없음)
 */
// export interface CreateReplyReqDto { content: string; } // 미확정 — 구현 보류
