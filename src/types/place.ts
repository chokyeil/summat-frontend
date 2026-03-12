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
  liked: boolean; // 현재 로그인 사용자의 좋아요 여부. 비로그인 시 false 고정.
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
  liked: boolean; // 현재 로그인 사용자의 좋아요 여부. 비로그인 시 false 고정.
  // authorId: 현재 백엔드 응답에 포함되지 않음 — 작성자 판별 기능은 추후 별도 API 확인 필요
}

/** POST /places/like/{placeId} — 좋아요 토글 응답 */
export interface TogglePlaceLikeResDto {
  liked: boolean;
  likeCount: number;
}

/** POST /places/view/{placeId} — 조회수 증가 응답 */
export interface IncreasePlaceViewResDto {
  viewCount: number;
}

/** GET /mypage/liked-places — 좋아요한 장소 item. createdAt은 좋아요 날짜가 아닌 장소 등록일. */
export interface LikedPlaceResDto {
  placeId: number;
  placeName: string;
  imageUrl: string;
  summary: string;
  category: string;
  region: string;
  liked: boolean;   // 사실상 true로 고정. 응답 그대로 사용.
  likeCount: number;
  createdAt: string; // 장소 등록일 (좋아요 날짜 아님)
}

/** GET /mypage/places — 내가 등록한 장소 아이템. tags/likeCount/viewCount 없음. */
export interface MyPlaceItemResDto {
  placeId: number;
  placeName: string;
  imageUrl: string;
  summary: string;
  category: string;
  region: string;
  createdAt: string;
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
 * POST /reply/{placeId} — 댓글/대댓글 작성 요청 DTO
 * parentId: null → 일반 댓글, number → 대댓글 (depth=0 댓글의 id)
 * 대댓글(depth=1)에 대댓글 작성 불가 — UI에서 depth 체크로 차단
 */
export interface CreateReplyReqDto {
  content: string;
  parentId: number | null;
}

/**
 * PUT /reply/{replyId} — 댓글 수정 요청 DTO
 * 본인 댓글만 수정 가능. deleted 댓글은 수정 불가.
 */
export interface UpdateReplyReqDto {
  content: string;
}
