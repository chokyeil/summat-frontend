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

export interface SignupRequest {
  email: string;
  nickname: string;
  password: string;
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
