/** GET /mypage/me — 현재 로그인 사용자 정보 */
export interface MeResDto {
  id: number;       // 권한 비교 기준 (reply.userId === me.id)
  userId: string;   // 이메일 형식 로그인 ID
  nickName: string;
  createdAt: string;
}

/** GET /mypage/replies — 내가 쓴 댓글/대댓글 item */
export interface MyReplyResDto {
  replyId: number;
  placeId: number;
  placeName: string;
  content: string;    // deleted: true 시 서버에서 "삭제된 댓글입니다." 치환
  depth: number;      // 0: 댓글, 1: 대댓글 (평면 배열 — 트리 구조 아님)
  deleted: boolean;
  hidden: boolean;
  createdAt: string;
}

// ============================================================
// mock 전용 타입 — API 연동 완료 후 삭제 예정
// ============================================================

/** @deprecated mock 전용 — MyPage 연동 완료로 실사용 없음 */
export interface UserProfileDto {
  nickname: string;
  email: string;
  bio?: string;
}

/** @deprecated mock 전용 — MyPage 연동 완료로 실사용 없음 */
export interface MyCommentDto {
  id: number;
  placeName: string;
  content: string;
}
