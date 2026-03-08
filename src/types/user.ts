// TODO: 백엔드 유저 프로필 응답 DTO 확인 후 수정
export interface UserProfileDto {
  nickname: string;
  email: string;
  bio?: string;
}

// TODO: 백엔드 마이 댓글 응답 DTO 확인 후 수정 (placeId 추가 시 Link 연결 가능)
export interface MyCommentDto {
  id: number;
  placeName: string;
  content: string;
}
