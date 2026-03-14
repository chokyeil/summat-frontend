export interface JwtPayload {
  sub?: string;
  roles?: string[];
  exp?: number;
  iat?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

/** POST /summatUsers/signup — 최종 회원가입 요청 DTO (필드명 백엔드 규격 준수) */
export interface SignupRequest {
  email: string;
  userPw: string;
  userNickName: string;
  signupToken: string;
}

/** POST /auth/email/send — 인증번호 발송 요청 */
export interface EmailSendRequest {
  email: string;
  purpose: 'SIGNUP';
}

/** POST /auth/email/verify — 인증번호 검증 요청 */
export interface EmailVerifyRequest {
  email: string;
  code: string;
  purpose: 'SIGNUP';
}

/** POST /auth/email/verify — 성공 시 data 필드 (signupToken 1회성) */
export interface EmailVerifyResData {
  signupToken: string;
}

export interface ApiResponse<T = unknown> {
  code: number; // 백엔드 응답 예: "code": 200
  httpStatus: string;
  message: string;
  data: T;
}

export interface LoginResponseData {
  accessToken: string;
  tokenType: string;
  refreshToken: string;
}
